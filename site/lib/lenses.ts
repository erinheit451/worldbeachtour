export const LENSES = [
  { id: "travel", label: "Travel", icon: "plane" },
  { id: "surf", label: "Surf", icon: "waves" },
  { id: "environment", label: "Environment", icon: "leaf" },
  { id: "family", label: "Family", icon: "users" },
  { id: "photography", label: "Photography", icon: "camera" },
  { id: "diving", label: "Diving", icon: "anchor" },
  { id: "history", label: "History", icon: "scroll" },
  { id: "sand", label: "Sand & Geology", icon: "mountain" },
] as const;

export type LensId = (typeof LENSES)[number]["id"];

export function getLens(id: string) {
  return LENSES.find((l) => l.id === id);
}
