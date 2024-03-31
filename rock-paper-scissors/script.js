let score = {
    wins: 0,
    losses: 0,
    ties: 0
};

window.addEventListener('load', () => {
    const savedScore = getCookie('score');
    if (savedScore) {
        score = JSON.parse(savedScore);
        updateScoreElement();
    }
});

function saveScore() {
    document.cookie = `score=${JSON.stringify(score)}; expires=${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
}

function makeMove(playerMove) {
    const computerMove = pickComputerMove();
    const resultElement = document.getElementById('result');

    if (playerMove === computerMove) {
        resultElement.innerHTML = 'Tie.';
        score.ties ++;
    }
    else if (
        (playerMove === 'rock' && computerMove === 'scissors') ||
        (playerMove === 'paper' && computerMove === 'rock') ||
        (playerMove === 'scissors' && computerMove === 'paper')
    ) {
        resultElement.innerHTML = 'You win.';
        score.wins ++;
    }
    else {
        resultElement.innerHTML = 'You lose.';
        score.losses ++;
    }

    const movesChosenElement = document.getElementById('moves-chosen');
    movesChosenElement.innerHTML = `
    You
    <img class="move-icon" src="assets/images/${playerMove}-emoji.png" alt="${playerMove} emoji">
    <img class="move-icon" src="assets/images/${computerMove}-emoji.png" alt="${computerMove} emoji">
    Computer
    `;

    updateScoreElement();
}

function pickComputerMove() {
    const randomNumber = Math.random();
    let computerMove;

    if (randomNumber < (1 / 3)) {
        computerMove = 'rock';
    }
    else if (randomNumber < (2 / 3)) {
        computerMove = 'paper';
    }
    else {
        computerMove = 'scissors';
    }

    return computerMove;
}

function updateScoreElement() {
    document.getElementById('score').innerHTML = `
    Wins: ${score.wins}, <br><br>
    Losses: ${score.losses}, <br><br>
    Ties: ${score.ties}
    `;
}

function resetScore() {
    const resultElement = document.getElementById('result');
    const movesChosenElement = document.getElementById('moves-chosen');

    score = {
        wins: 0,
        losses: 0,
        ties: 0
    };

    resultElement.innerHTML = '';
    movesChosenElement.innerHTML = '';

    updateScoreElement();
    saveScore();
}

function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : null;
}