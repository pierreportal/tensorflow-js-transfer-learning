const now = Tone.now();

const btn = document.querySelector(".play");

const configs = {
  oscillator: { type: "sine" },
  envelope: {
    attack: 0.2,
    decay: 0,
    sustain: 0.3,
    release: 1,
  },
};

const gain = new Tone.Gain(1 / 4).toDestination();

const poly = {
  0: new Tone.Synth(configs).connect(gain),
  1: new Tone.Synth(configs).connect(gain),
  2: new Tone.Synth(configs).connect(gain),
  3: new Tone.Synth(configs).connect(gain),
};

let net;
const webcamElement = document.getElementById("webcam");

const playChordButton = document.querySelector(".play-chord-button");

playChordButton.addEventListener("mousedown", () => {
  const playingChord = chords.map((obj) =>
    Object.values(obj)
      .filter((value) => !!value.length)
      .join(",")
  )[chords.length - 1];
  if (!playingChord) return;
  const toneChord = playingChord.split(",").map((x) => x.split("/")[0]);
  toneChord.map((note, i) => poly[i].triggerAttackRelease(note, "2"));
});

if (webcamElement) {
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      devices.forEach(function (device) {
        // console.log(
        //   device.kind + ": " + device.label + " id = " + device.groupId
        // );
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

  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    webcamElement.srcObject = stream;
  });

  const changeDetectedChord = (chord) => {
    if (detectedChord) {
      const toneChord = chord.split(",").map((x) => x.split("/")[0]);
      Object.values(poly).forEach((synth) => synth.triggerRelease());
      toneChord.map((note, i) => poly[i].triggerAttack(note));
    }
  };

  const addExample = async (classId) => {
    if (classId === -1) return;
    chordsCounter = chords.length;
    const img = await webcam.capture();
    const activation = net.infer(img, true);
    classifier.addExample(activation, classId);
    img.dispose();
    nExample += 1;
    document.querySelector(".train-button-feedback").style.top =
      Math.max(0, 100 - nExample * 10) + "%";
    if (nExample === 10) {
      document.querySelector(".train-button-feedback").style.backgroundColor =
        "violet";
    }
  };
  document
    .getElementById("train")
    .addEventListener("click", () => addExample(chords.length - 1));
  let ones = [];
  while (true) {
    if (classifier.getNumClasses() > 0) {
      const img = await webcam.capture();
      const activation = net.infer(img, "conv_preds");
      const result = await classifier.predictClass(activation);
      const classes = chords.map((obj) =>
        Object.values(obj)
          .filter((value) => !!value.length)
          .join(",")
      );

      if (classes[result.label] && result.confidences[result.label] === 1) {
        ones.push(1);
        if (ones.length === 10) {
          document.getElementById("console").innerText = ":)";
          changeDetectedChord(classes[result.label]);
        }
      } else {
        ones = [];
        document.getElementById("console").innerText = "";
        Object.values(poly).forEach((synth) => synth.triggerRelease());
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
