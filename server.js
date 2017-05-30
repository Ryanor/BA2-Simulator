// import express und http modules 
// they publish HTML-files from the 'public' directory
var http = require('http');
var express = require('express');
var app = express();

var server = http.createServer(app);
var port = 8081;
    
// start server and listen on port 8081
server.listen(port, function () {
 	// Wir geben einen Hinweis aus, dass der Webserer läuft.
	console.log("Webserver up and running on port: " + port);
});
    
// tell 'express' where to find HTML-files
app.use(express.static(__dirname + '/public'));
    
// Done