This project was created using document https://firebase.google.com/docs/extensions/alpha/overview-build-extensions. To view the documentation, your google account must be whitelisted by Google.

This repo contains the source for the Elastic App Search Firebase extension, as well as a test Forebase project (`/test_project`) that we can use to test the extension within.

## Set up the firebase CLI

This project uses the firebase CLI, you should install and log into the CLI first.

You'll use the CLI directly to run the test project locally, as well as deploying and publishing the extension.

```
npm install -g firebase-tools
firebase login
```

You'll also need to unlock the extension development tools:

```
firebase --open-sesame extdev
# Run the following to see what this unlocked for you: firebase --help | grep ext:dev
```

## Setup

```shell
nvm use
npm install
```

## Set up connection to App Search before running locally

1. Set up and run App Search locally.
2. Create a new empty engine called 'nationalparks'
3. In the next section, you'll add the connection details from this instance to `test-params.env`.

## Run locally inside of a test project (emulated environment)

The best way to develop an extension is using a local emulation of a Firebase project, not an actual project on Firebase in the cloud.

For an extension in an emulated environment you don't actually collect configuration from a user via UI, you set the values in `test-params.env`.

Copy `test-params.env.example` to `test-params.env` and replace the values with your configuration.

We have a project configured for use in a local emulation already under `/test_project`. The project is called "nationalparks" and uses data set. You can read more about running an emulated environment for testing here [here](https://firebase.google.com/docs/emulator-suite) and [here](https://firebase.google.com/docs/extensions/alpha/test#emulator).

```shell
npm run watch # Typescript must be compiled before we can run them

# In a new tab
npm run dev
```

Running the `dev` commands runs the following under the hood:

```
firebase ext:dev:emulators:start --test-config=firebase.json --test-params=test-params.env --project=nationalparks --import seed
```

This will run your local emulator with the extension installed.

Navigate to http://localhost:4000/

Breaking that down:

- `cd test_project` - We run the emulator from the `test_project` directory to keep all log files contained there. It's also where we store config for the emulator.
- `ext:dev:emulators:start` - this is a command only available once `firebase --open-sesame extdev` is run.
- `--test-config=firebase.json` - tells the emulator which emulators to use and which ports to start them on.
- `--test-params=test-params.env` - This file is discussed above, it provides user configuration for testing.
- `--project=nationalparks` - For testing in the emulator, we assume we're working on a hypothetical `nationalparks` data set.
- `--import seed` - We stored `seed` data in a `seed` directory using the `export` command, this will reimport that data and populate our `nationalparks` collection.

## Install and run in an actual cloud project:

https://firebase.google.com/docs/extensions/alpha/test#install-in-project

This is most useful for demoing and stepping through the CLI install experience as an actual user would. It's a bit harder to use when you're developing the project as you have to push the changes to the extension every time you make them.

If you don't have a "nationalparks" project in your cloud Firebase yet, you would need to log into Firebase cloud and create one with the name and id "nationalparks".

Note that you can install this extension to ANY project you have in the cloud, not just the nationalparks project that this emulated environment uses. Just specify a "--project" id in the CLI.

Ex.

```
# Make sure your extension has been rebuilt with your latest changes before publishing
npm run build

# If you'd like to step through the configuration experience
firebase ext:install . --project=nationalparks

# If you'd like to read configuration from your .env file
firebase ext:install . --project=nationalparks --params=test_project/test-params.env
```

## To import National Parks dataset into an actual cloud project:

Use the script located in the `/load-data` directory. There is a README there describing how to use it.

## Testing the extension after the emulator is running

In the Firestore emulator, create a collection called "nationalparks" and add a document to it. That document should be syned to your App Search instance.

You can check the logs to see if it ran in the "Logs" tab of the emulator.

Also, try querying App Search via the search endpoint: http://localhost:5001/nationalparks/us-central1/search?query=rocky

## Publishing

The npm script and extension should maintain the same version number and should always be published together to maintain compatibility.

To publish the npm script:

```
# Update the version number in functions/package.json
cd functions
npm run build
npm publish
```

To publish the extension:
[Docs](https://firebase.google.com/docs/extensions/alpha/share)

```
# Update the version in extension.yaml
# Create a new entry for this version in CHANGELOG.md
firebase ext:dev:publish elastic/firestore-elastic-app-search
```

Make sure you are logged into the firebase CLI with your `elastic.co` account.

Note that this plugin is linked to the `elastic-official` project in the `elastic.co` organization in Google Cloud.
