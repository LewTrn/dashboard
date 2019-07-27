/* ----------------------------------------
    Card Interactions
---------------------------------------- */
// Clones Card Templates
function cardContent(name) {
  //  Returns innerHTML based on available templates
  if (document.querySelector(`#${name.toLowerCase()}Template`)) {
    const template = document.querySelector(`#${name.toLowerCase()}Template`).cloneNode(true);
    template.removeAttribute('id');
    return template.outerHTML;
  }

  return 'No card content found';
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
    this.colourClass = function(i, primary) {
      let classes = ['is-dark', 'is-primary', 'is-info', 'is-success', 'is-warning', 'is-danger']; // eslint-disable-line prefer-const
      
      // For themes where primary is matched with dark
      classes[0] = primary ? 'is-primary' : classes[0];

      return Number.isInteger(i) ? classes[i] : classes[this.colour];
    }
  }

  // Assigns a new card object to the card list
  appendCard() {
    const template = document.querySelector('#cardTemplate').cloneNode(true);
    const cards = document.querySelector('.cards');

    // Modifying template
    template.setAttribute('id', `cardID-${this.ID}`);
    template.querySelector('.message-header p').innerHTML = this.name;
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
        console.log(this.colourClass(), 'was removed')
        console.log(foo, 'was added')

        el.classList.remove(this.colourClass(null, true));
        el.classList.add(this.colourClass(foo, true));
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
  // Save note content to object
  saveNote(action) {
    const note = this.element.querySelector('textarea').value.trim()
    
    if(note) {
      const buttons = this.element.querySelectorAll('.notepad button');

      if (action === 'Edit') {
        // Edit notepad

        buttons[0].innerHTML = 'Save';
      } else {
        // Save and update notepad
        this.content = note;

        this.element.querySelector('.notepad p').innerHTML = note;
        buttons[0].innerHTML = 'Edit';
      }

      buttons[1].classList.toggle('hide')
      this.element.querySelector('.control').toggleAttribute('hidden');
      this.element.querySelector('.notepad p').toggleAttribute('hidden');
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
      }
      else {
        console.log('Card list total has been exceeded')
      }
    });
  }

  // Card header events
  cards.addEventListener('click', e => {
    if (e.target.parentNode.classList.contains('card-buttons')) {
      const card = e.target.closest('article');
      const cardIndex = card.id.substr(card.id.indexOf('-') + 1, card.id.length) - 1;

      switch (e.target.name.toLowerCase()) {
        case 'color':
          cardList[cardIndex].cycleColour(card.querySelectorAll('.themed'));
          break;
        case 'collapse':
          cardList[cardIndex].collapseCard();
          break;
        case 'close':
          cardList[cardList[cardIndex].closeCard()] = null;
          break;
        default:
          console.log('Incorrect button name (Accepted names: "Color", "Collapse", "Close")');
          break;
      }
    }
  });

  // Card events
  cards.addEventListener('click', e => {
    const cardID = e.target.closest('article').id;
    const cardIndex = cardID.substr(cardID.indexOf('-') + 1, cardID.length) - 1;

    if (e.target.innerHTML === 'Save' || e.target.innerHTML === 'Edit') {
      cardList[cardIndex].saveNote(e.target.innerHTML);
    }
  })

  enableSorting();
});
