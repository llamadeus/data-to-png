# data-to-png

[![NPM version](https://img.shields.io/npm/v/data-to-png.svg?style=flat)](https://npmjs.com/package/data-to-png) [![NPM
downloads](https://img.shields.io/npm/dm/data-to-png.svg?style=flat)](https://npmjs.com/package/data-to-png)

A Javascript utility that lets you encode any data to png.

## Install

```bash
yarn add data-to-png
```

## Usage

```js
import { encode } from 'data-to-png';

encode('Hello World!').then((png) => {
  // Do something awesome with your png!
});
```

### Example

Send jquery as a png from an [express](https://github.com/expressjs/express) app to the browser.

```js
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
```

The server will respond with the following png:

![jquery-3.1.1.min.js.png](https://raw.githubusercontent.com/lamadeus/data-to-png/master/examples/express/jquery-3.1.1.min.js.png)

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## License

[MIT](https://github.com/lamadeus/data-to-png/blob/master/LICENSE.md)
