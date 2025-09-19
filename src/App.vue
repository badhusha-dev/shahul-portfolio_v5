<template>
  <div id="app" :class="[themeClass, { 'theme-transitioning': themeTransition }]">
    <Navbar />
    <main>
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    <Footer />
    <ThemeToggle :current-theme="currentTheme" @update-theme="setTheme" />
    
    <!-- Analytics Dashboard -->
    <AnalyticsDashboard 
      :show="showAnalytics" 
      @close="showAnalytics = false"
    />
    
    <!-- Scroll to Top Button -->
    <button 
      class="scroll-to-top"
      :class="{ visible: showScrollToTop }"
      @click="scrollToTop"
      title="Scroll to top"
    >
      <i class="fas fa-chevron-up"></i>
    </button>

    <!-- Analytics Toggle Button -->
    <button 
      class="analytics-toggle"
      @click="toggleAnalytics"
      title="Toggle Analytics Dashboard (Ctrl+K)"
    >
      <i class="fas fa-chart-line"></i>
    </button>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import AnalyticsDashboard from './components/AnalyticsDashboard.vue'
import { analytics } from './utils/analytics.js'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
    ThemeToggle,
    AnalyticsDashboard
  },
  setup() {
    const currentTheme = ref('light')
    const showScrollToTop = ref(false)
    const showAnalytics = ref(false)
    const themeTransition = ref(false)

    const themeClass = computed(() => {
      return `theme-${currentTheme.value}`
    })

    const loadTheme = () => {
      const savedTheme = localStorage.getItem('portfolio-theme')
      if (savedTheme) {
        currentTheme.value = savedTheme
      } else {
        // Check system preference if no saved theme
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          currentTheme.value = 'dark'
        }
      }
    }

    const setTheme = (theme) => {
      themeTransition.value = true
      
      setTimeout(() => {
        currentTheme.value = theme
        localStorage.setItem('portfolio-theme', theme)
        
        setTimeout(() => {
          themeTransition.value = false
        }, 300)
      }, 150)
    }

    const handleScroll = () => {
      showScrollToTop.value = window.scrollY > 300
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    const toggleAnalytics = () => {
      showAnalytics.value = !showAnalytics.value
    }

    const checkContentVisibility = () => {
      const main = document.querySelector('main')
      const routerView = document.querySelector('.router-view')
      const currentPage = document.querySelector('.home-page, .about-page, .projects-page, .experience-page, .skills-page, .contact-page, .blog-page')
      
      console.log('🔍 Content Visibility Check:')
      console.log('Main element:', main ? '✅ Found' : '❌ Missing')
      console.log('Router view:', routerView ? '✅ Found' : '❌ Missing')
      console.log('Current page:', currentPage ? '✅ Found' : '❌ Missing')
      
      if (!currentPage) {
        console.warn('⚠️ No page content found! This might indicate a loading issue.')
        // Force re-render
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    }

    const handleKeydown = (e) => {
      // Keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault()
            toggleAnalytics()
            break
          case '1':
            e.preventDefault()
            setTheme('light')
            break
          case '2':
            e.preventDefault()
            setTheme('dark')
            break
          case '3':
            e.preventDefault()
            setTheme('blue')
            break
          case '4':
            e.preventDefault()
            setTheme('green')
            break
        }
      }
    }

    onMounted(() => {
      loadTheme()
      window.addEventListener('scroll', handleScroll)
      window.addEventListener('keydown', handleKeydown)
      
      // Initialize analytics
      analytics.loadFromStorage()
      analytics.startTracking()
      
      // Track page view
      analytics.trackPageView(window.location.pathname)
      
      // Debug: Check content visibility
      setTimeout(() => {
        checkContentVisibility()
      }, 500)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeydown)
      analytics.stopTracking()
    })

    return {
      themeClass,
      currentTheme,
      setTheme,
      showScrollToTop,
      scrollToTop,
      showAnalytics,
      themeTransition,
      toggleAnalytics,
      checkContentVisibility
    }
  }
}
</script>

<style>
/* Global styles */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
  --body-bg: #ffffff;
  --text-color: #333333;
  --border-color: #dee2e6;
  --shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

/* Light theme */
.theme-light {
  --body-bg: #ffffff;
  --text-color: #333333;
  --card-bg: #ffffff;
  --navbar-bg: #ffffff;
  --footer-bg: #f8f9fa;
}

/* Dark theme */
.theme-dark {
  --body-bg: #1a1a1a;
  --text-color: #ffffff;
  --card-bg: #2d2d2d;
  --navbar-bg: #2d2d2d;
  --footer-bg: #1a1a1a;
}

/* Blue theme */
.theme-blue {
  --body-bg: #f0f8ff;
  --text-color: #1e3a8a;
  --card-bg: #ffffff;
  --navbar-bg: #3b82f6;
  --footer-bg: #1e40af;
}

/* Green theme */
.theme-green {
  --body-bg: #f0fdf4;
  --text-color: #166534;
  --card-bg: #ffffff;
  --navbar-bg: #22c55e;
  --footer-bg: #15803d;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--body-bg);
  color: var(--text-color);
  line-height: 1.6;
  transition: background-color 0.3s ease, color 0.3s ease;
  overflow-x: hidden;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  min-height: calc(100vh - 80px);
  position: relative;
  z-index: 1;
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0.8;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0.8;
  transform: translateY(-10px);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--light-color);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--dark-color);
}

/* Utility classes */
.text-gradient {
  background: linear-gradient(45deg, var(--primary-color), var(--info-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.shadow-custom {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.border-gradient {
  border: 2px solid;
  border-image: linear-gradient(45deg, var(--primary-color), var(--info-color)) 1;
}

/* Animation classes */
.fade-in {
  animation: fadeIn 0.6s ease-in;
}

.slide-up {
  animation: slideUp 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding-left: 15px;
    padding-right: 15px;
  }
}

/* Theme transitions */
.theme-transitioning * {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
}

/* Analytics toggle button */
.analytics-toggle {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1000;
}

.analytics-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  background: var(--dark-color);
}

.analytics-toggle:active {
  transform: scale(0.95);
}

/* Enhanced scroll to top button */
.scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 80px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  z-index: 1000;
}

.scroll-to-top.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.scroll-to-top:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  background: var(--dark-color);
}

/* Keyboard shortcuts hint */
.keyboard-hint {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--card-bg);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

.keyboard-hint h4 {
  margin-bottom: 15px;
  color: var(--text-color);
}

.keyboard-shortcuts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(0, 123, 255, 0.1);
  border-radius: 8px;
}

.shortcut-key {
  background: var(--primary-color);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

/* Debug styles - remove in production */
.debug-content-visibility {
  border: 2px solid red !important;
  background: rgba(255, 0, 0, 0.1) !important;
}

.debug-content-visibility * {
  border: 1px solid blue !important;
  background: rgba(0, 0, 255, 0.05) !important;
}

/* Ensure all content is visible */
.container, .row, .col, [class*="col-"] {
  min-height: auto;
  overflow: visible;
}

/* Fix any potential z-index issues */
.navbar-custom {
  z-index: 1030;
}

.theme-toggle {
  z-index: 1040;
}

.analytics-toggle,
.scroll-to-top {
  z-index: 1050;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .analytics-toggle,
  .scroll-to-top,
  .theme-toggle {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .analytics-toggle {
    bottom: 15px;
    left: 15px;
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
  
  .scroll-to-top {
    bottom: 15px;
    right: 70px;
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
}
</style>
