COLLECTION_PATH=pokemon GOOGLE_APPLICATION_CREDENTIALS=~/Downloads/app-search-extension-testing-firebase-adminsdk-hwpfo-d3f7a6c26c.json  GCLOUD_PROJECT=pokemon node ./lib/bin/import.js

COLLECTION_PATH=pokemon FIRESTORE_EMULATOR_HOST=localhost:8081 GCLOUD_PROJECT=test node ./lib/bin/import.js
