/* ========================================
   FITFLOW WELLNESS - MAIN JAVASCRIPT
   Interactivity, Validation, Animations
   ======================================== */

// ===== CAROUSEL FUNCTIONALITY =====
class Carousel {
  constructor(carouselId) {
    this.carousel = document.getElementById(carouselId);
    this.slides = this.carousel.querySelectorAll('.slide');
    this.currentIndex = 0;
    this.autoPlayInterval = null;

    if (document.getElementById('prevSlide')) {
      document.getElementById('prevSlide').addEventListener('click', () => this.prev());
      document.getElementById('nextSlide').addEventListener('click', () => this.next());
    }

    this.autoPlay();
  }

  showSlide(index) {
    this.slides.forEach(slide => slide.classList.remove('active'));
    this.slides[index].classList.add('active');
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.showSlide(this.currentIndex);
    this.resetAutoPlay();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.showSlide(this.currentIndex);
    this.resetAutoPlay();
  }

  autoPlay() {
    this.autoPlayInterval = setInterval(() => this.next(), 4000);
  }

  resetAutoPlay() {
    clearInterval(this.autoPlayInterval);
    this.autoPlay();
  }
}

// ===== FORM VALIDATION =====
class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  validateRequired(value) {
    return value.trim().length > 0;
  }

  showError(fieldName, message) {
    const field = this.form.querySelector(`[name="${fieldName}"]`);
    if (field) {
      field.classList.add('error');
      field.style.borderColor = '#E63946';
      
      // Remove existing error message if any
      const existingError = field.nextElementSibling;
      if (existingError && existingError.classList.contains('error-message')) {
        existingError.remove();
      }

      // Add error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = message;
      errorDiv.style.color = '#E63946';
      errorDiv.style.fontSize = '0.85rem';
      errorDiv.style.marginTop = '5px';
      field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }
  }

  clearErrors() {
    const errorMessages = this.form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    const fields = this.form.querySelectorAll('.error');
    fields.forEach(field => {
      field.classList.remove('error');
      field.style.borderColor = 'var(--border)';
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.clearErrors();

    const formData = new FormData(this.form);
    let isValid = true;

    // Validate email
    const email = formData.get('email');
    if (email) {
      if (!this.validateRequired(email)) {
        this.showError('email', 'Email is required');
        isValid = false;
      } else if (!this.validateEmail(email)) {
        this.showError('email', 'Please enter a valid email');
        isValid = false;
      }
    }

    // Validate phone
    const phone = formData.get('phone');
    if (phone) {
      if (!this.validateRequired(phone)) {
        this.showError('phone', 'Phone number is required');
        isValid = false;
      } else if (!this.validatePhone(phone)) {
        this.showError('phone', 'Please enter a valid phone number');
        isValid = false;
      }
    }

    // Validate name
    const name = formData.get('name');
    if (name && !this.validateRequired(name)) {
      this.showError('name', 'Name is required');
      isValid = false;
    }

    // Validate message
    const message = formData.get('message');
    if (message && !this.validateRequired(message)) {
      this.showError('message', 'Message is required');
      isValid = false;
    }

    if (isValid) {
      this.showSuccessMessage();
      setTimeout(() => {
        this.form.reset();
      }, 1500);
    }
  }

  showSuccessMessage() {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert success';
    alertDiv.textContent = '✓ Thank you! Your message has been sent successfully.';
    this.form.parentNode.insertBefore(alertDiv, this.form);

    setTimeout(() => {
      alertDiv.style.animation = 'slideOutUp 0.4s ease-out forwards';
      setTimeout(() => alertDiv.remove(), 400);
    }, 3000);
  }
}

// ===== DARK MODE TOGGLE =====
class DarkModeToggle {
  constructor(buttonId) {
    this.button = document.getElementById(buttonId);
    this.loadTheme();
    if (this.button) {
      this.button.addEventListener('click', () => this.toggleTheme());
    }
  }

  toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark-mode');
    const isDark = html.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    this.updateIcon();
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    }
    this.updateIcon();
  }

  updateIcon() {
    const isDark = document.documentElement.classList.contains('dark-mode');
    if (this.button) {
      this.button.textContent = isDark ? '☀️' : '🌙';
    }
  }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('[data-animate]');
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    this.elements.forEach(el => this.observer.observe(el));
  }
}

// ===== SMOOTH SCROLL TO ANCHOR =====
class SmoothScroll {
  constructor() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
}

// ===== MOBILE MENU TOGGLE =====
class MobileMenu {
  constructor() {
    this.hamburger = document.querySelector('.hamburger');
    this.nav = document.querySelector('nav');
    
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMenu());
    }

    // Close menu when link is clicked
    if (this.nav) {
      this.nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });
    }
  }

  toggleMenu() {
    this.nav.classList.toggle('active');
    this.hamburger.classList.toggle('active');
  }

  closeMenu() {
    this.nav.classList.remove('active');
    this.hamburger.classList.remove('active');
  }
}

// ===== NOTIFICATION SYSTEM =====
class Notification {
  static show(message, type = 'success', duration = 3000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '80px';
    alertDiv.style.right = '20px';
    alertDiv.style.maxWidth = '400px';
    alertDiv.style.zIndex = '9999';
    
    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.style.animation = 'slideOutUp 0.4s ease-out forwards';
      setTimeout(() => alertDiv.remove(), 400);
    }, duration);
  }
}

// ===== COUNTER ANIMATION =====
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('[data-count]');
  }

  animate(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const counter = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(counter);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }

  startAnimations() {
    this.counters.forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.animate(counter, target);
          observer.unobserve(counter);
        }
      }, { threshold: 0.5 });

      observer.observe(counter);
    });
  }
}

// ===== FLOATING ANIMATION =====
function addFloatingAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    .floating {
      animation: float 3s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
  
  const elements = document.querySelectorAll('[data-float]');
  elements.forEach(el => el.classList.add('floating'));
}

// ===== COPY TO CLIPBOARD =====
function setupCopyToClipboard() {
  document.querySelectorAll('[data-copy]').forEach(element => {
    element.style.cursor = 'pointer';
    element.addEventListener('click', function() {
      const text = this.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        Notification.show('✓ Copied to clipboard!', 'success', 2000);
      });
    });
  });
}

// ===== UPDATE YEAR IN FOOTER =====
function updateYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ===== INITIALIZE ON DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  updateYear();
  
  new DarkModeToggle('themeToggle');
  new MobileMenu();
  new SmoothScroll();
  new ScrollAnimations();
  
  // Initialize carousel if it exists
  if (document.getElementById('carousel')) {
    new Carousel('carousel');
  }

  // Initialize forms
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    new FormValidator(form.id);
  });

  // Add floating animations
  addFloatingAnimation();
  
  // Setup copy to clipboard
  setupCopyToClipboard();

  // Initialize counters
  const counterAnimation = new CounterAnimation();
  counterAnimation.startAnimations();

  // Add scroll reveal animations
  const revealElements = document.querySelectorAll('[data-reveal]');
  revealElements.forEach((el, index) => {
    el.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s both`;
  });
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
  // Dark mode toggle with Ctrl+Shift+D
  if (e.ctrlKey && e.shiftKey && e.key === 'D') {
    document.getElementById('themeToggle')?.click();
  }
});

// ===== PERFORMANCE OPTIMIZATION =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Throttled scroll listener
window.addEventListener('scroll', throttle(function() {
  // Add scroll effects here if needed
}, 100));

// ===== EXPORT FUNCTIONS FOR EXTERNAL USE =====
window.FitFlow = {
  showNotification: Notification.show,
  toggleDarkMode: () => document.getElementById('themeToggle')?.click(),
};
