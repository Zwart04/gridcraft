'use client'

import { useLang } from "@/lib/lang"
import { t } from "@/lib/i18n"
import Link from "next/link"
import { ArrowLeft, Grid3X3, Heart, Share2, Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LevelDetailClientProps {
  lvl: {
    id: string
    name: string
    tag: string
    difficulty: string
    gridSize: string
    creator: string
    likes: number
    played: number
    exports: number
    description: string
  }
}

const badgeCls = "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
const badgeSecondary = "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
const badgeOutline = "border border-input bg-background hover:bg-accent hover:text-accent-foreground"

export function LevelDetailClient({ lvl }: LevelDetailClientProps) {
  const { lang } = useLang()
  const tr = lang === 'en' ? t.en : t.id
  const k = tr.gallery
  const backLabel = lang === 'en' ? 'Back to Gallery' : 'Kembali ke Galeri'
  const allLabel = lang === 'en' ? 'All Levels' : 'Semua Level'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/gallery"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} />
        {backLabel}
      </Link>

      <div className="bg-card rounded-xl border p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className={badgeCls + " " + badgeSecondary}>{lvl.tag}</span>
              <span className={badgeCls + " " + badgeOutline}>{lvl.difficulty}</span>
              <span className={badgeCls + " " + badgeOutline}>{lvl.gridSize}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{lvl.name}</h1>
            <p className="text-muted-foreground mt-2">{lvl.description}</p>
          </div>
          <Button asChild>
            <Link href={`/editor?load=${lvl.id}`}>
              {k.edit}
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-muted rounded-lg p-4 text-center">
            <Grid3X3 className="mx-auto mb-2 opacity-60" size={24} />
            <div className="text-2xl font-bold">{lvl.played}</div>
            <div className="text-sm text-muted-foreground">{k.played}</div>
          </div>
          <div className="bg-muted rounded-lg p-4 text-center">
            <Heart className="mx-auto mb-2 opacity-60" size={24} />
            <div className="text-2xl font-bold">{lvl.likes}</div>
            <div className="text-sm text-muted-foreground">{k.liked}</div>
          </div>
          <div className="bg-muted rounded-lg p-4 text-center">
            <Share2 className="mx-auto mb-2 opacity-60" size={24} />
            <div className="text-2xl font-bold">{lvl.exports}</div>
            <div className="text-sm text-muted-foreground">{tr.dashboard.exports}</div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-3">{k.share}</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={`https://gridcraft.zwart.qzz.io/gallery/${lvl.id}`}
            className="flex-1 bg-muted rounded-lg px-4 py-2 text-sm font-mono border-0"
          />
          <Button size="sm" onClick={() => {
            navigator.clipboard?.writeText(`https://gridcraft.zwart.qzz.io/gallery/${lvl.id}`)
          }}>
            <Copy size={16} />
            {tr.toast.copied}
          </Button>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle size={14} />
          Share via WhatsApp:
          <code className="bg-muted px-1 rounded">
            https://wa.me/?text={encodeURIComponent(`https://gridcraft.zwart.qzz.io/gallery/${lvl.id}`)}
          </code>
        </div>
      </div>

      <div className="mt-6">
        <Button variant="outline" asChild>
          <Link href="/gallery">
            {allLabel}
          </Link>
        </Button>
      </div>
    </div>
  )
}
