import { notFound } from "next/navigation"
import { LevelDetailClient } from "./level-detail-client"

const LEVELS = [
  {
    id: "1",
    name: "Demo House",
    tag: "beginner",
    difficulty: "easy",
    gridSize: "16x12",
    creator: "Alex",
    likes: 14,
    played: 47,
    exports: 12,
    description: "Ruangan demo sederhana untuk testing grid editor. Berisi dinding, lantai, koin, dan exit.",
  },
  {
    id: "2",
    name: "Spike Forest",
    tag: "challenge",
    difficulty: "hard",
    gridSize: "24x16",
    creator: "Mia",
    likes: 8,
    played: 23,
    exports: 5,
    description: "Hutan spike yang menantang dengan banyak hazard dan jalan sempit menuju exit.",
  },
  {
    id: "3",
    name: "Coin Rush",
    tag: "speedrun",
    difficulty: "medium",
    gridSize: "20x20",
    creator: "Riz",
    likes: 21,
    played: 64,
    exports: 18,
    description: "Level cepat penuh koin. Kumpulkan semua koin sebelum waktu habis.",
  },
]

export function generateStaticParams() {
  return LEVELS.map((l) => ({ id: l.id }))
}

export default async function LevelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lvl = LEVELS.find((l) => l.id === id)
  if (!lvl) return notFound()

  return <LevelDetailClient lvl={lvl} />
}
