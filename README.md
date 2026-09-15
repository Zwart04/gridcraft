# GridCraft

A collaborative, grid-based game level editor built for the web. Edit levels together in real-time, get AI-powered suggestions, run GPU-accelerated simulations with an AI agent, and export to PNG, JSON, or WebM.

Live Demo: https://gridcraft.zwart.qzz.io
GitHub: https://github.com/Zwart04/gridcraft

---

## Features

- Real-time collaborative grid editing via BroadcastChannel with multi-user cursor presence
- AI level suggestion engine (balance checker, symmetry suggester, flow optimizer) with throttling
- GPU-accelerated grid simulation in a Web Worker (60fps, non-blocking)
- Version history and auto-save every 30 seconds with one-click restore
- Export pipeline: clean PNG (800x450), portable JSON, and WebM animation
- Public level gallery with search, filtering, and like counter
- Bilingual dashboard (EN/ID) with Recharts analytics and auto finance journal
- Local-first auth with email/password validation and localStorage persistence

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom OKLCH color system |
| Components | shadcn/ui (Radix-based) |
| Icons | lucide-react |
| Charts | Recharts |
| Export | jsPDF, xlsx (SheetJS) |
| Real-time | BroadcastChannel API |
| Storage | Web Worker + localStorage |
| Deployment | Cloudflare Pages |

## Getting Started

### Prerequisites

- Node.js 22+
- npm or yarn

### Installation

```bash
git clone https://github.com/Zwart04/gridcraft.git
cd gridcraft
npm install
```

### Development

```bash
npm run dev
# open http://localhost:3000
```

### Build

```bash
npm run build
# static export to /out
```

## Project Structure

```
gridcraft/
├── app/                   # Next.js App Router routes
│   ├── layout.tsx         # Root layout (StoreProvider + LangProvider)
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Stats dashboard (Recharts + finance journal)
│   ├── editor/            # Grid editor (collab + AI + simulation + export)
│   ├── gallery/           # Level gallery (search + filter)
│   ├── analytics/         # Analytics (trend, distribution, heatmap, attribution)
│   ├── finance/           # Auto finance journal
│   ├── settings/          # Language + theme + grid defaults
│   ├── help/              # Editor guide + legend + shortcuts
│   ├── about/             # About + attribution
│   └── auth/              # Login / Register
├── components/            # Shared UI components
│   ├── ui/                # shadcn-style primitives
│   ├── app-provider.tsx
│   ├── lang-provider.tsx
│   ├── theme-provider.tsx
│   └── toast-provider.tsx
├── lib/                   # Utilities, store, i18n
├── public/                # Static assets (favicon, icons)
├── FEATURES.md            # Full feature specification (8 features)
└── docs/                  # Screenshots and demo assets
```

## Attribution

Source attribution is handled via URL params (`?utm_source=...`) persisted to
`localStorage.source` and visualized as a Recharts bar chart in `/analytics`.
No third-party trackers, Meta Pixel, or Google Analytics are used.

## License

MIT
