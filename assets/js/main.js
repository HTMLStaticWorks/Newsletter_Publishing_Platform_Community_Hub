document.addEventListener('DOMContentLoaded', () => {
  initBackgroundBlobs();
  initTheme();
  initRTL();
  initHeaderScroll();
  initMobileDrawer();
  initScrollReveal();
  initCounters();
  initAccordions();
  initButtonRipple();
  initPasswordStrength();
  initCharts();
  init3DTilt();
});

/* ==========================================================================
   1. DYNAMIC BACKGROUND GLOWING BLOBS (2026 SaaS style)
   ========================================================================== */
function initBackgroundBlobs() {
  if (document.querySelector('.glow-blob-container')) return;
  
  const container = document.createElement('div');
  container.className = 'glow-blob-container';
  
  const blob1 = document.createElement('div');
  blob1.className = 'glow-blob glow-blob-1';
  
  const blob2 = document.createElement('div');
  blob2.className = 'glow-blob glow-blob-2';
  
  const blob3 = document.createElement('div');
  blob3.className = 'glow-blob glow-blob-3';
  
  container.appendChild(blob1);
  container.appendChild(blob2);
  container.appendChild(blob3);
  
  document.body.prepend(container);
}

/* ==========================================================================
   2. THEME SWITCHER (LIGHT / DARK)
   ========================================================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcons(theme);
  };

  const updateThemeIcons = (theme) => {
    themeToggleBtns.forEach(btn => {
      const sunIcon = btn.querySelector('.sun-icon');
      const moonIcon = btn.querySelector('.moon-icon');
      if (theme === 'dark') {
        if (sunIcon) sunIcon.style.display = 'block';
        if (moonIcon) moonIcon.style.display = 'none';
      } else {
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';
      }
    });
  };

  // Initial load
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (systemPrefersDark) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  });
}

/* ==========================================================================
   3. RTL SWITCHER
   ========================================================================== */
function initRTL() {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const savedRTL = localStorage.getItem('rtl') === 'true';

  const setRTL = (isRtl) => {
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    localStorage.setItem('rtl', isRtl);
    updateRtlBtn(isRtl);
  };

  const updateRtlBtn = (isRtl) => {
    rtlToggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', isRtl ? 'Switch to LTR' : 'Switch to RTL');
      const labelText = btn.querySelector('.rtl-label');
      if (labelText) {
        labelText.textContent = isRtl ? 'EN' : 'AR';
      }
    });
  };

  // Initial load
  setRTL(savedRTL);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      setRTL(!isRtl);
    });
  });
}

/* ==========================================================================
   4. STICKY HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.sticky-header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll();
}

/* ==========================================================================
   5. MOBILE NAV DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const hamburger = document.querySelector('.hamburger-menu');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.backdrop');
  
  if (!hamburger || !drawer || !backdrop) return;

  const toggleMenu = () => {
    hamburger.classList.toggle('open');
    drawer.classList.toggle('open');
    backdrop.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', toggleMenu);

  // Close drawer on link clicks
  const links = drawer.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (drawer.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

/* ==========================================================================
   6. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Trigger once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback
    revealElements.forEach(el => el.classList.add('active'));
  }
}

/* ==========================================================================
   7. STATISTICAL COUNTERS ANIMATION
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  
  if (counters.length === 0) return;

  const startCounting = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const stepTime = Math.max(Math.floor(duration / target), 15);
    let current = 0;

    const timer = setInterval(() => {
      current += Math.ceil(target / (duration / stepTime));
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = current.toLocaleString() + suffix;
    }, stepTime);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounting(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  } else {
    counters.forEach(counter => startCounting(counter));
  }
}

/* ==========================================================================
   8. FAQ ACCORDION TRANSITIONS
   ========================================================================== */
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');
  
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      const container = item.closest('.accordion-container') || item.parentElement;
      container.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-content').style.maxHeight = '0px';
        }
      });

      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   9. BUTTON RIPPLE EFFECT
   ========================================================================== */
function initButtonRipple() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-accent');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/* ==========================================================================
   10. PASSWORD STRENGTH METER (SIGNUP)
   ========================================================================== */
function initPasswordStrength() {
  const passwordInput = document.querySelector('.password-strength-input');
  const strengthBars = document.querySelectorAll('.strength-bar');
  const strengthText = document.querySelector('.strength-text');
  
  if (!passwordInput || strengthBars.length === 0 || !strengthText) return;

  passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    let score = 0;
    
    if (password.length > 5) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;

    strengthBars.forEach(bar => {
      bar.style.backgroundColor = '';
    });

    const colors = ['#EF4444', '#F59E0B', '#10B981', '#10B981'];
    const textLabels = ['Too Weak', 'Weak', 'Medium', 'Strong'];

    if (password.length === 0) {
      strengthText.textContent = '';
      return;
    }

    strengthText.textContent = textLabels[score - 1] || 'Too Weak';
    strengthText.style.color = colors[score - 1] || colors[0];

    for (let i = 0; i < score; i++) {
      strengthBars[i].style.backgroundColor = colors[score - 1] || colors[0];
    }
  });
}

/* ==========================================================================
   11. INTERACTIVE SVG CHARTS GENERATOR
   ========================================================================== */
function initCharts() {
  const charts = document.querySelectorAll('.svg-chart');
  
  charts.forEach(chart => {
    const type = chart.getAttribute('data-type');
    const pointsData = chart.getAttribute('data-points');
    if (!pointsData) return;
    
    const points = pointsData.split(',').map(Number);
    const width = chart.clientWidth || 300;
    const height = chart.clientHeight || 150;
    const maxVal = Math.max(...points) * 1.1;
    
    chart.setAttribute('viewBox', `0 0 ${width} ${height}`);
    chart.innerHTML = '';
    
    const xStep = width / (points.length - 1);
    
    const coordinates = points.map((val, idx) => {
      const x = idx * xStep;
      const y = height - (val / maxVal) * (height - 20) - 10;
      return { x, y };
    });

    if (type === 'line' || type === 'area') {
      const gridG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gridG.setAttribute('stroke', 'var(--color-border)');
      gridG.setAttribute('stroke-width', '1');
      gridG.setAttribute('opacity', '0.5');
      
      for (let i = 1; i < 4; i++) {
        const y = (height / 4) * i;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', '0');
        line.setAttribute('y1', y);
        line.setAttribute('x2', width);
        line.setAttribute('y2', y);
        gridG.appendChild(line);
      }
      chart.appendChild(gridG);

      let d = `M ${coordinates[0].x} ${coordinates[0].y} `;
      for (let i = 1; i < coordinates.length; i++) {
        const cpX1 = coordinates[i-1].x + xStep / 2;
        const cpY1 = coordinates[i-1].y;
        const cpX2 = coordinates[i].x - xStep / 2;
        const cpY2 = coordinates[i].y;
        d += `C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${coordinates[i].x} ${coordinates[i].y} `;
      }

      if (type === 'area') {
        const fillPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const areaD = d + `L ${width} ${height} L 0 ${height} Z`;
        fillPath.setAttribute('d', areaD);
        fillPath.setAttribute('fill', 'url(#chartGrad)');
        fillPath.setAttribute('opacity', '0.15');
        
        let defs = chart.querySelector('defs');
        if (!defs) {
          defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
          const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
          grad.setAttribute('id', 'chartGrad');
          grad.setAttribute('x1', '0');
          grad.setAttribute('y1', '0');
          grad.setAttribute('x2', '0');
          grad.setAttribute('y2', '1');
          
          const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
          stop1.setAttribute('offset', '0%');
          stop1.setAttribute('stop-color', 'var(--color-primary)');
          
          const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
          stop2.setAttribute('offset', '100%');
          stop2.setAttribute('stop-color', 'var(--color-primary)');
          stop2.setAttribute('stop-opacity', '0');
          
          grad.appendChild(stop1);
          grad.appendChild(stop2);
          defs.appendChild(grad);
          chart.appendChild(defs);
        }
        chart.appendChild(fillPath);
      }

      const strokePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      strokePath.setAttribute('d', d);
      strokePath.setAttribute('fill', 'none');
      strokePath.setAttribute('stroke', 'var(--color-primary)');
      strokePath.setAttribute('stroke-width', '3');
      strokePath.setAttribute('stroke-linecap', 'round');
      
      const pathLength = width * 2;
      strokePath.style.strokeDasharray = pathLength;
      strokePath.style.strokeDashoffset = pathLength;
      strokePath.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)';
      
      chart.appendChild(strokePath);

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              strokePath.style.strokeDashoffset = '0';
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.3 });
        observer.observe(chart);
      } else {
        strokePath.style.strokeDashoffset = '0';
      }

      coordinates.forEach((coord, idx) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', coord.x);
        circle.setAttribute('cy', coord.y);
        circle.setAttribute('r', '5');
        circle.setAttribute('fill', 'var(--color-card)');
        circle.setAttribute('stroke', 'var(--color-primary)');
        circle.setAttribute('stroke-width', '2');
        circle.setAttribute('style', 'cursor: pointer; transition: transform var(--transition-fast); transform-origin: center;');
        circle.addEventListener('mouseover', () => circle.setAttribute('transform', 'scale(1.5)'));
        circle.addEventListener('mouseout', () => circle.removeAttribute('transform'));
        
        chart.appendChild(circle);
      });
    } else if (type === 'bar') {
      const barWidth = (width / points.length) * 0.7;
      const barSpacing = (width / points.length) * 0.3;
      
      coordinates.forEach((coord, idx) => {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const x = idx * (barWidth + barSpacing) + barSpacing/2;
        const barHeight = height - coord.y - 10;
        
        rect.setAttribute('x', x);
        rect.setAttribute('y', height - 10);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', '0');
        rect.setAttribute('fill', 'var(--color-primary)');
        rect.setAttribute('rx', '4');
        rect.setAttribute('style', 'transition: height 1.5s cubic-bezier(0.4, 0, 0.2, 1), y 1.5s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;');
        
        rect.addEventListener('mouseover', () => rect.setAttribute('fill', 'var(--color-secondary)'));
        rect.addEventListener('mouseout', () => rect.setAttribute('fill', 'var(--color-primary)'));

        chart.appendChild(rect);

        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                rect.setAttribute('y', coord.y);
                rect.setAttribute('height', barHeight);
                observer.unobserve(entry.target);
              }
            });
          }, { threshold: 0.3 });
          observer.observe(chart);
        } else {
          rect.setAttribute('y', coord.y);
          rect.setAttribute('height', barHeight);
        }
      });
    }
  });
}

/* ==========================================================================
   12. 3D CARD TILT & CURSOR SHIMMER (2026 SaaS Premium Interactivity)
   ========================================================================== */
function init3DTilt() {
  const cards = document.querySelectorAll('.premium-card, .creator-card, .glass-card, .db-stat-card, .db-panel, .team-card');
  
  cards.forEach(card => {
    // Inject shimmer tracking block if not present
    let shimmer = card.querySelector('.card-shimmer');
    if (!shimmer) {
      shimmer = document.createElement('span');
      shimmer.className = 'card-shimmer';
      card.appendChild(shimmer);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate tilt angles based on mouse offset from center
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const angleX = (centerY - y) / 18; // Max 10 degrees tilt
      const angleY = (x - centerX) / 18;

      // Apply 3D perspective rotation
      card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-5px) scale3d(1.01, 1.01, 1.01)`;
      
      // Update light shimmer coordinates dynamically
      shimmer.style.background = `radial-gradient(circle 180px at ${x}px ${y}px, rgba(255, 255, 255, 0.12), transparent)`;
    });

    card.addEventListener('mouseleave', () => {
      // Revert transition
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
      shimmer.style.background = 'transparent';
    });
  });
}
