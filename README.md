# TinyApp Project (ver 1.0.0)

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

### tinyURL Table
!["URL Table Sample"](https://github.com/bartnic1/TinyApp/blob/master/URL%20Table%20Sample.png)

### tinyURL Editing in Action
!["URL Editing Sample"](https://github.com/bartnic1/TinyApp/blob/master/URL%20Edit%20Sample.png)

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

- To navigate to the long-form, simply enter the short URL code (e.g. hn8vft) into the following address:

||/u/hn8vft

This will immediately redirect the user to the original URL.

## Up and Coming Additions

- A date string indicating when a tinyURL was created
- A counter indicating how many times a tinyURL was visited
- A counter indicating the number of unique visits to a tinyURL

## tinyURL Idiosyncrasies:

- Note that the protocol (http://) must be included for each long-form URL entered into the respective user's database. This will hopefully be fixed on a future release.