var config = {};

config.db = { 
    host      :'localhost',
    port      :24891,
    dbname    :'',
    collection:'',
    auth: {
        username: '',
        password: ''
    }
};

config.importer = {
    path: '/tmp/postcodes/'
}

module.exports = config;