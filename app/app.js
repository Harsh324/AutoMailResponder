'use strict';

// importing modules and libraries
const fs = require('fs');
const constant = require('./constants');
const {promisify} = require('util');
const {google} = require('googleapis'); // gmail api
const {OAuth2Client} = require('google-auth-library'); // for authentication of user
const gmail = google.gmail('v1'); // It will assist in api calls


// reading the token.json consisting of user specifi tokens
const readFileAsync = promisify(fs.readFile);
const TOKEN_DIR = constant.baseDir() + '/config';
const TOKEN_PATH = TOKEN_DIR + '/token.json'; // Specify the access token file


// Method to send the mail with given mail id and reply message
exports.sendReply = async (email, reply) => {

    // authentication part 
    const content = await readFileAsync(constant.baseDir()+'/config/client_secret.json'); 
    const credentials = JSON.parse(content);

    // Initializing client credentials 
    const clientSecret = credentials.web.client_secret;
    const clientId = credentials.web.client_id;
    const redirectUrl = credentials.web.redirect_uris[0];

    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);
    const token = await readFileAsync(TOKEN_PATH);
    oauth2Client.credentials = JSON.parse(token);

    // General message that will be sent automatically
    const message = `From: "me"\nTo: ${email}\nSubject: Re: ${"Auto reply"}\n\n${reply}`;

    // API call to send the mail
    const res = await gmail.users.messages.send({
        auth: oauth2Client,
        userId: 'me',
        requestBody: {
          raw: Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
        },
      });
    
      return res.data;
}




// Method to check whether the mail has prior reply or not
exports.checkPriorReply = async (threadId) => {

    // authentication part 
    const content = await readFileAsync(constant.baseDir()+'/config/client_secret.json'); 
    const credentials = JSON.parse(content);

    // Initializing client credentials
    const clientSecret = credentials.web.client_secret;
    const clientId = credentials.web.client_id;
    const redirectUrl = credentials.web.redirect_uris[0];

    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);
    const token = await readFileAsync(TOKEN_PATH);
    oauth2Client.credentials = JSON.parse(token);

    try {

        // Getting the list of read mails using this api call
        const res = await gmail.users.messages.list({
            auth: oauth2Client,
            userId: 'me',
            q: `in:inbox thread:${threadId} from:me`,
        });
    
        const messages = res.data.messages;
    
        // Return whether such mail exist or not
        if (messages && messages.length > 0) {
            return true;
        }
        return false;

    } catch (err) {
        console.error('Error checking prior replies:', err);
        return false;
    }
}



// Mehtod to add the automatically replied mail to autmatically generated Label
exports.addLabel = async (threadId, labelName) => {

    // authentication part 
    const content = await readFileAsync(constant.baseDir()+'/config/client_secret.json'); 
    const credentials = JSON.parse(content);

    // Initializing client credentials 
    const clientSecret = credentials.web.client_secret;
    const clientId = credentials.web.client_id;
    const redirectUrl = credentials.web.redirect_uris[0];

    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);
    const token = await readFileAsync(TOKEN_PATH);
    oauth2Client.credentials = JSON.parse(token);


    try {

        // Getting the list of all labels using this api call
        const res = await gmail.users.labels.list({
            auth: oauth2Client,
            userId: 'me' 
        });

        // Get lables from the list
        const labels = res.data.labels;
        let labelId;
    
        // check the label from the list of Labels have labelName as "Auto-Replied"
        for (const label of labels) {
            if (label.name === labelName) {
                labelId = label.id;
                break;
            }
        }
    
        // If no such Labels then create a Label name "Auto-Replied"
        if (!labelId) {

            // API call to create a new automatically generated Label names as "Auto-Replied"
            const newLabel = await gmail.users.labels.create({
                auth: oauth2Client,
                userId: 'me',
                requestBody: {
                    name: labelName,
                    labelListVisibility: 'labelShow',
                },
            });

            labelId = newLabel.data.id;
        }
    
        // API call to modify the label of the replies mail to "Auto-Replied"
        await gmail.users.threads.modify({
            auth: oauth2Client,
            userId: 'me',
            id: threadId,
            requestBody: {
                addLabelIds: [labelId],
            },
        });
    } catch (err) {
        console.error('Error adding label:', err);
    }
}