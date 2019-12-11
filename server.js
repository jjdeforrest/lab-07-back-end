'use strict';
// GLOBAL VARIABLES AND DEPENDENCIES
let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PORT = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const app = express();
require('dotenv').config();
app.use(cors());


// LOCATION PATH
app.get('/location', (request, response) => {
  superagent.get(`https://www.google.com/maps/embed/v1/MODE?key=${process.env.GEOCODIJNE_API_KEY}`).then(response => {
    console.log('body');
  });
  const geoData = require('./data/geo.json');
  const location = geoData.results[0].geometry.location;
  const formAddr = geoData.results[0].formatted_address;
  const search_query = geoData.results[0].address_components[0].short_name.toLowerCase();
  response.send(new Geolocation (search_query, formAddr, location,));
});
// LOCATION CONSTRUCTOR FUNCTION
function Geolocation (search_query,formAddr,location) {
  this.search_query = search_query;
  this.formatted_address = formAddr;
  this.latitude = location['lat'];
  this.longitude = location['lng'];
}
// WEATHER PATH
// app.get('/weather', (request , response ) => {
//   const reply = [];
//   const weatherData = require('./data/darksky.json');
//   const weatherArr = weatherData.daily.data
//   for (let i = 0; i < weatherArr.length; i++) {
//     reply.push(new Forecast (weatherArr[i].summary, weatherArr[i].time));
//   }
//   response.send( reply );
// })

app.get('/weather', (request , response ) => {
  superagent.get(`https://api.darksky.net/forecast/51b7774cf1581ac8c3d71236a475a32d/37.8267,-122.4233/MODE?key=${process.env.darksky}`).then(response => {
    console.log('body');
  });

  const reply = [];
  const weatherData = require('./data/darksky.json');
  const weatherArr = weatherData.daily.data;
  for (let i = 0; i < weatherArr.length; i++) {
        reply.push(new Forecast (weatherArr[i].summary, weatherArr[i].time));
      }
      let yo = reply.map(data);

      function data (hello) {
        return hello;
      }
      response.send(yo);
});

// app.get('/', (req, res) => {

//   console.log('KLHEKLWJHRKSDJHF')

//   res.send('WOW I AM ONLINE');
// })



// FORECAST CONSTRUCTOR FUNCTION
function Forecast (summary, time) {
  this.forecast = summary;
  this.time = getDate(new Date(time));
}
// RETURNS FORMATTED DATE
function getDate (time) {
  let day = weekday[time.getDay()];
  let month = months[time.getMonth()];
  let date = time.getDate();
  let year = time.getFullYear();
  return `${day} ${month} ${date} ${year}`;
}



app.listen(PORT);

