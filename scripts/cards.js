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
    if (el.tagName.toLowerCase() === 'button' || el.tagName.toLowerCase() === 'input') {
      el.classList.toggle('hide');
    } else {
      el.toggleAttribute('hidden');
    }
  });
}

// Enable Card Sorting
function enableSorting() {
  const el = document.querySelector('.cards');

  // Sortable system
  const sortable = Sortable.create(el, { // eslint-disable-line
    animation: 300,
    emptyInsertThreshold: 30,
    scroll: true,
    scrollSensitivity: 50,
    bubbleScroll: true,
    handle: '.message-header',
  });
}

// Remove Animation
function removeAnimation(article) {
  article.classList.remove('animated');
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
      let classes = ['is-dark', 'is-primary', 'is-info', 'is-success', 'is-warning', 'is-danger'];
      
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

    foo = foo > 4 ? 0 : foo + 1;
    this.element.classList.remove(this.colourClass());
    this.element.classList.add(this.colourClass(foo));

    if (nodeList) {
      nodeList.forEach((el) => {
        const isAnchor = el.tagName === 'A';

        el.classList.remove(this.colourClass(null, true, isAnchor));
        el.classList.add(this.colourClass(foo, true, isAnchor));
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
    return this.ID - 1;
  }
}

class SavedContent extends Card {
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

      toggleHideAll(form, '.control, p, button, a');
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
      
      template.removeAttribute('id');
      input.id = `item-${this.ID}-${this.content.length}`;
      label.setAttribute('for', `item-${this.ID}-${this.content.length}`);
      label.innerText = message;
      this.element.querySelector('.control').insertBefore(template, item.closest('.to-do-add'));
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

      toggleHideAll(form, 'input, button, a');
    }
  }
}

/* ----------------------------------------
    Initialisation
---------------------------------------- */
// On Load Window Event
window.addEventListener('load', () => {
  const menu = document.querySelector('.icon-menu');
  const buttons = menu.querySelectorAll('a:not(.dropdown-trigger)');
  const cards = document.querySelector('.cards');

  let cardList = new Array(10).fill(null); // eslint-disable-line prefer-const

  //  Menu bar event listeners
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', () => {
      const savedCards = ['Notepad', 'To-do List'];
      let cardID = cardList.indexOf(null) + 1; // eslint-disable-line prefer-const

      // Limit the user to a maximium number of cards
      if (cardID) {
        if (savedCards.indexOf(buttons[i].getAttribute('name')) + 1) {
          cardList[cardID - 1] = new SavedContent(cardID, buttons[i].getAttribute('name'), 0, null);
        } else {
          cardList[cardID - 1] = new Card(cardID, buttons[i].getAttribute('name'), 0);
        }
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
        case 'Color':
          cardList[cardIndex].cycleColour(card.querySelectorAll('.themed'));
          break;
        case 'Collapse':
          cardList[cardIndex].collapseCard();
          break;
        case 'Close':
          cardList[cardList[cardIndex].closeCard()] = null;
          break;
        default:
          console.log('Incorrect button name (Accepted names: "Color", "Collapse", "Close")');
          break;
      }
    } else {

      // Card functionality
      switch (cardList[cardIndex].name) {
        case 'Notepad':
          if (e.target.name === 'Save' || e.target.tagName.toLowerCase() === 'i') {
            cardList[cardIndex].saveNote(e.target.closest('form'));
          }
          break;
        case 'To-do List':
          if (e.target.name === 'Add') {
            cardList[cardIndex].addToList();
          } else if (e.target.name === 'Remove') {
            cardList[cardIndex].removeCheckedItems();
          } else if (e.target.name === 'Save' || e.target.tagName.toLowerCase() === 'i') {
            cardList[cardIndex].saveList(e.target.closest('form'));
          }
          break;
        default:
          console.log('Incorrect card object name')
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
