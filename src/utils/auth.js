export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const decodeToken = (token) => {
  try {
    if (!token) return null;
    const payload = token.split('.')[1];
    if (!payload) return null;
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.substring(0, (4 - base64.length % 4) % 4);
    const decodedStr = atob(padded);
    const decoded = JSON.parse(decodedStr);
    return decoded.user || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};