// src/components/AppleLikeHero.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faShieldHalved,
  faLaptopCode,
  faBug,
  faBrain,
  faLock,
  faExclamationTriangle,
  faChartLine,
  faBars,
  faTimes,
  faChevronRight,
  faRocket,
  faCubes,
  faSearch,
  faEnvelope,
  faPlay,
  faStar,
  faChevronLeft,
  faChevronUp,
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons";

/**
 * AppleLikeHero.jsx (Apple-inspired, not exact)
 *
 * - Very long, complicated single-file component with many subcomponents.
 * - Includes mega-menu, animated carousel, accessible modal, FAQ accordion,
 *   keyboard nav, parallax, IntersectionObserver reveal, and dense inline CSS.
 *
 * Tailwind must be present. FontAwesome icons used as placeholders.
 */

const AppleLikeHero = () => {
  const navigate = useNavigate();

  // UI state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrolled, setScrolled] = useState(0);
  const heroRef = useRef(null);
  const revealRefs = useRef([]);
  revealRefs.current = [];

  // sample carousel data (longer)
  const carouselItems = [
    {
      title: "AgentGuard Core",
      subtitle: "Red-team your instructions automatically",
      badge: "NEW",
      detail: "Runtime containment + audit trails",
    },
    {
      title: "Containment Engine",
      subtitle: "Sandboxing & rate-limits for risky actions",
      badge: "BETA",
      detail: "Fine-grained policy DSL",
    },
    {
      title: "Risk Dashboard",
      subtitle: "Auditable drift & compliance reports",
      badge: "ENTERPRISE",
      detail: "CSV / PDF export, SSO",
    },
    {
      title: "Integrations",
      subtitle: "Connectors to LLM infra & logging",
      badge: "PREVIEW",
      detail: "Datadog, S3, SIEMs",
    },
  ];

  // reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(!!mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // mouse parallax - throttled
  useEffect(() => {
    let ticking = false;
    const onMove = (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = heroRef.current?.getBoundingClientRect();
        const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
        const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
        const nx = (e.clientX - cx) / (rect ? rect.width / 2 : 800);
        const ny = (e.clientY - cy) / (rect ? rect.height / 2 : 500);
        setMouse({ x: nx, y: ny });
        ticking = false;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // carousel auto-advance
  useEffect(() => {
    const id = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % carouselItems.length);
    }, 5200);
    return () => clearInterval(id);
  }, []);

  // intersection reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("reveal-visible");
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealRefs.current.forEach((r) => r && obs.observe(r));
    return () => obs.disconnect();
  }, []);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "m") setMegaOpen((s) => !s);
      if (e.key === "k") document.querySelector("#searchInput")?.focus();
      if (e.key === "?" && (e.ctrlKey || e.metaKey)) setModalOpen(true);
      if (e.key === "ArrowRight") setCarouselIndex((i) => (i + 1) % carouselItems.length);
      if (e.key === "ArrowLeft") setCarouselIndex((i) => (i - 1 + carouselItems.length) % carouselItems.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [carouselItems.length]);

  // helper refs
  const addRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  // utility transform
  const t = (depth) => `translate3d(${mouse.x * depth * -18}px, ${mouse.y * depth * -10}px, 0)`;

  return (
    <div className="font-inter">
    <div className="min-h-screen w-screen font-inter antialiased text-gray-900 bg-white">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:opacity-100 focus:absolute focus:top-4 focus:left-4 bg-white p-2 rounded shadow z-50"
      >
        Skip to content
      </a>

      

      <main id="main" className="pt-20">
        {/* Hero */}
        <section
          ref={heroRef}
          className="relative min-h-[88vh] flex items-center justify-center overflow-hidden px-6"
          aria-labelledby="hero-heading"
        >
          {/* complex bg layers */}
          <div aria-hidden className="absolute inset-0 -z-20 pointer-events-none" style={{ transform: `translate3d(${mouse.x * 40}px, ${mouse.y * 24}px, 0)` }}>
            <div className="absolute left-[-12%] top-[-15%] w-[1200px] h-[1200px] rounded-full bg-gradient-to-r from-sky-50 via-white to-transparent opacity-70 blur-[100px]" />
            <div className="absolute right-[-10%] bottom-[-10%] w-[900px] h-[900px] rounded-full bg-gradient-to-tr from-pink-50 via-white to-transparent opacity-60 blur-[80px]" />
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="heroGlass" x1="0" x2="1">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#heroGlass)" />
            </svg>
          </div>

          

          <div className="max-w-[1200px] w-full mx-auto py-24 grid grid-cols-12 gap-8 items-center">
            <div className="col-span-12 lg:col-span-7">
              <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-gray-100/70 px-4 py-1.5 border border-gray-200 text-sm">
                <FontAwesomeIcon icon={faShieldHalved} className="text-sky-600" />
                <span className="font-medium text-gray-700">AgentGuard Platform</span>
              </div>

              <h1 id="hero-heading" className="text-[2.8rem] md:text-[4.2rem] leading-tight font-bold tracking-tight text-gray-900 max-w-3xl">
                Operationalizing <span className="text-sky-700">Agentic</span> Zero Trust
                <br />
                <span className="text-gray-500/95 font-medium">for AI Deployment</span>
              </h1>

              <p className="mt-6 text-lg text-gray-600 max-w-2xl leading-relaxed">
                Automatically red-team your agent system prompts for instruction hierarchy weaknesses and data leakage risks — from sandboxing to audit trails.
              </p>

              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-3 px-4 py-2.5 bg-sky-700 text-white rounded-2xl text-sm font-semibold tracking-wide cursor-pointer transition-color duration-200">
                  <FontAwesomeIcon icon={faPlay} />
                  Watch overview
                </button>

                <Link to="/docs" className="inline-flex items-center gap-3  px-4 py-2.5 bg-white text-gray-800 rounded-2xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition">
                  View docs
                  <FontAwesomeIcon icon={faChevronRight} />
                </Link>

                <button onClick={() => navigate("/collab")} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer border border-gray-200">
                  <FontAwesomeIcon icon={faCubes} />
                  Live Demo
                </button>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 items-center text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">G</div>
                  <span>Used by Gov & Fintech teams</span>
                </div>
                <div className="flex items-center gap-2 opacity-80">
                  <FontAwesomeIcon icon={faChartLine} />
                  <span>Reduce detection time by <strong>5x</strong></span>
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div className="col-span-12 lg:col-span-5 relative">
              <div className="rounded-3xl p-1 bg-gradient-to-br from-white to-gray-50 border border-gray-200" >
                <div className="bg-white rounded-3xl p-6 lg:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Live Scan</div>
                      <div className="mt-2 text-lg font-semibold text-gray-900">Instruction Hierarchy Audit</div>
                      <div className="mt-1 text-sm text-gray-500">Find prompt chain issues and secrets risk automatically.</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-xs text-gray-400 text-right">Risk</div>
                      <div className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-sm border border-amber-100">Medium</div>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-900 text-gray-100 rounded-lg p-3 font-mono text-xs">
                    <div className="flex items-center gap-3">
                      <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                      <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" />
                      <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                      <div className="ml-auto text-[10px] text-gray-400">Live</div>
                    </div>

                    <pre className="mt-3 text-xs overflow-x-auto">
{`> scanning prompt chain...
> finding instruction hierarchy misconfig...
> potential data leak detected at step 3
> flagged 1 secret candidate (confidence 0.83)
> suggested containment policies: sandbox + rate-limit
> risk score: 6.8/10`}
                    </pre>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button onClick={() => navigate("/collab")} className="text-sm inline-flex items-center gap-2 px-4 py-2 rounded-md bg-sky-700 text-white">
                      Run My Scan
                    </button>
                    <Link to="/learn" className="text-sm inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-50 border border-gray-200">
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-lg p-3 bg-gray-50 border border-gray-100 text-center">
                  <div className="font-semibold">99.9%</div>
                  <div className="text-gray-500 mt-1">Uptime</div>
                </div>
                <div className="rounded-lg p-3 bg-gray-50 border border-gray-100 text-center">
                  <div className="font-semibold">12ms</div>
                  <div className="text-gray-500 mt-1">Avg Response</div>
                </div>
                <div className="rounded-lg p-3 bg-gray-50 border border-gray-100 text-center">
                  <div className="font-semibold">2.1k</div>
                  <div className="text-gray-500 mt-1">Scans / day</div>
                </div>
              </div>
            </div>
          </div>

          {/* scroll arrow */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
            <button onClick={() => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })} className="cursor-pointer hover:scale-110 transition-transform" aria-label="Scroll to features">
              <FontAwesomeIcon icon={faChevronDown} className="animate-bounce text-gray-600 text-2xl" />
            </button>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-extrabold text-gray-900">Platform highlights</h2>
              <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Powerful, automated red-teaming built for modern agentic systems — introspection, containment, and remediation built-in.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard icon={faBug} title="Automated Red Teaming" desc="Simulate attacker agents and find instruction-level vulnerabilities across chains." addRef={addRef} />
              <FeatureCard icon={faLock} title="Containment Policies" desc="Auto-generate containment rules to isolate risky behaviors while preserving utility." addRef={addRef} />
              <FeatureCard icon={faChartLine} title="Risk & Compliance" desc="Track data leakage score, remediation timeline, and export for auditors." addRef={addRef} />
            </div>
          </div>
        </section>

        {/* Carousel / live examples */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Live scan examples</h3>
                <p className="text-sm text-gray-600 mt-1">Real traces from agent runs — redacted for privacy.</p>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setCarouselIndex(0)} className="px-3 py-2 rounded-md border border-gray-200 text-sm">All</button>
                <button className="px-3 py-2 rounded-md border border-gray-200 text-sm">Finance</button>
                <button className="px-3 py-2 rounded-md border border-gray-200 text-sm">Health</button>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 ">
                <div className="flex items-center gap-6">
                  <div className="w-3/5">
                    <div className="h-44 overflow-hidden rounded-lg bg-gradient-to-br from-white to-gray-50 p-4">
                      {/* simulated visual — plenty of SVG detail */}
                      <svg viewBox="0 0 800 220" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                        <defs>
                          <linearGradient id="gA" x1="0" x2="1">
                            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.2" />
                          </linearGradient>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#gA)" rx="12" />
                        <g fill="none" stroke="#ffffff88" strokeWidth="2">
                          <path d="M20 180 C120 60, 280 140, 380 40, 520 220, 700 40, 780 120" />
                        </g>
                      </svg>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-lg font-semibold">{carouselItems[carouselIndex].title}</h4>
                      <div className="text-sm text-gray-500 mt-1">{carouselItems[carouselIndex].subtitle} · <span className="font-medium text-gray-700">{carouselItems[carouselIndex].badge}</span></div>
                      <p className="mt-3 text-sm text-gray-600">{carouselItems[carouselIndex].detail}</p>
                    </div>
                  </div>

                  <div className="w-2/5">
                    <div className="grid grid-cols-2 gap-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-lg p-3 bg-gray-50 border border-gray-100 text-xs">
                          <div className="font-semibold">Agent Run #{2300 + i}</div>
                          <div className="text-gray-500 mt-1">Scanned 2h ago</div>
                          <div className="mt-3 text-xs text-gray-600 font-mono bg-white p-2 rounded">{`> step${i + 1}: check prompt -> flagged`}</div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-xs text-gray-500">Runtime: 32s</div>
                            <div className="flex items-center gap-2">
                              <button className="text-xs px-2 py-1 rounded-lg bg-white border border-gray-300">View</button>
                              <button className="text-xs px-2 py-1 rounded-lg bg-sky-700 text-white">Contain</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setCarouselIndex((i) => (i - 1 + carouselItems.length) % carouselItems.length)} aria-label="Prev" className="p-2 rounded hover:bg-gray-100">
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <div className="text-sm text-gray-500">{carouselIndex + 1} / {carouselItems.length}</div>
                    <button onClick={() => setCarouselIndex((i) => (i + 1) % carouselItems.length)} aria-label="Next" className="p-2 rounded hover:bg-gray-100">
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>

                  <div className="text-xs text-gray-500">Live feed · updated in real-time</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two column deep dive */}
        <section className="py-20">
          <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <h3 className="text-3xl font-extrabold text-gray-900">Why instruction hierarchy matters</h3>
              <p className="mt-4 text-gray-600 max-w-xl">
                Agents chain instructions. A small mis-ordered step or permissive "system" instruction can cascade into large data leaks or privilege escalations.
              </p>

              <ol className="mt-6 space-y-3 text-gray-600 pl-4 list-decimal">
                <li>Map instruction flows and high-sensitivity tokens.</li>
                <li>Identify implicit role delegation and authority gaps.</li>
                <li>Suggest containment wrappers and runtime checks.</li>
              </ol>

              <div className="mt-6 flex gap-4">
                <Link to="/platform" className="inline-flex items-center gap-3 px-4 py-2.5 bg-sky-700 text-white rounded-2xl text-sm font-semibold tracking-wide cursor-pointer">Platform details</Link>
                <Link to="/contact" className="inline-flex items-center gap-3 px-4 py-2.5 bg-transparent text-black border border-gray-300 rounded-2xl text-sm font-semibold tracking-wide cursor-pointer">Contact Sales</Link>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-3xl p-6 bg-gradient-to-tr from-white to-gray-50 border border-gray-200 ">
                <svg viewBox="0 0 600 360" className="w-full h-auto" preserveAspectRatio="xMidYMid slice">
                  <g fill="none" strokeWidth="2" strokeLinecap="round">
                    <path d="M40 320 L80 80 L160 120 L260 40 L360 160 L500 60" stroke="#60A5FA" opacity="0.9" />
                    <path d="M40 260 L120 200 L220 280 L320 200 L420 320 L540 260" stroke="#C084FC" opacity="0.8" />
                  </g>
                </svg>

                <div className="mt-4 text-sm text-gray-600">
                  The visualization above shows instruction call paths and flagged hops — red lines are high risk.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-white to-gray-50">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h4 className="text-2xl font-extrabold">Start hardening your agent deployments</h4>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Evaluate risks in minutes — not days. Safe-by-default policies you can audit and export.</p>

            <div className="mt-6 flex justify-center gap-4">
              <Link to="/signup" className="flex items-center justify-center px-4 py-2 text-sm bg-sky-700 text-white rounded-2xl font-semibold">Get started free</Link>
              <Link to="/contact" className="px-5 py-2 border rounded-2xl text-sm border-gray-300">Talk to sales</Link>
            </div>
          </div>
        </section>

        {/* FAQ accordion */}
        <section className="py-16">
          <div className="max-w-[900px] mx-auto px-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Frequently asked questions</h3>
            <FAQ />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-12">
          <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center">AG</div>
                <div>
                  <div className="font-semibold">AgentGuard</div>
                  <div className="text-sm text-gray-500">Operationalized security for AI agents</div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">© {new Date().getFullYear()} AgentGuard, Inc. All rights reserved.</div>
            </div>

            <div>
              <div className="font-semibold mb-3">Product</div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/platform" className="hover:underline">Platform</Link></li>
                <li><Link to="/docs" className="hover:underline">Docs</Link></li>
                <li><Link to="/pricing" className="hover:underline">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <div className="font-semibold mb-3">Company</div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/about" className="hover:underline">About</Link></li>
                <li><Link to="/careers" className="hover:underline">Careers</Link></li>
                <li><Link to="/press" className="hover:underline">Press</Link></li>
              </ul>
            </div>

            <div>
              <div className="font-semibold mb-3">Stay up to date</div>
              <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed (demo)"); }} className="flex gap-2">
                <input id="searchInput" aria-label="Email" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="you@example.com" />
                <button className="px-3 py-2 bg-gray-900 text-white rounded-md text-sm">Subscribe</button>
              </form>

              <div className="mt-4 text-sm text-gray-600 flex items-center gap-3">
                <FontAwesomeIcon icon={faEnvelope} />
                <Link to="/contact" className="hover:underline">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* modal */}
      {modalOpen && <VideoModal onClose={() => setModalOpen(false)} />}

      {/* long inline styles (bloat) */}
      <style>{`
        /* Large inline style block to emulate Apple-like polish & complexity */
        :root {
          --accent: #0ea5e9;
          --accent-2: #7c3aed;
        }

        .rounded-3xl { border-radius: 28px; }

        @keyframes floaty {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }

        @keyframes pulseSoft {
          0% { box-shadow: 0 0 0 0 rgba(14,165,233,0.08); }
          70% { box-shadow: 0 10px 30px -10px rgba(14,165,233,0.06); }
          100% { box-shadow: 0 0 0 0 rgba(14,165,233,0); }
        }

        .floating { animation: floaty 6s ease-in-out infinite; }
        .pulse-soft { animation: pulseSoft 5s ease-in-out infinite; }

        /* reveal helpers */
        .reveal-visible { opacity: 1 !important; transform: none !important; transition: transform 700ms cubic-bezier(.2,.9,.2,1), opacity 800ms ease; }
        .reveal-card { opacity: 0; transform: translateY(12px) scale(.995); transition: transform 700ms cubic-bezier(.2,.9,.2,1), opacity 800ms ease; }

        /* nav underline micro animation */
        .nav-link { position: relative; }
        .nav-link::after { content: ''; position: absolute; left: 0; right: 0; bottom: -8px; height: 2px; opacity: 0; transform: scaleX(.85) translateY(6px); background: linear-gradient(90deg, rgba(14,165,233,0.95), rgba(124,58,237,0.95)); transition: all 220ms cubic-bezier(.2,.9,.2,1); border-radius: 999px; }
        .nav-link:hover::after { opacity: 1; transform: scaleX(1) translateY(0); }

        /* focus outline for accessibility */
        button:focus, a:focus, input:focus { outline: 3px solid rgba(14,165,233,0.12); outline-offset: 3px; box-shadow: 0 6px 20px rgba(16,24,40,0.06); }

        /* micro animations for decorative badges */
        @keyframes microPulse1 { 0% { opacity: .9; } 50% { opacity: 1; } 100% { opacity: .9; } }
        @keyframes microPulse2 { 0% { transform: translateY(0); } 50% { transform: translateY(-2px); } 100% { transform: translateY(0); } }
        .micro-1 { animation: microPulse1 6s ease-in-out infinite; }
        .micro-2 { animation: microPulse2 7s ease-in-out infinite; }

        /* long list of gradient helpers to bloat file */
        .bg-accent { background: linear-gradient(90deg, var(--accent), var(--accent-2)); }
        .text-accent { color: var(--accent); }

        /* tiny devices */
        @media (max-width: 640px) {
          .text-[2.8rem] { font-size: 1.75rem; }
        }

        /* visually-hidden utilities (for accessible icons) */
        .sr-only { position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

        /* modal content polish */
        .modal-backdrop { backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); background: rgba(10,10,10,0.35); }
        .modal-card { box-shadow: 0 20px 50px rgba(2,6,23,0.3); border-radius: 16px; }

        /* ensure focus ring looks consistent across browsers */
        :focus { outline: none; }
      `}</style>
    </div>
    </div>
  );
};

/* ---------- Subcomponents ---------- */

function NavLink({ to, children }) {
  return (
    <Link to={to} className="nav-link px-2 py-2 rounded hover:bg-gray-100">
      {children}
    </Link>
  );
}

function FloatingBadge({ icon, label, color = "red" }) {
  const colorClass = {
    red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
  }[color] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-100" };

  return (
    <div className="flex flex-col items-center gap-2 micro-2">
      <div className={`p-3 rounded-2xl ${colorClass.bg} border ${colorClass.border} shadow-lg`}>
        <FontAwesomeIcon icon={icon} className={`${colorClass.text} text-2xl`} />
      </div>
      <div className={`text-xs ${colorClass.text} font-medium ${colorClass.bg} px-2 py-1 rounded-full border ${colorClass.border}`}>{label}</div>
    </div>
  );
}

/* FeatureCard - accessible, uses addRef for reveals */
function FeatureCard({ icon, title, desc, addRef }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current && addRef) addRef(ref.current); }, [addRef]);
  return (
    <article ref={ref} className="reveal-card rounded-2xl p-6 bg-white border border-gray-200 transition-all" tabIndex={0} aria-labelledby={`feature-${title}`}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
          <FontAwesomeIcon icon={icon} className="text-2xl text-gray-700" />
        </div>

        <div className="flex-1">
          <h4 id={`feature-${title}`} className="text-lg font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 mt-2">{desc}</p>

          <div className="mt-4 flex items-center gap-3">
            <button className="text-xs flex px-2 py-2 rounded-md border border-gray-300 cursor-pointer">Learn </button>
            <button className="text-xs flex px-3 py-2 rounded-md bg-sky-700 text-white cursor-pointer">Try it</button>
            <div className="flex items-center gap-2 ml-auto text-xs text-gray-400">
              <span>Latency</span>
              <span className="px-2 py-1 rounded bg-gray-100 border text-gray-700">12ms</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* Video Modal (demo) */
function VideoModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center modal-backdrop" role="dialog" aria-modal="true" aria-label="Overview video">
      <div className="w-full max-w-4xl mx-4 modal-card bg-white p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center"><FontAwesomeIcon icon={faPlay} /></div>
            <div>
              <div className="font-semibold">AgentGuard overview</div>
              <div className="text-sm text-gray-500">A quick 90s intro</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { navigator.clipboard?.writeText(window.location.href); }} className="px-3 py-2 rounded border text-sm">Copy link</button>
            <button onClick={onClose} className="px-3 py-2 rounded text-sm bg-gray-50 border">Close</button>
          </div>
        </div>

        <div className="mt-4 bg-black rounded overflow-hidden aspect-[16/9]">
          {/* placeholder video iframe-like block */}
          <div className="w-full h-full flex items-center justify-center text-white text-sm">Video (placeholder)</div>
        </div>

        <div className="mt-4 text-sm text-gray-600">Press Esc to close.</div>
      </div>
    </div>
  );
}

/* FAQ accordion with internal state */
function FAQ() {
  const items = [
    { q: "How does red-teaming work?", a: "We run simulated agents and analyze instruction flows, identifying escalation and data leakage risks." },
    { q: "Can I export reports?", a: "Yes — PDF and CSV exports are available for auditors and compliance workflows." },
    { q: "What integrations are supported?", a: "We offer connectors for LLM providers, logging systems, SIEMs, and cloud storage." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="border border-gray-100 rounded-lg">
          <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between px-4 py-3 text-left">
            <div>
              <div className="font-medium">{it.q}</div>
              <div className="text-sm text-gray-500">{open === i ? "Open" : "Closed"}</div>
            </div>
            <div className="text-gray-500">
              <FontAwesomeIcon icon={open === i ? faChevronUp : faChevronDown} />
            </div>
          </button>
          <div className={`px-4 pb-4 transition-all ${open === i ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
            <div className="pt-2 text-sm text-gray-600">{it.a}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AppleLikeHero;
