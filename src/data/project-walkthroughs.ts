type Step = {
  title: string;
  description: string;
  screen: string;
  heading: string;
  rows: readonly (readonly [string, string])[];
  result: string;
};

type Walkthrough = {
  title: string;
  value: string;
  steps: readonly [Step, Step, Step];
};

export const walkthroughs = {
  workbench: {
    title: "Find the right customer history",
    value: "An agent can check the match and see the relevant order, call and follow-up in one place. In the original workflow, gathering context took about 20 minutes. With the Workbench, it took about 30 seconds.",
    steps: [
      { title: "See why the match paused", description: "An incoming conversation matches two records. Order history stays hidden until the agent has enough evidence.", screen: "Customer match", heading: "Two possible records", rows: [["Jamie Rivers", "Email matches"], ["J. Rivers", "Name matches"]], result: "Order details paused" },
      { title: "Confirm the record", description: "The agent checks the email and order reference against the conversation, then selects the matching record.", screen: "Review candidates", heading: "Jamie Rivers", rows: [["Conversation email", "Matches"], ["Order reference", "Matches"]], result: "Match confirmed for this conversation" },
      { title: "See what happens next", description: "The timeline brings the order and prior conversation together so the agent can pick up the customer's issue.", screen: "Customer timeline", heading: "Delivery follow-up", rows: [["Order #1048", "In transit"], ["Yesterday’s call", "Tracking requested"]], result: "Next step · Send a delivery update" },
    ],
  },
  quality: {
    title: "Turn a quality review into coaching",
    value: "Managers can move from a representative sample to a specific coaching conversation. Sampling and report compilation fell from roughly two hours to about one minute, with quality decisions still reviewed by a person.",
    steps: [
      { title: "Select a review", description: "Start with an eligible conversation and the rubric for its channel.", screen: "Review queue", heading: "Delivery enquiry", rows: [["Channel", "Email"], ["Rubric", "Written support"]], result: "Ready for review" },
      { title: "Check the evidence", description: "Read the relevant interaction alongside the rubric. The manager can verify what the customer heard.", screen: "Evidence", heading: "Set clear expectations", rows: [["What went well", "Order status explained"], ["What was missed", "No follow-up time"]], result: "Coaching opportunity" },
      { title: "Agree on a next step", description: "Use the example to give the agent a specific habit to practise on similar cases.", screen: "Manager review", heading: "Close the loop", rows: [["Coaching focus", "Name the next update"], ["Example", "I’ll check again by 3 pm"]], result: "Review ready for coaching" },
    ],
  },
  performance: {
    title: "Spot a queue that needs attention",
    value: "A single dashboard gives managers a starting point for checking coverage. The original recurring KPI report went from about two hours to about one minute to generate.",
    steps: [
      { title: "Review channel performance", description: "Compare call and message performance over the same reporting period.", screen: "Queue overview", heading: "Today's support activity", rows: [["Calls answered", "74%"], ["Email first response", "48 min"]], result: "Call queue needs a closer look" },
      { title: "Find the busiest window", description: "Look below the headline figure to see when eligible missed calls clustered.", screen: "Call detail", heading: "Midday pressure", rows: [["11:00–12:00", "5 missed"], ["12:00–13:00", "13 missed"]], result: "Largest gap · Noon to 1 pm" },
      { title: "Bring evidence to scheduling", description: "Use the time window and underlying counts to discuss coverage at the next team review.", screen: "Weekly report", heading: "Coverage review", rows: [["Eligible calls", "103"], ["Answered calls", "76"]], result: "Review midday coverage" },
    ],
  },
  campaign: {
    title: "Move a campaign from brief to approval",
    value: "A promoter can turn a launch brief into reviewable drafts and keep approval visible before anything is scheduled.",
    steps: [
      { title: "Capture the brief", description: "Start with the audience, channel and goal so the posts are anchored to the campaign.", screen: "Campaign brief", heading: "Launch week", rows: [["Audience", "Returning customers"], ["Goal", "Introduce the new collection"]], result: "Brief ready" },
      { title: "Review draft posts", description: "Check each suggested post and refine the wording before approval.", screen: "Draft review", heading: "Collection preview", rows: [["Post", "A first look at Friday’s drop"], ["Review note", "Add the launch date"]], result: "Draft · Awaiting approval" },
      { title: "Approve what’s ready", description: "Approve the revised draft before it becomes eligible for the next publishing step.", screen: "Approval", heading: "Collection preview", rows: [["Launch date", "Friday"], ["Review", "Approved"]], result: "Ready to schedule" },
    ],
  },
  mobile: {
    title: "Make a new plan when the day changes",
    value: "Recalibrate gives someone a workable day plan when their time changes, with control over what moves and what stays.",
    steps: [
      { title: "Start with today’s plan", description: "See the commitments and flexible work planned around them.", screen: "Today", heading: "Your morning", rows: [["09:00", "Team check-in"], ["10:00", "Write project brief"]], result: "Two blocks planned" },
      { title: "Review the impact", description: "After a meeting runs long, review how the remaining time could be used.", screen: "Recalibrate", heading: "Meeting ran over", rows: [["Time left", "25 minutes"], ["Suggestion", "Outline the brief"]], result: "Review suggested adjustment" },
      { title: "Choose what moves", description: "Keep the smaller next step and move the longer writing block to another day.", screen: "Updated plan", heading: "A workable morning", rows: [["Today", "Outline the brief"], ["Tomorrow", "Write the first draft"]], result: "Plan updated" },
    ],
  },
} satisfies Record<string, Walkthrough>;

export type WalkthroughType = keyof typeof walkthroughs;

export function hasWalkthrough(type: string): type is WalkthroughType {
  return Object.hasOwn(walkthroughs, type);
}
