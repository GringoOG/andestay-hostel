export function env(name: string, fallback = ""): string {
  return process.env[name]?.trim() || fallback;
}

export function envFlag(name: string, fallback: boolean): boolean {
  const raw = process.env[name]?.trim().toLowerCase();
  if (raw === undefined || raw === "") return fallback;
  return raw === "1" || raw === "true" || raw === "yes";
}
