const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//Remember: This will create a server at http://localhost:8080/urls
//Additional paths may be specified after the port number

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
  for (var entry in urlDatabase.entries){
    if(urlDatabase.entries[entry].userID === userID){
      localUrlDatabase["entries"][entry] = urlDatabase.entries[entry];
      localUrlDatabase["anyEntries"] = true;
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
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

const urlDatabase = {
  entries: {
  "b2xVn2": {userID: "userRandomID", url: "http://www.lighthouselabs.ca"},
  "9sm5xK": {userID: "user2RandomID", url: "http://www.google.com"}
  }
};

const localUrlDatabase = {
  entries: {},
  anyEntries: false
};

//redirect is better than render, since the latter has to recreate the entire page!
app.post("/login", (req, res) => {
  let emailFound = false;
  let passFound = false;
  let userID = '';
  for(user in users){
    if(users[user].email === req.body.email){
      emailFound = true;
      if(users[user].password === req.body.password){
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
  res.cookie("user_id", userID);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  let randURL = generateRandomString();
  urlDatabase.entries[randURL] = {userID: req.cookies.user_id, url: req.body["longURL"]};
  urlsForUser(req.cookies.user_id);
  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
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
  users[newID] = {id: newID, email: req.body.email, password: req.body.password};
  res.cookie("user_id", newID);
  res.redirect("/urls");
})

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase.entries[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  urlDatabase.entries[req.params.id].url = req.body["longURL"];
  res.redirect("/urls");
});

app.get("/", (req, res) => {
  res.end("Hello!");
});

// http://localhost:8080/urls/new
app.get("/urls/new", (req, res) => {
  res.render("urls_new", {urlDatabase: urlDatabase, user: users[req.cookies.user_id]});
});

// http://localhost:8080/urls
app.get("/urls", (req, res) => {
  let userInfo;
  for(var user in users){
    if(user === req.cookies.user_id){
      userInfo = users[user];
    }
  }
  console.log("Local", localUrlDatabase.entries);
  //Note that by default, if userInfo is undefined, then entering "user" into
  //urls_index.ejs will result in nothing being generated, because it automatically
  //outputs the value of the key "user".
  res.render("urls_index", {urlDatabase: localUrlDatabase, user: userInfo});
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login")
})

app.get("/urls/:id", (req, res) => {
  //loop over elements of local url database
  let accessBool = false;
  if(Object.keys(req.cookies).length === 0){
    return res.status(401).send("Invalid User, access denied");
  }
  else if(urlDatabase.entries[req.params.id].userID === req.cookies.user_id){
    accessBool = true;
  }
  if(!accessBool){
    return res.status(401).send("Invalid User, access denied");
  }
  let singleEntry = {entry: {short: req.params.id, long: localUrlDatabase.entries[req.params.id].url}, user: users[req.cookies.user_id]};
  res.render("urls_show", singleEntry);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase.entries[req.params["shortURL"]].url;
  res.redirect(longURL);
});

// null undefined false 0 [] ''

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});