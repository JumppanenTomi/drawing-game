$(function () {
    var FADE_TIME = 1000; //ms häivytys animaation kesto millisekuntteina

    var $window = $(window);
    var $usernameInput = $('.usernameInput'); //pelaajanimen "input"
    var $messages = $('.messages'); //Viestien "feed"
    var $rounds = 3;
    var $currentRound = 0;

    var $correctWords = 1; //Alustetaan muuttuja jjolla tarkastetaa, ettäovatko kaikki pelaajat arvanneet oikein. "default" arvo on 1 koska muuttujaa verrataan Playercount muuttujaan. Ja Piirtäjää ei ei lasketa arvaajaksi
    var $playerCount; //Alustetaan PlayerCount muuttuja jonka arvo muttuu kun pelaajia tulee ja lähtee palvelimelta
    var $drawer; //Alustetaan muttuja johon määritellään pelin piirtäjä
    var $inputMessage = $('.inputMessage'); //Viestin kirjoitus boksi
    var $first = false; //Alustetaan muuttuja jonka avulla määrätään seuraavan kierroksen piirtäjä eli muuttujan NextDrawer arvo

    var $loginPage = $('.login.page'); //Kirjautumissivu
    var $chatPage = $('.chat.page'); //Viestisivu
    var $headerPage = $('.header'); //Headersivu
    var $noPlayers = $('.noPlayers') //noPlayer sivu
    var $drawBlock = $('.draw-block') //läpinäkyvä sivu joka estää muita kuin piirtäjää piirtämästä
    var $gameover = $('.game-over') //läpinäkyvä sivu joka estää muita kuin piirtäjää piirtämästä
    //var $allBlock = $('.all-block')//läpinäkyvä sivu joka laitetaan päälle niille pelaajille jotka liittyvät kesken pelin
    var newWord = document.getElementById('sana'); //hakee elementin jota klikkaamalla generoidaan uusi sana
    var canvas = document.getElementsByClassName('whiteboard')[0];
    var context = canvas.getContext('2d');

    // Prompt for setting a username
    var username;
    var connected = false;
    var $currentInput = $usernameInput.focus();

    //avaa "Client"-palvelimen
    var socket = io();

    const setUsername = () => {
        username = $usernameInput.val();

        //Jos pelaajanimi on validi
        if (username) {
            $loginPage.fadeOut();
            checkPlayerAmmount();
            $chatPage.show();
            $headerPage.show();
            $loginPage.off('click');
            $currentInput = $inputMessage.focus();
            //kirjaa käyttäjän "Socket"-palvelimeen
            socket.emit('add user', username);
        }
    }

    //Viestin lähetys funktio
    const sendMessage = () => {
        var messageUP = $inputMessage.val();
        var message = messageUP.toLowerCase();

        //Jos viesti sisältää tekstiä ja pelaaja on yhteydessä "Socket"-palvelimeen
        if (message && connected) {
            $inputMessage.val('');
            addChatMessage({
                username: username,
                message: message
            });
            // tell server to execute 'new message' and send along one parameter
            socket.emit('new message', message);
        }
    }

    // Adds the visual chat message to the message list
    const addChatMessage = (data, options) => {

        //käsitellään jos sana oli oikein
        if (data.message == $correctWord) {
            var $messageDiv = $('<div class="alert alert-success" role="alert">')
                .text(data.username + ' keksi sanan');
            $correctWords++;
            if ($first == false) {
                $drawer = data.username;
                $first = true;
            }
            if ($correctWords == $playerCount) {
                document.getElementById("piirtaja").innerHTML = 'Piirtäjä on: ' + $drawer;
                document.getElementById("round").innerHTML = $currentRound + '/' + $rounds;
                gameOver();
                if (username == $drawer) {
                    socket.emit('new word');
                    document.getElementById("sana").innerHTML = "Sana on: " + $correctWord;
                }
            }
        }
        //käsitellään jos sana ei ollut oikein
        else {
            var $messageDiv = $('<div class="alert alert-danger" role="alert">')
                .text(data.username + ': ' + data.message);
        }

        //liittää tekstin muuttujaan
        var $messageDiv = $('<li class="message"/>')
            .data('username', data.username)
            .append($messageDiv);

        //muuttuja lähetetään functiolle jossa se muotoillaan
        addMessageElement($messageDiv, options);
    }


    function gameOver() {
        if ($currentRound == $rounds) {
            $gameover.show();
            setTimeout(function () {
                location.reload();
                return false;
            }, 5000);
        }
    }


    function checkPlayerAmmount() {
        document.getElementById("pelaajat").innerHTML = "Pelaajia: " + $playerCount;
        if ($playerCount < 3) {
            if (username) {
                $noPlayers.show();
            }
        } else {
            $noPlayers.hide();
        }
    }


    function newRound() {
        socket.emit('current round', $currentRound + 1);
        $correctWords = 1;
        $first = false;
        hideWord();
    }

    function hideWord() {
        if (username == $drawer) {
            document.getElementById("sana").innerHTML = "Sana on: " + $correctWord;
        } else {
            document.getElementById("sana").innerHTML = "Sanan pituus: " + "_ ".repeat($correctWord.length);
        }
    }

    function newDrawer() {
        console.log("Uusi piirtäjä");
        $drawer = username;
        socket.emit('new word');
        socket.emit('new drawer', $drawer);
        socket.emit('current round');
    }

    function askValues() {
        socket.emit('ask word');
        socket.emit('current round', 1);
    }

    function disableDrawing() {
        console.log("Piirtäminen poistettu käytöstä");
        if (username == $drawer) {
            $drawBlock.hide();
        } else {
            $drawBlock.show();
        }
    }

    //jos "Sanan pituus: "-tekstiä on klikattu..
    newWord.onclick = function () {
        //jos klikkaaja on piirtäjä
        if (username == $drawer) {
            socket.emit('new word');
        }
    }

    // Adds a message element to the messages and scrolls to the bottom
    // el - The element to add as a message
    // options.fade - If the element should fade-in (default = true)
    // options.prepend - If the element should prepend
    //   all other messages (default = false)
    const addMessageElement = (el, options) => {
        var $el = $(el);

        // Setup default options
        if (!options) {
            options = {};
        }
        if (typeof options.fade === 'undefined') {
            options.fade = true;
        }
        if (typeof options.prepend === 'undefined') {
            options.prepend = false;
        }

        // Apply options
        if (options.fade) {
            $el.hide().fadeIn(FADE_TIME);
        }
        if (options.prepend) {
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }


    // Funktio tarkkailee Enter-napin painalluksia..
    $window.keydown(event => {
        if (event.which === 13) {
            //jos Enter-napin painajalla on pelaaja nimi...
            if (username && $playerCount >= 3) {
                //suoritetaan viestifunktio..
                sendMessage();
            } else if (username == null) {
                //jos ei niin suoritetaa kirjautumisfunktio
                setUsername();
            }
        }
    });


    // Socket events
    socket.on('login', (data) => {
        connected = true;
        $playerCount = data.numUsers;
        document.getElementById("pelaajat").innerHTML = "Pelaajia: " + data.numUsers;
        $rounds = 3;
        checkPlayerAmmount();
        if ($playerCount == 1) {
            newDrawer()
        } else {
            askValues();
        }
    });

    socket.on('new message', (data) => {
        addChatMessage(data);
    });

    socket.on('new word', function (word) {
        $correctWord = word;
        hideWord();
        context.clearRect(0, 0, canvas.width, canvas.height);
        newRound();
        disableDrawing();
    });

    socket.on('ask word', function (word) {
        $correctWord = word;
        hideWord();
        disableDrawing();
    });

    socket.on('new game', function (newGame) {
        newGameFunction();
    });

    socket.on('current round', function (roundNum) {
        $currentRound = roundNum;
        $rounds = $playerCount * 3;
        document.getElementById("round").innerHTML = $currentRound + '/' + $rounds;
    });

    socket.on('new drawer', function (drawerName) {
        $drawer = drawerName;
        disableDrawing()
    });

    socket.on('joined', (data) => {
        document.getElementById("piirtaja").innerHTML = 'Piirtäjä on: ' + $drawer;
        $playerCount = data.numUsers;
        if ($rounds < 15) {
            $rounds = $playerCount * 3;
        }
        checkPlayerAmmount();
    });

    socket.on('leave', (data) => {
        $playerCount--;
        checkPlayerAmmount();
        if (data.username == $drawer) {
            newDrawer();
        }
    });
});