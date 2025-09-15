/**
 * ANIMATIONS AU SCROLL CORRIGÉES - BMS VENTOUSE
 * Script optimisé pour les vrais éléments HTML du site
 */

// Configuration des animations
const ANIMATION_CONFIG = {
  threshold: 0.15,
  rootMargin: '0px 0px -100px 0px'
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
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Délai progressif pour un effet échelonné
        setTimeout(() => {
          entry.target.classList.add('in-view');
        }, index * 100);
        
        // Arrêter d'observer après animation
        observer.unobserve(entry.target);
      }
    });
  }, ANIMATION_CONFIG);

  // Sélecteurs spécifiques pour les éléments réels du site
  const elementsToAnimate = document.querySelectorAll(`
    .grid > div,
    .services-grid > div,
    article,
    .service-card,
    [class*="service"],
    .card,
    [class*="card"],
    section h1,
    section h2,
    section h3,
    .hero,
    .testimonial,
    [class*="testimonial"],
    .faq-item,
    [class*="faq"],
    .stats,
    [class*="stats"]
  `);

  console.log(`🎬 ${elementsToAnimate.length} éléments trouvés pour animation`);

  elementsToAnimate.forEach((el, index) => {
    // Ajouter la classe d'animation
    el.classList.add('animate-on-scroll');
    
    // Observer l'élément
    observer.observe(el);
  });
}

// Animation des compteurs (statistiques)
function animateCounters() {
  const counters = document.querySelectorAll(`
    .stats-number, 
    [class*="stats"] .number,
    [class*="stat"],
    [data-count]
  `);
  
  counters.forEach(counter => {
    const text = counter.textContent || counter.innerText;
    const target = parseInt(text.replace(/[^0-9]/g, ''));
    
    if (isNaN(target) || target === 0) return;
    
    const duration = 2000; // 2 secondes
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        const value = Math.floor(current);
        const suffix = text.includes('+') ? '+' : (text.includes('%') ? '%' : '');
        counter.textContent = value + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        const suffix = text.includes('+') ? '+' : (text.includes('%') ? '%' : '');
        counter.textContent = target + suffix;
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
    }, { threshold: 0.5 });
    
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
  const buttons = document.querySelectorAll(`
    .btn, 
    button, 
    [class*="btn"],
    a[class*="button"]
  `);
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Éviter les doublons
      const existingRipple = this.querySelector('.ripple-effect');
      if (existingRipple) {
        existingRipple.remove();
      }
      
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
        if (ripple.parentNode) {
          ripple.remove();
        }
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
      if (this.parentElement) {
        this.parentElement.classList.add('focused');
      }
    });
    
    input.addEventListener('blur', function() {
      if (!this.value && this.parentElement) {
        this.parentElement.classList.remove('focused');
      }
    });
    
    // Vérifier si déjà rempli au chargement
    if (input.value && input.parentElement) {
      input.parentElement.classList.add('focused');
    }
  });
}

// Optimisation des performances avec throttle
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
  console.log('🎬 Initialisation des animations corrigées BMS Ventouse');
  
  // Délai pour laisser le CSS se charger
  setTimeout(() => {
    initScrollAnimations();
    animateCounters();
    initThemeToggleAnimation();
    initRippleEffect();
    initFormAnimations();
    
    console.log('✅ Animations corrigées initialisées avec succès');
  }, 200);
});

// Réinitialiser les animations si la page change (SPA)
window.addEventListener('popstate', () => {
  setTimeout(() => {
    initScrollAnimations();
    animateCounters();
  }, 200);
});

// Export pour utilisation externe si nécessaire
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initScrollAnimations,
    animateCounters,
    initThemeToggleAnimation,
    initRippleEffect
  };
}

