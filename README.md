# 个人网站项目

一个现代化、响应式的个人网站，展示技能、项目和专业经历。

## 🌟 特性

### 核心功能
- **响应式设计** - 完美适配桌面、平板和移动设备
- **现代化界面** - 简洁美观的用户界面设计
- **GitHub集成** 🆕 - 自动展示GitHub项目，智能分类和语言统计
- **性能优化** - 快速加载和流畅的用户体验
- **SEO友好** - 搜索引擎优化和结构化数据
- **PWA支持** - 可安装的Web应用，支持离线访问

### 技术特性
- **原生Web技术** - HTML5、CSS3、ES6+ JavaScript
- **CSS Grid & Flexbox** - 现代布局技术
- **Service Worker** - 离线功能和缓存优化
- **Web Manifest** - PWA应用配置
- **可访问性** - 符合WCAG 2.1 AA标准

## 📁 项目结构

```
personal-website/
├── index.html              # 主页面
├── offline.html            # 离线页面
├── manifest.json           # PWA配置文件
├── sw.js                   # Service Worker
├── README.md               # 项目说明
│
├── assets/
│   ├── css/
│   │   └── main.css        # 主样式文件
│   ├── js/
│   │   ├── main.js         # 主JavaScript文件
│   │   └── github-projects.js # GitHub项目集成模块
│   ├── images/             # 图片资源
│   ├── fonts/              # 字体文件
│   └── docs/               # 文档文件
│
└── blog/                   # 博客文章（可选）
```

## 🚀 快速开始

### 1. 环境要求
- 现代浏览器（Chrome 88+, Firefox 85+, Safari 14+, Edge 88+）
- 本地Web服务器（用于开发测试）

### 2. 安装运行

#### 方法1：使用Python内置服务器
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### 方法2：使用Node.js服务器
```bash
npx http-server -p 8000
```

#### 方法3：使用Live Server (VS Code插件)
1. 安装Live Server插件
2. 右键index.html选择"Open with Live Server"

### 3. 访问网站
打开浏览器访问：`http://localhost:8000`

## 🛠️ 自定义配置

### 1. 个人信息修改

编辑 `index.html` 文件中的以下部分：

```html
<!-- 基本信息 -->
<span class="hero__name">您的姓名</span>
<h2 class="hero__subtitle">前端开发工程师</h2>

<!-- 社交媒体链接 -->
<a href="https://github.com/yourusername" ...>
<a href="https://linkedin.com/in/yourusername" ...>
<a href="mailto:your.email@example.com" ...>
```

### 2. 项目作品配置

在 `index.html` 的项目部分添加您的作品：

```html
<div class="project-card" data-category="web">
    <!-- 项目图片 -->
    <img src="./assets/images/project-1.jpg" alt="项目描述">
    
    <!-- 项目信息 -->
    <h3>项目名称</h3>
    <p>项目描述...</p>
    
    <!-- 技术标签 -->
    <span class="tech-tag">React</span>
    <span class="tech-tag">Node.js</span>
</div>
```

### 3. 技能列表配置

修改技能部分的内容和进度：

```html
<div class="skill-item">
    <div class="skill-item__header">
        <span class="skill-item__name">JavaScript/TypeScript</span>
        <span class="skill-item__level">95%</span>
    </div>
    <div class="skill-item__bar">
        <div class="skill-item__progress" style="width: 95%"></div>
    </div>
</div>
```

### 4. GitHub项目集成 🆕

**🚀 新功能！** 网站现在支持自动从GitHub获取并展示您的项目。

#### 配置步骤：

1. **设置GitHub用户名**
   打开 `assets/js/main.js` 文件，找到 `initializeGitHubProjects` 函数：
   ```javascript
   const GITHUB_USERNAME = 'yuchenxu'; // 替换为你的GitHub用户名
   ```

2. **自定义显示选项**
   在同一函数中配置GitHub API选项：
   ```javascript
   const githubOptions = {
     maxRepos: 12,           // 最大显示仓库数
     sortBy: 'updated',      // 排序方式: 'updated', 'created', 'pushed', 'full_name'
     excludeForks: true,     // 排除分叉项目
     includePrivate: false   // 是否包含私有仓库
   };
   ```

#### 功能特性：

✅ **自动获取项目** - 从GitHub API动态加载仓库信息  
✅ **智能分类** - 根据编程语言和项目描述自动分类  
✅ **语言统计** - 显示每个项目的编程语言分布  
✅ **项目筛选** - 按类别筛选项目（Web应用、工具、API等）  
✅ **实时数据** - 显示星标、分叉数、最后更新时间  
✅ **技术栈识别** - 自动识别并显示使用的框架和技术  
✅ **错误处理** - 网络错误时的友好提示  
✅ **缓存机制** - 5分钟缓存提高加载速度  

#### 项目分类：

- 🌐 **Web应用** - 网站、前端、后端项目
- 📱 **移动应用** - Android、iOS、Flutter项目  
- 🛠️ **工具** - CLI工具、脚本、实用程序
- 🔌 **API服务** - REST API、GraphQL、微服务
- 📚 **库/框架** - 开源库、SDK、框架
- 🎮 **游戏** - 游戏开发项目
- 🤖 **AI/ML** - 人工智能、机器学习项目
- 📊 **数据分析** - 数据可视化、分析工具

#### 故障排除：

如果GitHub项目无法加载：
1. 检查网络连接
2. 确认GitHub用户名正确
3. 检查GitHub API速率限制（每小时60次请求）
4. 查看浏览器控制台错误信息

### 5. 颜色主题自定义

在 `assets/css/main.css` 中修改CSS变量：

```css
:root {
  --color-primary: #2563eb;        /* 主色调 */
  --color-primary-light: #3b82f6;  /* 主色调（浅色） */
  --color-primary-dark: #1d4ed8;   /* 主色调（深色） */
  /* ... 其他颜色变量 */
}
```

## 📱 PWA功能

### 安装为应用
1. 在支持的浏览器中访问网站
2. 点击地址栏的"安装"图标
3. 确认安装到桌面

### 离线功能
- 自动缓存关键资源
- 离线时显示友好的离线页面
- 网络恢复时自动更新内容

## 🎨 设计系统

### 颜色规范
- **主色调**: #2563eb (蓝色)
- **辅助色**: #64748b (灰色)
- **强调色**: #ef4444 (红色)
- **成功色**: #10b981 (绿色)

### 字体规范
- **主要字体**: Inter, system fonts
- **代码字体**: JetBrains Mono, Fira Code
- **中文字体**: 苹方, 思源黑体

### 断点设置
- **小屏**: < 640px
- **中屏**: 640px - 1024px  
- **大屏**: > 1024px

## 🔧 开发指南

### 代码规范
- 使用2空格缩进
- CSS类名采用BEM命名法
- JavaScript使用ES6+语法
- 注释完整且有意义

### 性能优化
- 图片使用WebP格式（提供fallback）
- 启用Gzip压缩
- 使用CDN加速资源加载
- 实现懒加载和代码分割

### SEO优化
- 结构化数据标记
- 语义化HTML标签
- 优化元标签和描述
- 生成网站地图

## 📊 浏览器支持

| 浏览器 | 版本要求 | 支持度 |
|--------|----------|--------|
| Chrome | 88+ | ✅ 完全支持 |
| Firefox | 85+ | ✅ 完全支持 |
| Safari | 14+ | ✅ 完全支持 |
| Edge | 88+ | ✅ 完全支持 |
| IE | - | ❌ 不支持 |

## 🚀 部署方案

### 静态网站托管

#### Vercel (推荐)
1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 自动部署完成

#### Netlify
1. 拖拽文件夹到Netlify
2. 或连接GitHub仓库
3. 自动构建和部署

#### GitHub Pages
1. 推送代码到GitHub
2. 在Settings中启用Pages
3. 选择部署分支

### 服务器部署

#### Nginx配置示例
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/personal-website;
    index index.html;

    # Gzip压缩
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;

    # 缓存静态资源
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # PWA支持
    location /manifest.json {
        add_header Cache-Control "public, max-age=604800";
    }

    location /sw.js {
        add_header Cache-Control "public, max-age=0";
    }
}
```

## 🔍 调试和测试

### 性能测试
```bash
# 使用Lighthouse CLI
npm install -g lighthouse
lighthouse http://localhost:8000 --view

# 使用WebPageTest
# 访问 https://www.webpagetest.org/
```

### 可访问性测试
```bash
# 使用Pa11y
npm install -g pa11y
pa11y http://localhost:8000
```

### PWA测试
1. 在Chrome DevTools中打开Application面板
2. 检查Service Worker状态
3. 测试离线功能
4. 验证缓存策略

## 📝 许可证

MIT License - 详情请查看 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交Issues和Pull Requests来改进这个项目！

## 📞 联系方式

- **邮箱**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **LinkedIn**: [您的LinkedIn](https://linkedin.com/in/yourusername)

---

**⭐ 如果这个项目对您有帮助，请给它一个星标！**