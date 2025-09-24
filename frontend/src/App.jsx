import React, { useState } from "react";
import Hero from "./Hero";

/* ================= config ================= */
const WHATSAPP_NUMBER = import.meta.env.VITE_WA_PHONE || "628979129568"; 
// e.g., "6281234567890" (no "+", no spaces)
const WHATSAPP_GREETING =
  "Hi! I came from the website. I'd like to chat with the FraudGuard assistant.";

/* ================= helpers ================= */
function buildWhatsAppLink(phone, text) {
  // Works on both mobile (app) and desktop (WhatsApp Web)
  const msg = encodeURIComponent(text || "");
  const digitsOnly = String(phone).replace(/\D/g, "");
  return `https://wa.me/${digitsOnly}?text=${msg}`;
}

/* ================= components ================= */
function Header({ onToggleMenu }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="
            mt-2 h-14 px-4 sm:px-6
            flex items-center justify-between
            rounded-2xl
            border border-white/35
            bg-white/30 supports-[backdrop-filter]:bg-white/20 backdrop-blur-md
            shadow-[0_8px_20px_rgba(2,6,23,0.04)]
          "
        >
          <a href="/" className="inline-flex items-center gap-2">
            <span className="inline-block h-5 w-5 rounded-md bg-sky-600" />
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              FraudGuard
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
              { label: "API", href: "#api" },
              { label: "Dashboard", href: "#dashboard" },
            ].map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="text-slate-900/75 hover:text-slate-900 font-medium"
              >
                {n.label}
              </a>
            ))}
          </nav>

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

          <button
            onClick={onToggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-xl
                       border border-white/35 bg-white/40 backdrop-blur
                       text-slate-900"
            aria-label="Toggle menu"
          >
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
      className={`md:hidden transition-all duration-200 overflow-hidden ${
        open ? "max-h-96" : "max-h-0"
      }`}
      aria-hidden={!open}
    >
      <div className="mx-4 sm:mx-6 -mt-2 mb-2 rounded-2xl border border-white/30
                      bg-white/70 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)]">
        <div className="px-4 py-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
              { label: "API", href: "#api" },
              { label: "Dashboard", href: "#dashboard" },
            ].map((n) => (
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

/* ============== floating WhatsApp button ============== */
function WhatsAppButton() {
  const href = buildWhatsAppLink(WHATSAPP_NUMBER, WHATSAPP_GREETING);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="
        fixed z-[60]
        right-4 sm:right-6
        bottom-[calc(1rem+env(safe-area-inset-bottom))]
        sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]
        h-14 w-14 sm:h-16 sm:w-16
        rounded-full
        shadow-[0_12px_30px_rgba(16,185,129,0.35)]
        ring-1 ring-emerald-400/30
        bg-gradient-to-br from-emerald-500 via-emerald-500 to-emerald-600
        hover:brightness-105 active:brightness-95
        flex items-center justify-center
        transition-transform duration-150 hover:scale-[1.03]
      "
    >
      {/* WhatsApp logo (SVG) */}
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-8 w-8 text-white"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.98c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.94L0 24l6.305-1.654a11.86 11.86 0 005.684 1.448h.005c6.554 0 11.89-5.335 11.893-11.892a11.82 11.82 0 00-3.473-8.413z"/>
    </svg>


      {/* tooltip (desktop) */}
      <span className="hidden sm:block absolute right-[calc(100%+10px)] bottom-1/2 translate-y-1/2
                       bg-slate-900 text-white text-xs font-semibold rounded-lg px-2 py-1
                       shadow-md">
        Chat on WhatsApp
      </span>
    </a>
  );
}

/* ============== simple filler sections (unchanged) ============== */
function Features() {
  const features = [
    { title: "Semantic Analysis", desc: "Analyze text and screenshots to surface social-engineering patterns and risky intents." },
    { title: "Phone Number Intelligence", desc: "Search reports about scammer numbers with evidence and frequency counts." },
    { title: "Bank Account Verification", desc: "Check account details against known fraudulent records with real-time signals." },
    { title: "Phishing Link Detection", desc: "Flag malicious URLs, fake websites, and credential traps before users click." },
    { title: "Malware File Scanner", desc: "Detect malware and trojans quickly to stop damage early." },
    { title: "Business API Integration", desc: "Embed fraud checks into your product with a stable, rate-limited API." },
  ];
  return (
    <section id="features" className="bg-white min-h-screen flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="w-full text-center">
          <h2 className="text-4xl font-extrabold">Comprehensive fraud protection</h2>
          <p className="text-slate-600 mt-2">AI technology to identify and prevent fraud across multiple channels</p>
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

function Pricing() {
  const tiers = [
    { name: "Free", price: "$0", period: "/mo", features: ["Basic fraud checks", "Educational resources", "Community support"], cta: { label: "Get started free", variant: "outline" }, highlight: false },
    { name: "Pro", price: "$19", period: "/mo", features: ["Verification badge", "Bulk fraud checks", "Real-time alerts", "Simple dashboard"], cta: { label: "Start Pro trial", variant: "solid" }, highlight: true, badge: "Most popular" },
    { name: "Enterprise", price: "Custom", period: "", features: ["Full API access", "SLA guarantee", "Advanced analytics", "White-label solution"], cta: { label: "Contact sales", variant: "outline" }, highlight: false },
  ];
  return (
    <section id="pricing" className="bg-white py-16 sm:py-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-left">
          <h2 className="text-4xl font-extrabold">Choose your protection level</h2>
          <p className="text-slate-600 mt-2">From individual use to enterprise-grade security</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`relative bg-white rounded-2xl p-6 shadow-sm border ${
                  t.highlight ? "border-sky-400 ring-1 ring-sky-200" : "border-slate-200"
                }`}
              >
                {t.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-extrabold bg-sky-600 text-white rounded-full px-3 py-1">
                    {t.badge}
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div className="font-extrabold text-2xl text-slate-900">{t.name}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">{t.price}</span>
                    {t.period && <span className="text-base sm:text-lg font-semibold text-slate-500">{t.period}</span>}
                  </div>
                </div>
                <ul className="list-disc pl-5 mt-4 text-slate-700 space-y-2">
                  {t.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <a
                  href="#go"
                  className={`mt-6 inline-flex w-full justify-center px-4 py-3 rounded-full font-bold transition ${
                    t.cta.variant === "solid"
                      ? "bg-sky-600 hover:bg-sky-700 text-white"
                      : "border border-slate-200 hover:bg-slate-50"
                  }`}
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

function FooterLink({ label }) {
  return <a href="#" className="block text-slate-800/80 hover:text-slate-900 mb-1">{label}</a>;
}

function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <div className="font-extrabold">FraudGuard</div>
          <p className="text-slate-600 mt-1">AI-powered fraud detection to protect businesses and individuals from online threats.</p>
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

/* ================= app ================= */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header onToggleMenu={() => setMenuOpen((v) => !v)} />
      <MobileMenu open={menuOpen} />

      <main>
        <Hero />
        <Features />
        <CTA />
        <Pricing />
      </main>

      <Footer />

      {/* Floating WhatsApp */}
      <WhatsAppButton />
    </div>
  );
}
