// DOM Elements
const welcomeMsg = document.querySelector('.welcome-prefix');

// Update Welcome Message
function updateWelcome() {
  let now = new Date(),
    hour = now.getHours();

  if (hour < 12) {
    // Morning
    welcomeMsg.innerHTML = "Good morning";
  } else if (hour < 18) {
    // Afternoon
    welcomeMsg.innerHTML = "Good afternoon";
  } else {
    // Evening
    welcomeMsg.innerHTML ="Good evening";
  }

  setTimeout(updateWelcome, 1000);
}
updateWelcome();