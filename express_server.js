const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//Remember: This will create a server at http://localhost:8080/urls
//Additional paths may be specified after the port number

//When you pass an object into res.render, it gives you access to all the key-value
//pairs inside that object. Thus you can call entries["b2xVn2"], and you can loop over them:
/*
for(var index in entries){
  console.log(index) //Will print b2xvn2...
  console.log(entries[index]) //Will print www.lighthouselabs.ca ...
}
*/
var urlDatabase = {
  entries: {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
  }
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

// http://localhost:8080/urls/new
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

// http://localhost:8080/urls
app.get("/urls", (req, res) => {
  let templateVars = urlDatabase;
  res.render("urls_index", templateVars)
});

// http://localhost:8080/urls/b2xVn2
// http://localhost:8080/urls/9sm5xK
app.get("/urls/:id", (req, res) => {
  let singleEntry = {entry: {"short": `tinyapp/${req.params.id}`, "long": urlDatabase.entries[req.params.id]}};
  // var singleEntry = {entry: {req.params.id: urlDatabase.entries[req.params.id]}};
  let templateVars = singleEntry;
  res.render("urls_show", templateVars);
});

/*
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});
*/
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});