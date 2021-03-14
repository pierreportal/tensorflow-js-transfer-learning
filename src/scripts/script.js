let net;

let chordsCounter = 0;
// document.body.requestFullscreen();

const noteNames = [
  "C",
  "C#/Db",
  "D",
  "D#/Eb",
  "E",
  "F",
  "F#/Gb",
  "G",
  "G#/Ab",
  "A",
  "A#/Bb",
  "B",
];
const oveRangeNotes = (ove) =>
  [...new Array(ove).fill(noteNames)].reduce((a, b, i) => {
    return [...a, ...b.map((x) => `${x}${i + 1}`)];
  }, []);

// List cameras and microphones.
const webcamElement = document.getElementById("webcam");
if (webcamElement) {
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      devices.forEach(function (device) {
        console.log(
          device.kind + ": " + device.label + " id = " + device.groupId
        );
      });
    })
    .catch(function (e) {
      console.log(e.name + ": " + e.message);
    });
}
const classifier = knnClassifier.create();

const chords = [];

async function app() {
  console.log("Loading mobilenet..");
  net = await mobilenet.load();
  console.log("Successfully loaded model");
  const webcam = await tf.data.webcam(webcamElement);
  const constraints = {
    video: {
      facingMode: "environment",
    },
    audio: false,
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    console.log("stream: ", stream);
    webcamElement.srcObject = stream;
  });

  const addExample = async (classId) => {
    chordsCounter = chords.length;
    const img = await webcam.capture();
    const activation = net.infer(img, true);
    classifier.addExample(activation, classId);
    img.dispose();
  };
  // document.querySelector("#input-chord").addEventListener("blur", (event) => {
  //   const value = event.target.value;
  //   console.log("chord: ", value);
  //   chords.push(value);
  // });
  document
    .getElementById("train")
    .addEventListener("click", () => addExample(chords.length - 1));

  while (true) {
    if (classifier.getNumClasses() > 0) {
      const img = await webcam.capture();
      const activation = net.infer(img, "conv_preds");
      const result = await classifier.predictClass(activation);
      const classes = chords.map((obj) =>
        Object.values(obj)
          .filter((value) => !["◀︎", "▶︎", "▼", "▲"].includes(value))
          .join(",")
      );
      document.getElementById("console").innerText =
        classes[result.label] && result.confidences[result.label] === 1
          ? `
          ${classes[result.label]}\n
        `
          : "";
      img.dispose();
    }

    await tf.nextFrame();
  }
}
const constraints = {
  video: {
    facingMode: "environment",
  },
  audio: false,
};

// Activate the webcam stream.
navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
  console.log("stream: ", stream);
  webcamElement.srcObject = stream;
});
app();

const showLearningButton = document.querySelector(".show-learning-btns");
const hideLearningButton = document.querySelector(".hide-learning-btns");
const learningConsole = document.querySelector("#console");
const learningButtons = document.querySelectorAll(".learning-btns button");

const learningBtns = document.querySelector(".learning-btns");

showLearningButton.addEventListener("click", () => {
  showLearningButton.classList.remove("in");
  showLearningButton.classList.add("out");
  //
  hideLearningButton.classList.remove("out");
  hideLearningButton.classList.add("in");
  //
  learningBtns.classList.add("slide-down");
  learningConsole.classList.add("fade-out");
});

hideLearningButton.addEventListener("click", () => {
  showLearningButton.classList.remove("out");
  showLearningButton.classList.add("in");
  //
  hideLearningButton.classList.remove("in");
  hideLearningButton.classList.add("out");
  //
  learningBtns.classList.remove("slide-down");
  learningConsole.classList.remove("fade-out");
});

const addNoteToChord = (noteInterval, note) => {
  // if (chordsCounter === chords.length)
  chords[chordsCounter]
    ? (chords[chordsCounter][noteInterval] = oveRangeNotes(2)[note])
    : chords.push({ [noteInterval]: oveRangeNotes(2)[note] });
  console.log("chords:", chords);
};

const noteSliderRoot = document.querySelector(
  ".range-slider.root .input-range"
);
const noteValueRoot = document.querySelector(".range-slider.root .range-value");
const noteSliderThird = document.querySelector(
  ".range-slider.third .input-range"
);
const noteValueThird = document.querySelector(
  ".range-slider.third .range-value"
);
const noteSliderFifth = document.querySelector(
  ".range-slider.fifth .input-range"
);
const noteValueFifth = document.querySelector(
  ".range-slider.fifth .range-value"
);
const noteSliderSeventh = document.querySelector(
  ".range-slider.seventh .input-range"
);
const noteValueSeventh = document.querySelector(
  ".range-slider.seventh .range-value"
);
noteValueRoot.innerHTML = "▲"; //oveRangeNotes(2)[noteSliderRoot.value];
noteSliderRoot.addEventListener("input", function () {
  addNoteToChord("root", this.value);
  noteValueRoot.innerHTML = oveRangeNotes(2)[this.value];
});

noteValueThird.innerHTML = "▶︎"; //oveRangeNotes(2)[noteSliderThird.value];
noteSliderThird.addEventListener("input", function () {
  addNoteToChord("third", this.value);
  noteValueThird.innerHTML = oveRangeNotes(2)[this.value];
});

noteValueFifth.innerHTML = "▼"; //oveRangeNotes(2)[noteSliderFifth.value];
noteSliderFifth.addEventListener("input", function () {
  addNoteToChord("fifth", this.value);
  noteValueFifth.innerHTML = oveRangeNotes(2)[this.value];
});

noteValueSeventh.innerHTML = "◀︎"; //oveRangeNotes(2)[noteSliderSeventh.value];
noteSliderSeventh.addEventListener("input", function () {
  addNoteToChord("seventh", this.value);
  noteValueSeventh.innerHTML = oveRangeNotes(2)[this.value];
});
