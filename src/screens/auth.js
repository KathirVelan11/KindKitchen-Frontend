// auth.js
// In-memory storage for tokens and roles (not persisted between app reloads)
let authToken = null;
let userRole = null;
let userId = null;

export const setAuthToken = (token) => {
  console.log('Setting auth token:', token);
  authToken = token;
};

export const getAuthToken = () => {
  return authToken;
};

export const setUserRole = (role) => {
  console.log('Setting user role:', role);
  userRole = role;
};

export const getUserRole = () => {
  return userRole;
};

export const setUserId = (id) => {
  console.log('Setting user ID in memory:', id);
  userId = id;
};

export const getUserId = () => {
  console.log('Getting user ID from memory:', userId);
  return userId;
};