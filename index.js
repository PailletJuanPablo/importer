var requestPackage = require('request');

var url = 'https://gvamax.com.ar/Api/Inmuebles/?id=900&token=acf4b89d3d503d8252c9c4ba75ddbf6d&opera=1&tipo=1&dor=2';
var rp = require('request-promise');

var express = require('express');
var app = express();

app.listen(process.env.PORT || 3000, () => {
  console.log('Aplicación ejemplo, escuchando el puerto 3000!');
});

app.get('/', (req, res) => {
  var url = 'https://gvamax.com.ar/Api/Inmuebles/?id=900&token=acf4b89d3d503d8252c9c4ba75ddbf6d&opera=1&tipo=1&dor=2';

  requestPackage(
    {
      url: url,
      json: true
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const propiedadesSinMapear = response.body;
        const propiedadesMapeadas = [];
        propiedadesSinMapear.map(async propiedad => {
          let propiedadMapeada = {};
          propiedadMapeada.title = propiedad.titulo;
          propiedadMapeada.mainImage = propiedad.imagen;
          const imagesPropiedad = await getImagenesProperty(propiedad.id);
          propiedadMapeada.imagesPropiedad = imagesPropiedad;
          const price = propiedad.precio.slice(1);
          propiedadMapeada.REAL_HOMES_property_price = price;
          propiedadMapeada.REAL_HOMES_property_price = propiedad.moneda == 'D' ? 'USD' : '$';

          
       //   propiedadMapeada.REAL_HOMES_property_bedrooms = price;
          propiedadMapeada.REAL_HOMES_property_bathrooms = propiedad.banos;


          propiedadMapeada.REAL_HOMES_property_address = `${propiedad.calle} ${propiedad.nro}, ${propiedad.localidad}, ${propiedad.provincia}, ${propiedad.pais}`;
          propiedadMapeada.REAL_HOMES_property_location = propiedad.coord;
          propiedadMapeada.localidad = propiedad.localidad;
          propiedadMapeada.estado = propiedad.opera;
          propiedadMapeada.tipo = getWpType(propiedad.tipo);
          propiedadesMapeadas.push(propiedadMapeada);
          console.log(propiedadMapeada);
          if(propiedadesMapeadas.length == propiedadesSinMapear.length){
            return res.send(propiedadesMapeadas);
          }
        });

      }
    }
  );
});

getImagenesProperty = id => {
  return new Promise((resolve, reject) => {
    requestPackage(
      {
        url: `https://gvamax.com.ar/Api/Images/?id=558&idprop=${id}&token=1bb91f73e9d31ea2830a5e73ce3ed328`
      },
      function(error, response, body) {
        if (!error && response.statusCode === 200) {
          let toRemove1 = '<head>';
          let toRemove2 = '</head>';
          let toRemove3 = '<meta http-equiv="Content-Type" content="text/html;charset=utf-8">';
          response.body = response.body.replace(toRemove1, '');
          response.body = response.body.replace(toRemove2, '');
          response.body = response.body.replace(toRemove3, '');
          response.body  = response.body.replace(/\s/g,'');  
          response.body = JSON.parse(response.body);

          resolve(response.body);
        } else {
          console.log(error);
          reject(error);
        }
      }
    );
  });
};


const getWpType = (type) => {
    switch(type){
        case 'Casa':
        return 'Casas';
        case 'Campo':
        return 'Campos';
        case 'Local':
        return 'Locales';
        case 'Terreno':
        return 'Terrenos / Lotes';
        default: 
        return 'Otros'
    }
}