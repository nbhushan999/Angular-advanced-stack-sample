import { configFactory } from '@cloud-ui/config';
import { configOptions } from '@identity/config';

const config = configFactory(window.document, configOptions);

export default {
  oidc: {
    clientId: config.auth.oktaClientId,
    issuer: config.auth.oktaIssuer,
    redirectUri: config.auth.oktaRedirectUriForLogin,
    scopes: ['openid', 'profile', 'email'], // offline access
    pkce: true,
    testing: {
      disableHttpsCheck: true,
    },
  },
};
