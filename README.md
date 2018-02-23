# TinyApp Project (ver 1.0.0)

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["screenshot description"](#)
!["screenshot description"](#)

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
- Navigate to your local server on a browser (for example, with a port number of 8080, go to http://localhost:8080/urls)

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