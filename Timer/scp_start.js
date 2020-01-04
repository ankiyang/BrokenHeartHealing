let countdown;
const timerDisplay = document.querySelector('.time_left');
const endTime = document.querySelector('.end_time');

function timer(seconds) {
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds)
    displayEndTime(then);

    countdown = setInterval(() => {
        const secondsLeft = Math.round(then - Date.now()) / 1000;
        if (secondsLeft <= 0) {
            clearInterval(countdown);
            return;
        }
        console.log(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds/60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hour = end.getHours();
    const minutes = end.getMinutes();

    const adjustedHour = hour > 12 ? hour - 12 : hour;
    const adjustMin = minutes < 10 ? '0' : '';
    endTime.textContent = `Be Back At ${adjustedHour}:${adjustMin}${minutes}`;
}