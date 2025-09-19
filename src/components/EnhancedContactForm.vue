<template>
  <div class="enhanced-contact-form">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header text-center py-5">
        <h1 class="display-4 fw-bold mb-3 animate__animated animate__fadeInDown">Get In Touch</h1>
        <p class="lead animate__animated animate__fadeInUp animate__delay-1s">Let's discuss your next project</p>
      </div>

      <div class="row">
        <!-- Contact Information -->
        <div class="col-lg-4 mb-5">
          <div class="contact-info-card card card-custom h-100 animate__animated animate__fadeInLeft">
            <div class="card-body">
              <h3 class="card-title mb-4">Contact Information</h3>
              
              <div class="contact-item mb-4">
                <div class="contact-icon">
                  <i class="fas fa-envelope text-primary"></i>
                </div>
                <div class="contact-details">
                  <h6>Email</h6>
                  <a :href="`mailto:${personalInfo.email}`" class="text-decoration-none">{{ personalInfo.email }}</a>
                </div>
              </div>

              <div class="contact-item mb-4">
                <div class="contact-icon">
                  <i class="fas fa-phone text-primary"></i>
                </div>
                <div class="contact-details">
                  <h6>Phone</h6>
                  <a :href="`tel:${personalInfo.phone}`" class="text-decoration-none">{{ personalInfo.phone }}</a>
                </div>
              </div>

              <div class="contact-item mb-4">
                <div class="contact-icon">
                  <i class="fas fa-map-marker-alt text-primary"></i>
                </div>
                <div class="contact-details">
                  <h6>Location</h6>
                  <span>{{ personalInfo.location }}</span>
                </div>
              </div>

              <div class="contact-item mb-4">
                <div class="contact-icon">
                  <i class="fas fa-clock text-primary"></i>
                </div>
                <div class="contact-details">
                  <h6>Availability</h6>
                  <span>Mon - Fri, 9:00 AM - 6:00 PM IST</span>
                </div>
              </div>

              <hr class="my-4">

              <h5 class="mb-3">Follow Me</h5>
              <div class="social-links">
                <a :href="personalInfo.linkedin" target="_blank" class="social-link" title="LinkedIn">
                  <i class="fab fa-linkedin-in"></i>
                </a>
                <a :href="personalInfo.github" target="_blank" class="social-link" title="GitHub">
                  <i class="fab fa-github"></i>
                </a>
                <a :href="personalInfo.cv" download class="social-link" title="Download CV">
                  <i class="fas fa-download"></i>
                </a>
                <a href="mailto:{{ personalInfo.email }}" class="social-link" title="Email">
                  <i class="fas fa-envelope"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Contact Form -->
        <div class="col-lg-8 mb-5">
          <div class="contact-form-card card card-custom animate__animated animate__fadeInRight">
            <div class="card-body">
              <h3 class="card-title mb-4">Send Me a Message</h3>
              
              <form @submit.prevent="submitForm" class="contact-form" enctype="multipart/form-data">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="name" class="form-label">Name *</label>
                    <input 
                      type="text" 
                      class="form-control form-control-custom" 
                      id="name"
                      v-model="form.name"
                      :class="{ 'is-invalid': errors.name }"
                      required
                      @blur="validateField('name')"
                    >
                    <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="email" class="form-label">Email *</label>
                    <input 
                      type="email" 
                      class="form-control form-control-custom" 
                      id="email"
                      v-model="form.email"
                      :class="{ 'is-invalid': errors.email }"
                      required
                      @blur="validateField('email')"
                    >
                    <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="phone" class="form-label">Phone</label>
                    <input 
                      type="tel" 
                      class="form-control form-control-custom" 
                      id="phone"
                      v-model="form.phone"
                      @blur="validateField('phone')"
                    >
                    <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="subject" class="form-label">Subject *</label>
                    <input 
                      type="text" 
                      class="form-control form-control-custom" 
                      id="subject"
                      v-model="form.subject"
                      :class="{ 'is-invalid': errors.subject }"
                      required
                      @blur="validateField('subject')"
                    >
                    <div v-if="errors.subject" class="invalid-feedback">{{ errors.subject }}</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="message" class="form-label">Message *</label>
                  <textarea 
                    class="form-control form-control-custom" 
                    id="message"
                    rows="6"
                    v-model="form.message"
                    :class="{ 'is-invalid': errors.message }"
                    required
                    @blur="validateField('message')"
                    @input="updateCharacterCount"
                  ></textarea>
                  <div class="character-count">
                    {{ characterCount }}/1000 characters
                  </div>
                  <div v-if="errors.message" class="invalid-feedback">{{ errors.message }}</div>
                </div>

                <!-- File Upload Section -->
                <div class="mb-3">
                  <label for="attachments" class="form-label">Attachments (Optional)</label>
                  <div class="file-upload-area" 
                       :class="{ 'drag-over': isDragOver, 'has-files': uploadedFiles.length > 0 }"
                       @dragover.prevent="handleDragOver"
                       @dragleave.prevent="handleDragLeave"
                       @drop.prevent="handleDrop">
                    <input 
                      type="file" 
                      id="attachments"
                      ref="fileInput"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                      @change="handleFileSelect"
                      style="display: none;"
                    >
                    <div class="upload-content">
                      <i class="fas fa-cloud-upload-alt"></i>
                      <p>Drag & drop files here or <button type="button" @click="$refs.fileInput.click()" class="upload-btn">browse</button></p>
                      <small>Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF (Max 10MB each)</small>
                    </div>
                  </div>
                  
                  <!-- File List -->
                  <div v-if="uploadedFiles.length > 0" class="file-list">
                    <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
                      <div class="file-info">
                        <i :class="getFileIcon(file.type)"></i>
                        <div class="file-details">
                          <span class="file-name">{{ file.name }}</span>
                          <span class="file-size">{{ formatFileSize(file.size) }}</span>
                        </div>
                      </div>
                      <button type="button" @click="removeFile(index)" class="remove-file">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Calendar Integration -->
                <div class="mb-3">
                  <label class="form-label">Preferred Meeting Time</label>
                  <div class="calendar-section">
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <label for="meeting-date" class="form-label">Date</label>
                        <input 
                          type="date" 
                          class="form-control form-control-custom" 
                          id="meeting-date"
                          v-model="form.meetingDate"
                          :min="minDate"
                        >
                      </div>
                      <div class="col-md-6 mb-3">
                        <label for="meeting-time" class="form-label">Time</label>
                        <select class="form-control form-control-custom" id="meeting-time" v-model="form.meetingTime">
                          <option value="">Select time</option>
                          <option v-for="time in availableTimes" :key="time" :value="time">
                            {{ time }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="timezone-info">
                      <small class="text-muted">
                        <i class="fas fa-globe"></i>
                        Times shown in IST (UTC+5:30)
                      </small>
                    </div>
                  </div>
                </div>

                <!-- Project Type Selection -->
                <div class="mb-3">
                  <label class="form-label">Project Type</label>
                  <div class="project-type-grid">
                    <label v-for="type in projectTypes" :key="type.value" class="project-type-option">
                      <input 
                        type="radio" 
                        :value="type.value" 
                        v-model="form.projectType"
                        class="project-type-input"
                      >
                      <div class="project-type-card">
                        <i :class="type.icon"></i>
                        <span>{{ type.label }}</span>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Budget Range -->
                <div class="mb-3">
                  <label for="budget" class="form-label">Budget Range (Optional)</label>
                  <select class="form-control form-control-custom" id="budget" v-model="form.budget">
                    <option value="">Select budget range</option>
                    <option value="under-5k">Under $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-25k">$10,000 - $25,000</option>
                    <option value="25k-50k">$25,000 - $50,000</option>
                    <option value="over-50k">Over $50,000</option>
                    <option value="discuss">Let's discuss</option>
                  </select>
                </div>

                <!-- Newsletter Subscription -->
                <div class="mb-3">
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="newsletter"
                      v-model="form.newsletter"
                    >
                    <label class="form-check-label" for="newsletter">
                      Subscribe to my newsletter for updates and tech insights
                    </label>
                  </div>
                </div>

                <!-- Privacy Agreement -->
                <div class="mb-3">
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="privacy"
                      v-model="form.privacyAgreed"
                      :class="{ 'is-invalid': errors.privacyAgreed }"
                      required
                    >
                    <label class="form-check-label" for="privacy">
                      I agree to the <a href="#" @click.prevent="showPrivacyModal = true">Privacy Policy</a> and <a href="#" @click.prevent="showTermsModal = true">Terms of Service</a>
                    </label>
                  </div>
                  <div v-if="errors.privacyAgreed" class="invalid-feedback">{{ errors.privacyAgreed }}</div>
                </div>

                <div class="d-grid">
                  <button 
                    type="submit" 
                    class="btn btn-primary-custom btn-custom"
                    :disabled="isSubmitting || !isFormValid"
                  >
                    <span v-if="isSubmitting" class="loading me-2"></span>
                    <i v-else class="fas fa-paper-plane me-2"></i>
                    {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                  </button>
                </div>
              </form>

              <!-- Success Message -->
              <div v-if="showSuccess" class="alert alert-success mt-3 animate__animated animate__fadeIn">
                <i class="fas fa-check-circle me-2"></i>
                Thank you! Your message has been sent successfully. I'll get back to you soon.
              </div>

              <!-- Error Message -->
              <div v-if="showError" class="alert alert-danger mt-3 animate__animated animate__fadeIn">
                <i class="fas fa-exclamation-circle me-2"></i>
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="row mt-5">
        <div class="col-12">
          <div class="additional-info card card-custom animate__animated animate__fadeInUp">
            <div class="card-body">
              <h3 class="card-title text-center mb-4">Why Work With Me?</h3>
              <div class="row">
                <div class="col-lg-3 col-md-6 mb-4">
                  <div class="info-item text-center">
                    <div class="info-icon mb-3">
                      <i class="fas fa-rocket fa-3x text-primary"></i>
                    </div>
                    <h5>Fast Delivery</h5>
                    <p class="text-muted">Quick turnaround times without compromising quality</p>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-4">
                  <div class="info-item text-center">
                    <div class="info-icon mb-3">
                      <i class="fas fa-shield-alt fa-3x text-primary"></i>
                    </div>
                    <h5>Quality Assurance</h5>
                    <p class="text-muted">Thorough testing and code reviews for reliable solutions</p>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-4">
                  <div class="info-item text-center">
                    <i class="fas fa-headset fa-3x text-primary"></i>
                    </div>
                    <h5>24/7 Support</h5>
                    <p class="text-muted">Ongoing support and maintenance for your projects</p>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-4">
                  <div class="info-item text-center">
                    <div class="info-icon mb-3">
                      <i class="fas fa-handshake fa-3x text-primary"></i>
                    </div>
                    <h5>Collaborative Approach</h5>
                    <p class="text-muted">Working closely with clients to achieve their goals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Response Time -->
      <div class="row mt-5">
        <div class="col-12 text-center">
          <div class="response-time animate__animated animate__fadeInUp">
            <h4 class="mb-3">Response Time</h4>
            <p class="lead">I typically respond to inquiries within 24 hours</p>
            <div class="response-stats">
              <div class="row">
                <div class="col-md-4">
                  <div class="stat-item">
                    <h5 class="text-primary">2-4 hours</h5>
                    <p class="text-muted">Email Response</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-item">
                    <h5 class="text-primary">1-2 days</h5>
                    <p class="text-muted">Project Quote</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-item">
                    <h5 class="text-primary">1 week</h5>
                    <p class="text-muted">Project Start</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Privacy Policy Modal -->
    <div v-if="showPrivacyModal" class="modal-overlay" @click="showPrivacyModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4>Privacy Policy</h4>
          <button @click="showPrivacyModal = false" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Your privacy is important to us. We collect and use your information only as necessary to respond to your inquiry and provide our services.</p>
          <p>We do not sell or share your personal information with third parties without your consent.</p>
        </div>
      </div>
    </div>

    <!-- Terms of Service Modal -->
    <div v-if="showTermsModal" class="modal-overlay" @click="showTermsModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4>Terms of Service</h4>
          <button @click="showTermsModal = false" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>By using this contact form, you agree to our terms of service.</p>
          <p>We reserve the right to modify these terms at any time.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { personalInfo } from '../data/personal.js'

export default {
  name: 'EnhancedContactForm',
  data() {
    return {
      personalInfo,
      form: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        meetingDate: '',
        meetingTime: '',
        projectType: '',
        budget: '',
        newsletter: false,
        privacyAgreed: false
      },
      errors: {},
      isSubmitting: false,
      showSuccess: false,
      showError: false,
      errorMessage: '',
      characterCount: 0,
      uploadedFiles: [],
      isDragOver: false,
      showPrivacyModal: false,
      showTermsModal: false,
      minDate: new Date().toISOString().split('T')[0],
      availableTimes: [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
      ],
      projectTypes: [
        { value: 'web-development', label: 'Web Development', icon: 'fas fa-code' },
        { value: 'mobile-app', label: 'Mobile App', icon: 'fas fa-mobile-alt' },
        { value: 'backend-api', label: 'Backend API', icon: 'fas fa-server' },
        { value: 'database-design', label: 'Database Design', icon: 'fas fa-database' },
        { value: 'cloud-migration', label: 'Cloud Migration', icon: 'fas fa-cloud' },
        { value: 'consulting', label: 'Consulting', icon: 'fas fa-lightbulb' }
      ]
    }
  },
  computed: {
    isFormValid() {
      return this.form.name && 
             this.form.email && 
             this.form.subject && 
             this.form.message && 
             this.form.privacyAgreed &&
             this.characterCount <= 1000
    }
  },
  methods: {
    validateField(fieldName) {
      this.errors[fieldName] = ''
      
      switch (fieldName) {
        case 'name':
          if (!this.form.name.trim()) {
            this.errors.name = 'Name is required'
          }
          break
        case 'email':
          if (!this.form.email.trim()) {
            this.errors.email = 'Email is required'
          } else if (!this.isValidEmail(this.form.email)) {
            this.errors.email = 'Please enter a valid email address'
          }
          break
        case 'phone':
          if (this.form.phone && !this.isValidPhone(this.form.phone)) {
            this.errors.phone = 'Please enter a valid phone number'
          }
          break
        case 'subject':
          if (!this.form.subject.trim()) {
            this.errors.subject = 'Subject is required'
          }
          break
        case 'message':
          if (!this.form.message.trim()) {
            this.errors.message = 'Message is required'
          } else if (this.form.message.trim().length < 10) {
            this.errors.message = 'Message must be at least 10 characters long'
          } else if (this.characterCount > 1000) {
            this.errors.message = 'Message must be less than 1000 characters'
          }
          break
      }
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    
    isValidPhone(phone) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      return phoneRegex.test(phone.replace(/\s/g, ''))
    },
    
    updateCharacterCount() {
      this.characterCount = this.form.message.length
    },
    
    handleDragOver(e) {
      e.preventDefault()
      this.isDragOver = true
    },
    
    handleDragLeave(e) {
      e.preventDefault()
      this.isDragOver = false
    },
    
    handleDrop(e) {
      e.preventDefault()
      this.isDragOver = false
      const files = Array.from(e.dataTransfer.files)
      this.processFiles(files)
    },
    
    handleFileSelect(e) {
      const files = Array.from(e.target.files)
      this.processFiles(files)
    },
    
    processFiles(files) {
      files.forEach(file => {
        if (this.validateFile(file)) {
          this.uploadedFiles.push(file)
        }
      })
    },
    
    validateFile(file) {
      const maxSize = 10 * 1024 * 1024 // 10MB
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif'
      ]
      
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`)
        return false
      }
      
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a supported format.`)
        return false
      }
      
      return true
    },
    
    removeFile(index) {
      this.uploadedFiles.splice(index, 1)
    },
    
    getFileIcon(fileType) {
      if (fileType.includes('pdf')) return 'fas fa-file-pdf'
      if (fileType.includes('word')) return 'fas fa-file-word'
      if (fileType.includes('text')) return 'fas fa-file-alt'
      if (fileType.includes('image')) return 'fas fa-file-image'
      return 'fas fa-file'
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    
    async submitForm() {
      // Validate all fields
      Object.keys(this.form).forEach(field => {
        if (field !== 'newsletter' && field !== 'privacyAgreed') {
          this.validateField(field)
        }
      })
      
      if (!this.form.privacyAgreed) {
        this.errors.privacyAgreed = 'You must agree to the privacy policy and terms of service'
      }
      
      if (Object.values(this.errors).some(error => error)) {
        return
      }
      
      this.isSubmitting = true
      this.showError = false
      
      try {
        const formData = new FormData()
        
        // Add form fields
        Object.keys(this.form).forEach(key => {
          if (key !== 'newsletter' && key !== 'privacyAgreed') {
            formData.append(key, this.form[key])
          }
        })
        
        // Add files
        this.uploadedFiles.forEach(file => {
          formData.append('attachments', file)
        })
        
        const response = await fetch('/api/contact', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          throw new Error('Network error')
        }
        
        // Reset form
        this.form = {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          meetingDate: '',
          meetingTime: '',
          projectType: '',
          budget: '',
          newsletter: false,
          privacyAgreed: false
        }
        this.uploadedFiles = []
        this.characterCount = 0
        
        this.showSuccess = true
        setTimeout(() => {
          this.showSuccess = false
        }, 5000)
        
      } catch (error) {
        console.error('Error submitting form:', error)
        this.showError = true
        this.errorMessage = 'There was an error sending your message. Please try again.'
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.enhanced-contact-form {
  padding-top: 100px;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, var(--primary-color), var(--info-color));
  color: white;
  margin: -20px -15px 0;
  border-radius: 0 0 20px 20px;
}

.contact-info-card,
.contact-form-card {
  background: var(--card-bg);
  color: var(--text-color);
  border: none;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.contact-icon {
  width: 40px;
  height: 40px;
  background: rgba(0, 123, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-details h6 {
  margin-bottom: 5px;
  font-weight: 600;
}

.contact-details a {
  color: var(--text-color);
  transition: color 0.3s ease;
}

.contact-details a:hover {
  color: var(--primary-color);
}

.social-links {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.social-link {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.social-link:hover {
  background: var(--dark-color);
  transform: translateY(-3px);
  color: white;
}

.form-control-custom {
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 15px;
  transition: all 0.3s ease;
  background: var(--body-bg);
  color: var(--text-color);
}

.form-control-custom:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-control-custom.is-invalid {
  border-color: var(--danger-color);
}

.character-count {
  text-align: right;
  font-size: 0.8rem;
  color: var(--secondary-color);
  margin-top: 5px;
}

/* File Upload Styles */
.file-upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 15px;
  padding: 40px 20px;
  text-align: center;
  transition: all 0.3s ease;
  background: var(--body-bg);
}

.file-upload-area.drag-over {
  border-color: var(--primary-color);
  background: rgba(0, 123, 255, 0.05);
}

.file-upload-area.has-files {
  border-color: var(--success-color);
  background: rgba(40, 167, 69, 0.05);
}

.upload-content i {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 15px;
}

.upload-content p {
  margin-bottom: 10px;
  color: var(--text-color);
}

.upload-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  text-decoration: underline;
  cursor: pointer;
}

.upload-content small {
  color: var(--secondary-color);
}

.file-list {
  margin-top: 20px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(0, 123, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 10px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.file-info i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.file-details {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: 500;
  color: var(--text-color);
}

.file-size {
  font-size: 0.8rem;
  color: var(--secondary-color);
}

.remove-file {
  background: var(--danger-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-file:hover {
  background: #c82333;
  transform: scale(1.1);
}

/* Calendar Section */
.calendar-section {
  background: rgba(0, 123, 255, 0.05);
  padding: 20px;
  border-radius: 10px;
}

.timezone-info {
  margin-top: 10px;
  text-align: center;
}

.timezone-info i {
  color: var(--primary-color);
}

/* Project Type Grid */
.project-type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.project-type-option {
  cursor: pointer;
}

.project-type-input {
  display: none;
}

.project-type-card {
  padding: 20px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  text-align: center;
  transition: all 0.3s ease;
  background: var(--body-bg);
}

.project-type-card:hover {
  border-color: var(--primary-color);
  background: rgba(0, 123, 255, 0.05);
}

.project-type-input:checked + .project-type-card {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
}

.project-type-card i {
  font-size: 2rem;
  margin-bottom: 10px;
  display: block;
}

.project-type-card span {
  font-weight: 500;
}

.loading {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.additional-info {
  background: var(--card-bg);
  color: var(--text-color);
}

.info-item {
  padding: 20px;
  background: rgba(0, 123, 255, 0.05);
  border-radius: 15px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(0, 123, 255, 0.1);
  transform: translateY(-5px);
}

.info-icon {
  margin-bottom: 15px;
}

.response-time {
  background: var(--light-color);
  padding: 40px;
  border-radius: 15px;
}

.stat-item {
  padding: 20px;
  background: rgba(0, 123, 255, 0.05);
  border-radius: 15px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(0, 123, 255, 0.1);
  transform: translateY(-5px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.modal-content {
  background: var(--card-bg);
  border-radius: 15px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 20px 30px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h4 {
  margin: 0;
  color: var(--text-color);
}

.modal-close {
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.modal-body {
  padding: 30px;
}

.modal-body p {
  color: var(--text-color);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .page-header {
    margin: -20px -15px 0;
  }
  
  .contact-item {
    flex-direction: column;
    text-align: center;
  }
  
  .contact-icon {
    align-self: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .project-type-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .response-time {
    padding: 30px 20px;
  }
}
</style>
