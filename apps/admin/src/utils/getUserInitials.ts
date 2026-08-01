/**
 * Extract up to 2 uppercase initials from a user's display name.
 * Example: "Maksym K." → "MK", "John" → "JO"
 */
export function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
