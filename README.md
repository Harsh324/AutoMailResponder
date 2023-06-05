# AutoMailResponder

AutoMailResponder is a Node.js-based application that automatically responds to emails sent to your Gmail mailbox while you're on vacation. It helps you stay connected with your contacts and provides timely responses even when you're away.

## Features

- **Email Checking**: The app checks your Gmail inbox for new emails periodically.
- **Automated Replies**: It sends automatic replies to email threads that have no prior responses, ensuring your contacts receive a reply even while you're on vacation.
- **Labeling**: The app adds labels to the email threads to help you organize and track the processed emails.
- **Random Intervals**: The app operates at random intervals (45 to 120 seconds), simulating human-like behavior and avoiding a predictable pattern.

## Setup and Configuration

1. Clone the repository by using command `git clone https://github.com/Harsh324/AutoMailResponder.git` .
2. then run `npm install` to Install dependencies.
3. Create a Google Cloud project and enable the Gmail API.
4. Set up the necessary API credentials for accessing the Gmail API.
5. For more insight you can visit [gmail api documentation](https://developers.google.com/gmail/api/quickstart/nodejs)
5. Download the credentials file form the console and renamne it as `client_secret.json`.
6. Put the `client_secret.json` file in the [config](config) directory.
7. Configure the file [mail_config.json](config/mail_config.json) file with your choice of name of label and reply.
8. Run the app using `node main.js`.


## Usage

Once the app is set up and running, it will automatically check your Gmail inbox at random intervals. When a new email thread is detected with no prior responses, the app will send an automated reply and label the email thread accordingly. You can customize the reply message and label name in the [mail_config file](config/mail_config.json).


## Dependencies

The app relies on the following dependencies:
- googleapis
- google-auth-library
- axios

For a complete list of dependencies, refer to the [package.json](package.json) file.

## Contribution

Contributions are welcome! If you find any issues or have suggestions for improvement, feel free to open an issue or submit a pull request.

