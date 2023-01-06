<p align="center"><br><img src="https://avatars3.githubusercontent.com/u/16580653?v=4" width="128" height="128" /></p>

<h3 align="center">Ionic/Angular SQLite TypeOrm App</h3>
<p align="center"><strong><code>ionic-sqlite-typeorm-app</code></strong></p>
<p align="center">Ionic/Angular application demonstrating the use of the</p>
<p align="center"><strong><code>@capacitor-community/sqlite</code></strong></p>
<p align="center"><strong><code>with the TypeORM ORM</code></strong></p>
<br>
<p align="center"><strong><code>this app uses Capacitor 4</code></strong></p>
<br>
<p align="center">
  <img src="https://img.shields.io/maintenance/yes/2023?style=flat-square" />
  <a href="https://github.com/jepiqueau/ionic-sqlite-typeorm-app"><img src="https://img.shields.io/github/license/jepiqueau/ionic-sqlite-typeorm-app?style=flat-square" /></a>
  <a href="https://github.com/jepiqueau/ionic-sqlite-typeorm-app"><img src="https://img.shields.io/github/package-json/v/jepiqueau/ionic-sqlite-typeorm-app/master?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href="#contributors-"><img src="https://img.shields.io/badge/all%20contributors-1-orange?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
</p>

## Maintainers

| Maintainer        | GitHub                                    | Social |
| ----------------- | ----------------------------------------- | ------ |
| Quéau Jean Pierre | [jepiqueau](https://github.com/jepiqueau) |        |


## Installation

To start building your App using this  App, clone this repo to a new directory:

```bash
git clone https://github.com/jepiqueau/ionic-sqlite-typeorm-app.git 
cd ionic-sqlite-typeorm-app
git remote rm origin
```

 - then install it

```bash
npm install
```

the capacitor config parameters are:

```
  "appId": "com.jeep.app.ionic.angular.typeorm",
  "appName": "ionic-sqlite-typeorm-app",
```

### Requirements for running TypeOrm

 - the `terser-webpack-plugin` has been installed and a `custom.webpack.config.js` file has been added to be able to use the migration.

 ```js
  var webpack = require('webpack');
  var TerserPlugin = require('terser-webpack-plugin')

  console.log('The custom config is used');
  module.exports = {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
            keep_fnames: true,
          },
        }),
      ],
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
            result.request = result.request.replace(/typeorm/, "typeorm/browser");
        })
    ],
  };
 ```

 - the `angular.json` has been modified

    - replacing 
    ```json
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "www",
    ```
    - by
    ```json
      "architect": {
        "build": {
          "builder": "@angular-builders/custom-webpack:browser",
          "options": {
            "customWebpackConfig": {
              "path": "./custom.webpack.config.js"
            },
            "allowedCommonJsDependencies": [
              "debug",
              "buffer",
              "sha.js"
            ],
            "outputPath": "www",
    ```
    - and
    ```json
      "serve": {
        "builder": "@angular-devkit/build-angular:dev-server",
        "options": {
          "browserTarget": "app:build"
        },
    ```
    - by
    ```json
      "serve": {
        "builder": "@angular-builders/custom-webpack:dev-server",
        "options": {
          "browserTarget": "app:build"
        },
    ```





### Building Web Code

 - development
   - angular cli

   ```bash
   npm run start
   ```
   - ionic cli

   ```bash
   ionic serve
   ```
 - production 

  ```bash
  npm run build:web
  ````

### Building Native Project

```bash
npm run build:native
npx cap sync
npm run build:native
npx cap copy
```

#### Android

```bash
npx cap open android
```
Once Android Studio launches, you can build your app through the standard Android Studio workflow.

### iOS

```bash
npx cap open ios
```


## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<p align="center">
  <a href="https://github.com/jepiqueau"><img src="https://github.com/jepiqueau.png?size=100" width="50" height="50" /></a>

</p>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
