var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var util = require('util');

/**
 * Create an instance of DbManager
 * 
 * @param conf object
 */
DbManager = function(conf) {
    
    this.isConnectionOpen = false;
    var that = this;
    
    this.db= new Db(conf.dbname, new Server(conf.host, conf.port, {
        auto_reconnect: true, 
        poolSize:10
    }, {}));
    
    //Open the new connection
    this.db.open(function(err, client){
        if(err){
            console.log(err);
            throw err;
        }
        
        //Authenticate user
        client.authenticate(conf.auth.username, conf.auth.password, function(err) {
            if(err){
                console.log(err);
                throw err;
            }
            
            console.log('Connection made to: {' + conf.dbname + '} on: {' + conf.host + ':' + conf.port + '}');
            that.isConnectionOpen = true;
        });
    });
};

DbManager.prototype.isConnectionActive = function(){
    return this.isConnectionOpen;
}

/** 
 * Select a collection. If a colleciton has already been selected, return it.
 * 
 * @param collection_name string
 * @param callback function
 */
DbManager.prototype.getCollection = function(collection_name, callback){
    
    
    this.db.collection(collection_name, function(err, live_collection){
        if(err) {
            console.log(err.getMessage());
            callback(err);
        }else {
            callback(null, live_collection)
        }
    });
}


/**
 * Insert a document into the database
 * 
 * @param collection_name string
 * @param doc JSONObject
 * @param callback function
 */
DbManager.prototype.insertDoc = function(collection_name, doc, callback){
    
    this.getCollection(collection_name, function(err, live_collection){
        if(err){
            console.log(err);
            callback(err);
        }
     
        live_collection.insert(doc, {safe:true}, function(err, doc){
            if(err) {
                console.log(err);
                callback(err);
            }
            callback(null, doc);
        });
    });  
}

/**
 * Search the database for a given document
 * 
 * @param collection_name string
 * @param search JSONObject
 * @param callback function
 */
DbManager.prototype.getDoc = function(collection_name, search, callback){
    
    this.getCollection(collection_name, function(err, live_collection){
        if(err){
            console.log(err);
            callback(err);
        }
        
        live_collection.findOne(search, function(err, doc){
            if(err){
                console.log(err);
                callback(err);
            }           
            callback(null, doc);            
        });
    });
}

exports.DbManager = DbManager;