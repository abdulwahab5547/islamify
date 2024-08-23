let currentAudio = new Audio();
let currentFolder = "AudioFiles/Recitation";
let Audios = [
  "zilzal.mp3",
  "maun.mp3",
  "nasr.mp3",
  "tin.mp3",
  "fatiha.mp3",
];
let previousVolume = currentAudio.volume;
let play = document.querySelector("#play");

function convertSecondsToMinutes(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  remainingSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
  return `${minutes}:${remainingSeconds}`;
}

function getAudios() {
  // Getting the list of all the files
  let FileUl = document.querySelector(".audioList ul");
  FileUl.innerHTML = "";
  for (let element of Audios) {
    FileUl.innerHTML += `<li class="pointer item_lib">
        <img class="invert music" src="Images/Audio.svg" alt="Audio Icon">
        <div class="info">${element}</div>
        <img class="invert playNow" src="Images/play.svg" alt="Play Icon">
      </li>`;

    Array.from(
      document.querySelector(".audioList").getElementsByTagName("li")
    ).forEach((e) => {
      e.addEventListener("click", () => {
        playAudio(e.querySelector(".info").innerHTML.trim());
      });
    });
  }
}

function playAudio(track, pause = false) {
  currentAudio.src = `${currentFolder}/` + track;
  if (!pause) {
    currentAudio.play();
    play.src = "Images/pause.svg";
  }

  document.querySelector(".audioName").innerHTML = `<span>${track}</span>`;
  document.querySelector(
    ".audioDuration"
  ).innerHTML = `<span>00:00 / ${convertSecondsToMinutes(
    currentAudio.duration
  )}</span>`;

  // Update the duration as it plays
  currentAudio.addEventListener("timeupdate", () => {
    document.querySelector(
      ".audioDuration"
    ).innerHTML = `<span>${convertSecondsToMinutes(
      currentAudio.currentTime
    )} / ${convertSecondsToMinutes(currentAudio.duration)}</span>`;
    document.querySelector(".circle").style.left =
      (currentAudio.currentTime / currentAudio.duration) * 100 + "%";
  });
}

async function main() {
  getAudios();
  playAudio(Audios[0], true);

  play.addEventListener("click", () => {
    if (currentAudio.paused) {
      currentAudio.play();
      play.src = "Images/pause.svg";
    } else {
      currentAudio.pause();
      play.src = "Images/play.svg";
    }
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentAudio.currentTime = (currentAudio.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left-part").style.left = "0";
    document.querySelector(".left-part").style.width = "370px";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left-part").style.left = "-120%";
  });

  document.querySelector("#Previous").addEventListener("click", () => {
    let currentAudioFileName = currentAudio.src
      .split("/")
      .pop()
      .replaceAll("%20", " ");
    let index = Audios.indexOf(currentAudioFileName);
    if (index > 0) {
      playAudio(Audios[index - 1]);
    }
  });

  document.querySelector("#Next").addEventListener("click", () => {
    let currentAudioFileName = currentAudio.src.split("/").pop().replaceAll("%20", " ");
    let index = Audios.indexOf(currentAudioFileName);
    if (index < Audios.length - 1) {
      playAudio(Audios[index + 1]);
    }
  });

  document
    .querySelector(".range input")
    .addEventListener("change", (e) => {
      currentAudio.volume = e.target.value / 100;
      document.querySelector(".volume_btn").src =
        currentAudio.volume === 0 ? "Images/mute.svg" : "Images/volume.svg";
    });

  document.querySelector(".volume_btn").addEventListener("click", () => {
    if (currentAudio.volume !== 0) {
      previousVolume = currentAudio.volume;
      currentAudio.volume = 0;
      document.querySelector(".volume_btn").src = "Images/mute.svg";
    } else {
      currentAudio.volume = previousVolume;
      document.querySelector(".volume_btn").src = "Images/volume.svg";
    }
  });
}

main();
