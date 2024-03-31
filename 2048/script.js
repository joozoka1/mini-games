document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const overElement = document.querySelector('.over');
    let moves = 0;
    let score = 0;
    let startX = 0;
    let startY = 0;
    let grid = []

    function initGrid() {
        for (let i = 0; i < 4; i ++) {
            grid[i] = [];
            for (let j = 0; j < 4; j ++) {
                grid[i][j] = 0;
            }
        }
        addNewTile();
        addNewTile();
        renderGrid();
    }

    function addNewTile() {
        const availableCells = [];
        for (let i = 0; i < 4; i ++) {
            for (let j = 0; j < 4; j ++) {
                if (grid[i][j] === 0) {
                    availableCells.push({x: i, y: j});
                }
            }
        }
        if (availableCells.length > 0) {
            const {x, y} = availableCells[Math.floor(Math.random() * availableCells.length)];
            grid[x][y] = Math.random() < 0.9 ? 2 : 4;
        }
        else {
            gameOver();
        }
    }

    function renderGrid() {
        gridContainer.innerHTML = '';
        grid.forEach(row => {
            row.forEach(cell => {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.textContent = cell ? cell : '';
                tile.style.background = getTileColor(cell);
                gridContainer.appendChild(tile);
                if (tile.textContent === '2048') {
                    Win();
                }
            });
        });
    }

    function getTileColor(value) {
        switch (value) {
            case 2: return '#eee4da';
            case 4: return '#ede0c8';
            case 8: return '#f2b179';
            case 16: return '#f59563';
            case 32: return '#f67c5f';
            case 64: return '#f65e3b';
            case 128: return '#edcf72';
            case 256: return '#edcc61';
            case 512: return '#edc850';
            case 1024: return '#edc53f';
            case 2048: return '#edc22e';
            default: return '#ccc0b3';
        }
    }

    document.addEventListener('keydown', (event) => {
        let moved = false;
        checkMove();
        switch (event.key) {
            case 'ArrowUp':
                moved = moveUp();
                break;
            case 'ArrowDown':
                moved = moveDown();
                break;
            case 'ArrowLeft':
                moved = moveLeft();
                break;
            case 'ArrowRight':
                moved = moveRight();
                break;
        }
        if (moved) {
            moves ++;
            const movesElement = document.querySelector('.moves');
            movesElement.innerText = `Moves: ${moves}`;
            addNewTile();
            renderGrid();
        }
    });

    function handleSwipe(direction) {
        let moved = false;
        checkMove();
        switch (direction) {
            case 'up':
                moved = moveUp();
                break;
            case 'down':
                moved = moveDown();
                break;
            case 'left':
                moved = moveLeft();
                break;
            case 'right':
                moved = moveRight();
                break;
        }
        if (moved) {
            moves++;
            const movesElement = document.querySelector('.moves');
            movesElement.innerText = `Moves: ${moves}`;
            addNewTile();
            renderGrid();
        }
    }

    function detectSwipeDirection(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (Math.max(absX, absY) < 10) {
        }

        if (absX > absY) {
            return deltaX > 0 ? 'right' : 'left';
        } else {
            return deltaY > 0 ? 'down' : 'up';
        }
    }

    gridContainer.addEventListener('touchstart', (event) => {
        event.preventDefault();
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    });

    gridContainer.addEventListener('touchend', (event) => {
        event.preventDefault();
        const endX = event.changedTouches[0].clientX;
        const endY = event.changedTouches[0].clientY;
        const direction = detectSwipeDirection(startX, startY, endX, endY);
        if (direction) {
            handleSwipe(direction);
        }
    });

    function checkMove() {
        let move = false;
        for (let i = 0; i < 4; i ++) {
            for (let j = 1; j < 4; j ++) {
                if (grid[i][j] !==0) {
                    let k = j;
                    while (k > 0 && grid[i][k - 1] === 0) {
                        k --;
                        move = true;
                    }
                    if (k > 0 && grid[i][k - 1] === grid[i][k]) {
                        move = true;
                    }
                }
            }
        }

        if (!move) {
            for (let i = 0; i < 4; i ++ ) {
                for (let j = 2; j >= 0; j --) {
                    if (grid[i][j] !== 0) {
                        let k = j;
                        while (k < 3 && grid[i][k + 1] === 0) {
                            k ++;
                            move = true;
                        }
                        if (k < 3 && grid[i][k + 1] === grid[i][k]) {
                            move = true;
                        }
                    }
                }
            }
        }

        if (!move) {
            for (let j = 0; j < 4; j ++) {
                for (let i = 1; i < 4; i ++) {
                    if (grid[i][j] !== 0) {
                        let k = i;
                        while (k > 0 && grid[k - 1][j] === 0) {
                            k --;
                            move = true;
                        }
                        if (k > 0 && grid[k - 1][j] === grid[k][j]) {
                            move = true;
                        }
                    }
                }
            }
        }

        if (!move) {
            for (let j = 0; j < 4; j ++) {
                for (let i = 2; i >= 0; i --) {
                    if (grid[i][j] !== 0) {
                        let k = i;
                        while (k < 3 && grid[k + 1][j] === 0) {
                            k ++;
                            move = true;
                        }
                        if (k < 3 && grid[k + 1][j] === grid[k][j]) {
                            move = true;
                        }
                    }
                }
            }
        }
        if (!move) {
            gameOver();
        }
    }

    function moveLeft() {
        let moved = false;
        for (let i = 0; i < 4; i ++) {
            for (let j = 1; j < 4; j ++) {
                if (grid[i][j] !==0) {
                    let k = j;
                    while (k > 0 && grid[i][k - 1] === 0) {
                        grid[i][k - 1] = grid[i][k];
                        grid[i][k] = 0;
                        k --;
                        moved = true;
                    }
                    if (k > 0 && grid[i][k - 1] === grid[i][k]) {
                        score += grid[i][k - 1];
                        grid[i][k - 1] *= 2;
                        grid[i][k] = 0;
                        moved = true;
                    }
                }
            }
        }
        updateScore();
        return moved;
    }

    function moveRight() {
        let moved = false;
        for (let i = 0; i < 4; i ++ ) {
            for (let j = 2; j >= 0; j --) {
                if (grid[i][j] !== 0) {
                    let k = j;
                    while (k < 3 && grid[i][k + 1] === 0) {
                        grid[i][k + 1] = grid[i][k];
                        grid[i][k] = 0;
                        k ++;
                        moved = true;
                    }
                    if (k < 3 && grid[i][k + 1] === grid[i][k]) {
                        score += grid[i][k + 1];
                        grid[i][k + 1] *= 2;
                        grid[i][k] = 0;
                        moved = true;
                    }
                }
            }
        }
        updateScore();
        return moved;
    }

    function moveUp() {
        let moved = false;
        for (let j = 0; j < 4; j ++) {
            for (let i = 1; i < 4; i ++) {
                if (grid[i][j] !== 0) {
                    let k = i;
                    while (k > 0 && grid[k - 1][j] === 0) {
                        grid[k - 1][j] = grid[k][j];
                        grid[k][j] = 0;
                        k --;
                        moved = true;
                    }
                    if (k > 0 && grid[k - 1][j] === grid[k][j]) {
                        score += grid[k - 1][j];
                        grid[k - 1][j] *= 2;
                        grid[k][j] = 0;
                        moved = true;
                    }
                }
            }
        }
        updateScore();
        return moved;
    }

    function moveDown() {
        let moved = false;
        for (let j = 0; j < 4; j ++) {
            for (let i = 2; i >= 0; i --) {
                if (grid[i][j] !== 0) {
                    let k = i;
                    while (k < 3 && grid[k + 1][j] === 0) {
                        grid[k + 1][j] = grid[k][j];
                        grid[k][j] = 0;
                        k ++;
                        moved = true;
                    }
                    if (k < 3 && grid[k + 1][j] === grid[k][j]) {
                        score += grid[k + 1][j];
                        grid[k + 1][j] *= 2;
                        grid[k][j] = 0;
                        moved = true;
                        updateScore();
                    }
                }
            }
        }
        updateScore();
        return moved;
    }

    function updateScore() {
        const scoreElement =  document.querySelector('.score');
        scoreElement.innerText = `Score: ${score}`;
    }

    function gameOver() {
        overElement.innerHTML = `You lost in ${moves} moves`;

    }

    function Win() {
        overElement.innerHTML = `You won in ${moves} moves`;
    }

    initGrid();
});

function restart() {
    window.location.reload();
}