# TinyApp Project (ver 1.0.0)

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

### A Sample tinyURL Table
!["A Sample URL Table"](https://github.com/bartnic1/TinyApp/blob/master/URL%20Main%20Table.png)

### tinyURL Editing in Action
!["URL Editing"](https://github.com/bartnic1/TinyApp/blob/master/URL%20Edit%20Page.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Taking || to be your protocol, local domain, and port number (i.e. || = http://localhost:8080), navigate to ||/urls.
- New users should register to make a new account; an encrypted cookie will maintain access to user settings throughout the session.
- Once registered, new users will automatically be logged in to the system. From there, click the hyperlink to Create a New tinyURL.
- Enter in the long-form of the URL, and hit the submit button.
- You will see a short-form of the URL. Hit Update to confirm your submission.
- You will now see an updated table listing your tinyURL IDs and their associated long URLs.
- At any time, the user may edit or delete these URLs.

- To navigate to the long-form, simply enter the short URL code (e.g. pi3kpr) into the following address:

||/u/pi3kpr

This will immediately redirect the user to the actual URL.

## Useful Features

- The ability to register and login to your account, maintaining a user-specific list of generated tinyURLs
- Dates and times when your URLs were created and accessed by others
- The ability to add and delete your URLs, while denying that priviledge to other users (including non-registered users)
- Can visit the URLs of other users (which updates stats on their page)
- Encrypted cookies and hashed passwords for extra security

## tinyURL Idiosyncrasies:

- Note that the protocol (http://) must be included for each long-form URL entered into the respective user's database. This will hopefully be fixed on a future release.
- Also, please erase all cookies before using the application! (In Chrome, open the developer tools by pressing Ctrl+Shift+I, then navigate to Application, and clear the "cookies" section under Storage).