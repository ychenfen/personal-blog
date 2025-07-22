/**
 * Personal Website - Main JavaScript
 * Handles all interactive functionality and animations
 */

// Utility functions
const utils = {
  // Debounce function to limit function calls
  debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  // Throttle function to limit function calls
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Check if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Smooth scroll to element
  scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Navigation functionality
class Navigation {
  constructor() {
    this.header = document.querySelector('.header');
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav__link');
    this.currentSection = '';

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateActiveSection();
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.navToggle && this.navMenu) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Navigation links smooth scroll
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });

    // Header scroll effect
    window.addEventListener('scroll', utils.throttle(() => {
      this.handleScroll();
    }, 100));

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Handle ESC key to close mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    const isActive = this.navMenu.classList.contains('active');
    
    if (isActive) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.navMenu.classList.add('active');
    this.navToggle.classList.add('active');
    this.navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
    this.navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  handleNavClick(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    
    if (href.startsWith('#')) {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        const headerHeight = this.header.offsetHeight;
        utils.scrollToElement(targetElement, headerHeight + 20);
        this.closeMobileMenu();
      }
    }
  }

  handleScroll() {
    const scrollTop = window.pageYOffset;
    
    // Add scrolled class to header
    if (scrollTop > 100) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }

    // Update active navigation item
    this.updateActiveSection();
  }

  updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const headerHeight = this.header.offsetHeight;
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top - headerHeight - 100;
      const sectionBottom = rect.bottom - headerHeight - 100;
      
      if (sectionTop <= 0 && sectionBottom > 0) {
        const newSection = section.getAttribute('id');
        if (newSection !== this.currentSection) {
          this.currentSection = newSection;
          this.updateActiveNavLink(newSection);
        }
      }
    });
  }

  updateActiveNavLink(sectionId) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      }
    });
  }
}

// Project filtering functionality
class ProjectFilter {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.projectCards = document.querySelectorAll('.project-card');

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleFilterClick(e));
    });
  }

  handleFilterClick(e) {
    const filterValue = e.target.getAttribute('data-filter');
    
    // Update active button
    this.filterButtons.forEach(btn => btn.classList.remove('filter-btn--active'));
    e.target.classList.add('filter-btn--active');

    // Filter projects
    this.filterProjects(filterValue);
  }

  filterProjects(filter) {
    this.projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      
      if (filter === 'all' || category === filter) {
        card.style.display = 'block';
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.opacity = '1';
        }, 100);
      } else {
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }
}

// Contact form functionality
class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.submitButton = this.form?.querySelector('button[type="submit"]');
    this.successMessage = document.getElementById('form-success');

    if (this.form) {
      this.init();
    }
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    this.setLoadingState(true);

    try {
      // Simulate form submission
      await this.simulateFormSubmission();
      this.showSuccess();
      this.form.reset();
    } catch (error) {
      this.showError('发送失败，请稍后重试。');
    } finally {
      this.setLoadingState(false);
    }
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    this.clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      errorMessage = '此字段为必填项';
      isValid = false;
    }

    // Email validation
    if (fieldName === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = '请输入有效的邮箱地址';
        isValid = false;
      }
    }

    // Name validation
    if (fieldName === 'name' && value && value.length < 2) {
      errorMessage = '姓名至少需要2个字符';
      isValid = false;
    }

    // Message validation
    if (fieldName === 'message' && value && value.length < 10) {
      errorMessage = '消息内容至少需要10个字符';
      isValid = false;
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  setLoadingState(isLoading) {
    const buttonText = this.submitButton.querySelector('.btn__text');
    const buttonLoading = this.submitButton.querySelector('.btn__loading');
    
    if (isLoading) {
      this.submitButton.disabled = true;
      buttonText.style.display = 'none';
      buttonLoading.style.display = 'flex';
    } else {
      this.submitButton.disabled = false;
      buttonText.style.display = 'block';
      buttonLoading.style.display = 'none';
    }
  }

  showSuccess() {
    this.successMessage.style.display = 'flex';
    setTimeout(() => {
      this.successMessage.style.display = 'none';
    }, 5000);
  }

  showError(message) {
    alert(message); // Simple error handling - could be improved with toast notifications
  }

  async simulateFormSubmission() {
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }
}

// Skills animation
class SkillsAnimation {
  constructor() {
    this.skillBars = document.querySelectorAll('.skill-item__progress');
    this.animated = false;

    this.init();
  }

  init() {
    this.observeSkillsSection();
  }

  observeSkillsSection() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated) {
          this.animateSkillBars();
          this.animated = true;
        }
      });
    }, {
      threshold: 0.3
    });

    observer.observe(skillsSection);
  }

  animateSkillBars() {
    this.skillBars.forEach((bar, index) => {
      setTimeout(() => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
      }, index * 200);
    });
  }
}

// Scroll animations
class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll('.fade-in');
    
    this.init();
  }

  init() {
    this.observeElements();
  }

  observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.animatedElements.forEach(element => {
      element.style.opacity = '0';
      observer.observe(element);
    });
  }
}

// Back to top button
class BackToTop {
  constructor() {
    this.button = document.getElementById('back-to-top');
    
    if (this.button) {
      this.init();
    }
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('scroll', utils.throttle(() => {
      this.toggleVisibility();
    }, 100));

    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  toggleVisibility() {
    if (window.pageYOffset > 300) {
      this.button.style.display = 'flex';
      setTimeout(() => {
        this.button.style.opacity = '1';
      }, 10);
    } else {
      this.button.style.opacity = '0';
      setTimeout(() => {
        this.button.style.display = 'none';
      }, 300);
    }
  }
}

// Lazy loading for images
class LazyLoading {
  constructor() {
    this.images = document.querySelectorAll('img[loading="lazy"]');
    
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observeImages();
    } else {
      // Fallback for older browsers
      this.loadAllImages();
    }
  }

  observeImages() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    this.images.forEach(img => observer.observe(img));
  }

  loadImage(img) {
    img.src = img.dataset.src || img.src;
    img.classList.add('loaded');
  }

  loadAllImages() {
    this.images.forEach(img => this.loadImage(img));
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    this.measurePageLoad();
    this.measureLargestContentfulPaint();
    this.measureFirstInputDelay();
  }

  measurePageLoad() {
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`Page load time: ${loadTime}ms`);
      
      // Send to analytics if needed
      if (typeof gtag !== 'undefined') {
        gtag('event', 'page_load_time', {
          value: Math.round(loadTime),
          custom_parameter: 'milliseconds'
        });
      }
    });
  }

  measureLargestContentfulPaint() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log(`Largest Contentful Paint: ${lastEntry.startTime}ms`);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  measureFirstInputDelay() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          console.log(`First Input Delay: ${entry.processingStart - entry.startTime}ms`);
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    }
  }
}

// Theme handling
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'auto';
    
    this.init();
  }

  init() {
    this.applyTheme();
    this.listenForSystemThemeChange();
  }

  applyTheme() {
    if (this.theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else if (this.theme === 'light') {
      document.documentElement.classList.remove('dark-theme');
    } else {
      // Auto theme - follow system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
    }
  }

  listenForSystemThemeChange() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.theme === 'auto') {
        this.applyTheme();
      }
    });
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme();
  }
}

// Error handling and logging
class ErrorHandler {
  constructor() {
    this.init();
  }

  init() {
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: 'Unhandled Promise Rejection',
        error: event.reason
      });
    });
  }

  logError(errorInfo) {
    console.error('Error logged:', errorInfo);
    
    // In production, send to error logging service
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service like Sentry
      // Sentry.captureException(errorInfo);
    }
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  new Navigation();
  new ContactForm();
  new SkillsAnimation();
  new ScrollAnimations();
  new BackToTop();
  new LazyLoading();
  new PerformanceMonitor();
  new ThemeManager();
  new ErrorHandler();

  // Initialize Blog System
  initializeBlogSystem();

  // Add loading class removal
  document.body.classList.remove('loading');
  
  // Initialize any external libraries
  initializeExternalLibraries();
});

// Blog System initialization
function initializeBlogSystem() {
  console.log('Starting blog system initialization...');
  
  // Check if Blog system is available
  if (typeof BlogSystem === 'undefined') {
    console.error('Blog system module not loaded');
    return;
  }

  // Check if container exists
  const container = document.getElementById('blog-container');
  if (!container) {
    console.error('Blog container not found in DOM');
    return;
  }

  console.log('Blog container found, creating BlogSystem...');

  // Blog system options
  const blogOptions = {
    postsPerPage: 6,        // 每页显示文章数
    showExcerpt: true,      // 显示文章摘要
    enableSearch: true,     // 启用搜索功能
    enableCategories: true  // 启用分类筛选
  };

  // Initialize blog system
  try {
    const blogSystem = new BlogSystem('blog-container', blogOptions);
    
    // Store reference globally for potential future use
    window.blogSystem = blogSystem;
    
    console.log('Blog system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize blog system:', error);
    
    // Fallback: show error message in blog section
    const blogContainer = document.getElementById('blog-container');
    if (blogContainer) {
      blogContainer.innerHTML = `
        <div class="blog-error">
          <div class="error-message">
            <h3>博客系统加载失败</h3>
            <p>博客内容暂时无法显示，请稍后重试。</p>
            <button class="btn btn--primary" onclick="location.reload()">重新加载</button>
          </div>
        </div>
      `;
    }
  }
}

// External libraries initialization
function initializeExternalLibraries() {
  // Initialize Google Analytics if available
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID');
  }

  // Initialize any other third-party libraries
  initializeTypewriter();
}

// Typewriter effect for hero section
function initializeTypewriter() {
  const typewriterElement = document.querySelector('.hero__subtitle');
  if (!typewriterElement) return;

  const texts = [
    '前端开发工程师',
    'React 专家',
    'UI/UX 爱好者',
    '全栈开发者'
  ];
  
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function typeWriter() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
      typewriterElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typeSpeed = 500; // Pause before starting new text
    }
    
    setTimeout(typeWriter, typeSpeed);
  }
  
  // Start typewriter effect after initial delay
  setTimeout(typeWriter, 1000);
}

// Utility functions for external use
window.PersonalWebsite = {
  utils,
  scrollToSection: (sectionId) => {
    const section = document.getElementById(sectionId);
    const header = document.querySelector('.header');
    if (section && header) {
      utils.scrollToElement(section, header.offsetHeight + 20);
    }
  },
  
  // Expose theme manager for potential theme switcher
  setTheme: (theme) => {
    if (window.themeManager) {
      window.themeManager.setTheme(theme);
    }
  }
};

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Navigation,
    ProjectFilter,
    ContactForm,
    SkillsAnimation,
    ScrollAnimations,
    BackToTop,
    LazyLoading,
    PerformanceMonitor,
    ThemeManager,
    ErrorHandler,
    utils
  };
}