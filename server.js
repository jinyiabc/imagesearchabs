// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient
var morgan = require('morgan')
var urlparse = require('url')
var https = require('https')
var searchTerm = require('./models/searchTerm')
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
// app.use(morgan('combined'))
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
// Log in database with dbuser:dbpw database
//mongodb://<dbuser>:<dbpassword>@ds255767.mlab.com:55767/freecodecamp
var mongoose = require('mongoose')
var url = 'mongodb://test:1234@ds255767.mlab.com:55767/freecodecamp'
mongoose.connect(url);
var Bing = require('node-bing-api')
            ({
              accKey: "bce388351e6d4552b9376cb02897c12a",
              rootUri: "https://api.cognitive.microsoft.com/bing/v7.0/"
            });

// app.use(function (req ,res) {

// var original_url = urlparse.parse(req.url)
// console.log(original_url)
// var index = original_url.path.indexOf('?')
// // console.log(decodeURI(original_url.path.slice(17,index)))
// var keywords = decodeURI(original_url.path.slice(17,index)).split(' ')
// if (original_url.query){
// var offset = parseInt(original_url.query.slice(7))}
//   else{ var offset = []}
// console.log(offset)
// console.log(keywords)

  
//     })
//Get all search terms from the database
app.get('/api/latest/imagesearch/', function (req,res,next){
 //http://mongoosejs.com/docs/api.html#Query
     searchTerm.find({},function (err,data){
     res.json(data);
     })
})


//Get call with required and not required params to do a search for an image
app.get('/api/imagesearch/:searchVal*',(req,res,next) => {
  
  var {searchVal} = req.params     // lolcats funny
  console.log(req)
  var {offset} = req.query         // 10
  
  console.log(searchVal)
  console.log(offset)
  
  var data = new searchTerm({
      searchVal,                  //// {prop} is short for {prop: prop}
      searchDate: new Date()            
  })
  
  data.save(function(err,data){
     if(err) throw err
    
    Bing.images(searchVal, {
        count: 15,   // Number of results (max 50) 
        offset: offset    // Skip first 3 result 
         }, function(error, rez, body){
      
         var bingData = []
   for (var i=0; i<10; i++){
     bingData.push({
       url:body.value[i].webSearchUrl,
       name:body.value[i].name,
       thumbnail:body.value[i].thumbnailUrl,
       context:body.value[i].hostPageDisplayUrl
     })
   }
   res.json(bingData);
   //res.json([body])  Sends a JSON response. http://expressjs.com/en/api.html#res.json
    });
    
    
    
    
  })
  

})
  
// var host = 'api.cognitive.microsoft.com';
// var path = '/bing/v7.0/search';
// var term = 'puppies';
// var subscriptionKey= "bce388351e6d4552b9376cb02897c12a";

// var options = {
//       method : 'GET',
//       hostname : host,
//       path : path + '?q=' + encodeURIComponent(term),
//       headers : {
//           'Ocp-Apim-Subscription-Key' : subscriptionKey,
//       }
// }

// var req = https.request(options, function(res,body){
//   var body = '';
//   res.on('data',function(d){
//     body += d;
//   });
//   res.on('end',function(){
//     for(var header in res.headers){
//           if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
//           console.log(header + ": " + res.headers[header]);
//     }
//     body = JSON.stringify(JSON.parse(body), null, '  ');
//     console.log('\nJSON Response:\n');
//     console.log(body);
//     // res.json(body)
//   });
//   res.on('error', function (e) {
//       console.log('Error: ' + e.message);
//   });
  
// // req.end(body);
// });

// req.end();



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
