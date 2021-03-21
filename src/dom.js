const container = document.querySelector(".container");
const stopButton = document.querySelector(".stop-button");
const doneButton = document.querySelector(".done-button");
const trainButton = document.querySelector(".train-button");
const trainFeedback = document.querySelector(".train-feedback");
const trainButtonContainer = document.querySelector(".train-button-container");
const vLine = document.querySelector(".v-line");
const hLine = document.querySelector(".h-line");
const chordGallery = document.querySelector(".chord-gallery");
const consoleMonitor = document.querySelector(".console");

const consoleTxt = document.querySelector(".console-txt");
const consoleTxtEffect = document.querySelector(".console-txt-effect");

// create dynamic dom buttons
let testButtons;
const buttonsMapping = {};

const createButton = (id, label, func) => {
  const btn = `<button class="testing-btn ${id}">${label}</button>`;
  container.innerHTML = container.innerHTML + btn;
  buttonsMapping[id] = func;
  remap();
};
const remap = () => {
  testButtons = document.querySelectorAll(".testing-btn");
  if (testButtons.length) {
    testButtons.forEach((button) => {
      button.addEventListener("mousedown", function () {
        buttonsMapping[this.classList[1]]();
      });
      button.addEventListener("mouseup", function () {
        Object.values(poly).forEach((synth) => synth.triggerRelease());
      });
    });
  }
};
//

// keyboard
const blackIndexes = [1, 3, 6, 8, 10];
const oveRange = 1;

const isBlack = (i) => {
  const k = [...new Array(oveRange)]
    .map((_, i) => blackIndexes.map((x) => x + 12 * i))
    .reduce((a, b) => [...a, ...b]);
  return k.includes(i);
};

container.innerHTML = [...new Array(12 * oveRange)]
  .map(
    (_, i) =>
      `<div class="cell-touch ${isBlack(i) ? "black-key" : ""} row">
        <div class="touch-ove t${i}-${~~(i / 12) + 1}"></div>
        <div class="touch-ove t${i}-${~~(i / 12) + 2}"></div>
        <div class="touch-ove t${i}-${~~(i / 12) + 3}"></div>
        <div class="touch-ove t${i}-${~~(i / 12) + 4}"></div>
    </div>`
  )
  .reverse()
  .join("");

const touchActivationMap = {};
const touchOve = document.querySelectorAll(".touch-ove");
touchOve.forEach((touch) => {
  touchActivationMap[touch.classList[1]] = false;
  touch.addEventListener("click", function () {
    activate(touch.classList[1]);
  });
});

doneButton.addEventListener("click", () => {
  if (container.classList.contains("hidden")) {
    container.classList.remove("hidden");
    trainButtonContainer.classList.remove("hidden");
    vLine.classList.add("hide");
    hLine.classList.remove("hide");
    consoleMonitor.classList.add("hidden");
    autoPLay = false;
    stopButton.classList.remove("play-yellow");
    // this.classList.add("play-yellow");

    // stopButton.innerHTML = "play";
  } else {
    Object.values(poly).forEach((synth) => synth.triggerRelease());
    container.classList.add("hidden");
    trainButtonContainer.classList.add("hidden");
    vLine.classList.remove("hide");
    hLine.classList.add("hide");
    consoleMonitor.classList.remove("hidden");
    autoPLay = true;
    // stopButton.innerHTML = "stop";
    stopButton.classList.remove("play-yellow");
  }
});
