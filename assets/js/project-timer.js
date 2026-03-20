let timerInterval;
let timerSeconds = 0;

const timer = document.getElementById('timer');
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const clearButton = document.getElementById('clear-btn');

function loadTime() {
  let savedTime = localStorage.getItem('timer');

  if (savedTime !== null) {
    timerSeconds = Number(savedTime);
    clearButton.style.display = 'inline';
  }

  timer.textContent = formatTime(timerSeconds);
}

function formatTime(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, '0');
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

startButton.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerSeconds++;
    timer.textContent = formatTime(timerSeconds);
  }, 1000);

  startButton.style.display = 'none';
  stopButton.style.display = 'inline';
  clearButton.style.display = 'none';
});

stopButton.addEventListener('click', () => {
  clearInterval(timerInterval);

  startButton.style.display = 'inline';
  stopButton.style.display = 'none';
  clearButton.style.display = 'inline';

  localStorage.setItem('timer', `${timerSeconds}`);
});

clearButton.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerSeconds = 0;
  timer.textContent = '00:00:00';

  startButton.style.display = 'inline';
  stopButton.style.display = 'none';
  clearButton.style.display = 'none';
});

loadTime();