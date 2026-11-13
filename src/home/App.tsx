import { useReveal } from './hooks/useReveal'
import { GlobalNav } from './components/GlobalNav'
import { Hero } from './components/Hero'
import { StartRoutes } from './components/StartRoutes'
import { SupplyChain } from './components/SupplyChain'
import { ForTheUS } from './components/ForTheUS'
import { TileGrid } from './components/TileGrid'
import { Cases } from './components/Cases'
import { Chapters } from './components/Chapters'
import { Compare } from './components/Compare'
import { Footer } from './components/Footer'

export default function App() {
  useReveal()
  return (
    <>
      <GlobalNav />
      <main id="top">
        <Hero />
        <StartRoutes />
        <SupplyChain />
        <ForTheUS />
        <TileGrid />
        <Cases />
        <Chapters />
        <Compare />
      </main>
      <Footer />
    </>
  )
}
