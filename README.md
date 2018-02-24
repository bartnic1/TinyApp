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
- New users should register to make an account; an encrypted cookie will maintain access to user settings throughout the session.
- Once registered, new users will automatically be logged in to the system. From there, they should click the link to create a new tinyURL.
- Once the long-form URL is entered and submitted, the user is redirected to an edit and information screen detailing various statistics on the new URL.
- Upon returning to ||/urls (by clicking the "Back to URL List" or "Update" if any changes are desired) a table will show a list of all URLs generated.
- Data is stored across multiple sessions, and the user may edit or delete any tinyURL that belongs to them.

- To use tinyURL to navigate to the long-form URL, simply enter the tinyURL code into ||/u/:tinyURL, as demonstrated below with code "pi3kpr":

||/u/pi3kpr

## Useful Features

- The ability to register and login to one's account, maintaining a user-specific list of generated tinyURLs
- The ability to add and delete URLs, while denying that privilege to non-registered or other users
- Dates and times for when your URLs were created and accessed by others (the latter shown on the edit and information page). Note that access information generates random IDs for non-registered users, but maintains the same (random) IDs for registered users.
- Can visit the URLs of other users, even if unregistered (which updates the usage statistics on their page)
- Encrypted cookies and hashed passwords used for extra security

## tinyURL Idiosyncrasies:

- Note that the protocol (http://) must be included for each long-form URL added. This will hopefully be fixed on a future release.
- Also, please erase all cookies before using the application! (In Chrome, open the developer tools by pressing Ctrl+Shift+I, then navigate to Application, and clear the "cookies" section under Storage).