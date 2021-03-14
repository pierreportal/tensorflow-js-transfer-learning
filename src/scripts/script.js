let net;
let webcam;

const webcamElement = document.getElementById("webcam");
const classifier = knnClassifier.create();

async function app() {
  console.log("Loading mobilenet..");
  net = await mobilenet.load();
  console.log("Successfully loaded model");

  const addExample = async (classId) => {
    const img = await webcam.capture();
    const activation = net.infer(img, true);
    classifier.addExample(activation, classId);
    img.dispose();
  };
  document
    .getElementById("class-a")
    .addEventListener("click", () => addExample(0));
  document
    .getElementById("class-b")
    .addEventListener("click", () => addExample(1));
  document
    .getElementById("class-c")
    .addEventListener("click", () => addExample(2));

  while (true) {
    if (classifier.getNumClasses() > 0) {
      const img = await webcam.capture();
      const activation = net.infer(img, "conv_preds");
      const result = await classifier.predictClass(activation);
      const classes = ["A", "B", "C"];
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
navigator.mediaDevices.getUserMedia(constraints).then(async function (stream) {
  console.log("stream: ", stream);
  webcamElement.srcObject = stream;
  webcam = await tf.data.webcam(webcamElement);
  app();
});

const showLearningButton = document.querySelector(".show-learning-btns");
const hideLearningButton = document.querySelector(".hide-learning-btns");
const learningConsole = document.querySelector("#console");

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
