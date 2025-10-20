# FeedbackBridge - 智能反馈转化系统

一个基于 AI 的智能原声清洗系统，将用户原声快速转化为标准化的需求文档，提升团队协作效率。

## 🚀 功能特性

- **智能分析**: 集成 DeepSeek LLM API，智能分析问题类型、优先级和解决方案
- **模板化管理**: 支持多种转化场景，可自定义模板配置
- **现代化架构**: 前后端分离，React + TypeScript + FastAPI
- **响应式设计**: 支持桌面端和移动端访问
- **实时预览**: 转化结果实时预览，支持编辑和导出
- **历史管理**: 完整的转化历史记录和管理功能

## 🛠️ 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **UI库**: Ant Design 5
- **状态管理**: Zustand + React Query
- **路由**: React Router DOM 6

### 后端
- **框架**: Python FastAPI
- **数据库**: SQLite + SQLAlchemy
- **LLM**: DeepSeek API
- **文件处理**: aiofiles
- **异步支持**: uvicorn

## 📦 项目结构

```
feedback-bridge/
├── backend/                 # 后端服务
│   ├── app/                # 应用核心
│   │   ├── api/            # API 路由
│   │   ├── models/         # 数据模型
│   │   └── services/       # 业务逻辑
│   ├── main.py             # 主应用文件
│   ├── start.py            # 启动脚本
│   └── requirements.txt    # 依赖列表
├── frontend/               # 前端应用
│   ├── src/                # 源代码
│   │   ├── components/     # 组件
│   │   ├── pages/          # 页面
│   │   ├── hooks/          # 自定义 Hooks
│   │   ├── services/       # API 服务
│   │   └── store/          # 状态管理
│   ├── package.json        # 依赖配置
│   └── vite.config.ts      # 构建配置
└── README.md               # 项目说明
```

## 🚀 快速开始

### 环境要求

- Node.js 16+ 
- Python 3.8+
- DeepSeek API Key (可选，未设置时使用模拟分析)

### 1. 克隆项目

```bash
git clone <repository-url>
cd feedback-bridge
```

### 2. 启动后端服务

```bash
# 进入后端目录
cd backend

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp env.example .env
# 编辑 .env 文件，设置 DEEPSEEK_API_KEY

# 启动服务
python start.py
```

后端服务将在 http://localhost:8000 启动

### 3. 启动前端应用

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端应用将在 http://localhost:5173 启动

### 4. 访问应用

打开浏览器访问 http://localhost:5173 即可使用系统。

## 📖 使用指南

### 基本流程

1. **选择模板**: 根据转化场景选择合适的模板
2. **描述问题**: 详细描述体验问题，支持上传截图
3. **选择范围**: 选择所属地区和归属模块
4. **一键转化**: 系统自动分析并生成标准化格式
5. **预览编辑**: 查看转化结果，支持编辑和调整
6. **保存导出**: 保存到历史记录或导出文档

### 模板类型

- **设计体验问题模板**: 用于转化用户体验问题
- **Bug报告模板**: 用于报告系统Bug和功能异常
- **功能需求模板**: 用于提交新功能需求和建议

### API 接口

后端提供完整的 RESTful API：

- `POST /api/convert` - 反馈转化
- `GET /api/templates` - 获取模板列表
- `POST /api/upload` - 文件上传
- `GET /api/history` - 获取历史记录

详细 API 文档请访问 http://localhost:8000/docs

## 🔧 开发指南

### 后端开发

```bash
cd backend

# 安装开发依赖
pip install -r requirements.txt

# 启动开发服务器（支持热重载）
python start.py

# 运行测试
pytest

# 代码格式化
black .
```

### 前端开发

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

### 添加新功能

1. **后端**: 在 `app/` 目录下添加新的 API 路由和服务
2. **前端**: 在 `src/` 目录下添加新的组件和页面
3. **类型**: 在 `src/types/` 中定义 TypeScript 类型
4. **API**: 在 `src/services/` 中添加 API 调用方法

## 🚀 部署指南

### 后端部署

```bash
# 使用 Docker
docker build -t feedback-bridge-backend ./backend
docker run -p 8000:8000 feedback-bridge-backend

# 使用 PM2
pm2 start backend/main.py --name feedback-bridge-api
```

### 前端部署

```bash
# 构建生产版本
cd frontend
npm run build

# 部署到 Nginx
cp -r dist/* /var/www/html/
```

### 环境配置

生产环境需要配置以下环境变量：

```env
# 后端
DEEPSEEK_API_KEY=your_api_key
DATABASE_URL=postgresql://user:pass@localhost/db
DEBUG=False

# 前端
VITE_API_BASE_URL=https://api.yourdomain.com
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📝 更新日志

### v1.0.0 (2024-01-XX)
- ✨ 初始版本发布
- 🚀 支持智能反馈转化
- 📝 模板化管理系统
- 🎨 现代化用户界面
- 📱 响应式设计支持

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://reactjs.org/) - 前端框架
- [FastAPI](https://fastapi.tiangolo.com/) - 后端框架
- [Ant Design](https://ant.design/) - UI 组件库
- [DeepSeek](https://www.deepseek.com/) - LLM API 服务

## 📞 联系我们

- 项目地址: [GitHub Repository]
- 问题反馈: [GitHub Issues]
- 邮箱: [your-email@example.com]

---

⭐ 如果这个项目对您有帮助，请给我们一个 Star！
