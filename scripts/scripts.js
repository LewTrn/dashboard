/* ----------------------------------------
    Portrait Scripts
---------------------------------------- */
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
updateTimeAndDate();

/* ----------------------------------------
    Board Scripts
---------------------------------------- */
// Add Focus
function addFocus() {
  const field = document.querySelector('.focus-banner .field'),
    input = this.querySelector('input'), 
    message = input.value.trim();

  let para 

  // Check for valid trimmed message
  if (message) {
    // Add focus message
    let para = document.createElement('a'),
      text = document.createTextNode(message);

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
    input.value = "";
  }
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
  const banner = document.querySelector('.focus-banner'),
  focus = document.querySelector('.add-focus'), 
  search = document.querySelector('.search');

  // Update today's focus
  focus.addEventListener('submit', addFocus, false);

  // Update focus panel
  updateWelcome();
  banner.removeAttribute('hidden');

});