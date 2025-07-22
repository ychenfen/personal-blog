# 部署指南

本指南将帮助您将个人网站部署到各种平台。

## 🚀 快速部署

### 方案1: Vercel (推荐)

**优势**: 免费、快速、自动CI/CD、全球CDN

1. **准备Git仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/personal-website.git
   git push -u origin main
   ```

2. **Vercel部署**
   - 访问 [vercel.com](https://vercel.com)
   - 使用GitHub账号登录
   - 点击"New Project"
   - 导入您的GitHub仓库
   - 保持默认设置，点击"Deploy"

3. **自定义域名**（可选）
   ```bash
   # 在Vercel项目设置中添加域名
   # 设置DNS记录指向Vercel
   ```

### 方案2: Netlify

**优势**: 免费、表单处理、A/B测试、分支预览

1. **拖拽部署**
   - 访问 [netlify.com](https://netlify.com)
   - 直接拖拽项目文件夹到部署区域

2. **Git集成部署**
   - 连接GitHub仓库
   - 选择部署分支（main）
   - 自动构建和部署

3. **配置文件**（可选）
   ```toml
   # netlify.toml
   [build]
     publish = "."
   
   [[headers]]
     for = "/sw.js"
     [headers.values]
       Cache-Control = "public, max-age=0"
   
   [[headers]]
     for = "/assets/*"
     [headers.values]
       Cache-Control = "public, max-age=31536000"
   ```

### 方案3: GitHub Pages

**优势**: 免费、GitHub集成、简单

1. **启用GitHub Pages**
   ```bash
   # 推送代码到GitHub
   git push origin main
   ```

2. **配置GitHub Pages**
   - 进入仓库Settings
   - 滚动到Pages部分
   - Source选择"Deploy from a branch"
   - Branch选择"main"
   - 文件夹选择"/ (root)"

3. **自定义域名**（可选）
   ```bash
   # 创建CNAME文件
   echo "yourdomain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

## 🔧 高级部署

### 自有服务器部署

#### 使用Nginx

1. **安装Nginx**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install nginx
   
   # CentOS/RHEL
   sudo yum install nginx
   ```

2. **配置Nginx**
   ```nginx
   # /etc/nginx/sites-available/personal-website
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       root /var/www/personal-website;
       index index.html;
       
       # 启用Gzip压缩
       gzip on;
       gzip_vary on;
       gzip_min_length 1024;
       gzip_proxied any;
       gzip_comp_level 6;
       gzip_types
           text/plain
           text/css
           text/xml
           text/javascript
           application/javascript
           application/xml+rss
           application/json
           image/svg+xml;
       
       # 缓存静态资源
       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
           add_header Vary "Accept-Encoding";
       }
       
       # PWA文件配置
       location /manifest.json {
           expires 1w;
           add_header Cache-Control "public";
       }
       
       location /sw.js {
           expires off;
           add_header Cache-Control "public, max-age=0";
       }
       
       # 安全头部
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header Referrer-Policy "no-referrer-when-downgrade" always;
       add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
       
       # SPA路由支持
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **启用站点**
   ```bash
   sudo ln -s /etc/nginx/sites-available/personal-website /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **SSL证书 (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

#### 使用Apache

1. **安装Apache**
   ```bash
   # Ubuntu/Debian
   sudo apt install apache2
   
   # CentOS/RHEL
   sudo yum install httpd
   ```

2. **配置虚拟主机**
   ```apache
   # /etc/apache2/sites-available/personal-website.conf
   <VirtualHost *:80>
       ServerName yourdomain.com
       ServerAlias www.yourdomain.com
       DocumentRoot /var/www/personal-website
       
       # 启用压缩
       LoadModule deflate_module modules/mod_deflate.so
       <Location />
           SetOutputFilter DEFLATE
           SetEnvIfNoCase Request_URI \
               \.(?:gif|jpe?g|png)$ no-gzip dont-vary
           SetEnvIfNoCase Request_URI \
               \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
       </Location>
       
       # 缓存配置
       LoadModule expires_module modules/mod_expires.so
       <Directory "/var/www/personal-website/assets">
           ExpiresActive On
           ExpiresDefault "access plus 1 year"
       </Directory>
       
       # PWA支持
       <Files "sw.js">
           Header set Cache-Control "public, max-age=0"
       </Files>
       
       ErrorLog ${APACHE_LOG_DIR}/personal-website_error.log
       CustomLog ${APACHE_LOG_DIR}/personal-website_access.log combined
   </VirtualHost>
   ```

3. **启用站点和模块**
   ```bash
   sudo a2enmod rewrite expires headers deflate
   sudo a2ensite personal-website.conf
   sudo systemctl reload apache2
   ```

### Docker部署

1. **创建Dockerfile**
   ```dockerfile
   # Dockerfile
   FROM nginx:alpine
   
   # 复制网站文件
   COPY . /usr/share/nginx/html
   
   # 复制Nginx配置
   COPY nginx.conf /etc/nginx/nginx.conf
   
   # 暴露端口
   EXPOSE 80
   
   # 启动Nginx
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Nginx配置**
   ```nginx
   # nginx.conf
   events {
       worker_connections 1024;
   }
   
   http {
       include       /etc/nginx/mime.types;
       default_type  application/octet-stream;
       
       sendfile        on;
       keepalive_timeout  65;
       gzip  on;
       
       server {
           listen       80;
           server_name  localhost;
           root   /usr/share/nginx/html;
           index  index.html;
           
           location / {
               try_files $uri $uri/ /index.html;
           }
           
           location /sw.js {
               add_header Cache-Control "public, max-age=0";
           }
           
           location /assets/ {
               expires 1y;
               add_header Cache-Control "public, immutable";
           }
       }
   }
   ```

3. **构建和运行**
   ```bash
   # 构建镜像
   docker build -t personal-website .
   
   # 运行容器
   docker run -d -p 80:80 personal-website
   ```

## 🌐 CDN配置

### CloudFlare

1. **添加站点到CloudFlare**
   - 注册CloudFlare账号
   - 添加您的域名
   - 更新DNS记录

2. **优化设置**
   ```javascript
   // CloudFlare Workers (可选)
   addEventListener('fetch', event => {
     event.respondWith(handleRequest(event.request))
   })
   
   async function handleRequest(request) {
     const cache = caches.default
     const cacheKey = new Request(request.url, request)
     
     // 检查缓存
     let response = await cache.match(cacheKey)
     
     if (!response) {
       response = await fetch(request)
       
       // 缓存静态资源
       if (request.url.includes('/assets/')) {
         const headers = new Headers(response.headers)
         headers.set('Cache-Control', 'public, max-age=31536000')
         response = new Response(response.body, {
           status: response.status,
           statusText: response.statusText,
           headers: headers
         })
         event.waitUntil(cache.put(cacheKey, response.clone()))
       }
     }
     
     return response
   }
   ```

## 📊 监控和分析

### 性能监控

1. **Google Analytics 4**
   ```html
   <!-- 添加到index.html的<head>中 -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

2. **Google Search Console**
   - 添加并验证网站
   - 提交网站地图
   - 监控搜索性能

3. **Core Web Vitals监控**
   ```javascript
   // 添加到main.js
   function measureWebVitals() {
     import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
       getCLS(console.log);
       getFID(console.log);
       getFCP(console.log);
       getLCP(console.log);
       getTTFB(console.log);
     });
   }
   
   measureWebVitals();
   ```

### 错误监控

1. **Sentry集成**
   ```html
   <script src="https://browser.sentry-cdn.com/7.0.0/bundle.min.js"></script>
   <script>
     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN',
       environment: 'production'
     });
   </script>
   ```

2. **Uptime监控**
   - UptimeRobot
   - Pingdom
   - StatusCake

## 🔒 安全配置

### HTTPS强制

1. **Nginx配置**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       return 301 https://$server_name$request_uri;
   }
   ```

2. **Apache配置**
   ```apache
   <VirtualHost *:80>
       ServerName yourdomain.com
       Redirect permanent / https://yourdomain.com/
   </VirtualHost>
   ```

### 安全头部

```nginx
# 安全头部配置
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;" always;
```

## 🚀 自动化部署

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build project
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 📝 部署检查清单

### 部署前检查

- [ ] 所有链接都正常工作
- [ ] 图片都能正常显示
- [ ] 联系表单功能正常
- [ ] Service Worker正常注册
- [ ] Manifest文件有效
- [ ] 响应式设计在所有设备上正常
- [ ] 页面加载速度 < 3秒
- [ ] SEO元标签完整

### 部署后验证

- [ ] 网站能正常访问
- [ ] HTTPS证书有效
- [ ] PWA安装功能正常
- [ ] 离线功能工作
- [ ] Google Analytics数据收集正常
- [ ] 搜索引擎能正常抓取
- [ ] 性能指标达标
- [ ] 安全头部配置正确

## 🆘 故障排除

### 常见问题

1. **Service Worker无法注册**
   - 检查HTTPS或localhost环境
   - 确认sw.js路径正确
   - 检查浏览器控制台错误

2. **PWA无法安装**
   - 验证manifest.json格式
   - 确认所有必需图标存在
   - 检查HTTPS配置

3. **页面加载缓慢**
   - 启用Gzip压缩
   - 优化图片格式和大小
   - 使用CDN加速

4. **SEO问题**
   - 检查robots.txt
   - 验证结构化数据
   - 提交网站地图

### 调试工具

- Chrome DevTools
- Lighthouse
- WebPageTest
- GTmetrix
- Google Search Console

---

**需要帮助？** 查看完整的文档或提交issue获取支持。