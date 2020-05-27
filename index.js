// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var $wordArray = ["ohjus", "ase", "auto", "ihminen", "aurinko", "tietokone", "koira", "kissa", "batman", "televisio", "sipsi", "lasi", "limu", "veitsi", "ketsuppi", "sinappi", "kirja", "t-paita", "housut", "talo", "valo", "henkari", "läppäri", "kaappi", "mopo", "jakoavain", "kiintolenkki", "kirves", "käsisaha", "lasta", "petkel", "ruuvimeisseli", "sakset", "sirppi", "talikko", "taltta", "vasara", "viikate", "veitsi", "helmitaulu", "kompassi", "kynä", "valjaat", "viikate", "kivääri", "miekka", "silmälasit", "saha", "kello", "sorvi", "neula", "kynttilä", "tasapainovaaka", "ruukku", "kaukoputki", "ongenkoukku", "taltta", "käärmee", "hamsteri", "hiiri", "kani", "rotta", "kilpikonna", "sirkka", "kultakala", "siili", "hämähäkki", "papukaija", "aasi", "ankka", "biisoni", "hevonen", "kalkkuna", "kana", "lammas", "lehmä", "sika", "vuohi", "alpakka", "laama"];
var $correctWord = $wordArray[Math.floor(Math.random() * $wordArray.length)];
var started = false;
var roundNum = 0;

server.listen(port, () => {
  console.log('Serveri portissa %d toimii!', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

var numUsers = 0;

io.on('connection', (socket) => {
  var addedUser = false;

  //whiteboard
  socket.on('drawing', (data) => {
    started = true;
    socket.broadcast.emit('drawing', data)
  });

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data,
      numUsers: numUsers
    });
  });

  if (numUsers == 0) {
    roundNum = 0;
  }

  socket.on('new word', (word) => {
    $correctWord = $wordArray[Math.floor(Math.random() * $wordArray.length)];
    console.log(($correctWord));
    io.emit('new word', $correctWord);
  });

  socket.on('ask word', (word) => {
    io.emit('ask word', $correctWord);
  });

  socket.on('new game', (newGame) => {
    roundNum = 0;
    io.emit('new game');
  });

  socket.on('forceDisconnect', function () {
    socket.disconnect();
  });

  socket.on('started', (bool) => {
    io.emit('started', started);
  });

  socket.on('new drawer', (drawerName) => {
    io.emit('new drawer', drawerName);
  });

  socket.on('current round', (roundNum) => {
    io.emit('current round', roundNum);
  });


  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;
    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    socket.broadcast.emit('joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });
  // when the user disconnects.. perform this
  socket.on('connect', () => {
    if (addedUser) {
      ++numUsers;
      roundMax = numUsers * 3;
    }
  });
  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;
      roundMax = numUsers * 3;
      // echo globally that this client has left
      socket.broadcast.emit('leave', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});