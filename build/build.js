let yargs = require("yargs");
let fs = require("flowfs");
let buildSsr = require("./buildSsrComponent");
let buildDom = require("./buildDomComponent");

async function main() {
	let {
		name,
		path,
		buildPath,
		options,
		noCache,
	} = JSON.parse(yargs.argv._[0]);
	
	let buildFile = fs(buildPath);
	let cache = {};
	
	if (!noCache && await buildFile.exists()) {
		let {client, server} = await buildFile.readJson();
		
		cache.client = client.cache;
		cache.server = server.cache;
	}
	
	let server = await buildSsr(path, options, cache.server);
	let client = await buildDom(path, name, options, cache.client);
	
	await buildFile.parent.mkdirp();
	
	await buildFile.writeJson({
		server,
		client,
	});
}

main();
