const Express = require('express');
const router = Express.Router();
const db = require('../db/conn');

let teams;

const makeTeams = function(names, divide_by, number) {
  function randomOrder(names) {
    let randomizedList = names;
    let currentIndex = names.length, temporaryValue, randomIndex;
    // While there are still elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = randomizedList[currentIndex];
      randomizedList[currentIndex] = randomizedList[randomIndex];
      randomizedList[randomIndex] = temporaryValue;
    }
  return randomizedList;
  }

  function buildTeams(names, number) {
    let teamsObject = {};
    for (let i = 1; i <= number; i++) {
      teamsObject[`${i}`] = [];
    }
    while (names.length > 0) {
      for (let i = 1; i <= number; i++) {
        teamsObject[`${i}`].push(names.shift());
        if (names.length === 0) {
          break;
        }
      }
    }
    return teamsObject;
  }

  function buildTeamsBySize(names, number) {
    let number_of_teams = Math.ceil(names.length / number);
    let teamsObject = {};
    for (let i = 1; i <= number_of_teams; i++) {
      teamsObject[`${i}`] = [];
    }
    while (names.length > 0) {
      for (let i = 1; i <= number_of_teams; i++) {
        for (let j = 1; j <= number; j++) {
          teamsObject[`${i}`].push(names.shift());
          if (names.length === 0) {
            break;
          }
        }
      }
    }
    return teamsObject;
  }

  let namesArray = names.split(', ');
  let teams;
  if (divide_by === 'number_teams') {
    teams = buildTeams(randomOrder(namesArray), number);
  } else if (divide_by === 'members_per_team') {
    teams = buildTeamsBySize(randomOrder(namesArray), number);
  }
  return teams;
};

router.get('/', function(req, res, next) {
  if (req.cookies.teams) {
    teams = req.cookies.teams;
  } else {
    teams = null;
  }
  res.render('index', { teams: teams, error: null });
})

router.post('/', function(req, res, next) {
  if (req.cookies.teams) {
    teams = req.cookies.teams;
  } else {
    teams = {};
  }

  let obj = req.body;

  db.query(`
    INSERT INTO teams (names) VALUES ($<names>)
    `, obj
  ).then(function() {
  }).catch(function(err) { res.send(err) })

  let names = req.body.names;
  let divide_by = req.body.divide_by[0];
  let number = req.body.divide_by[1];
  if (divide_by === 'number_teams' && number > names.split(', ').length) {
    let error = 'Error! You have entered more teams than participants.';
    res.render('index', { teams: null, error: error });
  } else {
    teams = makeTeams(names, divide_by, number);
    res.cookie('teams', teams);
    res.render('index', { teams: teams, error: null });
  }
})

module.exports = router;
