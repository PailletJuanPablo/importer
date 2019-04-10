var requestPackage = require('request');

var url = 'https://gvamax.com.ar/Api/Inmuebles/?id=900&token=acf4b89d3d503d8252c9c4ba75ddbf6d&opera=1&tipo=1&dor=2';

var express = require('express');
var app = express();



app.listen(process.env.PORT || 3000, () => {
  console.log('Aplicación ejemplo, escuchando el puerto 3000!');
});

app.get('/', function(req, res) {
  var url = 'https://gvamax.com.ar/Api/Inmuebles/?id=900&token=acf4b89d3d503d8252c9c4ba75ddbf6d&opera=1&tipo=1&dor=2';

  requestPackage(
    {
      url: url,
      json: true
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        return res.send(response.body);
      }
    }
  );
});
