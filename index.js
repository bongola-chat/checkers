class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.active = id == 1 ? true : false;
    this.playerDocument = document.querySelector(
      id == 1 ? ".player-one" : ".player-two"
    );
    this.display();
  }

  get hasActive() {
    return this.playerDocument.classList.contains("active");
  }

  display() {
    this.playerDocument.querySelector("span").textContent = this.name;
    if (!this.hasActive && this.active)
      this.playerDocument.classList.add("active");
    else if (this.hasActive && !this.active)
      this.playerDocument.classList.remove("active");
  }
}

class GameBoard {
  constructor() {
    this.grid = [
      [0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    ];
    this.gridLength = [10, 10];
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.player1CanTakeExist = false;
    this.player2CanTakeExist = false;
  }

  distance(x1, x2) {
    return Math.abs(x1 - x2) - 1;
  }

  pieceCanTake(x, y) {
    let caseType = this.grid[y][x];
    if (caseType === 0 || caseType === 3) return false;
    if (caseType === 1 || caseType === 2) {
      let canTakeJumps = [
        [x + 2, y + 2],
        [x - 2, y + 2],
        [x + 2, y - 2],
        [x - 2, y - 2],
      ];
      for (var i = 0; i < canTakeJumps.length; i++) {
        let moveCase = canTakeJumps[i];
        if (
          moveCase[0] > 9 ||
          moveCase[0] < 0 ||
          moveCase[1] > 9 ||
          moveCase[1] < 0
        )
          continue;
        if (
          this.grid[moveCase[1]][moveCase[0]] !== 0 &&
          this.grid[moveCase[1]][moveCase[0]] !== 3
        )
          continue;
        let inBetweenCase = [
          moveCase[0] < x ? moveCase[0] + 1 : moveCase[0] - 1,
          moveCase[1] < y ? moveCase[1] + 1 : moveCase[1] - 1,
        ];
        if (
          ((this.grid[inBetweenCase[1]][inBetweenCase[0]] === 1 ||
            this.grid[inBetweenCase[1]][inBetweenCase[0]] === 4) &&
            caseType === 2) ||
          ((this.grid[inBetweenCase[1]][inBetweenCase[0]] === 2 ||
            this.grid[inBetweenCase[1]][inBetweenCase[0]] === 5) &&
            caseType === 1)
        ) {
          return true;
        }
      }
    } else if (caseType === 4 || caseType === 5) {
      let canTakeJumps = [];
      for (let k = 2; k < 10; k++) {
        let canTakeJump = [
          [x + k, y + k],
          [x - k, y + k],
          [x + k, y - k],
          [x - k, y - k],
        ];
        canTakeJumps.push(...canTakeJump);
      }
      for (let i = 0; i < canTakeJumps.length; i++) {
        let moveCase = canTakeJumps[i];
        if (
          moveCase[0] > 9 ||
          moveCase[0] < 0 ||
          moveCase[1] > 9 ||
          moveCase[1] < 0
        )
          continue;
        if (
          this.grid[moveCase[1]][moveCase[0]] !== 0 &&
          this.grid[moveCase[1]][moveCase[0]] !== 3
        )
          continue;
        let inBetweenCases = [];
        let iteration = Math.abs(x - moveCase[0]);
        let opponents = 0;
        for (let k = 1; k < iteration; k++) {
          let inBetweenCase = [
            moveCase[0] < x ? moveCase[0] + k : moveCase[0] - k,
            moveCase[1] < y ? moveCase[1] + k : moveCase[1] - k,
          ];
          inBetweenCases.push(inBetweenCase);
          if (
            this.grid[inBetweenCase[1]][inBetweenCase[0]] ===
              (caseType === 4 ? 5 : 4) ||
            this.grid[inBetweenCase[1]][inBetweenCase[0]] ===
              (caseType === 4 ? 2 : 1)
          ) {
            opponents++;
          }
        }
        if (opponents === 1) return true;
      }
    }
    return false;
  }

  pieceCanTakeMove(x, y) {
    let caseType = this.grid[y][x];
    if (caseType === 1 || caseType === 2) {
      let canTakeJumps = [
        [x + 2, y + 2],
        [x - 2, y + 2],
        [x + 2, y - 2],
        [x - 2, y - 2],
      ];
      let moves = [];
      for (var i = 0; i < canTakeJumps.length; i++) {
        let moveCase = canTakeJumps[i];
        if (
          moveCase[0] > 9 ||
          moveCase[0] < 0 ||
          moveCase[1] > 9 ||
          moveCase[1] < 0
        )
          continue;
        if (this.grid[moveCase[1]][moveCase[0]] !== 0) continue;
        let inBetweenCase = [
          moveCase[0] < x ? moveCase[0] + 1 : moveCase[0] - 1,
          moveCase[1] < y ? moveCase[1] + 1 : moveCase[1] - 1,
        ];
        if (
          ((this.grid[inBetweenCase[1]][inBetweenCase[0]] === 1 ||
            this.grid[inBetweenCase[1]][inBetweenCase[0]] === 4) &&
            caseType === 2) ||
          ((this.grid[inBetweenCase[1]][inBetweenCase[0]] === 2 ||
            this.grid[inBetweenCase[1]][inBetweenCase[0]] === 5) &&
            caseType === 1)
        ) {
          moves.push(moveCase);
        }
      }
      return moves;
    } else if (caseType === 4 || caseType === 5) {
      let moves = [];
      let canTakeJumps = [];
      for (let k = 2; k < 10; k++) {
        let canTakeJump = [
          [x + k, y + k],
          [x - k, y + k],
          [x + k, y - k],
          [x - k, y - k],
        ];
        canTakeJumps.push(...canTakeJump);
      }
      for (let i = 0; i < canTakeJumps.length; i++) {
        let moveCase = canTakeJumps[i];
        if (
          moveCase[0] > 9 ||
          moveCase[0] < 0 ||
          moveCase[1] > 9 ||
          moveCase[1] < 0
        )
          continue;
        if (
          this.grid[moveCase[1]][moveCase[0]] !== 0 &&
          this.grid[moveCase[1]][moveCase[0]] !== 3
        )
          continue;
        let inBetweenCases = [];
        let iteration = Math.abs(x - moveCase[0]);
        let opponents = 0;
        for (let k = 1; k < iteration; k++) {
          let inBetweenCase = [
            moveCase[0] < x ? moveCase[0] + k : moveCase[0] - k,
            moveCase[1] < y ? moveCase[1] + k : moveCase[1] - k,
          ];
          inBetweenCases.push(inBetweenCase);
          if (
            this.grid[inBetweenCase[1]][inBetweenCase[0]] ===
              (caseType === 4 ? 5 : 4) ||
            this.grid[inBetweenCase[1]][inBetweenCase[0]] ===
              (caseType === 4 ? 2 : 1)
          ) {
            opponents++;
          }
        }
        if (opponents === 1) moves.push(moveCase);
      }
      console.log("Move Cases: ", moves);
      return moves;
    }
    return [];
  }

  pieceTakePiece(caseType, x1, y1, x2, y2) {
    if (caseType === 1 || caseType === 2)
      return [x2 < x1 ? x2 + 1 : x2 - 1, y2 < y1 ? y2 + 1 : y2 - 1];
    if (caseType === 4 || caseType === 5) {
      let iteration = Math.abs(x1 - x2);
      let opponents = 0;
      for (let k = 1; k < iteration; k++) {
        let inBetweenCase = [
          x2 < x1 ? x2 + k : x2 - k,
          y2 < y1 ? y2 + k : y2 - k,
        ];
        if (
          this.grid[inBetweenCase[1]][inBetweenCase[0]] ===
            (caseType === 4 ? 5 : 4) ||
          this.grid[inBetweenCase[1]][inBetweenCase[0]] ===
            (caseType === 4 ? 2 : 1)
        ) {
          return inBetweenCase;
        }
      }
    }
  }

  queenMove(x, y) {
    let moves = [];
    let canTakeJumps = [];
    for (let k = 1; k < 10; k++) {
      let canTakeJump = [
        [x + k, y + k],
        [x - k, y + k],
        [x + k, y - k],
        [x - k, y - k],
      ];
      canTakeJumps.push(...canTakeJump);
    }
    for (let i = 0; i < canTakeJumps.length; i++) {
      let moveCase = canTakeJumps[i];
      if (
        moveCase[0] > 9 ||
        moveCase[0] < 0 ||
        moveCase[1] > 9 ||
        moveCase[1] < 0
      )
        continue;
      if (
        this.grid[moveCase[1]][moveCase[0]] !== 0 &&
        this.grid[moveCase[1]][moveCase[0]] !== 3
      )
        continue;
      let inBetweenCases = [];
      let iteration = Math.abs(x - moveCase[0]);
      let obtacles = 0;
      for (let k = 0; k < iteration; k++) {
        let inBetweenCase = [
          moveCase[0] < x ? moveCase[0] + k : moveCase[0] - k,
          moveCase[1] < y ? moveCase[1] + k : moveCase[1] - k,
        ];
        inBetweenCases.push(inBetweenCase);
        if (
          this.grid[inBetweenCase[1]][inBetweenCase[0]] === 1 ||
          this.grid[inBetweenCase[1]][inBetweenCase[0]] === 4 ||
          this.grid[inBetweenCase[1]][inBetweenCase[0]] === 5 ||
          this.grid[inBetweenCase[1]][inBetweenCase[0]] === 2
        ) {
          obtacles++;
        }
      }
      if (obtacles === 0) moves.push(moveCase);
    }
    console.log("Move Cases: ", moves);
    return moves;
  }

  display(player1, player2) {
    this.canvas.width = document.querySelector(".canvas-container").offsetWidth;
    this.canvas.height = document.querySelector(
      ".canvas-container"
    ).offsetWidth;
    this.ctx.fillStyle = "#eac096";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    let player1Count = 0;
    let player2Count = 0;
    let _player1CanTakeExist = false;
    let _player2CanTakeExist = false;
    for (var x = 0; x < this.gridLength[0]; x++) {
      for (var y = 0; y < this.gridLength[1]; y++) {
        let caseType = this.grid[y][x];
        let caseWidth = this.canvas.width / this.gridLength[0];
        this.ctx.fillStyle =
          (x + y) % 2 === 0 || x + y === 0 ? "rgba(0,0,0,0)" : "black";
        this.ctx.fillRect(caseWidth * x, caseWidth * y, caseWidth, caseWidth);

        if (caseType === 1 || caseType === 2) {
          if (caseType === 1) player1Count++;
          if (caseType === 2) player2Count++;
          this.ctx.fillStyle = caseType === 1 ? "white" : "#556b2f";
          this.ctx.beginPath();
          this.ctx.arc(
            caseWidth * x + caseWidth / 2,
            caseWidth * y + caseWidth / 2,
            caseWidth * 0.3,
            0,
            2 * Math.PI
          );
          this.ctx.fill();
          if (
            (_player1CanTakeExist === false ||
              _player2CanTakeExist === false) &&
            this.pieceCanTake(x, y)
          ) {
            if (caseType === 1) _player1CanTakeExist = true;
            if (caseType === 2) _player2CanTakeExist = true;
          }
        } else if (caseType === 3) {
          this.ctx.fillStyle = "grey";
          this.ctx.fillRect(caseWidth * x, caseWidth * y, caseWidth, caseWidth);
        } else if (caseType === 4 || caseType === 5) {
          if (caseType === 4) player1Count++;
          if (caseType === 5) player2Count++;
          this.ctx.fillStyle = caseType === 4 ? "white" : "#556b2f";
          this.ctx.beginPath();
          this.ctx.arc(
            caseWidth * x + caseWidth / 2,
            caseWidth * y + caseWidth / 2,
            caseWidth * 0.3,
            0,
            2 * Math.PI
          );
          this.ctx.fill();
          this.ctx.fillStyle = "red";
          this.ctx.beginPath();
          this.ctx.arc(
            caseWidth * x + caseWidth / 2,
            caseWidth * y + caseWidth / 2,
            caseWidth * 0.1,
            0,
            2 * Math.PI
          );
          this.ctx.fill();
          if (
            (_player1CanTakeExist === false ||
              _player2CanTakeExist === false) &&
            this.pieceCanTake(x, y)
          ) {
            if (caseType === 4) _player1CanTakeExist = true;
            if (caseType === 5) _player2CanTakeExist = true;
          }
        }
      }
    }
    this.player1CanTakeExist = _player1CanTakeExist;
    this.player2CanTakeExist = _player2CanTakeExist;
    if (player1Count === 0 || player2Count === 0) {
      if (player1Count === 0) alert(player2.name + " a gagné");
      else alert(player1.name + " a gagné");
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var player1 = new Player(1, prompt("Nom du premier joueur ?"));
  var player2 = new Player(2, prompt("Nom du deuxième joueur ?"));
  var game = new GameBoard();
  var canvas = document.querySelector("canvas");
  var ctx = canvas.getContext("2d");
  var selected;

  canvas.addEventListener("mousedown", function (event) {
    let x = Math.floor(event.offsetX / (canvas.width / 10));
    let y = Math.floor(event.offsetY / (canvas.width / 10));
    let caseType = game.grid[y][x];
    let pieceCanTake = game.pieceCanTake(x, y);
    let selectedCaseType = !!selected
      ? game.grid[selected[1]][selected[0]]
      : undefined;
    let selectedPieceCanTake = !!selected
      ? game.pieceCanTake(selected[0], selected[1])
      : false;
    let queenPreviousMoveCases = !!selected
      ? selectedCaseType === 4 || selectedCaseType === 5
        ? game.queenMove(selected[0], selected[1])
        : []
      : [];
    let queenTakePreviousMoves = !!selected
      ? (selectedCaseType === 4 || selectedCaseType === 5) &&
        selectedPieceCanTake
        ? game.pieceCanTakeMove(selected[0], selected[1])
        : []
      : [];
    console.log([x, y]);
    console.log(game.pieceCanTake(x, y));

    if (caseType === 3) {
      console.log("Piece ", selected);
      console.log("selectedPieceCanTake ", selectedPieceCanTake);
      // verify if must take
      if (selectedPieceCanTake) {
        // remove the taken piece
        let takenPiece = game.pieceTakePiece(
          selectedCaseType,
          selected[0],
          selected[1],
          x,
          y
        );
        game.grid[takenPiece[1]][takenPiece[0]] = 0;
      }
      // player moved
      game.grid[selected[1]][selected[0]] = 0;
      game.grid[y][x] = selectedCaseType;
      // verify if can take again
      // then if true don't change turn
      if (selectedPieceCanTake && game.pieceCanTake(x, y)) return;
      // change turn
      let player1IsActive = player1.hasActive;
      player1.active = !player1IsActive;
      player2.active = player1IsActive;
      // verify if the piece can be dame
      if (
        (y === 0 && selectedCaseType === 1) ||
        (y === 9 && selectedCaseType === 2)
      ) {
        // 4 is first player dame
        // 5 second player dame
        game.grid[y][x] = selectedCaseType === 1 ? 4 : 5;
      }
    }

    // remove previous selection
    if (selected !== undefined) {
      if (selectedCaseType === 1 || selectedCaseType === 2) {
        let previousMoveCases = [
          [selected[0] + 1, selected[1] - 1],
          [selected[0] - 1, selected[1] - 1],
          [selected[0] + 1, selected[1] + 1],
          [selected[0] - 1, selected[1] + 1],
          [selected[0] + 2, selected[1] + 2],
          [selected[0] - 2, selected[1] + 2],
          [selected[0] + 2, selected[1] - 2],
          [selected[0] - 2, selected[1] - 2],
        ];

        for (var i = 0; i < previousMoveCases.length; i++) {
          let moveCase = previousMoveCases[i];
          if (
            moveCase[0] > 9 ||
            moveCase[0] < 0 ||
            moveCase[1] > 9 ||
            moveCase[1] < 0
          )
            continue;
          if (game.grid[moveCase[1]][moveCase[0]] === 3) {
            game.grid[moveCase[1]][moveCase[0]] = 0;
          }
        }
      } else if (selectedCaseType === 4 || selectedCaseType === 5) {
        let previousMoveCases = selectedPieceCanTake
          ? [...queenPreviousMoveCases, ...queenTakePreviousMoves]
          : queenPreviousMoveCases;
        for (let i = 0; i < previousMoveCases.length; i++) {
          let moveCase = previousMoveCases[i];
          if (
            moveCase[0] > 9 ||
            moveCase[0] < 0 ||
            moveCase[1] > 9 ||
            moveCase[1] < 0
          )
            continue;
          if (game.grid[moveCase[1]][moveCase[0]] === 3) {
            game.grid[moveCase[1]][moveCase[0]] = 0;
          }
        }
      }
    }

    if (selected !== undefined && selected[0] === x && selected[1] === y) {
      selected = undefined;
      return;
    }
    selected = [x, y];
    if (caseType === 1 && game.player1CanTakeExist && !pieceCanTake) return;
    if (caseType === 4 && game.player1CanTakeExist && !pieceCanTake) return;
    if (caseType === 2 && game.player2CanTakeExist && !pieceCanTake) return;
    if (caseType === 5 && game.player2CanTakeExist && !pieceCanTake) return;
    if (caseType === 1 && !player1.hasActive) return;
    if (caseType === 4 && !player1.hasActive) return;
    if (caseType === 2 && !player2.hasActive) return;
    if (caseType === 5 && !player2.hasActive) return;
    if (caseType === 1 || caseType === 2) {
      let moveCases = pieceCanTake
        ? game.pieceCanTakeMove(x, y)
        : [
            [x + 1, caseType === 1 ? y - 1 : y + 1],
            [x - 1, caseType === 1 ? y - 1 : y + 1],
          ];
      console.log("moveCases ", moveCases);
      for (let i = 0; i < moveCases.length; i++) {
        let moveCase = moveCases[i];
        if (
          moveCase[0] > 9 ||
          moveCase[0] < 0 ||
          moveCase[1] > 9 ||
          moveCase[1] < 0
        )
          continue;
        if (game.grid[moveCase[1]][moveCase[0]] === 0) {
          game.grid[moveCase[1]][moveCase[0]] = 3;
        }
      }
    } else if (caseType === 4 || caseType === 5) {
      let moveCases = pieceCanTake
        ? game.pieceCanTakeMove(x, y)
        : game.queenMove(x, y);
      console.log("moveCases ", moveCases);
      for (let i = 0; i < moveCases.length; i++) {
        let moveCase = moveCases[i];
        if (
          moveCase[0] > 9 ||
          moveCase[0] < 0 ||
          moveCase[1] > 9 ||
          moveCase[1] < 0
        )
          continue;
        if (game.grid[moveCase[1]][moveCase[0]] === 0) {
          game.grid[moveCase[1]][moveCase[0]] = 3;
        }
      }
    }
  });

  function draw() {
    player1.display();
    player2.display();
    game.display(player1, player2);
    requestAnimationFrame(draw);
  }

  draw();
});
