export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const getUserId = () => {
  return localStorage.getItem("userId");
};

export const getUserType = () => {
  return localStorage.getItem("userType");
};