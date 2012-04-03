var config = {};

//Database config
config.db = { 
    host      :'',
    port      :1234,
    dbname    :'geodb',
    collection:'postcode',
    auth: {
        username: '123',
        password: '123!'
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