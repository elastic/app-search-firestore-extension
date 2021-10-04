<!--
This file provides your users an overview of how to use your extension after they've installed it. All content is optional, but this is the recommended format. Your users will see the contents of this file in the Firebase console after they install the extension.

Include instructions for using the extension and any important functional details. Also include **detailed descriptions** for any additional post-installation setup required by the user.

Reference values for the extension instance using the ${param:PARAMETER_NAME} or ${function:VARIABLE_NAME} syntax.
Learn more in the docs: https://firebase.google.com/docs/extensions/alpha/create-user-docs#reference-in-postinstall

Learn more about writing a POSTINSTALL.md file in the docs:
https://firebase.google.com/docs/extensions/alpha/create-user-docs#writing-postinstall
-->

## See it in action

You can test out this extension right away!

1.  Go to your [Cloud Firestore dashboard](https://console.firebase.google.com/project/${param:PROJECT_ID}/firestore/data) in the Firebase console.

2.  If it doesn't already exist, create the collection you specified during installation: `${param:COLLECTION_PATH}`

3.  Create a document in the collection that contains any of the fields you specified as indexed fields during installation:

```js
`${param:INDEXED_FIELDS}`
```

4.  Go to the documents page of the Engine you created inside of your [App Search Dashboard](${param:ENTERPRISE_SEARCH_URL}/as#/engines/${param:APP_SEARCH_ENGINE_NAME}/documents). You should see the that document you just created listed on this page.

## Using the extension

Whenever a document is created, updated, imported, or deleted in the specified collection, this extension sends that update to App Search. You can then run tull-text searches on this mirrored dataset.

After documents are indexed into App Search, you'll have the complete App Search [Search API](https://www.elastic.co/guide/en/app-search/current/search.html) available to you for searching.

Note that this extension only listens for document changes in the collection, but not changes in any subcollection.

## _(Optional)_ Backfill or import existing documents

This extension only sends the content of documents that have been changed -- it does not export your full dataset of existing documents into App Search. So, to backfill your dataset with all the documents in your collection, you can run the import script provided by this extension.

Before running the script, first follow the instructions [here](https://firebase.google.com/docs/admin/setup#initialize-sdk) to "To generate a private key file for your service account". Download it and save it somewhere as `serviceAccountKey.json`.

```shell
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/serviceAccountKey.json \
COLLECTION_PATH=${param:COLLECTION_PATH} \
INDEXED_FIELDS=${param:INDEXED_FIELDS} \
ENTERPRISE_SEARCH_URL=${param:ENTERPRISE_SEARCH_URL} \
APP_SEARCH_API_KEY=${param:APP_SEARCH_API_KEY} \
APP_SEARCH_ENGINE_NAME=${param:APP_SEARCH_ENGINE_NAME} \
npx @elastic/app-search-firestore-extension import
```

## _(Optional)_ Configure App Search engine schema

It is important to note that all data is initially indexed into App Search as text fields.

This means that even if your field is a `timestamp` or `number` in Firestore, it will be indexed as text in App Search initially.

This is fine for fields that you'd like to perform full-text search on. However, if you plan to something like sort numerically or implement range filters when calling `search`, you should first visit the Schema page for your Engine in the App Search Dashboard and select the correct types for your fields.

You can read more about Schemas [here](https://www.elastic.co/guide/en/app-search/current/indexing-documents-guide.html#indexing-documents-guide-schema).

## _(Optional)_ Reindex

There may be times where you want to reindex all of your documents from this collection to App Search.

For instance, if you change the "indexed fields" configuration in this extension, you should then run a reindex in order to make sure that the changes are picked up in App Search.

To reindex data, use the steps listed above for "Backfill or import existing documents".

## How documents are indexed in App Search

The TLDR for this section is:

- `text` and `number` type fields are indexed as-is to App Search.
- `geo` and `timestamp` fields are formatted slightly differently when indexed.
- `map`, `boolean`, and `reference` are not supported by App Search, they will be indexed as text.
- nested arrays are not supported at all and will be dropped before indexing in App Search.
- While `map`s are not supported, you _can_ specify that fields within a map get indexed as top level fields in App Search, using the `__` syntax when configuring indexed fields
- App Search only supports lower-cased alphanumeric characters and underscores ("\_") in field names. This extension will rename fields that don't match, or you can use the `::` syntax to specify what it is renamed to when configuring indexed fields.

It is important to note that not all [data types supported by Firestore](https://firebase.google.com/docs/firestore/manage-data/data-types) are compatible with the [data types supported by App Search](https://www.elastic.co/guide/en/app-search/current/api-reference.html#overview-api-references-schema-design).

Some types are supported in a 1-to-1 way: `text`, `number`.

Others are supported, but formatted slightly differently: `timestamp`, `geo`.

Others are simply not supported: `boolean`, `map`, `reference`.

**It is also important to note that ONLY fields that you specify as Indexed Fields in this extension will be indexed into App Search**.

For example, given the following document in Firestore:

```json
{
  "id": "12345",
  "name": "Rocky Mountain",
  "nps_link": "https://www.nps.gov/romo/index.htm",
  "states": ["Colorado"],
  "visitors": 4517585,
  "world_heritage_site": false,
  "location": {
    "_latitude": 41.12,
    "_longitude": -71.34
  },
  "acres": 265795.2,
  "square_km": 1075.6,
  "date_established": {
    "_seconds": 1631213624,
    "_nanoseconds": 176000000
  }
}
```

If you've configured the plugin with indexed fields of `name,states`, then the document will be indexed into App Search as the following:

```json
{
  "id": "12345",
  "name": "Rocky Mountain",
  "states": ["Colorado"]
}
```

That means you could then perform a search with the App Search Search API over the `name` and `states` fields for results.

### Similar types, formatted differently

As mentioned above, types are somtimes formatted differently in App Search. So given the same example document above, but configured with `name,states,location,date_established` as the indexed fields, you'll see that the `location` and `date_established` fields have been formatted slightly differently.

```json
{
  "id": "12345",
  "name": "Rocky Mountain",
  "states": ["Colorado"],
  "location": "41.12,-71.34",
  "date_established": "2021-09-09T18:53:44.000Z"
}
```

We put them in this special format so that App Search is able to recognize them as the correct types. Unlike the name and states fields, you may want to do more than just searching on these fields. In fact, you most likely won't want to search on these fields at all; it's much more likely that you'll want to use these for things like filtering and sorting.

### Types not supported by App Search

There are some types of fields that ARE supported by Firestore, but not by App Search. So, when data is indexed, you may see that some data is dropped, or see that it is indexed in a way you may not have expected.

**Maps**

App Search does not support the concepts of maps. You may only have top-level fields. If you send a map to App Search, it will simply serialize your map and store it as a text:

Firestore:

```json
{
  "id": "12345",
  "foo": {
    "bar": {
      "baz": "some value"
    }
  }
}
```

App Search:

```json
{
  "id": "12345",
  "foo": {
    "bar": "{\"bar\":{\"baz\":\"some value\"}}"
  }
}
```

**So are values in maps searchable? Yes, see the Nested Fields section for more info.**

**Nested arrays**

Nested arrays are not supported by App Search. Nested arrays will simply be dropped.

Firestore:

```json
{
  "id": "12345",
  "foo": [["a"]]
}
```

App Search:

```json
{
  "id": "12345",
  "foo": []
}
```

**Reference**

If you try to index a `reference` field to App Search, it will simply be serialized as if it were any other object, as serialized text:

Firestore:

```json
{
  "id": "12345",
  "some_reference": {
    "_firestore": {
      "projectId": "national_parks"
    },
    "_path": {
      "segments": ["national_parks", "123"]
    },
    "_converter": {}
  }
}
```

App Search:

```json
{
  "id": "12345",
  "some_reference": "{\"_firestore\":{\"projectId\":\"national_parks\"},\"_path\":{\"segments\":[\"national_parks\",\"123\"]},\"_converter\":{}}"
}
```

### Nested fields

While the `map` type is not supported in App Search, you _can_ index fields from within a `map` into App Search. It will convert them to a new top-level field.

In the provided example, if you used underscores to specify a sub field as indexed, it will index as follows into App Search.

Indexed field: `name,foo__bar__baz`

Firestore:

```json
{
  "id": "12345",
  "name": "test name",
  "foo": {
    "bar": {
      "baz": "some value"
    }
  }
```

App Search:

```json
{
  "id": "12345",
  "name": "test name",
  "foo__bar__baz": "some value"
}
```

Please note that we are adding an additional top name field to your schema, in which we use "\_\_" as a delimiter. This could potentially conflict with other top-level field names, though that will most likely not be the case.

### Field name compatibility and renaming

App Search only supports lower-cased alphanumeric characters and underscores ("\_") in field names. Field values that do not match will be renamed to match:

Indexed field: `name,foo__bar__baz`

Firestore:

```json
{
  "id": "12345",
  "a大": "a大",
  "A1-b-c": "A1-b-c",
  "d e_f": "d e_f",
  "大": "大"
}
```

App Search:

```json
{
  "id": "12345",
  "a": "a大",
  "a1bc": "A1-b-c",
  "de_f": "d e_f"
  // 大 is ommited entirely because it serialized to an empty string
}
```

As this could have underirable effects we allow renaming of fields by using the `::` when specifying indexed fields:

Indexed field: `你好::hello,爱::love,幸福::happiness`

Firestore:

```json
{
  "id": "12345",
  "你好": "你好",
  "爱": "爱",
  "幸福": "幸福"
}
```

App Search:

```json
{
  "id": "12345",
  "hello": "你好",
  "love": "爱",
  "happiness": "幸福"
}
```

## Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.
