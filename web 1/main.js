// Global variables
let cart = []
let cartTotal = 0

// DOM elements
const cartSidebar = document.getElementById("cartSidebar")
const cartOverlay = document.getElementById("cartOverlay")
const cartItems = document.getElementById("cartItems")
const cartTotalElement = document.getElementById("cartTotal")
const cartCount = document.querySelector(".cart-count")
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")

// Initialize the website
document.addEventListener("DOMContentLoaded", () => {
  initializeFilters()
  initializeNavigation()
  initializeContactForm()
  initializeNewsletter()
  loadCartFromStorage()
  updateCartDisplay()
})

// Navigation functionality
function initializeNavigation() {
  // Hamburger menu toggle
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    hamburger.classList.toggle("active")
    document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "auto"
  })

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      hamburger.classList.remove("active")
      document.body.style.overflow = "auto"
    })
  })

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar")
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(255, 255, 255, 0.98)"
      navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.95)"
      navbar.style.boxShadow = "none"
    }
  })
}

// Smooth scrolling function
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    const offsetTop = section.offsetTop - 80 // Account for fixed navbar
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    })
  }
}

// Product filtering functionality
function initializeFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const productCards = document.querySelectorAll(".product-card")

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter")

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      // Filter products with animation
      productCards.forEach((card, index) => {
        const category = card.getAttribute("data-category")

        if (filter === "all" || category === filter) {
          card.style.display = "block"
          setTimeout(() => {
            card.style.opacity = "1"
            card.style.transform = "translateY(0)"
          }, index * 100)
        } else {
          card.style.opacity = "0"
          card.style.transform = "translateY(20px)"
          setTimeout(() => {
            card.style.display = "none"
          }, 300)
        }
      })
    })
  })
}

// Shopping cart functionality
function toggleCart() {
  cartSidebar.classList.toggle("active")
  cartOverlay.classList.toggle("active")
  document.body.style.overflow = cartSidebar.classList.contains("active") ? "hidden" : "auto"
}

function addToCart(id, name, price, image) {
  const existingItem = cart.find((item) => item.id === id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      image: image,
      quantity: 1,
    })
  }

  updateCartDisplay()
  saveCartToStorage()
  showAddToCartAnimation()
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id)
  updateCartDisplay()
  saveCartToStorage()
}

function updateQuantity(id, change) {
  const item = cart.find((item) => item.id === id)
  if (item) {
    item.quantity += change
    if (item.quantity <= 0) {
      removeFromCart(id)
    } else {
      updateCartDisplay()
      saveCartToStorage()
    }
  }
}

function updateCartDisplay() {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems

  // Update cart total
  cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  cartTotalElement.textContent = cartTotal.toFixed(2)

  // Update cart items display
  cartItems.innerHTML = ""

  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>'
    return
  }

  cart.forEach((item) => {
    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"
    cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `
    cartItems.appendChild(cartItem)
  })
}

function showAddToCartAnimation() {
  // Create a temporary notification
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--gradient);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    `
  notification.textContent = "Item added to cart!"
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Animate out and remove
  setTimeout(() => {
    notification.style.transform = "translateX(400px)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 2000)
}

// Local storage functions
function saveCartToStorage() {
  localStorage.setItem("makeupCart", JSON.stringify(cart))
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem("makeupCart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
  }
}

// Contact form functionality
function initializeContactForm() {
  const contactForm = document.querySelector(".contact-form")

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault()

    // Get form data
    const formData = new FormData(this)
    const name = this.querySelector('input[type="text"]').value
    const email = this.querySelector('input[type="email"]').value
    const message = this.querySelector("textarea").value

    // Simulate form submission
    showNotification("Thank you for your message! We'll get back to you soon.", "success")

    // Reset form
    this.reset()
  })
}

// Newsletter functionality
function initializeNewsletter() {
  const newsletterForm = document.querySelector(".newsletter")

  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault()

    const email = this.querySelector('input[type="email"]').value

    if (email) {
      showNotification("Thank you for subscribing to our newsletter!", "success")
      this.querySelector('input[type="email"]').value = ""
    }
  })
}

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === "success" ? "#4CAF50" : "#2196F3"};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        max-width: 300px;
    `
  notification.textContent = message
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Animate out and remove
  setTimeout(() => {
    notification.style.transform = "translateX(400px)"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 4000)
}

// Checkout functionality
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("checkout-btn")) {
    if (cart.length === 0) {
      showNotification("Your cart is empty!", "error")
      return
    }

    // Simulate checkout process
    showNotification("Redirecting to checkout...", "info")

    setTimeout(() => {
      showNotification("Thank you for your purchase! (This is a demo)", "success")
      cart = []
      updateCartDisplay()
      saveCartToStorage()
      toggleCart()
    }, 2000)
  }
})

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(".featured-card, .product-card, .about-text, .contact-item")

  animateElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
})

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const offsetTop = target.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  })
})

// Image lazy loading
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Initialize lazy loading
document.addEventListener("DOMContentLoaded", lazyLoadImages)

// Search functionality (bonus feature)
function initializeSearch() {
  const searchInput = document.createElement("input")
  searchInput.type = "text"
  searchInput.placeholder = "Search products..."
  searchInput.style.cssText = `
        padding: 10px 15px;
        border: 2px solid #eee;
        border-radius: 25px;
        margin-right: 1rem;
        transition: border-color 0.3s ease;
    `

  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase()
    const productCards = document.querySelectorAll(".product-card")

    productCards.forEach((card) => {
      const productName = card.querySelector(".product-info h3").textContent.toLowerCase()
      if (productName.includes(searchTerm)) {
        card.style.display = "block"
      } else {
        card.style.display = "none"
      }
    })
  })

  // Add search to navigation (optional)
  // document.querySelector('.nav-menu').insertBefore(searchInput, document.querySelector('.cart-icon'));
}

// Performance optimization: Debounce function
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)"
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)"
    navbar.style.boxShadow = "none"
  }
}, 10)

window.addEventListener("scroll", optimizedScrollHandler)
