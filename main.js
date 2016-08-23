(function () {
  var content = document.getElementById('alignContent');
  var contentMain = document.querySelector('.main-container');
  var boardForm = document.querySelector('.board-form');
  var input = document.querySelector('input[type=number]');
  var reset = document.querySelector('button');
  var warningAlert = document.querySelector('.alert-warning');
  var successAlert = document.querySelector('.alert-success');
  var errorAlert = document.querySelector('.alert-danger');
  var boardSize;
  var counter = 0;
  var h;
  var v;
  var d;
  var turn;
  var positions;
  var complete;
  var winInterval;
  var messages = {
    warn: {
      name: 'warn',
      el: warningAlert
    },
    success: {
      name: 'success',
      el: successAlert
    },
    error: {
      name: 'error',
      el: errorAlert
    }
  };

  input.addEventListener('change', function (event) {
    var boardSize = parseInt(event.target.value);
    createBoard(boardSize);
  });

  reset.addEventListener('click', function () {
    createBoard(boardSize);
  });


  content.addEventListener('click', function (event) {
    if (complete) {
      return;
    }

    setAlert(messages.warn);
    var position = event.target.getAttribute('data-position');
    if (positions[position]) {
      setAlert(messages.warn, 'Already marked');
      return;
    }
    var row = Math.floor(position / boardSize);
    var column = position % boardSize;
    positions[position] = turn;

    event.target.classList.add('shape-' + turn);
    mark({
      row: row,
      column: column
    });
    complete = checkForWinner();

    if (!complete ) {
      contentMain.classList.remove('turn-' + turn);
      changeUserTurn();
      contentMain.classList.add('turn-' + turn);

    }
    else {
      setAlert(complete.type, complete.msg);
      if (complete.type === messages.success && complete.position) {
        setAnimation({
          row: row,
          column: column
        });
      }
    }
  });

  function setAnimation(location){
    var items;

      if (complete.position === v) {
        items = _.range(location.row * boardSize, location.row * boardSize + boardSize).map(function (index) {
          return document.querySelector('.item[data-position="' + index + '"]');
        });
      }
      if (complete.position === h) {
        items = _.range(location.column, boardSize * boardSize - (boardSize - location.column - 1), boardSize).map(function (index) {
          return document.querySelector('.item[data-position="' + index + '"]');
        });
      }
      if (complete.position === d[0]) {
        items = _.range(0,boardSize * boardSize ,boardSize +1).map(function (index) {
          return document.querySelector('.item[data-position="' + index + '"]');
        });
      }
      if (complete.position === d[1]){
        items = _.range(boardSize-1, boardSize * boardSize - boardSize +1,boardSize -1).map(function (index) {
          return document.querySelector('.item[data-position="' + index + '"]');
        });
      }


    var index = -1;
    winInterval = setInterval(function(){
      if( index > -1) {
        items[index % items.length].classList.remove('shine');
      }

      index++;
      items[index%items.length].classList.add('shine');
    }, 200);

  }

  createBoard(3);
  changeUserTurn();

  function _checkBoardItem (item) {
    return item[turn] === boardSize;
  }

  function setAlert(type, msg) {
    var el = messages[type.name].el;
    if (!msg) {
      el.style.display = 'none';
      return;
    }
    el.innerHTML = msg;
    el.style.display = 'block';
  }

  function mark(location) {
    v[location.row][turn]++;
    h[location.column][turn]++;
    if (location.row === location.column) {
      d[0][turn]++;
    }
    if (location.row + location.column === boardSize - 1) {
      d[1][turn]++;
    }
    counter++;
  }


  function checkForWinner() {
      var verticalWin = v.some(_checkBoardItem);
      var horizontalWin = h.some(_checkBoardItem);
      var diagonalWin = d.some(_checkBoardItem);
      var position;

      if (horizontalWin) {
        position = h;
      }
      if (verticalWin) {
        position = v;
      }
      if (diagonalWin) {
        position = d[d.findIndex(_checkBoardItem)];
      }
      if (position) {
        return {
          type: messages.success,
          position: position,
          msg: turn.toUpperCase() + " is the winner!!!"
        };
      }
      else if (counter === boardSize * boardSize) {
        return {
          type: messages.error,
          msg: 'Game over'
        };
      }
      else {
        return false;
      }
  }


  function createBoard(_boardSize) {
    boardSize = _boardSize;
    resetGame();

    var html = [];
    _.times(boardSize * boardSize, function (i) {
      html.push('<div class="item" data-position="' + i + '"></div>');
    });

    var size = 100 * boardSize + 'px';
    contentMain.style.height = size;
    contentMain.style.width = size;
    boardForm.style.width = size;

    content.innerHTML = html.join('');
    warningAlert.style.display = 'none';
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';
  }


  function resetGame() {
    counter = 0;
    h = [];
    v = [];
    d = [{x: 0, o: 0}, {x: 0, o: 0}];
    _.times(boardSize, function () {
      h.push({
        x: 0,
        o: 0
      });
      v.push({
        x: 0,
        o: 0
      });
    });
    positions = {};

    turn = 'x';
    complete = false;

    if (winInterval) {
      clearInterval(winInterval);
      winInterval = null;
    }
  }

  function changeUserTurn() {
    if (counter % 2 === 0) {
      turn = 'x';
    }
    else {
      turn = 'o';
    }
  }
})();