var express   = require('express');
var app       = express.createServer();
var config    = require('./conf/config');
var DbManager = require('./lib/DbManager').DbManager;
var util      = require('util');
var proj      = require('./lib/proj4js-combined');


console.log(util.inspect(proj));

//create a new connection
var db = new DbManager(config.db);
 
//Configure app 
app.configure(function(){
   app.set('views', __dirname + '/public/views');
   app.set('view engine', 'jade');
   app.set('view options', {layout:false})
   app.register('.html', require('jade'));
});
 
//Main application processing
app.get('/', function(req, res){
    res.render('index.html');
});

//postcode routing
app.all('/postcode/:postcode.:format?', function(req, res){
  
    //extrct params  
    format   = req.params.format;
    postcode = req.params.postcode.replace(/ /gi, '').toUpperCase();
  
    if(postcode){
       
        switch(format){
            case 'xml':
                res.contentType('application/xml');
            break;
            case 'csv':
                res.contentType('application/csv');
            break;
            case 'json':
            default:
                res.contentType('application/json');
                db.getDoc('postcode', {"_id": postcode}, function(err, doc){
                    if(err) throw err;
                    res.json(doc, 200);
                });
            break;
        }
               

    }else{
        next();
    }
});

//pickup any rogue requests
app.get('*', function(req,res){
    res.send('Error: please request http://postcode.nodester.com/postcode/[postcode].[json|xml|csv]', 404);
});

//bind server port
app.listen(15483);
