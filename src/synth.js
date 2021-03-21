const now = Tone.now();
// const btn = document.querySelector(".play");

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
// const reverb = new Tone.JCReverb(0.3);
// const delay = new Tone.FeedbackDelay(0.5);
// const chorus = new Tone.Chorus(8, 4, 1);

const poly = {
  0: new Tone.Synth(configs).chain(gain),
  1: new Tone.Synth(configs).chain(gain),
  2: new Tone.Synth(configs).chain(gain),
  3: new Tone.Synth(configs).chain(gain),
};

// createButton("classb", "B", testFuncA);
// createButton("classc", "C", testFuncA);

let playingChord = [];
let trainingStep = 0;
const activate = (touch) => {
  trainFeedback.style.top = 100 + "%";
  chordIndex = Object.keys(chordsMapping).length;
  trainingStep = 0;
  //   addChordToGalery(chordsMapping);
  touchActivationMap[touch] = !touchActivationMap[touch];
  if (touchActivationMap[touch] && playingChord.length < 4) {
    document.querySelector(`.${touch}`).classList.add("activated");
    playingChord = [...playingChord, touch];
  } else {
    document.querySelector(`.${touch}`).classList.remove("activated");
    playingChord = playingChord.filter((t) => t !== touch);
    if (!playingChord.length) trainButtonContainer.classList.add("disabled");
  }
  if (playingChord.length) trainButtonContainer.classList.remove("disabled");

  Object.values(poly).forEach((synth) => synth.triggerRelease());
  if (playingChord.length) {
    playChord(playingChord);
  }
};

const keyNote = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

let autoPLay = true;
const playChord = (chord) => {
  console.log("chord: ", chord);
  if (autoPLay) {
    const C = chord.map((note) =>
      note
        .replace("t", "")
        .split("-")
        .map((x, i) => {
          return i === 0 ? keyNote[x] : +x + 2;
        })
        .join("")
    );
    C.map((note, i) => poly[i].triggerAttack(note));
  }
};

stopButton.addEventListener("click", function () {
  autoPLay = !autoPLay;
  if (!autoPLay) {
    Object.values(poly).forEach((synth) => synth.triggerRelease());
    // this.innerHTML = "play";
    this.classList.remove("play-yellow");
    console.log("this.classList: ", this.classList);
  } else {
    if (playingChord.length) {
      playChord(playingChord);
      // this.innerHTML = "stop";
      this.classList.add("play-yellow");
    }
  }
});
