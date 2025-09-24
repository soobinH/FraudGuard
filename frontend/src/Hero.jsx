import React, { useEffect, useRef, useState } from "react";

export default function Hero() {
  /* ---------- 상태 ---------- */
  const [mode, setMode] = useState("semantic");     // 예시 칩 하이라이트용
  const [input, setInput] = useState("");           // 텍스트 입력
  const [file, setFile] = useState(null);           // 첨부 이미지(1개)
  const [previewURL, setPreviewURL] = useState(""); // 현재 선택한 이미지 미리보기
  const fileInputRef = useRef(null);                // 같은 파일 재선택 가능하게 리셋용
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! Paste a suspicious message, phone number or link and I’ll analyze whether it’s a scam.",
    },
  ]);

  /* ---------- 예시 프롬프트 ---------- */
  const examples = {
    semantic:
      "I got this email saying my account will be closed unless I click a link and verify my information. Is this a scam?",
    phone:
      "This phone number +1 (347) 555-0199 keeps calling and asking for my bank details. Is it a scam?",
    bank:
      "Someone asked me to transfer a ‘refundable deposit’ to this bank account: 123-456-789. Could this be a scam?",
    phish:
      "Is this URL safe or a phishing attempt? http://bit.ly/secure-account-verify",
    malware:
      "A stranger sent me a file named invoice_update.apk and told me to install it to view the invoice. Is it malware?",
    api:
      "A vendor wants API access and asked me to paste my API key into a Google Form. Is that a scam practice?",
  };
  const fillExample = (key) => {
    setMode(key);
    setInput(examples[key] || "");
  };

  /* ---------- 썸네일 & URL 메모리 관리 ---------- */
  // 여러 이미지 메시지에서 생성한 object URL들을 모아 두었다가 컴포넌트 unmount 시 정리
  const createdUrlsRef = useRef(new Set());

  useEffect(() => {
    if (!file) {
      if (previewURL) URL.revokeObjectURL(previewURL);
      setPreviewURL("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewURL(url);
    // 현재 미리보기 URL은 전송 전에만 사용하므로 여기선 정리
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    return () => {
      // 언마운트 시 지금까지 만든 모든 object URL 정리
      createdUrlsRef.current.forEach((u) => {
        try { URL.revokeObjectURL(u); } catch {}
      });
      createdUrlsRef.current.clear();
    };
  }, []);

  /* ---------- n8n 엔드포인트 ---------- */
  // 텍스트 GET (서버에서 CORS 허용 필요)
  const N8N_TEXT_GET =
    import.meta.env.VITE_N8N_WEBHOOK_URL ||
    "https://n8n.vtriadi.site/webhook/b2a306fa-3a35-4c34-8009-1ee5b4130761";

  // 이미지 POST (Function 노드에서 binary.image 사용)
  const N8N_IMAGE_POST =
    "https://n8n.vtriadi.site/webhook/b4cba643-d1b2-46dd-a467-e08b19eb0b5e";

  /* ---------- 호출 함수들 ---------- */
  // 텍스트: GET ?chatinput=...
  const callN8nGet = async (message) => {
    const url = `${N8N_TEXT_GET}?${new URLSearchParams({ chatinput: message })}`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}${txt ? ` • ${txt}` : ""}`);
    }
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await res.json().catch(() => ({}));
      // 응답은 텍스트처럼 보여줄 것이므로 reply > output > stringify 순으로 변환
      if (typeof data?.reply === "string" && data.reply.trim()) return data.reply;
      if (typeof data?.output === "string" && data.output.trim()) return data.output;
      return JSON.stringify(data, null, 2);
    }
    return await res.text();
  };

  // 이미지: POST multipart/form-data (키: image) → 결과는 "텍스트"로 반환받아 채팅에 표시
  const callN8nPostImage = async (imageFile) => {
    const fd = new FormData();
    fd.append("image", imageFile, imageFile.name);

    const res = await fetch(N8N_IMAGE_POST, {
      method: "POST",
      body: fd,
      mode: "cors",
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}${txt ? ` • ${txt}` : ""}`);
    }

    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await res.json().catch(() => ({}));
      // 서버에서 결과 텍스트를 reply/output로 내려준다면 우선 사용
      if (typeof data?.reply === "string" && data.reply.trim()) return data.reply;
      if (typeof data?.output === "string" && data.output.trim()) return data.output;
      // 아니면 JSON을 문자열로
      return JSON.stringify(data, null, 2);
    }
    // text/plain 등은 그대로
    return await res.text();
  };

  /* ---------- 전송 ---------- */
  const sendText = async (text) => {
    if (!text.trim() || loading) return;

    // 유저 텍스트 메시지 표시
    setMessages((prev) => [...prev, { role: "user", content: text.trim() }]);
    setInput("");
    setLoading(true);

    // 타이핑 버블
    const typingId = Symbol("typing");
    setMessages((prev) => [...prev, { role: "assistant", typing: true, id: typingId }]);

    try {
      const out = await callN8nGet(text.trim());
      setMessages((prev) =>
        prev.map((m) => (m.id === typingId ? { role: "assistant", content: out } : m))
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? {
                role: "assistant",
                error: true,
                content:
                  "Sorry, I couldn’t reach the analyzer. If this keeps happening, check the webhook URL and CORS.",
              }
            : m
        )
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendImage = async (imageFile) => {
    if (!imageFile || loading) return;

    // 이 메시지에서 사용할 전용 object URL (전송 후에도 채팅에 썸네일 유지)
    const bubbleUrl = URL.createObjectURL(imageFile);
    createdUrlsRef.current.add(bubbleUrl);

    // 유저 이미지 메시지를 "썸네일"로 버블에 표시
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        type: "image",
        url: bubbleUrl,
        name: imageFile.name,
        size: imageFile.size,
      },
    ]);

    // 다음 메시지에 자동으로 첨부되지 않도록 즉시 초기화
    setFile(null);
    // 같은 파일을 다시 선택해도 onChange가 동작하도록 input value 리셋
    if (fileInputRef.current) fileInputRef.current.value = "";

    setLoading(true);
    const typingId = Symbol("typing");
    setMessages((prev) => [...prev, { role: "assistant", typing: true, id: typingId }]);

    try {
      const out = await callN8nPostImage(imageFile);
      // 서버 결과를 텍스트로 동일하게 표시
      setMessages((prev) =>
        prev.map((m) => (m.id === typingId ? { role: "assistant", content: out } : m))
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? { role: "assistant", error: true, content: "Upload failed. Please try again." }
            : m
        )
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (file) return sendImage(file);   // 파일 있으면 이미지만 전송
    return sendText(input);             // 없으면 텍스트 전송
  };

  /* ---------- 자동 스크롤 ---------- */
  const listRef = useRef(null);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  /* ---------- 파일 선택/삭제 ---------- */
  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      alert("Please select an image file.");
      // 같은 파일 재선택 대비 리셋
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFile(f);
  };
  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fmtKB = (b) => `${Math.round(b / 102.4) / 10} KB`;

  /* ---------- UI ---------- */
  return (
    <section
      className="
        relative isolate overflow-hidden
        bg-gradient-to-b from-sky-300 via-sky-100 to-white
        min-h-[100svh] py-0 flex items-center
      "
    >
      {/* 배경 하이라이트 */}
      <div
        className="
          pointer-events-none absolute inset-0
          [mask-image:radial-gradient(60%_60%_at_50%_-30%,#000_40%,transparent_100%)]
          bg-[radial-gradient(80%_60%_at_50%_-50%,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0)_60%)]
        "
      />

      {/* 스크롤바 스타일 */}
      <style>{`
        .nice-scrollbar { scrollbar-width: thin; scrollbar-color: #c7d2fe #f8fafc; }
        .nice-scrollbar::-webkit-scrollbar { width: 10px; }
        .nice-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 9999px; }
        .nice-scrollbar::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 9999px; border: 3px solid #f8fafc; }
        .nice-scrollbar::-webkit-scrollbar-thumb:hover { background: #a5b4fc; }
      `}</style>

      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6">
        {/* 타이틀 */}
        <div className="text-center">
          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight text-slate-900">
            Your AI fraud detective
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-800/85">
            Ask about suspicious messages, numbers, links, or files. I’ll help you decide if it’s a scam.
          </p>
        </div>

        {/* Chat 카드 */}
        <div
          className="
            relative mx-auto mt-8 w-full max-w-4xl
            rounded-[22px] bg-white ring-1 ring-black/5
            shadow-[0_10px_30px_rgba(17,24,39,0.08),0_25px_60px_rgba(253,216,155,0.18)]
            overflow-hidden
          "
        >
          {/* 메시지 리스트 */}
          <div
            ref={listRef}
            className="
              nice-scrollbar
              max-h-[48vh] sm:max-h-[56vh]
              overflow-y-auto px-4 sm:px-5 py-4 space-y-4 scroll-smooth
            "
          >
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              const isError = m.error;
              const isTyping = m.typing;
              const isImage = m.type === "image";

              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  {/* 어시스턴트 아바타 */}
                  {!isUser && (
                    <div className="mr-2 mt-0.5 hidden sm:block">
                      <div className="h-8 w-8 rounded-full bg-sky-600 text-white grid place-items-center text-xs font-bold">
                        FG
                      </div>
                    </div>
                  )}

                  {/* 버블 */}
                  <div
                    className={[
                      "max-w-[82%] sm:max-w-[75%] rounded-2xl px-3 py-2.5 text-[15px] leading-6",
                      isUser
                        ? "bg-sky-600 text-white rounded-br-sm"
                        : isError
                        ? "bg-red-50 text-red-800 border border-red-200"
                        : "bg-slate-50 text-slate-900 border border-slate-200",
                    ].join(" ")}
                  >
                    {isTyping ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                      </span>
                    ) : isImage ? (
                      <div>
                        <div className="rounded-lg overflow-hidden ring-1 ring-slate-200 mb-2 bg-white">
                          {/* 보낸 이미지 썸네일 */}
                          <img
                            src={m.url}
                            alt={m.name || "image"}
                            className="max-h-64 object-contain bg-white"
                          />
                        </div>
                        <div className={isUser ? "opacity-90 text-white/90" : "text-slate-600"}>
                          {m.name} • {fmtKB(m.size)}
                        </div>
                      </div>
                    ) : typeof m.content === "string" ? (
                      <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
                    ) : (
                      <pre className="overflow-auto">{JSON.stringify(m.content, null, 2)}</pre>
                    )}
                  </div>

                  {/* 유저 아바타 */}
                  {isUser && (
                    <div className="ml-2 mt-0.5 hidden sm:block">
                      <div className="h-8 w-8 rounded-full bg-slate-300 text-slate-700 grid place-items-center text-xs font-bold">
                        You
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 입력 바 */}
          <form onSubmit={onSubmit} className="border-t border-slate-200/80">
            <div className="p-3 sm:p-4 space-y-3">
              {/* 첨부 배지 (선택 시 표시) */}
              {file && (
                <div className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="h-8 w-8 rounded-md overflow-hidden bg-slate-200 ring-1 ring-slate-200">
                    {previewURL ? (
                      <img src={previewURL} alt="preview" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-slate-800 line-clamp-1">{file.name}</div>
                    <div className="text-slate-500 text-xs">{fmtKB(file.size)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-white"
                    title="Remove attachment"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* 입력 + 첨부 + 전송 */}
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white cursor-pointer">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onPickFile}
                  />
                  <span>📎 Attach</span>
                </label>

                <textarea
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSubmit(e);
                    }
                  }}
                  className="
                    flex-1 rounded-xl border border-slate-200
                    bg-slate-50 focus:bg-white outline-none
                    text-[15px] sm:text-[16px] leading-6 sm:leading-7
                    placeholder:text-slate-400 text-slate-900
                    px-3 py-2.5 ring-1 ring-transparent focus:ring-2 focus:ring-sky-400
                  "
                  placeholder={
                    file
                      ? "Image will be sent (text ignored while an image is attached)…"
                      : "Type your message… (Shift+Enter for new line)"
                  }
                />

                {/* 전송 버튼 (textarea 바깥) */}
                <button
                  type="submit"
                  disabled={loading || (!file && !input.trim())}
                  className="
                    inline-flex h-11 px-5 items-center justify-center
                    rounded-full bg-[#88A8FF] text-white font-semibold
                    shadow-md hover:brightness-105 active:brightness-95
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  title={file ? "Send image" : "Send message"}
                >
                  {loading ? "…" : "Send"}
                </button>
              </div>

              {/* 안내 문구 */}
              <p className="text-xs text-slate-500 text-right">
                {loading
                  ? "Uploading/Analyzing… this may take up to ~30 seconds."
                  : "Responses may take up to ~30 seconds."}
              </p>
            </div>
          </form>
        </div>

        {/* 예시 칩 */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {[
            { key: "semantic", label: "Email looks suspicious" },
            { key: "phone", label: "Phone number asks for bank info" },
            { key: "bank", label: "Refundable deposit request" },
            { key: "phish", label: "Is this URL phishing?" },
            { key: "malware", label: "APK file safe?" },
            { key: "api", label: "API key in Google Form" },
          ].map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => fillExample(c.key)}
              className={`
                px-3.5 py-2 rounded-full border text-sm font-semibold transition-colors shadow-sm
                ${mode === c.key
                  ? "bg-sky-700 border-sky-700 text-white"
                  : "bg-white/80 border-white/70 text-slate-900 hover:bg-white"}
              `}
              aria-pressed={mode === c.key}
              title="Fill example prompt"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
