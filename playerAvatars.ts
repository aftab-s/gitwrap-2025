/** Funky 16-bit virtual pets for every class returned by playerClass(). */
export const PLAYER_AVATARS = {
  "New Challenger": "/avatars/new-challenger.png",
  "Night Owl": "/avatars/night-owl.png",
  "Early Riser": "/avatars/early-riser.png",
  "Bug Hunter": "/avatars/bug-hunter.png",
  "Weekend Warrior": "/avatars/weekend-warrior.png",
  "Streak Keeper": "/avatars/streak-keeper.png",
  "Marathoner": "/avatars/marathoner.png",
  "Code Reviewer": "/avatars/code-reviewer.png",
  "PR Shipper": "/avatars/pr-shipper.png",
  "Polyglot": "/avatars/polyglot.png",
  "Specialist": "/avatars/specialist.png",
  "Sprinter": "/avatars/sprinter.png",
  "All-Rounder": "/avatars/all-rounder.png"
} as const;

export function playerAvatar(name: string): string {
  return PLAYER_AVATARS[name as keyof typeof PLAYER_AVATARS] ?? PLAYER_AVATARS["All-Rounder"];
}
