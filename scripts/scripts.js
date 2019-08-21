/* ----------------------------------------
    Settings Class
---------------------------------------- */
class Settings {
  constructor() {
    this.name = '';
    this.provider = 'Google';
  }

  // Search Bar
  webSearch() {
    const input = document.querySelector('.search').querySelector('input');
    const terms = input.value.trim();

    if (terms) {
      if (this.provider === 'DuckDuckGo')
        window.open(`https://www.duckduckgo.com/?q=${terms}`, '_blank');
      else
        window.open(`https://www.${this.provider}.com/search?q=${terms}`, '_blank');
        
      input.blur();
    }
    input.value = '';
  }
}

/* ----------------------------------------
    Portrait Scripts
---------------------------------------- */
// Search Icon Event
function clickSearch(setting) {
  const input = document.querySelector('.search').querySelector('input');

  // Focus on input or search input value
  if (input.value)
    setting.webSearch();
  else
    input.focus();
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

// Modal Tab Switching
function modalTabs(parent, tab) {
  // Remove active tab
  parent.querySelectorAll('.is-active').forEach((el) => {
    el.classList.remove('is-active');
  });
  tab.parentNode.classList.add('is-active');

  // Show active tab content
  parent.querySelectorAll('[data-content]').forEach((el) => {
    el.setAttribute('hidden', true)
    if (tab.innerText === el.dataset.content)
      el.toggleAttribute('hidden');
  });
}

// Toggle Modal
function toggleModal(id, tab) {
  const modal = document.querySelector(`#${id}.modal`);

  if (modal.querySelectorAll('.tabs').length && tab) {
    const body = modal.querySelector('.tabs').parentNode;
    const tabs = body.querySelectorAll('.tabs li a');

    modalTabs(body, tabs[tab-1]);
  }
  modal.classList.toggle('is-active');
}

// Reset Form Alerts
function resetAlerts(form) {
  const alerts = form.querySelectorAll('.help');
  const inputs = form.querySelectorAll('input');

  // Reset alerts and inputs
  alerts.forEach((alert) => {
    alert.classList.add('is-hidden');
  });

  inputs.forEach((input) => {
    input.classList.remove('is-danger');
    input.classList.add('is-primary');
  });
}

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
  const name = document.querySelector('.personal-name input');

  if (hour < 12)
    welcome.innerText = 'Good morning';
  else if (hour < 18)
    welcome.innerText = 'Good afternoon';
  else
    welcome.innerText = 'Good evening';

  if (name.value)
    welcome.innerText += `, ${name.value}`;

  setTimeout(updateWelcome, 1000);
}

/* ----------------------------------------
    Sidebar Scripts
---------------------------------------- */
// Add New Bookmark
function addBookmark() {
  const modal = document.querySelector('#addBookmark');
  const inputs = modal.querySelectorAll('input, select');
  const name = inputs[0].value.trim();
  const url = inputs[1].value.trim();
  const icon = inputs[2].value.trim().toLowerCase();
  const type = inputs[3].value;

  // Empty name or URL check
  if (!name || !url) {
    if (!name)
      inputs[0].value = '';
    if(!url)
      inputs[1].value = '';
    return;
  }

  // URL regex check
  const urlRE = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  if (!urlRE.test(url)) {
    // URL input alert
    inputs[1].classList.remove('is-primary');
    inputs[1].classList.add('is-danger');
    modal.querySelector('.help').classList.remove('is-hidden');
  } else {
    const bookmarks = document.querySelector('.bookmarks');
    const template = document.querySelector('#bookmarkTemplate').cloneNode(true);

    // Format bookmark icon
    template.removeAttribute('id');
    template.setAttribute('aria-label', name);
    template.setAttribute('href', url);

    // Reset form
    modal.querySelector('form').reset();
    resetAlerts(modal.querySelector('form'));
    toggleModal('addBookmark');

    // Font Awesome input check
    if (icon.length) {
      const i = document.createElement('i');
      const icons = bookmarks.querySelectorAll('a i');

      i.classList.add(type, `fa-${icon}`);
      template.appendChild(i);
      bookmarks.insertBefore(template, bookmarks.querySelector('.add-bookmark'));

      // Apply default icon for invalid icon
      if (icons[icons.length-1].offsetHeight)
        return;
    }
    template.innerText = name.charAt(0).toUpperCase();
    bookmarks.insertBefore(template, bookmarks.querySelector('.add-bookmark'));
  }
}

/* ----------------------------------------
    Initialisation
---------------------------------------- */
// On Load Window Event
window.addEventListener('load', () => {
  const settings = new Settings();

  // Sidebar interactions
  const sidebar = document.querySelector('.sidebar');

  sidebar.addEventListener('click', e => {
    if (e.target.classList.contains('settings'))
      toggleModal('settings', 1);
    else if (e.target.classList.contains('bookmark'))
      toggleModal('settings', 3)
    else if (e.target.classList.contains('add-bookmark'))
      toggleModal('addBookmark');
  });

  // Modal interactions
  const modals = document.querySelectorAll('.modal');

  modals.forEach((el) => {
    el.addEventListener('click', e => {
      if (e.target.classList.contains('close-modal')) {
        toggleModal(el.id);

        // Reset form settings
        el.querySelectorAll('form').forEach((form) => {
          form.reset();
          resetAlerts(form);
        });
      }
    });

    // Tab interactions
    const tabs = el.querySelectorAll('.modal-card-body .tabs');

    if (tabs.length) {
      tabs.forEach((tab) => {
        tab.addEventListener('click', e => {
          if (e.target.tagName.toLowerCase() === 'a') {
            modalTabs(tab.parentNode, e.target);
          } 
        });
      });
    }

    // Settting menu
    // Radio buttons function
    function updateRadio(form, e) {
      if (e.target.tagName.toLowerCase() === 'input') {
        // Update checked attribute
        form.querySelectorAll('input').forEach((radio) => {
          radio.removeAttribute('checked');
        });
        e.target.setAttribute('checked', true);
        
        settings.provider = e.target.value;
        e.stopImmediatePropagation();
      }
    }

    // Getting started
    const personal = document.querySelector('.personal-name');
    const provider = document.querySelector('.search-provider');

    // Dynamic input update
    personal.addEventListener('input', e => {
      const input = personal.querySelector('input');
      const name = input.value.trim();

      if (name !== settings.name) {
        settings.name = name;
        input.setAttribute('value', name)
      }
      e.stopImmediatePropagation();
    });

    provider.addEventListener('click', e => {updateRadio(provider, e)});

    // Bookmarks
    const bookmarks = document.querySelector('.bookmark-manager').parentNode;

    bookmarks.addEventListener('click', e => {
      // Open add new bookmark modal
      if (e.target.classList.contains('has-background-white-ter')) {
        toggleModal('settings');
        toggleModal('addBookmark');
        e.stopImmediatePropagation();
      }
    });

    // Weather
    const units = document.querySelector('.temp-units');

    units.addEventListener('click', e => {updateRadio(units, e)});
  });

  // Initialising dashboard
  const banner = document.querySelector('.focus-banner');
  const bookmark = document.querySelector('#addBookmark form');
  const focus = banner.querySelector('form');
  const search = document.querySelector('.search');
  const weather = document.querySelector('.weather');

  // Portrait interactions
  search.querySelector('a').addEventListener('click', ()=> {clickSearch(settings)});
  weather.addEventListener('click', ()=> {toggleModal('settings', 4)});

  // Submit event listeners
  focus.addEventListener('submit', addFocus);
  search.addEventListener('submit', ()=> {settings.webSearch()});
  bookmark.addEventListener('submit', addBookmark);

  // Update focus panel
  updateWelcome();
  banner.removeAttribute('hidden');
});