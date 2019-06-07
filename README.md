# CUL Toolkit

## Development requirements
```
nodejs >= v10.15.3
yarn >= 1.15.2
```

## Build Instructions
```
yarn install # run the first time you want to build, or if the package.json/yarn.lock file has changed
yarn build
```

## Run Webpack Server For Development
Server runs on http://localhost:3000 and auto-recompiles code when resources change.
```
yarn start
```

## Deployment requirements
```
ruby >= 2.5.3 (we currently have a .ruby-version file requiring 2.5.3)
bundler
```

Deploying a versioned release:

Make sure to rebuild the dist directory:
```
yarn build
```

Update the version in your package.json file.

Run bundle install the first time you want to deploy, or if the Gemfile/Gemfile.lock has changed:
```
bundle install
```

Use capistrano to deploy to the desired environment (dev/test/prod):

Note: In order to deploy, you need to have your public key in the culwcm user's authorized_keys file on the dev/test/prod hosts.

Dev deployment example:

```
cap dev deploy # or replace "dev" with "test" or "prod"
```

Then follow the deployment instructions!
