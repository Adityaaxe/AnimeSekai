// Box Slider

let cardcontainers = [...document.querySelectorAll(".card-container")];
let preBtns = [...document.querySelectorAll(".pre-btn")];
let nxtBtns = [...document.querySelectorAll(".nxt-btn")];

//Box Section Slider

cardcontainers.forEach((item, i) => {
  let containerDimensions = item.getBoundingClientRect();
  let containerWidth = containerDimensions.width;
  nxtBtns[i].addEventListener("click", () => {
    item.scrollLeft += containerWidth - 200;
  });
  preBtns[i].addEventListener("click", () => {
    item.scrollLeft -= containerWidth + 200;
  });
});

//History Section Slider

let historycardcontainers = [...document.querySelectorAll(".history-card-container")];
let historypreBtns = [...document.querySelectorAll(".history-pre-btn")];
let historynxtBtns = [...document.querySelectorAll(".history-nxt-btn")];

historycardcontainers.forEach((item, i) => {
  let containerDimensions = item.getBoundingClientRect();
  let containerWidth = containerDimensions.width; x
  historynxtBtns[i].addEventListener("click", () => {
    item.scrollLeft += containerWidth - 200;
  });
  historypreBtns[i].addEventListener("click", () => {
    item.scrollLeft -= containerWidth + 200;
  });
});

//Result Holder Section

let searchbar = [...document.querySelectorAll(".srch")];
var resultholder = document.getElementById("rh")

rh.style.display = "none";

function toggelrh() {
  if (rh.style.display = "none") {
    rh.style.display = "block";
  }
}

function removerh() {
  if (rh.style.display = "block") {
    rh.style.display = "none";
  }
}

//Link Box

var sharebtn = document.getElementById("sharebtn")
var linkbox = document.getElementById("linkbox")

linkbox.style.display = "none";

function toggelshareopen() {
  if (linkbox.style.display = "none") {
    linkbox.style.display = "block";
    linkbox.style.position = "relative";
    linkbox.style.left = "-110px";
  }
}
function toggelshareclose() {
  if (linkbox.style.display = "block") {
    linkbox.style.display = "none";
  }
}

// Download Quality Box

var downloadbtn = document.getElementById("downloadbtn")
var qualitybox = document.getElementById("qualitybox")

qualitybox.style.display = "none";

downloadbtn.onmouseover = function () {
  qualitybox.style.display = "block";
}
downloadbtn.onmouseout = function () {
  qualitybox.style.display = "none";
}
qualitybox.onmouseover = function () {
  qualitybox.style.display = "block";
}
qualitybox.onmouseout = function () {
  qualitybox.style.display = "none";
}

// watchlist

var plus = document.getElementById("plus")
var checkmark = document.getElementById("checkmark")

plus.style.display = "block";
checkmark.style.display = "none";

plus.onclick = function () {
  plus.style.display = "none";
  checkmark.style.display = "block";
}
