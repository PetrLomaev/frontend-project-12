const apiPath = '/api/v1';

const serverRoutes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  channelsPath: () => [apiPath, 'channels'].join('/'),
  messagesPath: () => [apiPath, 'messages'].join('/'),
  signUpPath: () => [apiPath, 'signup'].join('/'),
};

const pageRoutes = {
  login: '/login',
  home: '/',
  signUp: '/signup',
  page404: '*',
};

export { serverRoutes, pageRoutes };
