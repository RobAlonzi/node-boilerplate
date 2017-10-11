// THIS IS OUR SERVER ENTRY POINT                      
import "source-map-support/register";

import express from "express";
import bodyParser from "body-parser";
import hbs from "hbs"; 
import http from "http";
import chalk from "chalk";             

const isDevelopment = process.env.NODE_ENV !== "production";

// ---------------------------
// Setup
const app = express();
app.use(bodyParser.json());
const server = new http.Server(app);


// ---------------------------
// Client Webpack
if(process.env.USE_WEBPACK === "true"){
	let webpackMiddleware = require("webpack-dev-middleware"),
		webpackHotMiddleware = require("webpack-hot-middleware"),
		webpack = require("webpack"),
		clientConfig = require("../../webpack.client").create(true);

	const compiler = webpack(clientConfig);
	app.use(webpackMiddleware(compiler, {
		publicPath: "/build/",
		stats: {
			colors: true,
			chunks: false,
			assets: false,
			timings: false,
			modules: false,
			hash: false,
			version: false
		}
		
	}));
	
	app.use(webpackHotMiddleware(compiler));
	console.log(chalk.bgRed("Using Webpack Dev Middleware! THIS IS FOR DEV ONLY!"));
}


// ---------------------------
// Configure Express
app.set("view engine", "hbs");
app.use(express.static("public"));


const useExternalStyles = !isDevelopment;
app.get("*", (req, res) => {
	res.render("index.hbs", { useExternalStyles });
});



// ---------------------------
// Startup
const port = process.env.PORT || 3000;
function startServer(){
	server.listen(port, () => {
		console.log(`Started on port ${port}`);
	});
}

startServer();
