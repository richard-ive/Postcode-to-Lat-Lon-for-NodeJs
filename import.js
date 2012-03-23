var fs         = require('fs');
var geo        = require('./geoFunctions');
var mongodb    = require('mongodb');
var config     = require('./config');
var util       = require('util');

//Get path for cvs files
var path = config.importer.path;
var conf = config.db;

db= new mongodb.Db(conf.dbname, new mongodb.Server(conf.host, conf.port, {
    auto_reconnect: true, 
    poolSize:10
}, {}));
    
//Open the new connection
db.open(function(err, db){
    if(err){
        console.log(err);
        throw err;
    }
        
    //Authenticate user
    db.authenticate(conf.auth.username, conf.auth.password, function(err) {
        if(err){
            console.log(err);
            throw err;
        }
            
        console.log('Connection made to: {' + conf.dbname + '} on: {' + conf.host + ':' + conf.port + '}');
        
        db.collection(conf.collection, function(err, collection){
    
            //Start looping through files in path
            fs.readdir(path, function(err, files){
                if(err) throw err;      

                for(i in files){
        
                    fs.readFile(path + files[i] ,'UTF-8', function(err, data){
                        if(err) throw err;
          
                        csvLine = data.split("\r\n");
      
                        for(i in csvLine){

                            csvCell = csvLine[i].split(",");
            
                            postcode = csvCell[0].replace(/ /g,'').replace(/"/g,'');
                    
                            if(postcode != ""){
                        
                                easting  = csvCell[2];
                                northing = csvCell[3];

                                gridRef = geo.gridrefNumToLet(easting,northing,8);
                                latLong = geo.OSGridToLatLong(gridRef);       
             
                                doc = {
                                    '_id':postcode,
                                    'loc':{
                                        'lat':parseFloat(latLong[0]),
                                        'lon':parseFloat(latLong[1])           
                                    }
                                };
                        
                                collection.insert(doc, {
                                    safe:true
                                }, function(err, doc){
                                    if(err) throw err;
                                });                                                
                            }
                        }
                    });
                }
            }); 
        });
    });
});