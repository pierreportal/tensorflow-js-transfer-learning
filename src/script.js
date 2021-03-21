// training
const classifier = knnClassifier.create();

let trainingInterval;

let isTraining = false;
let chordIndex = 0;

const chordsMapping = {};

// const keepTraining = () => {
//   trainingInterval = setInterval(() => {
//     if (trainingStep < 10) {
//       trainingStep += 1;
//       isTraining = true;
//       trainStep(trainingStep);
//     }
//     if (trainingStep === 10 && isTraining) {
//       chordsMapping[chordIndex] = playingChord.join(",");
//       addChordToGalery(playingChord.join(","));
//       isTraining = false;
//     }
//   }, 800);
// };

// const stopTraining = () => {
//   clearInterval(trainingInterval);
//   isTraining = false;
// };
// trainButton.addEventListener("mousedown", keepTraining);
// trainButton.addEventListener("mouseup", stopTraining);

// const trainStep = (n) => {
//   trainFeedback.style.top = 100 - n * 10 + "%";
// };

// galery
const addChordToGalery = (chord) => {
  chordGallery.innerHTML =
    chordGallery.innerHTML +
    `<div class="chord gallery-chord-${chordIndex + 1}" notes="${chord}">${
      chordIndex + 1
    }</div>`;
  attachCallbacks();
};

const attachCallbacks = () => {
  document.querySelectorAll(`.chord-gallery > .chord`).forEach((chord) => {
    chord.addEventListener("click", function () {
      const notes = this.getAttribute("notes").split(",");
      Object.keys(touchActivationMap).forEach((key) => {
        touchActivationMap[key] = false;
      });
      notes.forEach((note) => (touchActivationMap[note] = true));
      touchOve.forEach((touch) => {
        const noteOnTouch = touch.classList[1];
        if (
          notes.includes(noteOnTouch) &&
          !touch.classList.contains("activated")
        ) {
          touch.classList.add("activated");
        } else {
          touch.classList.remove("activated");
        }
      });
    });
  });
};
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

async function app() {
  net = await mobilenet.load();
  const webcam = await tf.data.webcam(webcamElement);

  initCamera();

  // train
  const addExample = async (classId) => {
    // chordsCounter = chords.length;
    const img = await webcam.capture();
    const activation = net.infer(img, true);
    classifier.addExample(activation, classId);
    img.dispose();
  };

  //   document
  //     .getElementById("train")
  //     .addEventListener("click", () => addExample(chords.length - 1));

  //
  //
  //
  const keepTraining = () => {
    trainingInterval = setInterval(() => {
      if (trainingStep < 10) {
        trainingStep += 1;
        isTraining = true;
        trainStep(trainingStep);
      }
      if (trainingStep === 10 && isTraining) {
        chordsMapping[chordIndex] = playingChord.join(",");
        addChordToGalery(playingChord.join(","));
        isTraining = false;
      }
    }, 800);
  };

  const stopTraining = () => {
    clearInterval(trainingInterval);
    isTraining = false;
  };
  trainButton.addEventListener("touchstart", keepTraining);
  trainButton.addEventListener("touchend", stopTraining);

  const trainStep = (n) => {
    trainFeedback.style.top = 100 - n * 10 + "%";
    addExample(chordIndex);
  };
  //
  //
  //

  // detect
  let ones = [];

  while (true) {
    if (classifier.getNumClasses() > 0) {
      const img = await webcam.capture();
      const activation = net.infer(img, "conv_preds");
      const result = await classifier.predictClass(activation);
      //   const classes = chords.map((obj) =>
      //     Object.values(obj)
      //       .filter((value) => !!value.length)
      //       .join(",")
      //   );
      const classes = Object.values(chordsMapping);
      //   console.log("classes: ", classes);

      if (classes[result.label] && result.confidences[result.label] === 1) {
        ones.push(1);
        if (ones.length === 10) {
          // consoleMonitor.innerHTML = +result.label + 1;

          consoleTxt.innerHTML = +result.label + 1;
          consoleTxtEffect.innerHTML = +result.label + 1;

          console.log("DETECT:", classes[result.label]);
          // document.getElementById("console").innerText = ":)";
          // changeDetectedChord(classes[result.label]);
          playChord(classes[result.label].split(","));
        }
      } else {
        ones = [];
        consoleTxt.innerHTML = "";
        consoleTxtEffect.innerHTML = "";
        //   document.getElementById("console").innerText = "";
        Object.values(poly).forEach((synth) => synth.triggerRelease());
      }
      img.dispose();
    }

    await tf.nextFrame();
  }
}
app();
