<template>
  <div class="skills-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header text-center py-5">
        <h1 class="display-4 fw-bold mb-3 animate__animated animate__fadeInDown">
          <span class="title-gradient">My Skills</span>
        </h1>
        <p class="lead animate__animated animate__fadeInUp animate__delay-1s">
          A comprehensive overview of my technical expertise and proficiency levels
        </p>
      </div>

      <!-- Interactive Skill Visualization -->
      <SkillVisualization />

      <!-- Skills by Category -->
      <div class="skills-categories">
        <h2 class="section-title animate__animated animate__fadeInUp">
          <i class="fas fa-layer-group me-2"></i>
          Skills by Category
        </h2>
        
        <div class="categories-grid">
          <div 
            v-for="category in skillCategories" 
            :key="category.name"
            class="category-card animate__animated animate__fadeInUp"
            :style="{ animationDelay: `${category.index * 0.1}s` }"
          >
            <div class="category-header">
              <div class="category-icon">
                <i :class="category.icon"></i>
              </div>
              <h3 class="category-title">{{ category.name }}</h3>
              <div class="category-count">{{ category.skills.length }} skills</div>
            </div>
            
            <div class="category-skills">
              <div 
                v-for="skill in category.skills" 
                :key="skill.name"
                class="skill-item"
                @mouseenter="showSkillDetails(skill)"
                @mouseleave="hideSkillDetails"
              >
                <div class="skill-info">
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="skill-level">{{ skill.level }}%</span>
                </div>
                <div class="skill-bar">
                  <div 
                    class="skill-progress"
                    :style="{ 
                      width: `${skill.level}%`,
                      backgroundColor: getSkillColor(skill.level)
                    }"
                  ></div>
                </div>
                <div class="skill-experience">{{ skill.experience }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skill Details Modal -->
      <div v-if="selectedSkill" class="skill-modal" @click="hideSkillDetails">
        <div class="modal-content" @click.stop>
          <button @click="hideSkillDetails" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
          
          <div class="modal-header">
            <div class="skill-icon-large">
              <i :class="getSkillIcon(selectedSkill.name)"></i>
            </div>
            <div class="skill-info-large">
              <h2>{{ selectedSkill.name }}</h2>
              <p class="skill-category">{{ selectedSkill.category }}</p>
              <div class="skill-level-large">
                <div class="level-circle">
                  <svg width="120" height="120" class="level-svg">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="var(--border-color)"
                      stroke-width="8"
                      opacity="0.3"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      :stroke="getSkillColor(selectedSkill.level)"
                      stroke-width="8"
                      stroke-linecap="round"
                      :stroke-dasharray="circumference"
                      :stroke-dashoffset="getCircularOffset(selectedSkill.level)"
                      class="level-progress"
                    />
                  </svg>
                  <div class="level-text">{{ selectedSkill.level }}%</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-body">
            <div class="skill-description">
              <h3>Description</h3>
              <p>{{ selectedSkill.description }}</p>
            </div>
            
            <div class="skill-experience">
              <h3>Experience</h3>
              <p>{{ selectedSkill.experience }}</p>
            </div>
            
            <div class="skill-projects">
              <h3>Related Projects</h3>
              <div class="project-tags">
                <span 
                  v-for="project in getRelatedProjects(selectedSkill.name)" 
                  :key="project"
                  class="project-tag"
                >
                  {{ project }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SkillVisualization from '../components/SkillVisualization.vue'
import { skills } from '../data/skills.js'

export default {
  name: 'Skills',
  components: {
    SkillVisualization
  },
  data() {
    return {
      skills: skills,
      selectedSkill: null,
      circumference: 2 * Math.PI * 50
    }
  },
  computed: {
    skillCategories() {
      try {
        console.log('Skills data:', this.skills)
        const categories = {}
        // Convert the skills object structure to categories
        Object.keys(this.skills).forEach(categoryKey => {
          const categoryName = this.formatCategoryName(categoryKey)
          categories[categoryName] = {
            name: categoryName,
            skills: this.skills[categoryKey].map(skill => ({
              ...skill,
              category: categoryName,
              experience: skill.years || '2+ years',
              description: `Proficient in ${skill.name} with ${skill.years || '2+'} years of experience`
            })),
            icon: this.getCategoryIcon(categoryName)
          }
        })
        
        const result = Object.values(categories).map((category, index) => ({
          ...category,
          index
        }))
        console.log('Skill categories result:', result)
        return result
      } catch (error) {
        console.error('Error in skillCategories computed property:', error)
        return []
      }
    }
  },
  methods: {
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
    
    getCategoryIcon(category) {
      const icons = {
        'Frontend': 'fas fa-paint-brush',
        'Backend': 'fas fa-server',
        'Database': 'fas fa-database',
        'DevOps': 'fas fa-cogs',
        'Mobile': 'fas fa-mobile-alt',
        'Tools': 'fas fa-tools',
        'Cloud': 'fas fa-cloud',
        'Testing': 'fas fa-bug',
        'Messaging': 'fas fa-comments'
      }
      return icons[category] || 'fas fa-code'
    },
    getSkillIcon(skillName) {
      const icons = {
        'JavaScript': 'fab fa-js-square',
        'Vue.js': 'fab fa-vuejs',
        'React': 'fab fa-react',
        'Node.js': 'fab fa-node-js',
        'Java': 'fab fa-java',
        'Python': 'fab fa-python',
        'Docker': 'fab fa-docker',
        'Git': 'fab fa-git-alt',
        'AWS': 'fab fa-aws',
        'MySQL': 'fas fa-database',
        'MongoDB': 'fas fa-database'
      }
      return icons[skillName] || 'fas fa-code'
    },
    getSkillColor(level) {
      if (level >= 80) return '#28a745'
      if (level >= 60) return '#17a2b8'
      if (level >= 40) return '#ffc107'
      return '#dc3545'
    },
    getCircularOffset(level) {
      return this.circumference - (level / 100) * this.circumference
    },
    showSkillDetails(skill) {
      this.selectedSkill = skill
      document.body.style.overflow = 'hidden'
    },
    hideSkillDetails() {
      this.selectedSkill = null
      document.body.style.overflow = 'auto'
    },
    getRelatedProjects(skillName) {
      // Mock related projects - in real app, this would come from data
      const projectMap = {
        'JavaScript': ['E-commerce Platform', 'Task Management App'],
        'Vue.js': ['Portfolio Website', 'Admin Dashboard'],
        'Java': ['Microservices API', 'Banking System'],
        'Spring Boot': ['REST API', 'Authentication Service'],
        'Docker': ['Containerized Apps', 'CI/CD Pipeline'],
        'MySQL': ['Database Design', 'Query Optimization']
      }
      return projectMap[skillName] || ['Various Projects']
    }
  }
}
</script>

<style scoped>
.skills-page {
  padding-top: 100px;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--body-bg) 0%, var(--secondary-bg) 100%);
  color: var(--text-color);
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

.skills-categories {
  margin-top: 4rem;
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-color);
  font-size: 2rem;
  font-weight: 600;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.category-card {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.category-icon {
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

.category-title {
  flex: 1;
  margin: 0;
  color: var(--text-color);
  font-size: 1.3rem;
  font-weight: 600;
}

.category-count {
  background: rgba(0, 123, 255, 0.1);
  color: var(--primary-color);
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.category-skills {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-item {
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 10px;
}

.skill-item:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(5px);
}

.skill-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.skill-name {
  font-weight: 500;
  color: var(--text-color);
}

.skill-level {
  font-weight: 600;
  color: var(--primary-color);
}

.skill-bar {
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.skill-progress {
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease;
}

.skill-experience {
  font-size: 0.8rem;
  color: var(--secondary-color);
}

/* Skill Modal */
.skill-modal {
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

.modal-content {
  background: var(--card-bg);
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.8);
}

.modal-header {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.skill-icon-large {
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
}

.skill-info-large h2 {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.skill-category {
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 1rem;
}

.skill-level-large {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.level-circle {
  position: relative;
}

.level-svg {
  transform: rotate(-90deg);
}

.level-progress {
  transition: stroke-dashoffset 1s ease;
}

.level-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-color);
}

.modal-body {
  padding: 2rem;
}

.modal-body h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.modal-body p {
  color: var(--secondary-color);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.project-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.project-tag {
  background: rgba(0, 123, 255, 0.1);
  color: var(--primary-color);
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-header {
    flex-direction: column;
    text-align: center;
  }
  
  .skill-icon-large {
    margin: 0 auto;
  }
  
  .skill-level-large {
    justify-content: center;
  }
}
</style>