import type { ReactNode } from 'react'

export type Chapter = {
  title: string
  preview: string
  quote: ReactNode
  dark: boolean
  body: ReactNode
}

export const CHAPTERS: Chapter[] = [
  {
    title: 'Every hop takes a cut',
    preview: 'A shopper pays $40. The person who made the product keeps about $6. Most of the rest isn\'t service. It\'s rent.',
    quote: <>Where does <em>the $40 go?</em></>,
    dark: false,
    body: (
      <>
        <p>Middlemen exist for real reasons. Between a maker and a buyer, someone has to carry four things:</p>
        <ul>
          <li><b>Capital.</b> Someone pays for stock and waits 60 to 90 days to get paid back.</li>
          <li><b>Risk.</b> Someone takes on legal liability, returns and unsold stock.</li>
          <li><b>Trust.</b> Someone lets a buyer pay a brand they've never heard of.</li>
          <li><b>Demand.</b> Someone puts the product in front of people.</li>
        </ul>
        <p>On top of that sits rent: markups, waiting to be paid and margins that exist because they always have. Selling direct doesn't remove it. It just moves the tollbooth from the shelf to the ad feed.</p>
      </>
    ),
  },
  {
    title: 'Transactions went digital. Decisions didn\'t.',
    preview: 'Brands run ERPs, order systems and dashboards. Someone still exports the data, reconciles it and decides by hand.',
    quote: <>Recorded by software. <em>Decided by hand.</em></>,
    dark: true,
    body: (
      <>
        <p>Supply-chain software got very good at recording what happened: sales, stock, orders, invoices. It never got good at deciding what to do next.</p>
        <p>So a planner exports the numbers, fixes the mismatches, emails suppliers for updates and turns it all into a purchase order. Excel and people's memory end up being the real glue between systems that are supposedly already connected.</p>
        <p>That coordination work is slow, it's expensive, and it's exactly what every layer in the chain charges for.</p>
      </>
    ),
  },
  {
    title: 'AI is the only middleman we need',
    preview: 'Software can now understand what you\'re trying to do. So ask of every task: why does a person still have to do this?',
    quote: <>Agents coordinate. Operators judge. <em>Partners deliver.</em></>,
    dark: false,
    body: (
      <>
        <p>Take reordering stock. It means weighing demand, stock on hand, open orders, supplier lead times and minimum order sizes. None of that maths is hard. What's hard is pulling it together every day.</p>
        <p>An AI agent can do that around the clock, flag only the cases that need a human, and have the order ready for approval. It works alongside the systems you already have instead of replacing them.</p>
        <p>What AI can't do is move boxes, front cash or take responsibility. So partners still do the physical work, and experienced operators still make the calls that matter.</p>
      </>
    ),
  },
  {
    title: 'What it looks like in practice',
    preview: 'One apparel brand: 80+ SKUs, three sales channels. About 88% less manual work and 12% lower fulfilment costs.',
    quote: <>Less busywork. <em>Lower cost.</em></>,
    dark: true,
    body: (
      <>
        <p>The brand sells about $5M a year, ships from two warehouses and sells on Amazon, its own site and TikTok Shop. Demand was hard to predict, it held too much stock, and much of the order handling was still manual.</p>
        <p>We automated forecasting, reordering, purchase orders, supplier follow-ups and order processing. The team now spends its time on the exceptions.</p>
        <ul>
          <li><b>About 88% less manual work:</b> what it means for the team.</li>
          <li><b>12% lower fulfilment costs:</b> what it means for the bottom line.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Not becoming the next middleman',
    preview: 'If this works, Vybd becomes a middleman. So we\'re writing down now what kind of middleman we\'ll be.',
    quote: <>Better, cheaper, <em>in the open.</em></>,
    dark: false,
    body: (
      <>
        <ul>
          <li><b>You own your customer.</b> Data, storefronts and channel accounts are in your brand's name.</li>
          <li><b>Every fee is visible.</b> You see what Vybd and each partner charged on every order.</li>
          <li><b>Leaving is easy.</b> Your data, playbooks and partners leave with you.</li>
          <li><b>Value is checkable.</b> Partners see the work on record and what they're owed.</li>
        </ul>
        <p>We'll get there in three stages: first run launches ourselves (<b>Operator</b>), then have partners work on one shared record (<b>Orchestrator</b>), then use real operating data to finance stock and freight (<b>Network &amp; capital</b>). One trade route at a time.</p>
      </>
    ),
  },
]
