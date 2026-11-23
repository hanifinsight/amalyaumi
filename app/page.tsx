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
  const [date] = useState(todayKey());
  const [pages, setPages] = useState("0");
  const [goal, setGoal] = useState("2");
  const [mounted, setMounted] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const percent = Math.round((done.length / worship.length) * 100);
  const completedMandatory = worship.filter(x => x.group === "Ibadah wajib" && done.includes(x.id)).length;
  const dateLabel = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(date + "T12:00:00"));
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";
  }, []);

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

  function toggle(id: string) {
    setDone(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  }

  const faqs = [
    ["Apa itu Amal Yaumi?", "Amal Yaumi adalah teman digital untuk membantu mencatat kebiasaan ibadah dan kebaikan harian agar lebih teratur dan konsisten."],
    ["Apakah aplikasi ini gratis?", "Versi awal Amal Yaumi dapat digunakan secara gratis. Fitur lanjutan dapat dikembangkan sesuai kebutuhan pengguna."],
    ["Apakah catatan saya tersimpan?", "Pada versi awal ini, catatan tersimpan di browser pada perangkat yang digunakan. Sinkronisasi akun antarperangkat belum tersedia."]
  ];

  return (
    <main className="landing-shell">
      <header className="landing-nav">
        <a className="brand" href="#beranda"><span className="brand-mark">آ</span><span>amal<span className="brand-light">yaumi</span></span></a>
        <nav className="nav-links"><a href="#fitur">Fitur</a><a href="#cara-kerja">Cara kerja</a><a href="#faq">FAQ</a></nav>
        <a className="nav-cta" href="#mulai">Mulai sekarang <span>↗</span></a>
      </header>

      <section className="landing-hero" id="beranda">
        <div className="hero-orb orb-a" /><div className="hero-orb orb-b" />
        <div className="landing-hero-copy">
          <div className="hero-kicker"><span>✦</span> TEMAN BERTUMBUH DALAM KEBAIKAN</div>
          <h1>Jadikan kebaikan<br />sebagai <em>kebiasaan.</em></h1>
          <p className="landing-lead">Temani perjalanan ibadahmu. Catat amal harian, jaga konsistensi, dan tumbuh menjadi pribadi yang lebih baik — satu langkah setiap hari.</p>
          <div className="hero-actions"><a className="primary-cta" href="#mulai">Mulai perjalanan <span>→</span></a><a className="text-cta" href="#fitur">Jelajahi fitur <span>↓</span></a></div>
          <div className="hero-trust"><span className="trust-avatars">✿　☾　✦</span><span>Mulai dari langkah kecil, setiap hari.</span></div>
        </div>
        <div className="hero-visual">
          <div className="visual-halo" />
          <div className="visual-moon">☾</div><span className="visual-star s1">✦</span><span className="visual-star s2">✧</span>
          <div className="visual-arch"><div className="visual-arch-inner"><span className="arabic">وَاذْكُرُوا اللَّهَ</span><span className="arch-line" /><small>Ingat Allah dalam setiap langkah</small></div></div>
          <div className="floating-note note-top"><span>🌿</span><div><b>Istiqamah</b><small>Dimulai dari hari ini</small></div></div>
          <div className="floating-note note-bottom"><span>📖</span><div><b>Amal harian</b><small>Catat setiap kebaikan</small></div></div>
        </div>
      </section>

      <section className="landing-stats"><div><b>01</b><span>Mulai dari diri sendiri</span></div><i /><div><b>02</b><span>Catat dengan sederhana</span></div><i /><div><b>03</b><span>Jaga agar tetap konsisten</span></div></section>

      <section className="features-section" id="fitur">
        <div className="section-intro"><p className="eyebrow">LEBIH TERARAH, LEBIH BERMAKNA</p><h2>Kebaikan kecil yang<br /><em>terjaga setiap hari.</em></h2><p>Semua yang kamu perlukan untuk membangun rutinitas ibadah dalam satu tempat yang sederhana.</p></div>
        <div className="feature-grid">
          <article className="feature-card feature-main"><span className="feature-icon">☑</span><span className="feature-number">01 / TRACKER</span><h3>Checklist ibadah harian</h3><p>Tandai salat, tilawah, dzikir, dan amal baik yang sudah kamu lakukan.</p><div className="mini-checks"><span>✓ Salat wajib</span><span>✓ Tilawah</span><span>○ Sedekah</span></div></article>
          <article className="feature-card"><span className="feature-icon">📈</span><span className="feature-number">02 / PROGRESS</span><h3>Pantau perkembangan</h3><p>Lihat progres harian agar kamu lebih mudah menjaga kebiasaan baik.</p><div className="mini-bars"><i/><i/><i/><i/><i/><i/><i/></div></article>
          <article className="feature-card"><span className="feature-icon">📖</span><span className="feature-number">03 / TILAWAH</span><h3>Target tilawah</h3><p>Atur target halaman Al-Qur'an dan catat bacaan setiap hari.</p><div className="mini-book">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div></article>
          <article className="feature-card"><span className="feature-icon">🌱</span><span className="feature-number">04 / REFLEKSI</span><h3>Bangun istiqamah</h3><p>Fokus pada proses. Tidak perlu sempurna, cukup terus berusaha.</p><div className="mini-quote">“Sedikit tetapi konsisten.”</div></article>
        </div>
      </section>

      <section className="how-section" id="cara-kerja">
        <div className="how-art"><div className="how-circle">بِسْمِ<br/>اللَّهِ</div><span className="how-spark sp1">✧</span><span className="how-spark sp2">✦</span></div>
        <div className="how-copy"><p className="eyebrow">MUDAH DIMULAI</p><h2>Tiga langkah untuk<br /><em>memulai perubahan.</em></h2>
          <div className="how-step"><b>01</b><div><strong>Tentukan niat dan target</strong><p>Pilih amalan yang ingin kamu jaga dan tentukan target yang realistis.</p></div></div>
          <div className="how-step"><b>02</b><div><strong>Catat setiap hari</strong><p>Buka checklist dan tandai amalan yang sudah dikerjakan.</p></div></div>
          <div className="how-step"><b>03</b><div><strong>Evaluasi dan lanjutkan</strong><p>Lihat perkembanganmu. Besok, lanjutkan lagi dengan semangat baru.</p></div></div>
          <a className="primary-cta" href="#mulai">Coba sekarang <span>→</span></a>
        </div>
      </section>

      <section className="start-section" id="mulai">
        <div className="start-heading"><p className="eyebrow">MULAI DARI HARI INI</p><h2>Bagaimana perjalanan<br /><em>kebaikanmu hari ini?</em></h2><p>Ini contoh tracker yang bisa langsung kamu coba. Tandai amalanmu dan lihat progres berubah.</p></div>
        <div className="tracker-demo">
          <div className="demo-head"><div><span className="demo-label">AMAL HARI INI</span><h3>{greeting}, sahabat kebaikan.</h3><small>{dateLabel}</small></div><div className="demo-progress"><strong>{percent}%</strong><span>tercapai</span></div></div>
          <div className="demo-progress-track"><i style={{width: percent + "%"}} /></div>
          <div className="demo-summary"><span>🌿 {done.length} dari {worship.length} amalan ditandai</span><span>🕌 Salat {completedMandatory}/5</span></div>
          <div className="demo-tasks">{worship.map(item => <button key={item.id} className={"demo-task " + (done.includes(item.id) ? "is-done" : "")} onClick={() => toggle(item.id)}><span>{item.icon}</span><b>{item.title}</b><i>{done.includes(item.id) ? "✓" : "+"}</i></button>)}</div>
          <div className="demo-tilawah"><div><b>📖 Target tilawah</b><small>Catat halaman yang kamu baca</small></div><div className="tilawah-controls"><button onClick={() => setPages(String(Math.max(0, Number(pages)-1)))}>−</button><strong>{pages}</strong><button onClick={() => setPages(String(Math.min(604, Number(pages)+1)))}>+</button><span>/</span><input aria-label="Target halaman tilawah" type="number" min="1" max="604" value={goal} onChange={e => setGoal(e.target.value)} /></div></div>
          <p className="demo-disclaimer">Catatan tersimpan di browser perangkat ini. Gunakan sebagai pengingat pribadi.</p>
        </div>
      </section>

      <section className="quote-banner"><span>“</span><div><p>Amalan yang paling dicintai Allah adalah amalan yang kontinu walaupun sedikit.</p><small>HR. Bukhari dan Muslim</small></div><b>وَاصْبِرْ</b></section>

      <section className="faq-section" id="faq"><div><p className="eyebrow">ADA YANG INGIN DITANYAKAN?</p><h2>Kenali Amal Yaumi<br /><em>lebih dekat.</em></h2></div><div className="faq-list">{faqs.map((faq, index) => <div className={"faq-item " + (faqOpen === index ? "faq-active" : "")} key={faq[0]}><button onClick={() => setFaqOpen(faqOpen === index ? null : index)}><span>{faq[0]}</span><b>{faqOpen === index ? "−" : "+"}</b></button>{faqOpen === index && <p>{faq[1]}</p>}</div>)}</div></section>

      <section className="closing-cta"><p className="eyebrow">SATU HARI, SATU LANGKAH</p><h2>Mulai kebiasaan baikmu<br /><em>hari ini.</em></h2><a className="light-cta" href="#mulai">Mulai catat amal <span>→</span></a></section>

      <footer className="landing-footer"><a className="brand" href="#beranda"><span className="brand-mark">آ</span><span>amal<span className="brand-light">yaumi</span></span></a><span>Teman bertumbuh dalam kebaikan.</span><span>بَارَكَ اللَّهُ فِيكَ</span></footer>
    </main>
  );
}
