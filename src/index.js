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
console.log(words);
words.appendChild(p);

const $title = document.querySelector(".title");
const $sub = document.querySelector(".subtext");
const $subtop = document.querySelector(".subtextTop");
$subtop.style.setProperty("--subvis", "hidden");
const $info = document.querySelector(".infoText");

const funcDelay = 500;
const reset = 100;

const resetContainer = () => {
  $subtop.style.setProperty("--subvis", "hidden");
  $info.classList.remove("hide");
  $wordsContainer.classList.add("hide");
  $subtop.textContent = "";
  p.textContent = "";
  recognition.stop();
};

const updateScroll = () => {
  words.scrollTop = words.scrollHeight - words.clientHeight;
};

const detectComfy = () => {
  recognition.addEventListener("result", e => {
    $info.classList.add("hide");
    $subtop.textContent = $sub.textContent;
    $subtop.style.setProperty("--subvis", "visible");
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
    if (transcript.includes("opera")) {
      setTimeout(comfyComplete, funcDelay);
    }
  });

  recognition.addEventListener("end", recognition.start);
  recognition.start();
};

const comfyComplete = () => {
  resetContainer();
  $title.textContent = "Goed zo! Zoals je ziet moet je goed articuleren.";
  $sub.textContent = "Zeg ‘Ik snap het’ om verder te gaan.";
  setTimeout(detectUnderstood, funcDelay);
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
    if (transcript.includes("snap het")) {
      setTimeout(storyYes, funcDelay);
    }
  });

  recognition.addEventListener("end", recognition.start);
  // recognition.start();
};

const storyYes = () => {
  resetContainer();
  $title.textContent = "Wat was je beste herinnering met je vrienden?";
  $sub.textContent =
    "Begin met praten als je je verhaal wilt delen. Wanneer je klaar bent met je verhaal druk je op enter.";
  recognition.addEventListener("speechstart", recordStory, { once: true });
};

const recordStory = () => {
  recognition.addEventListener("result", e => {
    $subtop.textContent = $title.textContent;
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
    if (transcript.includes("einde verhaal")) {
      console.log("verhaal opgeslagen");
      recognition.onspeechend = () => {
        recognition.addEventListener("end", recognition.stop);
        console.log("Speech recognition has stopped.");
      };
      storyRecorded();
    }

    if (e.results[0].isFinal) {
      p = document.createElement("p");
      words.appendChild(p);
      setInterval(updateScroll, 1000);
    }
  });

  recognition.addEventListener("end", recognition.start);
};

const storyRecorded = () => {
  resetContainer();
  $title.textContent = "Bedankt voor het delen van je verhaal!";
  $sub.textContent =
    "Blijf even hangen want de opera zanger zal jouw verhaal misschien aan de volgende vijf brengen! Je kan alle anonieme verhalen terugvinden op operaballet.be/askobv";

  console.log("verhaal opgeslagen");
  const finalTranscript = words.querySelectorAll(`p`);
  const transcripted = Array.from(finalTranscript)
    .map(result => result.innerText)
    .join(". ");
  postTranscript(transcripted);
  console.log(transcripted);
};

const postTranscript = transcript => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "send.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = () => {
    console.log("data sent");
  };
  xhr.send(`story="${transcript}"`);
};

const init = () => {
  setTimeout(detectComfy, funcDelay);
  // storyYes();
  // recognition.start();
};

init();
