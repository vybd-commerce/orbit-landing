/** Copy for /askinkind, drawn from askinkind.org (Nov 2026). Ask In Kind
    shows no platform statistics yet, so this page shows none either; the
    project on the board is an example and says so. */

export const AIK = 'https://askinkind.org'
export const AIK_LINKS = {
  home: AIK,
  projects: `${AIK}/marketplace`,
  donations: `${AIK}/surplus`,
  how: `${AIK}/how-it-works`,
  join: `${AIK}/signup`,
}

/** Example project on the hero board. Items echo the kinds of needs askinkind.org lists. */
export const EXAMPLE_PROJECT = {
  name: 'County clinic rebuild',
  items: [
    { item: 'Solar vaccine fridges', qty: 12 },
    { item: 'Exam room lamps', qty: 40 },
    { item: 'Water filters', qty: 200 },
    { item: 'Socks + underwear', qty: 500 },
  ],
}

/** The stages a pledge moves through, as askinkind.org tracks them. */
export const STAGES = ['Pledged', 'Cleared', 'Out', 'Arrived'] as const
export const STAGE_LABELS = ['Pledge accepted', 'Customs cleared', 'Out for delivery', 'Recipient confirms']

export const COMPARE: [string, string, string][] = [
  ['Who it helps', 'Individuals', 'Groups: shelters, schools, clinics, councils, neighborhoods'],
  ['What is given', 'Cash', 'Goods, counted item by item'],
  ['What companies get', 'No way to give goods', 'A delivery-confirmed record for their impact report'],
  ['Where it ends', 'When the money is raised', 'When the recipient confirms delivery'],
]

export const FLOW = [
  { title: 'List what is needed', body: 'A verified group lists items with quantities and a photo. Twenty upvotes send the request to companies, or a reviewer can promote it sooner.' },
  { title: 'Pledge line by line', body: 'Companies pledge all or part of an item, or list unsold stock to offer first. Questions and answers happen in a shared deal room.' },
  { title: 'Track it to the door', body: 'Pledge accepted, customs cleared, out for delivery. The recipient confirms, and only then does it count.' },
]

export const ROLES = [
  {
    who: 'Communities',
    line: 'Shelters, schools, clinics, non-profits, councils and neighborhoods.',
    steps: ['Join and verify once', 'List items with quantities and a photo', 'Build support: 20 upvotes reach companies', 'Accept pledges and confirm delivery'],
    note: 'Individuals can post only when the need serves a group.',
  },
  {
    who: 'Companies',
    line: 'Donate stock, offer surplus, or sponsor freight.',
    steps: ['Find a project by place and category', 'Ask questions in the deal room', 'Pledge all or part of an item', 'Ship, report, and add it to your impact report'],
    note: 'Donated inventory is often tax deductible. Check with your tax adviser.',
  },
  {
    who: 'Carriers',
    line: 'Freight and delivery partners, verified.',
    steps: ['Verify with a company email or a document', 'Take accepted deals that need a carrier', 'Update each stage and share evidence'],
    note: 'No platform fee.',
  },
]

export const CHECKS = [
  { title: 'Nothing to divert.', body: 'No donation balance is held on the platform. Goods move, not money.' },
  { title: 'No goods move without a review.', body: 'Organizations are verified once, requests are reviewed before pledges open, and pledges are screened for restricted destinations and possible military use.' },
  { title: 'Only recipients confirm delivery.', body: 'Impact counts when the people it was meant for say it arrived.' },
]
