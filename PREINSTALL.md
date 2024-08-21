<!--
This file provides your users an overview of your extension. All content is optional, but this is the recommended format. Your users will see the contents of this file when they run the `firebase ext:info` command.

Include any important functional details as well as a brief description for any additional setup required by the user (both pre- and post-installation).

Learn more about writing a PREINSTALL.md file in the docs:
https://firebase.google.com/docs/extensions/alpha/create-user-docs#writing-preinstall
-->

The Elastic App Search Firestore extension enables comprehensive [full-text search](https://firebase.google.com/docs/firestore/solutions/search) for your Firebase applications.

This extension indexes and syncs the documents in a Cloud Firestore collection to an [Elastic App Search](https://www.elastic.co/app-search?ultron=firebase-extension&blade=preinstall&hulk=product) deployment by creating a Cloud Function which syncs changes in your collection on any [write event](https://firebase.google.com/docs/functions/firestore-events#function_triggers) (any time you create, update, or a delete a document).

**NOTE:** This extension is no longer maintained. We encourage the community use the open and supported [connectors framework](https://www.elastic.co/guide/en/enterprise-search/current/connectors.html#connectors-overview-framework) to build an Elasticsearch connector for integration with Google Cloud Firestore.

#### Elastic App Search

Elastic App Search provides a comprehensive API for implementing common search patterns like auto-completed search suggestions and faceted filter navigation. You'll also have tooling so your team can easily track and tweak search relevance based on usage data.

App Search is a part of [Elastic Enterprise Search](https://www.elastic.co/guide/en/enterprise-search/current/installation.html). You'll need an Enterprise Search deployment, which is created and maintained outside of Firebase. 

#### Getting started

1. Start an Enterprise Search deployment. You can provision one easily with [Elastic Cloud on GCP](https://console.cloud.google.com/marketplace/product/endpoints/elasticsearch-service.gcpmarketplace.elastic.co).
2. Once you have a deployment running, you'll need an [App Search Engine](https://www.elastic.co/guide/en/app-search/current/getting-started.html#getting-started-with-app-search-engine) to sync to your collection.
3. Once you've installed the extension and your Firestore collection is synced to App Search, you're ready to [start searching](https://www.elastic.co/guide/en/app-search/current/search-guide.html)!

You can use the App Search [Search API](https://www.elastic.co/guide/en/app-search/current/search.html) for full-text search and everything you need to build a complete search experience: facets, filters, click analytics, query suggestion, relevance tuning and much more.

If you have documents in your collection already, this extension also provides a [script](https://github.com/elastic/app-search-firestore-extension/tree/master/functions/src/bin) for backfilling existing data to App Search.

<!-- We recommend keeping the following section to explain how billing for Firebase Extensions works -->

#### Billing
 
To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)
 
- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s free tier:
  - Cloud Functions (Node.js 10+ runtime. See [FAQs](https://firebase.google.com/support/faq#expandable-24))
  - Cloud Firestore
  - Cloud Secret Manager

If you host your Elastic Enterprise Search instance on Elastic Cloud, you will also be responsible for charges associated with that service.

[Learn more about Elastic Cloud](https://www.elastic.co/cloud?ultron=firebase-extension&blade=preinstall&hulk=product).
