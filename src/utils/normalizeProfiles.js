export function normalizeProfiles(profiles) {
  if (!profiles.length) return [];

  let ownerExists = profiles.some(p => p.role === "owner");

  return profiles.map((p, index) => {
    if (!p.role) {
      return {
        ...p,
        role: index === 0 && !ownerExists ? "owner" : p.isKids ? "kids" : "adult",
        pin: p.pin || null,
      };
    }
    return p;
  });
}
