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

const detectComfy = () => {
  recognition.addEventListener("soundstart", e => {
    $wordsContainer.classList.remove(`hide`);
  });
  recognition.addEventListener("result", e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join("");

    p.textContent = transcript;
    if (transcript.includes("zit gemakkelijk")) {
      recognition.abort();
      $wordsContainer.classList.add(`hide`);
      comfyComplete();
    }
  });

  recognition.addEventListener("end", recognition.start);
  recognition.start();
};

const handleEnter = e => {
  console.log("key pressed");
  if (e.keyCode === 13) {
    console.log("verhaal opgeslagen");
  }
};

const comfyComplete = () => {
  $title.textContent = "Goed zo! Zoals je ziet moet je goed articuleren.";
  $sub.textContent = "Zeg ‘Ik snap het’ om verder te gaan.";
  document.removeEventListener("keyup", handleEnter);
  detectUnderstood();
};

const detectUnderstood = () => {
  recognition.addEventListener("result", e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join("");

    p.textContent = transcript;
    if (transcript.includes("snap het")) {
      recognition.abort();
      understoodComplete();
    }
  });

  recognition.addEventListener("end", recognition.start);
  recognition.start();
};

const understoodComplete = () => {
  $title.textContent =
    "De voorstelling die je zonet gezien hebt, komt uit de opera ‘dingsken123’ en is geschreven, na een bijna-dood-ervaring van de schrijver. Heb jij al eens een bijna dood ervaring gehad?";
  $sub.textContent = "‘Ja, en ik wil deze vertellen’ of ‘Nee, nog nooit’";
  detectStory();
};

const detectStory = () => {
  recognition.addEventListener("result", e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join("");

    p.textContent = transcript;
    if (transcript.includes("ik wil deze vertellen")) {
      recognition.abort();
      storyYes();
    }
    if (transcript.includes("nog nooit")) {
      recognition.abort();
      storyNo();
    }
  });

  recognition.addEventListener("end", recognition.start);
  recognition.start();
};

const storyYes = () => {
  $title.textContent =
    "Denk even rustig na, en begin aub met spreken wanneer je wil. Wanneer je klaar bent zeg je: ‘en dit was mijn verhaal’ of druk je op enter.";
  $sub.textContent = "";
  recordStory();
};

const storyNo = () => {};

const recordStory = () => {
  recognition.addEventListener("result", e => {
    document.addEventListener("keyup", handleEnter);
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join("");

    p.textContent = transcript;
    if (transcript.includes("dit was mijn verhaal")) {
      recognition.stop();
      console.log("verhaal opgeslagen");
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
  console.log("transcript");
};

const init = () => {
  detectComfy();
};

init();
