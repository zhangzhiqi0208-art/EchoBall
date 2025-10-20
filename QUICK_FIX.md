# 🚨 紧急修复方案

## 问题确认
- 8000端口被多个进程占用（PID: 8504, 8510）
- 需要sudo权限清理进程
- 后端服务无法正常启动

## 立即执行步骤

### 步骤1: 手动清理进程
请在终端中执行以下命令：

```bash
# 1. 查找占用8000端口的进程
lsof -i :8000

# 2. 强制结束所有Python进程（会要求输入密码）
sudo pkill -f "python3 main.py"
sudo pkill -f "Python.*8000"

# 3. 等待2秒
sleep 2

# 4. 验证端口已释放
lsof -i :8000
```

### 步骤2: 重新启动后端服务
```bash
cd /Users/didi/zhangzhiqi/feedback-bridge/backend
python3 main.py
```

### 步骤3: 验证服务正常
在新的终端窗口中：
```bash
curl http://localhost:8000/health
```

**应该返回JSON格式**：
```json
{"status":"healthy","timestamp":"2025-10-19T..."}
```

### 步骤4: 刷新浏览器
1. 在浏览器中按 `Cmd+Shift+R` 强制刷新
2. 或者完全关闭浏览器后重新打开

## 如果仍然失败

### 方案A: 使用不同端口
如果8000端口持续被占用，我们可以修改后端使用其他端口：

```bash
# 修改后端端口为8001
cd /Users/didi/zhangzhiqi/feedback-bridge/backend
python3 -c "
import uvicorn
from main import app
uvicorn.run(app, host='0.0.0.0', port=8001)
"
```

然后修改前端API调用：
- 将 `http://localhost:8000` 改为 `http://localhost:8001`

### 方案B: 重启系统
如果端口问题持续存在：
```bash
# 重启系统（会清理所有进程）
sudo reboot
```

## 验证修复成功

1. 访问：`http://localhost:3000/index.html`
2. 点击"用户原声清洗模板"
3. 输入西班牙语内容
4. 点击"一键转化"
5. 应该看到三个部分：
   - 🎭 情感分析
   - 🌐 翻译结果  
   - 🧠 智能总结

## 联系支持

如果按照以上步骤仍然无法解决，请提供：
1. `lsof -i :8000` 的输出
2. `curl http://localhost:8000/health` 的返回结果
3. 浏览器控制台的错误信息

