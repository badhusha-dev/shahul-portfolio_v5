<template>
  <div class="interactive-timeline">
    <!-- Timeline Controls -->
    <div class="timeline-controls">
      <div class="filter-section">
        <h4>Filter by Category</h4>
        <div class="filter-buttons">
          <button 
            v-for="category in categories" 
            :key="category"
            @click="toggleFilter(category)"
            class="filter-btn"
            :class="{ active: activeFilters.includes(category) }"
          >
            <i :class="getCategoryIcon(category)"></i>
            {{ category }}
          </button>
        </div>
      </div>
      
      <div class="view-controls">
        <div class="view-toggle">
          <button 
            @click="viewMode = 'timeline'"
            class="view-btn"
            :class="{ active: viewMode === 'timeline' }"
            title="Timeline View"
          >
            <i class="fas fa-stream"></i>
          </button>
          <button 
            @click="viewMode = 'grid'"
            class="view-btn"
            :class="{ active: viewMode === 'grid' }"
            title="Grid View"
          >
            <i class="fas fa-th"></i>
          </button>
          <button 
            @click="viewMode = 'list'"
            class="view-btn"
            :class="{ active: viewMode === 'list' }"
            title="List View"
          >
            <i class="fas fa-list"></i>
          </button>
        </div>
        
        <div class="sort-controls">
          <select v-model="sortBy" class="sort-select">
            <option value="date">Sort by Date</option>
            <option value="company">Sort by Company</option>
            <option value="role">Sort by Role</option>
            <option value="duration">Sort by Duration</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Timeline Content -->
    <div class="timeline-content" :class="`view-${viewMode}`">
      <!-- Timeline View -->
      <div v-if="viewMode === 'timeline'" class="timeline-view">
        <div class="timeline-line"></div>
        <div 
          v-for="(experience, index) in filteredExperiences" 
          :key="experience.id"
          class="timeline-item"
          :class="{ 'left': index % 2 === 0, 'right': index % 2 === 1 }"
          :style="{ animationDelay: (index * 0.2) + 's' }"
        >
          <div class="timeline-marker">
            <div class="marker-icon">
              <i :class="getCategoryIcon(experience.category)"></i>
            </div>
            <div class="marker-date">{{ formatDate(experience.startDate) }}</div>
          </div>
          
          <div class="timeline-card" @click="openDetailModal(experience)">
            <div class="card-header">
              <h5 class="card-title">{{ experience.role }}</h5>
              <h6 class="card-subtitle">{{ experience.company }}</h6>
              <div class="card-duration">{{ experience.duration }}</div>
            </div>
            
            <div class="card-body">
              <p class="card-description">{{ experience.description }}</p>
              
              <div class="card-technologies">
                <span 
                  v-for="tech in experience.technologies.slice(0, 5)" 
                  :key="tech" 
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
                <span v-if="experience.technologies.length > 5" class="tech-more">
                  +{{ experience.technologies.length - 5 }}
                </span>
              </div>
              
              <div class="card-achievements">
                <h6>Achievements:</h6>
                <ul>
                  <li v-for="achievement in experience.achievements.slice(0, 2)" :key="achievement">
                    {{ achievement }}
                  </li>
                </ul>
              </div>
            </div>
            
            <div class="card-footer">
              <button class="btn btn-outline-primary btn-sm">
                <i class="fas fa-eye me-1"></i>View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="grid-view">
        <div class="row">
          <div 
            v-for="(experience, index) in filteredExperiences" 
            :key="experience.id"
            class="col-lg-4 col-md-6 mb-4"
          >
            <div 
              class="experience-card"
              :style="{ animationDelay: (index * 0.1) + 's' }"
              @click="openDetailModal(experience)"
            >
              <div class="card-header">
                <div class="company-logo">
                  <i :class="getCategoryIcon(experience.category)"></i>
                </div>
                <div class="card-info">
                  <h5>{{ experience.role }}</h5>
                  <h6>{{ experience.company }}</h6>
                  <span class="duration">{{ experience.duration }}</span>
                </div>
              </div>
              
              <div class="card-body">
                <p>{{ experience.description }}</p>
                
                <div class="technologies">
                  <span 
                    v-for="tech in experience.technologies.slice(0, 4)" 
                    :key="tech" 
                    class="tech-tag"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
              
              <div class="card-footer">
                <button class="btn btn-primary btn-sm w-100">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else-if="viewMode === 'list'" class="list-view">
        <div class="list-container">
          <div 
            v-for="(experience, index) in filteredExperiences" 
            :key="experience.id"
            class="list-item"
            :style="{ animationDelay: (index * 0.1) + 's' }"
            @click="openDetailModal(experience)"
          >
            <div class="list-icon">
              <i :class="getCategoryIcon(experience.category)"></i>
            </div>
            
            <div class="list-content">
              <div class="list-header">
                <h5>{{ experience.role }}</h5>
                <span class="company">{{ experience.company }}</span>
                <span class="duration">{{ experience.duration }}</span>
              </div>
              
              <p class="list-description">{{ experience.description }}</p>
              
              <div class="list-technologies">
                <span 
                  v-for="tech in experience.technologies.slice(0, 6)" 
                  :key="tech" 
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
            
            <div class="list-actions">
              <button class="btn btn-outline-primary btn-sm">
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="selectedExperience" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedExperience.role }}</h3>
          <h4>{{ selectedExperience.company }}</h4>
          <button @click="closeDetailModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="modal-info">
            <div class="info-item">
              <i class="fas fa-calendar"></i>
              <span>{{ selectedExperience.duration }}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>{{ selectedExperience.location }}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-tag"></i>
              <span>{{ selectedExperience.category }}</span>
            </div>
          </div>
          
          <div class="modal-description">
            <h5>Description</h5>
            <p>{{ selectedExperience.description }}</p>
          </div>
          
          <div class="modal-responsibilities">
            <h5>Key Responsibilities</h5>
            <ul>
              <li v-for="responsibility in selectedExperience.responsibilities" :key="responsibility">
                {{ responsibility }}
              </li>
            </ul>
          </div>
          
          <div class="modal-achievements">
            <h5>Achievements</h5>
            <ul>
              <li v-for="achievement in selectedExperience.achievements" :key="achievement">
                {{ achievement }}
              </li>
            </ul>
          </div>
          
          <div class="modal-technologies">
            <h5>Technologies Used</h5>
            <div class="tech-grid">
              <span 
                v-for="tech in selectedExperience.technologies" 
                :key="tech" 
                class="tech-tag"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeDetailModal" class="btn btn-secondary">
            Close
          </button>
          <a :href="selectedExperience.companyWebsite" target="_blank" class="btn btn-primary" v-if="selectedExperience.companyWebsite">
            Visit Company
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { experiences } from '../data/experience.js'

export default {
  name: 'InteractiveTimeline',
  data() {
    return {
      experiences,
      viewMode: 'timeline',
      sortBy: 'date',
      activeFilters: [],
      selectedExperience: null
    }
  },
  computed: {
    categories() {
      const cats = [...new Set(this.experiences.map(exp => exp.category))]
      return cats.sort()
    },
    filteredExperiences() {
      let filtered = this.experiences
      
      // Apply category filters
      if (this.activeFilters.length > 0) {
        filtered = filtered.filter(exp => this.activeFilters.includes(exp.category))
      }
      
      // Apply sorting
      filtered = [...filtered].sort((a, b) => {
        switch (this.sortBy) {
          case 'date':
            return new Date(b.startDate) - new Date(a.startDate)
          case 'company':
            return a.company.localeCompare(b.company)
          case 'role':
            return a.role.localeCompare(b.role)
          case 'duration':
            return this.calculateDuration(b) - this.calculateDuration(a)
          default:
            return 0
        }
      })
      
      return filtered
    }
  },
  methods: {
    toggleFilter(category) {
      const index = this.activeFilters.indexOf(category)
      if (index > -1) {
        this.activeFilters.splice(index, 1)
      } else {
        this.activeFilters.push(category)
      }
    },
    
    getCategoryIcon(category) {
      const icons = {
        'Work Experience': 'fas fa-briefcase',
        'Education': 'fas fa-graduation-cap',
        'Project': 'fas fa-code',
        'Certification': 'fas fa-certificate',
        'Achievement': 'fas fa-trophy'
      }
      return icons[category] || 'fas fa-circle'
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      })
    },
    
    calculateDuration(experience) {
      const start = new Date(experience.startDate)
      const end = experience.endDate ? new Date(experience.endDate) : new Date()
      return end - start
    },
    
    openDetailModal(experience) {
      this.selectedExperience = experience
    },
    
    closeDetailModal() {
      this.selectedExperience = null
    }
  }
}
</script>

<style scoped>
.interactive-timeline {
  padding: 40px 0;
}

.timeline-controls {
  background: var(--card-bg);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.filter-section h4 {
  margin-bottom: 15px;
  color: var(--text-color);
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-btn {
  padding: 8px 16px;
  border: 2px solid var(--border-color);
  background: var(--body-bg);
  color: var(--text-color);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-btn:hover {
  border-color: var(--primary-color);
  background: rgba(0, 123, 255, 0.1);
}

.filter-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.view-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.view-toggle {
  display: flex;
  gap: 5px;
}

.view-btn {
  width: 40px;
  height: 40px;
  border: 2px solid var(--border-color);
  background: var(--body-bg);
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn:hover {
  border-color: var(--primary-color);
  background: rgba(0, 123, 255, 0.1);
}

.view-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.sort-select {
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  background: var(--body-bg);
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
}

/* Timeline View */
.timeline-view {
  position: relative;
  padding: 40px 0;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, var(--primary-color), var(--info-color));
  transform: translateX(-50%);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 60px;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.timeline-item.left {
  text-align: right;
  padding-right: 60%;
}

.timeline-item.right {
  text-align: left;
  padding-left: 60%;
}

.timeline-marker {
  position: absolute;
  top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.timeline-item.left .timeline-marker {
  right: calc(60% - 30px);
}

.timeline-item.right .timeline-marker {
  left: calc(60% - 30px);
}

.marker-icon {
  width: 60px;
  height: 60px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border: 4px solid var(--body-bg);
}

.marker-date {
  margin-top: 10px;
  font-size: 0.9rem;
  color: var(--secondary-color);
  font-weight: 500;
}

.timeline-card {
  background: var(--card-bg);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.timeline-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-color);
}

.card-title {
  margin-bottom: 5px;
  color: var(--text-color);
  font-weight: 600;
}

.card-subtitle {
  color: var(--primary-color);
  margin-bottom: 10px;
}

.card-duration {
  font-size: 0.9rem;
  color: var(--secondary-color);
  margin-bottom: 15px;
}

.card-description {
  margin-bottom: 20px;
  color: var(--text-color);
  line-height: 1.6;
}

.card-technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.tech-tag {
  background: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tech-more {
  background: var(--secondary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.card-achievements h6 {
  margin-bottom: 10px;
  color: var(--text-color);
}

.card-achievements ul {
  margin: 0;
  padding-left: 20px;
}

.card-achievements li {
  margin-bottom: 5px;
  color: var(--text-color);
}

/* Grid View */
.grid-view {
  padding: 20px 0;
}

.experience-card {
  background: var(--card-bg);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.experience-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.company-logo {
  width: 60px;
  height: 60px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 15px;
}

.card-info h5 {
  margin-bottom: 5px;
  color: var(--text-color);
}

.card-info h6 {
  margin-bottom: 5px;
  color: var(--primary-color);
}

.duration {
  font-size: 0.9rem;
  color: var(--secondary-color);
}

.technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
}

/* List View */
.list-view {
  padding: 20px 0;
}

.list-container {
  background: var(--card-bg);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.list-item {
  display: flex;
  align-items: center;
  padding: 25px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.list-item:hover {
  background: rgba(0, 123, 255, 0.05);
}

.list-item:last-child {
  border-bottom: none;
}

.list-icon {
  width: 50px;
  height: 50px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 20px;
  flex-shrink: 0;
}

.list-content {
  flex: 1;
}

.list-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.list-header h5 {
  margin: 0;
  color: var(--text-color);
}

.company {
  color: var(--primary-color);
  font-weight: 500;
}

.duration {
  color: var(--secondary-color);
  font-size: 0.9rem;
}

.list-description {
  margin-bottom: 15px;
  color: var(--text-color);
  line-height: 1.6;
}

.list-technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.list-actions {
  margin-left: 20px;
}

/* Modal */
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
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 30px 30px 20px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
}

.modal-header h3 {
  margin-bottom: 5px;
  color: var(--text-color);
}

.modal-header h4 {
  margin-bottom: 0;
  color: var(--primary-color);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: none;
  background: var(--secondary-color);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 30px;
}

.modal-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-color);
}

.info-item i {
  color: var(--primary-color);
}

.modal-description,
.modal-responsibilities,
.modal-achievements,
.modal-technologies {
  margin-bottom: 25px;
}

.modal-description h5,
.modal-responsibilities h5,
.modal-achievements h5,
.modal-technologies h5 {
  margin-bottom: 15px;
  color: var(--text-color);
}

.modal-responsibilities ul,
.modal-achievements ul {
  margin: 0;
  padding-left: 20px;
}

.modal-responsibilities li,
.modal-achievements li {
  margin-bottom: 8px;
  color: var(--text-color);
}

.tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.modal-footer {
  padding: 20px 30px;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .timeline-controls {
    padding: 20px;
  }
  
  .view-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .timeline-item.left,
  .timeline-item.right {
    padding-left: 0;
    padding-right: 0;
    text-align: left;
  }
  
  .timeline-line {
    left: 30px;
  }
  
  .timeline-item.left .timeline-marker,
  .timeline-item.right .timeline-marker {
    left: 0;
    right: auto;
  }
  
  .list-item {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .list-icon {
    margin: 0 auto 15px;
  }
  
  .list-header {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .list-actions {
    margin: 15px 0 0;
  }
  
  .modal-content {
    margin: 10px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 20px;
  }
}
</style>
