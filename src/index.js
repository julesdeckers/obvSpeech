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

const $title = document.querySelector(".title");
const $sub = document.querySelector(".subtext");
const $subtop = document.querySelector(".subtextTop");
$subtop.style.setProperty("--subvis", "hidden");
const $info = document.querySelector(".infoText");

const funcDelay = 500;
const reset = 100;

const resetContainer = () => {
  recognition.stop();
  $subtop.style.setProperty("--subvis", "hidden");
  $info.classList.remove("hide");
  $wordsContainer.classList.add("hide");
  $subtop.textContent = "";
  p.textContent = "";
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
  setTimeout(detectUnderstood, 2000);
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

const handleEnter = e => {
  if (e.keyCode === 13) {
    recognition.abort();
    recognition.onspeechend = () => {
      recognition.addEventListener("end", recognition.abort);
      console.log("Speech recognition has stopped.");
    };
    storyRecorded();
  }
};

const recordStory = () => {
  storeStory = document.addEventListener("keyup", handleEnter);
  recognition.addEventListener("result", e => {
    $subtop.innerHTML =
      $title.textContent + "</br></br>Wanneer je klaar bent druk je op ENTER";
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
  document.removeEventListener("keyup", handleEnter);
  $sub.style.setProperty("--talkcon", "hidden");
  $title.textContent = "Bedankt voor het delen van je verhaal!";
  $sub.innerHTML =
    '<span class="red">Blijf even hangen want de opera zanger zal jouw verhaal misschien aan de volgende vijf brengen!</span></br></br> Je kan alle anonieme verhalen terugvinden op <span class="link">operaballet.be/askobv</span>';

  console.log("verhaal opgeslagen");
  const finalTranscript = words.querySelectorAll(`p`);
  const transcripted = Array.from(finalTranscript)
    .map(result => result.innerText)
    .join(". ");
  postTranscript(transcripted);
  console.log(transcripted);
};

const postTranscript = async transcript => {
  const data = {
    message: transcript
  };
  const response = await fetch("./send.php", {
    method: "POST",
    headers: new Headers({ "Content-type": "application/json" }),
    body: JSON.stringify(data)
  });
  const returned = await response.text();
  console.log(returned);
};

const init = () => {
  setTimeout(detectComfy, 2000);
  // storyYes();
  // recognition.start();
};

init();
