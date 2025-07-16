// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });
  }

  // Close menu when clicking on a link
  const navItems = document.querySelectorAll(".nav-links a");
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      navLinks.classList.remove("active");
    });
  });

  // Menu Tab Navigation
  const menuTabs = document.querySelectorAll(".menu-tab");
  const menuContents = document.querySelectorAll(".menu-tab-content");

  if (menuTabs.length > 0) {
    menuTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs and contents
        menuTabs.forEach((t) => t.classList.remove("active"));
        menuContents.forEach((c) => c.classList.remove("active"));

        // Add active class to clicked tab
        this.classList.add("active");

        // Show corresponding content
        const tabId = this.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("active");
      });
    });
  }

  // Form validation
  const contactForm = document.querySelector(".contact-form form");
  const reservationForm = document.querySelector(".reservation-form form");

  function validateForm(e, form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll("[required]");

    // Clear previous error messages
    const errorMessages = form.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => msg.remove());

    // Check each required field
    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        const errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorMessage.style.color = "red";
        errorMessage.style.fontSize = "0.9rem";
        errorMessage.style.marginTop = "5px";
        errorMessage.textContent = "This field is required";
        field.parentNode.appendChild(errorMessage);
        field.style.borderColor = "red";
      } else {
        field.style.borderColor = "";
      }
    });

    // Validate email format if it exists
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailField.value)) {
        isValid = false;
        const errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorMessage.style.color = "red";
        errorMessage.style.fontSize = "0.9rem";
        errorMessage.style.marginTop = "5px";
        errorMessage.textContent = "Please enter a valid email address";
        emailField.parentNode.appendChild(errorMessage);
        emailField.style.borderColor = "red";
      }
    }

    // Validate phone number if it exists
    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && phoneField.value.trim()) {
      const phonePattern = /^[+]?[\d\s-]{8,15}$/;
      if (!phonePattern.test(phoneField.value)) {
        isValid = false;
        const errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorMessage.style.color = "red";
        errorMessage.style.fontSize = "0.9rem";
        errorMessage.style.marginTop = "5px";
        errorMessage.textContent = "Please enter a valid phone number";
        phoneField.parentNode.appendChild(errorMessage);
        phoneField.style.borderColor = "red";
      }
    }

    // Check for reservation date to be in the future
    const dateField = form.querySelector('input[type="date"]');
    if (dateField && dateField.value) {
      const selectedDate = new Date(dateField.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        isValid = false;
        const errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorMessage.style.color = "red";
        errorMessage.style.fontSize = "0.9rem";
        errorMessage.style.marginTop = "5px";
        errorMessage.textContent = "Please select a future date";
        dateField.parentNode.appendChild(errorMessage);
        dateField.style.borderColor = "red";
      }
    }

    if (!isValid) {
      e.preventDefault();
      // Scroll to the first error
      const firstError = form.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      validateForm(e, this);
    });
  }

  if (reservationForm) {
    reservationForm.addEventListener("submit", function (e) {
      validateForm(e, this);
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId !== "#") {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  // Set minimum date for reservation form
  const reservationDateInput = document.getElementById("res-date");
  if (reservationDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split("T")[0];
    reservationDateInput.setAttribute("min", formattedDate);
  }

  // Current year for copyright in footer
  const yearSpan = document.querySelector(".footer-bottom p");
  if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.innerHTML = yearSpan.innerHTML.replace("2025", currentYear);
  }

  // Add animation on scroll for sections
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  // document.querySelectorAll('section').forEach(section => {
  //     section.style.opacity = '0';
  //     section.style.transform = 'translateY(20px)';
  //     section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  //     observer.observe(section);
  // });

  // Add the visible class to already visible sections
  document.querySelectorAll("section.visible").forEach((section) => {
    section.style.opacity = "1";
    section.style.transform = "translateY(0)";
  });
});


import { db } from "../firebaseconfig.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 🧩 Create unified drink item with hot/cold buttons
function createDrinkItem(item) {
  const itemDiv = document.createElement("div");
  itemDiv.className = "menu-item";

  const imgSrc = item.image || "fallback.jpg";

  let hotHTML = "", coldHTML = "";

  if (item.hot?.price) {
    hotHTML = `
      <div class="drink-option">
        <span class="drink-type">Hot</span>
        <span class="drink-price">RM${item.hot.price.toFixed(2)}</span>
        <div class="quantity-controls">
          <button class="decrease">-</button>
          <span class="quantity">0</span>
          <button class="increase">+</button>
        </div>
      </div>
    `;
  }

  if (item.cold?.price) {
    coldHTML = `
      <div class="drink-option">
        <span class="drink-type">Cold</span>
        <span class="drink-price">RM${item.cold.price.toFixed(2)}</span>
        <div class="quantity-controls">
          <button class="decrease">-</button>
          <span class="quantity">0</span>
          <button class="increase">+</button>
        </div>
      </div>
    `;
  }

  itemDiv.innerHTML = `
    <img src="${imgSrc}" alt="${item.name}" class="item-img" style="width: 110px; height: 210px" />
    <div class="item-info">
      <div class="item-name">${item.name}</div>
      <div class="drink-options">
        ${hotHTML}
        ${coldHTML}
      </div>
      <button class="add-to-cart" disabled>Add to Cart</button>
    </div>
  `;

  return itemDiv;
}

// 🚀 Load drinks_hot and drinks_cold, merge items by name
async function loadCombinedDrinks() {
  const container = document.getElementById("drinksContainer");
  container.innerHTML = "";

  const hotSnapshot = await getDocs(collection(db, "menu/drinks_hot/items"));
  const coldSnapshot = await getDocs(collection(db, "menu/drinks_cold/items"));

  const drinkMap = new Map();

  // Merge hot drinks
  hotSnapshot.forEach((doc) => {
    const data = doc.data();
    const key = data.name;
    if (!drinkMap.has(key)) {
      drinkMap.set(key, { name: data.name, image: data.image });
    }
    drinkMap.get(key).hot = { price: data.price };
  });

  // Merge cold drinks
  coldSnapshot.forEach((doc) => {
    const data = doc.data();
    const key = data.name;
    if (!drinkMap.has(key)) {
      drinkMap.set(key, { name: data.name, image: data.image });
    }
    drinkMap.get(key).cold = { price: data.price };
  });

  // Render combined drinks
  drinkMap.forEach((drink) => {
    const itemElement = createDrinkItem(drink);
    container.appendChild(itemElement);
  });
}

// 🍜 Generic category loader for other sections
async function loadMenuCategory(category, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, `menu/${category}/items`));
  snapshot.forEach((doc) => {
    const item = doc.data();
    const itemElement = createMenuItem(item, category);
    container.appendChild(itemElement);
  });
}

// 📦 Reusable for non-drink items
function createMenuItem(item, category) {
  const itemDiv = document.createElement("div");
  itemDiv.className = "menu-item";

  let imgHTML = "";
  if (category !== "addOns") {
    const imgSrc = item.image || `Images/${item.name.replace(/\s+/g, "")}.jpeg`;
    imgHTML = `<img src="${imgSrc}" alt="${item.name}" class="item-img" style="width: 180px" />`;
  }

  itemDiv.innerHTML = `
    ${imgHTML}
    <div class="item-info">
      <div class="item-name">${item.name}</div>
      <div class="item-price">RM${item.price?.toFixed(2) ?? "-"}</div>
      <div class="cart-controls">
        <div class="quantity-controls">
          <button class="decrease">-</button>
          <span class="quantity">0</span>
          <button class="increase">+</button>
        </div>
        <button class="add-to-cart">Add to Cart</button>
      </div>
    </div>
  `;

  return itemDiv;
}

// 🔁 Run when page loads
window.onload = () => {
  loadMenuCategory("noodles", "noodlesContainer");
  loadMenuCategory("rice", "riceContainer");
  loadMenuCategory("soups", "soupsContainer");
  loadMenuCategory("snacks", "snacksContainer");
  loadMenuCategory("bread", "breadContainer");
  loadCombinedDrinks();
  loadMenuCategory("addOns", "addOnsContainer");
  loadMenuCategory("noodleTypes", "noodleTypesContainer");
};