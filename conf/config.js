var config = {};

config.db = { 
    host      :'geodb-richardive-db-0.dotcloud.com',
    port      :16134,
    dbname    :'geodb',
    collection:'postcode',
    auth: {
        username: 'richardive',
        password: 'Bli22ard!'
    }
};

config.importer = {
    path: '/Users/richardive/Development/postcodes/Data/',
    srcProj: 'OSGB36',
    destProj: 'EPSG:3785'
}

module.exports = config;