//includes
var express   = require('express');
var app       = express.createServer();
var config    = require('./conf/config');
var DbManager = require('./lib/DbManager').DbManager;
var util      = require('util');

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
    	
    	console.log("Fetching: " + postcode);
       
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
                db.getDoc('postcode', {"postcode": postcode}, function(err, doc, live_collection){
                    if(err) throw err;
                    console.log(doc);
                    res.json(doc, 200);
                });
            break;
        }
                      
    }else{
        next();
    }
});

//postcode near routing
app.all('/postcode/near/:postcode/:limit?', function(req, res){
	
    //extrct params  
    limit    = (req.params.limit)? { limit: req.params.limit } : {} ;
    postcode = req.params.postcode.replace(/ /gi, '').toUpperCase();
	
    db.getDoc('postcode', {"postcode": postcode}, function(err, doc, live_collection){
      if(err) throw err;
            
      //Create search      
      center    = [ doc.loc.lon , doc.loc.lat ];
      raduis    = 1; //Within 1 degree
      newSearch = {"loc" : {"$within" : {"$center" : [center, radius]}}}
            
      live_collection.find(newSearch, limit).toArray(function(err, docs) {
      	if(err) throw err;
      	
        doc = JSON.stringify(docs); 
        res.json(doc, 200);
      });
            
    });
		
});

//pickup any rogue requests
app.get('*', function(req,res){
    res.send('Error: please request http://postcode.nodester.com/postcode/[postcode].[json|xml|csv]', 404);
});

//bind server port
app.listen(config.http.port);