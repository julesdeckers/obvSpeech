const $title = document.querySelector(`.title`);
const $sub = document.querySelector(`.subtext`);

const loadSpeechAPI = () => {
  window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = "nl";

  let p = document.createElement("p");
  const words = document.querySelector(".words");
  words.appendChild(p);

  recognition.addEventListener("result", e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join("");

    const poopScript = transcript.replace(/poop|poo|shit|dump/gi, "💩");
    p.textContent = poopScript;

    if (e.results[0].isFinal) {
      p = document.createElement("p");
      words.appendChild(p);
    }
  });

  recognition.addEventListener("end", recognition.start);

  recognition.start();
};

const handleEnter = e => {
  console.log("key pressed");
  if (e.keyCode === 13) {
    console.log("key enter");
    comfyComplete();
  }
};

const comfyComplete = () => {
  $title.textContent = "Goed zo! Zoals je ziet moet je goed articuleren.";
  $sub.textContent = "Zeg ‘Ik snap het’ om verder te gaan.";
  document.removeEventListener("keyup", handleEnter);
};

const init = () => {
  loadSpeechAPI();
  document.addEventListener("keyup", handleEnter);
  console.log("hey");
};

init();
