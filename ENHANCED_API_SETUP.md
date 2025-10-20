# 🚀 增强版API设置指南

## 📋 概述

增强版API集成了真实的DeepSeek API调用，为用户原声清洗模板提供智能分析功能。

## 🔧 配置步骤

### 步骤1: 配置API密钥

**方法A: 环境变量（推荐）**
```bash
export DEEPSEEK_API_KEY="your-actual-api-key-here"
```

**方法B: 修改配置文件**
编辑 `backend/config.py` 文件：
```python
DEEPSEEK_API_KEY = "your-actual-api-key-here"
```

### 步骤2: 安装依赖

```bash
cd /Users/didi/zhangzhiqi/feedback-bridge/backend
pip install requests
```

### 步骤3: 启动增强版服务器

```bash
cd /Users/didi/zhangzhiqi/feedback-bridge/backend
python3 start_enhanced_server.py
```

### 步骤4: 测试API功能

```bash
cd /Users/didi/zhangzhiqi/feedback-bridge
python3 test_enhanced_api.py
```

## 🎯 功能特性

### 1. 智能翻译
- 支持西班牙语、葡萄牙语、英语到中文的翻译
- 保持原意和情感色彩
- 使用DeepSeek API进行高质量翻译

### 2. 智能总结
使用您提供的prompt模板：
```python
def create_summary_prompt(translated_content):
    prompt = f"""
请对以下用户反馈进行专业分析总结：

用户反馈内容：
"{translated_content}"

请按照以下结构化格式输出：

**核心主旨**：[用一句话精炼总结用户的中心思想]

**重点分析**：
1. [第一重点，简洁明确]
2. [第二重点，简洁明确] 
3. [第三重点，简洁明确]

要求：
- 总结要客观准确，不添加个人观点
- 重点要具体，避免模糊表述
- 语言简洁，不要过于啰嗦
- 如内容涉及产品功能，请具体指出功能点
    """
    return prompt
```

### 3. 情感分析
- 自动识别情感倾向（正向/负向/中性）
- 评估情感强度（强烈/中等/轻微）
- 提供详细的情感分析说明

### 4. 关键要点提取
- 自动提取用户反馈的关键要点
- 结构化展示重点信息

## 🔄 工作流程

1. **用户输入** → 西班牙语/葡萄牙语/英语原声
2. **智能翻译** → 使用DeepSeek API翻译为中文
3. **智能总结** → 使用您的prompt模板生成结构化总结
4. **情感分析** → 分析情感倾向和强度
5. **结果展示** → 在前端展示完整的分析结果

## 🛠️ 故障排除

### 问题1: API密钥错误
```
❌ API调用失败: 401 - Unauthorized
```
**解决方案**: 检查API密钥是否正确配置

### 问题2: 网络连接问题
```
❌ API调用异常: Connection timeout
```
**解决方案**: 检查网络连接，确保可以访问DeepSeek API

### 问题3: 服务启动失败
```
❌ 启动失败: Address already in use
```
**解决方案**: 停止现有服务或使用不同端口

## 📊 性能优化

### 1. 超时设置
- API调用超时：30秒
- 最大token数：1000
- 温度参数：0.3（确保结果稳定性）

### 2. 错误处理
- API调用失败时使用备用结果
- 确保服务稳定性
- 详细的错误日志

### 3. 缓存机制
- 可以考虑添加结果缓存
- 减少重复API调用

## 🎉 预期效果

使用增强版API后，用户原声清洗模板将：

1. **返回真实的分析结果** - 不再是固定的模拟数据
2. **提供智能翻译** - 高质量的西班牙语/葡萄牙语翻译
3. **生成结构化总结** - 按照您的prompt模板生成专业总结
4. **准确的情感分析** - 基于AI的智能情感识别
5. **提取关键要点** - 自动识别用户反馈的重点

## 📞 技术支持

如果遇到问题，请检查：
1. API密钥是否正确配置
2. 网络连接是否正常
3. 服务器日志中的错误信息
4. DeepSeek API服务状态

---

**现在您的用户原声清洗模板将提供真实的AI分析结果！** 🎉

