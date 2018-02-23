const cookieSession = require('cookie-session');
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'user_id',
  secret: 'abcdefg',
  maxAge: 24*60*60*1000
}))


//Remember: This will create a server at http://localhost:8080/urls
//Additional paths may be specified after the port number

//Not using this anymore, but keep as backup:
//const cookieParser = require('cookie-parser');
//app.use(cookieParser());

function generateRandomString(){
  function randomInt36(){
    return Math.floor(Math.random()*36);
  }
  let newURL = '';
  let alphanumVals = 'abcdefghijklmnopqrstuvwxyz0123456789'; //36 vals
  for(let i = 0; i < 6; i++){
    newURL += alphanumVals[randomInt36()]
  }
  return newURL;
}

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

//When you pass an object into res.render, it gives you access to all the key-value
//pairs inside that object. Thus you can call entries["b2xVn2"], and you can loop over them:
/*
for(var index in entries){
  console.log(index) //Will print b2xvn2...
  console.log(entries[index]) //Will print www.lighthouselabs.ca ...
}
*/
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

const urlDatabase = {
  entries: {
  "b2xVn2": {userID: "userRandomID", url: "http://www.lighthouselabs.ca"},
  "9sm5xK": {userID: "user2RandomID", url: "http://www.google.com"}
  }
};

const localUrlDatabase = {
  entries: {}
};

//redirect is better than render, since the latter has to recreate the entire page!
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

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  if(Object.keys(req.session).length === 0){
    return res.status(401).send("No registered user detected. Access denied.")
  }
  let randURL = generateRandomString();
  urlDatabase.entries[randURL] = {userID: req.session.user_id, url: req.body["longURL"]};
  res.redirect(`/urls/${randURL}`);
});

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

app.get("/", (req, res) => {
  if(Object.keys(req.session).length === 1){
    res.redirect("/urls");
  }else{
    res.redirect("/login");
  }
});

// http://localhost:8080/urls/new
app.get("/urls/new", (req, res) => {
  if(Object.keys(req.session).length === 0){
    return res.redirect("/login");
  }
  res.render("urls_new", {urlDatabase: urlDatabase, user: users[req.session.user_id]});
});

// http://localhost:8080/urls
app.get("/urls", (req, res) => {
  let userInfo;
  for(var user in users){
    if(user === req.session.user_id){
      userInfo = users[user];
    }
  }
  urlsForUser(req.session.user_id);
  //Note that by default, if userInfo is undefined, then entering "user" into
  //urls_index.ejs will result in nothing being generated, because it automatically
  //outputs the value of the key "user".

  res.render("urls_index", {urlDatabase: localUrlDatabase, user: userInfo});
});

app.get("/register", (req, res) => {
  if(Object.keys(req.session).length === 1){
    return res.redirect("/urls");
  }
  res.render("register");
});

app.get("/login", (req, res) => {
  if(Object.keys(req.session).length === 1){
    return res.redirect("/urls");
  }
  res.render("login")
})

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

app.get("/u/:shortURL", (req, res) => {
  if(urlDatabase.entries[req.params["shortURL"]] === undefined){
    return res.status(404).send("Invalid tinyURL code entered. Redirect aborted.")
  }
  let longURL = urlDatabase.entries[req.params["shortURL"]].url;
  res.redirect(longURL);
});

// null undefined false 0 [] ''

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});