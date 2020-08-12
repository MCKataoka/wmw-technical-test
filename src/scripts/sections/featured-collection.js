/**
 * Section: Featured collection
 * ------------------------------------------------------------------------------
 * Featured collection configuration for complete theme support
 * - https://github.com/Shopify/theme-scripts/tree/master/packages/theme-sections
 *
 * @namespace featuredCollection
 */
import { register } from "@shopify/theme-sections";

// import Swiper JS
import Swiper from "swiper/bundle";
// import Swiper styles
import "swiper/swiper-bundle.css";

/**
 * Featured collection constructor
 * Executes on page load as well as Theme Editor `section:load` events.
 *
 * @param {string} container - selector for the section container DOM element
 */

register("featured-collection", {
  init() {
    this.publicMethod();
  },

  publicMethod() {
    window.console.log("Initialising featured collection section");
  }
});

// a function that waits before an element appears before executing a function
var waitForElement = function(element, cb) {
  var time = setInterval(function() {
    if (document.querySelector(element)) {
      clearInterval(time);
      cb();
    }
  }, 100);
};

//The new instance of Swiper had a timing issue. The script took too long to load
// so I start the instance after some time has passed to allow the script to run

//Starting a new instance of Swiper
var mySwiper = new Swiper(".swiper-container", {
  direction: "horizontal",
  loop: true,
  slidesPerView: 1,
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
      spaceBetweenSlides: 22
    },
    1024: {
      slidesPerView: 3,
      spaceBetweenSlides: 22
    },
    1328: {
      slidesPerView: 4,
      spaceBetweenSlides: 22
    }
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  }
});

// This function is checking what products are on sale
//if the product is on sale then it will clean the pricing string to only have the price
//and it also inserts the 'sale' tag in the top right of the image

waitForElement(".product-card__name-price span", function() {
  var prices = document.querySelectorAll(".product-card__name-price span");
  for (var i = 0; i < prices.length; i++) {
    if (prices[i].innerHTML.indexOf("Sale") > -1) {
      if (prices[i].innerHTML.indexOf("from") > -1) {
        prices[i].innerHTML = prices[i].innerHTML.split("from").pop();
      } else {
        prices[i].innerHTML = prices[i].innerHTML.split("Sale").pop();
      }
    }
  }
  var products = document.querySelectorAll(".product-card__sale");
  for (var i = 0; i < products.length; i++) {
    products[i]
      .querySelector("div.sale")
      .insertAdjacentHTML("afterbegin", '<div class="button__sale">Sale</div>');
  }
});
