let moves = ["✊", "🖐", "✌"];
let score = 0;

let userID = localStorage.getItem("user_id");
if (userID == null) {
  userID = Math.random().toString(36).slice(-6);
  localStorage.setItem("user_id", userID);
}

(async () => {
  await statsig.initialize(
    "client-wdUXwN4xPgHevlVNQbmGAKBWIJdPDot4LXyVRf0aBGJ",
    {
      userID,
    }
  );

  const layer = statsig.getLayer("rps_experiments");
  moves = layer.get("moves", moves);

  const actions = document.getElementById("actions");

  // Dynamically add buttons to DOM
  moves.forEach((val, index) => {
    const button = document.createElement("button");
    button.textContent = val;
    button.onclick = () => onPick(index);
    button.className = "button";
    actions.appendChild(button);
  });
})();

function onPick(playerIndex) {
  const randomMove = moves[Math.floor(Math.random() * moves.length)];
  const cpuIndex = moves.indexOf(randomMove);
  const loseIndex = (playerIndex + 1) % moves.length;
  const layer = statsig.getLayer("rps_experiments");

  let result = "Won";
  if (cpuIndex === playerIndex) {
    result = "Tied";
  } else if (cpuIndex === loseIndex) {
    result = "Lost";
  } else {
    score++;
  }

  const aiName = layer.get("ai_name", "Computer");
  document.getElementById(
    "computer-move-text"
  ).innerHTML = `${aiName} picked ${randomMove}`;

  document.getElementById("result-text").innerHTML = "You " + result;

  statsig.logEvent("game_played", result.toLowerCase());

  if (layer.get("scoreboard_enabled", false)) {
    document.getElementById("scoreboard").innerHTML = "Your Score: " + score;
  }
}
