/**
 * ANIMATIONS AU SCROLL - BMS VENTOUSE
 * Script pour déclencher les animations lors du scroll
 */

// Configuration des animations
const ANIMATION_CONFIG = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

// Initialisation des animations au scroll
function initScrollAnimations() {
  // Vérifier si les animations sont supportées
  if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver non supporté, animations désactivées');
    return;
  }

  // Respecter les préférences d'accessibilité
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('Animations réduites pour accessibilité');
    return;
  }

  // Créer l'observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Optionnel : arrêter d'observer après animation
        observer.unobserve(entry.target);
      }
    });
  }, ANIMATION_CONFIG);

  // Observer tous les éléments à animer
  const elementsToAnimate = document.querySelectorAll(`
    .card,
    [class*="card"],
    .service-card,
    [class*="service"],
    .stats-number,
    [class*="stats"],
    .faq-item,
    [class*="faq"],
    section > h1,
    section > h2,
    section > h3,
    .hero,
    .testimonial,
    [class*="testimonial"]
  `);

  elementsToAnimate.forEach((el, index) => {
    // Ajouter la classe d'animation avec délai progressif
    el.classList.add('animate-on-scroll');
    el.style.animationDelay = `${index * 0.1}s`;
    
    // Observer l'élément
    observer.observe(el);
  });
}

// Animation des compteurs (statistiques)
function animateCounters() {
  const counters = document.querySelectorAll('.stats-number, [class*="stats"] .number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
    const duration = 2000; // 2 secondes
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '') + (counter.textContent.includes('%') ? '%' : '');
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + (counter.textContent.includes('+') ? '+' : '') + (counter.textContent.includes('%') ? '%' : '');
      }
    };
    
    // Démarrer l'animation quand l'élément est visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(counter);
  });
}

// Animation du toggle de thème
function initThemeToggleAnimation() {
  const themeToggle = document.querySelector('[title*="thème"]');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      // Ajouter classe d'animation temporaire
      document.body.classList.add('theme-switching');
      
      setTimeout(() => {
        document.body.classList.remove('theme-switching');
      }, 300);
    });
  }
}

// Animation des boutons avec effet ripple
function initRippleEffect() {
  const buttons = document.querySelectorAll('.btn, button, [class*="btn"]');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Créer l'effet ripple
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple-effect');
      
      this.appendChild(ripple);
      
      // Supprimer l'effet après animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Animation des formulaires
function initFormAnimations() {
  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    // Animation focus
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      if (!this.value) {
        this.parentElement.classList.remove('focused');
      }
    });
    
    // Vérifier si déjà rempli au chargement
    if (input.value) {
      input.parentElement.classList.add('focused');
    }
  });
}

// Animation de parallaxe légère
function initParallaxEffect() {
  const parallaxElements = document.querySelectorAll('.hero, [class*="hero"]');
  
  if (parallaxElements.length === 0) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    parallaxElements.forEach(element => {
      element.style.transform = `translateY(${rate}px)`;
    });
  });
}

// Performance: Throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎬 Initialisation des micro-animations BMS Ventouse');
  
  // Délai pour laisser le CSS se charger
  setTimeout(() => {
    initScrollAnimations();
    animateCounters();
    initThemeToggleAnimation();
    initRippleEffect();
    initFormAnimations();
    initParallaxEffect();
    
    console.log('✅ Micro-animations initialisées avec succès');
  }, 100);
});

// Réinitialiser les animations si la page change (SPA)
window.addEventListener('popstate', () => {
  setTimeout(initScrollAnimations, 100);
});

// Export pour utilisation externe si nécessaire
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initScrollAnimations,
    animateCounters,
    initThemeToggleAnimation
  };
}

