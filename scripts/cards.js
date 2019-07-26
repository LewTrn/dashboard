/* ----------------------------------------
    Card Objects
---------------------------------------- */
class Card {
  constructor(name) {
    this.name = name;
  }

  static appendCard(name, type) {
    const card = document.querySelector('#cardTemplate').cloneNode(true);
    const cards = document.querySelector('.cards');

    // Modifying template
    card.removeAttribute('id');
    card.querySelector('.message-header p').innerHTML = name;

    // Place node after focus banner
    cards.prepend(card);

    // Remove animate.css classes after fade in
    setTimeout(function() {
      cards.firstChild.classList.remove('animated');
      cards.firstChild.classList.remove('fadeInLeft');
    }, 1000);
  }
}

/* ----------------------------------------
    Card Interactions
---------------------------------------- */
// Enable Card Sorting
function enableSorting() {
  const el = document.querySelector('.cards');

  // Sortable system
  const sortable = Sortable.create(el, {
    animation: 300,
    emptyInsertThreshold: 30,
    scroll: true,
    scrollSensitivity: 50,
    bubbleScroll: true,
  });
}

// Cycle Card Colour
function cycleColour(parent) {
  const colours = [
    'is-dark',
    'is-primary',
    'is-info',
    'is-success',
    'is-warning',
    'is-danger',
  ];

  // Fetch colour index and reset
  let colourIndex = parseInt(parent.parentNode.getAttribute('data-colour'));
  parent.parentNode.classList.remove(colours[colourIndex]);

  // Cycle colour
  colourIndex < colours.length - 1 ? colourIndex++ : (colourIndex = 0);
  parent.parentNode.setAttribute('data-colour', colourIndex);
  parent.parentNode.classList.add(colours[colourIndex]);
}

// Collapse Card
function collapseCard(parent) {
  parent.nextElementSibling.toggleAttribute('hidden');

  // Toggle header style
  parent.querySelector('.fa-angle-up').classList.toggle('btn-rotate');
  parent.classList.toggle('round-header');
}

// Close Card
function closeCard(parent) {
  parent.parentNode.remove();
}

// On Load Window Event
window.addEventListener('load', () => {
  const menu = document.querySelector('.icon-menu');
  const buttons = menu.querySelectorAll('a:not(.dropdown-trigger)');
  const cards = document.querySelector('.cards');
  // const cardList = [];

  //  Menu bar event listeners
  /* eslint-disable prettier/prettier */
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', () => {
      // cardList.unshift(new Card(buttons[i].getAttribute('name')));

      Card.appendCard(buttons[i].getAttribute('name'), i);
    });
  } /* eslint-enable prettier/prettier */

  cards.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
      switch (e.target.name) {
        case 'Color':
          cycleColour(e.target.parentNode.parentNode);
          break;
        case 'Collapse':
          collapseCard(e.target.parentNode.parentNode);
          break;
        case 'Close':
          closeCard(e.target.parentNode.parentNode);
          break;
        default:
          console.log('Incorrect button name');
          break;
      }
    }
  });

  enableSorting();
});
