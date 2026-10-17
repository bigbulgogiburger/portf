export type CopyDeps = {
  writeText?: (text: string) => Promise<void>;
  openMailto: (href: string) => void;
};

// Copies the address; without a working clipboard it falls back to the mailto link.
export async function copyEmail(email: string, deps: CopyDeps): Promise<"copied" | "mailto"> {
  try {
    if (!deps.writeText) throw new Error("clipboard unavailable");
    await deps.writeText(email);
    return "copied";
  } catch {
    deps.openMailto(`mailto:${email}`);
    return "mailto";
  }
}
