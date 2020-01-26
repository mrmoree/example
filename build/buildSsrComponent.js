let fs = require("flowfs/mkdirp");
let rollup = require("rollup");
let svelte = require("rollup-plugin-svelte");
let resolve = require("rollup-plugin-node-resolve");
let commonjs = require("rollup-plugin-commonjs");
let sass = require("./sass");

module.exports = async function(path, options, cache) {
	let css;
	
	let inputOptions = {
		input: path,
		
		cache,
		
		plugins: [
			svelte({
				generate: "ssr",
				
				preprocess: {
					style: sass,
				},
				
				css: (c) => {
					css = c;
				},
				
				onwarn: _ => null,
			
				dev: options.dev,
			}),
	
			resolve({
				browser: true,
			}),
			
			commonjs(),
		],
		
		onwarn(warning, next) {
			if (warning.code !== "UNUSED_EXTERNAL_IMPORT") {
				next(warning);
			}
		},
	};
	
	let outputOptions = {
		format: "cjs",
	};
	
	let bundle = await rollup.rollup(inputOptions);
	
	let {output} = await bundle.generate(outputOptions);
	
	if (options.saveJs) {
		fs(path).reparent(options.dir, options.buildDir).withExt(".server.js").write(output[0].code);
	}
	
	return {
		cache: options.cache && bundle.cache,
		component: output[0].code,
		css,
	};
}
