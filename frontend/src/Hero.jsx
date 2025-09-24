import React, { useEffect, useRef, useState } from "react";

export default function Hero() {
  /* ---------- state ---------- */
  const [mode, setMode] = useState("semantic");
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! Paste a suspicious message, phone number, or link and I’ll analyze whether it’s a scam.\n\n💡 You can also click one of the example buttons below to get started.",
    },
  ]);

  /* ---------- examples ---------- */
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

  /* ---------- object URL lifecycle ---------- */
  const createdUrlsRef = useRef(new Set());

  useEffect(() => {
    if (!file) {
      if (previewURL) URL.revokeObjectURL(previewURL);
      setPreviewURL("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewURL(url);
    return () => URL.revokeObjectURL(url);
  }, [file]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
      createdUrlsRef.current.clear();
    };
  }, []);

  /* ---------- n8n endpoints ---------- */
  const N8N_TEXT_GET =
    import.meta.env.VITE_N8N_WEBHOOK_URL ||
    "https://n8n.vtriadi.site/webhook/b2a306fa-3a35-4c34-8009-1ee5b4130761";

  const N8N_IMAGE_POST =
    import.meta.env.VITE_N8N_IMAGE_WEBHOOK_URL ||
    "https://n8n.vtriadi.site/webhook/b4cba643-d1b2-46dd-a467-e08b19eb0b5e";

  /* ---------- calls ---------- */
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
      if (typeof data?.reply === "string" && data.reply.trim()) return data.reply;
      if (typeof data?.output === "string" && data.output.trim()) return data.output;
      return JSON.stringify(data, null, 2);
    }
    return await res.text();
  };

  const callN8nPostImage = async (imageFile) => {
    const fd = new FormData();
    fd.append("image", imageFile, imageFile.name); // Function node expects binary.image
    const res = await fetch(N8N_IMAGE_POST, { method: "POST", body: fd, mode: "cors" });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}${txt ? ` • ${txt}` : ""}`);
    }
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await res.json().catch(() => ({}));
      if (typeof data?.reply === "string" && data.reply.trim()) return data.reply;
      if (typeof data?.output === "string" && data.output.trim()) return data.output;
      return JSON.stringify(data, null, 2);
    }
    return await res.text();
  };

  /* ---------- send ---------- */
  const sendText = async (text) => {
    if (!text.trim() || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: text.trim() }]);
    setInput("");
    setLoading(true);

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

    const bubbleUrl = URL.createObjectURL(imageFile);
    createdUrlsRef.current.add(bubbleUrl);

    setMessages((prev) => [
      ...prev,
      { role: "user", type: "image", url: bubbleUrl, name: imageFile.name, size: imageFile.size },
    ]);

    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    setLoading(true);
    const typingId = Symbol("typing");
    setMessages((prev) => [...prev, { role: "assistant", typing: true, id: typingId }]);

    try {
      const out = await callN8nPostImage(imageFile);
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
    if (file) return sendImage(file);
    return sendText(input);
  };

  /* ---------- autoscroll ---------- */
  const listRef = useRef(null);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  /* ---------- file pick/clear ---------- */
  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      alert("Please select an image file.");
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
  const canSend = !loading && (file || input.trim());

  return (
    <section
      className="
        relative isolate overflow-hidden
        bg-gradient-to-b from-sky-300 via-sky-100 to-white
        min-h-[100svh]
        pt-24 sm:pt-32
        pb-8 sm:pb-12
        flex items-start sm:items-center
        scroll-mt-24
      "
    >
      {/* background highlight */}
      <div
        className="
          pointer-events-none absolute inset-0
          [mask-image:radial-gradient(60%_60%_at_50%_-30%,#000_40%,transparent_100%)]
          bg-[radial-gradient(80%_60%_at_50%_-50%,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0)_60%)]
        "
      />

      {/* scrollbar style */}
      <style>{`
        .nice-scrollbar { scrollbar-width: thin; scrollbar-color: #c7d2fe #f8fafc; }
        .nice-scrollbar::-webkit-scrollbar { width: 10px; }
        .nice-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 9999px; }
        .nice-scrollbar::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 9999px; border: 3px solid #f8fafc; }
        .nice-scrollbar::-webkit-scrollbar-thumb:hover { background: #a5b4fc; }
      `}</style>

      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6">
        {/* title */}
        <div className="text-center">
          <h1 className="mt-2 sm:mt-6 text-[30px] sm:text-6xl font-black tracking-tight text-slate-900">
            Your AI Fraud Detective
          </h1>
          <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-[15px] sm:text-base text-slate-800/85">
            Ask about suspicious messages, numbers, links, or files. I’ll help you decide if it’s a scam.
          </p>
        </div>

        {/* chat card */}
        <div
          className="
            relative mx-auto mt-7 sm:mt-9 w-full max-w-4xl
            rounded-[22px]
            bg-white/90 supports-[backdrop-filter]:bg-white/70 backdrop-blur
            ring-1 ring-black/5
            shadow-[0_10px_30px_rgba(17,24,39,0.08),0_25px_60px_rgba(253,216,155,0.18)]
            overflow-hidden
          "
        >
          {/* messages */}
          <div
            ref={listRef}
            className="
              nice-scrollbar
              max-h-[52vh] sm:max-h-[60vh]
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
                  {!isUser && (
                    <div className="mr-2 mt-0.5 hidden sm:block">
                      <div className="h-8 w-8 rounded-full bg-sky-600 text-white grid place-items-center text-xs font-bold">
                        FG
                      </div>
                    </div>
                  )}

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

          {/* input bar */}
          <form onSubmit={onSubmit} className="border-t border-slate-200/80">
            <div className="p-3 sm:p-4 space-y-3">
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

              <div className="flex items-center gap-2">
                {/* + attach button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm"
                  title="Attach image"
                  aria-label="Attach image"
                >
                  <span className="text-xl leading-none">+</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickFile}
                />

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
                      ? "An image is attached — the next message will send the image."
                      : "Type your message… (Shift+Enter for a new line)"
                  }
                />

                {/* Send button (deeper blue when sendable) */}
                <button
                  type="submit"
                  disabled={!canSend}
                  className={[
                    "inline-flex h-11 px-5 items-center justify-center rounded-full font-semibold transition",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                    canSend
                      ? "bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800 shadow-[0_8px_24px_rgba(2,132,199,0.28)]"
                      : "bg-sky-300 text-white"
                  ].join(" ")}
                  title={file ? "Send image" : "Send message"}
                  aria-label="Send"
                >
                  {loading ? "…" : "Send"}
                </button>
              </div>

              <p className="text-xs text-slate-500 text-right">
                {loading
                  ? "Uploading/Analyzing… this may take up to ~30 seconds."
                  : "Responses may take up to ~30 seconds."}
              </p>
            </div>
          </form>
        </div>

        {/* hint above examples */}
        <p className="mt-3 text-center text-sm text-slate-600">
          💡 New here? Click an <span className="font-semibold">example button</span> below to get started.
        </p>

        {/* example chips */}
        <div className="mt-3 flex flex-wrap justify-center gap-2">
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
                ${
                  mode === c.key
                    ? "bg-sky-700 border-sky-700 text-white"
                    : "bg-white/80 border-white/70 text-slate-900 hover:bg-white"
                }
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
