const now = Tone.now();

const btn = document.querySelector(".play");

const chordPlayed = ["C4", "E4", "G4", "B4"];

const configs = {
  oscillator: { type: "sine" },
  envelope: {
    attack: 0.2,
    decay: 0,
    sustain: 0.3,
    release: 1,
  },
};

const gain = new Tone.Gain(1 / chordPlayed.length).toDestination();

const poly = {
  0: new Tone.Synth(configs).connect(gain),
  1: new Tone.Synth(configs).connect(gain),
  2: new Tone.Synth(configs).connect(gain),
  3: new Tone.Synth(configs).connect(gain),
};

let net;
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

async function app() {
  net = await mobilenet.load();
  const webcam = await tf.data.webcam(webcamElement);
  const constraints = {
    video: {
      facingMode: "environment",
    },
    audio: false,
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    webcamElement.srcObject = stream;
  });

  let detectedChord = "";

  const changeDetectedChord = (chord) => {
    setTimeout(() => {
      // if (!detectedChord) return;
      if (detectedChord !== chord) {
        Object.values(poly).forEach((synth) => synth.triggerRelease());
        // synth.triggerRelease(
        //   detectedChord.split(",").map((x) => x.split("/")[0]),
        //   now + 0.3
        // );
        const toneChord = chord.split(",").map((x) => x.split("/")[0]);

        console.log("toneChord: ", toneChord);
        Object.values(poly).forEach((synth) => synth.triggerRelease());

        toneChord.map((note, i) => poly[i].triggerAttack(note));

        // synth.triggerAttack(toneChord, now + 0.5);
      }
    }, 300);
  };

  const addExample = async (classId) => {
    chordsCounter = chords.length;
    const img = await webcam.capture();
    const activation = net.infer(img, true);
    classifier.addExample(activation, classId);
    img.dispose();
    // trigger the attack immediately
    // const feedBack = document.querySelector(".train-button-feedback");
    // feedBack.style.top = "50%";
  };
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
      if (classes[result.label] && result.confidences[result.label] === 1) {
        document.getElementById("console").innerText = classes[result.label];
        changeDetectedChord(classes[result.label]);
        detectedChord = classes[result.label];
      } else {
        document.getElementById("console").innerText = "";
        Object.values(poly).forEach((synth) => synth.triggerRelease());

        // synth.triggerRelease(
        //   classes[result.label].split(",").map((x) => x.split("/")[0]),
        //   now + 0.3
        // );
      }

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
  webcamElement.srcObject = stream;
});
app();

/**
 * 
const now = Tone.now();

const btn = document.querySelector('.play');

const chordPlayed = ["C4","E4","G4","B4"];

const configs = 
      {oscillator: { type: "sine" },
        envelope: {
          attack: 0.2,
          decay: 0,
          sustain: 0.3,
          release: 1
        }
      }

const gain = new Tone.Gain(1/chordPlayed.length).toDestination();

const poly = {
  0:  new Tone.Synth(configs).connect(gain),
  1:  new Tone.Synth(configs).connect(gain),
  2:  new Tone.Synth(configs).connect(gain),
  3:  new Tone.Synth(configs).connect(gain),
}

const playChord = () => {
  chordPlayed.map((note, i) => poly[i].triggerAttack(note))
}
const stopChord = () => {
  Object.values(poly).forEach(synth =>synth.triggerRelease())
}

btn.addEventListener('mousedown', playChord)
btn.addEventListener('mouseup', stopChord)

 */
