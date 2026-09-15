# GridCraft — Collaborative Grid-Based Game Editor

**Live**: https://gridcraft.zwart.qzz.io · **Repo**: https://github.com/Zwart04/gridcraft

Collaborative grid-based game level editor dengan real-time multi-user sync (BroadcastChannel), AI level suggestion, GPU-accelerated WebGL grid simulation, dan export pipeline — bukan game CRUD biasa.

## Fitur (8)

### 1. Grid Editor Real-Time Kolaboratif
- Grid 2D editing collaborative dengan BroadcastChannel API untuk sync multi-tab real-time
- Multi-user cursor presence indicator (warna unik per sesi)
- Cell palette: wall, floor, spike, coin, exit, player spawn, hazard — drag-drop ke grid
- Undo/redo stack per user (hingga 50 step)
- Grid size configurable: 8×8 sampai 64×64, dengan zoom/pan canvas

### 2. AI Level Suggestion Engine
- Mock LLM heuristic yang analisis grid pattern dan suggest improvement
- 3 mode: balance checker (jika terlalu mudah/sulit), symmetry suggester, flow optimizer
- Generate alternative layout berdasarkan current grid state
- Throttle 30 detik antar request, hasil jadi di editable preview grid

### 3. GPU-Accelerated Grid Simulation (WebGL)
- Web Worker offscreen simulation: test level dengan AI player agent jalan otomatis
- Canvas/WebGL render grid dengan highlight animasi pathfinding agent
- Simulasi 60fps di grid besar (64×64) tanpa blocking main thread
- Visualisasi: agent path line, collected coins, death count, completion time

### 4. Level Version History & Auto-Save
- Auto-save setiap 30 detik ke localStorage + sessionStorage fallback
- Version timeline: list semua save point dengan timestamp + thumbnail grid mini
- Restore versi lama dengan satu klik, dengan diff highlight perubahan
- Export version history sebagai JSON snapshot

### 5. Export Pipeline (PNG + WebM + JSON)
- Export grid sebagai PNG 800×450 image clean (PIL-style gradient header + organized grid dots)
- Export level sebagai JSON portable (shareable via URL param encoded base64)
- Export animasi WebM: simulate level play lalu rekam sebagai video halaman (clean high-res frame-based)
- Copy shareable URL ke clipboard (fallback: prompt manual copy)

### 6. Level Gallery & Search
- Publik gallery semua level yang di-export (localStorage-based, per-browser)
- Search by nama, tag, difficulty (easy/medium/hard/custom), dan grid size
- Filter: most played, newest, most liked (mock like counter)
- Detail page tiap level: grid preview, stats, creator, share link

### 7. Bilingual Dashboard (EN/ID)
- Toggle EN/ID full halaman: Dashboard↔Dasbor, Editor↔Editor, Gallery↔Galeri
- t.* dictionary pattern, semua label/placeholder/button terjemahan
- Lingkungan dark/light mode toggle independent dari bahasa
- Default bahasa detect dari browser `navigator.language`

### 8. Auth + Analytics + Finance Journal
- Login/register local-first (localStorage hf_user/hf_users), email+pwd validation, logout
- Dashboard stats: total level dibuat, levels played, export count, session time
- Recharts analytics: level creation trend (bar), difficulty distribution (pie), session heatmap (calendar)
- Auto finance journal: tiap export level dikategorikan sebagai "creative output" dengan mock nilai — jurnal terintegrasi di dashboard

## Route (14)

| Route | Deskripsi |
|---|---|
| `/` | Landing page — hero, fitur highlight, CTA ke editor |
| `/dashboard` / `/dasbor` | Dashboard EN/ID — stats, chart, finance journal, recent activity |
| `/editor` / `/editor` | Grid editor utama — kolaboratif, AI suggest, simulasi, export |
| `/editor/[id]` | Editor level spesifik dengan URL param encoded grid state |
| `/gallery` / `/galeri` | Level gallery publik — search, filter, list level |
| `/gallery/[id]` | Detail level — preview grid, stats, share, like |
| `/analytics` / `/analitik` | Recharts analytics dashboard — trend, distribution, heatmap |
| `/analytics/session` | Session time breakdown per user per hari (chart) |
| `/finance` / `/keuangan` | Auto finance journal — list jurnal export, kategori, total |
| `/settings` / `/pengaturan` | Settings: bahasa, tema, grid default size, auto-save interval |
| `/help` / `/bantuan` | Help center — cara pakai editor, grid legend, keyboard shortcut |
| `/about` / `/tentang` | About — versi, tech stack, attribution, link ke GitHub |
| `/auth/login` | Login page — email/password, register link |
| `/auth/register` | Register page — email/password/confirm, login link |
| `/auth/logout` | Logout action (redirect ke dashboard) |

## Stack
- Next.js 16 App Router + TypeScript + Tailwind v4 + shadcn/ui
- Recharts (analytics dashboard)
- BroadcastChannel API (real-time kolaborasi multi-tab)
- Web Worker (offscreen grid simulation, non-blocking)
- Canvas/WebGL (grid render + animasi agent path)
- jsPDF + SheetJS (export PDF/Excel ringkasan level)
- lucide-react (ikon seluruh UI)
- localStorage auth (hf_user/hf_users)

## Policy Check
- ✅ NO /waha/ tab atau API
- ✅ NO Meta Pixel / Google Analytics / fbq / gtag
- ✅ Attribution: UTM/URL param → localStorage.source → Recharts bar chart di /analytics
- ✅ Notification: in-app toast (shadcn) + copy share link ke clipboard (wa.me deep-link optional)
- ✅ Finance journal: auto-jurnal tiap export level
- ✅ No emoji di seluruh UI dan README

## Design Rules
- No emoji, modern minimal SaaS
- Light/dark mode toggle
- Bilingual EN/ID toggle button di header
- Lucide-react icons untuk semua element
- Clean typography, OKLCH color via Tailwind v4
