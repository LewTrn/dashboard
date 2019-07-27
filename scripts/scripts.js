/* ----------------------------------------
    Portrait Scripts
---------------------------------------- */
// Search Bar
function webSearch() {
  const input = this.querySelector('input');
  const terms = input.value.trim();

  if (terms) {
    window.open(`https://www.google.com/search?q=${terms}`, '_self');
    input.blur();
  }
  input.value = '';
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
  const field = document.querySelector('.focus-banner .field');
  const input = this.querySelector('input');
  const message = input.value.trim();

  // Check for valid trimmed message
  if (message) {
    // Add focus message
    const para = document.createElement('a');
    const text = document.createTextNode(message);

    para.appendChild(text);
    para.classList.add('focus-message', 'has-text-primary');
    field.appendChild(para);

    // Click to edit focus listener
    para.addEventListener('click', () => {
      this.removeAttribute('hidden');
      this.parentNode.removeChild(this.parentNode.lastChild);
    }, false);

    // Hide form field
    this.setAttribute('hidden', true);
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
  const focus = document.querySelector('.add-focus');
  const search = document.querySelector('.search');

  // Submit event listeners
  focus.addEventListener('submit', addFocus, false);
  search.addEventListener('submit', webSearch, false);

  // Update focus panel
  updateWelcome();
  banner.removeAttribute('hidden');
});
