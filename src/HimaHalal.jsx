import { useMemo, useState } from "react";
import { COMPANIES } from "./companies";

const CATEGORIES = ["All", ...Array.from(new Set(COMPANIES.map((c) => c.category)))];
const ALL_EXPORTS = new Set(COMPANIES.flatMap((c) => c.exports));
const OLDEST = Math.min(...COMPANIES.map((c) => Number(c.founded)));

const waLink = (num) => (num ? "https://wa.me/6" + num.replace(/[^0-9]/g, "") : null);
const coverPhoto = (c) => (c.gallery.find((g) => g.label === "Factory") || c.gallery[0])?.src;

// ─────────────────────────────────────────────────────────────
// Job application form — uploads the resume and sends the whole
// application to the chosen company via /api/apply (api/apply.js).
// ─────────────────────────────────────────────────────────────
const MAX_RESUME_MB = 3;
const RESUME_TYPES = [".pdf", ".doc", ".docx"];

const readAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1]);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

function ApplyForm({ lockedCompanyId }) {
  const empty = { company: lockedCompanyId || "", position: "", name: "", email: "", phone: "", experience: "", message: "", website: "" };
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const [status, setStatus] = useState({ state: "idle" });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const pickFile = (e) => {
    const f = e.target.files?.[0] || null;
    setStatus({ state: "idle" });
    if (!f) return setFile(null);
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!RESUME_TYPES.includes(ext)) {
      setStatus({ state: "error", msg: "Please choose a PDF or Word (.doc, .docx) file." });
      e.target.value = "";
      return setFile(null);
    }
    if (f.size > MAX_RESUME_MB * 1024 * 1024) {
      setStatus({ state: "error", msg: `Your resume is ${(f.size / 1048576).toFixed(1)} MB. Please upload a file of ${MAX_RESUME_MB} MB or less.` });
      e.target.value = "";
      return setFile(null);
    }
    setFile(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    const company = COMPANIES.find((c) => c.id === (lockedCompanyId || form.company));
    if (!company) return;
    if (!file) return setStatus({ state: "error", msg: "Please upload your resume." });
    setStatus({ state: "sending" });
    try {
      const data = await readAsBase64(file);
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, companyId: company.id, resume: { name: file.name, data } }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out.error || "Something went wrong. Please try again.");
      setStatus({ state: "sent", company });
      setForm(empty);
      setFile(null);
      setFileKey((k) => k + 1);
    } catch (err) {
      setStatus({
        state: "error",
        msg: err.message === "Failed to fetch" ? "Couldn't reach the server. Check your connection and try again." : err.message,
      });
    }
  };

  if (status.state === "sent") {
    return (
      <div className="hh-form hh-done" role="status">
        <div className="tick">✓</div>
        <h3>Application sent!</h3>
        <p>
          Your application and resume were sent to <strong>{status.company.name}</strong>. They'll contact you by
          email or phone if you're shortlisted.
        </p>
        <button type="button" className="hh-btn solid" onClick={() => setStatus({ state: "idle" })}>
          Apply for another position
        </button>
      </div>
    );
  }

  return (
    <form className="hh-form" onSubmit={submit}>
      <input type="text" name="website" value={form.website} onChange={set("website")} className="hh-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {!lockedCompanyId && (
        <label className="full">
          <span>Company *</span>
          <select required value={form.company} onChange={set("company")}>
            <option value="" disabled>Choose a company…</option>
            {COMPANIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — {c.category}</option>
            ))}
          </select>
        </label>
      )}
      <label className="full">
        <span>Position applied for *</span>
        <input required value={form.position} onChange={set("position")} placeholder="e.g. Production Operator, QA Executive, Sales" />
      </label>
      <label>
        <span>Full name *</span>
        <input required value={form.name} onChange={set("name")} autoComplete="name" />
      </label>
      <label>
        <span>Email *</span>
        <input required type="email" value={form.email} onChange={set("email")} autoComplete="email" />
      </label>
      <label>
        <span>Phone *</span>
        <input required type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="01X-XXX XXXX" />
      </label>
      <label>
        <span>Experience</span>
        <select value={form.experience} onChange={set("experience")}>
          <option value="">Select…</option>
          <option>Fresh graduate / no experience</option>
          <option>1–2 years</option>
          <option>3–5 years</option>
          <option>More than 5 years</option>
        </select>
      </label>
      <label className="full">
        <span>Resume / CV * <em>(PDF or Word, max {MAX_RESUME_MB} MB)</em></span>
        <div className={`hh-file ${file ? "has" : ""}`}>
          <input key={fileKey} type="file" accept={RESUME_TYPES.join(",")} onChange={pickFile} />
          <span className="icon">📄</span>
          <span className="txt">
            {file ? (
              <><strong>{file.name}</strong> · {file.size < 1048576 ? `${Math.max(1, Math.round(file.size / 1024))} KB` : `${(file.size / 1048576).toFixed(1)} MB`} — click to change</>
            ) : (
              <><strong>Click to upload</strong> or drag your resume here</>
            )}
          </span>
        </div>
      </label>
      <label className="full">
        <span>Tell them about yourself</span>
        <textarea rows={4} value={form.message} onChange={set("message")} placeholder="Your skills, availability, why you'd like to join…" />
      </label>
      {status.state === "error" && <div className="full hh-err" role="alert">{status.msg}</div>}
      <div className="full hh-form-foot">
        <button type="submit" className="hh-btn solid" disabled={status.state === "sending"}>
          {status.state === "sending" ? "Sending…" : "Submit application"}
        </button>
        <p className="hh-hint">Your application and resume go straight to the company's hiring team.</p>
      </div>
    </form>
  );
}

export default function HimaHalal() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = useMemo(
    () =>
      COMPANIES.filter(
        (c) =>
          (cat === "All" || c.category === cat) &&
          (c.name + c.legalName + c.category + c.brands.join(" ")).toLowerCase().includes(query.toLowerCase())
      ),
    [cat, query]
  );
  const company = COMPANIES.find((c) => c.id === selected);

  const goSection = (id) => (e) => {
    e?.preventDefault();
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    if (selected) {
      setSelected(null);
      setTimeout(scroll, 30); // wait for the home view to render
    } else {
      scroll();
    }
  };
  const openCompany = (id) => {
    setSelected(id);
    window.scrollTo(0, 0);
  };

  return (
    <div className="hh-root">
      <style>{CSS}</style>

      <header className="hh-nav">
        <div className="hh-nav-in">
          <a href="#top" className="hh-logo" onClick={goSection("top")}>
            HIMA<span>HALAL</span>
          </a>
          <nav aria-label="Main">
            <a href="#about" onClick={goSection("about")}>About</a>
            <a href="#directory" onClick={goSection("directory")}>Directory</a>
            <a href="#careers" onClick={goSection("careers")} className="cta">Careers</a>
          </nav>
        </div>
      </header>

      {!company && (
        <main>
          {/* ── HERO ── */}
          <section className="hh-hero" id="top">
            <img src="/kimar-complex.webp" alt="Aerial view of Kompleks Industri Makanan MARA (KIMAR), Batu Caves" />
            <div className="hh-hero-shade" />
            <div className="hh-hero-in">
              <span className="hh-kicker">Kompleks Industri Makanan MARA · KM13 Batu Caves</span>
              <h1>Malaysia's halal makers,<br /><em>under one roof.</em></h1>
              <p>
                Discover {COMPANIES.length} halal-certified food manufacturers, partner with them for OEM,
                or apply to build your career with them.
              </p>
              <div className="hh-hero-btns">
                <a href="#directory" className="hh-btn solid" onClick={goSection("directory")}>Explore manufacturers</a>
                <a href="#careers" className="hh-btn ghost" onClick={goSection("careers")}>Apply for a job</a>
              </div>
            </div>
          </section>

          {/* ── ABOUT ── */}
          <section className="hh-section hh-about" id="about">
            <div className="hh-wrap hh-about-grid">
              <div>
                <span className="hh-eyebrow">About us</span>
                <h2>A home for Malaysian halal food manufacturing.</h2>
                <p>
                  HIMAHALAL brings together the halal-certified food manufacturers operating at Kompleks
                  Industri Makanan MARA (KIMAR) in Batu Caves, Kuala Lumpur — from chocolate and ice cream to
                  frozen paratha, café syrups, seasonings and canned classics.
                </p>
                <p>
                  Our goal is simple: make it easy for buyers, distributors and brand owners to find trusted
                  halal producers and OEM partners, and to connect jobseekers with careers in Malaysia's halal
                  food industry.
                </p>
                <div className="hh-pillars">
                  <div><strong>Discover</strong><span>Browse verified company profiles, certifications and products.</span></div>
                  <div><strong>Partner</strong><span>Every manufacturer offers OEM and private-label production.</span></div>
                  <div><strong>Grow</strong><span>Apply directly to the companies for jobs at the complex.</span></div>
                </div>
              </div>
              <div className="hh-stats">
                <div><b>{COMPANIES.length}</b><span>Halal manufacturers</span></div>
                <div><b>{ALL_EXPORTS.size}+</b><span>Export markets</span></div>
                <div><b>{OLDEST}</b><span>Oldest brand founded</span></div>
                <div><b>100%</b><span>Halal certified</span></div>
              </div>
            </div>
          </section>

          {/* ── DIRECTORY ── */}
          <section className="hh-section" id="directory">
            <div className="hh-wrap">
              <span className="hh-eyebrow">Directory</span>
              <h2>Meet the manufacturers</h2>

              <div className="hh-controls">
                <input
                  className="hh-search"
                  placeholder="Search company or brand…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search companies"
                />
                <div className="hh-chips" role="group" aria-label="Filter by category">
                  {CATEGORIES.map((c) => (
                    <button key={c} className={`hh-chip ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {filtered.length > 0 ? (
                <div className="hh-grid">
                  {filtered.map((c, i) => (
                    <button key={c.id} className="hh-card" style={{ animationDelay: `${i * 0.04}s` }} onClick={() => openCompany(c.id)}>
                      <div className="hh-card-img">
                        {coverPhoto(c) && <img src={coverPhoto(c)} alt="" loading="lazy" />}
                        <span className="hh-lot">LOT {c.lot}</span>
                      </div>
                      <div className="hh-card-body">
                        <div className="hh-card-logo"><img src={c.logo} alt={`${c.name} logo`} /></div>
                        <h3>{c.name}</h3>
                        <div className="sub">{c.category} · Since {c.founded}</div>
                        <p className="tag">{c.tagline}</p>
                        <div className="hh-mini">
                          {c.certifications.slice(0, 4).map((b) => <span key={b}>{b}</span>)}
                        </div>
                        <span className="hh-more">View profile →</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="hh-empty">No manufacturers match "{query}".</div>
              )}
            </div>
          </section>

          {/* ── CAREERS ── */}
          <section className="hh-section hh-careers" id="careers">
            <div className="hh-wrap hh-careers-grid">
              <div>
                <span className="hh-eyebrow light">Careers</span>
                <h2>Build your career in halal food.</h2>
                <p>
                  Production, quality assurance, R&amp;D, warehouse, sales and admin — the companies at KIMAR are
                  always looking for good people. Send your application straight to the company you want to join.
                </p>
                <ol className="hh-steps">
                  <li>Choose the company and the position you want.</li>
                  <li>Fill in your details and upload your resume.</li>
                  <li>Submit — your application goes straight to the company's hiring team.</li>
                </ol>
              </div>
              <ApplyForm />
            </div>
          </section>
        </main>
      )}

      {company && (
        <main className="hh-wrap hh-detail" key={company.id}>
          <button className="hh-back" onClick={goSection("directory")}>← Back to directory</button>

          <div className="hh-detail-hero">
            {coverPhoto(company) && <img src={coverPhoto(company)} alt={`${company.name} facility`} />}
            <div className="hh-detail-logo"><img src={company.logo} alt={`${company.name} logo`} /></div>
          </div>

          <div className="hh-detail-head">
            <div className="hh-meta">
              <span className="lot">LOT {company.lot}</span>
              <span>{company.category}</span>
              <span>KIMAR Batu Caves</span>
            </div>
            <h1>{company.name}</h1>
            <p className="legal">{company.legalName} · {company.regNo}</p>
            <p className="tagline">{company.tagline}</p>
            <div className="hh-badges">
              {company.certifications.map((b) => <span key={b}>{b}</span>)}
              {company.oem && <span className="oem">OEM AVAILABLE</span>}
            </div>
            <a href="#apply" className="hh-btn solid small">Apply for a job here</a>
          </div>

          <div className="hh-facts">
            <div><span>Established</span><b>{company.founded}</b></div>
            <div><span>Brands</span><b>{company.brands.length <= 2 ? company.brands.join(", ") : `${company.brands.length} brands`}</b></div>
            <div><span>Export markets</span><b>{company.exports.length > 0 ? `${company.exports.length} countries` : "Domestic"}</b></div>
            <div><span>Certifications</span><b>{company.certifications.length}</b></div>
          </div>

          <div className="hh-detail-cols">
            <div>
              <Block title="About"><p>{company.background}</p></Block>
              {company.vision && <Block title="Vision"><p>{company.vision}</p></Block>}
              {company.mission.length > 0 && (
                <Block title="Mission">
                  {company.mission.length === 1 ? <p>{company.mission[0]}</p> : <ul>{company.mission.map((m, i) => <li key={i}>{m}</li>)}</ul>}
                </Block>
              )}
              {company.whyChooseUs.length > 0 && (
                <Block title={`Why choose ${company.name}`}><ul>{company.whyChooseUs.map((w, i) => <li key={i}>{w}</li>)}</ul></Block>
              )}
              {company.featured && (
                <div className="hh-featured">
                  <span className="hh-eyebrow">Featured product</span>
                  <h3>{company.featured.name}</h3>
                  {company.featured.description && <p>{company.featured.description}</p>}
                  {company.featured.benefits.length > 0 && <ul>{company.featured.benefits.map((b, i) => <li key={i}>{b}</li>)}</ul>}
                </div>
              )}
            </div>
            <aside>
              {company.coreValues.length > 0 && <Block title="Core values"><Pills items={company.coreValues} /></Block>}
              {company.bestSellers.length > 0 && <Block title="Best sellers"><Pills items={company.bestSellers} /></Block>}
              {company.exports.length > 0 && <Block title="Exported to"><Pills items={company.exports} /></Block>}
              <Block title="Contact">
                <div className="hh-contact">
                  {company.contact.person && <p>{company.contact.person}</p>}
                  <p><a href={`mailto:${company.contact.email}`}>{company.contact.email}</a></p>
                  {company.contact.whatsapp && <p><a href={waLink(company.contact.whatsapp)} target="_blank" rel="noreferrer">WhatsApp {company.contact.whatsapp}</a></p>}
                  {company.contact.phone && <p>Tel {company.contact.phone}</p>}
                  {company.contact.socials.map((s) => (
                    <p key={s.kind}>{s.url ? <a href={s.url} target="_blank" rel="noreferrer">{s.kind}: {s.handle}</a> : `${s.kind}: ${s.handle}`}</p>
                  ))}
                  {company.contact.shops?.map((s) => (
                    <p key={s.kind}><a href={s.url} target="_blank" rel="noreferrer">Shop on {s.kind}</a></p>
                  ))}
                </div>
              </Block>
            </aside>
          </div>

          {company.gallery.length > 0 && (
            <Block title="Facility & products">
              <div className="hh-gallery">
                {company.gallery.map((g, i) => (
                  <figure key={i}>
                    <img src={g.src} alt={`${company.name} — ${g.label}`} loading="lazy" />
                    <figcaption>{g.label}</figcaption>
                  </figure>
                ))}
              </div>
            </Block>
          )}

          <section className="hh-apply" id="apply">
            <div>
              <span className="hh-eyebrow light">Careers at {company.name}</span>
              <h2>Want to work here?</h2>
              <p>Upload your resume and your application goes straight to the {company.name} hiring team.</p>
            </div>
            <ApplyForm lockedCompanyId={company.id} />
          </section>

          <nav className="hh-next">
            {(() => {
              const idx = COMPANIES.findIndex((c) => c.id === company.id);
              const prev = COMPANIES[(idx - 1 + COMPANIES.length) % COMPANIES.length];
              const next = COMPANIES[(idx + 1) % COMPANIES.length];
              return (
                <>
                  <button onClick={() => openCompany(prev.id)}><span>←</span> {prev.name}</button>
                  <button onClick={() => openCompany(next.id)}>{next.name} <span>→</span></button>
                </>
              );
            })()}
          </nav>
        </main>
      )}

      <footer className="hh-footer">
        <div className="hh-wrap hh-footer-in">
          <div>
            <div className="hh-logo">HIMA<span>HALAL</span></div>
            <p>Kompleks Industri Makanan MARA (KIMAR), KM13 Batu Caves, Selangor, Malaysia.</p>
          </div>
          <div className="links">
            <a href="#about" onClick={goSection("about")}>About</a>
            <a href="#directory" onClick={goSection("directory")}>Directory</a>
            <a href="#careers" onClick={goSection("careers")}>Careers</a>
          </div>
        </div>
        <div className="hh-wrap hh-copy">© {new Date().getFullYear()} HIMAHALAL. All rights reserved.</div>
      </footer>
    </div>
  );
}

function Block({ title, children }) {
  return (
    <div className="hh-block">
      <h4>{title}</h4>
      {children}
    </div>
  );
}

function Pills({ items }) {
  return <div className="hh-pills">{items.map((v) => <span key={v}>{v}</span>)}</div>;
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.hh-root {
  --cream: #FAF6EF; --paper: #FFFFFF; --ink: #1B2420; --muted: #5F6A64; --line: #E6E0D4;
  --green: #14532D; --green-2: #1F6B3E; --terra: #B4432E; --gold: #C9A227;
  background: var(--cream); color: var(--ink); min-height: 100vh;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden;
}
.hh-root *, .hh-root *::before, .hh-root *::after { box-sizing: border-box; }
.hh-root img { display: block; max-width: 100%; }
html { scroll-behavior: smooth; }
.hh-wrap { max-width: 1140px; margin: 0 auto; padding: 0 24px; }

/* nav */
.hh-nav { position: sticky; top: 0; z-index: 20; background: rgba(250,246,239,.88); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
.hh-nav-in { max-width: 1140px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.hh-logo { font-family: 'Fraunces', serif; font-weight: 800; font-size: 22px; letter-spacing: .02em; color: var(--green); text-decoration: none; }
.hh-logo span { color: var(--terra); }
.hh-nav nav { display: flex; gap: 6px; align-items: center; }
.hh-nav nav a { color: var(--ink); text-decoration: none; font-weight: 500; font-size: 14.5px; padding: 8px 12px; border-radius: 999px; }
.hh-nav nav a:hover { background: #EFE8DA; }
.hh-nav nav a.cta { background: var(--green); color: #fff; }
.hh-nav nav a.cta:hover { background: var(--green-2); }

/* buttons */
.hh-btn { display: inline-flex; align-items: center; gap: 8px; padding: 13px 22px; border-radius: 999px; font-weight: 600; font-size: 15px; text-decoration: none; border: 2px solid transparent; cursor: pointer; font-family: inherit; transition: transform .15s ease, background .15s ease; }
.hh-btn:hover { transform: translateY(-1px); }
.hh-btn.solid { background: var(--terra); color: #fff; }
.hh-btn.solid:hover { background: #9A3624; }
.hh-btn.ghost { border-color: rgba(255,255,255,.8); color: #fff; }
.hh-btn.ghost:hover { background: rgba(255,255,255,.12); }
.hh-btn.small { padding: 10px 18px; font-size: 14px; margin-top: 22px; }

/* hero */
.hh-hero { position: relative; min-height: min(86vh, 720px); display: flex; align-items: flex-end; overflow: hidden; }
.hh-hero > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hh-hero-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,30,20,.15) 0%, rgba(10,30,20,.35) 45%, rgba(8,26,17,.88) 100%); }
.hh-hero-in { position: relative; max-width: 1140px; width: 100%; margin: 0 auto; padding: 0 24px 64px; color: #fff; }
.hh-kicker { display: inline-block; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.3); padding: 7px 12px; border-radius: 999px; backdrop-filter: blur(4px); }
.hh-hero h1 { font-family: 'Fraunces', serif; font-weight: 800; font-size: clamp(38px, 6.4vw, 74px); line-height: 1.02; letter-spacing: -0.02em; margin: 18px 0 0; }
.hh-hero h1 em { font-style: italic; color: #F3D27A; }
.hh-hero p { max-width: 560px; font-size: 17px; line-height: 1.6; margin: 18px 0 0; color: rgba(255,255,255,.9); }
.hh-hero-btns { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }

/* sections */
.hh-section { padding: 88px 0; }
.hh-eyebrow { display: inline-block; font-size: 12px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--terra); }
.hh-eyebrow.light { color: #F3D27A; }
.hh-section h2, .hh-apply h2 { font-family: 'Fraunces', serif; font-weight: 800; font-size: clamp(30px, 4vw, 46px); letter-spacing: -0.02em; line-height: 1.08; margin: 10px 0 0; }

/* about */
.hh-about { background: var(--paper); border-bottom: 1px solid var(--line); }
.hh-about-grid { display: grid; grid-template-columns: 1.25fr 1fr; gap: 56px; align-items: center; }
.hh-about p { font-size: 16.5px; line-height: 1.75; color: #36413B; margin: 18px 0 0; max-width: 580px; }
.hh-pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 30px; }
.hh-pillars div { border-top: 3px solid var(--green); padding-top: 12px; }
.hh-pillars strong { display: block; font-size: 16px; color: var(--green); }
.hh-pillars span { display: block; font-size: 13.5px; line-height: 1.55; color: var(--muted); margin-top: 6px; }
.hh-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.hh-stats div { background: var(--cream); border: 1px solid var(--line); border-radius: 18px; padding: 26px 22px; }
.hh-stats div:nth-child(1) { background: var(--green); color: #fff; border-color: var(--green); }
.hh-stats div:nth-child(4) { background: var(--terra); color: #fff; border-color: var(--terra); }
.hh-stats b { display: block; font-family: 'Fraunces', serif; font-size: 42px; line-height: 1; }
.hh-stats span { display: block; margin-top: 8px; font-size: 13.5px; opacity: .85; }

/* directory */
.hh-controls { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin: 28px 0 26px; }
.hh-search { flex: 1 1 240px; max-width: 320px; background: var(--paper); border: 1px solid var(--line); border-radius: 999px; padding: 12px 18px; font: inherit; font-size: 14.5px; color: var(--ink); outline: none; }
.hh-search:focus-visible { border-color: var(--green); box-shadow: 0 0 0 3px rgba(20,83,45,.15); }
.hh-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.hh-chip { font: inherit; font-size: 13px; font-weight: 500; padding: 8px 14px; border-radius: 999px; border: 1px solid var(--line); background: var(--paper); color: var(--muted); cursor: pointer; }
.hh-chip:hover { color: var(--ink); border-color: var(--ink); }
.hh-chip.active { background: var(--green); border-color: var(--green); color: #fff; }

.hh-grid { display: grid; gap: 22px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 255px), 1fr)); }
.hh-card { all: unset; box-sizing: border-box; cursor: pointer; background: var(--paper); border: 1px solid var(--line); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; transition: transform .2s ease, box-shadow .2s ease; animation: hhRise .5s ease both; }
.hh-card:hover { transform: translateY(-4px); box-shadow: 0 18px 40px -18px rgba(20,40,30,.35); }
.hh-card:focus-visible { outline: 3px solid var(--terra); outline-offset: 2px; }
.hh-card-img { position: relative; aspect-ratio: 16/10; background: #E9E3D6; }
.hh-card-img img { width: 100%; height: 100%; object-fit: cover; }
.hh-lot { position: absolute; top: 12px; left: 12px; font-size: 11px; font-weight: 700; letter-spacing: .08em; background: rgba(255,255,255,.92); color: var(--terra); padding: 5px 9px; border-radius: 999px; }
.hh-card-body { position: relative; padding: 34px 20px 20px; display: flex; flex-direction: column; flex: 1; }
.hh-card-logo { position: absolute; top: -28px; left: 18px; width: 56px; height: 56px; border-radius: 14px; background: #fff; border: 1px solid var(--line); box-shadow: 0 6px 16px -8px rgba(0,0,0,.3); overflow: hidden; }
.hh-card-logo img { width: 100%; height: 100%; object-fit: contain; padding: 5px; }
.hh-card h3 { margin: 0; font-family: 'Fraunces', serif; font-weight: 600; font-size: 20px; }
.hh-card .sub { font-size: 13px; color: var(--muted); margin-top: 4px; }
.hh-card .tag { font-size: 13.5px; line-height: 1.55; color: #3F4A44; margin: 12px 0 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.hh-mini { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 14px; }
.hh-mini span { font-size: 10.5px; font-weight: 600; letter-spacing: .04em; padding: 3px 8px; border-radius: 6px; background: #EAF2EC; color: var(--green); }
.hh-more { margin-top: auto; padding-top: 16px; font-size: 13.5px; font-weight: 600; color: var(--terra); }
.hh-empty { padding: 60px 0; text-align: center; color: var(--muted); }

/* careers */
.hh-careers { background: var(--green); color: #fff; }
.hh-careers-grid { display: grid; grid-template-columns: 1fr 1.15fr; gap: 56px; align-items: start; }
.hh-careers p { color: rgba(255,255,255,.85); font-size: 16.5px; line-height: 1.7; margin: 18px 0 0; }
.hh-steps { margin: 26px 0 0; padding: 0; list-style: none; counter-reset: s; }
.hh-steps li { counter-increment: s; position: relative; padding: 0 0 18px 48px; line-height: 1.55; color: rgba(255,255,255,.92); }
.hh-steps li::before { content: counter(s); position: absolute; left: 0; top: -3px; width: 32px; height: 32px; border-radius: 50%; background: #F3D27A; color: var(--green); font-weight: 700; display: grid; place-items: center; }

/* form */
.hh-form { background: var(--paper); color: var(--ink); border-radius: 22px; padding: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; box-shadow: 0 30px 60px -30px rgba(0,0,0,.45); }
.hh-form label { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.hh-form .full { grid-column: 1 / -1; }
.hh-form label span { font-size: 13px; font-weight: 600; color: #36413B; }
.hh-form input, .hh-form select, .hh-form textarea { font: inherit; font-size: 15px; padding: 11px 13px; border: 1px solid #D8D1C2; border-radius: 12px; background: #FDFBF7; color: var(--ink); outline: none; width: 100%; }
.hh-form textarea { resize: vertical; }
.hh-form input:focus, .hh-form select:focus, .hh-form textarea:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(20,83,45,.14); }
.hh-form-foot { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; }
.hh-hint { font-size: 12.5px; color: var(--muted) !important; margin: 0 !important; flex: 1 1 200px; line-height: 1.5 !important; }
.hh-form label span em { font-style: normal; font-weight: 400; color: var(--muted); }
.hh-form { position: relative; }
.hh-form .hh-hp { position: absolute; left: 0; top: 0; width: 1px; height: 1px; padding: 0; border: 0; overflow: hidden; clip: rect(0 0 0 0); opacity: 0; pointer-events: none; }
.hh-file { position: relative; display: flex; align-items: center; gap: 12px; border: 2px dashed #D8D1C2; border-radius: 14px; padding: 16px; background: #FDFBF7; transition: border-color .15s ease, background .15s ease; }
.hh-file:hover, .hh-file:focus-within { border-color: var(--green); background: #F3F8F4; }
.hh-file.has { border-style: solid; border-color: var(--green); background: #EAF2EC; }
.hh-file input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }
.hh-file .icon { font-size: 22px; }
.hh-file .txt { font-size: 14px !important; font-weight: 400 !important; color: var(--muted) !important; word-break: break-word; }
.hh-file .txt strong { color: var(--green); }
.hh-err { background: #FBEAE6; color: #8E2F1E; border-radius: 12px; padding: 12px 14px; font-size: 14px; line-height: 1.5; }
.hh-btn:disabled { opacity: .6; cursor: progress; transform: none; }
.hh-done { display: block; text-align: center; padding: 40px 28px; }
.hh-done .tick { width: 56px; height: 56px; margin: 0 auto; border-radius: 50%; background: var(--green); color: #fff; font-size: 28px; display: grid; place-items: center; }
.hh-done h3 { font-family: 'Fraunces', serif; font-size: 26px; margin: 16px 0 8px; }
.hh-done p { color: #36413B !important; font-size: 15px !important; margin: 0 0 22px !important; line-height: 1.6; }

/* detail */
.hh-detail { padding-bottom: 40px; animation: hhRise .45s ease both; }
.hh-back { background: none; border: none; cursor: pointer; font: inherit; font-size: 14px; font-weight: 600; color: var(--muted); padding: 22px 0; }
.hh-back:hover { color: var(--terra); }
.hh-detail-hero { position: relative; height: clamp(200px, 34vw, 360px); border-radius: 24px; overflow: visible; background: #E9E3D6; }
.hh-detail-hero > img { width: 100%; height: 100%; object-fit: cover; border-radius: 24px; }
.hh-detail-logo { position: absolute; left: 28px; bottom: -44px; width: 104px; height: 104px; border-radius: 22px; background: #fff; border: 1px solid var(--line); box-shadow: 0 12px 28px -12px rgba(0,0,0,.35); overflow: hidden; }
.hh-detail-logo img { width: 100%; height: 100%; object-fit: contain; padding: 10px; }
.hh-detail-head { padding: 64px 0 0; }
.hh-meta { display: flex; flex-wrap: wrap; gap: 14px; font-size: 12.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.hh-meta .lot { color: var(--terra); }
.hh-detail h1 { font-family: 'Fraunces', serif; font-weight: 800; font-size: clamp(34px, 5.5vw, 60px); letter-spacing: -0.02em; line-height: 1.04; margin: 12px 0 6px; }
.hh-detail .legal { color: var(--muted); font-size: 14px; margin: 0; }
.hh-detail .tagline { font-size: 18.5px; line-height: 1.5; margin: 18px 0 0; max-width: 680px; }
.hh-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
.hh-badges span { font-size: 12px; font-weight: 700; letter-spacing: .05em; padding: 6px 12px; border-radius: 8px; background: #EAF2EC; color: var(--green); }
.hh-badges span.oem { background: #F7E6E1; color: var(--terra); }
.hh-facts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin: 36px 0 10px; }
.hh-facts div { background: var(--paper); border: 1px solid var(--line); border-radius: 16px; padding: 18px; }
.hh-facts span { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); font-weight: 600; }
.hh-facts b { display: block; margin-top: 6px; font-family: 'Fraunces', serif; font-size: 20px; }
.hh-detail-cols { display: grid; grid-template-columns: 1.6fr 1fr; gap: 48px; }
.hh-block { margin-top: 34px; }
.hh-block h4 { margin: 0 0 12px; font-size: 12.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--terra); }
.hh-block p, .hh-block ul { margin: 0; font-size: 15.5px; line-height: 1.75; color: #36413B; }
.hh-block ul { padding-left: 20px; }
.hh-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.hh-pills span { font-size: 13px; padding: 6px 13px; background: var(--paper); border: 1px solid var(--line); border-radius: 999px; }
.hh-contact { background: var(--paper); border: 1px solid var(--line); border-radius: 16px; padding: 18px; }
.hh-contact p { margin: 0 0 6px !important; font-size: 14.5px !important; word-break: break-word; }
.hh-contact a { color: var(--green); font-weight: 600; text-decoration: none; }
.hh-contact a:hover { text-decoration: underline; }
.hh-featured { margin-top: 34px; background: var(--paper); border: 1px solid var(--line); border-left: 5px solid var(--gold); border-radius: 16px; padding: 24px; }
.hh-featured h3 { font-family: 'Fraunces', serif; font-size: 24px; margin: 8px 0 10px; }
.hh-featured p, .hh-featured ul { font-size: 15px; line-height: 1.7; color: #36413B; margin: 0; }
.hh-featured ul { margin-top: 10px; padding-left: 20px; }
.hh-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
.hh-gallery figure { margin: 0; position: relative; border-radius: 14px; overflow: hidden; aspect-ratio: 4/3; background: #E9E3D6; }
.hh-gallery img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s ease; }
.hh-gallery figure:hover img { transform: scale(1.04); }
.hh-gallery figcaption { position: absolute; left: 10px; bottom: 10px; font-size: 11px; font-weight: 600; background: rgba(255,255,255,.92); padding: 4px 9px; border-radius: 999px; }
.hh-apply { margin-top: 56px; background: var(--green); color: #fff; border-radius: 28px; padding: 44px; display: grid; grid-template-columns: 1fr 1.3fr; gap: 40px; align-items: start; scroll-margin-top: 80px; }
.hh-apply p { color: rgba(255,255,255,.85); line-height: 1.7; margin: 14px 0 0; }
.hh-apply strong { color: #F3D27A; word-break: break-all; }
.hh-next { margin-top: 44px; padding-top: 22px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; gap: 16px; }
.hh-next button { background: none; border: none; cursor: pointer; font: inherit; font-weight: 600; font-size: 16px; color: var(--ink); padding: 4px 0; }
.hh-next button span { color: var(--terra); }
.hh-next button:hover { color: var(--terra); }

/* footer */
.hh-footer { background: #10251A; color: rgba(255,255,255,.75); padding: 48px 0 24px; }
.hh-footer .hh-logo { color: #fff; }
.hh-footer-in { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 24px; }
.hh-footer p { margin: 10px 0 0; font-size: 14px; max-width: 420px; line-height: 1.6; }
.hh-footer .links { display: flex; gap: 20px; align-items: center; }
.hh-footer .links a { color: #fff; text-decoration: none; font-weight: 500; font-size: 14.5px; }
.hh-footer .links a:hover { color: #F3D27A; }
.hh-copy { margin-top: 32px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,.12); font-size: 12.5px; }

@keyframes hhRise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .hh-card, .hh-detail { animation: none; } html { scroll-behavior: auto; } }

@media (max-width: 900px) {
  .hh-about-grid, .hh-careers-grid, .hh-detail-cols, .hh-apply { grid-template-columns: 1fr; gap: 36px; }
  .hh-facts { grid-template-columns: repeat(2, 1fr); }
  .hh-apply { padding: 28px 20px; }
}
@media (max-width: 600px) {
  .hh-wrap, .hh-nav-in, .hh-hero-in { padding-left: 16px; padding-right: 16px; }
  .hh-nav-in { gap: 8px; }
  .hh-nav nav { gap: 2px; }
  .hh-nav nav a { padding: 7px 8px; font-size: 13px; }
  .hh-nav nav a.cta { padding: 7px 12px; }
  .hh-logo { font-size: 17px; }
  .hh-section { padding: 60px 0; }
  .hh-hero { min-height: 620px; }
  .hh-hero-in { padding-bottom: 44px; }
  .hh-hero p { font-size: 15.5px; }
  .hh-pillars { grid-template-columns: 1fr; }
  .hh-stats b { font-size: 34px; }
  .hh-search { flex-basis: 100%; max-width: none; }
  .hh-chips { flex-wrap: nowrap; overflow-x: auto; width: 100%; padding-bottom: 6px; scrollbar-width: none; }
  .hh-chip { flex: 0 0 auto; }
  .hh-form { grid-template-columns: 1fr; padding: 20px; }
  .hh-detail-logo { left: 16px; width: 84px; height: 84px; bottom: -36px; }
  .hh-detail-head { padding-top: 52px; }
  .hh-gallery { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .hh-next { flex-direction: column; }
  .hh-next button:last-child { text-align: right; }
}
`;
