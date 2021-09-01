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
cd functions && npm install
```

## Set up connection to App Search before running locally

1. Set up and run App Search locally.
2. Create a new empty engine called 'pokemon'
3. In the next section, you'll add the connection details from this instance to `test-params.env`.

## Run locally inside of a test project (emulated environment)

The best way to develop an extension is using a local emulation of a Firebase project, not an actual project on Firebase in the cloud.

For an extension in an emulated environment you don't actually collect configuration from a user via UI, you set the values in `test-params.env`.

Copy `test-params.env.example` to `test-params.env` and replace the values with your configuration.

We have a project configured for use in a local emulation already under `/test_project`. The project is called "pokemon" and uses data set. You can read more about running an emulated environment for testing here [here](https://firebase.google.com/docs/emulator-suite) and [here](https://firebase.google.com/docs/extensions/alpha/test#emulator).

```shell
cd functions
npm run build -- -w # Typescript must be compiled before we can run them, and we'll watch (-w) it for changes so we can recompile

# In a new tab
cd test_project
firebase ext:dev:emulators:start --test-config=firebase.json --test-params=test-params.env --project=pokemon
```

Navigate to http://localhost:4000/

This will run your local emulator with the extension installed.

`firebase.json` tells the emulator which emulators to use and which ports to start them on.

TODO: Include seed file by using --import:

> If you're testing a Cloud Firestore trigger, it can be helpful to start the emulator with the --import flag, to automatically pre-populate the emulator with data.

## Install and run in an actual cloud project:

https://firebase.google.com/docs/extensions/alpha/test#install-in-project

This is most useful for demoing and stepping through the CLI install experience as an actual user would. It's a bit harder to use when you're developing the project as you have to push the changes to the extension every time you make them.

If you don't have a "pokemon" project in your cloud Firebase yet, you would need to log into Firebase cloud and create one with the name and id "pokemon".

Note that you can install this extension to ANY project you have in the cloud, not just the pokemon project that this emulated environment uses. Just specify a "--project" id in the CLI.

Ex.

```
# Make sure your extension has been rebuilt with your latest changes before publishing
cd functions && npm run build
cd ..

# If you'd like to step through the configuration experience
firebase ext:install . --project=pokemon

# If you'd like to read configuration from your .env file
firebase ext:install . --project=pokemon --params=test_project/test-params.env
```

## Testing the extension after the emulator is running

In the Firestore emulator, create a collection called "pokemon" and add a document to it. That document should be syned to your App Search instance.

You can check the logs to see if it ran in the "Logs" tab of the emulator.

TODO: This url isn't quite right, we need to add an "api" for this to our extensions.yaml file to expose it and then figure out what the correct url is

Also, try querying App Search via the search endpoint: http://localhost:5001/pokemon/us-central1/search?query=pikachu