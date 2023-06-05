'use strict';

const fs = require('fs');
const constant = require('./constants');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const {promisify} = require('util');

const {google} = require('googleapis');
const {OAuth2Client} = require('google-auth-library');

// Promisify with promise
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const rlQuestionAsync = promisify(rl.question);

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.labels', 'https://www.googleapis.com/auth/gmail.modify'];
const TOKEN_DIR = constant.baseDir() + '/config';
const TOKEN_PATH = TOKEN_DIR+'/token.json';


exports.authenticate = async () => {

    const content = await  readFileAsync(constant.baseDir()+'/config/client_secret.json');
    const credentials = JSON.parse(content); //credential
    
    //authentication
    const clientSecret = credentials.web.client_secret;
    const clientId = credentials.web.client_id;
    const redirectUrl = credentials.web.redirect_uris[0];
    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

    //get new token
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });

    console.log('Authorize this app by visiting this url: ', authUrl);

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

