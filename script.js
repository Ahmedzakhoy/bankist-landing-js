"use strict";

// all elements selection
///////////////////////////////////////
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseRegistrationWindow = document.querySelector(".btn--close-modal");
const btnsOpenRegistrationWindow = document.querySelectorAll(".btn--show-modal");
const btnSrollToInitialVew = document.querySelector(".btn--scroll-to");
const initialSection = document.querySelector("#section--1");
const allSections = document.querySelectorAll(".section");
const tabsContainer = document.querySelector(".operations__tab-container");
const allTabs = document.querySelectorAll(".operations__tab");
const tabsContent = document.querySelectorAll(".operations__content");
const navBar = document.querySelector(".nav");
const header = document.querySelector(".header");
const imgTargets = document.querySelectorAll("img[data-src]");
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotsContaier = document.querySelector(".dots");

///////////////////////////////////////
// Modal window functionality

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// Modal window event listeners
btnsOpenRegistrationWindow.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseRegistrationWindow.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

///////////////////////////////////////
////button scrolling to initial view
btnSrollToInitialVew.addEventListener("click", function (event) {
  initialSection.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////
////scrolling to sections from navigation bar
document
  .querySelector(".nav__links")
  .addEventListener("click", function (event) {
    event.preventDefault();
    //matching strategy
    if (event.target.classList.contains("nav__link")) {
      const id = event.target.getAttribute("href");
      document.querySelector(id).scrollIntoView({
        behavior: "smooth",
      });
    }
  });

///////////////////////////////////////
////tabbed component
tabsContainer.addEventListener("click", (event) => {
  const clicked = event.target.closest(".operations__tab");
  //gaurd cluase //no code after it will execute
  if (!clicked) return;
  //activate tab
  allTabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  //show corresponding content area
  tabsContent.forEach((tabContent) =>
    tabContent.classList.remove("operations__content--active")
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

///////////////////////////////////////
////menu fade animation functionality
const changeOpacity = function (event) {
  if (event.target.classList.contains("nav__link")) {
    const link = event.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    siblings.forEach((element) => {
      if (element !== link) {
        element.style.opacity = `${this}`;
      }
    });
    logo.style.opacity = `${this}`;
  }
};
navBar.addEventListener("mouseover", changeOpacity.bind(0.5));
navBar.addEventListener("mouseout", changeOpacity.bind(1));

///////////////////////////////////////
////sticky navigation
const initialCoords = initialSection.getBoundingClientRect();
const navHeight = navBar.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    navBar.classList.add("sticky");
  } else {
    navBar.classList.remove("sticky");
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////
////reveal sections functionality
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});
allSections.forEach(function (section) {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
});

///////////////////////////////////////
////lazy loading images functionality
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //replace src attribute with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});
imgTargets.forEach((img) => imgObserver.observe(img));

///////////////////////////////////////
////slider
let curSlide = 0;

const maxSlide = slides.length;
const goToSlide = function (slide) {
  slides.forEach((singleSlide, index) => {
    singleSlide.style.transform = `translateX(${100 * (index - slide)}%)`;
    //-100%, 0, 100%, 200%
  });
};
goToSlide(0);

// next slide function
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

// previous slide function
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};
//activating current dot functionality
const activateDot = function (slide) {
  const allDotsArray = [...dotsContaier.children];
  allDotsArray.forEach((s) => s.classList.remove("dots__dot--active"));
  document
  .querySelector(`.dots__dot[data-slide="${slide}"]`)
  .classList.add("dots__dot--active");
};

//// creating the dots elements function
const createDots = function () {
  for (let i = 0; i < maxSlide; i++) {
    dotsContaier.insertAdjacentHTML(
      "beforeend",
      `
    <button class="dots__dot" data-slide="${i}"></button>
    `
    );
  }
};

createDots();
activateDot(0);

//btn event listeners
btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);
//keyboard events
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowRight") {
    nextSlide();
  }
  if (event.key === "ArrowLeft") {
    prevSlide();
  }
});

//dots event listener
dotsContaier.addEventListener("click", function (event) {
  if (event.target.classList.contains("dots__dot")) {
    const { slide } = event.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});
