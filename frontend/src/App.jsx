import React, { useState, useRef, useEffect } from "react";

/* =============== data =============== */
const navItems = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "API", href: "#api" },
  { label: "Dashboard", href: "#dashboard" },
];

const features = [
  { title: "Semantic Analysis", desc: "Analyze text and screenshots to surface social-engineering patterns and risky intents." },
  { title: "Phone Number Intelligence", desc: "Search reports about scammer numbers with evidence and frequency counts." },
  { title: "Bank Account Verification", desc: "Check account details against known fraudulent records with real-time signals." },
  { title: "Phishing Link Detection", desc: "Flag malicious URLs, fake websites, and credential traps before users click." },
  { title: "Malware File Scanner", desc: "Detect malware and trojans quickly to stop damage early." },
  { title: "Business API Integration", desc: "Embed fraud checks into your product with a stable, rate-limited API." },
];

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    features: ["Basic fraud checks", "Educational resources", "Community support"],
    cta: { label: "Get started free", variant: "outline" },
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    features: ["Verification badge", "Bulk fraud checks", "Real-time alerts", "Simple dashboard"],
    cta: { label: "Start Pro trial", variant: "solid" },
    highlight: true,
    badge: "Most popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Full API access", "SLA guarantee", "Advanced analytics", "White-label solution"],
    cta: { label: "Contact sales", variant: "outline" },
    highlight: false,
  },
];

/* =============== header =============== */
function Header({ onToggleMenu }) {
  return (
    // 화면 상단 고정
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ✨ 아주 얇은 테두리 + 살짝 반투명 + 약한 블러 */}
        <div
          className="
            mt-2 h-14 px-4 sm:px-6
            flex items-center justify-between
            rounded-2xl
            border border-white/35
            bg-white/30 supports-[backdrop-filter]:bg-white/20
            backdrop-blur-md
            shadow-[0_8px_20px_rgba(2,6,23,0.04)]
          "
        >
          {/* 로고 */}
          <a href="/" className="inline-flex items-center gap-2">
            <span className="inline-block h-5 w-5 rounded-md bg-sky-600" />
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              FraudGuard
            </span>
          </a>

          {/* 가운데 네비 */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="text-slate-900/75 hover:text-slate-900 font-medium"
              >
                {n.label}
              </a>
            ))}
          </nav>

          {/* 우측 액션 */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="#login"
              className="px-3 py-2 text-sm font-semibold text-slate-900/80 hover:text-slate-900"
            >
              Log in
            </a>

            <a
              href="#sales"
              className="px-3.5 py-2 rounded-full text-sm font-semibold
                         bg-white/60 border border-white/40 text-slate-900
                         hover:bg-white/75 backdrop-blur"
            >
              Talk to sales
            </a>

            <a
              href="#try"
              className="px-4 py-2 rounded-full text-sm font-bold
                         bg-blue-600 text-white hover:bg-blue-700
                         shadow-[0_6px_20px_rgba(37,99,235,0.22)]
                         ring-1 ring-blue-500/20"
            >
              Try for free
            </a>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={onToggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-xl
                       border border-white/35 bg-white/40 backdrop-blur
                       text-slate-900"
            aria-label="Toggle menu"
          >
            <span className="sr-only">Open menu</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}







function MobileMenu({ open }) {
  return (
    <nav
      className={`md:hidden transition-all duration-200 overflow-hidden
                  ${open ? "max-h-96" : "max-h-0"}`}
      aria-hidden={!open}
    >
      {/* 반투명 + 블러 패널 */}
      <div className="mx-4 sm:mx-6 -mt-2 mb-2 rounded-2xl border border-white/30
                      bg-white/70 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)]">
        <div className="px-4 py-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {navItems.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="text-slate-800 font-medium px-3 py-2 rounded-lg hover:bg-white"
              >
                {n.label}
              </a>
            ))}
          </div>

          <div className="h-px bg-slate-200/70 my-2" />

          <a
            href="#login"
            className="px-3 py-2 rounded-lg text-slate-700 hover:bg-white font-semibold"
          >
            Log in
          </a>

          <div className="flex gap-2 pt-1">
            <a
              href="#sales"
              className="flex-1 px-3.5 py-2 rounded-full text-sm font-semibold
                         bg-white/80 border border-slate-200 text-slate-800
                         hover:bg-white text-center"
            >
              Talk to sales
            </a>
            <a
              href="#try"
              className="flex-1 px-4 py-2 rounded-full text-sm font-bold
                         bg-blue-600 text-white hover:bg-blue-700
                         shadow-[0_6px_20px_rgba(37,99,235,0.25)] ring-1 ring-blue-500/20 text-center"
            >
              Try for free
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}


/* =============== hero =============== */
function Hero() {
  // chip selection (for UI highlight only)
  const [mode, setMode] = useState("semantic");
  // message to send to WhatsApp
  const [query, setQuery] = useState("");

  // --- Auto-grow textarea ---
  const textRef = useRef(null);
  const autoGrow = (el) => {
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 240) + "px"; // up to 240px
  };
  useEffect(() => {
    autoGrow(textRef.current);
  }, [query]);

  // Example prompts (filled when chips are clicked)
  const examplePrompts = {
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

  // WhatsApp deep link + fallback to wa.me
  const openWhatsApp = () => {
    const text = query.trim();
    if (!text) return;

    const phone = (import.meta.env.VITE_WA_PHONE || "").replace(/\D/g, "");
    const shortLink = (import.meta.env.VITE_WA_LINK || "").trim();

    const deepLink = phone
      ? `whatsapp://send?phone=${phone}&text=${encodeURIComponent(text)}`
      : `whatsapp://send?text=${encodeURIComponent(text)}`;

    const webLink =
      shortLink ||
      (phone
        ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
        : `https://wa.me/?text=${encodeURIComponent(text)}`);

    let opened = false;
    try {
      const w = window.open(deepLink, "_blank", "noopener,noreferrer");
      if (w) opened = true;
    } catch {}
    setTimeout(() => {
      if (!opened) window.open(webLink, "_blank", "noopener,noreferrer");
    }, 400);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    openWhatsApp();
  };

  // Fill textarea with an example when a chip is clicked
  const fillExample = (key) => {
    setMode(key);
    const text = examplePrompts[key] || "";
    setQuery(text);
    requestAnimationFrame(() => autoGrow(textRef.current));
  };

  return (
    <section
      className="
        relative isolate overflow-hidden
        bg-gradient-to-b from-sky-300 via-sky-100 to-white
        min-h-[100svh] flex items-center py-0
      "
    >
      {/* soft highlight lifted upward so gradient reaches under header */}
      <div
        className="
          pointer-events-none absolute inset-0
          [mask-image:radial-gradient(60%_60%_at_50%_-30%,#000_40%,transparent_100%)]
          bg-[radial-gradient(80%_60%_at_50%_-50%,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0)_60%)]
        "
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="w-full text-center">
          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight text-slate-900">
            Meet your first AI fraud detective
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base sm:text-lg text-slate-800/85">
            Detect, analyze, and prevent fraud with a clean, fast, and privacy-friendly toolkit.
          </p>

          {/* Lindy-style prompt card */}
          <form
            onSubmit={onSubmit}
            className="
              relative mx-auto mt-8 w-full max-w-4xl
              rounded-[22px] bg-white ring-1 ring-black/5
              shadow-[0_10px_30px_rgba(17,24,39,0.08),0_25px_60px_rgba(253,216,155,0.18)]
              p-4 sm:p-5
            "
            aria-label="Fraud analysis input"
          >
            <div className="relative">
              {/* 아이콘 위치를 살짝 오른쪽/아래로 */}
              <span className="pointer-events-none absolute left-3 top-3 text-slate-400">
                🔍
              </span>

              <textarea
                ref={textRef}
                rows={3}
                className="
                  block w-full resize-none bg-transparent outline-none
                  text-[15px] sm:text-[16px] leading-6 sm:leading-7
                  placeholder:text-slate-400 text-slate-900
                  rounded-xl pr-16 pl-12 sm:pl-14 py-2.5   /* <- pl-8 을 pl-12 / sm:pl-14 로 변경 */
                  min-h-[100px] sm:min-h-[100px]
                "
                placeholder="How can I help? Describe your agent and I’ll build it."
                aria-label="Describe a suspicious item"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  autoGrow(e.target);
                }}
              />

              {/* 전송 버튼 그대로 */}
              <button
                type="submit"
                className="
                  absolute right-1.5 bottom-1.5
                  inline-flex h-10 w-10 items-center justify-center
                  rounded-full bg-[#88A8FF] text-white shadow-md
                  hover:brightness-105 active:brightness-95 transition
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
                aria-label="Send"
                disabled={!query.trim()}
                title={!query.trim() ? 'Enter some text first' : 'Open WhatsApp'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="translate-y-[1px]">
                  <path d="M12 5l6 6M12 5L6 11M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

          </form>

          <p className="mt-2 text-sm text-slate-800/80 italic">
            * Analyze button will open up FraudGuard&apos;s Whatsapp Chatbot
          </p>

          {/* Example chips (fill textarea with prompts) */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              { key: "semantic", label: "Semantic analysis" },
              { key: "phone", label: "Phone number reports" },
              { key: "bank", label: "Bank account verification" },
              { key: "phish", label: "Phishing link detector" },
              { key: "malware", label: "Malware file scanner" },
              { key: "api", label: "Business API" },
            ].map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => fillExample(c.key)}
                className={`px-3.5 py-2 rounded-full border text-sm font-semibold transition-colors shadow-sm ${
                  mode === c.key
                    ? "bg-sky-700 border-sky-700 text-white"
                    : "bg-white/80 border-white/70 text-slate-900 hover:bg-white"
                }`}
                aria-pressed={mode === c.key}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



/* =============== features (2번째: 풀스크린 유지) =============== */
function Features() {
  return (
    <section id="features" className="bg-white min-h-screen flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="w-full text-center">
          <h2 className="text-4xl font-extrabold">Comprehensive fraud protection</h2>
          <p className="text-slate-600 mt-2">
            AI technology to identify and prevent fraud across multiple channels
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <article key={f.title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-extrabold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============== cta (자연스러운 높이로 축소) =============== */
function CTA() {
  return (
    <section className="bg-[#f1faff] border-y border-slate-200 text-center py-16 sm:py-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-4xl font-extrabold">Ready to protect against fraud?</h2>
        <p className="text-slate-600 mt-2">Join thousands already protected by FraudGuard.</p>
        <div className="flex justify-center gap-3 mt-8">
          <a href="#try" className="px-6 py-3 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold">
            Start free trial
          </a>
          <a href="#demo" className="px-6 py-3 rounded-full border border-slate-200 font-bold">
            Schedule demo
          </a>
        </div>
      </div>
    </section>
  );
}

/* =============== pricing (자연스러운 높이로 축소) =============== */
function Pricing() {
  return (
    <section id="pricing" className="bg-white py-16 sm:py-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* 왼쪽 정렬로 변경 */}
        <div className="text-left">
          <h2 className="text-4xl font-extrabold">Choose your protection level</h2>
          <p className="text-slate-600 mt-2">
            From individual use to enterprise-grade security
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`relative bg-white rounded-2xl p-6 shadow-sm border
                  ${t.highlight ? "border-sky-400 ring-1 ring-sky-200" : "border-slate-200"}`}
              >
                {t.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-extrabold bg-sky-600 text-white rounded-full px-3 py-1">
                    {t.badge}
                  </div>
                )}

                {/* 헤더(이름 + 가격) */}
                <div className="flex items-start justify-between">
                  <div className="font-extrabold text-2xl text-slate-900">
                    {t.name}
                  </div>

                  {/* 가격 크기 한 단계 축소 */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                      {t.price}
                    </span>
                    {t.period && (
                      <span className="text-base sm:text-lg font-semibold text-slate-500">
                        {t.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* 기능 목록 */}
                <ul className="list-disc pl-5 mt-4 text-slate-700 space-y-2">
                  {t.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                {/* CTA 버튼 */}
                <a
                  href="#go"
                  className={`mt-6 inline-flex w-full justify-center px-4 py-3 rounded-full font-bold transition
                    ${t.cta.variant === "solid"
                      ? "bg-sky-600 hover:bg-sky-700 text-white"
                      : "border border-slate-200 hover:bg-slate-50"}`}
                >
                  {t.cta.label}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



/* =============== footer =============== */
function FooterLink({ label }) {
  return (
    <a href="#" className="block text-slate-800/80 hover:text-slate-900 mb-1">
      {label}
    </a>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <div className="font-extrabold">FraudGuard</div>
          <p className="text-slate-600 mt-1">
            AI-powered fraud detection to protect businesses and individuals from online threats.
          </p>
        </div>
        <div>
          <h4 className="font-extrabold mb-2">Product</h4>
          <FooterLink label="Features" />
          <FooterLink label="API" />
          <FooterLink label="Dashboard" />
          <FooterLink label="Pricing" />
        </div>
        <div>
          <h4 className="font-extrabold mb-2">Company</h4>
          <FooterLink label="About" />
          <FooterLink label="Blog" />
          <FooterLink label="Careers" />
          <FooterLink label="Contact" />
        </div>
        <div>
          <h4 className="font-extrabold mb-2">Support</h4>
          <FooterLink label="Help Center" />
          <FooterLink label="Documentation" />
          <FooterLink label="Status" />
          <FooterLink label="Privacy" />
        </div>
      </div>
      <div className="text-center text-slate-600 text-sm py-4 border-t border-slate-200">
        © 2025 FraudGuard. All rights reserved.
      </div>
    </footer>
  );
}

/* =============== app =============== */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* top notice */}
      {/* <div className="bg-[#eaf6ff] border-b border-slate-200 text-center text-sm font-bold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-2">
          <span>Introducing FraudGuard API — Available Now</span>
          <a href="#api" className="text-sky-700 hover:underline">
            Try now →
          </a>
        </div>
      </div> */}

      <Header onToggleMenu={() => setMenuOpen((v) => !v)} />
      <MobileMenu open={menuOpen} />

      {/* 자연스러운 스크롤 */}
      <main>
        <Hero />
        <Features />
        <CTA />
        <Pricing />
      </main>

      <Footer />
    </div>
  );
}
