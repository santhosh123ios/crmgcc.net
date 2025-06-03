export const clearData = () => {
  localStorage.removeItem("authToken");
  // Clear any other data if needed
  // localStorage.clear(); // if you want to clear all
  window.location.href = "/login";
};