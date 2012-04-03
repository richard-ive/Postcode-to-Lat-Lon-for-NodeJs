var config = {};

//Database config
config.db = { 
    host      :'geodb-richardive-db-0.dotcloud.com',
    port      :24891,
    dbname    :'geodb',
    collection:'postcode',
    auth: {
        username: 'richardive',
        password: 'Bli22ard!'
    }
};

//Http config
config.http = {
	port:16156
}

//Importer config
config.importer = {
    path: '/Users/richardive/Development/postcodes/Data/'
}

module.exports = config;