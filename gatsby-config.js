const proxy = require("http-proxy-middleware");
const dotenv = require("dotenv");

dotenv.config();

const {
  SENTRY_DATA_SOURCE_NAME_BROWSER,
  GOOGLE_ANALYTICS_TRACKING_ID,
  DEPLOY_ENV
} = process.env;

if (SENTRY_DATA_SOURCE_NAME_BROWSER == null) {
  throw new Error(
    `You must set the environment variable: SENTRY_DATA_SOURCE_NAME_BROWSER.
    If you're working locally, create a .env file containing these values (see .env.sample).`
  );
}

if (["production", "staging", "development"].indexOf(DEPLOY_ENV) === -1) {
  throw new Error(
    `You must set the environmental variable: DEPLOY_ENV.
    This must be either production, staging, or development`
  );
}

const plugins = [
  `gatsby-plugin-react-helmet`,
  `gatsby-plugin-typescript`,
  {
    resolve: "gatsby-plugin-sentry",
    options: {
      dsn: SENTRY_DATA_SOURCE_NAME_BROWSER,
      // Optional settings, see https://docs.sentry.io/clients/node/config/#optional-settings
      environment: DEPLOY_ENV,
      enabled: (() => ["production", "staging"].indexOf(DEPLOY_ENV) !== -1)()
    }
  },
  {
    resolve: "gatsby-plugin-robots-txt",
    options: {
      resolveEnv: () => DEPLOY_ENV,
      env: {
        production: {
          policy: [{ userAgent: "*" }],
          sitemap: null
        },
        staging: {
          policy: [{ userAgent: "*", disallow: ["/"] }],
          sitemap: null,
          host: null
        },
        development: {
          policy: [{ userAgent: "*", disallow: ["/"] }],
          sitemap: null,
          host: null
        }
      }
    }
  }
];

if (
  GOOGLE_ANALYTICS_TRACKING_ID != null &&
  GOOGLE_ANALYTICS_TRACKING_ID.length !== 0
) {
  plugins.push({
    resolve: `gatsby-plugin-google-analytics`,
    options: {
      trackingId: GOOGLE_ANALYTICS_TRACKING_ID
    }
  });
}

module.exports = {
  siteMetadata: {
    title: `Vine Church`,
    siteUrl: "https://vinechurch.com.au"
  },
  plugins: plugins,

  // for avoiding CORS while developing Netlify Functions locally
  // read more: https://www.gatsbyjs.org/docs/api-proxy/#advanced-proxying
  developMiddleware: app => {
    app.use(
      "/.netlify/functions/",
      proxy({
        target: "http://localhost:9000",
        pathRewrite: {
          "/.netlify/functions/": ""
        }
      })
    );
  }
};
