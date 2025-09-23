// Theme Toggle Script pour BMS Ventouse
(function() {
  const THEME_KEY = 'bms-theme';
  const themeToggle = document.getElementById('themeToggle');
  
  if (!themeToggle) return;

  // Fonction pour appliquer le thème
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.setAttribute('aria-pressed', 'true');
      themeToggle.title = 'Passer au thème clair';
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggle.setAttribute('aria-pressed', 'false');
      themeToggle.title = 'Passer au thème sombre';
    }
  }

  // Fonction pour basculer le thème
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme);
    
    // Sauvegarder la préférence
    try {
      localStorage.setItem(THEME_KEY, newTheme);
    } catch (e) {
      console.warn('Impossible de sauvegarder la préférence de thème');
    }
  }

  // Initialiser le thème au chargement
  function initTheme() {
    let savedTheme = null;
    
    // Essayer de récupérer la préférence sauvegardée
    try {
      savedTheme = localStorage.getItem(THEME_KEY);
    } catch (e) {
      console.warn('Impossible de récupérer la préférence de thème');
    }
    
    // Si pas de préférence sauvegardée, utiliser la préférence système
    if (!savedTheme) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        savedTheme = 'dark';
      } else {
        savedTheme = 'light';
      }
    }
    
    applyTheme(savedTheme);
  }

  // Écouter les changements de préférence système
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function(e) {
      // Seulement si aucune préférence n'est sauvegardée
      try {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (!savedTheme) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      } catch (e) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Ajouter l'événement de clic
  themeToggle.addEventListener('click', toggleTheme);

  // Initialiser le thème
  initTheme();
})();

