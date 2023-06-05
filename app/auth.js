'use strict';

// importing modules and libraries
const fs = require('fs');                   // module to interact with file systems
const constant = require('./constants');    // contains some common methods
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const {promisify} = require('util'); // promises for return of callbacks

const {google} = require('googleapis');  // gmail api
const {OAuth2Client} = require('google-auth-library');

// Promisify with promise
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// Defining the scope of the app, what type of access the app wants of users gmail
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.labels', 'https://www.googleapis.com/auth/gmail.modify'];

// Inintializing the directory to store and access tokens
const TOKEN_DIR = constant.baseDir() + '/config';
const TOKEN_PATH = TOKEN_DIR+'/token.json';



// Method used to Login the user in the app
exports.authenticate = async () => {

    // Reading the config file of the client
    const content = await  readFileAsync(constant.baseDir()+'/config/client_secret.json');
    const credentials = JSON.parse(content); //credential

    // Initializing client credentials
    const clientSecret = credentials.web.client_secret;
    const clientId = credentials.web.client_id;
    const redirectUrl = credentials.web.redirect_uris[0];
    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

    // Generate Tokens each time the method is called
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });

    console.log('Authorize this app by visiting this url: ', authUrl);

    // CLI to go to the authorization link and generate the token
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();

        oauth2Client.getToken(code, async (err, token) => {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;

            try {
                fs.mkdirSync(TOKEN_DIR);
            } catch (err) {
                if (err.code != 'EEXIST') throw err;
            }

            await writeFileAsync(TOKEN_PATH, JSON.stringify(token));
            console.log('Token stored to ' + TOKEN_PATH);
        });
    });
};

