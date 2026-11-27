import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, authClient } from "./lib/auth-client";

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = mode === "register"
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password });
      if (result.error) throw new Error(result.error.message ?? "Autentikasi gagal.");
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  async function signInGoogle() {
    setBusy(true);
    setError("");
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
      });
      if (result.error) throw new Error(result.error.message ?? "Google sign-in belum tersedia.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in belum tersedia.");
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-top"><a className="brand" href="/"><span className="brand-mark">A</span><span>AKSANI<span className="brand-dot">.</span></span></a><a href="/" className="auth-back">← Kembali ke beranda</a></div>
      <section className="auth-card">
        <div className="eyebrow dark"><span className="eyebrow-line" /> RUANG BERTUMBUH</div>
        <h1>{mode === "login" ? "Selamat datang kembali." : "Mulai perjalanan baikmu."}</h1>
        <p className="auth-subtitle">{mode === "login" ? "Masuk untuk melanjutkan langkah kebaikanmu." : "Buat akun dan mulai bertumbuh bersama AKSANI."}</p>
        <form onSubmit={submit} className="auth-form">
          {mode === "register" && <label>Nama lengkap<input value={name} onChange={e => setName(e.target.value)} autoComplete="name" required placeholder="Nama lengkap" /></label>}
          <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required placeholder="nama@email.com" /></label>
          <label>Kata sandi<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required placeholder="Minimal 8 karakter" /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="button button-dark auth-submit" disabled={busy}>{busy ? "Memproses..." : mode === "login" ? "Masuk ke AKSANI" : "Buat akun"} <span>↗</span></button>
        </form>
        <div className="auth-divider"><span>atau</span></div>
        <button className="google-button" onClick={signInGoogle} disabled={busy}><span className="google-g">G</span> Lanjutkan dengan Google</button>
        <p className="auth-switch">{mode === "login" ? "Belum memiliki akun?" : "Sudah memiliki akun?"} <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>{mode === "login" ? "Daftar sekarang" : "Masuk"}</button></p>
        <p className="auth-legal">Dengan melanjutkan, kamu menyetujui ketentuan penggunaan dan kebijakan privasi AKSANI.</p>
      </section>
      <p className="auth-foot">© {new Date().getFullYear()} AKSANI · Bertumbuh dalam kebaikan.</p>
    </main>
  );
}

type Category = { id: string; name: string; slug: string };
type Entry = { id: string; activity_name: string; quantity: number; unit_label: string; is_completed: boolean };

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const [profile, setProfile] = useState<{ full_name: string; role: string } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activityName, setActivityName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function loadData() {
    const [meResponse, categoriesResponse, entriesResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/api/me`, { credentials: "include" }),
      fetch(`${API_BASE_URL}/api/activity-categories`, { credentials: "include" }),
      fetch(`${API_BASE_URL}/api/daily-entries`, { credentials: "include" }),
    ]);
    if (meResponse.ok) {
      const data = await meResponse.json();
      setProfile(data.profile);
    }
    if (categoriesResponse.ok) {
      const data = await categoriesResponse.json();
      setCategories(data.data);
    }
    if (entriesResponse.ok) {
      const data = await entriesResponse.json();
      setEntries(data.data);
    }
  }

  useEffect(() => {
    if (!isPending && !session) navigate("/login");
  }, [isPending, session, navigate]);

  useEffect(() => {
    if (session) void loadData().catch(() => setNotice("Tidak dapat memuat data. Periksa koneksi API."));
  }, [session]);

  async function addEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activityName.trim()) return;
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/daily-entries`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityName, categoryId: categoryId || null, quantity: 1, unitLabel: "kali", isCompleted: true }),
      });
      if (!response.ok) throw new Error("Catatan belum berhasil disimpan.");
      setActivityName("");
      await loadData();
      setNotice("Catatan kebaikan berhasil disimpan.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await authClient.signOut();
    navigate("/login");
  }

  if (isPending || !session) return <main className="auth-page"><p className="auth-loading">Menyiapkan ruang AKSANI...</p></main>;

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar">
        <a className="brand" href="/"><span className="brand-mark">A</span><span>AKSANI<span className="brand-dot">.</span></span></a>
        <div className="sidebar-label">RUANG PRIBADI</div>
        <a className="sidebar-link active" href="/dashboard">✦ <span>Ringkasan</span></a>
        <a className="sidebar-link" href="#amal">◉ <span>Amal Yaumi</span></a>
        <a className="sidebar-link" href="#mentoring">⌁ <span>Mentoring</span></a>
        <a className="sidebar-link" href="#perpustakaan">▤ <span>Perpustakaan</span></a>
        <a className="sidebar-link" href="#kegiatan">◇ <span>Kegiatan</span></a>
        <div className="sidebar-bottom"><div className="profile-mini"><span>{(profile?.full_name ?? session.user.name).slice(0,1).toUpperCase()}</span><div><b>{profile?.full_name ?? session.user.name}</b><small>{profile?.role ?? "member"}</small></div></div><button onClick={logout}>Keluar ↗</button></div>
      </aside>
      <section className="dashboard-main">
        <header className="dashboard-header"><div><div className="eyebrow dark"><span className="eyebrow-line" /> RUANG BERTUMBUH</div><h1>Assalamu’alaikum, {profile?.full_name ?? session.user.name.split(" ")[0]}.</h1><p>Setiap langkah baik layak untuk dijaga.</p></div><div className="dashboard-date">{new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long"}).format(new Date())}</div></header>
        <div className="dashboard-stats"><article><span>CATATAN HARI INI</span><strong>{entries.length}</strong><small>aktivitas tercatat</small></article><article><span>SELESAI</span><strong>{entries.filter(e => e.is_completed).length}</strong><small>langkah kebaikan</small></article><article><span>PERAN</span><strong className="role-stat">{profile?.role ?? "member"}</strong><small>di komunitas AKSANI</small></article></div>
        <div className="dashboard-content">
          <section className="dashboard-panel" id="amal"><div className="panel-heading"><div><span className="panel-kicker">KONSISTENSI HARIAN</span><h2>Catat amal hari ini</h2></div><span className="panel-spark">✦</span></div>
            <form className="entry-form" onSubmit={addEntry}><label>Aktivitas baik<input value={activityName} onChange={e => setActivityName(e.target.value)} placeholder="Contoh: Membaca Al-Qur’an" required /></label><label>Kategori<select value={categoryId} onChange={e => setCategoryId(e.target.value)}><option value="">Pilih kategori</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><button className="button button-dark" disabled={busy}>{busy ? "Menyimpan..." : "Simpan catatan"} <span>↗</span></button></form>
            {notice && <p className="dashboard-notice">{notice}</p>}
            <div className="entry-list"><h3>Aktivitas hari ini</h3>{entries.length ? entries.map(entry => <div className="entry-row" key={entry.id}><span className="entry-check">{entry.is_completed ? "✓" : "·"}</span><b>{entry.activity_name}</b><small>{entry.quantity} {entry.unit_label}</small></div>) : <p className="empty-state">Belum ada catatan hari ini. Mulai dari satu langkah kecil.</p>}</div>
          </section>
          <section className="dashboard-panel dashboard-quote"><span className="panel-kicker">PENGINGAT HARI INI</span><div className="quote-mark">“</div><h2>Amal yang paling dicintai Allah adalah yang dilakukan secara terus-menerus meskipun sedikit.</h2><p>HR. Bukhari dan Muslim</p></section>
        </div>
        <footer className="dashboard-footer">AKSANI · Bertumbuh dalam kebaikan</footer>
      </section>
    </main>
  );
}
