// Bob Marshall Choose Your Own Adventure
let risk = 0;    // variable + addition
let scene = 0;   // variable

// DOM elements
const story = document.getElementById("storyText");
const heading = document.getElementById("sceneHeading");
const img = document.getElementById("sceneImg");
const choices = document.getElementById("choices");
const riskValue = document.getElementById("riskValue");
const restartBtn = document.getElementById("restartBtn");

// Function: build the choice buttons (DOM updates)
function setChoices(choiceList) {
  choices.innerHTML = "";

  // Ending state (no choices)
  if (choiceList.length === 0) {
    const endMsg = document.createElement("p");
    endMsg.textContent = "End of story. Hit Restart to try a different route.";
    endMsg.style.color = "rgba(234,240,255,0.85)";
    choices.appendChild(endMsg);
    return;
  }

  // Create buttons for each choice
  choiceList.forEach((item, i) => {
    const btn = document.createElement("button");
    btn.className = "choice";

    // concatenation
    btn.textContent = (i + 1) + ". " + item[0];

    btn.addEventListener("click", item[1]);
    choices.appendChild(btn);
  });
}

// Function: update the page (DOM updates happen here)
function render() {
  // Update risk display (DOM update)
  riskValue.textContent = risk;

  // Bonus if statements: change risk color based on risk level
  if (risk >= 7) {
    riskValue.style.color = "var(--danger)";
  } else {
    riskValue.style.color = "var(--accent)";
  }

  // Story branching with if statements (required)
  if (scene === 0) {
    heading.textContent = "Trailhead";
    story.textContent =
      "You’re hiking into the Bob Marshall outside Seeley Lake. It’s quiet and feels remote. " +
      "The trail looks good, but weather can change fast. What’s your move?";
    img.src = "imgs/trailhead.jpg";

    setChoices([
      ["Take the main trail and keep a steady pace.", () => { risk = risk + 1; scene = 1; render(); }],
      ["Cut toward the river to find a better view.", () => { risk = risk + 2; scene = 2; render(); }],
      ["Wait a bit and check the sky + map first.", () => { risk = risk + 0; scene = 3; render(); }]
    ]);

  } else if (scene === 1) {
    heading.textContent = "Deep on the trail";
    story.textContent =
      "You’re a few miles in and it’s unreal out here. The farther you go the more it feels like you’re alone. " +
      "You hear water somewhere nearby.";
    img.src = "imgs/ridge.jpg";

    setChoices([
      ["Keep going toward a ridge viewpoint.", () => { risk = risk + 2; scene = 4; render(); }],
      ["Head toward the water sound.", () => { risk = risk + 1; scene = 2; render(); }],
      ["Turn around and keep it safe today.", () => { scene = 6; render(); }]
    ]);

  } else if (scene === 2) {
    heading.textContent = "River crossing";
    story.textContent =
      "You find the river. It’s moving faster than you expected. Crossing could save time and get you a sick view. " +
      "But it could also be a bad call if you slip.";
    img.src = "imgs/river.jpg";

    setChoices([
      ["Cross carefully and commit.", () => { risk = risk + 3; scene = 5; render(); }],
      ["Follow the river until you find a safer crossing.", () => { risk = risk + 1; scene = 4; render(); }],
      ["Don’t cross. Go back to the main trail.", () => { risk = risk + 0; scene = 1; render(); }]
    ]);

  } else if (scene === 3) {
    heading.textContent = "Quick check";
    story.textContent =
      "You take a minute to check your map and watch the sky. Clouds are building a little. " +
      "You feel better having a plan, but you still have to choose.";
    img.src = "imgs/trailhead.jpg";

    setChoices([
      ["Stay conservative and take the main trail.", () => { risk = risk + 1; scene = 1; render(); }],
      ["Go for the river view anyway.", () => { risk = risk + 2; scene = 2; render(); }],
      ["Bail today and come back with a friend.", () => { scene = 6; render(); }]
    ]);

  } else if (scene === 4) {
    heading.textContent = "Ridge viewpoint";
    story.textContent =
      "You make it to a ridge and the view is insane. You’re stoked you came. " +
      "But the wind picks up and you feel the weather shifting.";
    img.src = "imgs/ridge.jpg";

    setChoices([
      ["Push farther for one more viewpoint.", () => { risk = risk + 2; scene = 7; render(); }],
      ["Head down toward a sheltered area.", () => { risk = risk + 1; scene = 8; render(); }],
      ["Turn back now while it still feels good.", () => { scene = 6; render(); }]
    ]);

  } else if (scene === 5) {
    heading.textContent = "Committed crossing";
    // concatenation: text + risk score
    story.textContent =
      "You crossed and it worked, but it was sketchier than you wanted. " +
      "Risk score: " + risk + ". You got the view, but you’re thinking about the way back.";
    img.src = "imgs/storm.jpg";

    setChoices([]); // ending

  } else if (scene === 7) {
    heading.textContent = "Weather turns";
    story.textContent =
      "The weather shifts fast. The sky gets dark and you realize this is the Bob. It can get real quick. " +
      "You need to make a decision right now.";
    img.src = "imgs/storm.jpg";

    setChoices([
      ["Move fast back toward the trailhead.", () => { risk = risk + 1; scene = 6; render(); }],
      ["Find shelter and wait it out.", () => { risk = risk + 1; scene = 8; render(); }],
      ["Keep pushing because you’re close.", () => { risk = risk + 3; scene = 9; render(); }]
    ]);

  } else if (scene === 8) {
    heading.textContent = "Shelter";
    story.textContent =
      "You find a sheltered spot and take a breath. It’s calmer here and you feel like you made a solid call. " +
      "Sometimes the best move is just not forcing it.";
    img.src = "imgs/cabin.jpg";

    setChoices([]); // ending

  } else if (scene === 9) {
    heading.textContent = "Sketchy ending";
    story.textContent =
      "You push farther and the storm hits hard. You make it out, but it wasn’t worth it. " +
      "That’s the type of lesson you only want once.";
    img.src = "imgs/storm.jpg";

    setChoices([]); // ending

  } else {
    heading.textContent = "Good call";
    story.textContent =
      "You head back safe and still stoked. You got a solid day out there and didn’t force it. " +
      "That’s a win.";
    img.src = "imgs/trailhead.jpg";

    setChoices([]); // ending
  }
}

// Restart button
restartBtn.addEventListener("click", () => {
  risk = 0;
  scene = 0;
  render();
});

// Start story
render();