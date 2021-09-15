# Elastic App Search extension for Firestore

This extension syncs data from Google's [Cloud Firestore](https://firebase.google.com/products/firestore) to [Elastic App Search](https://www.elastic.co/app-search/).

Out-of-the-box, Cloud Firestore provides no mechanism for full-text search on data. Syncing your Cloud Firestore data to Elastic App Search not only gives you a mechanism for full-text search on your data, it also lets you enjoy App Search's powerful relevance tuning features and search analytics data.

## Install

This extension should be installed directly from the [Firebase Extension library](https://firebase.google.com/products/extensions).

For testing purposes, it can also be installed directly from source to a project in your Firebase using the [Firebase CLI](https://firebase.google.com/docs/cli).

After pulling this project source locally, follow these steps:

```shell
npm install -g firebase-tools
npm install
firebase login
firebase ext:install . --project=<ID of your project>
```

## Contributing

Plan to pull this code and run it locally? See [CONTRIBUTING.md](CONTRIBUTING.md).
