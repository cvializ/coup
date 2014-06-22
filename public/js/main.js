// Require.js allows us to configure shortcut alias
require.config({
  paths: {
    'socket.io': '/socket.io/socket.io',
    knockout: 'ext/knockout-3.1.0',
    config: '/config'
  }
});

define(['config', 'socket.io', 'knockout'], function(config, io, ko) {
  window.onload = function() {

    var BoardModel = function () {
      this.users = ko.observableArray([]);
      //this.activeUser = ko.observable('');
      this.username = ko.observable('');

      this.addMyUser = function () {
        if ((this.username() != "") && (this.users.indexOf(this.username()) < 0)) // Prevent blanks and duplicates
            this.users.push(this.username());
        document.querySelector('.login').style.display = 'none';
        document.querySelector('.main').style.display = 'block';
      };

      this.removeMyUser = function () {
        this.users.remove(this.username());
        document.querySelector('.login').style.display = 'block';
        document.querySelector('.main').style.display = 'none';
      };
    }

    var boardModel = new BoardModel();
    ko.applyBindings(boardModel);

    document.getElementById('join').onclick = function () {
      boardModel.addMyUser();
      socket.emit('add user', boardModel.username());
    };

    document.getElementById('quit').onclick = function () {
      boardModel.removeMyUser();
      socket.emit('remove user', boardModel.username());
    };

    document.getElementById('move').onclick = function () {
      document.querySelector('.initial').display = 'none';

      var p = document.createElement('p');
      p.appendChild(document.createTextNode('Waiting for challenges...'));

      var messages = document.querySelector('.messages');
      messages.appendChild(p);

      socket.emit('make move');
    };

    document.getElementById('challengeAllow').onclick = function () {
      socket.emit('allow move');
    };

    document.getElementById('challengeDoubt').onclick = function () {
      socket.emit('doubt move');
    };

    document.getElementById('challengeBlock').onclick = function () {
      socket.emit('block move', { influence: '' , blocker: boardModel.username() });
    }

    var socket = io.connect('http://' + config.host + ':' + config.port);

    socket.emit('ready');

    socket.on('initialize', function (data) {
      var usernames = data.usernames;
      for (var name in usernames) {
        if (usernames.hasOwnProperty(name)) { boardModel.users.push(name); }
      }
    });

    socket.on('user joined', function (data) {
      boardModel.users.push(data.username);
    });

    socket.on('user left', function (data) {
      boardModel.users.remove(data.username);
    });

    socket.on('you are alone', function () {
      boardModel.removeMyUser();
      socket.emit('remove user', boardModel.username());
    });

    socket.on('move attempted', function (data) {
      document.querySelector('.challenge').style.display = 'block';
    });

    socket.on('move succeeded', function (data) {
      var messages = document.querySelector('.messages');
      if (boardModel.username() === data.user) {
        messages.innerHTML = "Your move was accepted.";
      } else {
        messages.innerHTML = data.user + "'s move was accepted.";
      }

      document.querySelector('.initial').style.display = 'block';
      document.querySelector('.challenge').style.display = 'none';
    });

    socket.on('move failed', function (data) {
      var messages = document.querySelector('.messages');
      if (boardModel.username() === data.user) {
        messages.innerHTML = "Your move was rejected.";
      } else {
        messages.innerHTML = data.user + "'s move was rejected.";
      }

      document.querySelector('.initial').style.display = 'block';
      document.querySelector('.challenge').style.display = 'none';
    });

    socket.on('move blocked', function (data) {
      alert('Your move was blocked by ' + data.blocker + '!');
    });
  }
});