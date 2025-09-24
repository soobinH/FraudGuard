import React, { useEffect, useRef, useState } from "react";

export default function Hero() {
  /* ---------- 상태 ---------- */
  const [mode, setMode] = useState("semantic");   // 칩 하이라이트용
  const [input, setInput] = useState("");         // 입력창
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

  /* ---------- n8n 호출 (GET, ?chatinput=...) ---------- */
  const N8N_BASE =
    import.meta.env.VITE_N8N_WEBHOOK_URL ||
    "https://n8n.vtriadi.site/webhook/b2a306fa-3a35-4c34-8009-1ee5b4130761";

  const callN8nGet = async (message) => {
    const url = `${N8N_BASE}?${new URLSearchParams({ chatinput: message })}`;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 60_000);

    try {
      const res = await fetch(url, { method: "GET", signal: ctrl.signal });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}${txt ? ` • ${txt}` : ""}`);
      }

      // JSON 응답이면 reply → output → 그 외 순으로 사용
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json().catch(() => ({}));
        if (typeof data?.reply === "string" && data.reply.trim()) return data.reply;
        if (typeof data?.output === "string" && data.output.trim()) return data.output;
        return JSON.stringify(data, null, 2);
      }

      // text/plain 등은 그대로
      return await res.text();
    } finally {
      clearTimeout(t);
    }
  };

  /* ---------- 전송 ---------- */
  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    // 유저 메시지 추가
    setMessages((prev) => [...prev, { role: "user", content: text.trim() }]);
    setInput("");
    setLoading(true);

    // 타이핑 자리(placeholder) 추가
    const typingId = Symbol("typing");
    setMessages((prev) => [...prev, { role: "assistant", typing: true, id: typingId }]);

    try {
      const out = await callN8nGet(text.trim());
      // 타이핑 버블을 실제 응답으로 교체
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId ? { role: "assistant", content: out } : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? {
                role: "assistant",
                content:
                  "Sorry, I couldn’t reach the analyzer. If this keeps happening, check the webhook URL and CORS.",
                error: true,
              }
            : m
        )
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- 입력 Submit ---------- */
  const onSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  /* ---------- 자동 스크롤 ---------- */
  const listRef = useRef(null);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  return (
    <section
      className="
        relative isolate overflow-hidden
        bg-gradient-to-b from-sky-300 via-sky-100 to-white
        min-h-[100svh] py-0
        flex items-center
      "
    >
      {/* 상단 하이라이트 */}
      <div
        className="
          pointer-events-none absolute inset-0
          [mask-image:radial-gradient(60%_60%_at_50%_-30%,#000_40%,transparent_100%)]
          bg-[radial-gradient(80%_60%_at_50%_-50%,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0)_60%)]
        "
      />

      {/* 스크롤바 스타일 (컨테이너 내부 전용) */}
      <style>{`
        .nice-scrollbar {
          scrollbar-width: thin;               /* Firefox */
          scrollbar-color: #c7d2fe #f8fafc;    /* thumb color / track color */
        }
        .nice-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .nice-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;                 /* slate-50 */
          border-radius: 9999px;
        }
        .nice-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;                 /* indigo-200-ish */
          border-radius: 9999px;
          border: 3px solid #f8fafc;
        }
        .nice-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a5b4fc;                 /* indigo-300-ish */
        }
      `}</style>

      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6">
        {/* 상단 타이틀 영역 */}
        <div className="text-center">
          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight text-slate-900">
            Your AI fraud detective
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-800/85">
            Ask about suspicious messages, numbers, links, or files. I’ll help you decide if it’s a scam.
          </p>
        </div>

        {/* Chat 컨테이너 */}
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

              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  {/* 아바타 (어시스턴트만) */}
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
                      "max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-[15px] leading-6",
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
                    ) : typeof m.content === "string" ? (
                      <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
                    ) : (
                      <pre className="overflow-auto">{JSON.stringify(m.content, null, 2)}</pre>
                    )}
                  </div>

                  {/* 아바타 (유저만) */}
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
            <div className="relative p-3 sm:p-4">
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                className="
                  block w-full resize-none bg-slate-50 focus:bg-white outline-none
                  text-[15px] sm:text-[16px] leading-6 sm:leading-7
                  placeholder:text-slate-400 text-slate-900
                  rounded-xl pr-20 pl-10 sm:pl-12 py-2.5
                  ring-1 ring-slate-200 focus:ring-2 focus:ring-sky-400
                "
                placeholder="Type your message… (Shift+Enter for new line)"
              />

              {/* 전송 버튼: 우측 '가운데'로 위치 */}
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="
                  absolute right-4 top-1/2 -translate-y-1/2
                inline-flex h-10 w-10 items-center justify-center
                rounded-full bg-[#88A8FF] text-white shadow-md
                hover:brightness-105 active:brightness-95 transition
                disabled:opacity-50 disabled:cursor-not-allowed
            "
                aria-label="Send"
                title={!input.trim() ? "Enter some text first" : "Send"}
              >
                {loading ? (
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                    <path d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="translate-y-[1px]">
                    <path
                      d="M12 5l6 6M12 5L6 11M12 5v14"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>

              {/* 안내 문구: 응답 지연 알림 */}
              <p className="mt-2 text-xs text-slate-500 text-right">
                {loading ? "Analyzing… this may take up to ~30 seconds." : "Responses may take up to ~30 seconds."}
              </p>
            </div>
          </form>
        </div>

        {/* 예시 칩 (ChatGPT Quick prompts 느낌) */}
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
