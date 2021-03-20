let chordsCounter = 0;

let nExample = 0;

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
    return [...a, ...b.map((x) => `${x.split("/").join(`${i + 3}/`)}${i + 3}`)];
  }, []);

const chords = [];

const addNoteToChord = (noteInterval, note) => {
  // console.log("chords.lengt: ", chords.lengt);
  // console.log("chordsCounter: ", chordsCounter);
  // if (chordsCounter !== chords.length)
  document.querySelector(".train-button-feedback").style.top = 100 + "%";
  document.querySelector(".train-button-feedback").style.backgroundColor =
    "aquamarine";
  nExample = 0;
  // if (chordsCounter === chords.length)
  chords[chordsCounter]
    ? (chords[chordsCounter][noteInterval] = oveRangeNotes(2)[note])
    : chords.push({ [noteInterval]: oveRangeNotes(2)[note] });
  //   console.log("chords:", chords);
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
noteValueRoot.innerHTML = ""; //oveRangeNotes(2)[noteSliderRoot.value];
noteSliderRoot.addEventListener("input", function () {
  addNoteToChord("root", this.value);
  noteValueRoot.innerHTML = oveRangeNotes(2)[this.value];
});

noteValueThird.innerHTML = ""; //oveRangeNotes(2)[noteSliderThird.value];
noteSliderThird.addEventListener("input", function () {
  addNoteToChord("third", this.value);
  noteValueThird.innerHTML = oveRangeNotes(2)[this.value];
});

noteValueFifth.innerHTML = ""; //oveRangeNotes(2)[noteSliderFifth.value];
noteSliderFifth.addEventListener("input", function () {
  addNoteToChord("fifth", this.value);
  noteValueFifth.innerHTML = oveRangeNotes(2)[this.value];
});

noteValueSeventh.innerHTML = ""; //oveRangeNotes(2)[noteSliderSeventh.value];
noteSliderSeventh.addEventListener("input", function () {
  addNoteToChord("seventh", this.value);
  noteValueSeventh.innerHTML = oveRangeNotes(2)[this.value];
});
