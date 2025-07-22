/**
 * GitHub Projects Integration
 * 动态获取和展示GitHub仓库信息
 */

class GitHubProjects {
  constructor(username, options = {}) {
    this.username = username;
    this.apiUrl = 'https://api.github.com';
    this.options = {
      maxRepos: options.maxRepos || 20,
      sortBy: options.sortBy || 'updated',
      excludeForks: options.excludeForks !== false,
      includePrivate: options.includePrivate || false,
      ...options
    };
    
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5分钟缓存
  }

  /**
   * 获取用户的GitHub仓库列表
   */
  async getRepositories() {
    const cacheKey = `repos_${this.username}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(
        `${this.apiUrl}/users/${this.username}/repos?` +
        `sort=${this.options.sortBy}&` +
        `per_page=${this.options.maxRepos}&` +
        `type=${this.options.includePrivate ? 'all' : 'public'}`
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      let repos = await response.json();

      // 过滤分叉项目
      if (this.options.excludeForks) {
        repos = repos.filter(repo => !repo.fork);
      }

      // 添加额外信息
      const enrichedRepos = await Promise.all(
        repos.map(repo => this.enrichRepository(repo))
      );

      this.setCache(cacheKey, enrichedRepos);
      return enrichedRepos;

    } catch (error) {
      console.error('Error fetching GitHub repositories:', error);
      throw error;
    }
  }

  /**
   * 丰富仓库信息（获取语言、贡献者等）
   */
  async enrichRepository(repo) {
    try {
      // 获取仓库语言信息
      const languagesResponse = await fetch(repo.languages_url);
      const languages = languagesResponse.ok ? await languagesResponse.json() : {};

      // 获取最新提交信息
      const commitsResponse = await fetch(`${repo.url}/commits?per_page=1`);
      const commits = commitsResponse.ok ? await commitsResponse.json() : [];
      
      // 获取发布信息
      const releasesResponse = await fetch(`${repo.url}/releases/latest`);
      const latestRelease = releasesResponse.ok ? await releasesResponse.json() : null;

      return {
        ...repo,
        languages: this.calculateLanguagePercentages(languages),
        lastCommit: commits[0] || null,
        latestRelease,
        demo_url: this.extractDemoUrl(repo),
        tech_stack: this.extractTechStack(repo, languages),
        category: this.categorizeProject(repo, languages)
      };

    } catch (error) {
      console.warn(`Error enriching repository ${repo.name}:`, error);
      return {
        ...repo,
        languages: {},
        lastCommit: null,
        latestRelease: null,
        demo_url: null,
        tech_stack: [],
        category: 'other'
      };
    }
  }

  /**
   * 计算编程语言百分比
   */
  calculateLanguagePercentages(languages) {
    const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    const percentages = {};
    
    for (const [language, bytes] of Object.entries(languages)) {
      percentages[language] = {
        bytes,
        percentage: ((bytes / total) * 100).toFixed(1)
      };
    }
    
    return percentages;
  }

  /**
   * 提取演示URL
   */
  extractDemoUrl(repo) {
    // 从homepage字段获取
    if (repo.homepage) {
      return repo.homepage;
    }

    // 从README或描述中提取
    const description = repo.description || '';
    const demoMatch = description.match(/(https?:\/\/[^\s]+)/);
    if (demoMatch) {
      return demoMatch[1];
    }

    // GitHub Pages URL推测
    if (repo.has_pages) {
      return `https://${this.username}.github.io/${repo.name}`;
    }

    return null;
  }

  /**
   * 提取技术栈
   */
  extractTechStack(repo, languages) {
    const stack = [];
    
    // 从编程语言推断
    const mainLanguages = Object.keys(languages).slice(0, 3);
    stack.push(...mainLanguages);

    // 从仓库名称和描述推断
    const text = `${repo.name} ${repo.description || ''}`.toLowerCase();
    
    const frameworks = {
      'react': ['react', 'jsx'],
      'vue': ['vue', 'vuejs'],
      'angular': ['angular', 'ng'],
      'node': ['node', 'nodejs', 'express'],
      'python': ['django', 'flask', 'fastapi'],
      'spring': ['spring', 'springboot'],
      'laravel': ['laravel', 'php'],
      'rails': ['rails', 'ruby'],
      'docker': ['docker', 'dockerfile'],
      'kubernetes': ['k8s', 'kubernetes'],
      'aws': ['aws', 'amazon'],
      'mongodb': ['mongo', 'mongodb'],
      'mysql': ['mysql'],
      'postgresql': ['postgres', 'postgresql'],
      'redis': ['redis']
    };

    for (const [tech, keywords] of Object.entries(frameworks)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        stack.push(tech);
      }
    }

    return [...new Set(stack)]; // 去重
  }

  /**
   * 项目分类
   */
  categorizeProject(repo, languages) {
    const name = repo.name.toLowerCase();
    const description = (repo.description || '').toLowerCase();
    const text = `${name} ${description}`;
    
    const categories = {
      'web': ['website', 'web', 'frontend', 'backend', 'fullstack', 'react', 'vue', 'angular'],
      'mobile': ['mobile', 'android', 'ios', 'flutter', 'react-native'],
      'tool': ['tool', 'cli', 'utility', 'script', 'automation'],
      'api': ['api', 'rest', 'graphql', 'service', 'microservice'],
      'library': ['library', 'package', 'framework', 'sdk'],
      'game': ['game', 'gaming', 'unity', 'godot'],
      'ai': ['ai', 'ml', 'machine-learning', 'neural', 'tensorflow', 'pytorch'],
      'data': ['data', 'analytics', 'visualization', 'dashboard']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }

    // 根据主要编程语言分类
    const mainLanguage = Object.keys(languages)[0]?.toLowerCase();
    if (mainLanguage) {
      const languageCategories = {
        'javascript': 'web',
        'typescript': 'web',
        'html': 'web',
        'css': 'web',
        'python': 'tool',
        'java': 'api',
        'kotlin': 'mobile',
        'swift': 'mobile',
        'dart': 'mobile',
        'c++': 'tool',
        'rust': 'tool',
        'go': 'api'
      };
      
      return languageCategories[mainLanguage] || 'other';
    }

    return 'other';
  }

  /**
   * 获取特定仓库的详细信息
   */
  async getRepositoryDetails(repoName) {
    const cacheKey = `repo_${repoName}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // 获取基本信息
      const repoResponse = await fetch(`${this.apiUrl}/repos/${this.username}/${repoName}`);
      const repo = await repoResponse.json();

      // 获取README
      const readmeResponse = await fetch(`${this.apiUrl}/repos/${this.username}/${repoName}/readme`);
      const readme = readmeResponse.ok ? await readmeResponse.json() : null;

      // 获取贡献者
      const contributorsResponse = await fetch(`${this.apiUrl}/repos/${this.username}/${repoName}/contributors`);
      const contributors = contributorsResponse.ok ? await contributorsResponse.json() : [];

      // 获取议题和PR统计
      const issuesResponse = await fetch(`${this.apiUrl}/repos/${this.username}/${repoName}/issues?state=all&per_page=1`);
      const prsResponse = await fetch(`${this.apiUrl}/repos/${this.username}/${repoName}/pulls?state=all&per_page=1`);

      const details = {
        ...repo,
        readme: readme ? atob(readme.content) : null,
        contributors: contributors.slice(0, 10), // 前10名贡献者
        stats: {
          issues: this.extractCountFromLinkHeader(issuesResponse.headers.get('Link')),
          pullRequests: this.extractCountFromLinkHeader(prsResponse.headers.get('Link')),
          commits: await this.getCommitCount(repoName)
        }
      };

      this.setCache(cacheKey, details);
      return details;

    } catch (error) {
      console.error(`Error fetching repository details for ${repoName}:`, error);
      throw error;
    }
  }

  /**
   * 获取提交总数
   */
  async getCommitCount(repoName) {
    try {
      const response = await fetch(`${this.apiUrl}/repos/${this.username}/${repoName}/commits?per_page=1`);
      return this.extractCountFromLinkHeader(response.headers.get('Link')) || 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * 从Link头部提取总数
   */
  extractCountFromLinkHeader(linkHeader) {
    if (!linkHeader) return 0;
    
    const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
    return lastPageMatch ? parseInt(lastPageMatch[1]) : 0;
  }

  /**
   * 获取用户的GitHub统计信息
   */
  async getUserStats() {
    const cacheKey = `user_stats_${this.username}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // 获取用户基本信息
      const userResponse = await fetch(`${this.apiUrl}/users/${this.username}`);
      const user = await userResponse.json();

      // 获取所有仓库来计算统计
      const repos = await this.getRepositories();
      
      const stats = {
        user,
        totalRepos: user.public_repos,
        totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
        languages: this.getTopLanguages(repos),
        mostStarredRepo: repos.reduce((max, repo) => 
          repo.stargazers_count > (max?.stargazers_count || 0) ? repo : max, null),
        recentActivity: await this.getRecentActivity()
      };

      this.setCache(cacheKey, stats);
      return stats;

    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  /**
   * 获取最常使用的编程语言
   */
  getTopLanguages(repos) {
    const languageStats = {};
    
    repos.forEach(repo => {
      Object.entries(repo.languages || {}).forEach(([language, data]) => {
        if (!languageStats[language]) {
          languageStats[language] = { bytes: 0, repos: 0 };
        }
        languageStats[language].bytes += data.bytes || 0;
        languageStats[language].repos += 1;
      });
    });

    return Object.entries(languageStats)
      .sort(([,a], [,b]) => b.bytes - a.bytes)
      .slice(0, 10)
      .map(([language, stats]) => ({
        language,
        ...stats,
        percentage: ((stats.bytes / Object.values(languageStats).reduce((sum, s) => sum + s.bytes, 0)) * 100).toFixed(1)
      }));
  }

  /**
   * 获取最近活动
   */
  async getRecentActivity() {
    try {
      const response = await fetch(`${this.apiUrl}/users/${this.username}/events/public?per_page=10`);
      const events = await response.json();
      
      return events.map(event => ({
        type: event.type,
        repo: event.repo.name,
        created_at: event.created_at,
        action: this.getEventAction(event)
      }));

    } catch (error) {
      console.warn('Error fetching recent activity:', error);
      return [];
    }
  }

  /**
   * 解析事件动作描述
   */
  getEventAction(event) {
    const actions = {
      'PushEvent': `推送了 ${event.payload.commits?.length || 0} 个提交`,
      'CreateEvent': `创建了 ${event.payload.ref_type}`,
      'WatchEvent': '收藏了仓库',
      'ForkEvent': '分叉了仓库',
      'IssuesEvent': `${event.payload.action} 了议题`,
      'PullRequestEvent': `${event.payload.action} 了拉取请求`,
      'ReleaseEvent': '发布了新版本'
    };
    
    return actions[event.type] || event.type;
  }

  /**
   * 缓存管理
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.cache.clear();
  }
}

// 项目展示组件
class ProjectsDisplay {
  constructor(containerId, githubUsername, options = {}) {
    this.container = document.getElementById(containerId);
    this.github = new GitHubProjects(githubUsername, options);
    this.currentFilter = 'all';
    this.projects = [];
    this.isLoading = false;
    
    this.init();
  }

  async init() {
    if (!this.container) {
      console.error('Projects container not found');
      return;
    }

    await this.loadProjects();
    this.setupEventListeners();
  }

  async loadProjects() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.showLoadingState();

    try {
      this.projects = await this.github.getRepositories();
      this.renderProjects();
      this.setupFilters();
    } catch (error) {
      this.showErrorState(error);
    } finally {
      this.isLoading = false;
    }
  }

  showLoadingState() {
    this.container.innerHTML = `
      <div class="projects-loading">
        <div class="loading-spinner"></div>
        <p>正在加载GitHub项目...</p>
      </div>
    `;
  }

  showErrorState(error) {
    this.container.innerHTML = `
      <div class="projects-error">
        <div class="error-icon">⚠️</div>
        <h3>加载失败</h3>
        <p>无法加载GitHub项目：${error.message}</p>
        <button class="btn btn--primary" onclick="location.reload()">重试</button>
      </div>
    `;
  }

  setupFilters() {
    // 获取所有项目类别
    const categories = [...new Set(this.projects.map(p => p.category))];
    
    // 更新过滤器按钮
    const filtersContainer = document.querySelector('.projects__filters');
    if (filtersContainer) {
      const filterButtons = categories.map(category => 
        `<button class="filter-btn" data-filter="${category}">
          ${this.getCategoryName(category)}
        </button>`
      ).join('');
      
      filtersContainer.innerHTML = `
        <button class="filter-btn filter-btn--active" data-filter="all">全部</button>
        ${filterButtons}
      `;
    }
  }

  getCategoryName(category) {
    const names = {
      'web': 'Web应用',
      'mobile': '移动应用',
      'tool': '工具',
      'api': 'API服务',
      'library': '库/框架',
      'game': '游戏',
      'ai': 'AI/ML',
      'data': '数据分析',
      'other': '其他'
    };
    return names[category] || category;
  }

  renderProjects() {
    const projectsHtml = this.projects.map(project => this.createProjectCard(project)).join('');
    
    // 找到项目网格容器并更新
    const gridContainer = document.querySelector('.projects__grid');
    if (gridContainer) {
      gridContainer.innerHTML = projectsHtml;
    }
  }

  createProjectCard(project) {
    const primaryLanguage = Object.keys(project.languages)[0] || 'Unknown';
    const demoUrl = project.demo_url || project.homepage;
    const lastUpdated = new Date(project.updated_at).toLocaleDateString('zh-CN');
    
    return `
      <div class="project-card project-card--github" data-category="${project.category}">
        <div class="project-card__header">
          <div class="project-card__meta">
            <span class="project-language" style="background-color: ${this.getLanguageColor(primaryLanguage)}">
              ${primaryLanguage}
            </span>
            <span class="project-updated">更新于 ${lastUpdated}</span>
          </div>
          <div class="project-card__stats">
            <span class="stat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17C14.5 4.42 12.81 4 11 4C6.03 4 2 8.03 2 13S6.03 22 11 22C14.97 22 18.43 19.07 18.92 15H17.92C17.45 18.05 14.84 20 11 20C7.14 20 4 16.86 4 13S7.14 6 11 6C12.3 6 13.5 6.3 14.58 6.85L12.5 8.93L21 9Z"/>
              </svg>
              ${project.stargazers_count}
            </span>
            <span class="stat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6,2A3,3 0 0,1 9,5C9,6.28 8.19,7.38 7.06,7.81C7.15,8.27 7.39,8.83 8,9.63C9,10.92 11,12.83 12,14C13,12.83 15,10.92 16,9.63C16.61,8.83 16.85,8.27 16.94,7.81C15.81,7.38 15,6.28 15,5A3,3 0 0,1 18,2A3,3 0 0,1 21,5C21,6.32 20.14,7.45 18.95,7.85C18.87,8.37 18.64,9 18,9.83C17,11.17 15,13.08 14,14.38C13.39,15.17 13.15,15.73 13.06,16.19C14.19,16.62 15,17.72 15,19A3,3 0 0,1 12,22A3,3 0 0,1 9,19C9,17.72 9.81,16.62 10.94,16.19C10.85,15.73 10.61,15.17 10,14.38C9,13.08 7,11.17 6,9.83C5.36,9 5.13,8.37 5.05,7.85C3.86,7.45 3,6.32 3,5A3,3 0 0,1 6,2M6,4A1,1 0 0,0 5,5A1,1 0 0,0 6,6A1,1 0 0,0 7,5A1,1 0 0,0 6,4M18,4A1,1 0 0,0 17,5A1,1 0 0,0 18,6A1,1 0 0,0 19,5A1,1 0 0,0 18,4M12,18A1,1 0 0,0 11,19A1,1 0 0,0 12,20A1,1 0 0,0 13,19A1,1 0 0,0 12,18Z"/>
              </svg>
              ${project.forks_count}
            </span>
          </div>
        </div>
        
        <div class="project-card__content">
          <h3 class="project-card__title">
            <a href="${project.html_url}" target="_blank" rel="noopener noreferrer">
              ${project.name}
            </a>
          </h3>
          
          <p class="project-card__description">
            ${project.description || '暂无描述'}
          </p>
          
          <div class="project-card__languages">
            ${this.createLanguageBars(project.languages)}
          </div>
          
          ${project.tech_stack.length > 0 ? `
            <div class="project-card__tech">
              ${project.tech_stack.slice(0, 4).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
          ` : ''}
          
          <div class="project-card__actions">
            <a href="${project.html_url}" class="btn btn--small btn--secondary" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"/>
              </svg>
              代码
            </a>
            ${demoUrl ? `
              <a href="${demoUrl}" class="btn btn--small btn--primary" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                </svg>
                预览
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  createLanguageBars(languages) {
    const topLanguages = Object.entries(languages)
      .sort(([,a], [,b]) => b.bytes - a.bytes)
      .slice(0, 3);
    
    if (topLanguages.length === 0) {
      return '<div class="no-languages">未检测到编程语言</div>';
    }
    
    return `
      <div class="language-bars">
        ${topLanguages.map(([language, data]) => `
          <div class="language-bar">
            <div class="language-bar__info">
              <span class="language-name">${language}</span>
              <span class="language-percent">${data.percentage}%</span>
            </div>
            <div class="language-bar__progress">
              <div class="language-bar__fill" 
                   style="width: ${data.percentage}%; background-color: ${this.getLanguageColor(language)}">
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  getLanguageColor(language) {
    const colors = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C': '#555555',
      'C#': '#239120',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'Swift': '#fa7343',
      'Kotlin': '#F18E33',
      'Dart': '#00B4AB',
      'HTML': '#e34c26',
      'CSS': '#1572B6',
      'Vue': '#4FC08D',
      'React': '#61dafb',
      'Shell': '#89e051',
      'Dockerfile': '#384d54'
    };
    
    return colors[language] || '#8e8e8e';
  }

  setupEventListeners() {
    // 过滤器按钮事件
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        this.handleFilterClick(e.target);
      }
    });
  }

  handleFilterClick(button) {
    // 更新活跃状态
    document.querySelectorAll('.filter-btn').forEach(btn => 
      btn.classList.remove('filter-btn--active')
    );
    button.classList.add('filter-btn--active');
    
    // 应用过滤器
    const filter = button.getAttribute('data-filter');
    this.filterProjects(filter);
  }

  filterProjects(filter) {
    const projectCards = document.querySelectorAll('.project-card--github');
    
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const shouldShow = filter === 'all' || category === filter;
      
      if (shouldShow) {
        card.style.display = 'block';
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.opacity = '1';
        }, 100);
      } else {
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GitHubProjects, ProjectsDisplay };
}

// 全局可用
window.GitHubProjects = GitHubProjects;
window.ProjectsDisplay = ProjectsDisplay;