<template>
  <div class="enhanced-contact-form">
    <div class="form-container">
      <div class="form-header">
        <h2 class="form-title">
          <i class="fas fa-envelope me-2"></i>
          Get In Touch
        </h2>
        <p class="form-subtitle">
          Ready to work together? Send me a message and I'll get back to you within 24 hours.
        </p>
      </div>

      <form @submit.prevent="submitForm" class="contact-form" novalidate>
        <!-- Name Field -->
        <div class="form-group">
          <label for="name" class="form-label">
            <i class="fas fa-user"></i>
            Full Name *
          </label>
          <div class="input-wrapper">
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="form-input"
              :class="{ 'error': errors.name, 'success': !errors.name && form.name }"
              placeholder="Enter your full name"
              @blur="validateField('name')"
              @input="clearError('name')"
              required
            >
            <div class="input-icon">
              <i class="fas fa-check" v-if="!errors.name && form.name"></i>
              <i class="fas fa-exclamation-triangle" v-if="errors.name"></i>
                </div>
                </div>
          <div class="error-message" v-if="errors.name">
            <i class="fas fa-exclamation-circle"></i>
            {{ errors.name }}
                </div>
              </div>

        <!-- Email Field -->
        <div class="form-group">
          <label for="email" class="form-label">
                  <i class="fas fa-envelope"></i>
            Email Address *
          </label>
          <div class="input-wrapper">
                    <input 
                      id="email"
                      v-model="form.email"
              type="email"
              class="form-input"
              :class="{ 'error': errors.email, 'success': !errors.email && form.email }"
              placeholder="Enter your email address"
                      @blur="validateField('email')"
              @input="clearError('email')"
              required
            >
            <div class="input-icon">
              <i class="fas fa-check" v-if="!errors.email && form.email"></i>
              <i class="fas fa-exclamation-triangle" v-if="errors.email"></i>
            </div>
          </div>
          <div class="error-message" v-if="errors.email">
            <i class="fas fa-exclamation-circle"></i>
            {{ errors.email }}
                  </div>
                </div>

        <!-- Phone Field -->
        <div class="form-group">
          <label for="phone" class="form-label">
            <i class="fas fa-phone"></i>
            Phone Number
          </label>
          <div class="input-wrapper">
                    <input 
                      id="phone"
                      v-model="form.phone"
              type="tel"
              class="form-input"
              :class="{ 'error': errors.phone, 'success': !errors.phone && form.phone }"
              placeholder="Enter your phone number"
                      @blur="validateField('phone')"
              @input="clearError('phone')"
                    >
            <div class="input-icon">
              <i class="fas fa-check" v-if="!errors.phone && form.phone"></i>
              <i class="fas fa-exclamation-triangle" v-if="errors.phone"></i>
                  </div>
          </div>
          <div class="error-message" v-if="errors.phone">
            <i class="fas fa-exclamation-circle"></i>
            {{ errors.phone }}
          </div>
        </div>

        <!-- Subject Field -->
        <div class="form-group">
          <label for="subject" class="form-label">
            <i class="fas fa-tag"></i>
            Subject *
          </label>
          <div class="input-wrapper">
            <select
                      id="subject"
                      v-model="form.subject"
              class="form-input"
              :class="{ 'error': errors.subject, 'success': !errors.subject && form.subject }"
              @change="validateField('subject')"
                      required
            >
              <option value="">Select a subject</option>
              <option value="project-inquiry">Project Inquiry</option>
              <option value="collaboration">Collaboration</option>
              <option value="job-opportunity">Job Opportunity</option>
              <option value="freelance-work">Freelance Work</option>
              <option value="consultation">Consultation</option>
              <option value="other">Other</option>
            </select>
            <div class="input-icon">
              <i class="fas fa-check" v-if="!errors.subject && form.subject"></i>
              <i class="fas fa-exclamation-triangle" v-if="errors.subject"></i>
                  </div>
                </div>
          <div class="error-message" v-if="errors.subject">
            <i class="fas fa-exclamation-circle"></i>
            {{ errors.subject }}
                  </div>
                </div>

        <!-- Custom Subject Field -->
        <div class="form-group" v-if="form.subject === 'other'">
          <label for="customSubject" class="form-label">
            <i class="fas fa-edit"></i>
            Custom Subject *
          </label>
          <div class="input-wrapper">
                    <input 
              id="customSubject"
              v-model="form.customSubject"
              type="text"
              class="form-input"
              :class="{ 'error': errors.customSubject, 'success': !errors.customSubject && form.customSubject }"
              placeholder="Enter your custom subject"
              @blur="validateField('customSubject')"
              @input="clearError('customSubject')"
            >
            <div class="input-icon">
              <i class="fas fa-check" v-if="!errors.customSubject && form.customSubject"></i>
              <i class="fas fa-exclamation-triangle" v-if="errors.customSubject"></i>
            </div>
          </div>
          <div class="error-message" v-if="errors.customSubject">
            <i class="fas fa-exclamation-circle"></i>
            {{ errors.customSubject }}
                    </div>
                  </div>
                  
        <!-- Message Field -->
        <div class="form-group">
          <label for="message" class="form-label">
            <i class="fas fa-comment"></i>
            Message *
          </label>
          <div class="textarea-wrapper">
            <textarea
              id="message"
              v-model="form.message"
              class="form-textarea"
              :class="{ 'error': errors.message, 'success': !errors.message && form.message }"
              placeholder="Tell me about your project or how I can help you..."
              rows="6"
              @blur="validateField('message')"
              @input="clearError('message')"
              required
            ></textarea>
            <div class="textarea-footer">
              <div class="char-count" :class="{ 'warning': form.message.length > 800 }">
                {{ form.message.length }}/1000 characters
                        </div>
                      </div>
                    </div>
          <div class="error-message" v-if="errors.message">
            <i class="fas fa-exclamation-circle"></i>
            {{ errors.message }}
                  </div>
                </div>

        <!-- Budget Range -->
        <div class="form-group">
          <label class="form-label">
            <i class="fas fa-dollar-sign"></i>
            Budget Range (Optional)
          </label>
          <div class="budget-options">
            <label v-for="budget in budgetOptions" :key="budget.value" class="budget-option">
                        <input 
                type="radio"
                v-model="form.budget"
                :value="budget.value"
                class="budget-radio"
              >
              <span class="budget-label">{{ budget.label }}</span>
            </label>
                  </div>
                </div>

        <!-- Timeline -->
        <div class="form-group">
          <label class="form-label">
            <i class="fas fa-clock"></i>
            Project Timeline (Optional)
          </label>
          <div class="timeline-options">
            <label v-for="timeline in timelineOptions" :key="timeline.value" class="timeline-option">
                      <input 
                        type="radio" 
                v-model="form.timeline"
                :value="timeline.value"
                class="timeline-radio"
              >
              <span class="timeline-label">{{ timeline.label }}</span>
                    </label>
                  </div>
                </div>

        <!-- File Upload -->
        <div class="form-group">
          <label for="file" class="form-label">
            <i class="fas fa-paperclip"></i>
            Attach Files (Optional)
          </label>
          <div class="file-upload">
                    <input 
              id="file"
              type="file"
              ref="fileInput"
              @change="handleFileUpload"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              class="file-input"
            >
            <label for="file" class="file-label">
              <i class="fas fa-cloud-upload-alt"></i>
              <span>Choose files or drag and drop</span>
              <small>PDF, DOC, TXT, JPG, PNG (Max 10MB each)</small>
                    </label>
                  </div>
          <div v-if="uploadedFiles.length > 0" class="uploaded-files">
            <div v-for="(file, index) in uploadedFiles" :key="index" class="uploaded-file">
              <i class="fas fa-file"></i>
              <span>{{ file.name }}</span>
              <button type="button" @click="removeFile(index)" class="remove-file">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
                </div>

        <!-- Privacy Notice -->
        <div class="form-group">
          <label class="checkbox-label">
                    <input 
                      type="checkbox" 
              v-model="form.privacy"
              class="checkbox-input"
                      required
                    >
            <span class="checkbox-text">
              I agree to the <a href="#" @click.prevent="showPrivacyModal = true">Privacy Policy</a> 
              and consent to the processing of my personal data.
            </span>
                    </label>
          <div class="error-message" v-if="errors.privacy">
            <i class="fas fa-exclamation-circle"></i>
            {{ errors.privacy }}
                  </div>
                </div>

        <!-- Submit Button -->
        <div class="form-actions">
                  <button 
                    type="submit" 
            class="submit-btn"
                    :disabled="isSubmitting || !isFormValid"
            :class="{ 'loading': isSubmitting }"
          >
            <span v-if="!isSubmitting">
              <i class="fas fa-paper-plane"></i>
              Send Message
            </span>
            <span v-else>
              <i class="fas fa-spinner fa-spin"></i>
              Sending...
            </span>
          </button>
          
          <button
            type="button"
            @click="resetForm"
            class="reset-btn"
            :disabled="isSubmitting"
          >
            <i class="fas fa-undo"></i>
            Reset Form
                  </button>
                </div>
              </form>

              <!-- Success Message -->
      <div v-if="showSuccess" class="success-message">
        <div class="success-content">
          <i class="fas fa-check-circle"></i>
          <h3>Message Sent Successfully!</h3>
          <p>Thank you for your message. I'll get back to you within 24 hours.</p>
          <button @click="showSuccess = false" class="close-success">
            <i class="fas fa-times"></i>
          </button>
      </div>
    </div>

      <!-- Privacy Modal -->
      <div v-if="showPrivacyModal" class="privacy-modal" @click="showPrivacyModal = false">
        <div class="privacy-content" @click.stop>
          <div class="privacy-header">
            <h3>Privacy Policy</h3>
            <button @click="showPrivacyModal = false" class="close-modal">
            <i class="fas fa-times"></i>
          </button>
        </div>
          <div class="privacy-body">
            <p>Your privacy is important to us. This policy explains how we collect, use, and protect your information when you contact us.</p>
            <h4>Information We Collect</h4>
            <ul>
              <li>Name and contact information</li>
              <li>Project details and requirements</li>
              <li>Any files you choose to upload</li>
            </ul>
            <h4>How We Use Your Information</h4>
            <ul>
              <li>To respond to your inquiries</li>
              <li>To provide project estimates</li>
              <li>To communicate about potential collaboration</li>
            </ul>
            <h4>Data Protection</h4>
            <p>We implement appropriate security measures to protect your personal information and never share it with third parties without your consent.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnhancedContactForm',
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        customSubject: '',
        message: '',
        budget: '',
        timeline: '',
        privacy: false
      },
      errors: {},
      isSubmitting: false,
      showSuccess: false,
      showPrivacyModal: false,
      uploadedFiles: [],
      budgetOptions: [
        { value: 'under-5k', label: 'Under $5,000' },
        { value: '5k-10k', label: '$5,000 - $10,000' },
        { value: '10k-25k', label: '$10,000 - $25,000' },
        { value: '25k-50k', label: '$25,000 - $50,000' },
        { value: '50k-plus', label: '$50,000+' },
        { value: 'discuss', label: 'Let\'s discuss' }
      ],
      timelineOptions: [
        { value: 'asap', label: 'ASAP' },
        { value: '1-month', label: 'Within 1 month' },
        { value: '2-3-months', label: '2-3 months' },
        { value: '3-6-months', label: '3-6 months' },
        { value: '6-months-plus', label: '6+ months' },
        { value: 'flexible', label: 'Flexible' }
      ]
    }
  },
  computed: {
    isFormValid() {
      return this.form.name && 
             this.form.email && 
             this.form.subject && 
             this.form.message && 
             this.form.privacy &&
             Object.keys(this.errors).length === 0
    }
  },
  methods: {
    validateField(field) {
      this.errors[field] = ''
      
      switch (field) {
        case 'name':
          if (!this.form.name.trim()) {
            this.errors.name = 'Name is required'
          } else if (this.form.name.trim().length < 2) {
            this.errors.name = 'Name must be at least 2 characters'
          }
          break
          
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!this.form.email.trim()) {
            this.errors.email = 'Email is required'
          } else if (!emailRegex.test(this.form.email)) {
            this.errors.email = 'Please enter a valid email address'
          }
          break
          
        case 'phone':
          if (this.form.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(this.form.phone.replace(/\s/g, ''))) {
            this.errors.phone = 'Please enter a valid phone number'
          }
          break
          
        case 'subject':
          if (!this.form.subject) {
            this.errors.subject = 'Please select a subject'
          }
          break
          
        case 'customSubject':
          if (this.form.subject === 'other' && !this.form.customSubject.trim()) {
            this.errors.customSubject = 'Custom subject is required'
          }
          break
          
        case 'message':
          if (!this.form.message.trim()) {
            this.errors.message = 'Message is required'
          } else if (this.form.message.trim().length < 10) {
            this.errors.message = 'Message must be at least 10 characters'
          } else if (this.form.message.length > 1000) {
            this.errors.message = 'Message must be less than 1000 characters'
          }
          break
          
        case 'privacy':
          if (!this.form.privacy) {
            this.errors.privacy = 'You must agree to the privacy policy'
          }
          break
      }
    },
    
    clearError(field) {
      if (this.errors[field]) {
        this.errors[field] = ''
      }
    },
    
    handleFileUpload(event) {
      const files = Array.from(event.target.files)
      const maxSize = 10 * 1024 * 1024 // 10MB
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      
      files.forEach(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`)
          return
      }
      
      if (!allowedTypes.includes(file.type)) {
          alert(`File ${file.name} has an unsupported format.`)
          return
      }
      
        this.uploadedFiles.push(file)
      })
    },
    
    removeFile(index) {
      this.uploadedFiles.splice(index, 1)
    },
    
    async submitForm() {
      // Validate all fields
      Object.keys(this.form).forEach(field => {
        if (field !== 'budget' && field !== 'timeline' && field !== 'phone') {
          this.validateField(field)
        }
      })
      
      if (!this.isFormValid) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Reset form
        this.resetForm()
        this.showSuccess = true
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.showSuccess = false
        }, 5000)
        
      } catch (error) {
        console.error('Error submitting form:', error)
        alert('There was an error sending your message. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    },
    
    resetForm() {
        this.form = {
          name: '',
          email: '',
          phone: '',
          subject: '',
        customSubject: '',
          message: '',
          budget: '',
        timeline: '',
        privacy: false
        }
      this.errors = {}
        this.uploadedFiles = []
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    }
  }
}
</script>

<style scoped>
.enhanced-contact-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.form-container {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  position: relative;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: 600;
}

.form-subtitle {
  color: var(--secondary-color);
  font-size: 1.1rem;
  margin: 0;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 12px 45px 12px 15px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.form-input.success {
  border-color: #28a745;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

.input-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #28a745;
}

.input-icon i.fa-exclamation-triangle {
  color: #dc3545;
}

.textarea-wrapper {
  position: relative;
}

.form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-textarea.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.form-textarea.success {
  border-color: #28a745;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

.textarea-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.char-count {
  font-size: 0.8rem;
  color: var(--secondary-color);
}

.char-count.warning {
  color: #ffc107;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  color: #dc3545;
  font-size: 0.9rem;
}

.budget-options,
.timeline-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.budget-option,
.timeline-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 10px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.budget-option:hover,
.timeline-option:hover {
  border-color: var(--primary-color);
  background: rgba(0, 123, 255, 0.05);
}

.budget-radio,
.timeline-radio {
  margin: 0;
}

.budget-label,
.timeline-label {
  font-size: 0.9rem;
  color: var(--text-color);
}

.file-upload {
  position: relative;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 2px dashed var(--border-color);
  border-radius: 10px;
  background: var(--bg-color);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.file-label:hover {
  border-color: var(--primary-color);
  background: rgba(0, 123, 255, 0.05);
}

.file-label i {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.file-label span {
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.file-label small {
  color: var(--secondary-color);
}

.uploaded-files {
  margin-top: 1rem;
}

.uploaded-file {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(40, 167, 69, 0.1);
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.uploaded-file i {
  color: #28a745;
}

.uploaded-file span {
  flex: 1;
  color: var(--text-color);
  font-size: 0.9rem;
}

.remove-file {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.remove-file:hover {
  background: rgba(220, 53, 69, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-input {
  margin: 0;
  margin-top: 0.25rem;
}

.checkbox-text {
  font-size: 0.9rem;
  color: var(--text-color);
  line-height: 1.4;
}

.checkbox-text a {
  color: var(--primary-color);
  text-decoration: none;
}

.checkbox-text a:hover {
  text-decoration: underline;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.submit-btn {
  padding: 12px 30px;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn.loading {
  background: var(--secondary-color);
}

.reset-btn {
  padding: 12px 20px;
  background: transparent;
  color: var(--text-color);
  border: 2px solid var(--border-color);
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reset-btn:hover:not(:disabled) {
  background: var(--secondary-bg);
  border-color: var(--secondary-color);
}

.reset-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  max-width: 400px;
  width: 90%;
}

.success-content {
  text-align: center;
  position: relative;
}

.success-content i {
  font-size: 3rem;
  color: #28a745;
  margin-bottom: 1rem;
}

.success-content h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.success-content p {
  color: var(--secondary-color);
  margin-bottom: 1rem;
}

.close-success {
  position: absolute;
  top: -10px;
  right: -10px;
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

.privacy-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.privacy-content {
  background: var(--card-bg);
  border-radius: 15px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.privacy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.privacy-header h3 {
  margin: 0;
  color: var(--text-color);
}

.close-modal {
  background: none;
  border: none;
  color: var(--secondary-color);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-modal:hover {
  background: var(--secondary-bg);
}

.privacy-body {
  padding: 1.5rem;
}

.privacy-body h4 {
  color: var(--text-color);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.privacy-body ul {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.privacy-body li {
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
}

.privacy-body p {
  color: var(--secondary-color);
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .enhanced-contact-form {
    padding: 1rem;
  }
  
  .form-container {
    padding: 1.5rem;
  }
  
  .budget-options,
  .timeline-options {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .submit-btn,
  .reset-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>