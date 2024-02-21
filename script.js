"use strict";

///////////////////////////////////////
// element selection

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const allSections = document.querySelectorAll(".section");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const imgTargets = document.querySelectorAll("img[data-src]");
const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");
///////////////////////////////////////
// Modal window

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

///////////////////////////////////////
////button scrolling

btnScrollTo.addEventListener("click", function (event) {
  section1.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////
////event delegation -- page navigation
//
//

//without delegation
// document.querySelectorAll(".nav__link").forEach((link) =>
//   link.addEventListener("click", function (event) {
//     event.preventDefault();
//     const id = this.getAttribute("href");
//     document.querySelector(id).scrollIntoView({
//       behavior: "smooth",
//     });
//   })
// );

//
//

//with delegation
//#1 add event listener to common parent element
// #2 determine what element originated that event
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
//
//

tabsContainer.addEventListener("click", (event) => {
  const clicked = event.target.closest(".operations__tab");
  //gaurd cluase //no code after it will execute
  if (!clicked) return;
  //activate tab
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  //show corresponding content area
  tabsContent.forEach((tc) =>
    tc.classList.remove("operations__content--active")
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

///////////////////////////////////////
////menu fade animation
//
//

//mouseenter doesnt bubble
//mouseover does bubble

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

nav.addEventListener("mouseover", changeOpacity.bind(0.5));
nav.addEventListener("mouseout", changeOpacity.bind(1));
// nav.addEventListener("mouseover", function (event) {
//   changeOpacity(event, 0.5);
// });
// nav.addEventListener("mouseout", function (event) {
//   changeOpacity(event, 1);
// });

///////////////////////////////////////
////sticky navigation
//
//
const initialCoords = section1.getBoundingClientRect();

/// this is not a good way to do it // scroll event always firing!!!

// window.addEventListener("scroll", function () {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add("sticky");
//   } else {
//     nav.classList.remove("sticky");
//   }
// });

// using intersection observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach((entry) => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null, //null means to the viewport
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

// using intersection observer API
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////
////reveal sections
//
//
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
////lazy loading images
//
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
//
let curSlide = 0;
const maxSlide = slides.length;
const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
    //-100%, 0, 100%, 200%
  });
};
goToSlide(0);

//dot change position function
const activateDot = function (slide) {
  const allSlidesArr = [...dotContainer.children];
  allSlidesArr.forEach((s) => s.classList.remove("dots__dot--active"));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};
// next slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};
btnRight.addEventListener("click", nextSlide);
// previous slide
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};
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

//// dots
const createDots = function () {
  for (let i = 0; i < maxSlide; i++) {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `
    <button class="dots__dot" data-slide="${i}"></button>
    `
    );
  }
};
createDots();
activateDot(0);
//dots event listener
dotContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("dots__dot")) {
    const { slide } = event.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});
