/** Hero price stack: where an illustrative $40 goes. mk = maker, sv = service, rn = rent, vb = Vybd. */
export type SegKind = 'mk' | 'sv' | 'rn' | 'vb'
export type Seg = { kind: SegKind; amount: number; label: string }

const s = (kind: SegKind, amount: number, label: string): Seg => ({ kind, amount, label })

export const STACK_TOTAL = 40

export const USUAL_CHAIN: Seg[] = [
  s('mk', 6, 'Maker'),
  s('sv', 4, 'Freight + customs'),
  s('rn', 6, 'Importer markup'),
  s('rn', 4, 'Waiting to be paid'),
  s('rn', 12, 'Marketplace margin'),
  s('rn', 8, 'Ad platforms'),
]

export const WITH_VYBD: Seg[] = [
  s('mk', 17.2, 'Maker'),
  s('sv', 3.4, 'Freight + customs'),
  s('sv', 9.4, '3PL + delivery'),
  s('sv', 5.2, 'Ads + payments'),
  s('vb', 4.8, 'Vybd 12%'),
  s('rn', 0, ''),
]

export const money = (n: number) => '$' + (n % 1 ? n.toFixed(2) : n)
