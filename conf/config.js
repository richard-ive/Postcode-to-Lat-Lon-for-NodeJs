var config = {};

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

config.importer = {
    path: '/tmp/postcodes/'
}

module.exports = config;