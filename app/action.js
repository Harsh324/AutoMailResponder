/**
 * @module action
 * consists of @function checkEmails
 */

'use strict';

// importing modules and libraries
const app = require('./app');                           // contains the sendEmail addLabel and checkPrior methods
const constant = require('./constants');                // contains method to set the base directory
const fs = require('fs');                               // module file handling
const {promisify} = require('util');
const {google} = require('googleapis');                 // gmail api
const {OAuth2Client} = require('google-auth-library');  // for authentication of user
const gmail = google.gmail('v1');

// reading the token.json consisting of user specifi tokens
const readFileAsync = promisify(fs.readFile);
const TOKEN_DIR = constant.baseDir() + '/config';
const TOKEN_PATH = TOKEN_DIR + '/token.json'; // Specify the access token file



/**
 * performs the opertion of sending email, and updating the label of the email
 * @function checkEmails
 * @memberof module:action
 */
exports.checkEmails = async () => {

    // authentication part 
    const content = await readFileAsync(constant.baseDir()+'/config/client_secret.json'); // reading client credentilas from file
    const mailContent = await readFileAsync(constant.baseDir()+'/config/mail_config.json'); // reading mail config file
    const mailCred = JSON.parse(mailContent);
    const credentials = JSON.parse(content);

    // Initializing client credentials 
    const clientSecret = credentials.web.client_secret;
    const clientId = credentials.web.client_id;
    const redirectUrl = credentials.web.redirect_uris[0];

    // using oauth2Client method and setting up it with client credentials
    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);
    const token = await readFileAsync(TOKEN_PATH);
    oauth2Client.credentials = JSON.parse(token);


    try {

        // Getting the list of unread mails using this api call
        const res = await gmail.users.messages.list({
            auth: oauth2Client,
            userId: 'me',
            q: 'is:unread',
        });
    
        const emails = res.data.messages;
    
        if (emails && emails.length > 0) {

            // accessing the random unread mail from list of mails
            const email = emails[Math.floor(Math.random() * emails.length)];

            // threadid of the mail
            const threadId = email.threadId;
    
            // Get the senders email address from the incoming email
            const emailData = await gmail.users.messages.get({
                auth: oauth2Client,
                userId: 'me',
                id: email.id,
                format: 'full',
            });

            const sendersHeader = emailData.data.payload.headers.find((header) => header.name === 'From').value;

            // Parsing the Header and fetching the senders email address
            const sendersEmail = sendersHeader.match(/<([^>]+)>/)[1];


            // Check if the email thread has prior replies
            const isThreadReplied = await app.checkPriorReply(threadId);
        
            if (!isThreadReplied) {

                // Send the reply email
                await app.sendReply(sendersEmail, mailCred.mail.reply);
        
                // Add label to the email thread
                await app.addLabel(threadId, mailCred.mail.lableName);
        
                // Mark the email as read
                await gmail.users.messages.modify({
                    auth: oauth2Client,
                    userId: 'me',
                    id: email.id,
                    requestBody: {
                        removeLabelIds: ['UNREAD'],
                    },
                });

                // Output given to the console
                console.log('Auto-reply sent and labeled for thread ID: '+ threadId+" , To : "+sendersEmail);
            }
        }
    } catch (err) {
        console.error('Error checking emails:', err);
    }
}
