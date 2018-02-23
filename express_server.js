//Import all critical dependencies

const cookieSession = require('cookie-session');
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 8080; // default port 8080

//Set up the middleware and the embedded javascript view engine

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'user_id',
  secret: 'abcdefg',
  maxAge: 24*60*60*1000
}))

//This function generates the tiny URL by randomly choosing values from an
//alphanumeric string.
function generateRandomString(){
  function randomInt36(){
    return Math.floor(Math.random()*36);
  }
  let newURL = '';
  let alphanumVals = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for(let i = 0; i < 6; i++){
    newURL += alphanumVals[randomInt36()]
  }
  return newURL;
}

//This function checks which URLs a user has access to, and logs them to a local
//URL database (with global scope).
function urlsForUser(userID){
  //Clear the database of any previous user data
  delete localUrlDatabase.entries;
  localUrlDatabase.entries = {};
  //Now refill with user-related data
  for (var entry in urlDatabase.entries){
    if(urlDatabase.entries[entry].userID === userID){
      localUrlDatabase["entries"][entry] = urlDatabase.entries[entry];
    }
  }
}

//This object defines all of the registered users. Some default users exist as examples.
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
}

//The urlDatabase contains all of the URLs created by all users. The localUrlDatabase
//only contains those Urls that have been created by their respective users.

//Each shortURL is assigned a userID for easy identification.
const urlDatabase = {
  entries: {
  "b2xVn2": {userID: "userRandomID", url: "http://www.lighthouselabs.ca"},
  "9sm5xK": {userID: "user2RandomID", url: "http://www.google.com"}
  }
};

const localUrlDatabase = {
  entries: {}
};

//The call to post to the login screen is used to enter e-mail and password data.
//If everything matches, a cookie is created based on the user's ID (from the database above)

//Passwords use bcrypt hashes to protect users from server break-ins.
app.post("/login", (req, res) => {
  let emailFound = false;
  let passFound = false;
  let userID = '';
  for(user in users){
    if(users[user].email === req.body.email){
      emailFound = true;
      if(bcrypt.compareSync(req.body.password, users[user].password)){
        passFound = true;
        userID = users[user].id;
      }
    }
  }
  if(!emailFound){
    return res.status(403).send("Email not found!");
  }
  if(!passFound){
    return res.status(403).send("Password incorrect!");
  }
  req.session.user_id = userID;
  res.redirect("/urls");
});

//Clears the cookies from the server and redirects to the main URLs page.
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

//Generates a tinyURL based on values entered into a form.
app.post("/urls", (req, res) => {
  if(Object.keys(req.session).length === 0){
    return res.status(401).send("No registered user detected. Access denied.")
  }
  let randURL = generateRandomString();
  urlDatabase.entries[randURL] = {userID: req.session.user_id, url: req.body["longURL"]};
  res.redirect(`/urls/${randURL}`);
});

//Registers the user in the users database, and automatically logs in the user by creating
//a session cookie. Passwords are once again stored in hashed form for extra protection.
app.post("/register", (req, res) => {
  let newID = generateRandomString();
  let userEmail = req.body.email;
  let userPass = req.body.password;
  if(!userEmail || !userPass){
    return res.status(400).send("E-mail and/or password missing");
  }
  for(var user in users){
    if(users[user].email === userEmail){
      return res.status(400).send("E-mail taken by existing user!")
    }
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  users[newID] = {id: newID, email: req.body.email, password: hashedPassword};
  req.session.user_id = newID;
  res.redirect("/urls");
})

//Allows a registered user to delete his/her own unwanted URLs.
app.post("/urls/:id/delete", (req, res) => {
  if(Object.keys(req.session).length === 0){
    return res.status(401).send("No registered user detected. Access denied.")
  }
  else if(urlDatabase.entries[req.params.id].userID !== req.session.user_id){
    return res.status(401).send("Incorrect user. Access denied.")
  }
  delete urlDatabase.entries[req.params.id];
  res.redirect("/urls");
});

//Allows users to edit their long-form URL, if desired.
app.post("/urls/:id", (req, res) => {
  if(Object.keys(req.session).length === 0){
    return res.status(401).send("No registered user detected. Access denied.")
  }
  else if(urlDatabase.entries[req.params.id].userID !== req.session.user_id){
    return res.status(401).send("Incorrect user. Access denied.")
  }
  urlDatabase.entries[req.params.id].url = req.body["longURL"];
  res.redirect("/urls");
});

//The root directory serves no real function in this app, and so redirects to
//appropriate directories depending on whether a user is logged in or not.
app.get("/", (req, res) => {
  if(Object.keys(req.session).length === 1){
    res.redirect("/urls");
  }else{
    res.redirect("/login");
  }
});

//Allows a user to visit a page where they may create a new tinyURL for themselves.
app.get("/urls/new", (req, res) => {
  if(Object.keys(req.session).length === 0){
    return res.redirect("/login");
  }
  res.render("urls_new", {urlDatabase: urlDatabase, user: users[req.session.user_id]});
});

//This is the main page, that displays all of a user's personal tinyURLs. The urlsForUser()
//function call ensurse that only URLs tied to their account are visible.
app.get("/urls", (req, res) => {
  let userInfo;
  for(var user in users){
    if(user === req.session.user_id){
      userInfo = users[user];
    }
  }
  urlsForUser(req.session.user_id);
  res.render("urls_index", {urlDatabase: localUrlDatabase, user: userInfo});
});

//This displays the registration page, where a user may register a new account.
app.get("/register", (req, res) => {
  if(Object.keys(req.session).length === 1){
    return res.redirect("/urls");
  }
  res.render("register");
});

//This displays the login pages, where pre-existing users may login to their accounts.
app.get("/login", (req, res) => {
  if(Object.keys(req.session).length === 1){
    return res.redirect("/urls");
  }
  res.render("login")
})

//This displays a user's long-form URL together with its tinyURL form.
//The user may either confirm its contents or augment it using the associated POST method to the same URL.
app.get("/urls/:id", (req, res) => {
  //First, test whether the appropriate user has access to the resources on this page
  let accessBool = false;
  if(urlDatabase.entries[req.params.id] === undefined){
    return res.status(404).send("Invalid tinyURL code entered; page does not exist.")
  }
  else if(Object.keys(req.session).length === 0){
    return res.status(401).send("No registered user detected. Access denied.");
  }
  else if(urlDatabase.entries[req.params.id].userID === req.session.user_id){
    accessBool = true;
  }
  if(!accessBool){
    return res.status(401).send("Incorrect User. Access denied.");
  }
  let singleEntry = {entry: {short: req.params.id, long: urlDatabase.entries[req.params.id].url}, user: users[req.session.user_id]};
  res.render("urls_show", singleEntry);
});

//This allows the user to enter their tinyURL into the browser address bar, which will redirect them to
//the long-form URL.
app.get("/u/:shortURL", (req, res) => {
  if(urlDatabase.entries[req.params["shortURL"]] === undefined){
    return res.status(404).send("Invalid tinyURL code entered. Redirect aborted.")
  }
  let longURL = urlDatabase.entries[req.params["shortURL"]].url;
  res.redirect(longURL);
});

//In the terminal, confirms that the local server is operational.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});