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

// a function to replace the addEventListener functionality

var events = [];

var on = function(type, selector, cb) {
  if (-1 < events.indexOf([type, selector, cb].toString())) {
    return;
  }
  events.push([type, selector, cb].toString());
  window.addEventListener(type, function(event) {
    var target = event.target.closest(selector);

    if (null === target) {
      return;
    }
    var callback = cb.bind(target);

    callback(event);
  });
};

//The new instance of Swiper had a timing issue. The script took too long to load
// so I start the instance after some time has passed to allow the script to run

var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";
document.querySelector("head").appendChild(s);

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

// This function is adding items to the cart when the user clicks the "add to cart button"

waitForElement(".product-card__add-to-cart", function() {
  var item = {
    id: 15928763482201,
    quantity: 1
  };
  on("click", ".product-card__add-to-cart", function(e) {
    e.preventDefault();
    item.id = e.target.getAttribute("data-variant-id");

    // This is grabbing the img src and the name of the item for the order confirmend pop up
    var image = e.target.previousElementSibling.src;
    var copy = e.target.parentElement.parentElement.nextElementSibling.querySelector(
      "p"
    ).innerHTML;

    fetch("/cart/add.js", {
      body: JSON.stringify(item),

      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    })
      .then(function(response) {
        return response.json();
      })
      .then(function() {
        // once the order is added to the cart then a small pop up should appear in the bottom left
        document.querySelector(".order-confirmation img").src = image;
        document.querySelector(".order-confirmation p span").innerHTML = copy;
        document.querySelector(".order-confirmation").classList.remove("hide");

        // once the order is added to the cart then add one number to the cart in the top right
        var regex = /\d+/g;
        var string = document.querySelector(".site-header__cart").innerText;
        var matches = string.match(regex);
        var svgImg = document.querySelector(".site-header__cart svg.icon");

        var replace = parseInt(matches) + 1;
        document.querySelector(".site-header__cart").innerText = string.replace(
          matches,
          replace.toString()
        );
        document.querySelector(".site-header__cart").innerHTML =
          svgImg.outerHTML + string.replace(matches, replace.toString());
      })
      .catch(function(err) {
        console.error(err);
      });
  });
});

waitForElement(".order-confirmation__close", function() {
  on("click", ".order-confirmation__close", function(e) {
    document.querySelector(".order-confirmation").classList.add("hide");
  });
});
