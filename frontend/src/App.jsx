import React, { useState } from "react";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "API", href: "#api" },
  { label: "Dashboard", href: "#dashboard" },
];

const chips = [
  { key: "semantic", label: "Semantic analysis" },
  { key: "phone", label: "Phone number reports" },
  { key: "bank", label: "Bank account verification" },
  { key: "phish", label: "Phishing link detector" },
  { key: "malware", label: "Malware file scanner" },
  { key: "api", label: "Business API" },
];

const features = [
  {
    title: "Semantic Analysis",
    desc: "Analyze text and screenshots to surface social-engineering patterns and risky intents.",
  },
  {
    title: "Phone Number Intelligence",
    desc: "Search reports about scammer numbers with evidence and frequency counts.",
  },
  {
    title: "Bank Account Verification",
    desc: "Check account details against known fraudulent records with real-time signals.",
  },
  {
    title: "Phishing Link Detection",
    desc: "Flag malicious URLs, fake websites, and credential traps before users click.",
  },
  {
    title: "Malware File Scanner",
    desc: "Detect malware and trojans quickly to stop damage early.",
  },
  {
    title: "Business API Integration",
    desc: "Embed fraud checks into your product with a stable, rate-limited API.",
  },
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

function Header({ onToggleMenu }) {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="font-extrabold text-xl tracking-tight">FraudGuard</div>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className="text-slate-700/70 hover:text-slate-900 font-semibold"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <a
            href="#sales"
            className="px-4 py-2 rounded-full border border-slate-200 text-slate-800 font-bold"
          >
            Talk to sales
          </a>
          <a
            href="#try"
            className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold"
          >
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
          <a
            href="#sales"
            className="px-4 py-2 rounded-full border border-slate-200 text-slate-800 font-bold w-full text-center"
          >
            Talk to sales
          </a>
          <a
            href="#try"
            className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold w-full text-center"
          >
            Try for free
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const [mode, setMode] = useState("semantic");

  return (
    <section className="bg-[#ecf7ff] border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-sky-700 font-extrabold tracking-wide mb-2">
          AI-Powered Fraud Detection
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          Meet your AI fraud detective
        </h1>
        <p className="max-w-3xl mx-auto mt-3 text-slate-600">
          Detect, analyze, and prevent fraud with a clean, fast, and privacy-friendly toolkit.
        </p>

        <form
          className="mt-6 max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl p-2 flex flex-col sm:flex-row gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="flex-1 px-4 py-3 outline-none"
            placeholder="Paste a suspicious message, phone number, or link…"
            aria-label="Describe a suspicious item"
          />
          <button className="px-5 py-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold">
            Analyze
          </button>
        </form>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {chips.map((c) => (
            <button
              key={c.key}
              onClick={() => setMode(c.key)}
              className={`px-3.5 py-2 rounded-full border text-sm font-bold transition-colors ${
                mode === c.key
                  ? "bg-sky-500 border-sky-500 text-white"
                  : "bg-white border-slate-200 text-slate-800 hover:border-slate-300"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold text-center">Comprehensive fraud protection</h2>
        <p className="text-slate-600 text-center mt-1">
          AI technology to identify and prevent fraud across multiple channels
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <article
              key={f.title}
              className="bg-white border border-slate-200 rounded-xl p-5 min-h-[150px]"
            >
              <h3 className="font-extrabold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-600">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-[#f1faff] border-y border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 text-center">
        <h2 className="text-3xl font-extrabold">Ready to protect against fraud?</h2>
        <p className="text-slate-600 mt-1">Join thousands already protected by FraudGuard.</p>
        <div className="flex justify-center gap-3 mt-4">
          <a href="#try" className="px-5 py-3 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold">
            Start free trial
          </a>
          <a href="#demo" className="px-5 py-3 rounded-full border border-slate-200 font-bold">
            Schedule demo
          </a>
        </div>
      </div>

      <div className="p-6 bg-sky-500 text-white font-bold rounded-xl text-center">
  Tailwind OK
</div>

    </section>

    
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold text-center">Choose your protection level</h2>
        <p className="text-slate-600 text-center mt-1">From individual use to enterprise-grade security</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative bg-white border rounded-xl p-5 ${
                t.highlight ? "border-sky-400" : "border-slate-200"
              }`}
            >
              {t.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-extrabold bg-sky-500 text-white rounded-full px-3 py-1">
                  {t.badge}
                </div>
              )}

              <div className="flex items-end justify-between">
                <div className="font-extrabold text-xl">{t.name}</div>
                <div className="font-black text-3xl">
                  {t.price}
                  {t.period && <span className="text-sm text-slate-500 ml-1">{t.period}</span>}
                </div>
              </div>

              <ul className="list-disc pl-5 mt-3 text-slate-600">
                {t.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <a
                href="#go"
                className={`mt-4 inline-flex w-full justify-center px-4 py-2.5 rounded-full font-bold ${
                  t.cta.variant === "solid"
                    ? "bg-sky-500 hover:bg-sky-600 text-white"
                    : "border border-slate-200"
                }`}
              >
                {t.cta.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterLink({ label }) {
  return (
    <a href="#" className="block text-slate-800/80 hover:text-slate-900 mb-1">
      {label}
    </a>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="text-center text-slate-600 text-sm py-3 border-t border-slate-200">
        © 2025 FraudGuard. All rights reserved.
      </div>
    </footer>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="bg-[#eaf6ff] border-b border-slate-200 text-center text-sm font-bold">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-2">
          <span>Introducing FraudGuard API — Available Now</span>
          <a href="#api" className="text-sky-600">Try now →</a>
        </div>
      </div>

      <Header onToggleMenu={() => setMenuOpen((v) => !v)} />
      <MobileMenu open={menuOpen} />
      <Hero />
      <Features />
      <CTA />
      <Pricing />
      <Footer />
    </div>
  );
}
