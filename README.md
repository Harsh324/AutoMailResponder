# AutoMailResponder

AutoMailResponder is a Node.js-based application that automatically responds to emails sent to your Gmail mailbox while you're on vacation. It helps you stay connected with your contacts and provides timely responses even when you're away.

## Features

- **Email Checking**: The app checks your Gmail inbox for new emails periodically.
- **Automated Replies**: It sends automatic replies to email threads that have no prior responses, ensuring your contacts receive a reply even while you're on vacation.
- **Labeling**: The app adds labels to the email threads to help you organize and track the processed emails.
- **Random Intervals**: The app operates at random intervals (45 to 120 seconds), simulating human-like behavior and avoiding a predictable pattern.

## Setup and Configuration

1. Clone the repository and install dependencies.
2. Create a Google Cloud project and enable the Gmail API.
3. Set up the necessary API credentials for accessing the Gmail API.
4. Configure the app by updating the `config.js` file with your Gmail ID, API credentials, and other settings.
5. Run the app using `node app.js`.

For detailed setup instructions, refer to the [Setup Guide](docs/setup-guide.md).

## Usage

Once the app is set up and running, it will automatically check your Gmail inbox at random intervals. When a new email thread is detected with no prior responses, the app will send an automated reply and label the email thread accordingly. You can customize the reply message and label name in the configuration.

For more information on how to customize the app's behavior, refer to the [Configuration Guide](docs/configuration-guide.md).

## Dependencies

The app relies on the following dependencies:
- googleapis
- google-auth-library
- axios

For a complete list of dependencies, refer to the [package.json](package.json) file.

## Contribution

Contributions are welcome! If you find any issues or have suggestions for improvement, feel free to open an issue or submit a pull request. Please follow the [contribution guidelines](CONTRIBUTING.md) when making contributions.

## License

This project is licensed under the [MIT License](LICENSE).

See [LICENSE](LICENSE) for more information.
