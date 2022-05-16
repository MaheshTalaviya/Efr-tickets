const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const ejs = require('ejs');
const path = require('path');
require("dotenv").config();
const users = require("./routes/api/users");

const efrTicket = require("./routes/api/efrticket");
const uploadFile = require("./routes/api/uploadFile");

const cors = require("cors");
const app = express();
app.use(express.static('public'));

app.use("/public", express.static(path.join(__dirname, 'public')))
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());
// DB Config
const mongoURI = require("./config/keys").database;
mongoose.connect(mongoURI, { useNewUrlParser:true });

  // Passport middleware
app.use(passport.initialize());
app.set('view engine', ejs);
app.use(express.static('public'));
app.use(cors());

// Passport config
require("./config/passport")(passport);

app.use(express.static(path.join(__dirname, 'client/production')));

app.use("/api/users", users);

app.use("/api/efrTicket", efrTicket);
app.use("/api/uploadFile", uploadFile);

if (process.env.NODE_ENV==='production') {
  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname,'client', 'production', 'index.html'));
  });
}

const port = 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
