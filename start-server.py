#!/usr/bin/env python3
"""
Personal Website Development Server
启动本地开发服务器的Python脚本
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

# 配置
PORT = 8000
HOST = 'localhost'

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """自定义HTTP请求处理器，添加必要的响应头"""
    
    def end_headers(self):
        # 添加CORS头部（开发时使用）
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        # 添加安全头部
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        
        # PWA相关头部
        if self.path.endswith('.json'):
            self.send_header('Content-Type', 'application/json')
        elif self.path.endswith('.js'):
            self.send_header('Content-Type', 'application/javascript')
        elif self.path.endswith('.css'):
            self.send_header('Content-Type', 'text/css')
        
        super().end_headers()
    
    def do_GET(self):
        """处理GET请求"""
        # 处理Service Worker请求（确保不被缓存）
        if self.path == '/sw.js':
            self.send_response(200)
            self.send_header('Content-Type', 'application/javascript')
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            self.end_headers()
            
            # 读取并发送Service Worker文件
            try:
                with open('sw.js', 'rb') as f:
                    self.wfile.write(f.read())
            except FileNotFoundError:
                self.send_error(404, "Service Worker file not found")
            return
        
        # 处理其他请求
        super().do_GET()
    
    def log_message(self, format, *args):
        """自定义日志格式"""
        timestamp = self.log_date_time_string()
        print(f"[{timestamp}] {format % args}")

def check_files():
    """检查必要的文件是否存在"""
    required_files = [
        'index.html',
        'manifest.json',
        'sw.js',
        'assets/css/main.css',
        'assets/js/main.js'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ 缺少必要文件:")
        for file in missing_files:
            print(f"   - {file}")
        print("\n请确保所有文件都已创建。")
        return False
    
    print("✅ 所有必要文件都已就绪")
    return True

def find_available_port(start_port=8000):
    """查找可用端口"""
    import socket
    
    for port in range(start_port, start_port + 100):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind((HOST, port))
                return port
        except OSError:
            continue
    
    return None

def start_server():
    """启动开发服务器"""
    # 检查文件
    if not check_files():
        return False
    
    # 查找可用端口
    available_port = find_available_port(PORT)
    if not available_port:
        print(f"❌ 无法找到可用端口（从{PORT}开始查找）")
        return False
    
    try:
        # 创建服务器
        with socketserver.TCPServer((HOST, available_port), CustomHTTPRequestHandler) as httpd:
            url = f"http://{HOST}:{available_port}"
            
            print("🚀 个人网站开发服务器启动成功!")
            print(f"📡 服务器地址: {url}")
            print(f"📁 服务目录: {os.getcwd()}")
            print("\n💡 提示:")
            print("  - 按 Ctrl+C 停止服务器")
            print("  - 修改文件后刷新浏览器即可看到更改")
            print("  - Service Worker可能需要强制刷新 (Ctrl+Shift+R)")
            print()
            
            # 自动打开浏览器
            try:
                webbrowser.open(url)
                print(f"🌐 已在默认浏览器中打开: {url}")
            except Exception as e:
                print(f"⚠️  无法自动打开浏览器: {e}")
                print(f"请手动访问: {url}")
            
            print("\n" + "="*50)
            print("服务器日志:")
            print("="*50)
            
            # 启动服务器
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n🛑 服务器已停止")
        return True
    except Exception as e:
        print(f"❌ 服务器启动失败: {e}")
        return False

def show_help():
    """显示帮助信息"""
    help_text = """
🌟 个人网站开发服务器

用法:
    python start-server.py [选项]

选项:
    -h, --help     显示此帮助信息
    -p, --port     指定端口号 (默认: 8000)
    --host         指定主机地址 (默认: localhost)
    
示例:
    python start-server.py
    python start-server.py -p 3000
    python start-server.py --host 0.0.0.0 -p 8080

功能:
    ✅ 静态文件服务
    ✅ PWA支持 (Service Worker)
    ✅ CORS头部支持
    ✅ 安全头部设置
    ✅ 自动打开浏览器
    ✅ 实时日志显示

注意:
    - 确保当前目录包含 index.html 文件
    - Service Worker 需要 HTTPS 或 localhost 环境
    - 生产环境请使用专业的 Web 服务器
"""
    print(help_text)

def main():
    """主函数"""
    global PORT, HOST
    
    # 解析命令行参数
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        arg = args[i]
        
        if arg in ['-h', '--help']:
            show_help()
            return
        elif arg in ['-p', '--port']:
            if i + 1 < len(args):
                try:
                    PORT = int(args[i + 1])
                    i += 1
                except ValueError:
                    print("❌ 端口号必须是数字")
                    return
            else:
                print("❌ --port 选项需要指定端口号")
                return
        elif arg == '--host':
            if i + 1 < len(args):
                HOST = args[i + 1]
                i += 1
            else:
                print("❌ --host 选项需要指定主机地址")
                return
        else:
            print(f"❌ 未知选项: {arg}")
            print("使用 -h 或 --help 查看帮助信息")
            return
        
        i += 1
    
    # 检查是否在正确的目录
    if not Path('index.html').exists():
        print("❌ 当前目录中未找到 index.html 文件")
        print("请确保在项目根目录中运行此脚本")
        return
    
    # 启动服务器
    start_server()

if __name__ == '__main__':
    main()