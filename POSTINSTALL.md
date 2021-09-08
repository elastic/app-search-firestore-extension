<!--
This file provides your users an overview of how to use your extension after they've installed it. All content is optional, but this is the recommended format. Your users will see the contents of this file in the Firebase console after they install the extension.

Include instructions for using the extension and any important functional details. Also include **detailed descriptions** for any additional post-installation setup required by the user.

Reference values for the extension instance using the ${param:PARAMETER_NAME} or ${function:VARIABLE_NAME} syntax.
Learn more in the docs: https://firebase.google.com/docs/extensions/alpha/create-user-docs#reference-in-postinstall

Learn more about writing a POSTINSTALL.md file in the docs:
https://firebase.google.com/docs/extensions/alpha/create-user-docs#writing-postinstall
-->

# Using the extension

Make any create, update, or delete action in your Firestore, then visit your App Search instance at ${param:ENTERPRISE_SEARCH_URL} and see that your document has now been indexed.

You can also visit ${function:search.url} to test out full-text search. Add a `q=<your query here>` to perform the search.

## Import existing documents

In order to index existing documents into App Search, you can use the following script.

NOTE: In the future this will use an `npx` command with a published npm package called `app-search-firestore-extension`.

```shell
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/serviceAccountKey.json \
COLLECTION_PATH=${param:COLLECTION_PATH} \
INDEXED_FIELDS=${param:INDEXED_FIELDS} \
ENTERPRISE_SEARCH_URL=${param:ENTERPRISE_SEARCH_URL} \
APP_SEARCH_API_KEY=${param:APP_SEARCH_API_KEY} \
APP_SEARCH_ENGINE_NAME=${param:APP_SEARCH_ENGINE_NAME} \
node ./lib/bin/import.js
```

You may also want to use this script to reindex your data. For instance, if you add an indexed field to your configuration, you'd want to run this script in order to re-index all data with the new field to App Search.

# Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.
