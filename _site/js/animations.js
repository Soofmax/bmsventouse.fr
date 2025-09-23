/* =========================================
   SYSTÈME D'ANIMATIONS JAVASCRIPT
   ========================================= */

class AnimationController {
  constructor() {
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupScrollAnimations();
    this.setupCounterAnimations();
    this.setupParallax();
    this.setupRippleEffect();
    this.setupFAQ();
    this.setupThemeToggle();
  }

  // Intersection Observer pour animations au scroll
  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          
          // Animation spéciale pour les cartes avec délai
          if (entry.target.classList.contains('service-card')) {
            const cards = entry.target.parentElement.querySelectorAll('.service-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate');
              }, index * 100);
            });
          }
        }
      });
    }, options);

    // Observer tous les éléments avec la classe animate-on-scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // Animations de scroll pour le header
  setupScrollAnimations() {
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Header avec effet de scroll
      if (header) {
        if (currentScrollY > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  // Animations pour les compteurs de statistiques
  setupCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000; // 2 secondes
      const increment = target / (duration / 16); // 60fps
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          counter.parentElement.classList.add('animate');
          animateCounter(counter);
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  // Effet parallax subtil
  setupParallax() {
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
      }, { passive: true });
    }
  }

  // Effet ripple sur les boutons
  setupRippleEffect() {
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }

  // Animations pour la FAQ
  setupFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
      question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        
        // Fermer les autres items
        document.querySelectorAll('.faq-item').forEach(item => {
          if (item !== faqItem) {
            item.classList.remove('open');
          }
        });
        
        // Toggle l'item actuel
        faqItem.classList.toggle('open');
      });
    });
  }

  // Toggle thème avec animation
  setupThemeToggle() {
    const themeToggle = document.querySelector('[data-theme-toggle]');
    const html = document.documentElement;
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Animation de transition
        html.style.transition = 'all 0.3s ease';
        html.setAttribute('data-theme', newTheme);
        
        // Sauvegarder la préférence
        localStorage.setItem('theme', newTheme);
        
        // Mettre à jour le bouton
        themeToggle.setAttribute('title', 
          newTheme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'
        );
        
        setTimeout(() => {
          html.style.transition = '';
        }, 300);
      });
    }
  }

  // Méthode pour ajouter des animations dynamiques
  addScrollAnimation(element, animationType = 'fadeInUp') {
    element.classList.add('animate-on-scroll');
    element.style.animationName = animationType;
  }

  // Méthode pour déclencher une animation
  triggerAnimation(element, animationClass) {
    element.classList.add(animationClass);
    
    element.addEventListener('animationend', () => {
      element.classList.remove(animationClass);
    }, { once: true });
  }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  new AnimationController();
});

// Optimisation des performances
window.addEventListener('load', () => {
  // Précharger les animations critiques
  document.body.classList.add('animations-loaded');
});

// Gestion du redimensionnement
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Recalculer les animations si nécessaire
    document.dispatchEvent(new CustomEvent('resize-complete'));
  }, 250);
}, { passive: true });

