# CUL Toolkit

## Development requirements
```
nodejs >= v20
npm >= 10.2
```

## Vite for development
Dev server runs on http://localhost:8181 and auto-recompiles code when resources change.
```
npm start
```
Preview server runs on http://localhost:4173 and serves the built dist/ dir.
```
npm run preview
```

## Vite Build Instructions
Vite will bundle code and copy public/ files for distribution into the dist/ dir.
```
npm install # run the first time you want to build, or if the package-lock.json file has changed
```
```
npm run build
```

## Deployment requirements

Local machine:
```
ruby >= 2.5.3 (we currently have a .ruby-version file requiring 2.5.3)
bundler
```

Remote deployment server:
```
node >= 10.17.0
yarn >= 1.19.1
```
## Deploying a versioned release

Update the version in your package.json file.

Run bundle install the first time you want to deploy, or if the Gemfile/Gemfile.lock has changed:
```
bundle install
```

Use capistrano to deploy to the desired environment (dev/test/prod):

Dev deployment example:

```
cap dev deploy # or replace "dev" with "test" or "prod"
```

Note: In order to deploy, you need to have your public key in the remote server user's authorized_keys file on your dev/test/prod hosts.

