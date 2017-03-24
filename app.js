// Build an Express.js app that allows the user to enter a list of names separated
// by commas and enter the number of teams. Upon hitting "submit" the app should
// display teams with random members in each of even numbers. If the total number
// of names to choose from is odd, one team may have one fewer member.
//
// You can find a sample application here: http://sinatra-apps.herokuapp.com/team_picker
//
// Stretch I
// Add validation so if the number of teams is bigger than the number of members,
// it shows an error message.
//
// Stretch II
// Store the member names and the number of teams in the session so if the user
// revisits the information will still be display on the page.
//
// Stretch III
// Make the app support selecting either the number of teams of the number of
// members per team as per the sample app above.
//
// Stretch IV
// Store the history of all the user submissions in a Postgres database table
// (the table can just have id and names columns)


// Note:
// This app uses the following packages: express, morgan, ejs, body-parser,
// cookie-parser, nodemon, pg-promise.
// The postgres database is set up to have the namae "teams".

const PORT = 4000;
const path = require('path');
const Express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const home = require('./routes/home');
const app = Express();

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(Express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', home);

app.listen(PORT, function () {
  console.log(`Server listening on http://localhost:${PORT}...`)
});
