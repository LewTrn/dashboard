// DOM Elements
const time = document.querySelector('.time'),
  date = document.querySelector('.date'),
  datetime = document.querySelector('time');

// Time and Date Display
function updateTimeAndDate() {
  let now = new Date(),
    timeFormat = { hour: '2-digit', minute: '2-digit' },
    dateFormat = { weekday: 'long', month: 'long', day: 'numeric' };

  // Update display elements
  time.innerHTML = now.toLocaleTimeString('en-gb', timeFormat);
  date.innerHTML = now.toLocaleDateString('en-gb', dateFormat);
  datetime.setAttribute('datetime', now.toISOString());

  setTimeout(updateTimeAndDate, 1000);
}
updateTimeAndDate();