let isPaused = false;
let lifePoints, timer;
let intervalId = null;

document.getElementById('startButton').addEventListener('click', function() {
    let inputVal = document.getElementById('lifePointsInput').value;
    if (inputVal) {
        lifePoints = parseInt(inputVal);
        timer = 10 * 60; // Reset timer to 10 minutes
        document.getElementById('lifePointsDisplay').textContent = lifePoints;
        isPaused = false;
    }

    startTimer();
    document.getElementById('pauseResumeButton').textContent = 'Pause';
    document.getElementById('pauseResumeButton').style.display = 'inline';
});

document.getElementById('pauseResumeButton').addEventListener('click', function() {
    if (isPaused) {
        startTimer();
        this.textContent = 'Pause';
    } else {
        clearInterval(intervalId);
        this.textContent = 'Resume';
    }
    isPaused = !isPaused;
});

function startTimer() {
    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(function() {
        if (!isPaused && lifePoints > 0 && timer > 0) {
            timer--;
            updateTimerDisplay(timer);

            if (timer === 0) {
                lifePoints--;
                document.getElementById('lifePointsDisplay').textContent = lifePoints;
                timer = 10 * 60; // Reset timer
            }
        } else if (lifePoints <= 0) {
            clearInterval(intervalId);
            document.getElementById('pauseResumeButton').style.display = 'none';
        }

        localStorage.setItem('lifePointsAppState', JSON.stringify({ lifePoints, timer, lastUpdateTime: new Date(), isPaused }));
    }, 1000);
}

function updateTimerDisplay(timer) {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    document.getElementById('timerDisplay').textContent = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
}

document.addEventListener('DOMContentLoaded', function() {
    let savedState = localStorage.getItem('lifePointsAppState');
    if (savedState) {
        savedState = JSON.parse(savedState);
        lifePoints = savedState.lifePoints;
        isPaused = savedState.isPaused;
        const lastUpdateTime = new Date(savedState.lastUpdateTime);
        const currentTime = new Date();
        const elapsedSeconds = Math.floor((currentTime - lastUpdateTime) / 1000);

        timer = Math.max(savedState.timer - elapsedSeconds, 0);
        while (timer <= 0 && lifePoints > 0) {
            lifePoints--;
            timer += 10 * 60; // Add 10 minutes in seconds
        }
    } else {
        lifePoints = 96; // Default Life Points
        timer = 10 * 60; // 10 minutes in seconds
        isPaused = false;
    }

    document.getElementById('lifePointsDisplay').textContent = lifePoints;
    updateTimerDisplay(timer);

    if (!isPaused) {
        startTimer();
        document.getElementById('pauseResumeButton').style.display = 'inline';
        document.getElementById('pauseResumeButton').textContent = 'Pause';
    } else {
        document.getElementById('pauseResumeButton').style.display = 'inline';
        document.getElementById('pauseResumeButton').textContent = 'Resume';
    }
});
