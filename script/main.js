(() => {
    class Grid {
        #width;
        #height;
        #cells;

        constructor(width, height) {
            this.#width = width;
            this.#height = height;
            this.#cells = [];

            for (let i = 0; i < height; i++) {
                const row = [];
                for (let j = 0; j < width; j++) {
                    row.push(0);
                }
                this.#cells.push(row);
            }
        }

        get width() {
            return this.#width;
        }

        get height() {
            return this.#height;
        }

        getValue(x, y) {
            return this.#cells[y][x];
        }

        setValue(x, y, value) {
            this.#cells[y][x] = value;
        }
    }

    class Game {
        #turn;
        #grid;

        constructor() {
            this.#turn = 1;
            this.#grid = new Grid(3, 3);
        }

        get turn() {
            return this.#turn;
        }

        get isFull() {
            for (let row = 0; row < this.#grid.height; row++) {
                for (let column = 0; column < this.#grid.width; column++) {
                    if (this.#grid.getValue(column, row) == 0) {
                        return false;
                    }
                }
            }
            return true;
        }

        get isWon() {
            return this.hasWon(this.#turn) || this.hasWon(-this.#turn);
        }

        get isFinished() {
            return this.isFull || this.isWon;
        }

        hasWon(player) {
            for (let a = 0; a < this.#grid.width; a++) {
                let rowCount = 0;
                let columnCount = 0;
                for (let b = 0; b < this.#grid.height; b++) {
                    if (this.#grid.getValue(a, b) == player) {
                        columnCount++;
                    }
                    if (this.#grid.getValue(b, a) == player) {
                        rowCount++;
                    }
                }
                if (rowCount == this.#grid.width || columnCount == this.#grid.height) {
                    return true;
                }
            }

            let diagCount = 0;
            let contDiagCount = 0;
            for (let i = 0; i < this.#grid.width; i++) {
                if (this.#grid.getValue(i, i) == player) {
                    diagCount++;
                }
                if (this.#grid.getValue(i, 2 - i) == player) {
                    contDiagCount++;
                }
            }
            if (diagCount == this.#grid.width || contDiagCount == this.#grid.width) {
                return true;
            }

            return false;
        }

        nextPlayer() {
            this.#turn = -this.#turn;
        }

        isPossible(x, y) {
            return this.#grid.getValue(x, y) == 0;
        }

        move(x, y) {
            if (!this.isPossible(x, y)) {
                console.log("cell is not empty");
                return;
            }
            this.#grid.setValue(x, y, this.#turn);
        }
    }

    function displayMessage(title, msg) {
        const overlaytitle = document.querySelector("#overlaytitle");
        const overlaytext = document.querySelector("#overlaytext");

        overlaytitle.textContent = title;
        overlaytext.textContent = msg;
    }

    function displayError(title, msg) {
        const overlaywrapper = document.querySelector("#overlaywrapper");
        displayMessage(title, msg);
        overlaywrapper.classList.remove("success");
        overlaywrapper.classList.add("error");
        overlaywrapper.style.display = "flex";
    }
    
    function displaySuccess(title, msg) {
        const overlaywrapper = document.querySelector("#overlaywrapper");
        displayMessage(title, msg);
        overlaywrapper.classList.remove("error");
        overlaywrapper.classList.add("success");
        overlaywrapper.style.display = "flex";
    }

    const overlaybutton = document.querySelector("#overlaybutton");
    overlaybutton.addEventListener("click", () => {
        const overlaywrapper = document.querySelector("#overlaywrapper");
        overlaywrapper.style.display = "none";
    });

    const game = new Game();

    function displayPlayer() {
        const turn = document.querySelector("#turn");
        if (game.turn > 0) {
            turn.classList.remove("o");
            turn.classList.add("x");
        } else {
            turn.classList.remove("x");
            turn.classList.add("o");
        }
    }

    function cellClickEvent(event) {
        const cell = event.target;
        const rowIndex = cell.dataset.row;
        const columnIndex = cell.dataset.column;
        if (game.isFinished) {
            return;
        }

        if (!game.isPossible(rowIndex, columnIndex)) {
            //displayError("Occupied!", "You cannot place your mark here! This cell is not empty!");
            return;
        }

        game.move(rowIndex, columnIndex);

        cell.classList.remove("empty");
        if (game.turn > 0) {
            cell.classList.add("x");
        } else {
            cell.classList.add("o");
        }

        if (game.hasWon(game.turn)) {
            displaySuccess("Congratulations!!", `Player ${game.turn > 0 ? "x" : "o"} wins!`);
            return;
        } else if (game.isFull) {
            displayError("It's a draw!", "Try better next time!");
            return;
        }

        game.nextPlayer();
        displayPlayer();
    }

    const grid = document.querySelector("#grid");
    const cells = grid.querySelectorAll(".cell");
    cells.forEach((cell, cellIndex) => {
        const rowIndex = Math.floor(cellIndex / 3);
        const columnIndex = cellIndex % 3;
        cell.dataset.row = rowIndex;
        cell.dataset.column = columnIndex;
        cell.addEventListener("click", cellClickEvent);
    });

})();