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

// Collapse Card
function collapseCard() {
  const card = document.querySelector('.dummy');
  const header = document.querySelector('.otherDummy');

  card.toggleAttribute('hidden');
  header.classList.toggle('round-header');
}

// On Load Window Event
window.addEventListener('load', () => {
  const buttons = document.querySelector('.board .buttons');
  const collapse = document.querySelector('.collapse');

  // collapse.addEventListener('click', collapseCard, false);

  enableSorting();
});
