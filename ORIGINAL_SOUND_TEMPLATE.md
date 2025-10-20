# 用户原声清洗模板

## 概述

用户原声清洗模板是一个智能化的用户反馈处理系统，支持三种输入方式：文本原声、录音原声和Excel文件。系统能够自动分析用户反馈内容，进行智能分类、翻译和总结，生成标准化的处理结果。

## 功能特性

### 支持的输入类型

1. **文本原声**
   - 直接输入文本内容
   - 支持多语言输入
   - 实时分析和处理

2. **录音原声**
   - 支持音频文件上传
   - 自动语音识别转文本
   - 支持多种音频格式（MP3、WAV、M4A、OGG）

3. **Excel文件**
   - 支持.xlsx和.xls格式
   - 自动解析表格内容
   - 提取文本信息进行分析

### 智能分析功能

- **反馈类型识别**：自动识别功能反馈、体验反馈、服务反馈、其他反馈
- **智能翻译**：支持多语言之间的准确翻译
- **内容总结**：提取核心观点，生成简洁总结
- **使用建议**：基于反馈类型提供具体的处理建议

## 技术架构

### 后端API

- **文本处理**：`/api/original-sound/process-text`
- **音频处理**：`/api/original-sound/process-audio`
- **Excel处理**：`/api/original-sound/process-excel`
- **仅分析**：`/api/original-sound/analyze-only`

### 前端组件

- **OriginalSoundPage**：主页面组件
- **三种输入方式**：文本、录音、Excel
- **实时预览**：分析结果实时显示
- **响应式设计**：支持移动端和桌面端

### 数据库支持

- **历史记录**：自动保存处理历史
- **文件管理**：支持文件上传和存储
- **用户管理**：支持多用户使用

## 使用方法

### 1. 文本原声处理

```typescript
// 前端调用示例
const result = await originalSoundAPI.processText({
  user_input: "用户反馈内容",
  source_language: "中文",
  target_language: "英文",
  user_id: "user123"
});
```

### 2. 录音原声处理

```typescript
// 前端调用示例
const formData = new FormData();
formData.append('audio_file', audioFile);
formData.append('source_language', '中文');
formData.append('target_language', '英文');
formData.append('user_id', 'user123');

const result = await originalSoundAPI.processAudio(formData);
```

### 3. Excel文件处理

```typescript
// 前端调用示例
const formData = new FormData();
formData.append('excel_file', excelFile);
formData.append('source_language', '中文');
formData.append('target_language', '英文');
formData.append('user_id', 'user123');

const result = await originalSoundAPI.processExcel(formData);
```

## 配置说明

### 模板配置

模板配置文件位于：`/templates/original_sound_cleaning.md`

```json
{
  "id": "original_sound_cleaning",
  "name": "用户原声清洗模板",
  "description": "用于清洗和分析用户原声反馈的标准化模板",
  "category": "用户原声",
  "input_types": ["text", "audio", "excel"],
  "fields": [
    {
      "name": "feedback_type",
      "label": "反馈类型",
      "type": "select",
      "options": ["功能反馈", "体验反馈", "服务反馈", "其他反馈"]
    }
  ]
}
```

### 提示词配置

提示词配置文件位于：`/backend/prompts.json`

```json
{
  "original_sound_analysis": {
    "system": "你是专业的用户反馈分析师...",
    "user": "请分析以下用户原声..."
  }
}
```

## 部署说明

### 环境要求

- Python 3.8+
- Node.js 16+
- 数据库支持（SQLite/PostgreSQL/MySQL）

### 安装依赖

```bash
# 后端依赖
cd backend
pip install -r requirements.txt

# 前端依赖
cd frontend
npm install
```

### 启动服务

```bash
# 启动后端服务
cd backend
python main.py

# 启动前端服务
cd frontend
npm run dev
```

## 测试验证

运行测试脚本验证功能：

```bash
python test_original_sound.py
```

## 扩展功能

### 语音识别集成

目前语音识别功能为模拟实现，可以集成以下服务：

- **百度语音识别API**
- **阿里云语音识别**
- **腾讯云语音识别**
- **Azure语音服务**

### 翻译服务集成

可以集成专业翻译服务：

- **Google翻译API**
- **百度翻译API**
- **腾讯翻译API**
- **有道翻译API**

### 文件处理优化

- **大文件支持**：增加文件大小限制
- **格式支持**：支持更多音频和文档格式
- **批量处理**：支持批量文件处理

## 注意事项

1. **文件大小限制**：
   - 音频文件：最大50MB
   - Excel文件：最大20MB

2. **支持的语言**：
   - 中文、英文、葡语、西语、法语、德语、日语、韩语

3. **性能优化**：
   - 大文件处理可能需要较长时间
   - 建议在后台处理大文件

4. **错误处理**：
   - 文件格式不支持时会提示错误
   - 网络异常时会自动重试
   - 处理失败时会显示详细错误信息

## 版本信息

- **模板版本**：v1.0.0
- **创建时间**：2024-01-XX
- **最后更新**：2024-01-XX
- **适用场景**：用户原声清洗和分析
