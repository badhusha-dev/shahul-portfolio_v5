<template>
  <div class="skill-visualization">
    <div class="viz-header">
      <h2 class="viz-title">
        <i class="fas fa-chart-pie me-2"></i>
        Skills Visualization
      </h2>
      <div class="viz-controls">
        <button 
          @click="viewMode = 'radar'" 
          :class="{ active: viewMode === 'radar' }"
          class="view-btn"
          title="Radar Chart"
        >
          <i class="fas fa-chart-radar"></i>
        </button>
        <button 
          @click="viewMode = 'bars'" 
          :class="{ active: viewMode === 'bars' }"
          class="view-btn"
          title="Bar Chart"
        >
          <i class="fas fa-chart-bar"></i>
        </button>
        <button 
          @click="viewMode = 'circular'" 
          :class="{ active: viewMode === 'circular' }"
          class="view-btn"
          title="Circular Progress"
        >
          <i class="fas fa-circle-notch"></i>
        </button>
        <button 
          @click="viewMode = 'network'" 
          :class="{ active: viewMode === 'network' }"
          class="view-btn"
          title="Skill Network"
        >
          <i class="fas fa-project-diagram"></i>
        </button>
      </div>
    </div>

    <!-- Radar Chart View -->
    <div v-if="viewMode === 'radar'" class="radar-container">
      <div class="radar-chart">
        <svg :width="chartSize" :height="chartSize" class="radar-svg">
          <!-- Background circles -->
          <g v-for="level in 5" :key="level" class="radar-level">
            <circle 
              :cx="chartSize/2" 
              :cy="chartSize/2" 
              :r="(chartSize/2 - 50) * (level / 5)"
              fill="none"
              :stroke="getLevelColor(level)"
              :stroke-width="level === 5 ? 2 : 1"
              :opacity="level === 5 ? 1 : 0.3"
            />
          </g>
          
          <!-- Skill axes -->
          <g v-for="(skill, index) in skills" :key="skill.name" class="skill-axis">
            <line
              :x1="chartSize/2"
              :y1="chartSize/2"
              :x2="getAxisX(index)"
              :y2="getAxisY(index)"
              stroke="var(--border-color)"
              stroke-width="1"
              opacity="0.5"
            />
            <text
              :x="getAxisX(index)"
              :y="getAxisY(index)"
              text-anchor="middle"
              dominant-baseline="middle"
              class="axis-label"
            >
              {{ skill.name }}
            </text>
          </g>
          
          <!-- Skill data polygon -->
          <polygon
            :points="skillPolygonPoints"
            fill="var(--primary-color)"
            fill-opacity="0.2"
            stroke="var(--primary-color)"
            stroke-width="2"
          />
          
          <!-- Skill data points -->
          <circle
            v-for="(skill, index) in skills"
            :key="`point-${skill.name}`"
            :cx="getSkillX(index)"
            :cy="getSkillY(index)"
            :r="6"
            :fill="getSkillColor(skill.level)"
            stroke="white"
            stroke-width="2"
            class="skill-point"
            @mouseenter="showTooltip(skill, $event)"
            @mouseleave="hideTooltip"
          />
        </svg>
      </div>
      
      <div class="radar-legend">
        <div class="legend-item" v-for="skill in skills" :key="skill.name">
          <div class="legend-color" :style="{ backgroundColor: getSkillColor(skill.level) }"></div>
          <span class="legend-text">{{ skill.name }} ({{ skill.level }}%)</span>
        </div>
      </div>
    </div>

    <!-- Bar Chart View -->
    <div v-if="viewMode === 'bars'" class="bars-container">
      <div class="bars-chart">
        <div 
          v-for="skill in sortedSkills" 
          :key="skill.name"
          class="bar-item"
          @mouseenter="showTooltip(skill, $event)"
          @mouseleave="hideTooltip"
        >
          <div class="bar-label">{{ skill.name }}</div>
          <div class="bar-track">
            <div 
              class="bar-fill"
              :style="{ 
                width: `${skill.level}%`,
                backgroundColor: getSkillColor(skill.level)
              }"
            >
              <span class="bar-value">{{ skill.level }}%</span>
            </div>
          </div>
          <div class="bar-category">{{ skill.category }}</div>
        </div>
      </div>
    </div>

    <!-- Circular Progress View -->
    <div v-if="viewMode === 'circular'" class="circular-container">
      <div class="circular-grid">
        <div 
          v-for="skill in skills" 
          :key="skill.name"
          class="circular-item"
          @mouseenter="showTooltip(skill, $event)"
          @mouseleave="hideTooltip"
        >
          <div class="circular-chart">
            <svg :width="circularSize" :height="circularSize" class="circular-svg">
              <circle
                :cx="circularSize/2"
                :cy="circularSize/2"
                :r="(circularSize - 20)/2"
                fill="none"
                stroke="var(--border-color)"
                stroke-width="8"
                opacity="0.3"
              />
              <circle
                :cx="circularSize/2"
                :cy="circularSize/2"
                :r="(circularSize - 20)/2"
                fill="none"
                :stroke="getSkillColor(skill.level)"
                stroke-width="8"
                stroke-linecap="round"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="getCircularOffset(skill.level)"
                class="circular-progress"
              />
            </svg>
            <div class="circular-text">
              <div class="circular-percentage">{{ skill.level }}%</div>
              <div class="circular-skill">{{ skill.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Network View -->
    <div v-if="viewMode === 'network'" class="network-container">
      <div class="network-chart">
        <svg :width="networkSize" :height="networkSize" class="network-svg">
          <!-- Skill nodes -->
          <g v-for="skill in skills" :key="skill.name" class="skill-node">
            <circle
              :cx="getNetworkX(skill)"
              :cy="getNetworkY(skill)"
              :r="getNodeSize(skill.level)"
              :fill="getSkillColor(skill.level)"
              stroke="white"
              stroke-width="2"
              class="node-circle"
              @mouseenter="showTooltip(skill, $event)"
              @mouseleave="hideTooltip"
            />
            <text
              :x="getNetworkX(skill)"
              :y="getNetworkY(skill) + 5"
              text-anchor="middle"
              dominant-baseline="middle"
              class="node-label"
            >
              {{ skill.name }}
            </text>
          </g>
          
          <!-- Connections between related skills -->
          <g v-for="connection in skillConnections" :key="`${connection.from}-${connection.to}`" class="connection">
            <line
              :x1="getNetworkX(getSkillByName(connection.from))"
              :y1="getNetworkY(getSkillByName(connection.from))"
              :x2="getNetworkX(getSkillByName(connection.to))"
              :y2="getNetworkY(getSkillByName(connection.to))"
              stroke="var(--primary-color)"
              stroke-width="2"
              opacity="0.3"
            />
          </g>
        </svg>
      </div>
    </div>

    <!-- Tooltip -->
    <div v-if="tooltip.visible" class="skill-tooltip" :style="tooltipStyle">
      <div class="tooltip-content">
        <h4>{{ tooltip.skill?.name }}</h4>
        <p>{{ tooltip.skill?.description }}</p>
        <div class="tooltip-details">
          <div class="tooltip-level">
            <span>Level:</span>
            <span class="level-value">{{ tooltip.skill?.level }}%</span>
          </div>
          <div class="tooltip-category">
            <span>Category:</span>
            <span class="category-value">{{ tooltip.skill?.category }}</span>
          </div>
          <div class="tooltip-experience">
            <span>Experience:</span>
            <span class="experience-value">{{ tooltip.skill?.experience }}</span>
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
          <div class="stat-number">{{ skills.length }}</div>
          <div class="stat-label">Total Skills</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-star"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ averageLevel }}%</div>
          <div class="stat-label">Average Level</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-trophy"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ expertSkills.length }}</div>
          <div class="stat-label">Expert Level</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-layer-group"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ categories.length }}</div>
          <div class="stat-label">Categories</div>
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
      skills: skills,
      viewMode: 'radar',
      chartSize: 400,
      circularSize: 120,
      networkSize: 500,
      tooltip: {
        visible: false,
        skill: null,
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    sortedSkills() {
      const flatSkills = this.flattenSkills()
      return [...flatSkills].sort((a, b) => b.level - a.level)
    },
    categories() {
      return [...new Set(this.flattenSkills().map(skill => skill.category))].sort()
    },
    uniqueTechnologies() {
      return this.flattenSkills().map(skill => skill.name).sort()
    },
    averageLevel() {
      const flatSkills = this.flattenSkills()
      const total = flatSkills.reduce((sum, skill) => sum + skill.level, 0)
      return Math.round(total / flatSkills.length)
    },
    expertSkills() {
      return this.flattenSkills().filter(skill => skill.level >= 80)
    },
    skillPolygonPoints() {
      const flatSkills = this.flattenSkills()
      return flatSkills.map((skill, index) => {
        const x = this.getSkillX(index)
        const y = this.getSkillY(index)
        return `${x},${y}`
      }).join(' ')
    },
    circumference() {
      return 2 * Math.PI * ((this.circularSize - 20) / 2)
    },
    skillConnections() {
      // Define connections between related skills
      return [
        { from: 'JavaScript', to: 'React' },
        { from: 'JavaScript', to: 'Node.js' },
        { from: 'Java', to: 'Spring Boot' },
        { from: 'Spring Boot', to: 'Microservices' },
        { from: 'Docker', to: 'Kubernetes' },
        { from: 'MySQL', to: 'PostgreSQL' },
        { from: 'React', to: 'Redux' },
        { from: 'Python', to: 'Django' }
      ]
    },
    tooltipStyle() {
      return {
        left: `${this.tooltip.x}px`,
        top: `${this.tooltip.y}px`,
        transform: 'translate(-50%, -100%)'
      }
    }
  },
  methods: {
    flattenSkills() {
      try {
        console.log('SkillVisualization skills data:', this.skills)
        const flatSkills = []
        Object.keys(this.skills).forEach(categoryKey => {
          const categoryName = this.formatCategoryName(categoryKey)
          this.skills[categoryKey].forEach(skill => {
            flatSkills.push({
              ...skill,
              category: categoryName,
              experience: skill.years || '2+ years',
              description: `Proficient in ${skill.name} with ${skill.years || '2+'} years of experience`
            })
          })
        })
        console.log('Flattened skills:', flatSkills)
        return flatSkills
      } catch (error) {
        console.error('Error in flattenSkills method:', error)
        return []
      }
    },
    
    formatCategoryName(categoryKey) {
      const categoryMap = {
        'backend': 'Backend',
        'frontend': 'Frontend',
        'database': 'Database',
        'tools': 'Tools',
        'cloud': 'Cloud',
        'messaging': 'Messaging',
        'testing': 'Testing',
        'mobile': 'Mobile'
      }
      return categoryMap[categoryKey] || categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)
    },
    
    getAxisX(index) {
      const flatSkills = this.flattenSkills()
      const angle = (index * 2 * Math.PI) / flatSkills.length
      return this.chartSize/2 + Math.cos(angle) * (this.chartSize/2 - 50)
    },
    getAxisY(index) {
      const flatSkills = this.flattenSkills()
      const angle = (index * 2 * Math.PI) / flatSkills.length
      return this.chartSize/2 + Math.sin(angle) * (this.chartSize/2 - 50)
    },
    getSkillX(index) {
      const flatSkills = this.flattenSkills()
      const skill = flatSkills[index]
      const angle = (index * 2 * Math.PI) / flatSkills.length
      const radius = (this.chartSize/2 - 50) * (skill.level / 100)
      return this.chartSize/2 + Math.cos(angle) * radius
    },
    getSkillY(index) {
      const flatSkills = this.flattenSkills()
      const skill = flatSkills[index]
      const angle = (index * 2 * Math.PI) / flatSkills.length
      const radius = (this.chartSize/2 - 50) * (skill.level / 100)
      return this.chartSize/2 + Math.sin(angle) * radius
    },
    getNetworkX(skill) {
      const flatSkills = this.flattenSkills()
      const index = flatSkills.indexOf(skill)
      const angle = (index * 2 * Math.PI) / flatSkills.length
      return this.networkSize/2 + Math.cos(angle) * (this.networkSize/2 - 80)
    },
    getNetworkY(skill) {
      const flatSkills = this.flattenSkills()
      const index = flatSkills.indexOf(skill)
      const angle = (index * 2 * Math.PI) / flatSkills.length
      return this.networkSize/2 + Math.sin(angle) * (this.networkSize/2 - 80)
    },
    getNodeSize(level) {
      return Math.max(15, Math.min(30, 15 + (level / 100) * 15))
    },
    getSkillColor(level) {
      if (level >= 80) return '#28a745'
      if (level >= 60) return '#17a2b8'
      if (level >= 40) return '#ffc107'
      return '#dc3545'
    },
    getLevelColor(level) {
      const colors = ['#e9ecef', '#dee2e6', '#ced4da', '#adb5bd', '#6c757d']
      return colors[level - 1] || colors[0]
    },
    getCircularOffset(level) {
      return this.circumference - (level / 100) * this.circumference
    },
    getSkillByName(name) {
      return this.flattenSkills().find(skill => skill.name === name)
    },
    showTooltip(skill, event) {
      this.tooltip = {
        visible: true,
        skill: skill,
        x: event.clientX,
        y: event.clientY
      }
    },
    hideTooltip() {
      this.tooltip.visible = false
    }
  },
  mounted() {
    // Add responsive handling
    const handleResize = () => {
      const container = this.$el.querySelector('.skill-visualization')
      if (container) {
        const width = container.offsetWidth
        this.chartSize = Math.min(400, width - 40)
        this.networkSize = Math.min(500, width - 40)
      }
    }
    
    window.addEventListener('resize', handleResize)
    handleResize()
    
    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('resize', handleResize)
    })
  }
}
</script>

<style scoped>
.skill-visualization {
  padding: 2rem 0;
}

.viz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.viz-title {
  color: var(--text-color);
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.viz-controls {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.view-btn:hover:not(.active) {
  background: var(--secondary-bg);
  border-color: var(--secondary-color);
}

/* Radar Chart */
.radar-container {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.radar-chart {
  flex: 1;
  min-width: 300px;
}

.radar-svg {
  width: 100%;
  height: auto;
}

.axis-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-color);
}

.skill-point {
  cursor: pointer;
  transition: all 0.3s ease;
}

.skill-point:hover {
  r: 8;
  filter: drop-shadow(0 0 8px currentColor);
}

.radar-legend {
  min-width: 200px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.legend-text {
  font-size: 0.9rem;
  color: var(--text-color);
}

/* Bar Chart */
.bars-container {
  max-width: 800px;
  margin: 0 auto;
}

.bar-item {
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bar-item:hover {
  transform: translateX(5px);
}

.bar-label {
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.bar-track {
  height: 20px;
  background: var(--border-color);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 1s ease;
  position: relative;
}

.bar-value {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
}

.bar-category {
  font-size: 0.8rem;
  color: var(--secondary-color);
  margin-top: 0.25rem;
}

/* Circular Progress */
.circular-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.circular-item {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.circular-item:hover {
  transform: scale(1.05);
}

.circular-chart {
  position: relative;
  display: inline-block;
}

.circular-svg {
  transform: rotate(-90deg);
}

.circular-progress {
  transition: stroke-dashoffset 1s ease;
}

.circular-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.circular-percentage {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1;
}

.circular-skill {
  font-size: 0.8rem;
  color: var(--secondary-color);
  margin-top: 0.25rem;
}

/* Network Chart */
.network-container {
  display: flex;
  justify-content: center;
}

.network-svg {
  width: 100%;
  height: auto;
}

.node-circle {
  cursor: pointer;
  transition: all 0.3s ease;
}

.node-circle:hover {
  filter: drop-shadow(0 0 8px currentColor);
}

.node-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-color);
  pointer-events: none;
}

/* Tooltip */
.skill-tooltip {
  position: fixed;
  background: var(--card-bg);
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-width: 250px;
  pointer-events: none;
}

.tooltip-content h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
  font-size: 1rem;
}

.tooltip-content p {
  margin: 0 0 1rem 0;
  color: var(--secondary-color);
  font-size: 0.9rem;
  line-height: 1.4;
}

.tooltip-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tooltip-details > div {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.tooltip-details span:first-child {
  color: var(--secondary-color);
}

.level-value,
.category-value,
.experience-value {
  color: var(--text-color);
  font-weight: 500;
}

/* Statistics */
.skill-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 3rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--secondary-color);
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .viz-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .viz-controls {
    justify-content: center;
  }
  
  .radar-container {
    flex-direction: column;
  }
  
  .circular-container {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
  }
  
  .skill-stats {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}
</style>