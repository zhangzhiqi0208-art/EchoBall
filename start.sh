#!/bin/bash

# FeedbackBridge 启动脚本
# 用于同时启动前端和后端服务

echo "🚀 启动 FeedbackBridge 智能反馈转化系统..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 16+"
    exit 1
fi

# 检查 Python 是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 未安装，请先安装 Python 3.8+"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

# 检查 pip 是否安装
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 未安装，请先安装 pip3"
    exit 1
fi

echo "✅ 环境检查通过"

# 启动后端服务
echo "🔧 启动后端服务..."
cd backend

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo "📦 创建 Python 虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
echo "📦 安装后端依赖..."
pip install -r requirements.txt

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "⚙️  创建环境变量文件..."
    cp env.example .env
    echo "⚠️  请编辑 backend/.env 文件，设置您的 DEEPSEEK_API_KEY"
fi

# 启动后端服务（后台运行）
echo "🚀 启动后端服务 (http://localhost:8000)..."
python start.py &
BACKEND_PID=$!

# 等待后端服务启动
sleep 3

# 启动前端服务
echo "🎨 启动前端服务..."
cd ../frontend

# 检查 node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
fi

# 启动前端服务
echo "🚀 启动前端服务 (http://localhost:5173)..."
npm run dev &
FRONTEND_PID=$!

# 等待前端服务启动
sleep 5

echo ""
echo "🎉 FeedbackBridge 启动成功！"
echo ""
echo "📱 前端应用: http://localhost:5173"
echo "🔧 后端API: http://localhost:8000"
echo "📖 API文档: http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待用户中断
trap 'echo ""; echo "🛑 正在停止服务..."; kill $BACKEND_PID $FRONTEND_PID; echo "✅ 服务已停止"; exit 0' INT

# 保持脚本运行
wait
