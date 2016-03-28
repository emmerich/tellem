# tellem

tellem is an application that allows users to send one-way messages via channels. These messages are called bulletins, and can be interpreted by the client in any way (such as desktop notifications, as shown in this example).

# Purpose

tellem was originally created as a proof-of-concept for a business idea. Since then I've open sourced it from a technology point of view to show an application using SocketJS, Express, and Angular to handle real-time communication. Things like model changes on the server are all passed via SocketJS. Other than the original page load, there are no HTTP requests.

# Usage
* Install and run MongoDB. Ensure it's running on localhost port 27017.
* Ensure you have node, npm and gulp installed and on your PATH.
* `npm install`
* `gulp`
* `TELLEM_ENV='dev' node dist/server/app.js`
* Server will be running on localhost:8080

# Development
I'm no longer actively developing tellem. If you would like to see a demo without running the software yourself, or you have any questions, leave an issue.
