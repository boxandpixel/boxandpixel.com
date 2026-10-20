/**
 * Care plan tiers. Shared by the home page teaser and /care so prices and
 * inclusions can't drift apart. Draft tiers — see
 * refs/box-and-pixel-positioning-2026-09.md.
 */
export interface Plan {
  name: string;
  price: string;
  unit?: string;
  summary: string;
  includes: string[];
}

export const plans: Plan[] = [
  {
    name: "Care",
    price: "$1,000",
    unit: "/mo",
    summary: "For sites that need watching.",
    includes: [
      "Security updates and monitoring",
      "Content and error checks",
      "Emergency response",
      "Small fixes",
    ],
  },
  {
    name: "Growth",
    price: "$2,500",
    unit: "/mo",
    summary: "For sites that need to keep improving.",
    includes: [
      "Everything in Care",
      "Planned performance work",
      "Technology upgrades",
      "Quarterly review",
    ],
  },
  {
    name: "Partner",
    price: "From $4,000",
    unit: "/mo",
    summary: "For sites the business runs on.",
    includes: [
      "Everything in Growth",
      "Priority response",
      "A roadmap for the site",
      "SEO and ad vendor coordination",
    ],
  },
];

export const plansNote = "New features and builds are quoted separately.";
