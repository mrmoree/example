let http = require("http");
let express = require("express");
let svelteViewEngine = require("svelte-view-engine");

process.chdir(__dirname);

let app = express();

let engine = svelteViewEngine({
	template: "template.html",
	dir: "pages",
	type: "html",
	buildScript: "../build/build.js",
	buildDir: "/tmp/svelte-build",
	init: true,
	watch: true,
	liveReload: true,
	liveReloadPort: 48007,
	
	/*
	these options are for the build script; svelte-view-engine doesn't do
	anything with them
	*/
	
	transpile: true,
	minify: true,
});

app.engine(engine.type, engine.render);
app.set("view engine", engine.type);
app.set("views", engine.dir);

app.get("/", function(req, res) {
	res.render("Home", {
		initialCount: 5,
	});
});

http.createServer(app).listen(3000);
