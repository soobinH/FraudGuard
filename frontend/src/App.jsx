import React, { useState } from "react";

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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="font-extrabold text-xl tracking-tight">FraudGuard</div>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((n) => (
            <a key={n.label} href={n.href} className="text-slate-700/70 hover:text-slate-900 font-semibold">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <a href="#sales" className="px-4 py-2 rounded-full border border-slate-200 text-slate-800 font-bold">
            Talk to sales
          </a>
          <a href="#try" className="px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold">
            Try for free
          </a>
        </div>
        <button
          onClick={onToggleMenu}
          className="md:hidden inline-flex flex-col gap-1.5 p-2 rounded-lg border border-slate-300"
          aria-label="Toggle menu"
        >
          <span className="w-5 h-0.5 bg-slate-900" />
          <span className="w-5 h-0.5 bg-slate-900" />
          <span className="w-5 h-0.5 bg-slate-900" />
        </button>
      </div>
    </header>
  );
}

function MobileMenu({ open }) {
  return (
    <nav
      className={`md:hidden transition-all duration-200 overflow-hidden bg-white border-b border-slate-200 ${
        open ? "max-h-96" : "max-h-0"
      }`}
      aria-hidden={!open}
    >
      <div className="px-4 py-3 flex flex-col gap-3">
        {navItems.map((n) => (
          <a key={n.label} href={n.href} className="text-slate-800 font-semibold">
            {n.label}
          </a>
        ))}
        <div className="flex gap-2 pt-1">
          <a href="#sales" className="px-4 py-2 rounded-full border border-slate-200 text-slate-800 font-bold w-full text-center">
            Talk to sales
          </a>
          <a href="#try" className="px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold w-full text-center">
            Try for free
          </a>
        </div>
      </div>
    </nav>
  );
}

/* =============== hero =============== */
function Hero() {
  const [mode, setMode] = useState("semantic"); // 전송엔 미포함, UI만
  const [query, setQuery] = useState("");

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
    } catch (_) {}
    setTimeout(() => {
      if (!opened) window.open(webLink, "_blank", "noopener,noreferrer");
    }, 400);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    openWhatsApp();
  };

  return (
    <section
      className="
        relative isolate overflow-hidden
        bg-gradient-to-b from-sky-200 via-sky-50 to-white
        min-h-screen flex items-center py-16 sm:py-20 lg:py-24
      "
    >
      {/* soft highlight */}
      <div
        className="
          pointer-events-none absolute inset-0
          [mask-image:radial-gradient(60%_60%_at_50%_20%,#000_40%,transparent_100%)]
          bg-[radial-gradient(80%_60%_at_50%_-20%,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0)_60%)]
        "
      />
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="w-full text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-3 py-1 text-xs font-semibold text-sky-900 shadow-sm backdrop-blur">
            Introducing FraudGuard API
            <a href="#api" className="ml-1 underline underline-offset-2 text-sky-800 hover:text-sky-900">
              Try now →
            </a>
          </span>

          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight text-slate-900">
            Meet your first AI fraud detective
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base sm:text-lg text-slate-800/85">
            Detect, analyze, and prevent fraud with a clean, fast, and privacy-friendly toolkit.
          </p>

          {/* input card */}
          <form
            onSubmit={onSubmit}
            className="
              mx-auto mt-8 max-w-3xl
              rounded-2xl border border-white/60 bg-white/80 backdrop-blur
              shadow-[0_8px_30px_rgba(2,6,23,0.08)]
              p-2 sm:p-2.5
              flex flex-col sm:flex-row gap-2
            "
            aria-label="Fraud analysis input"
          >
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                className="w-full rounded-xl border border-white/0 bg-white/90 pr-4 pl-9 py-3 outline-none text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-400"
                placeholder="Paste a suspicious message, phone number, or link…"
                aria-label="Describe a suspicious item"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-sky-600 px-5 py-3 font-bold text-white hover:bg-sky-700 active:bg-sky-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!query.trim()}
              title={!query.trim() ? "Enter some text first" : "Open WhatsApp"}
            >
              Analyze
            </button>
          </form>

          <p className="mt-2 text-sm text-slate-800/80 italic">
            * Analyze button will open up FraudGuard&apos;s Whatsapp Chatbot
          </p>

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
                onClick={() => setMode(c.key)}
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
      <div className="bg-[#eaf6ff] border-b border-slate-200 text-center text-sm font-bold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-2">
          <span>Introducing FraudGuard API — Available Now</span>
          <a href="#api" className="text-sky-700 hover:underline">
            Try now →
          </a>
        </div>
      </div>

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
