export interface Faq {
  q: string;
  a: string[];
}

/* Answers are deliberately narrow: they only claim what the rest of the
   site already claims (see opsStack.ts and functions.ts), plus the one
   timeframe the team has signed off on. No pricing, that is not settled. */
export const FAQS: Faq[] = [
  {
    q: "Do you replace our ops team?",
    a: [
      "No. We remove the work your team only does because the systems do not talk to each other: the re keying, the weekly reconciliation, the chasing a number across three portals.",
      "The people stay. Where a function is genuinely new, our operators run it until your team is ready to take it.",
    ],
  },
  {
    q: "Do we have to move off our current tools?",
    a: [
      "No. We read where the data already lives. Nothing is migrated and nothing is replaced, so the systems you run on stay the systems you run on.",
      "The first thing we build is the connected view across them: orders, inventory, cost, and channel in one place.",
    ],
  },
  {
    q: "What can an agent actually change on its own?",
    a: [
      "Only what you allow. Every proposed write passes a rule set you own: what an agent may touch, up to what value, under whose authority.",
      "Every proposal is recorded whether it is approved or not, so there is an audit trail for anything that moved.",
    ],
  },
  {
    q: "What does working together look like?",
    a: [
      "It starts with an operations working session. We map your handoffs against your own numbers rather than ours, and you leave with that map.",
      "After that we build the connected data layer first, then run agents on top of it function by function, with a senior operator accountable for the output until the system holds it on its own.",
      "The first function is live and doing real work inside a month.",
    ],
  },
];
