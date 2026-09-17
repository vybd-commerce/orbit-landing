/* All copy for the operating stack narrative. Single source of truth —
 * scene code must never hold a string a reader sees.
 *
 * Ported from the prototype at docs/3d.html. (The build brief points at
 * "vybd-stack-v3.html", which is not in this repo; docs/3d.html is the file
 * that actually carries the copy.)
 *
 * TRIMMED: the prototype gave each stage three bullets, which is more than
 * free-standing type can carry without turning back into a panel. Each stage
 * now keeps the strongest two. The dropped lines are listed per stage so they
 * are easy to put back.
 *
 * FLAGGED FOR REVIEW: the agent-layer bullets are placeholders in the
 * prototype and need Ashwin's real agent roster before this ships.
 */

export interface StageAnnotation {
  text: string;
  /** Scene-space anchor the label is projected from. */
  at: [number, number, number];
  side: "left" | "right";
}

/** Where the stage's type sits in frame, chosen against the camera track so
 *  the words never land on the geometry. */
export interface StageAnchor {
  x: "left" | "right" | "center";
  y: "top" | "center" | "bottom";
}

export interface Stage {
  id: string;
  index: string;
  /** Shown in the stage marker and the rail, e.g. "Context layer". */
  name: string;
  accent: string;
  headline: string;
  lede: string;
  /** Rendered as a mono strip, joined by · */
  metrics: string[];
  points: { label: string; body: string }[];
  anchor: StageAnchor;
  annotations: StageAnnotation[];
}

/** Scene half-width plus margin — where the right-hand annotations sit. */
const RIGHT = 3.1;
const LEFT = -3.1;

export const STAGES: Stage[] = [
  {
    id: "sources",
    index: "00",
    name: "Sources",
    accent: "#B4B2A9",
    headline: "Your data isn't wrong. It's scattered.",
    lede: "Six to nine systems, each internally consistent, none agreeing on what's in stock, what shipped, or what it cost to get there.",
    metrics: ["6–9 systems", "2 SKU conventions", "reconciliation = 1 person"],
    /* dropped: "The mapping table nobody owns is load-bearing for three teams." */
    points: [
      { label: "ERP says 400 units.", body: "The 3PL says 340. Both are right, on different dates." },
      { label: "Your best ops hire", body: "spends four hours a week being an integration." },
    ],
    anchor: { x: "right", y: "center" },
    annotations: [],
  },
  {
    id: "context",
    index: "01",
    name: "Context layer",
    accent: "#5DCAA5",
    headline: "One model, built once.",
    lede: "A read-only projection over every system. Entities resolved a single time, so “how much of this do we have” has one answer instead of six.",
    metrics: ["1 schema", "read-only", "entities resolved once"],
    /* dropped: "Scoped reads. Each task sees a slice, not the warehouse." */
    points: [
      {
        label: "Two-zone projection.",
        body: "Raw mirror on one side, resolved model on the other. Nothing writes here.",
      },
      { label: "No migration.", body: "Your systems stay exactly where they are." },
    ],
    anchor: { x: "left", y: "bottom" },
    annotations: [
      { text: "Two-zone projection", at: [RIGHT, 2.05, 0], side: "right" },
      { text: "Entity resolution", at: [RIGHT, 1.62, 0], side: "right" },
      { text: "Scoped reads", at: [RIGHT, 1.24, 0], side: "right" },
    ],
  },
  {
    id: "agent",
    index: "02",
    name: "Agent layer",
    accent: "#61B2E4",
    headline: "Workers, not a chatbot.",
    lede: "Each agent owns one job and runs it on a schedule. The model decides what to look at; deterministic compute decides the answer.",
    metrics: ["bounded jobs", "deterministic math", "propose-only"],
    /* dropped: "The math isn't the model. An LLM picking which SKUs to examine
       is reliable; an LLM doing the arithmetic is not." */
    points: [
      {
        label: "One job per agent.",
        body: "Demand signal, deduction matching, markdown candidates — not a general assistant.",
      },
      { label: "Agents propose.", body: "None of them can execute. That's the next two layers' job." },
    ],
    anchor: { x: "right", y: "top" },
    annotations: [
      { text: "Demand agent", at: [RIGHT, 0.75, 0.5], side: "right" },
      { text: "Deduction agent", at: [LEFT, 0.75, -0.5], side: "left" },
      { text: "Bounded jobs only", at: [RIGHT, 0.3, 0], side: "right" },
    ],
  },
  {
    id: "application",
    index: "03",
    name: "Application layer",
    accent: "#E8D48A",
    headline: "Where your team actually works.",
    lede: "Surfaces built on the same projection. Your ops lead sees a ranked queue of decisions, not a dashboard that asks them to go find the problem.",
    metrics: ["queue not dashboard", "one surface", "no new login for the floor"],
    /* dropped: "Nothing new to learn for the people who live in the ERP all day." */
    points: [
      {
        label: "Decisions, not charts.",
        body: "A dashboard tells you inventory is off. This tells you which 14 SKUs and what to do.",
      },
      {
        label: "Reasoning attached.",
        body: "Every proposal shows the numbers behind it and which systems they came from.",
      },
    ],
    anchor: { x: "left", y: "center" },
    annotations: [
      { text: "Exception queue", at: [RIGHT, -1.1, 0], side: "right" },
      { text: "Reasoning attached", at: [LEFT, -1.3, 0], side: "left" },
    ],
  },
  {
    id: "governance",
    index: "04",
    name: "Governance layer",
    accent: "#AFA9EC",
    headline: "Rules the agents can't cross.",
    lede: "Not a policy document — enforcement sitting in the path of execution, where an agent without permission simply cannot perform the action.",
    metrics: ["scoped permissions", "value thresholds", "full audit"],
    /* dropped: "Audit log. Every read, proposal and write attributable after the fact." */
    points: [
      { label: "Scoped permissions.", body: "An agent that can propose a markdown cannot issue a PO." },
      {
        label: "Threshold gate.",
        body: "Above the line routes to review by default. There is no override path.",
      },
    ],
    anchor: { x: "right", y: "bottom" },
    annotations: [
      { text: "Threshold gate", at: [RIGHT, -2.6, 0], side: "right" },
      { text: "Audit log", at: [RIGHT, -3.0, 0], side: "right" },
    ],
  },
  {
    id: "review",
    index: "05",
    name: "Review",
    accent: "#F0997B",
    headline: "Nothing writes back unapproved.",
    lede: "Work arrives decided, not delegated. Your operator sees the proposal, the reasoning and the value at risk, and spends thirty seconds where they used to spend an afternoon.",
    metrics: ["named sign-off", "ranked by value at risk", "~30s per decision"],
    /* dropped: "Ranked by exposure, not by arrival time." */
    points: [
      { label: "Named approval.", body: "Every write traces to a person who approved it." },
      { label: "Rejection is signal.", body: "The next proposal is narrower for it." },
    ],
    anchor: { x: "left", y: "top" },
    annotations: [
      { text: "Proposal queue", at: [RIGHT, -4.15, 0], side: "right" },
      { text: "Named sign-off", at: [LEFT, -4.6, 0], side: "left" },
    ],
  },
  {
    id: "loop",
    index: "06",
    name: "The loop",
    accent: "#5DCAA5",
    headline: "Approved work goes back where it came from.",
    lede: "The stack reads top-down but closes upward. An approved proposal writes into the same systems it was read from, and the outcome becomes context for the next run.",
    metrics: ["no migration", "no new source of truth", "compounding context"],
    /* dropped: "Month three beats month one because it has seen what you approved." */
    points: [
      { label: "The systems stay the systems.", body: "Nothing to rip out, nothing new to maintain." },
      {
        label: "Absorbs complexity, not headcount.",
        body: "Same 39-handoff chain, 13 people instead of 34.",
      },
    ],
    /* The camera pulls back to r=24 here, so the stack is small and centred
       type reads as the closing statement rather than a caption. */
    anchor: { x: "center", y: "bottom" },
    annotations: [],
  },
];

/** The nine systems in the sources layer, labelled by projected chips. */
export const SOURCE_SYSTEMS = [
  "ERP",
  "WMS",
  "3PL",
  "Storefront",
  "Amazon",
  "Retail EDI",
  "Freight",
  "Sheets",
  "Inbox",
];
