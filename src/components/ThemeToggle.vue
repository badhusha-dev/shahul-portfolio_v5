<template>
  <div class="theme-toggle">
    <div class="theme-controls">
      <!-- System Theme Detection -->
      <div class="system-theme-indicator" v-if="systemThemeDetected">
        <i class="fas fa-desktop" :title="`System prefers: ${systemTheme}`"></i>
      </div>
      
      <!-- Theme Selector Dropdown -->
      <div class="theme-dropdown" :class="{ active: showDropdown }">
        <button 
          @click="toggleDropdown" 
          class="btn btn-outline-secondary btn-sm theme-btn"
          :title="`Current theme: ${currentTheme}. Click to change.`"
        >
          <i :class="themeIcon"></i>
        </button>
        
        <div class="theme-options" v-if="showDropdown">
          <div class="theme-option" 
               v-for="theme in availableThemes" 
               :key="theme.name"
               @click="selectTheme(theme.name)"
               :class="{ active: currentTheme === theme.name }"
          >
            <i :class="theme.icon"></i>
            <span>{{ theme.label }}</span>
            <i v-if="currentTheme === theme.name" class="fas fa-check"></i>
          </div>
          
          <div class="theme-option" @click="toggleAutoTheme">
            <i class="fas fa-magic"></i>
            <span>Auto (System)</span>
            <i v-if="autoTheme" class="fas fa-check"></i>
          </div>
        </div>
      </div>
      
      <!-- Quick Theme Switcher -->
      <div class="quick-switcher">
        <button 
          v-for="theme in quickThemes" 
          :key="theme.name"
          @click="selectTheme(theme.name)"
          class="quick-theme-btn"
          :class="{ active: currentTheme === theme.name }"
          :title="theme.label"
        >
          <i :class="theme.icon"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThemeToggle',
  props: {
    currentTheme: {
      type: String,
      required: true
    }
  },
  emits: ['update-theme'],
  data() {
    return {
      showDropdown: false,
      autoTheme: false,
      systemTheme: 'light',
      systemThemeDetected: false,
      mediaQuery: null
    }
  },
  computed: {
    themeIcon() {
      const icons = {
        light: 'fas fa-sun',
        dark: 'fas fa-moon',
        blue: 'fas fa-palette',
        green: 'fas fa-leaf'
      }
      return icons[this.currentTheme] || 'fas fa-sun'
    },
    availableThemes() {
      return [
        { name: 'light', label: 'Light', icon: 'fas fa-sun' },
        { name: 'dark', label: 'Dark', icon: 'fas fa-moon' },
        { name: 'blue', label: 'Blue', icon: 'fas fa-palette' },
        { name: 'green', label: 'Green', icon: 'fas fa-leaf' }
      ]
    },
    quickThemes() {
      return this.availableThemes.slice(0, 2) // Show only light and dark for quick access
    }
  },
  mounted() {
    this.detectSystemTheme()
    this.setupSystemThemeListener()
    this.loadAutoThemePreference()
    
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    if (this.mediaQuery) {
      this.mediaQuery.removeListener(this.handleSystemThemeChange)
    }
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    detectSystemTheme() {
      if (window.matchMedia) {
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        this.systemTheme = this.mediaQuery.matches ? 'dark' : 'light'
        this.systemThemeDetected = true
      }
    },
    
    setupSystemThemeListener() {
      if (this.mediaQuery) {
        this.mediaQuery.addListener(this.handleSystemThemeChange)
      }
    },
    
    handleSystemThemeChange(e) {
      this.systemTheme = e.matches ? 'dark' : 'light'
      
      if (this.autoTheme) {
        this.$emit('update-theme', this.systemTheme)
      }
    },
    
    loadAutoThemePreference() {
      const savedAutoTheme = localStorage.getItem('portfolio-auto-theme')
      this.autoTheme = savedAutoTheme === 'true'
      
      if (this.autoTheme) {
        this.$emit('update-theme', this.systemTheme)
      }
    },
    
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    
    selectTheme(themeName) {
      this.autoTheme = false
      localStorage.setItem('portfolio-auto-theme', 'false')
      this.$emit('update-theme', themeName)
      this.showDropdown = false
    },
    
    toggleAutoTheme() {
      this.autoTheme = !this.autoTheme
      localStorage.setItem('portfolio-auto-theme', this.autoTheme.toString())
      
      if (this.autoTheme) {
        this.$emit('update-theme', this.systemTheme)
      }
      
      this.showDropdown = false
    },
    
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.showDropdown = false
      }
    }
  }
}
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.theme-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

.system-theme-indicator {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.7;
}

.theme-dropdown {
  position: relative;
}

.theme-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  background: var(--card-bg);
  border: 2px solid var(--border-color);
}

.theme-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.theme-options {
  position: absolute;
  bottom: 60px;
  right: 0;
  background: var(--card-bg);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 10px;
  min-width: 180px;
  border: 1px solid var(--border-color);
  animation: slideUp 0.3s ease;
}

.theme-option {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 5px;
}

.theme-option:hover {
  background: rgba(0, 123, 255, 0.1);
  transform: translateX(-5px);
}

.theme-option.active {
  background: var(--primary-color);
  color: white;
}

.theme-option i:first-child {
  margin-right: 10px;
  width: 20px;
}

.theme-option span {
  flex: 1;
  font-weight: 500;
}

.theme-option i:last-child {
  margin-left: 10px;
  opacity: 0.8;
}

.quick-switcher {
  display: flex;
  gap: 8px;
}

.quick-theme-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  background: var(--card-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.quick-theme-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.quick-theme-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .theme-toggle {
    bottom: 15px;
    right: 15px;
  }
  
  .theme-btn {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
  
  .quick-theme-btn {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
  
  .theme-options {
    min-width: 160px;
    bottom: 50px;
  }
  
  .theme-option {
    padding: 10px 12px;
  }
}
</style>