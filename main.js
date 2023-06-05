/**
 * In the AutoMailResponder application, the following libraries and technologies are used:
 * 
 * Node.js: AutoMailResponder is built on Node.js, a server-side JavaScript runtime.
 * 
 * googleapis: The googleapis package is a powerful Node.js library that simplifies working,
 *             with various Google APIs, including the Gmail API. It provides convenient methods,
 *             for authentication, handling API requests, and accessing Gmail resources.
 * 
 * google-auth-library: The google-auth-library package is used for authentication and authorization,
 *                      in the app. It simplifies the process of obtaining and refreshing access tokens,
 *                      required to interact with the Gmail API securely.
 * 
 * axios: The axios library is utilized for making HTTP requests to the Gmail API this is builtin with googleapis.
 *        It provides a simple and flexible interface for handling API calls, including sending emails,
 *        creating labels, and fetching email threads.
 * 
 * These libraries and technologies work together to enable AutoMailResponder to authenticate with Google,
 * access Gmail resources, and perform actions such as checking for new emails, sending automated replies,
 * and labeling email threads.
 * 
 * Thus AutoMailResponder provides a solution for automatically responding to emails while you're unable
 * to attend emails, ensuring that effective communication should be maintained.
 */


// importing modules
const auth = require('./app/auth');
const action = require('./app/action');
const constant = require('./app/constants')


// autheticating the user
auth.authenticate();

// main call function
function startEmailProcessing() {
    setInterval(() => {
        // checkEmails methods from action module
        action.checkEmails();

    }, 
    // generate random interval
    constant.getRandomInterval(45, 120) * 1000);
}


startEmailProcessing();




