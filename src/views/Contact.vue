<template>
  <div class="contact-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header text-center py-5">
        <h1 class="display-4 fw-bold mb-3 animate__animated animate__fadeInDown">
          <span class="title-gradient">Get In Touch</span>
        </h1>
        <p class="lead animate__animated animate__fadeInUp animate__delay-1s">
          Ready to start your next project? Let's discuss how I can help bring your ideas to life.
        </p>
      </div>

      <div class="row">
        <!-- Contact Information -->
        <div class="col-lg-4 mb-5">
          <div class="contact-info">
            <h3 class="info-title animate__animated animate__fadeInLeft">
              <i class="fas fa-info-circle me-2"></i>
              Contact Information
            </h3>
            
            <div class="info-item animate__animated animate__fadeInLeft animate__delay-1s">
              <div class="info-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="info-content">
                <h4>Email</h4>
                <p>shahulhameed.ansari@gmail.com</p>
                <a href="mailto:shahulhameed.ansari@gmail.com" class="info-link">
                  Send Email <i class="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>

            <div class="info-item animate__animated animate__fadeInLeft animate__delay-2s">
              <div class="info-icon">
                <i class="fab fa-linkedin"></i>
              </div>
              <div class="info-content">
                <h4>LinkedIn</h4>
                <p>Professional Network</p>
                <a href="https://linkedin.com/in/shahulhameedansari" target="_blank" class="info-link">
                  Connect <i class="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>

            <div class="info-item animate__animated animate__fadeInLeft animate__delay-3s">
              <div class="info-icon">
                <i class="fab fa-github"></i>
              </div>
              <div class="info-content">
                <h4>GitHub</h4>
                <p>Code Repository</p>
                <a href="https://github.com/badhusha-dev" target="_blank" class="info-link">
                  View Profile <i class="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>

            <div class="info-item animate__animated animate__fadeInLeft animate__delay-4s">
              <div class="info-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div class="info-content">
                <h4>Location</h4>
                <p>Available for Remote Work</p>
                <span class="info-text">Worldwide</span>
              </div>
            </div>
          </div>

          <!-- Quick Response Info -->
          <div class="response-info animate__animated animate__fadeInLeft animate__delay-5s">
            <h4><i class="fas fa-clock me-2"></i>Response Time</h4>
            <p>I typically respond to messages within 24 hours during business days.</p>
            
            <h4><i class="fas fa-calendar me-2"></i>Availability</h4>
            <p>Currently available for new projects and collaborations.</p>
          </div>
        </div>

        <!-- Enhanced Contact Form -->
        <div class="col-lg-8">
          <EnhancedContactForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EnhancedContactForm from '../components/EnhancedContactForm.vue'

export default {
  name: 'Contact',
  components: {
    EnhancedContactForm
  }
}
</script>

<style scoped>
.contact-page {
  padding-top: 100px;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-color) 0%, var(--secondary-bg) 100%);
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

.contact-info {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.info-title {
  color: var(--text-color);
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.info-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.info-content h4 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.info-content p {
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.info-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.info-link:hover {
  color: var(--accent-color);
  text-decoration: underline;
}

.info-text {
  color: var(--secondary-color);
  font-size: 0.9rem;
}

.response-info {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.response-info h4 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.response-info p {
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  line-height: 1.6;
}

.response-info h4:last-of-type {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .contact-info,
  .response-info {
    margin-bottom: 1rem;
  }
  
  .info-item {
    flex-direction: column;
    text-align: center;
  }
  
  .info-item:hover {
    transform: translateY(-5px);
  }
}
</style>