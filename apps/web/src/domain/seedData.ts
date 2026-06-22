import type { ManagerDashboard, SupportingOutcome, WeeklyPlan } from "./types";

export const outcomes: SupportingOutcome[] = [
  {
    id: "so-101",
    rallyCry: "Win enterprise trust",
    definingObjective: "Make strategy execution auditable",
    outcome: "Every weekly commitment maps to an approved Supporting Outcome",
    owner: "Strategy Ops"
  },
  {
    id: "so-102",
    rallyCry: "Win enterprise trust",
    definingObjective: "Reduce manager review latency",
    outcome: "Managers complete weekly review within 24 business hours",
    owner: "People Ops"
  },
  {
    id: "so-201",
    rallyCry: "Scale the platform",
    definingObjective: "Harden PA micro-frontend extensibility",
    outcome: "New remotes load through Module Federation without shell coupling",
    owner: "Platform"
  },
  {
    id: "so-301",
    rallyCry: "Increase execution discipline",
    definingObjective: "Improve reconciliation accuracy",
    outcome: "Planned vs actual variance is visible for every team by Friday",
    owner: "Finance Ops"
  }
];

export const initialPlan: WeeklyPlan = {
  id: "plan-2026-06-22-ava",
  weekStart: "2026-06-22",
  ownerId: "u-ava",
  ownerName: "Ava Chen",
  managerId: "u-morgan",
  lifecycleState: "DRAFT",
  commits: [
    {
      id: "c-1",
      ownerId: "u-ava",
      ownerName: "Ava Chen",
      title: "Ship RCDO-linked commit form",
      description: "Replace free-text weekly plan entry with required Supporting Outcome mapping.",
      supportingOutcomeId: "so-101",
      category: "Queen",
      priority: 1,
      plannedHours: 12,
      actualHours: 0,
      status: "Planned"
    },
    {
      id: "c-2",
      ownerId: "u-ava",
      ownerName: "Ava Chen",
      title: "Expose remote entry contract",
      description: "Publish the weekly planning route as a Module Federation remote.",
      supportingOutcomeId: "so-201",
      category: "Rook",
      priority: 2,
      plannedHours: 7,
      actualHours: 0,
      status: "Planned"
    },
    {
      id: "c-3",
      ownerId: "u-ava",
      ownerName: "Ava Chen",
      title: "Prepare reconciliation variance view",
      description: "Show planned hours, actual hours, status, and carry-forward decisions.",
      supportingOutcomeId: "so-301",
      category: "Bishop",
      priority: 3,
      plannedHours: 6,
      actualHours: 0,
      status: "Planned"
    }
  ]
};

export const initialDashboard: ManagerDashboard = {
  weekStart: "2026-06-22",
  completionRate: 84,
  alignmentRate: 96,
  reviewTurnaroundHours: 18,
  teamMembers: [
    {
      id: "u-ava",
      name: "Ava Chen",
      role: "Senior Product Engineer",
      lifecycleState: "DRAFT",
      alignment: 100,
      plannedHours: 25,
      actualHours: 0,
      blockedCommits: 0
    },
    {
      id: "u-eli",
      name: "Eli Brooks",
      role: "Data Engineer",
      lifecycleState: "LOCKED",
      alignment: 92,
      plannedHours: 31,
      actualHours: 11,
      blockedCommits: 1
    },
    {
      id: "u-nora",
      name: "Nora Patel",
      role: "Engineering Manager",
      lifecycleState: "RECONCILING",
      alignment: 88,
      plannedHours: 28,
      actualHours: 23,
      blockedCommits: 0
    }
  ]
};
