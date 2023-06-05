// importing modules
const auth = require('./app/auth');
const action = require('./app/action');
const constant = require('./app/constants')

// to login user with email and give access to its gmail
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




