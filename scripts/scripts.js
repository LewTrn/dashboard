/* ----------------------------------------
    Portrait Scripts
---------------------------------------- */
// Search Bar
function webSearch() {
  const input = document.querySelector('.search').querySelector('input');
  const terms = input.value.trim();

  if (terms) {
    window.open(`https://www.google.com/search?q=${terms}`, '_self');
    input.blur();
  }
  input.value = '';
}

// Search Icon
function clickSearch() {
  const input = document.querySelector('.search').querySelector('input');

  // Focus on input or search input value
  if (input.value) {
    webSearch();
  }
  else {
    input.focus();
  }
}

// Time and Date Display
function updateTimeAndDate() {
  const time = document.querySelector('.time');
  const date = document.querySelector('.date');
  const datetime = document.querySelector('time');

  const now = new Date();
  const timeFormat = { hour: '2-digit', minute: '2-digit' };
  const dateFormat = { weekday: 'long', month: 'long', day: 'numeric' };

  // Update display elements
  time.innerHTML = now.toLocaleTimeString('en-gb', timeFormat);
  date.innerHTML = now.toLocaleDateString('en-gb', dateFormat);
  datetime.setAttribute('datetime', now.toISOString());

  setTimeout(updateTimeAndDate, 1000);
}
updateTimeAndDate();

/* ----------------------------------------
    Board Scripts
---------------------------------------- */
// Add Focus
function addFocus() {
  const input = this.querySelector('input');
  const button = this.querySelector('button').parentNode;
  const message = input.value.trim();

  // Check for valid trimmed message
  if (message) {
    // Add focus message
    const para = document.createElement('a');
    const text = document.createTextNode(message);

    para.appendChild(text);
    para.classList.add('focus-message', 'has-text-primary');
    this.appendChild(para);

    // Click to edit focus listener
    para.addEventListener('click', () => {
      button.toggleAttribute('hidden');
      input.setAttribute('type', 'text');
      this.removeChild(this.lastChild);
    });

    // Hide form field
    button.toggleAttribute('hidden');
    input.setAttribute('type', 'hidden');
    input.value = message;
  } else {
    input.value = '';
  }
}

// Update Welcome Message
function updateWelcome() {
  const welcome = document.querySelector('.welcome-prefix');
  const now = new Date();
  const hour = now.getHours();

  if (hour < 12) {
    // Morning
    welcome.innerHTML = 'Good morning';
  } else if (hour < 18) {
    // Afternoon
    welcome.innerHTML = 'Good afternoon';
  } else {
    // Evening
    welcome.innerHTML = 'Good evening';
  }

  setTimeout(updateWelcome, 1000);
}

// On Load Window Event
window.addEventListener('load', () => {
  const banner = document.querySelector('.focus-banner');
  const focus = banner.querySelector('form');
  const search = document.querySelector('.search');

  // Board interactions
  search.querySelector('a').addEventListener('click', clickSearch);

  // Submit event listeners
  focus.addEventListener('submit', addFocus);
  search.addEventListener('submit', webSearch);

  // Update focus panel
  updateWelcome();
  banner.removeAttribute('hidden');
});
