var fs         = require('fs');
var mongodb    = require('mongodb');
var conf       = require('./conf/config');
var util       = require('util');
var proj       = require('./lib/geotool');

//Get path for cvs files
var path = conf.importer.path;

db= new mongodb.Db(conf.db.dbname, new mongodb.Server(conf.db.host, conf.db.port, {
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
    db.authenticate(conf.db.auth.username, conf.db.auth.password, function(err) {
        if(err){
            console.log(err);
            throw err;
        }
            
        console.log('Connection made to: {' + conf.db.dbname + '} on: {' + conf.db.host + ':' + conf.db.port + '}');
        
        db.collection(conf.db.collection, function(err, collection){
    
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
                        	
                        		//Extract easting and northing
                                easting  = csvCell[2];
                                northing = csvCell[3];
								
								//First convert to letter coord then latlong
								gridRef = proj.gridrefNumToLet(easting,northing,8);
								latLong = proj.OSGridToLatLong(gridRef);
								
								//Construct the doc.                                         
                                doc = {
                                    postcode: postcode,
                                    loc:{
                                    	lon:latLong[1],
                                    	lat:latLong[0]   
                                    	
                                    }
                                };
                                
                                if(doc.loc.lon > -180 && doc.loc.lon < 180 && doc.loc.lat > -180 && doc.loc.lat < 180){
                                	                                
                                  //Save doc in collection
                                  collection.insert(doc, {
                                    safe:true
                                  }, function(err, doc){
                                    if(err) throw err;
                                    
                                  }); 
                                	
                                }                      
                                     
                            }
                        }
                    });
                }
            }); 
        });
    });
});