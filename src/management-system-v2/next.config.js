const { readFileSync } = require('fs');

let oauthProvidersConfig;

try {
  const environmentsContent = JSON.parse(
    readFileSync(
      `../management-system/src/backend/server/environment-configurations/${process.env.NODE_ENV}/config_iam.json`,
      'utf8',
    ),
  );

  oauthProvidersConfig = {
    NEXTAUTH_SECRET: environmentsContent.nextAuthSecret,
    USE_AUTH0: environmentsContent.useAuth0,
    AUTH0_CLIENT_ID: environmentsContent.clientID,
    AUTH0_CLIENT_SECRET: environmentsContent.clientSecret,
    AUTH0_clientCredentialScope: environmentsContent.clientCredentialScope,
    AUTH0_ISSUER: environmentsContent.baseAuthUrl,
    AUTH0_SCOPE: environmentsContent.scope,
  };

  Object.entries(oauthProvidersConfig).forEach(
    ([key, value]) => value === undefined && delete oauthProvidersConfig[key],
  );
} catch (_) {
  oauthProvidersConfig = {};
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['antd'],
  env: {
    API_URL:
      process.env.NODE_ENV === 'development' ? 'http://localhost:33080/api' : process.env.API_URL,
    BACKEND_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:33080' : 'FIXME',
    NEXT_PUBLIC_USE_AUTH: process.env.USE_AUTHORIZATION === 'true',
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === 'development'
        ? 'T8VB/r1dw0kJAXjanUvGXpDb+VRr4dV5y59BT9TBqiQ='
        : undefined,
    ...oauthProvidersConfig,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/processes',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
