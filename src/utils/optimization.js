// Performance optimization utilities
export class PerformanceOptimizer {
  constructor() {
    this.imageObserver = null
    this.intersectionObserver = null
    this.preloadCache = new Map()
    this.lazyImages = new Set()
    this.init()
  }

  init() {
    this.setupLazyLoading()
    this.setupImageOptimization()
    // Disable preloading to prevent 404 errors
    // this.setupPreloading()
    this.setupCaching()
    // Disable code splitting to prevent conflicts with Vue Router
    // this.setupCodeSplitting()
  }

  // Lazy Loading Implementation
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadElement(entry.target)
              this.intersectionObserver.unobserve(entry.target)
            }
          })
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.1
        }
      )
    }

    // Observe all lazy elements
    this.observeLazyElements()
  }

  observeLazyElements() {
    const lazyElements = document.querySelectorAll('[data-lazy]')
    lazyElements.forEach(element => {
      if (this.intersectionObserver) {
        this.intersectionObserver.observe(element)
      } else {
        // Fallback for browsers without IntersectionObserver
        this.loadElement(element)
      }
    })
  }

  loadElement(element) {
    const src = element.dataset.src
    const srcset = element.dataset.srcset
    
    if (src) {
      if (element.tagName === 'IMG') {
        element.src = src
        if (srcset) element.srcset = srcset
        element.classList.add('loaded')
      } else if (element.tagName === 'VIDEO') {
        element.src = src
        element.load()
      } else {
        // For background images
        element.style.backgroundImage = `url(${src})`
      }
      
      element.removeAttribute('data-lazy')
      element.removeAttribute('data-src')
      element.removeAttribute('data-srcset')
    }
  }

  // Image Optimization
  setupImageOptimization() {
    this.imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.optimizeImage(entry.target)
            this.imageObserver.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '100px 0px' }
    )

    // Observe all images
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      if (!img.classList.contains('no-optimize')) {
        this.imageObserver.observe(img)
      }
    })
  }

  optimizeImage(img) {
    // Add loading="lazy" for native lazy loading
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy')
    }

    // Add decoding="async" for better performance
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async')
    }

    // Generate responsive images
    this.generateResponsiveImages(img)
  }

  generateResponsiveImages(img) {
    const src = img.src
    if (!src || img.dataset.responsive) return

    const sizes = [320, 640, 768, 1024, 1200, 1920]
    const srcset = sizes
      .map(size => `${this.resizeImageUrl(src, size)} ${size}w`)
      .join(', ')

    img.srcset = srcset
    img.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    img.dataset.responsive = 'true'
  }

  resizeImageUrl(url, width) {
    // This would integrate with your image service/CDN
    // For now, return the original URL
    return url
  }

  // Preloading Strategy
  setupPreloading() {
    this.preloadCriticalResources()
    this.preloadOnHover()
    this.preloadOnScroll()
  }

  preloadCriticalResources() {
    const criticalResources = [
      '/fonts/main-font.woff2',
      '/css/critical.css',
      '/js/main.js'
    ]

    criticalResources.forEach(resource => {
      this.preloadResource(resource)
    })
  }

  preloadResource(href, as = 'script') {
    if (this.preloadCache.has(href)) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    
    if (as === 'font') {
      link.crossOrigin = 'anonymous'
    }

    document.head.appendChild(link)
    this.preloadCache.set(href, true)
  }

  preloadOnHover() {
    const links = document.querySelectorAll('a[href^="/"]')
    
    links.forEach(link => {
      let preloadTimeout
      
      link.addEventListener('mouseenter', () => {
        preloadTimeout = setTimeout(() => {
          this.preloadPage(link.href)
        }, 200)
      })
      
      link.addEventListener('mouseleave', () => {
        clearTimeout(preloadTimeout)
      })
    })
  }

  preloadPage(url) {
    if (this.preloadCache.has(url)) return

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
    
    this.preloadCache.set(url, true)
  }

  preloadOnScroll() {
    let ticking = false
    
    const preloadOnScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      
      if (scrollPercent > 70 && !this.preloadCache.has('next-page')) {
        this.preloadNextPage()
        this.preloadCache.set('next-page', true)
      }
      
      ticking = false
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(preloadOnScroll)
        ticking = true
      }
    })
  }

  preloadNextPage() {
    // Preload likely next pages based on current route
    const currentPath = window.location.pathname
    const nextPages = this.getNextPages(currentPath)
    
    nextPages.forEach(page => {
      this.preloadPage(page)
    })
  }

  getNextPages(currentPath) {
    const pageMap = {
      '/': ['/about', '/projects'],
      '/about': ['/experience', '/skills'],
      '/projects': ['/skills', '/contact'],
      '/skills': ['/experience', '/contact'],
      '/experience': ['/contact'],
      '/contact': ['/']
      // '/blog': ['/contact', '/'] // Blog route hidden
    }
    
    return pageMap[currentPath] || []
  }

  // Caching Strategy
  setupCaching() {
    this.setupServiceWorkerCache()
    this.setupMemoryCache()
    this.setupLocalStorageCache()
  }

  setupServiceWorkerCache() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration)
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error)
        })
    }
  }

  setupMemoryCache() {
    // Cache API responses in memory
    this.apiCache = new Map()
    
    // Cache frequently accessed DOM elements
    this.domCache = new Map()
  }

  setupLocalStorageCache() {
    // Cache user preferences and settings
    this.cacheUserPreferences()
    this.cacheFormData()
  }

  cacheUserPreferences() {
    const preferences = {
      theme: localStorage.getItem('portfolio-theme'),
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
    
    localStorage.setItem('user-preferences', JSON.stringify(preferences))
  }

  cacheFormData() {
    // Cache form data to prevent loss on page refresh
    const forms = document.querySelectorAll('form')
    forms.forEach(form => {
      form.addEventListener('input', () => {
        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())
        localStorage.setItem(`form-${form.id}`, JSON.stringify(data))
      })
    })
  }

  // Bundle Splitting and Code Splitting
  setupCodeSplitting() {
    // Dynamic imports for route-based code splitting
    this.setupRouteBasedSplitting()
    this.setupComponentBasedSplitting()
  }

  setupRouteBasedSplitting() {
    // Disabled to prevent conflicts with Vue Router
    // Vue Router handles its own dynamic imports
    console.log('Route-based splitting disabled to prevent Vue Router conflicts')
  }

  setupComponentBasedSplitting() {
    // Lazy load heavy components
    const heavyComponents = [
      'ThreeScene',
      'AnalyticsDashboard',
      'InteractiveTimeline',
      'SkillVisualization',
      'ProjectShowcase'
    ]

    heavyComponents.forEach(component => {
      this.lazyLoadComponent(component)
    })
  }

  lazyLoadComponent(componentName) {
    const elements = document.querySelectorAll(`[data-component="${componentName}"]`)
    
    if (elements.length > 0 && this.intersectionObserver) {
      elements.forEach(element => {
        this.intersectionObserver.observe(element)
      })
    }
  }

  // Performance Monitoring
  setupPerformanceMonitoring() {
    this.monitorCoreWebVitals()
    this.monitorResourceTiming()
    this.monitorUserTiming()
  }

  monitorCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      console.log('LCP:', lastEntry.startTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime)
      })
    }).observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      console.log('CLS:', clsValue)
    }).observe({ entryTypes: ['layout-shift'] })
  }

  monitorResourceTiming() {
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource')
      resources.forEach(resource => {
        if (resource.duration > 1000) {
          console.warn('Slow resource:', resource.name, resource.duration)
        }
      })
    })
  }

  monitorUserTiming() {
    // Mark important milestones
    performance.mark('app-start')
    
    window.addEventListener('load', () => {
      performance.mark('app-loaded')
      performance.measure('app-load-time', 'app-start', 'app-loaded')
    })
  }

  // Cleanup
  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
    }
    
    if (this.imageObserver) {
      this.imageObserver.disconnect()
    }
    
    this.preloadCache.clear()
    this.apiCache.clear()
    this.domCache.clear()
  }
}

// Accessibility utilities
export class AccessibilityEnhancer {
  constructor() {
    this.init()
  }

  init() {
    this.setupKeyboardNavigation()
    this.setupScreenReaderSupport()
    this.setupFocusManagement()
    this.setupARIALabels()
    this.setupColorContrast()
    this.setupReducedMotion()
  }

  // Keyboard Navigation
  setupKeyboardNavigation() {
    this.setupTabNavigation()
    this.setupArrowKeyNavigation()
    this.setupEscapeKeyHandling()
    this.setupEnterKeyHandling()
  }

  setupTabNavigation() {
    // Ensure proper tab order
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )

    focusableElements.forEach((element, index) => {
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', index + 1)
      }
    })
  }

  setupArrowKeyNavigation() {
    // Arrow key navigation for custom components
    const customComponents = document.querySelectorAll('[data-arrow-nav]')
    
    customComponents.forEach(component => {
      component.addEventListener('keydown', (e) => {
        const items = component.querySelectorAll('[data-nav-item]')
        const currentIndex = Array.from(items).indexOf(document.activeElement)
        
        switch (e.key) {
          case 'ArrowDown':
          case 'ArrowRight':
            e.preventDefault()
            const nextIndex = (currentIndex + 1) % items.length
            items[nextIndex].focus()
            break
          case 'ArrowUp':
          case 'ArrowLeft':
            e.preventDefault()
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
            items[prevIndex].focus()
            break
        }
      })
    })
  }

  setupEscapeKeyHandling() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close modals
        const modals = document.querySelectorAll('.modal-overlay')
        modals.forEach(modal => {
          if (modal.style.display !== 'none') {
            modal.style.display = 'none'
          }
        })

        // Close dropdowns
        const dropdowns = document.querySelectorAll('.dropdown-menu.show')
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('show')
        })
      }
    })
  }

  setupEnterKeyHandling() {
    // Handle Enter key for custom interactive elements
    const customButtons = document.querySelectorAll('[data-enter-action]')
    
    customButtons.forEach(button => {
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          button.click()
        }
      })
    })
  }

  // Screen Reader Support
  setupScreenReaderSupport() {
    this.setupLiveRegions()
    this.setupDescriptiveText()
    this.setupSemanticHTML()
  }

  setupLiveRegions() {
    // Create live regions for dynamic content
    const liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', 'polite')
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    liveRegion.id = 'live-region'
    document.body.appendChild(liveRegion)
  }

  announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region')
    if (liveRegion) {
      liveRegion.textContent = message
      setTimeout(() => {
        liveRegion.textContent = ''
      }, 1000)
    }
  }

  setupDescriptiveText() {
    // Add descriptive text for complex UI elements
    const complexElements = document.querySelectorAll('[data-description]')
    
    complexElements.forEach(element => {
      const description = element.dataset.description
      const descriptionId = `desc-${Math.random().toString(36).substr(2, 9)}`
      
      element.setAttribute('aria-describedby', descriptionId)
      
      const descElement = document.createElement('div')
      descElement.id = descriptionId
      descElement.className = 'sr-only'
      descElement.textContent = description
      
      element.parentNode.insertBefore(descElement, element.nextSibling)
    })
  }

  setupSemanticHTML() {
    // Ensure proper semantic structure
    this.addLandmarkRoles()
    this.addHeadingStructure()
    this.addListStructure()
  }

  addLandmarkRoles() {
    const landmarks = {
      'header': 'banner',
      'nav': 'navigation',
      'main': 'main',
      'aside': 'complementary',
      'footer': 'contentinfo'
    }

    Object.entries(landmarks).forEach(([tag, role]) => {
      const elements = document.querySelectorAll(tag)
      elements.forEach(element => {
        if (!element.hasAttribute('role')) {
          element.setAttribute('role', role)
        }
      })
    })
  }

  addHeadingStructure() {
    // Ensure proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let lastLevel = 0

    headings.forEach(heading => {
      const currentLevel = parseInt(heading.tagName.charAt(1))
      
      if (currentLevel > lastLevel + 1) {
        console.warn('Heading hierarchy skipped:', heading)
      }
      
      lastLevel = currentLevel
    })
  }

  addListStructure() {
    // Ensure proper list structure
    const lists = document.querySelectorAll('ul, ol')
    
    lists.forEach(list => {
      const items = list.querySelectorAll('li')
      if (items.length === 0) {
        console.warn('Empty list found:', list)
      }
    })
  }

  // Focus Management
  setupFocusManagement() {
    this.setupFocusTrapping()
    this.setupFocusIndicators()
    this.setupSkipLinks()
  }

  setupFocusTrapping() {
    const modals = document.querySelectorAll('.modal-overlay')
    
    modals.forEach(modal => {
      const focusableElements = modal.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )
      
      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]
        
        modal.addEventListener('keydown', (e) => {
          if (e.key === 'Tab') {
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault()
                lastElement.focus()
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault()
                firstElement.focus()
              }
            }
          }
        })
      }
    })
  }

  setupFocusIndicators() {
    // Enhanced focus indicators
    const style = document.createElement('style')
    style.textContent = `
      *:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      
      .focus-visible {
        outline: 3px solid var(--primary-color);
        outline-offset: 3px;
      }
    `
    document.head.appendChild(style)
  }

  setupSkipLinks() {
    const skipLink = document.createElement('a')
    skipLink.href = '#main-content'
    skipLink.textContent = 'Skip to main content'
    skipLink.className = 'skip-link'
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--primary-color);
      color: white;
      padding: 8px;
      text-decoration: none;
      z-index: 10000;
      transition: top 0.3s;
    `
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px'
    })
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px'
    })
    
    document.body.insertBefore(skipLink, document.body.firstChild)
  }

  // ARIA Labels
  setupARIALabels() {
    this.addARIALabels()
    this.addARIARoles()
    this.addARIAStates()
  }

  addARIALabels() {
    // Add labels for unlabeled form elements
    const unlabeledInputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])')
    
    unlabeledInputs.forEach(input => {
      const label = document.querySelector(`label[for="${input.id}"]`)
      if (!label) {
        const placeholder = input.placeholder || input.name || 'Input field'
        input.setAttribute('aria-label', placeholder)
      }
    })
  }

  addARIARoles() {
    // Add roles for custom components
    const customComponents = {
      '.carousel': 'region',
      '.tablist': 'tablist',
      '.tab': 'tab',
      '.tabpanel': 'tabpanel',
      '.dialog': 'dialog',
      '.alert': 'alert',
      '.progressbar': 'progressbar'
    }

    Object.entries(customComponents).forEach(([selector, role]) => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(element => {
        if (!element.hasAttribute('role')) {
          element.setAttribute('role', role)
        }
      })
    })
  }

  addARIAStates() {
    // Add states for interactive elements
    const interactiveElements = document.querySelectorAll('[data-expanded], [data-selected], [data-pressed]')
    
    interactiveElements.forEach(element => {
      if (element.dataset.expanded !== undefined) {
        element.setAttribute('aria-expanded', element.dataset.expanded)
      }
      if (element.dataset.selected !== undefined) {
        element.setAttribute('aria-selected', element.dataset.selected)
      }
      if (element.dataset.pressed !== undefined) {
        element.setAttribute('aria-pressed', element.dataset.pressed)
      }
    })
  }

  // Color Contrast
  setupColorContrast() {
    this.checkColorContrast()
    this.setupHighContrastMode()
  }

  checkColorContrast() {
    const elements = document.querySelectorAll('*')
    
    elements.forEach(element => {
      const styles = window.getComputedStyle(element)
      const backgroundColor = styles.backgroundColor
      const color = styles.color
      
      if (backgroundColor !== 'rgba(0, 0, 0, 0)' && color !== 'rgba(0, 0, 0, 0)') {
        const contrast = this.calculateContrast(backgroundColor, color)
        
        if (contrast < 4.5) {
          console.warn('Low contrast ratio:', contrast, element)
        }
      }
    })
  }

  calculateContrast(color1, color2) {
    // Simplified contrast calculation
    // In a real implementation, you'd use a proper color contrast library
    return 4.5 // Placeholder
  }

  setupHighContrastMode() {
    // Detect high contrast mode preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      document.body.classList.add('high-contrast')
    }
  }

  // Reduced Motion
  setupReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduced-motion')
      
      // Disable animations
      const style = document.createElement('style')
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `
      document.head.appendChild(style)
    }
  }
}

// Initialize optimizations
export const performanceOptimizer = new PerformanceOptimizer()
export const accessibilityEnhancer = new AccessibilityEnhancer()
