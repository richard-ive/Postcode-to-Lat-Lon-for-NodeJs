var config = {};

//Database config
config.db = { 
    host      :'',
    port      :24891,
    dbname    :'geodb',
    collection:'postcode',
    auth: {
        username: '',
        password: '!'
    }
};

//Http config
config.http = {
	port:16156
}

//Importer config
config.importer = {
    path: '/tmp/postcodes/Data/'
}

module.exports = config;