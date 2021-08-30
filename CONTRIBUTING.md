This project was created using document https://firebase.google.com/docs/extensions/alpha/overview-build-extensions. To view the documentation, you're google account must be whitelisted by Google.

This project includes a local firebase project created with the `firebase init` command in order to provide an Emulated firebase environment in which develop the plugin. You can read more about that here: https://firebase.google.com/docs/emulator-suite/connect_and_prototype

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
cd functions &&  npm install
```

## Run locally (emulated environment)

The best way to develop an extension is using a local environment, not an actual instance on cloud.

This project contains all of the tooling to run an emulated environment already, see the documentation [here](https://firebase.google.com/docs/emulator-suite) to read more.

NOTE: Local projects are set up to mirror *real* projects in the cloud. This project is configured to mirror a project in the cloud called `pokemon-de597`.

```shell
cd functions
npm run build # Typescript must be compiled before we can run them
firebase emulators:start
```

Navigate to http://localhost:4000/
