const popupModal = document.querySelector(".popup");
const popupOverlay = document.querySelector(".pop-overlay");
const playButton = document.querySelector(".game .card-wrapper .play");
const cardWrapper = document.querySelector(".game .cardContainer");
const body = document.querySelector(".body");
const infoIcon = document.querySelector(".info.icon");
const silhouettes = document.querySelectorAll(
  "#silhouettes-container .pictureWrapper"
);
const pictures = document.querySelectorAll(
  "#pictures-container .pictureWrapper"
);
const scoreWrapper = document.querySelector(".game .scoreWrapper");
const score = document.querySelector(".game .scoreItem .score");
const successModal = document.querySelector(".success-wrapper");
const closeButton = document.querySelector(".closeModal");
const overlay = document.querySelector(".overlay");
const arrows = document.querySelectorAll(".game .body .arrow");
const pauseButton = document.querySelector(".game .pause.icon");
const iconsArr = [...arrows, pauseButton];
let i = 0;
let animationCounter = 0;
let counter = 0;
const animateInfo = () => {
  infoIcon.classList.add("show");
  infoIcon.addEventListener("animationend", () => {
    setTimeout(() => {
      infoIcon.classList.remove("show");
      infoIcon.classList.add("hide");
    }, 1000);
  });
};
infoIcon.addEventListener("click", () => {
  infoIcon.classList.remove("hide");
  animateInfo();
});
playButton.addEventListener("click", () => {
  document.querySelector("#start-audio").play();
  cardWrapper.classList.add("hide");
  cardWrapper.addEventListener("animationend", () => {
    cardWrapper.classList.remove("hide");
    cardWrapper.style.visibility = "hidden";
    scoreWrapper.style.visibility = "visible";
    score.textContent = `0/${pictures.length}`;
    body.classList.add("show");
    silhouettes.forEach((silhouette) => {
      silhouette.classList.add("show");
      silhouette.addEventListener("animationend", () => {
        silhouette.classList.remove("show");
        silhouette.style.transform = "scale(1)";
        animationCounter++;
        if (animationCounter === silhouettes.length) {
          pictures.forEach((picture) => {
            picture.classList.add("show");
            picture.addEventListener("animationend", () => {
              picture.classList.remove("show");
              picture.style.transform = "scale(1)";
            });
          });
        }
      });
    });
  });
});
pictures.forEach((picture) => {
  picture.addEventListener("dragstart", (event) => {
    event.stopPropagation();
    picture.style.opacity = "0";
    event.dataTransfer.setData("id", picture.dataset.id);
    document.querySelector(`audio[id="${picture.dataset.id}"]`).play();
  });
  picture.addEventListener("dragend", (event) => {
    picture.style.opacity = "1";
  });
});
silhouettes.forEach((silhouette) => {
  silhouette.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  silhouette.addEventListener("drop", (event) => {
    event.preventDefault();
    const pictureId = event.dataTransfer.getData("id");
    const silhouetteId = silhouette.dataset.id;
    console.log(silhouetteId);
    if (pictureId === silhouetteId) {
      document.querySelector("#correct-audio").play();
      silhouette.classList.add("animate");
      silhouette.addEventListener("animationend", () => {
        silhouette.classList.remove("animate");
      });
      const pictureElement = document.querySelector(
        `.picture[data-id="${pictureId}"] img`
      );
      const silhouetteElement = document.querySelector(
        `.silhouette[data-id="${pictureId}"] img`
      );
      const imgSrc = pictureElement.src;
      silhouetteElement.src = imgSrc;
      counter += 1;
      score.textContent = `${counter}/${silhouettes.length}`;
      pictureElement.parentElement.style.visibility = "hidden";
      silhouette.classList.add("animate");
      document
        .querySelector(":root")
        .style.setProperty(
          "--width",
          `${(100 / silhouettes.length) * counter}%`
        );
      if (counter === silhouettes.length) {
        const text = document.querySelector(".text-card .score-text");
        text.textContent = `${counter}/${silhouettes.length}`;
        text.setAttribute("text", `${counter}/${silhouettes.length}`);
        successModal.style.visibility = "visible";
        overlay.classList.add("show");
        successModal.classList.add("show");
        setTimeout(() => {
          document.querySelector(`audio[id="success"]`).play();
        }, 500);
      }
    } else {
      const pictureElement = document.querySelector(
        `.picture[data-id="${pictureId}"] img`
      );
      document.querySelector("#wrong-audio").play();
      pictureElement.parentElement.classList.add("vibrate");
      pictureElement.parentElement.addEventListener("animationend", () => {
        pictureElement.parentElement.classList.remove("vibrate");
      });
    }
  });
});
successModal.addEventListener("animationend", () => {
  successModal.classList.remove("show");
  successModal.classList.remove("hide");
});
const addCloseAnimation = () => {
  closeButton.classList.add("animate");
  closeButton.addEventListener("animationend", () => {
    closeButton.classList.remove("animate");
  });
  successModal.classList.add("hide");
  successModal.style.visibility = "hidden";
  overlay.classList.remove("show");
};
document.addEventListener("click", function (event) {
  const isVisible =
    window.getComputedStyle(successModal).visibility === "visible";
  var isClickInside =
    successModal.contains(event.target) || event.target === closeButton;
  if (!isClickInside && isVisible) {
    addCloseAnimation();
  }
});
closeButton.addEventListener("click", () => {
  addCloseAnimation();
});
const hideItems = () => {
  iconsArr.forEach((item) => {
    item.style.opacity = 0;
  });
};
let timer;
const resetTimer = () => {
  clearTimeout(timer);
  iconsArr.forEach((item) => {
    item.style.opacity = 1;
  });
  timer = setTimeout(hideItems, 3000);
};
document.addEventListener("mousemove", resetTimer);
document.addEventListener("touchstart", resetTimer);
const checkScreen = () => {
  const isMobile = window.innerWidth < 768;
  return isMobile;
};
window.addEventListener("load", () => {
  animateInfo();
  const is_mobile = checkScreen();
  if (is_mobile) {
    popupModal.style.visibility = "visible";
    popupOverlay.style.visibility = "visible";
  }
  silhouettes.forEach((silhouette) => {
    silhouette.style.animationDelay = `${i * 0.2}s`;
    i++;
  });
  i = 0;
  pictures.forEach((picture) => {
    picture.style.animationDelay = `${i * 0.2}s`;
    i++;
  });
});

document.addEventListener("contextmenu", function (event) {
  var target = event.target;
  if (target.tagName === "IMG") {
    event.preventDefault();
  }
  return false;
});
window.addEventListener("orientationchange", function () {
  const is_mobile = checkScreen();
  if (is_mobile) {
    if (window.orientation === 90 || window.orientation === -90) {
      popupModal.style.visibility = "hidden";
      popupOverlay.style.visibility = "hidden";
    } else {
      popupModal.style.visibility = "visible";
      popupOverlay.style.visibility = "visible";
    }
  }
});
