var express = require('express'),
    app = express.createServer();

app.get('/', function (req, res) {
  res.send('Hello, World!');
});

app.listen(process.env.PORT || 3000);