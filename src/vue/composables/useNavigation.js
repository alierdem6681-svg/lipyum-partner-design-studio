export function useNavigation(navigateToProp) {
  const navigateTo = (route) => {
    if (typeof navigateToProp === "function") {
      navigateToProp(route);
      return;
    }
    if (typeof window !== "undefined" && typeof window.navigateToPage === "function") {
      window.navigateToPage(route);
      return;
    }
    if (typeof window !== "undefined") {
      window.location.hash = route;
    }
  };

  const goBack = () => {
    if (typeof window !== "undefined" && typeof window.goBack === "function") {
      window.goBack();
      return;
    }
    navigateTo("/home");
  };

  return { navigateTo, goBack };
}
