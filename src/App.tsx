import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage, LoginPage } from "./AuthPages";

const features = [
  { number: "01", title: "Amal Yaumi", text: "Catat ibadah dan kebiasaan baik. Lihat perkembangan diri dari hari ke hari.", icon: "✦" },
  { number: "02", title: "Mentoring", text: "Terhubung dengan pembina dan kelompok untuk tumbuh bersama.", icon: "◉" },
  { number: "03", title: "Perpustakaan", text: "Akses Al-Qur'an, hadis, materi kajian, dan bacaan pilihan.", icon: "▤" },
  { number: "04", title: "Kegiatan", text: "Ikuti agenda, event, dan aktivitas komunitas.", icon: "⌁" },
  { number: "05", title: "Aksi Sosial", text: "Dukung program donasi dan kegiatan yang memberi manfaat.", icon: "♡" },
  { number: "06", title: "Pengembangan Diri", text: "Bangun kebiasaan sehat, belajar, dan berinovasi.", icon: "↗" },
];

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main>
      <header className="nav-wrap">
        <nav className="nav container">
          <a className="brand" href="#" aria-label="AKSANI beranda"><span className="brand-mark">A</span><span>AKSANI<span className="brand-dot">.</span></span></a>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Buka navigasi">☰</button>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#tentang" onClick={() => setMenuOpen(false)}>Tentang</a>
            <a href="#fitur" onClick={() => setMenuOpen(false)}>Fitur</a>
            <a href="#nilai" onClick={() => setMenuOpen(false)}>Nilai Kami</a>
            <a className="nav-cta" href="mailto:halo@aksani.id?subject=Informasi%20AKSANI">Hubungi Kami <span>↗</span></a>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-pattern" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> RUANG BERTUMBUH DALAM KEBAIKAN</div>
            <h1>Mulai dari diri.<br /><em>Bergerak</em> bersama.</h1>
            <p className="hero-lead">Satu ruang untuk merawat ibadah, membangun kebiasaan baik, berbagi manfaat, dan bertumbuh bersama komunitas.</p>
            <div className="hero-actions">
              <a className="button button-light" href="#fitur">Jelajahi AKSANI <span>↗</span></a>
              <a className="text-link" href="#tentang">Kenali visi kami <span>↓</span></a>
            </div>
            <div className="hero-note"><span className="note-icon">✳</span><span>Langkah kecil, kebaikan yang berkelanjutan.</span></div>
          </div>
          <div className="hero-art" aria-label="Ilustrasi pertumbuhan dan kebersamaan">
            <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
            <div className="art-sun" />
            <div className="art-card card-top"><span className="art-card-icon">✦</span><span><b>Niat baik</b><small>Dimulai hari ini</small></span></div>
            <div className="art-arch"><div className="arch-inner"><div className="arch-leaf leaf-a">❧</div><div className="arch-leaf leaf-b">❧</div><div className="arch-center">اَلْخَيْرُ<br/><small>خيرٌ</small></div></div></div>
            <div className="art-card card-bottom"><span className="mini-avatars"><i>ن</i><i>م</i><i>ع</i></span><span><b>Tumbuh bersama</b><small>Saling menguatkan</small></span></div>
            <div className="art-caption">EST. WITH PURPOSE <span>✳</span></div>
          </div>
        </div>
        <div className="hero-bottom container"><span>01 / 03</span><span className="hero-bottom-line" /><span>IBADAH · AKSI · KOLABORASI</span></div>
      </section>

      <section className="intro section-pad" id="tentang">
        <div className="container intro-grid">
          <div><div className="eyebrow dark"><span className="eyebrow-line" /> TENTANG AKSANI</div><h2>Kebaikan lebih berarti<br/>ketika <em>dijaga bersama.</em></h2></div>
          <div className="intro-text"><p>AKSANI hadir sebagai ruang digital yang membantu individu dan komunitas mengelola perjalanan kebaikan secara lebih terarah.</p><p>Bukan tentang menjadi sempurna dalam sehari. Melainkan tentang menjaga niat, konsisten melangkah, dan saling menguatkan dalam prosesnya.</p><a className="under-link" href="#nilai">Temukan nilai yang kami bawa <span>↗</span></a></div>
        </div>
      </section>

      <section className="features section-pad" id="fitur">
        <div className="container">
          <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> EKOSISTEM KEBAIKAN</div><h2>Satu ruang,<br/><em>banyak kebaikan.</em></h2></div><p>Perjalanan bertumbuh yang saling terhubung. Pilih langkah baikmu, lalu rawat konsistensinya.</p></div>
          <div className="feature-grid">{features.map((f) => <article className="feature-card" key={f.number}><div className="feature-top"><span>{f.number}</span><span className="feature-icon">{f.icon}</span></div><h3>{f.title}</h3><p>{f.text}</p><span className="feature-arrow">↗</span></article>)}</div>
        </div>
      </section>

      <section className="values section-pad" id="nilai"><div className="container values-inner"><div className="eyebrow"><span className="eyebrow-line" /> CARA KAMI BERTUMBUH</div><h2>Istiqamah dalam proses.<br/><em>Bermanfaat dalam langkah.</em></h2><div className="value-points"><div><b>01</b><span><strong>Terarah</strong><small>Memulai dengan niat dan tujuan yang jelas.</small></span></div><div><b>02</b><span><strong>Bertumbuh</strong><small>Belajar, memperbaiki diri, dan menjaga konsistensi.</small></span></div><div><b>03</b><span><strong>Berkolaborasi</strong><small>Saling mendukung untuk manfaat yang lebih luas.</small></span></div></div></div></section>

      <section className="closing section-pad"><div className="container closing-inner"><div className="closing-mark">A.</div><div><div className="eyebrow dark"><span className="eyebrow-line" /> MULAI PERJALANANMU</div><h2>Setiap kebaikan<br/>punya <em>permulaan.</em></h2></div><a className="button button-dark" href="mailto:halo@aksani.id?subject=Bergabung%20dengan%20AKSANI">Terhubung dengan kami <span>↗</span></a></div></section>

      <footer><div className="container footer-inner"><a className="brand footer-brand" href="#"><span className="brand-mark">A</span><span>AKSANI<span className="brand-dot">.</span></span></a><span>© {new Date().getFullYear()} AKSANI. Bertumbuh dalam kebaikan.</span><a href="#top">Kembali ke atas ↑</a></div></footer>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
