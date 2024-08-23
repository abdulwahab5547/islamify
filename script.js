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

// async function getAudios(folder) {
//   let a = await fetch(`/${folder}/`);
//   currentFolder = folder;
//   let response = await a.text();
//   let div = document.createElement("div");
//   div.innerHTML = response;
//   let Anchor_Tags = div.getElementsByTagName("a");
//   Audios = [];
//   for (let i = 0; i < Anchor_Tags.length; i++) {
//     const element = Anchor_Tags[i];

//     if (element.href.endsWith(".mp3")) {
//       Audios.push(element.href.split("/").pop().replaceAll("%20", " "));
//     }
//   }

//   // Getting the list of all the files
//   let FileUl = document.querySelector(".audioList ul");
//   FileUl.innerHTML = "";
//   for (let element of Audios) {

//     FileUl.innerHTML += `<li class="pointer item_lib">
//         <img class="invert music" src="Images/Audio.svg " alt="Audio Icon">
//         <div class="info">${element}</div>
//         <img class="invert playNow" src="Images/play.svg" alt="Play Icon">
//       </li>`;

//     Array.from(
//       document.querySelector(".audioList").getElementsByTagName("li")
//     ).forEach((e) => {
//       e.addEventListener("click", () => {
//         playAudio(e.querySelector(".info").innerHTML.trim());
//       });
//     });
//   }

//   return Audios;
// }

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

  // Getting the list of all the files
  let FileUl = document.querySelector(".audioList ul");
  FileUl.innerHTML = "";
  for (let element of Audios) {
    FileUl.innerHTML += `<li class="pointer item_lib">
        <img class="invert music" src="Images/Audio.svg " alt="Audio Icon">
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

  return Audios;
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

async function DisplayAlbums() {
  let a = await fetch(`AudioFiles/`);
  let response = await a.text();
  let div = document.createElement("div");
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".allCards");
  div.innerHTML = response;
  // let array = Array.from(anchors);
  let array = Array.from(anchors);
  for (let i = 0; i < array.length; i++) {
    const e = array[i];
    if (e.href.includes("AudioFiles") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-2)[0];
      let a = await fetch(
        `AudioFiles/${folder}/info.json`
      );
      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div class="card" data-folder="${response.data}">
            <div class="play-button">▶</div>
            <img
              src="AudioFiles/${folder}/cover.jpeg"
              alt="recitation-without-translation" />
            <h2>${response.tittle}</h2>
            <span>${response.description}</span>
          </div>`;
    }
    Array.from(document.getElementsByClassName("card")).forEach((e) => {
      e.addEventListener("click", async (item) => {
        await getAudios(`AudioFiles/${item.currentTarget.dataset.folder}`);
      });
    });
  }
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
