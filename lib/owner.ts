import type { Session } from "next-auth";

// Comma-separated allowlist; defaults to the owner's email so it works without
// extra configuration. Override with the OWNER_EMAIL env var.
const owners = (process.env.OWNER_EMAIL ?? "zerofactix@gmail.com")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isOwner(session: Session | null): boolean {
  const email = session?.user?.email?.toLowerCase();
  return !!email && owners.includes(email);
}
