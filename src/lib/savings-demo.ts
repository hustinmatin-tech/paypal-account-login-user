export type SavingsGoal = { id: number; name: string; targetCents: number; cents: number };
export type SavingsState = { generalCents: number; goals: SavingsGoal[] };
export type SavingsBucket = "balance" | "general" | number;
export const emptySavings = (): SavingsState => ({ generalCents: 0, goals: [] });
export const savingsTotal = (state: SavingsState) => state.generalCents + state.goals.reduce((sum, goal) => sum + goal.cents, 0);
export function bucketCents(state: SavingsState, balanceCents: number, bucket: SavingsBucket) {
  return bucket === "balance" ? balanceCents : bucket === "general" ? state.generalCents : state.goals.find(goal => goal.id === bucket)?.cents ?? 0;
}
export function moveDemoSavings(state: SavingsState, balanceCents: number, from: SavingsBucket, to: SavingsBucket, cents: number) {
  const exists = (bucket: SavingsBucket) => typeof bucket === "string" || state.goals.some(goal => goal.id === bucket);
  if (!Number.isSafeInteger(cents) || cents <= 0 || from === to || !exists(from) || !exists(to) || cents > bucketCents(state, balanceCents, from)) return null;
  const delta = (bucket: SavingsBucket) => (to === bucket ? cents : 0) - (from === bucket ? cents : 0);
  return {
    balanceCents: balanceCents + delta("balance"),
    savings: { generalCents: state.generalCents + delta("general"), goals: state.goals.map(goal => ({ ...goal, cents: goal.cents + delta(goal.id) })) },
  };
}