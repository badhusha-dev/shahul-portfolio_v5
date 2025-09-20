<template>
  <section class="hero-section">
    <!-- Animated Background -->
    <div class="hero-background">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
    </div>

    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <div class="hero-content">
            <div class="hero-badge animate__animated animate__fadeInDown">
              <span class="badge-text">👋 Welcome to my portfolio</span>
            </div>
            
            <h1 class="display-4 fw-bold mb-4 animate__animated animate__fadeInUp hero-title">
              <span class="title-gradient">{{ personalInfo.name }}</span>
            </h1>
            
            <h2 class="h3 mb-4 animate__animated animate__fadeInUp animate__delay-1s">
              <span class="typing-animation">{{ currentText }}</span>
              <span class="cursor-blink">|</span>
            </h2>
            
            <p class="lead mb-4 animate__animated animate__fadeInUp animate__delay-2s hero-subtitle">
              {{ personalInfo.subtitle }}
            </p>
            
            <p class="mb-5 animate__animated animate__fadeInUp animate__delay-3s hero-description">
              {{ personalInfo.bio }}
            </p>
            
            <div class="hero-stats animate__animated animate__fadeInUp animate__delay-3s">
              <div class="stat-item">
                <div class="stat-number">{{ personalInfo.experience }}+</div>
                <div class="stat-label">Years Experience</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ personalInfo.projects }}+</div>
                <div class="stat-label">Projects Completed</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ personalInfo.clients }}+</div>
                <div class="stat-label">Happy Clients</div>
              </div>
            </div>
            
            <div class="hero-buttons animate__animated animate__fadeInUp animate__delay-4s">
              <a :href="personalInfo.cv" class="btn btn-primary-custom btn-custom me-3" download>
                <i class="fas fa-download me-2"></i>Download CV
                <div class="btn-ripple"></div>
              </a>
              <router-link to="/contact" class="btn btn-outline-custom btn-custom">
                <i class="fas fa-envelope me-2"></i>Contact Me
                <div class="btn-ripple"></div>
              </router-link>
            </div>
            
            <!-- Social Links -->
            <div class="hero-social animate__animated animate__fadeInUp animate__delay-5s">
              <a href="https://github.com/badhusha-dev" target="_blank" class="social-link" title="GitHub">
                <i class="fab fa-github"></i>
              </a>
              <a href="https://linkedin.com/in/shahulhameedansari" target="_blank" class="social-link" title="LinkedIn">
                <i class="fab fa-linkedin"></i>
              </a>
              <a href="mailto:shahulhameed.ansari@gmail.com" class="social-link" title="Email">
                <i class="fas fa-envelope"></i>
              </a>
              <a href="https://twitter.com/badhusha_dev" target="_blank" class="social-link" title="Twitter">
                <i class="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div class="col-lg-6">
          <div class="hero-image text-center animate__animated animate__fadeInRight animate__delay-2s">
            <div class="image-container">
              <div class="image-glow"></div>
              <img 
                :src="personalInfo.profileImage" 
                :alt="personalInfo.name"
                class="img-fluid rounded-circle shadow-custom profile-image"
                @mouseenter="onImageHover"
                @mouseleave="onImageLeave"
              >
              <div class="image-overlay">
                <div class="overlay-content">
                  <h4>Shahul Hameed</h4>
                  <p>Java Backend Developer</p>
                  <div class="tech-stack">
                    <span class="tech-tag">Java</span>
                    <span class="tech-tag">Spring Boot</span>
                    <span class="tech-tag">Microservices</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Floating Tech Icons -->
            <div class="floating-tech-icons">
              <div class="tech-icon" style="--delay: 0s;">
                <i class="fab fa-java"></i>
              </div>
              <div class="tech-icon" style="--delay: 0.5s;">
                <i class="fas fa-leaf"></i>
              </div>
              <div class="tech-icon" style="--delay: 1s;">
                <i class="fab fa-docker"></i>
              </div>
              <div class="tech-icon" style="--delay: 1.5s;">
                <i class="fas fa-database"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Enhanced Scroll indicator -->
    <div class="scroll-indicator animate__animated animate__bounce animate__infinite animate__delay-5s">
      <a href="#about" class="scroll-down" @click="scrollToSection">
        <div class="scroll-text">Scroll Down</div>
        <div class="scroll-arrow">
          <i class="fas fa-chevron-down"></i>
        </div>
      </a>
    </div>
  </section>
</template>

<script>
import { personalInfo } from '../data/personal.js'

export default {
  name: 'Hero',
  data() {
    return {
      personalInfo,
      currentText: '',
      texts: [
        'Java Backend Developer',
        'Spring Boot Expert',
        'Microservices Architect',
        'Full Stack Developer',
        'DevOps Enthusiast'
      ],
      currentIndex: 0,
      isDeleting: false,
      typingSpeed: 100,
      deletingSpeed: 50,
      pauseTime: 2000
    }
  },
  mounted() {
    this.startTyping()
    this.addPersonalStats()
  },
  methods: {
    startTyping() {
      const type = () => {
        const current = this.texts[this.currentIndex]
        
        if (this.isDeleting) {
          this.currentText = current.substring(0, this.currentText.length - 1)
        } else {
          this.currentText = current.substring(0, this.currentText.length + 1)
        }
        
        let typeSpeed = this.isDeleting ? this.deletingSpeed : this.typingSpeed
        
        if (!this.isDeleting && this.currentText === current) {
          typeSpeed = this.pauseTime
          this.isDeleting = true
        } else if (this.isDeleting && this.currentText === '') {
          this.isDeleting = false
          this.currentIndex = (this.currentIndex + 1) % this.texts.length
        }
        
        setTimeout(type, typeSpeed)
      }
      
      type()
    },
    
    addPersonalStats() {
      // Add stats to personalInfo if not present
      if (!this.personalInfo.experience) {
        this.personalInfo.experience = 4
      }
      if (!this.personalInfo.projects) {
        this.personalInfo.projects = 25
      }
      if (!this.personalInfo.clients) {
        this.personalInfo.clients = 15
      }
    },
    
    onImageHover() {
      const overlay = document.querySelector('.image-overlay')
      if (overlay) {
        overlay.style.opacity = '1'
        overlay.style.transform = 'translateY(0)'
      }
    },
    
    onImageLeave() {
      const overlay = document.querySelector('.image-overlay')
      if (overlay) {
        overlay.style.opacity = '0'
        overlay.style.transform = 'translateY(20px)'
      }
    },
    
    scrollToSection(event) {
      event.preventDefault()
      const aboutSection = document.querySelector('#about')
      if (aboutSection) {
        aboutSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }
  }
}
</script>

<style scoped>
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: visible;
  background: linear-gradient(135deg, var(--body-bg) 0%, var(--secondary-bg) 100%);
  color: var(--text-color);
}

/* Animated Background */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  top: 30%;
  right: 30%;
  animation-delay: 4s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 1s;
}

.shape-5 {
  width: 140px;
  height: 140px;
  top: 10%;
  right: 10%;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* Hero Content */
.hero-content {
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-block;
  margin-bottom: 1rem;
}

.badge-text {
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  color: white;
  padding: 8px 20px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

.hero-title {
  position: relative;
}

.title-gradient {
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color), var(--primary-color));
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.cursor-blink {
  animation: blink 1s infinite;
  color: var(--primary-color);
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Hero Stats */
.hero-stats {
  display: flex;
  gap: 2rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--secondary-color);
  font-weight: 500;
}

/* Enhanced Buttons */
.btn-custom {
  position: relative;
  overflow: hidden;
}

.btn-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-custom:hover .btn-ripple {
  width: 300px;
  height: 300px;
}

/* Social Links */
.hero-social {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.social-link:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 123, 255, 0.3);
}

/* Hero Image */
.hero-image {
  position: relative;
  z-index: 2;
}

.image-container {
  position: relative;
  display: inline-block;
}

.image-glow {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  border-radius: 50%;
  opacity: 0.2;
  filter: blur(20px);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
}

.profile-image {
  max-width: 400px;
  width: 100%;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.profile-image:hover {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  z-index: 3;
}

.overlay-content {
  text-align: center;
  color: white;
  padding: 2rem;
}

.overlay-content h4 {
  margin-bottom: 0.5rem;
  color: white;
}

.overlay-content p {
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

.tech-stack {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.tech-tag {
  background: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Floating Tech Icons */
.floating-tech-icons {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.tech-icon {
  position: absolute;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--primary-color);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: techFloat 3s ease-in-out infinite;
  animation-delay: var(--delay);
}

.tech-icon:nth-child(1) {
  top: 10%;
  left: -10%;
}

.tech-icon:nth-child(2) {
  top: 20%;
  right: -15%;
}

.tech-icon:nth-child(3) {
  bottom: 30%;
  left: -20%;
}

.tech-icon:nth-child(4) {
  bottom: 10%;
  right: -10%;
}

@keyframes techFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(180deg);
  }
}

/* Enhanced Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.scroll-down {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.scroll-down:hover {
  color: var(--primary-color);
  transform: translateY(-5px);
}

.scroll-text {
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.scroll-arrow {
  font-size: 1.2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-stats {
    justify-content: center;
    gap: 1rem;
  }
  
  .stat-item {
    flex: 1;
    min-width: 100px;
  }
  
  .hero-social {
    justify-content: center;
  }
  
  .floating-tech-icons {
    display: none;
  }
  
  .shape {
    display: none;
  }
}

@media (max-width: 576px) {
  .hero-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .stat-item {
    width: 200px;
  }
}
</style>