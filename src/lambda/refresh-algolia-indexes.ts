import { Handler, Context, Callback, APIGatewayEvent } from "aws-lambda";
import { createClient, Entry } from "contentful";
import removeMd from "remove-markdown";
import algoliasearch from "algoliasearch";
import { Sermon } from "../model/sermon";
import { contentTypes } from "../model/content-types";
import { indexNames } from "../search/algolia";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";

dotenv.config();

// For more info, check https://www.netlify.com/docs/functions/#javascript-lambda-functions
const {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_CDA_TOKEN,
  ALGOLIA_APP_ID,
  ALGOLIA_ADMIN_KEY,
  SENTRY_DATA_SOURCE_NAME_NODE
} = process.env;

if (
  CONTENTFUL_SPACE_ID == null ||
  CONTENTFUL_CDA_TOKEN == null ||
  ALGOLIA_APP_ID == null ||
  ALGOLIA_ADMIN_KEY == null ||
  SENTRY_DATA_SOURCE_NAME_NODE == null
) {
  throw new Error(
    "You must set the environment variables: CONTENTFUL_SPACE_ID, CONTENTFUL_CDA_TOKEN, ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY. If you're working locally, create a .env file containing these values (see .env.sample)."
  );
}

Sentry.init({
  dsn: SENTRY_DATA_SOURCE_NAME_NODE
});

const ctfClient = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_CDA_TOKEN
});

const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
const sermonsIndex = algoliaClient.initIndex(indexNames.sermons);

export async function refreshSermonsIndex() {
  await sermonsIndex.clearIndex();

  // fetch entries of type post from Contentful
  const { items, total } = await ctfClient.getEntries<Sermon>({
    content_type: contentTypes.sermon,
    limit: 1 // TODO: Batching! We'll hit 1000 soon enough...
  });

  const sermonIndexObjects = items.map(sermon => ({
    url: `/sermons/${sermon.fields.slug}/`,
    description:
      sermon.fields.description != undefined
        ? removeMd(sermon.fields.description)
        : undefined,
    title: sermon.fields.title,
    date: sermon.fields.date,
    sermonSeries:
      sermon.fields.series != undefined
        ? sermon.fields.series.fields.title
        : undefined,
    books:
      sermon.fields.books != undefined
        ? sermon.fields.books.map(entry => entry.fields.title)
        : [],
    scriptures: sermon.fields.scriptures,
    length: sermon.fields.length,
    file: sermon.fields.file.fields.file.url,
    speakers: sermon.fields.speakers.map(entry => entry.fields.name),
    objectID: sermon.sys.id
  }));

  const indexedContent = await sermonsIndex.addObjects(sermonIndexObjects);

  return indexedContent.objectIDs;
}

interface RefreshIndexesResponse {
  statusCode: number;
  body: string;
}

const handler: Handler = async function(
  event: APIGatewayEvent,
  context: Context
): Promise<RefreshIndexesResponse> {
  try {
    var objectIds = await refreshSermonsIndex();
    return {
      statusCode: 200,
      body: JSON.stringify(objectIds.length)
    };
  } catch (error) {
    Sentry.captureException(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};

export { handler };
