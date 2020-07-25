/**
 * Context:
 * - can be think of as a storage setup in the React app which is
 * accessible from anywhere in the component tree
 */
import React from 'react';

export default React.createContext({
  token: null,
  userId: null,
  login: (token, userId, tokenExpiration) => {},
  logout: () => {}
});
