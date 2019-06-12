if (!("webkitSpeechRecognition" in window)) {
  alert(
    "Speech recognition API niet gevonden, gelieve Google Chrome te gebruiken"
  );
}
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = "nl";
let p = document.createElement("p");
const $wordsContainer = document.querySelector(".words--container");
const words = document.querySelector(".words");
words.appendChild(p);

const $title = document.querySelector(`.title`);
const $sub = document.querySelector(`.subtext`);

const funcDelay = 500;

const resetContainer = () => {
  $wordsContainer.classList.add("hide");
  p.textContent = "";
};

const detectComfy = () => {
  recognition.addEventListener("result", e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join("");

    if (p.textContent !== "") {
      p.textContent = transcript;
    } else {
      $wordsContainer.classList.remove("hide");
      p.textContent = transcript;
    }
    if (transcript.includes("zit gemakkelijk")) {
      recognition.abort();
      // $wordsContainer.classList.add("hide");
      setTimeout(comfyComplete, funcDelay);
      // comfyComplete();
    }
  });

  recognition.addEventListener("end", recognition.start);
  recognition.start();
};

const comfyComplete = () => {
  resetContainer();
  $title.textContent = "Goed zo! Zoals je ziet moet je goed articuleren.";
  $sub.textContent = "Zeg ‘Ik snap het’ om verder te gaan.";
  detectUnderstood();
};

const detectUnderstood = () => {
  recognition.addEventListener("result", e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join("");

    if (p.textContent !== "") {
      p.textContent = transcript;
    } else {
      $wordsContainer.classList.remove("hide");
      p.textContent = transcript;
    }
    // p.textContent = transcript;
    if (transcript.includes("snap het")) {
      recognition.abort();
      setTimeout(understoodComplete, funcDelay);
    }
  });

  recognition.addEventListener("end", recognition.start);
  recognition.start();
};

const understoodComplete = () => {
  resetContainer();
  $title.textContent =
    "De voorstelling die je zonet gezien hebt, komt uit de opera ‘La Bohème’ en is geschreven, na een bijna-dood-ervaring van de schrijver. Heb jij al eens een bijna dood ervaring gehad?";
  $sub.textContent = "‘Ja, en ik wil deze vertellen’ of ‘Nee, nog nooit’";
  detectStory();
};

const detectStory = () => {
  recognition.addEventListener("result", e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join("");

    if (p.textContent !== "") {
      p.textContent = transcript;
    } else {
      $wordsContainer.classList.remove("hide");
      p.textContent = transcript;
    }
    if (transcript.includes("ik wil deze vertellen")) {
      recognition.abort();
      setTimeout(storyYes, funcDelay);
    }
    if (transcript.includes("nog nooit")) {
      recognition.abort();
      setTimeout(storyNo, funcDelay);
    }
  });

  recognition.addEventListener("end", recognition.start);
  recognition.start();
};

const storyYes = () => {
  resetContainer();
  $title.textContent =
    "Denk even rustig na, en begin aub met spreken wanneer je wil. Wanneer je klaar bent zeg je: ‘en dit was mijn verhaal’.";
  $sub.textContent = "";
  recognition.addEventListener("speechstart", recordStory);
};

const storyNo = () => {};

const recordStory = () => {
  recognition.removeEventListener("speechstart", recordStory);
  recognition.addEventListener("result", e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join("");

    p.textContent = transcript;
    if (transcript.includes("dit was mijn verhaal")) {
      recognition.stop();
      console.log("verhaal opgeslagen");
      // storyRecorded(transcript);
      storyRecorded(transcript);
    }

    if (e.results[0].isFinal) {
      p = document.createElement("p");
      words.appendChild(p);
    }
  });

  recognition.addEventListener("end", recognition.start);
  recognition.start();
};

const storyRecorded = transcript => {
  console.log(transcript);
};

const init = () => {
  detectComfy();
};

init();
