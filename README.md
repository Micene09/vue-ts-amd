# vue-ts-amd
> A full-featured Vue.js 2 boilerplate using AMD pattern and Typescript

This boilerplate was built from scratch, with the help of the Vue.js community, just to cover the need (mostly mine) to use the [AMD](https://en.m.wikipedia.org/wiki/Asynchronous_module_definition) pattern and Typescript tech.

## Features and Stack

- Modular programming using [Require.js](http://requirejs.org)
- Easy module mapping system to require vendor dependencies dinamically (from node_modules, bower_components or wathever)
- [Karma](https://karma-runner.github.io/1.0/index.html) as test runner
- [Mocha](https://mochajs.org)
, [Chai](http://chaijs.com)
, [Avoriaz](https://github.com/eddyerburgh/avoriaz/)
 as test libraries
- Code using Typescript in both develop and unit-tests
- Stylize modules using [Sass](http://sass-lang.com)
- Live reload/injection in dev mode using [BrowserSync](https://www.browsersync.io)
- [Gulp.js](https://gulpjs.com) (internal use)
- [Require-vuejs](https://github.com/edgardleal/require-vuejs), to import vue component files (.vue) inside ts scripts
- Generate compiled and minified files ready for production

## Installation

This is a project template for [vue-cli](https://github.com/vuejs/vue-cli/blob/master/README.md), install it via terminal using:
```
npm i -g vue-cli
```

Then install the boilerplate:
```
vue init Micene09/vue-ts-amd my-project
cd my-project
npm i
```
...or just download this repo, all you need is in template folder.

## Modules Mapping System

### Usage

In the root path of this boilerplate, you will find a file named **modules.json** with the following schema:

```javascript
{
	"module_name" {
		"max": "path to the maximized/normal file" // << required
		"min": "path to the minified file"  // << optional
	}
}
```

...just for example:

```javascript
{
	"vue": {
		"min": "/node_modules/vue/dist/vue.min.js",
		"max": "/node_modules/vue/dist/vue.js"
	}
}
```

If you are using a module from node_moduels folder like the example above, **the module_name should be the same as node module**, just like *require("the npm module name")* in Node.js .

In this way, you will be able to import your modules like this:

```typescript
// typescript file:
import { Vue } from "vue-property-decorator";
import _ from "lodash";

new Vue({...});

// compiled javascript file:
define(["vue", "lodash"], function(vue_property_decorator, _) {
	new vue_property_decorator.Vue({...});
});
```

Because of moduleResolution strategy (node), we will automatically keep typings definitions (if provided by the module's author) inside our modular AMD scripts (.ts).

Consider to use AMD/UMD version only for every 3rd party module to get everything working.

Note that in the example provided, i'm using:
```typescript
// typescript file:
import { Vue } from "vue-property-decorator";
```
instead of:
```typescript
// typescript file:
import Vue from "vue";
```
...just to override the default Typescript's compiler resolution for Vue.js module, that will try to load the CommonJs version, while loading the reference from "vue-property-decorator" we will get the UMD version.

### Build processes explained

Running dev or release build process...
- Every module mapped in modules.json, will be copied and renamed to **vendor/[module name].js**
- A new file named **require.vendor.js** will be created in both dev and release, containing the [require.js path mapping](http://requirejs.org/docs/api.html#config-paths) for every module mapped in modules.json .

***It's very important to include the require.vendor.js file in your entry point html code.***

Use the following as guide to boot your entry point:

```html
<script src="require.vendor.js"></script>
<script src="vendor/require.js" data-main="main.js"></script>
```

Note that require.js was mapped in modules.json, then included in page using *vendor/require.js* as URL.

Check *src/index.html* and *modules.json* provided in this repo.


## Included scripts

### npm run test
Will run tests  (*.ts) located inside */test* folder in watch mode.
Tests will restarts after every typescript file change inside */test*.

### npm run dev-prepare
Will prepare (**compile**) the project's files inside */src* folder to the */build* folder.
The **maximized** modules version defined in modules.json will be copied to */build/vendor*.

### npm run dev
Will prepare the project's files as the *npm run dev-prepare*, then will execute the BrowserSync instance using live reload/injection.
Your default browser will open up at the end of this process and...
- For every typescript file change inside */ts* folder, a ts compile will run (using gulp-typescript) with an automatic browser reload at the end
- For every html/vue file change, the file will be copied to */build/[relative path]* and browser will reload.
- For every scss file change, a sass compile will run (using gulp-sass), compiling just the saved *.scss, the resulting css file will be copied to the */build/[relative path]* folder (respecting his original path inside */src*) and injected in page without reloading browser.

Check [BrowserSync](https://www.browsersync.io) for other related features.

### npm run release
Will prepare (**compile**) the project's files inside */src* folder to the */release* folder.
The **minified** modules version (if provided, otherwise the maximized version will be used) defined in modules.json will be copied to */release/vendor*.

### npm run release-preview
Will prepare the project's files as the *npm run release*, then will execute the BrowserSync instance just to preview the release build of the project.

## About .vue files

In my opinion, write a single file component is useful if this component is very simple...and for very simple things, vanilla javascript works good.
In this case, the [require-vuejs](https://github.com/edgardleal/require-vuejs) module is covering our needs.

While, when a component is increasing his complexity, reaching the need to be typed, i prefer to use separate set of files (.ts for source/definition, .html for templating, .scss for styling).

This is the reason why i'm not trying to code using typescript inside .vue files.
