const fs = require('fs');
const express = require('express');
const { encode } = require('data-to-png');

const app = express();

app.get('/test', function (req, res) {
	fs.readFile('./jquery-3.1.1.min.js', 'utf8', (error, data) => {
		encode(data).then((png) => {
			res.writeHead(200, {
				'Content-Type': 'image/png',
				'Content-Length': png.length,
			});
			res.end(png);
		})
	});
});

app.listen(8080, function () {
	console.log('Server listening on port 8080!');
});
