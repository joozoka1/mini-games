const grid = document.getElementById("grid");
window.addEventListener("contextmenu", e => e.preventDefault());

class Grid {
    constructor (numMines, rows, cols) {
        this.numMines = numMines;
        this.rows = rows;
        this.cols = cols;
        this.initGrid();
    }

    initGrid() {
        for (let i = 0; i < this.rows; i ++) {
            let row = grid.insertRow(i);
            for (let j = 0; j < this.cols; j ++) {
                let cell = row.insertCell(j);

                const numRows = this.rows;
                const numCols = this.cols;

                cell.onclick = function() {clickCell(this, numRows, numCols);};
                cell.onmousedown = function(event) {
                    if (event.which === 3) {
                        rightClickCell(this);
                    }
                }

                let isMine = document.createAttribute('isMine');
                isMine.value = 'false';
                cell.setAttributeNode(isMine);

                cell.style.backgroundColor = '#999999';

                let isFlagged = document.createAttribute('isFlagged');
                isFlagged.value = 'false';
                cell.setAttributeNode(isFlagged);

                let isSearched = document.createAttribute('isSearcher');
                isSearched.value = 'false';
                cell.setAttributeNode(isSearched);
            }
        }

        this.initMines(35);
        this.HowManyMines();
    }

    initMines() {
        for (let i = 0; i < this.numMines; i ++) {
            let row = Math.floor(Math.random() * this.rows);
            let col = Math.floor(Math.random() * this.cols);

            let cell = grid.rows[row].cells[col];
            cell.setAttribute('isMine', 'true');
            cell.setAttribute('isSearched', 'false');
        }
    }

    HowManyMines() {
        for (let i = 0; i < this.rows; i ++) {
            for (let j = 0; j < this.cols; j ++) {
                let res = 0;
                let cell = grid.rows[i].cells[j];

                for (let k = -1; k < 2; k ++) {
                    for (let l = -1; l < 2; l ++) {
                        if ((k !== 0 || l !== 0) && (i + k >= 0) && (j + l >= 0) && (i + k < this.rows) && (j + l < this.cols)) {
                            if (grid.rows[i + k].cells[j + l].getAttribute('isMine') == 'true') {
                                res ++;
                            }
                        }
                    }
                }

                let adjMines = document.createAttribute('adjMines');
                adjMines.value = `${res}`;
                cell.setAttributeNode(adjMines);
            }
        }
    }
}

function clickCell(cell, rows, cols) {
    let isMine = cell.getAttribute('isMine');
    let numMines = cell.getAttribute('adjMines');

    if (isMine === 'true') {
        for (let i = 0; i < rows; i ++) {
            for (let j = 0; j < cols; j ++) {
                let mine = grid.rows[i].cells[j];
                if (mine.getAttribute('isMine') === 'true') {
                    mine.style.backgroundColor = 'red';
                }
            }
        }
    }
    else {
        cell.innerHTML = numMines;
        cell.setAttribute('isSearched', 'true');
        reveal(cell, rows, cols);
        checkGameOver(rows, cols);
    }
}

function rightClickCell(cell) {
    if (cell.getAttribute('isFlagged') === 'false') {
        cell.style.backgroundColor =  'lightGreen';
        cell.setAttribute('isFlagged', 'true');
    }
    else {
        cell.style.backgroundColor = '#999999';
        cell.setAttribute('isFlagged', 'false');
    }
}

function reveal(cell, rows, cols) {
    if (cell.getAttribute('adjMines') === '0') {
        cell.setAttribute('isSearched', 'true');
        let i = cell.parentNode.rowIndex;
        let j = cell.cellIndex;

        for (let k = -1; k < 2; k ++) {
            for (let l = -1; l < 2; l ++) {
                if ((k !== 0 || l !== 0) && (i + k >= 0) && (j + l >= 0) && (i + k < rows) && (j + l < cols)) {
                    let newCell = grid.rows[i + k].cells[j + l];
                    newCell.innerHTML = newCell.getAttribute('adjMines');
                    if (newCell.getAttribute('adjMines') === '0' && newCell.getAttribute('isSearched') === 'false') {
                        reveal(newCell, rows, cols);
                    }
                    newCell.setAttribute('isSearched', 'true');
                }
            }
        }
    }
}

function checkGameOver(rows, cols) {
    for (let i = 0; i < rows; i ++) {
        for (let j = 0; j < cols; j ++) {
            let cell = grid.rows[i].cells[j];
            if (cell.getAttribute('isSearched') === 'false') {
                return;
            }
        }
    }
    alert('You won!');
}

let newGrid = new Grid(20, 10, 10);