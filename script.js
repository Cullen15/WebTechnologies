let scene = "start";
let decisions = 0;

const headingEl = document.getElementById("sceneHeading");
const storyEl = document.getElementById("storyText");
const optionsEl = document.getElementById("optionsText");
const imgEl = document.getElementById("sceneImg");
const inputEl = document.getElementById("userInput");
const goBtn = document.getElementById("goBtn");
const hintEl = document.getElementById("hintText");
const decisionCountEl = document.getElementById("decisionCount");

// 5+ options across the story (you’ll have more than 5 total)
const scenes = {
  start: {
    heading: "Trailhead",
    text:
      "You’re hiking into the Bob Marshall outside Seeley Lake. It’s early and quiet. " +
      "Do you start on the main trail, cut to the river, check your map, set a camp plan, or head back?",
    options: ["trail", "river", "map", "camp", "back"],
    img: "imgs/trailhead.jpg",
    bg: "#0b1220"
  },
  trail: {
    heading: "Main trail",
    text:
      "You’re a few miles in. It feels remote. You hear water off to the side and the ridge looks tempting.",
    options: ["river", "ridge", "camp", "back", "end"],
    img: "imgs/ridge.jpg",
    bg: "#071524"
  },
  river: {
    heading: "River",
    text:
      "You find the river. It’s moving faster than expected. Do you cross, follow it, or head back?",
    options: ["cross", "follow", "back", "trail", "end"],
    img: "imgs/river.jpg",
    bg: "#06121f"
  },
  ridge: {
    heading: "Ridge viewpoint",
    text:
      "You climb up and the view is insane. The wind picks up. Do you shelter, push, camp, or go back?",
    options: ["shelter", "push", "camp", "back", "end"],
    img: "imgs/storm.jpg",
    bg: "#120b12"
  },
  camp: {
    heading: "Camp decision",
    text:
      "You find a solid place to chill. Do you set up, keep hiking, or end it for today?",
    options: ["setup", "trail", "back", "end", "ridge"],
    img: "imgs/cabin.jpg",
    bg: "#0f1a14"
  },
  end: {
    heading: "End",
    text: "End of story. Want to start again? Type yes or no.",
    options: ["yes", "no"],
    img: "imgs/trailhead.jpg",
    bg: "#0b1220"
  }
};

// function that RETURNS a value (required)
function cleanInput(str) {
  return str.trim().toLowerCase();
}

// function with parameters (required)
function setScene(key) {
  const s = scenes[key];
  scene = key;

  headingEl.textContent = s.heading;
  storyEl.textContent = s.text;
  optionsEl.textContent = s.options.join(" / ");
  imgEl.src = s.img;

  // Update styles from JS (required)
  document.body.style.background = s.bg;

  hintEl.textContent = "";
  inputEl.value = "";
  inputEl.focus();
}

// loop requirement (while)
function isValidChoice(choice, list) {
  let i = 0;
  while (i < list.length) {
    if (choice === list[i]) return true;
    i++;
  }
  return false;
}

function handleChoice(raw) {
  const choice = cleanInput(raw);

  // track decisions (DOM update)
  decisions = decisions + 1;
  decisionCountEl.textContent = decisions;

  // end scene restart question (if/else requirement)
  if (scene === "end") {
    if (choice === "yes") {
      decisions = 0;
      decisionCountEl.textContent = decisions;
      setScene("start");
      return;
    } else if (choice === "no") {
      hintEl.textContent = "All good. Refresh anytime to play again.";
      optionsEl.textContent = "";
      return;
    } else {
      decisions = decisions - 1;
      decisionCountEl.textContent = decisions;
      hintEl.textContent = "Type 'yes' or 'no'.";
      return;
    }
  }

  const valid = isValidChoice(choice, scenes[scene].options);
  if (!valid) {
    decisions = decisions - 1;
    decisionCountEl.textContent = decisions;
    hintEl.textContent = "Not an option. Try: " + scenes[scene].options.join(", ");
    return;
  }

  // switch requirement
  switch (choice) {
    case "trail":
    case "river":
    case "ridge":
    case "camp":
    case "end":
      setScene(choice);
      break;

    case "map":
      hintEl.textContent = "You check the map and feel better. You stay on the main trail.";
      setScene("trail");
      break;

    case "back":
      setScene("start");
      break;

    case "cross":
      hintEl.textContent = "You cross carefully. It works, but it’s sketchy. You call it there.";
      setScene("end");
      break;

    case "follow":
      hintEl.textContent = "You follow the river and find a calmer spot. Smart.";
      setScene("camp");
      break;

    case "shelter":
      hintEl.textContent = "You find shelter and wait it out. Good call.";
      setScene("end");
      break;

    case "push":
      hintEl.textContent = "You push anyway and it gets rough. You make it out, but it wasn’t worth it.";
      setScene("end");
      break;

    case "setup":
      hintEl.textContent = "You set up camp, eat, and chill. Honestly perfect.";
      setScene("end");
      break;

    default:
      hintEl.textContent = "Something went wrong. Try again.";
      decisions = decisions - 1;
      decisionCountEl.textContent = decisions;
  }
}

goBtn.addEventListener("click", () => handleChoice(inputEl.value));
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleChoice(inputEl.value);
});

// start
setScene("start");