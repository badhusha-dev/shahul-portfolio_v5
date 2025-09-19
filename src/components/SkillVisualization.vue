<template>
  <div class="skill-visualization">
    <!-- Skill Controls -->
    <div class="skill-controls">
      <div class="view-toggle">
        <button 
          v-for="view in viewModes" 
          :key="view.id"
          @click="currentView = view.id"
          class="view-btn"
          :class="{ active: currentView === view.id }"
        >
          <i :class="view.icon"></i>
          {{ view.label }}
        </button>
      </div>
      
      <div class="filter-controls">
        <div class="category-filter">
          <select v-model="selectedCategory" class="category-select">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        
        <div class="level-filter">
          <label>Min Level:</label>
          <input 
            v-model="minLevel" 
            type="range" 
            min="0" 
            max="100" 
            step="10"
            class="level-slider"
          >
          <span class="level-value">{{ minLevel }}%</span>
        </div>
      </div>
    </div>

    <!-- Skill Content -->
    <div class="skill-content">
      <!-- Radar Chart View -->
      <div v-if="currentView === 'radar'" class="radar-view">
        <div class="chart-container">
          <canvas ref="radarChart" width="400" height="400"></canvas>
        </div>
        <div class="radar-legend">
          <div v-for="skill in radarSkills" :key="skill.name" class="legend-item">
            <div class="legend-color" :style="{ backgroundColor: skill.color }"></div>
            <span>{{ skill.name }}</span>
          </div>
        </div>
      </div>

      <!-- Progress Bars View -->
      <div v-else-if="currentView === 'progress'" class="progress-view">
        <div class="progress-container">
          <div 
            v-for="skill in filteredSkills" 
            :key="skill.name"
            class="progress-item"
            :style="{ animationDelay: (filteredSkills.indexOf(skill) * 0.1) + 's' }"
          >
            <div class="skill-header">
              <div class="skill-info">
                <h5>{{ skill.name }}</h5>
                <span class="skill-category">{{ skill.category }}</span>
              </div>
              <div class="skill-level">{{ skill.level }}%</div>
            </div>
            
            <div class="progress-bar-container">
              <div class="progress-bar">
                <div 
                  class="progress-fill"
                  :style="{ 
                    width: skill.level + '%',
                    backgroundColor: getSkillColor(skill.level)
                  }"
                ></div>
              </div>
            </div>
            
            <div class="skill-details">
              <p>{{ skill.description }}</p>
              <div class="skill-experience">
                <i class="fas fa-clock"></i>
                <span>{{ skill.experience }} years experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else-if="currentView === 'grid'" class="grid-view">
        <div class="skill-grid">
          <div 
            v-for="skill in filteredSkills" 
            :key="skill.name"
            class="skill-card"
            :style="{ animationDelay: (filteredSkills.indexOf(skill) * 0.1) + 's' }"
            @click="openSkillModal(skill)"
          >
            <div class="card-header">
              <div class="skill-icon">
                <i :class="skill.icon"></i>
              </div>
              <div class="skill-level-circle">
                <div class="level-text">{{ skill.level }}%</div>
              </div>
            </div>
            
            <div class="card-body">
              <h5>{{ skill.name }}</h5>
              <p>{{ skill.description }}</p>
              
              <div class="skill-meta">
                <div class="meta-item">
                  <i class="fas fa-tag"></i>
                  <span>{{ skill.category }}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-clock"></i>
                  <span>{{ skill.experience }}y</span>
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <div class="skill-progress">
                <div 
                  class="progress-line"
                  :style="{ 
                    width: skill.level + '%',
                    backgroundColor: getSkillColor(skill.level)
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparison View -->
      <div v-else-if="currentView === 'comparison'" class="comparison-view">
        <div class="comparison-controls">
          <h4>Compare Skills</h4>
          <div class="skill-selectors">
            <select v-model="compareSkill1" class="skill-select">
              <option value="">Select first skill</option>
              <option v-for="skill in filteredSkills" :key="skill.name" :value="skill.name">
                {{ skill.name }}
              </option>
            </select>
            <select v-model="compareSkill2" class="skill-select">
              <option value="">Select second skill</option>
              <option v-for="skill in filteredSkills" :key="skill.name" :value="skill.name">
                {{ skill.name }}
              </option>
            </select>
          </div>
        </div>
        
        <div v-if="compareSkill1 && compareSkill2" class="comparison-chart">
          <div class="comparison-item">
            <h5>{{ compareSkill1 }}</h5>
            <div class="comparison-bar">
              <div 
                class="bar-fill"
                :style="{ 
                  width: getSkillLevel(compareSkill1) + '%',
                  backgroundColor: '#007bff'
                }"
              ></div>
            </div>
            <span class="comparison-level">{{ getSkillLevel(compareSkill1) }}%</span>
          </div>
          
          <div class="comparison-item">
            <h5>{{ compareSkill2 }}</h5>
            <div class="comparison-bar">
              <div 
                class="bar-fill"
                :style="{ 
                  width: getSkillLevel(compareSkill2) + '%',
                  backgroundColor: '#28a745'
                }"
              ></div>
            </div>
            <span class="comparison-level">{{ getSkillLevel(compareSkill2) }}%</span>
          </div>
        </div>
      </div>

      <!-- Timeline View -->
      <div v-else-if="currentView === 'timeline'" class="timeline-view">
        <div class="skill-timeline">
          <div 
            v-for="(skill, index) in filteredSkills" 
            :key="skill.name"
            class="timeline-item"
            :style="{ animationDelay: (index * 0.1) + 's' }"
          >
            <div class="timeline-marker">
              <div class="marker-icon">
                <i :class="skill.icon"></i>
              </div>
              <div class="marker-level">{{ skill.level }}%</div>
            </div>
            
            <div class="timeline-content">
              <h5>{{ skill.name }}</h5>
              <p>{{ skill.description }}</p>
              <div class="timeline-progress">
                <div 
                  class="progress-fill"
                  :style="{ 
                    width: skill.level + '%',
                    backgroundColor: getSkillColor(skill.level)
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skill Statistics -->
    <div class="skill-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-code"></i>
        </div>
        <div class="stat-content">
          <h4>{{ filteredSkills.length }}</h4>
          <p>Total Skills</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-star"></i>
        </div>
        <div class="stat-content">
          <h4>{{ averageLevel }}%</h4>
          <p>Average Level</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-trophy"></i>
        </div>
        <div class="stat-content">
          <h4>{{ expertSkills }}</h4>
          <p>Expert Level</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <h4>{{ totalExperience }}</h4>
          <p>Years Experience</p>
        </div>
      </div>
    </div>

    <!-- Skill Detail Modal -->
    <div v-if="selectedSkill" class="modal-overlay" @click="closeSkillModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="skill-header">
            <div class="skill-icon-large">
              <i :class="selectedSkill.icon"></i>
            </div>
            <div class="skill-info">
              <h3>{{ selectedSkill.name }}</h3>
              <span class="skill-category">{{ selectedSkill.category }}</span>
            </div>
          </div>
          <button @click="closeSkillModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="skill-level-display">
            <div class="level-circle">
              <div class="level-text">{{ selectedSkill.level }}%</div>
            </div>
            <div class="level-description">
              <h4>{{ getLevelDescription(selectedSkill.level) }}</h4>
              <p>{{ selectedSkill.description }}</p>
            </div>
          </div>
          
          <div class="skill-details">
            <div class="detail-item">
              <i class="fas fa-clock"></i>
              <div>
                <h5>Experience</h5>
                <p>{{ selectedSkill.experience }} years</p>
              </div>
            </div>
            
            <div class="detail-item">
              <i class="fas fa-calendar"></i>
              <div>
                <h5>Last Used</h5>
                <p>{{ selectedSkill.lastUsed }}</p>
              </div>
            </div>
            
            <div class="detail-item">
              <i class="fas fa-project-diagram"></i>
              <div>
                <h5>Projects</h5>
                <p>{{ selectedSkill.projects }} projects</p>
              </div>
            </div>
          </div>
          
          <div class="skill-projects">
            <h5>Recent Projects</h5>
            <div class="project-list">
              <div v-for="project in selectedSkill.recentProjects" :key="project" class="project-item">
                <i class="fas fa-folder"></i>
                <span>{{ project }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { skills } from '../data/skills.js'

export default {
  name: 'SkillVisualization',
  data() {
    return {
      skills,
      currentView: 'progress',
      selectedCategory: '',
      minLevel: 0,
      selectedSkill: null,
      compareSkill1: '',
      compareSkill2: '',
      viewModes: [
        { id: 'progress', label: 'Progress', icon: 'fas fa-chart-bar' },
        { id: 'grid', label: 'Grid', icon: 'fas fa-th' },
        { id: 'radar', label: 'Radar', icon: 'fas fa-chart-pie' },
        { id: 'comparison', label: 'Compare', icon: 'fas fa-balance-scale' },
        { id: 'timeline', label: 'Timeline', icon: 'fas fa-stream' }
      ]
    }
  },
  computed: {
    categories() {
      return [...new Set(this.skills.map(skill => skill.category))]
    },
    filteredSkills() {
      return this.skills.filter(skill => {
        const categoryMatch = !this.selectedCategory || skill.category === this.selectedCategory
        const levelMatch = skill.level >= this.minLevel
        return categoryMatch && levelMatch
      })
    },
    radarSkills() {
      // Select top skills for radar chart
      return this.filteredSkills
        .sort((a, b) => b.level - a.level)
        .slice(0, 6)
        .map((skill, index) => ({
          ...skill,
          color: this.getSkillColor(skill.level)
        }))
    },
    averageLevel() {
      if (this.filteredSkills.length === 0) return 0
      const total = this.filteredSkills.reduce((sum, skill) => sum + skill.level, 0)
      return Math.round(total / this.filteredSkills.length)
    },
    expertSkills() {
      return this.filteredSkills.filter(skill => skill.level >= 80).length
    },
    totalExperience() {
      return this.filteredSkills.reduce((sum, skill) => sum + skill.experience, 0)
    }
  },
  methods: {
    getSkillColor(level) {
      if (level >= 80) return '#28a745' // Green
      if (level >= 60) return '#007bff' // Blue
      if (level >= 40) return '#ffc107' // Yellow
      return '#dc3545' // Red
    },
    
    getLevelDescription(level) {
      if (level >= 90) return 'Expert'
      if (level >= 80) return 'Advanced'
      if (level >= 60) return 'Intermediate'
      if (level >= 40) return 'Beginner'
      return 'Novice'
    },
    
    getSkillLevel(skillName) {
      const skill = this.skills.find(s => s.name === skillName)
      return skill ? skill.level : 0
    },
    
    openSkillModal(skill) {
      this.selectedSkill = skill
    },
    
    closeSkillModal() {
      this.selectedSkill = null
    }
  }
}
</script>

<style scoped>
.skill-visualization {
  padding: 40px 0;
}

.skill-controls {
  background: var(--card-bg);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.view-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.view-btn {
  padding: 10px 20px;
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

.view-btn:hover {
  border-color: var(--primary-color);
  background: rgba(0, 123, 255, 0.1);
}

.view-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.filter-controls {
  display: flex;
  gap: 30px;
  align-items: center;
  flex-wrap: wrap;
}

.category-select {
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  background: var(--body-bg);
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
}

.level-filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.level-slider {
  width: 150px;
}

.level-value {
  font-weight: 500;
  color: var(--primary-color);
}

/* Progress View */
.progress-view {
  padding: 20px 0;
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.progress-item {
  background: var(--card-bg);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.skill-info h5 {
  margin-bottom: 5px;
  color: var(--text-color);
}

.skill-category {
  color: var(--primary-color);
  font-size: 0.9rem;
}

.skill-level {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.progress-bar-container {
  margin-bottom: 20px;
}

.progress-bar {
  height: 12px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 1s ease;
}

.skill-details p {
  margin-bottom: 10px;
  color: var(--text-color);
}

.skill-experience {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--secondary-color);
}

/* Grid View */
.grid-view {
  padding: 20px 0;
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.skill-card {
  background: var(--card-bg);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.skill-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.skill-icon {
  width: 50px;
  height: 50px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.skill-level-circle {
  width: 40px;
  height: 40px;
  border: 3px solid var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.level-text {
  font-weight: bold;
  color: var(--primary-color);
  font-size: 0.9rem;
}

.card-body h5 {
  margin-bottom: 10px;
  color: var(--text-color);
}

.card-body p {
  margin-bottom: 15px;
  color: var(--text-color);
  font-size: 0.9rem;
}

.skill-meta {
  display: flex;
  gap: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--secondary-color);
  font-size: 0.8rem;
}

.card-footer {
  margin-top: 15px;
}

.skill-progress {
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-line {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease;
}

/* Comparison View */
.comparison-view {
  padding: 20px 0;
}

.comparison-controls {
  background: var(--card-bg);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.comparison-controls h4 {
  margin-bottom: 20px;
  color: var(--text-color);
}

.skill-selectors {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.skill-select {
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  background: var(--body-bg);
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
  min-width: 200px;
}

.comparison-chart {
  background: var(--card-bg);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.comparison-item {
  margin-bottom: 30px;
}

.comparison-item h5 {
  margin-bottom: 10px;
  color: var(--text-color);
}

.comparison-bar {
  height: 20px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.bar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 1s ease;
}

.comparison-level {
  font-weight: bold;
  color: var(--primary-color);
}

/* Timeline View */
.timeline-view {
  padding: 20px 0;
}

.skill-timeline {
  position: relative;
  padding: 40px 0;
}

.skill-timeline::before {
  content: '';
  position: absolute;
  left: 30px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, var(--primary-color), var(--info-color));
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
  padding-left: 80px;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.timeline-marker {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.marker-level {
  margin-top: 10px;
  font-size: 0.9rem;
  color: var(--secondary-color);
  font-weight: 500;
}

.timeline-content {
  background: var(--card-bg);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.timeline-content h5 {
  margin-bottom: 10px;
  color: var(--text-color);
}

.timeline-content p {
  margin-bottom: 15px;
  color: var(--text-color);
}

.timeline-progress {
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

/* Skill Statistics */
.skill-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
  margin-top: 40px;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 20px;
}

.stat-content h4 {
  margin-bottom: 5px;
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-color);
}

.stat-content p {
  margin: 0;
  color: var(--secondary-color);
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
  max-width: 600px;
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

.skill-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.skill-icon-large {
  width: 80px;
  height: 80px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.skill-info h3 {
  margin-bottom: 5px;
  color: var(--text-color);
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

.skill-level-display {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
}

.level-circle {
  width: 120px;
  height: 120px;
  border: 8px solid var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.level-circle .level-text {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.level-description h4 {
  margin-bottom: 10px;
  color: var(--text-color);
}

.level-description p {
  color: var(--text-color);
}

.skill-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.detail-item i {
  color: var(--primary-color);
  font-size: 1.2rem;
}

.detail-item h5 {
  margin-bottom: 5px;
  color: var(--text-color);
}

.detail-item p {
  margin: 0;
  color: var(--secondary-color);
}

.skill-projects h5 {
  margin-bottom: 15px;
  color: var(--text-color);
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.project-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(0, 123, 255, 0.1);
  border-radius: 8px;
}

.project-item i {
  color: var(--primary-color);
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
  .skill-controls {
    padding: 20px;
  }
  
  .view-toggle {
    justify-content: center;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .skill-grid {
    grid-template-columns: 1fr;
  }
  
  .skill-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .skill-level-display {
    flex-direction: column;
    text-align: center;
  }
  
  .skill-details {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    margin: 10px;
  }
  
  .modal-header,
  .modal-body {
    padding: 20px;
  }
}
</style>
