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
// words.appendChild(p);

const $title = document.querySelector(`.title`);
const $sub = document.querySelector(`.subtext`);

const funcDelay = 500;

const resetContainer = () => {
  p.textContent = "";
  $wordsContainer.classList.add("hide");
  recognition.stop();
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
    if (transcript.includes("opera")) {
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
    // p.textContent = transcript;
    if (transcript.includes("snap het")) {
      setTimeout(understoodComplete, funcDelay);
    }
  });

  recognition.addEventListener("end", recognition.start);
  // recognition.start();
};

const understoodComplete = () => {
  resetContainer();
  $title.textContent =
    "De voorstelling die je zonet gezien hebt, komt uit de opera ‘La Bohème’ en is geschreven, na een bijna-dood-ervaring van de schrijver. Heb jij al eens een bijna dood ervaring gehad?";
  $sub.textContent = "‘Ja, ik wil dit vertellen’ of ‘Nee, nog nooit’";
  setTimeout(detectStory, funcDelay);
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
    if (transcript.includes("wil dit vertellen")) {
      setTimeout(storyYes, funcDelay);
    }
    if (transcript.includes("nog nooit")) {
      setTimeout(storyNo, funcDelay);
    }
  });

  recognition.addEventListener("end", recognition.start);
  // recognition.start();
};

const storyYes = () => {
  resetContainer();
  $title.textContent = "Wat was je beste herinnering met je vrienden?";
  $sub.textContent = "";
  recognition.addEventListener("speechstart", recordStory);
};

const storyNo = () => {
  console.log("fork off");
};

const recordStory = () => {
  recognition.removeEventListener("speechstart", recordStory);
  recognition.addEventListener("result", e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join("");
    // p.textContent.concat(transcript);
    if (p.textContent !== "") {
      p.textContent = transcript;
    } else {
      $wordsContainer.classList.remove("hide");
      p.textContent = transcript;
    }
    if (transcript.includes("einde verhaal")) {
      console.log("verhaal opgeslagen");
      // storyRecorded(transcript);
      recognition.onspeechend = () => {
        recognition.addEventListener("end", recognition.stop);
        console.log("Speech recognition has stopped.");
      };
      storyRecorded();
    }

    if (e.results[0].isFinal) {
      p = document.createElement("p");
      words.appendChild(p);
    }
  });
};

//   const recordStory = () => {
//     recognition.removeEventListener("speechstart", recordStory);
//     recognition.addEventListener("result", e => {
//       const transcript = Array.from(e.results)
//         .map(result => result[0])
//         .map(result => result.transcript)
//         .join("");
//       // p.textContent.concat(transcript);
//       if (p.textContent !== "") {
//         p.textContent = transcript;
//       } else {
//         $wordsContainer.classList.remove("hide");
//         p.textContent = transcript;
//       }
//       if (transcript.includes("einde verhaal")) {
//         console.log("verhaal opgeslagen");
//         // storyRecorded(transcript);
//         recognition.onspeechend = () => {
//           recognition.addEventListener("end", recognition.stop);
//           console.log("Speech recognition has stopped.");
//         };
//         storyRecorded();
//       }

//       if (e.results[0].isFinal) {
//         p = document.createElement("p");
//         words.appendChild(p);
//       }
//     });

//   recognition.addEventListener("end", recognition.start);
//   // recognition.start();
// };
// };

const storyRecorded = () => {
  resetContainer();
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
  detectComfy();
  // storyYes();
  recognition.start();
};

init();
