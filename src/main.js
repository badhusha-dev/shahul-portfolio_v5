import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'animate.css'
import './assets/css/main.css'

// Import optimization utilities
import { performanceOptimizer, accessibilityEnhancer } from './utils/optimization.js'

// Import views
import Home from './views/Home.vue'
import About from './views/About.vue'
import Experience from './views/Experience.vue'
import Projects from './views/Projects.vue'
import Skills from './views/Skills.vue'
import Contact from './views/Contact.vue'
import Blog from './views/Blog.vue'

// Router configuration
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/experience', name: 'Experience', component: Experience },
  { path: '/projects', name: 'Projects', component: Projects },
  { path: '/skills', name: 'Skills', component: Skills },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/blog', name: 'Blog', component: Blog }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Add router guards for debugging
router.beforeEach((to, from, next) => {
  console.log(`🔄 Navigating from ${from.path} to ${to.path}`)
  next()
})

router.afterEach((to, from) => {
  console.log(`✅ Navigation completed to ${to.path}`)
  // Check if content loaded properly
  setTimeout(() => {
    const pageSelectors = [
      '.home-page',
      '.about-page', 
      '.projects-page',
      '.experience-page',
      '.skills-page',
      '.contact-page',
      '.blog-page'
    ]
    const pageContent = document.querySelector(pageSelectors.join(', '))
    if (!pageContent) {
      console.warn(`⚠️ Page content not found for ${to.path}`)
    }
  }, 100)
})

// Create Vue app
const app = createApp(App)

// Use router
app.use(router)

// Mount the app
app.mount('#app')

// Initialize performance and accessibility optimizations
document.addEventListener('DOMContentLoaded', () => {
  // Delay optimization initialization to prevent conflicts with Vue Router
  setTimeout(() => {
    try {
      // Performance optimizations are automatically initialized
      console.log('Performance optimizations initialized')
      
      // Accessibility enhancements are automatically initialized
      console.log('Accessibility enhancements initialized')
    } catch (error) {
      console.warn('Optimization initialization failed:', error)
    }
  }, 1000) // 1 second delay
})

// Register service worker only in production to avoid dev interference
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}

// Ensure dev environment doesn't keep an old service worker around
if (!import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(r => r.unregister())
  })
}
