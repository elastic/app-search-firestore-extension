<!--
This file provides your users an overview of your extension. All content is optional, but this is the recommended format. Your users will see the contents of this file when they run the `firebase ext:info` command.

Include any important functional details as well as a brief description for any additional setup required by the user (both pre- and post-installation).

Learn more about writing a PREINSTALL.md file in the docs:
https://firebase.google.com/docs/extensions/alpha/create-user-docs#writing-preinstall
-->

Use this extension to export the documents in a Cloud Firestore collection to [Elastic App Search](https://www.elastic.co/app-search/) and keep them in sync.

Indexing your data into App Search lets you easily add [full-text search](https://firebase.google.com/docs/firestore/solutions/search) to your Firebase application.

App Search doesn't just enable basic full-text search either, it gives all of the tools you need to build full-featured search experiences. You'll have a full API for implementing common search patterns like auto-completed search suggestions and faceted filter navigation. You'll also have dashboard lets your team easily track and tweak search relevance based on actual customer usage data.

##### Indexing

This extension will keep a Cloud Firestore collection synced to an App Search [Engine](https://www.elastic.co/guide/en/app-search/current/getting-started.html#getting-started-with-app-search-engine) by creating a Cloud Function which syncs changes in your collection on any [write event](https://firebase.google.com/docs/functions/firestore-events#function_triggers); meaning any time you create, update, or a delete a document.

##### Backfilling

Since you'll likely have documents created in your collection already, this extension also provides a [script](https://github.com/elastic/app-search-firestore-extension/tree/master/functions/src/bin) for backfilling existing data to App Search.

##### Searching

Once your data synced to App Search, you'll be able to use the App Search [Search API](https://www.elastic.co/guide/en/app-search/current/search.html), which provides not only the ability to perform full-text search, but everything you need to build a complete search experience; facets, filters, click analytics, query suggestion, relevance tuning and much more.

#### Additional setup

##### Create a target for this extension

You'll need an [Elastic Enterprise Search](https://www.elastic.co/guide/en/enterprise-search/current/installation.html) (of which App Search is part of) instance set up, which will be created and maintained outside of Firestore. You can either create one on Elastic's [cloud](https://www.elastic.co/) or host it yourself. You'll then need to gather credentials and information from the deployment to configure this extension.

##### Create a source for this extension

You'll need to have an existing Firebase project created that includes a Firestore Collection.

<!-- We recommend keeping the following section to explain how billing for Firebase Extensions works -->

#### Billing
 
To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)
 
- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s free tier:
  - Cloud Functions (Node.js 10+ runtime. See [FAQs](https://firebase.google.com/support/faq#expandable-24))
  - Cloud Firestore
  - Cloud Secret Manager

If you host your Elastic Enterprise Search instance on Elastic Cloud, you will also be responsible for charges associated with that service.