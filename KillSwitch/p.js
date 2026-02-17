const b = document.getElementById("btn");

// Update Button UI based on state (true = Blocked, false = Allowed)
const updateUI = (isBlocked) => {
  if (isBlocked) {
    b.textContent = "BLOCKED";
    b.className = "on";
  } else {
    b.textContent = "ALLOWED";
    b.className = "off";
  }
};

// 1. Get status immediately when popup opens
chrome.runtime.sendMessage("status", (response) => {
  updateUI(response);
});

// 2. Toggle on click
b.onclick = () => {
  chrome.runtime.sendMessage("toggle", (response) => {
    updateUI(response);
  });
};