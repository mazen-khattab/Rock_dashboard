/** Only accept destinations inside this dashboard, including search and hash. */
export function getAuthRedirect(state: unknown): string {
  if (state && typeof state === "object" && "from" in state &&
      typeof state.from === "string" && /^\/admin(?:\/|[?#]|$)/.test(state.from)) {
    return state.from;
  }
  return "/admin";
}
