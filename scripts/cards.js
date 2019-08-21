/* ----------------------------------------
    Card Interactions
---------------------------------------- */
// Clone Card Templates
function cardContent(name) {
  const templateID = `#${name.split(' ')[0].toLowerCase()}Template`;

  //  Returns innerHTML based on available templates
  if (document.querySelector(templateID)) {
    const template = document.querySelector(templateID).cloneNode(true);

    template.removeAttribute('id');
    return template.outerHTML;
  }
  return 'No card content found';
}

// Toggle Element Display/Hide
function toggleHideAll(parentElements, selectors) {
  const elements = parentElements.querySelectorAll(selectors);

  // Toggle .hide class for buttons and inputs, else toggle hidden attribute
  elements.forEach((el) => {
    if (el.tagName.toLowerCase() === 'button' || el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'span')
      el.classList.toggle('is-hidden');
    else
      el.toggleAttribute('hidden');
  });
}

// Enable Sorting
function enableSorting() {
  const cards = document.querySelector('.cards');
  const bookmarks = document.querySelector('.bookmarks');
  const manager = document.querySelector('.bookmark-manager');

  // Enable card sorting
  const sortCards = Sortable.create(cards, { // eslint-disable-line
    animation: 300,
    emptyInsertThreshold: 30,
    scroll: true,
    scrollSensitivity: 50,
    bubbleScroll: true,
    handle: '.message-header',
  });

  // Enable bookmark sorting
  const sortBookmarks = Sortable.create(bookmarks, { // eslint-disable-line
    animation: 300,
    emptyInsertThreshold: 30,
    scroll: true,
    scrollSensitivity: 50,
    bubbleScroll: true,
    handle: 'a',
  });

  // Enable bookmark manager sorting
  const sortManager = Sortable.create(manager, { // eslint-disable-line
    animation: 300,
    emptyInsertThreshold: 30,
    scroll: true,
    scrollSensitivity: 50,
    bubbleScroll: true,
    handle: '.manager-buttons a:first-of-type',
  });
}

// Remove Animation
function removeAnimation(article) {
  article.classList.remove('animated', 'fadeInLeft', 'shake', 'rubberBand');
}

// Limit String Digits (HTML onInput)
function limitString(el) { // eslint-disable-line no-unused-vars
  const digits = el.max.length;

  // Restrict input length
  if (el.value.length > digits)
    el.value = el.value.slice(0, digits);
}

// Time Change Formatting (HTML onChange)
function timeChange(el) { // eslint-disable-line no-unused-vars
  const upper = Number(el.max);
  const lower = Number(el.min);

  // Wrap and bound rules
  if (Number(el.value) === upper || Number(el.value) === 0)
    el.value = '';
  if (Number(el.value) === lower || Number(el.value) > upper - 1)
    el.value = upper - 1;

  // Pads single digit numbers with leading zero
  if (el.value.length < el.max.length && el.value !== '')
    el.value = 0 + el.value;
}

// Return Time In Seconds
function toSeconds(time) {
  const seconds = time[0] * 60 * 60 + time[1] * 60 + time[2];

  return seconds;
}

// Copy to clipboard
function copyToClipboard(el) {
  // Only copy valid strings
  if (/^[#rh]/.test(el.value)) {
    el.select();
    document.execCommand('copy');

    // Animate clipboard icon
    const icon = el.parentNode.querySelector('i');

    icon.classList.add('animated', 'rubberBand');
    setTimeout(removeAnimation, 1000, icon);
  }
}

/* ----------------------------------------
    Card Class
---------------------------------------- */
class Card {
  constructor(ID, name, colour) {
    this.ID = ID;
    this.name = name;
    this.colour = colour;
    this.colourClass = function(i, primary, isText) {
      let classes = ['is-dark', 'is-primary', 'is-info', 'is-success', 'is-warning'];
      
      // For themes where primary is matched with dark
      classes[0] = primary ? 'is-primary' : classes[0];

      // For text themed colour classes
      if (isText) {
        classes = classes.map(function(str) {
          return `has-text${str.slice(2)}`;
        });
      }

      return Number.isInteger(i) ? classes[i] : classes[this.colour];
    }
  }

  // Assigns a new card object to the card list
  appendCard() {
    const template = document.querySelector('#cardTemplate').cloneNode(true);
    const cards = document.querySelector('.cards');

    // Modifying template
    template.setAttribute('id', `cardID-${this.ID}`);
    template.querySelector('.message-header p').innerText = this.name;
    template.querySelector('.message-body').innerHTML = cardContent(this.name);

    // Place node after focus banner and assign element object property
    cards.prepend(template);
    this.element = cards.children[0]; // eslint-disable-line prefer-destructuring

    setTimeout(removeAnimation, 1000, this.element);
  }

  // Cycles through card colour classes
  cycleColour(nodeList) {
    let foo = this.colour;

    foo = foo > 3 ? 0 : foo + 1;
    this.element.classList.remove(this.colourClass());
    this.element.classList.add(this.colourClass(foo));

    if (nodeList) {
      nodeList.forEach((el) => {
        const isText = el.tagName.toLowerCase() === 'a' || el.tagName.toLowerCase() === 'p';

        el.classList.remove(this.colourClass(null, true, isText));
        el.classList.add(this.colourClass(foo, true, isText));
      });
    }

    this.colour = foo;
    this.element.setAttribute('data-colour', this.colour);
  }

  // Collapses card by hiding message
  collapseCard() {
    this.element.querySelector('.message-body').toggleAttribute('hidden');

    // Toggle header style
    this.element.querySelector('.fa-angle-up').classList.toggle('btn-rotate');
    this.element.querySelector('.message-header').classList.toggle('round-header');
  }

  // Removes card and returns card ID for reassignment
  closeCard() {
    this.element.remove();
    this.element = null;
    return this.ID - 1;
  }
}

class Notes extends Card {
  constructor(ID, name, colour) {
    super(ID, name, colour);
    this.title = name;
    this.content = [];
    this.isChecked = [];
  }

  // Save and update notepad
  saveNote(form) {
    const title = this.element.querySelector('input').value.trim();
    const note = this.element.querySelector('textarea').value.trim();

    if (title || note) {
      this.title = title || 'Notepad';
      this.content = note;

      this.element.querySelector('.message-header p').innerText = this.title;
      this.element.querySelector('.notepad p').innerText = note;
      this.element.querySelector('.buttons').classList.toggle('is-centered');
      this.element.querySelector('.buttons').classList.toggle('is-right');

      toggleHideAll(form, '.control, p, button, a');
    } else {
      this.element.querySelector('.control input').value = '';
      this.element.querySelector('.control textarea').value = '';
    }
  }

  // Add to to-do list
  addToList() {
    const item = this.element.querySelector('.to-do-add input');
    const message = item.value.trim();

    if (message) {
      this.content.push(message);
      item.value = '';

      // Clone and modify checkbox template
      const template = document.querySelector('#checkboxTemplate').cloneNode(true);
      const input = template.querySelector('input');
      const label = template.querySelector('label');
      const UID = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      template.removeAttribute('id');
      input.id = `item-${this.ID}-${UID}`;
      input.classList.add(this.colourClass(this.colour, true));
      label.setAttribute('for', `item-${this.ID}-${UID}`);
      label.innerText = message;

      this.element.querySelector('.control').insertBefore(template, item.closest('.to-do-add'));
    } else {
      this.element.querySelector('.to-do-add .control input').value = '';
    }
  }

  // Remove checked items and update properties
  removeCheckedItems() {
    const checkedCount = this.isChecked.length;

    // Loop through and remove checked items
    for (let i = 0; i < checkedCount; i++) {
      this.content.splice(this.isChecked[0] - i, 1);
      this.isChecked.splice(0, 1);
      this.element.querySelector('.to-do-item .strike').parentNode.remove();
    }
  }

  // Save and update to-do list
  saveList(form) {
    const title = this.element.querySelector('input').value.trim();

    if (title || this.content[0]) {
      this.title = title || 'To-do List';

      this.element.querySelector('.message-header p').innerText = this.title;
      this.element.querySelector('.buttons').classList.toggle('is-centered');
      this.element.querySelector('.buttons').classList.toggle('is-right');

      toggleHideAll(form, 'input, button, a');
    } else {
      this.element.querySelector('.control input').value = '';
    }
  }
}

class Clock extends Card {
  constructor(ID, name, colour) {
    super(ID, name, colour);
    this.ends = [];
    this.play = false;
    this.timeout = false;
  }

  // Save timer value
  startTimer(form) {
    const nodeList = this.element.querySelectorAll('input');
    const timer = [];

    // Input values for [hours, minutes, seconds]
    for (let i = 0; i < nodeList.length; i++) {
      timer[i] = Number(nodeList[i].value);
    }

    // Convert timer to seconds
    const seconds = toSeconds(timer);

    if (seconds) {
      // Updates timer end
      this.ends = seconds;
      this.play = true;
      this.runTimer();

      toggleHideAll(form, 'input, .colon, button, p, a');
    }
  }

  // Timer controls
  controlTimer(icon) {
    const playPause = this.element.querySelector('.buttons a');

    if (playPause === icon) {
      // Toggle play/pause icon
      playPause.querySelector('i').classList.toggle('fa-play');
      playPause.querySelector('i').classList.toggle('fa-pause');
      this.play = !this.play;

      // Run timer when previous setTimeout is completed
      if (this.play && this.timeout) {
        this.runTimer();
      }
    } else {
      this.resetTimer();
    }
  }

  // Run timer countdown
  runTimer() {
    // Prevent script from executing if the card has been deleted
    if (this.element) {
      const remaining = this.ends;
      const display = this.element.querySelector('.time-display');

      if (remaining) {
        if (this.play) {
          const time = new Date(remaining * 1000).toISOString().substr(11, 8);
    
          display.innerHTML = time.replace(/:/g, ' : ');
          this.ends = remaining - 1;
          this.timeout = false;
    
          setTimeout(this.runTimer.bind(this), 1000);
        } else {
          this.timeout = true;
        }
      } else {
        const alert = new Audio('../sounds/timer-beep.mp3');

        // Alert animation and sound
        setTimeout(removeAnimation, 1000, this.element);
        this.element.classList.add('animated', 'shake');
        alert.play();

        this.resetTimer();
      }
    }
  }

  // Reset timer
  resetTimer () {
    const form = this.element.querySelector('.time-display').closest('form');
    const playPause = this.element.querySelector('.buttons a');

    this.play = false;
    playPause.querySelector('i').classList.remove('fa-play');
    playPause.querySelector('i').classList.add('fa-pause');
    toggleHideAll(form, 'input, .colon, button, p, a');
  }
}

// Miscellaneous Card Tools
class Misc extends Card {
  constructor(ID, name, colour) {
    super(ID, name, colour);
    this.entry = '0';
  }

  // Calculator action
  calcAction(key) {
    const last = this.entry.split(' ').splice(-1).toString();
    let solve = false;

    // Remove obsolete decimal
    if (!/[0-9]|^DEL$|\./.test(key) && /\.$/.test(last))
      this.entry = this.entry.substr(0, this.entry.length - 1);

    // Sorting calculator operations
    switch (key) {
      case 'AC':
        this.entry = '0';
        break;
      case 'DEL':
        this.entry = /[+-x÷]\s$/.test(this.entry) ? this.entry.substr(0, this.entry.length - 3) : this.entry.substr(0, this.entry.length - 1);
        this.entry = this.entry.length === 0 ? '0' : this.entry;
        break;
      case '( )': {
        // Regex check for valid operation
        if (/^0(?!\.)/.test(last))
          this.entry = `${this.entry.substr(0, this.entry.length - 1)}(`;
        else if (/[(\s-]$/.test(this.entry))
          this.entry += '('
        else {
          // Closing brackets check
          const toClose = (this.entry.match(/\(/g) || []).length - (this.entry.match(/\)/g) || []).length;

          if (toClose)
            this.entry += ')';
          else if (/[0-9).]$/.test(this.entry))
            this.entry += ' x (';
        }        
        break;
      }
      case '=':
        this.entry = this.calcDisp();
        solve = true;
        break;
      case '+':
      case '-':
      case 'x':
      case '÷':
        // Regex check for entry first zero
        if (/^0(?!\.)/.test(this.entry)) {
          if (/^-$/.test(key))
            this.entry = `(${key}`

          break;
        }
        // Regex check for valid operation
        if (/[0-9).]$/.test(this.entry))
          this.entry += ` ${key} `;

        if (/\($/.test(this.entry) && /^-$/.test(key))
          this.entry += key;

        if (/[+-x÷]\s$/.test(this.entry))
          this.entry  = `${this.entry.substr(0, this.entry.length - 3)} ${key} `;

        break;
      case '.': 
        // Regex check for valid decimal in last expression
        if (!/\./.test(last) && /[^)]$/.test(this.entry))
          this.entry += key;

        break;
      default:
        // Removes invalid leading zeros
        if (/^0(?!\.)/.test(last))
          this.entry = this.entry.substr(0, this.entry.length - 1);

        // Adds bracket multiply for clarity
        if (/\)$/.test(this.entry))
          this.entry += ' x ';

        // Limit string length
        if (last.length > 12)
          break;

        this.entry += key;
        break;
    }

    // Update calculator display
    const display = this.element.querySelector('.calc-entry');
    const preview = this.element.querySelector('.calc-preview');

    display.innerHTML = this.entry;
    preview.innerHTML = this.calcDisp(solve, true);
  }

  // Formats string expression
  calcFormat() {
    const toClose = (this.entry.match(/\(/g) || []).length - (this.entry.match(/\)/g) || []).length;
    let expression = this.entry;

    // Remove obsolete operators
    if (/[+-x÷]\s$/.test(this.entry))
      expression = expression.substr(0, expression.length - 3);

    // Close brackets and format operators
    expression += ')'.repeat(toClose);
    expression = expression.replace(/x/g, '*').replace(/÷/g, '/');

    return expression;
  }

  // Evaluates string expression
  calcEval() {
    try {
      eval(this.calcFormat()); // eslint-disable-line no-eval
      return true;
    } catch (e) {
      return false;
    }
  }

  // Returns calculator display string
  calcDisp(force, preview) {
    const expression = this.calcFormat();
    
    // Valid expression
    if (this.calcEval()) {
      if (preview) {
        if (!(expression.trim().split(' ').length < 3 || !/[0-9).]$/.test(expression)) && !(/\s$/.test(this.entry)))
          return Number(eval(expression).toFixed(10)).toString();  // eslint-disable-line no-eval

        return '&nbsp;';
      }
      return Number(eval(expression).toFixed(10)).toString(); // eslint-disable-line no-eval
    }

    // Invalid expression
    const foo = force ? 'Invalid expression' : '&nbsp;';

    return preview ? foo : expression.replace(/\*/g, 'x').replace(/\//g, '÷');
  }

  // Convert colour code
  convertColour() {
    const input = this.element.querySelector('.colour-code input');
    const output = this.element.querySelectorAll('.colour-codes input');
    const box = this.element.querySelector('.box');
    const code = input.value.trim();
    let preview = 'rgb(255, 255, 255)'

    this.codes = ['', '', ''];

    // Evaluate colour code
    if (code) {
      const rgb = toRGB(code); // eslint-disable-line no-undef

      this.codes = this.codes.fill('Invalid colour code');

      if (rgb) {
        this.codes[0] = RGBToHex(rgb); // eslint-disable-line no-undef
        this.codes[1] = rgb;
        this.codes[2] = RGBToHSL(rgb); // eslint-disable-line no-undef

        // Update preview box
        preview = rgb;
      }
    }

    // Update card
    for (let i = 0; i < this.codes.length; i++)
      output[i].value = this.codes[i];

    input.value = code;
    box.style.background = preview;
  }
}

/* ----------------------------------------
    Initialisation
---------------------------------------- */
// On Load Window Event
window.addEventListener('load', () => {
  const menu = document.querySelector('.icon-menu');
  const buttons = menu.querySelectorAll('a');
  const cards = document.querySelector('.cards');

  let cardList = new Array(10).fill(null); // eslint-disable-line prefer-const

  //  Menu bar event listeners
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', () => {
      const notesCards = ['Notepad', 'To-do List'];
      const clockCards = ['Timer'];
      let cardID = cardList.indexOf(null) + 1; // eslint-disable-line prefer-const

      // Limit the user to a maximium number of cards
      if (cardID) {
        if (notesCards.indexOf(buttons[i].getAttribute('name')) + 1)
          cardList[cardID - 1] = new Notes(cardID, buttons[i].getAttribute('name'), 0);
        else if (clockCards.indexOf(buttons[i].getAttribute('name')) + 1)
          cardList[cardID - 1] = new Clock(cardID, buttons[i].getAttribute('name'), 0);
        else
          cardList[cardID - 1] = new Misc(cardID, buttons[i].getAttribute('name'), 0);

        cardList[cardID - 1].appendCard();
        
        // Add custom event listeners
        switch(cardList[cardID - 1].name) {
          case 'To-do List':
            cardList[cardID - 1].element.addEventListener('submit', function() {
              cardList[cardID - 1].addToList();
            });
            break;
          default:
            break;
        }
      }
      else {
        console.log('Card list total has been exceeded')
      }
    });
  }

  // Card click events
  cards.addEventListener('click', e => {
    const card = e.target.closest('article');
    const cardIndex = card.id.substr(card.id.indexOf('-') + 1, card.id.length) - 1;

    // Card header actions
    if (e.target.parentNode.classList.contains('card-buttons')) {
      switch (e.target.name) {
        case 'Colour':
          cardList[cardIndex].cycleColour(card.querySelectorAll('.themed'));
          break;
        case 'Collapse':
          cardList[cardIndex].collapseCard();
          break;
        case 'Close':
          cardList[cardList[cardIndex].closeCard()] = null;
          break;
        default:
          console.log('Incorrect button name (Accepted names: "Colour", "Collapse", "Close")');
          break;
      }
    } else {

      // Card functionality
      switch (cardList[cardIndex].name) {
        case 'Notepad':
          if (e.target.name === 'Save' || e.target.tagName.toLowerCase() === 'i')
            cardList[cardIndex].saveNote(e.target.closest('form'));
          break;
        case 'To-do List':
          if (e.target.name === 'Add')
            cardList[cardIndex].addToList();
          else if (e.target.name === 'Remove')
            cardList[cardIndex].removeCheckedItems();
          else if (e.target.name === 'Save' || e.target.tagName.toLowerCase() === 'i')
            cardList[cardIndex].saveList(e.target.closest('form'));
          break;
        case 'Timer':
          if (e.target.name === 'Start')
            cardList[cardIndex].startTimer(e.target.closest('form'));
          else if (e.target.tagName.toLowerCase() === 'i')
            cardList[cardIndex].controlTimer(e.target.closest('a'));
          break;
        case 'Calculator':
          if (e.target.tagName.toLowerCase() === 'span')
            cardList[cardIndex].calcAction(e.target.innerHTML);
          break;
        case 'Colour Converter':
          if (e.target.name === 'Convert')
            cardList[cardIndex].convertColour();
          else if (e.target.name === 'Copy')
            copyToClipboard(e.target);
          break;
        default:
          console.log('No click event assigned')
          break;
      }
    }
  });

  // Checkbox event listener
  cards.addEventListener('change', (e) => {
    if (e.target.getAttribute('type') === 'checkbox') {
      const card = e.target.closest('article');
      const cardIndex = card.id.substr(card.id.indexOf('-') + 1, card.id.length) - 1;
      const label = e.target.parentNode.querySelector('label');

      // Call index number of checkbox parent div
      const i = Array.prototype.indexOf.call(e.target.parentElement.parentElement.children, e.target.parentElement) - 1;

      // Register checkbox action
      label.classList.toggle('strike');

      if (label.classList.contains('strike')) {
        cardList[cardIndex].isChecked.push(i);
        cardList[cardIndex].isChecked.sort(function(a, b){return a-b});
      } else {
        cardList[cardIndex].isChecked.splice(cardList[cardIndex].isChecked.indexOf(i), 1);
      }
    }
  });

  enableSorting();
});
