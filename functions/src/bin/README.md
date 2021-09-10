# Setup

## Building the script

All setup must be run from the directory `/app-search-firestore-extension/functions`

Typescript must be compiled before we can run this script

```
npm run build
```

If you are developing the script you can add a `-- -w` flag to watch it

```
npm run build -- -w
```

## Running the script

All scripts must be run from the directory `/app-search-firestore-extension/functions`, and only after building the script

To run against a local Firebase emulator:

```
FIRESTORE_EMULATOR_HOST=localhost:8081 \
GCLOUD_PROJECT=nationalparks \
COLLECTION_PATH=nationalparks \
INDEXED_FIELDS=title,description,visitors,acres,location,date_established \
ENTERPRISE_SEARCH_URL=http://localhost:3002 \
APP_SEARCH_API_KEY=private-asfdsaafdsagfsgfd \
APP_SEARCH_ENGINE_NAME=nationalparks \
node ./lib/bin/import.js
```

To run against a cloud Firebase instance:

```
GOOGLE_APPLICATION_CREDENTIALS=~/Downloads/app-search-extension-testing-firebase-adminsdk-asdfsa-fdasfdsa.json \
GCLOUD_PROJECT=nationalparks \
COLLECTION_PATH=nationalparks \
INDEXED_FIELDS=title,description,visitors,acres,location,date_established \
ENTERPRISE_SEARCH_URL=http://localhost:3002 \
APP_SEARCH_API_KEY=private-asfdsaafdsagfsgfd \
APP_SEARCH_ENGINE_NAME=nationalparks \
node ./lib/bin/import.js
```
