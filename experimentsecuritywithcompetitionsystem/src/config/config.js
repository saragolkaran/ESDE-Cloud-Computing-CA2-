//config.js
const dotenv = require('dotenv');
dotenv.config(); //Build the process.env object.
module.exports = {
    databaseUserName: process.env.DB_USERNAME,
    databasePassword: process.env.DB_PASSWORD,
    databaseName: process.env.DB_DATABASE_NAME,

    cloudinaryUrl: process.env.CLOUDINARY_URL,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    JWTKey: process.env.JWTKEY
};
//Reference:
//https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786

// window._config = {
//     cognito: {
//         userPoolId: ' us-east-1_hAllWSGVl', // e.g. us-east-2_uXboG5pAb
//         userPoolClientId: '52lk6cm19dqtejddh94thc6o0l', // e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
//         region: 'us-east-1' // e.g. us-east-2
//     },
//     api: {
//         invokeUrl: '' // e.g. https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod',
//     }
// };