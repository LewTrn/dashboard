// Time and Date Display
function updateTimeAndDate() {
  const time = document.querySelector('.time'),
    date = document.querySelector('.date'),
    datetime = document.querySelector('time');

  let now = new Date(),
  timeFormat = { hour: '2-digit', minute: '2-digit' },
  dateFormat = { weekday: 'long', month: 'long', day: 'numeric' };

  // Update display elements
  time.innerHTML = now.toLocaleTimeString('en-gb', timeFormat);
  date.innerHTML = now.toLocaleDateString('en-gb', dateFormat);
  datetime.setAttribute('datetime', now.toISOString());

  setTimeout(updateTimeAndDate, 1000);
}

// Update Welcome Message
function updateWelcome() {
  const welcome = document.querySelector('.welcome-prefix');
  
  let now = new Date(),
    hour = now.getHours();

  if (hour < 12) {
    // Morning
    welcome.innerHTML = "Good morning";
  } else if (hour < 18) {
    // Afternoon
    welcome.innerHTML = "Good afternoon";
  } else {
    // Evening
    welcome.innerHTML ="Good evening";
  }

  setTimeout(updateWelcome, 1000);
}

// On Load Window Event
window.addEventListener('load', ()=> {

  // Run update display functions
  updateTimeAndDate();
  updateWelcome();
});