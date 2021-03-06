const config = require('minimist')(process.argv.slice(2));
const path = require("path");
const EventEmitter = require('events');

class GulpConfig extends EventEmitter {
	constructor() {
		super();
		this.gulp = require("gulp");
		this.root = __dirname;

		this.baseUrl = config.baseUrl || "/";
		this.modulesConfigFile = config.modulesConfigFile || "require.modules.js";
		this.modulesUrl = config.modulesUrl || "/modules/";

		this.srcFolder = path.resolve(config.srcFolder || "./src");
		this.developFolder = path.resolve(config.developFolder || "./build");
		this.releaseFolder = path.resolve(config.releaseFolder || "./release");

		this.proxyDev = config.proxyDev ? config.proxyDev : null;

		this.browserSync =  require('browser-sync').create();
		this.developModulesFolder = path.join( this.developFolder, this.modulesUrl );
		this.releaseModulesFolder = path.join( this.releaseFolder, this.modulesUrl );

		this.sassConfig = require(config.sassConfig || "./sass.json");
		this.sass_bundles = this.sassConfig.bundles.map((bundle) => {
			bundle.entry = path.resolve(bundle.entry);
			bundle.watch = bundle.watch.map(pattern => path.resolve(pattern));
			return bundle;
		});

		this.globPaths = {
			js: "**/*.js",
			css_build: "**/*.css",

			ts: "**/*.ts",
			sass: this.sassConfig.global_watch,

			static_src: path.join( this.srcFolder, "**/*.{html,htm,tpl,hbs,css,vue,png,jpg,ico,json,eot,svg,ttf,woff,woff2,otf}" ),
			static_build: path.join( this.developFolder, "**/*.{html,htm,tpl,hbs,css,vue,png,jpg,ico,json,eot,svg,ttf,woff,woff2,otf}" )
		};
	}
}
module.exports = new GulpConfig();