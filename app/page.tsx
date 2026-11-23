"use client";

import { useEffect, useMemo, useState } from "react";

const worship = [
  { id: "subuh", title: "Salat Subuh", detail: "Awali hari dengan mengingat Allah", icon: "🌅", group: "Ibadah wajib" },
  { id: "dzuhur", title: "Salat Zuhur", detail: "Jeda sejenak dari kesibukan", icon: "☀️", group: "Ibadah wajib" },
  { id: "ashar", title: "Salat Asar", detail: "Jaga salat di tengah aktivitas", icon: "🌤️", group: "Ibadah wajib" },
  { id: "maghrib", title: "Salat Magrib", detail: "Syukuri nikmat hari ini", icon: "🌇", group: "Ibadah wajib" },
  { id: "isya", title: "Salat Isya", detail: "Tutup hari dengan ketaatan", icon: "🌙", group: "Ibadah wajib" },
  { id: "quran", title: "Tilawah Al-Qur'an", detail: "Luangkan waktu bersama Al-Qur'an", icon: "📖", group: "Amal sunnah" },
  { id: "dzikir", title: "Dzikir pagi & petang", detail: "Basahi lisan dengan dzikir", icon: "📿", group: "Amal sunnah" },
  { id: "sedekah", title: "Sedekah", detail: "Berbagi meski dalam jumlah kecil", icon: "🤲", group: "Amal sunnah" },
  { id: "doa", title: "Doa & istighfar", detail: "Perbanyak doa dan memohon ampun", icon: "✨", group: "Amal sunnah" }
];

const todayKey = () => new Date().toLocaleDateString("en-CA");

export default function Home() {
  const [done, setDone] = useState<string[]>([]);
  const [date, setDate] = useState(todayKey());
  const [pages, setPages] = useState("0");
  const [goal, setGoal] = useState("2");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("amalyaumi-" + todayKey());
    if (saved) {
      const parsed = JSON.parse(saved);
      setDone(parsed.done ?? []);
      setPages(String(parsed.pages ?? "0"));
      setGoal(String(parsed.goal ?? "2"));
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("amalyaumi-" + date, JSON.stringify({ done, pages, goal }));
  }, [done, pages, goal, date, mounted]);

  const percent = Math.round((done.length / worship.length) * 100);
  const completedMandatory = worship.filter(x => x.group === "Ibadah wajib" && done.includes(x.id)).length;
  const dateLabel = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(date + "T12:00:00"));
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";
  }, []);

  function toggle(id: string) {
    setDone(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-mark">آ</span><span>amal<span className="brand-light">yaumi</span></span></a>
        <span className="top-pill"><span className="live-dot" /> Catatan kebaikanmu</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">LANGKAH KECIL, ISTIQAMAH SETIAP HARI</p>
          <h1>{greeting},<br /><em>sahabat kebaikan.</em></h1>
          <p className="hero-text">Mulai hari dengan niat baik. Jaga amal, catat perjalanan, dan terus bertumbuh menjadi lebih baik.</p>
          <div className="date-chip">☀️ &nbsp;{dateLabel}</div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="sun-glow" />
          <div className="moon">☾</div>
          <div className="arch"><div className="arch-inner"><span>بِسْمِ اللَّهِ</span><small>Awali dengan niat</small></div></div>
          <span className="star star-one">✦</span><span className="star star-two">✧</span><span className="star star-three">✦</span>
        </div>
      </section>

      <section className="stats-grid" aria-label="Ringkasan amal">
        <article className="stat-card progress-card">
          <div className="stat-heading"><span>Progres amal hari ini</span><span className="stat-icon">🌱</span></div>
          <div className="progress-row"><strong>{percent}%</strong><span>{done.length} dari {worship.length} amalan</span></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: percent + "%" }} /></div>
          <p className="stat-note">{percent === 100 ? "Masya Allah, semua target tercapai!" : "Terus jaga semangat, satu per satu."}</p>
        </article>
        <article className="stat-card">
          <div className="stat-heading"><span>Salat wajib</span><span className="stat-icon">🕌</span></div>
          <div className="stat-number">{completedMandatory}<small>/ 5</small></div>
          <p className="stat-note">Salat yang sudah ditandai</p>
        </article>
        <article className="stat-card">
          <div className="stat-heading"><span>Tilawah hari ini</span><span className="stat-icon">📚</span></div>
          <div className="stat-number">{pages}<small> halaman</small></div>
          <p className="stat-note">Target {goal} halaman</p>
        </article>
      </section>

      <div className="content-grid">
        <section className="panel checklist-panel">
          <div className="section-head">
            <div><p className="eyebrow">JAGA KONSISTENSI</p><h2>Checklist amal harian</h2><p className="muted">Tandai amalan yang sudah kamu kerjakan.</p></div>
            <span className="count-badge">{done.length}/{worship.length}</span>
          </div>
          <div className="group-label">IBADAH WAJIB</div>
          <div className="task-list">
            {worship.filter(x => x.group === "Ibadah wajib").map(item => <button key={item.id} className={"task " + (done.includes(item.id) ? "task-done" : "")} onClick={() => toggle(item.id)}>
              <span className="task-icon">{item.icon}</span><span className="task-copy"><strong>{item.title}</strong><small>{item.detail}</small></span><span className="check">{done.includes(item.id) ? "✓" : ""}</span>
            </button>)}
          </div>
          <div className="group-label second-label">AMAL SUNNAH & KEBAIKAN</div>
          <div className="task-list">
            {worship.filter(x => x.group === "Amal sunnah").map(item => <button key={item.id} className={"task " + (done.includes(item.id) ? "task-done" : "")} onClick={() => toggle(item.id)}>
              <span className="task-icon">{item.icon}</span><span className="task-copy"><strong>{item.title}</strong><small>{item.detail}</small></span><span className="check">{done.includes(item.id) ? "✓" : ""}</span>
            </button>)}
          </div>
        </section>

        <aside className="side-column">
          <section className="panel quran-panel">
            <p className="eyebrow">TEMAN TILAWAH</p><h2>Lebih dekat dengan Al-Qur'an</h2>
            <p className="muted">Catat jumlah halaman yang kamu baca hari ini.</p>
            <div className="quran-inputs">
              <label>Halaman dibaca<input type="number" min="0" max="604" value={pages} onChange={e => setPages(e.target.value)} /></label>
              <label>Target harian<input type="number" min="1" max="604" value={goal} onChange={e => setGoal(e.target.value)} /></label>
            </div>
            <div className="quran-progress"><div style={{ width: Math.min(100, Number(pages) / Math.max(1, Number(goal)) * 100) + "%" }} /></div>
            <p className="quran-foot">{Number(pages) >= Number(goal) ? "Alhamdulillah, target tilawah tercapai." : Math.max(0, Number(goal) - Number(pages)) + " halaman lagi menuju target."}</p>
          </section>
          <section className="quote-card">
            <span className="quote-mark">“</span>
            <p>Amalan yang paling dicintai Allah adalah amalan yang kontinu walaupun sedikit.</p>
            <small>HR. Bukhari dan Muslim</small>
          </section>
          <section className="panel note-panel">
            <span className="note-icon">💚</span><div><strong>Ingat, setiap proses berarti</strong><p className="muted">Tidak harus sempurna hari ini. Yang penting terus berusaha dan kembali memperbaiki diri.</p></div>
          </section>
        </aside>
      </div>

      <footer><span className="footer-brand">amalyaumi</span><span>Semoga setiap langkah menjadi kebaikan.</span><span>بَارَكَ اللَّهُ فِيكَ</span></footer>
    </main>
  );
}
