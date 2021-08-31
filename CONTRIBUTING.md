This project was created using document https://firebase.google.com/docs/extensions/alpha/overview-build-extensions. To view the documentation, your google account must be whitelisted by Google.

This project includes a local firebase project created with the `firebase init` command in order to provide an Emulated firebase environment in which develop the plugin. You can read more about that here: https://firebase.google.com/docs/emulator-suite/connect_and_prototype

Firebase projects are set up to mirror _real_ projects in the cloud. This project is configured to mirror a real project in the cloud called `pokemon-de597`. So many of the files you'll see in this projet have nothing to do with the extension itself, rather, they are here to provide a local environment for which to test an extension.

The only files that are actually part of the extension source are:

```
/functions
extension.yaml
POSTINSTALL.md
PREINSTALL.md
```

Everything else is again, just here to provide an enviornment for which to test this extension.

## Set up the firebase CLI

This project uses the firebase CLI, you should install and log into the CLI first.

You'll use the CLI directly to run and publish this project.

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

TODO: This section can be removed once the extension is configurable

1. Set up and run App Search locally.
2. Create a new empty engine called 'pokemon'
3. In functions/index.ts, change the 'appSearchAPIKey' configuration to use

## Run locally (emulated environment)

The best way to develop an extension is using a local emulation of firebase, not an actual instance on cloud.

For an extension in an emulated environment you don't actually collect configuration from a user via UI, you set the values in `test-params.env`. Copy `test-params.env.example` to `test-params.env` and replace the values with your configuration.

As mentioned above, this project contains all of the tooling to run an emulated environment already, see the documentation [here](https://firebase.google.com/docs/emulator-suite) and [here](https://firebase.google.com/docs/extensions/alpha/test#emulator) to read more.

```shell
cd functions
npm run build -- -w # Typescript must be compiled before we can run them, and we'll watch (-w) it for changes so we can recompile
firebase ext:dev:emulators:start --test-config=firebase.json --test-params=test-params.env
```

Navigate to http://localhost:4000/

This will run your local emulator with the extension installed.

`firebase.json` tells the emulator which emulators to use and which ports to start them on.

TODO: Include seed file by using --import:

> If you're testing a Cloud Firestore trigger, it can be helpful to start the emulator with the --import flag, to automatically pre-populate the emulator with data.

## Install and run in an actual cloud project:

https://firebase.google.com/docs/extensions/alpha/test#install-in-project

Note that you can install this extension to ANY project you have in the cloud, not just the
pokemon project that this emulated environment uses. Just specify a "--project" name in the
CLI.

This is most useful for demoing and stepping through the CLI install experience as an actual user would. It's a bit harder to use when you're developing the project as you have to push the changes to the extension every time you make them.

## Testing the extension after the emulator is running

In the Firestore emulator, create a collection called "pokemon" and add a document to it. That document should be syned to your App Search instance.

You can check the logs to see if it ran in the "Logs" tab of the emulator.

Also, try querying App Search via the search endpoint: http://localhost:5001/pokemon-de597/us-central1/search?query=pikachu
