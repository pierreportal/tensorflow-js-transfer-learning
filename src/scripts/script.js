let net;

// List cameras and microphones.

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

const webcamElement = document.getElementById("webcam");
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
    const img = await webcam.capture();
    const activation = net.infer(img, true);
    classifier.addExample(activation, classId);
    img.dispose();
  };
  document.querySelector("#input-chord").addEventListener("blur", (event) => {
    const value = event.target.value;
    console.log("chord: ", value);
    chords.push(value);
  });
  document
    .getElementById("train")
    .addEventListener("click", () => addExample(chords.length - 1));
  // document
  //   .getElementById("class-b")
  //   .addEventListener("click", () => addExample(1));
  // document
  //   .getElementById("class-c")
  //   .addEventListener("click", () => addExample(2));

  while (true) {
    if (classifier.getNumClasses() > 0) {
      const img = await webcam.capture();
      const activation = net.infer(img, "conv_preds");
      const result = await classifier.predictClass(activation);
      const classes = chords;
      document.getElementById("console").innerText =
        result.confidences[result.label] === 1
          ? `
          prediction: ${classes[result.label]}\n
          probability: ${result.confidences[result.label]}
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
