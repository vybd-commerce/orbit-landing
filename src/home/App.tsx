import { useReveal } from './hooks/useReveal'
import { BoardNav } from './board/BoardNav'
import { BoardFooter } from './board/BoardFooter'
import { Hero } from './board/Hero'
import { Cases, EnterpriseAndCalc, Essay, Fares, ForTheUS, Promises, Record, SupplyChain } from './board/Sections'

export default function App() {
  useReveal()
  return (
    <>
      <BoardNav />
      <main id="top">
        <Hero />
        <SupplyChain />
        <ForTheUS />
        <EnterpriseAndCalc />
        <Promises />
        <Record />
        <Cases />
        <Essay />
        <Fares />
      </main>
      <BoardFooter />
    </>
  )
}
