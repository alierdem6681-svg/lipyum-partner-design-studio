export const isModifiedClick = (event) => event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

export function routeHash(route) {
  const normalized = String(route || "/home").startsWith("/") ? route : `/${route}`;
  return `#${normalized}`;
}

export function isInternalRoute(route) {
  return typeof route === "string" && route.startsWith("/");
}
