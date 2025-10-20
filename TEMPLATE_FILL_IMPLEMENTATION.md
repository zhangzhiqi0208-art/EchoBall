# 模板填充功能实现说明

## 问题分析

从用户反馈的图片中可以看到，表单显示的是通用选项（如"功能问题"、"产品优化"、"中"等），而不是模板中定义的具体选项。主要问题包括：

1. **选项不匹配**：当前显示的是通用选项，而不是模板中定义的具体选项
2. **LLM推断缺失**：没有根据模板要求进行智能推断和填充
3. **模板填充功能缺失**：需要专门的模板填充端点

## 解决方案

### 1. 新增模板填充API端点

#### `/api/fill-template/fill` (POST)
- **功能**: 根据模板配置填充标准化内容
- **参数**:
  - `description` (string): 用户反馈描述
  - `system_types` (JSON string): 所属地区列表
  - `modules` (JSON string): 归属模块列表
  - `template_id` (string): 模板ID，默认为"design_experience_issue"

- **返回格式**:
```json
{
  "success": true,
  "data": {
    "title": "智能生成的标题",
    "region": "SSL",
    "terminal": "门店端",
    "issue_type": "设计需求优化",
    "resolution_method": "体验优化",
    "priority": "P0-紧急",
    "problem_description": "详细问题描述",
    "solution": "具体解决方案",
    "status": "待确认(未提给研发)",
    "target_version": "未定",
    "screenshots": "",
    "attachments": ""
  },
  "template_id": "design_experience_issue",
  "message": "模板填充完成"
}
```

#### `/api/fill-template/template/{template_id}` (GET)
- **功能**: 获取模板配置信息

#### `/api/fill-template/templates` (GET)
- **功能**: 获取所有可用模板列表

### 2. LLM服务增强

#### 模板填充功能
- **智能推断**: 根据模板配置和用户反馈进行智能分析
- **选项匹配**: 从模板定义的选项中选择最匹配的值
- **多层降级**: DeepSeek API → 模拟填充 → 降级填充

#### 提示词优化
- 根据模板字段配置动态构建提示词
- 明确区分需要推断的字段和预设选项字段
- 提供详细的字段说明和选择指导

### 3. 模板配置完善

#### 设计体验问题模板
```json
{
  "id": "design_experience_issue",
  "name": "设计体验问题反馈",
  "category": "设计体验",
  "config": {
    "fields": [
      {
        "name": "issue_type",
        "label": "问题类型",
        "type": "select",
        "llm_inferred": true,
        "options": ["设计需求优化", "交互功能bug", "视觉还原度bug", "历史遗留"]
      },
      {
        "name": "resolution_method",
        "label": "解决方式",
        "type": "select",
        "llm_inferred": true,
        "options": ["体验优化", "需求优化"]
      },
      {
        "name": "priority",
        "label": "优先级",
        "type": "select",
        "llm_inferred": true,
        "options": ["P0-紧急", "P1-高", "P2-中", "P3-低"]
      }
    ]
  }
}
```

### 4. 前端功能增强

#### 新增"模板填充"按钮
- 位置: 反馈表单底部，与"智能解析"按钮并列
- 功能: 调用模板填充API，使用正确的模板配置
- 状态: 支持加载状态显示

#### 智能分析特性
- **问题类型识别**: 从模板选项中选择最匹配的类型
- **优先级判断**: 基于关键词智能判断P0-P3优先级
- **解决方式推荐**: 根据问题类型选择体验优化或需求优化
- **字段完整性**: 确保所有模板字段都被正确填充

## 实现细节

### 后端架构
- **FastAPI**: 现代Python Web框架
- **模板服务**: 管理模板配置和字段定义
- **LLM服务**: 智能分析和模板填充
- **多层降级**: 确保服务稳定性

### 前端架构
- **React + TypeScript**: 类型安全的组件开发
- **React Query**: 数据获取和状态管理
- **Ant Design**: 企业级UI组件库

### 数据流程
1. 用户输入反馈信息
2. 前端验证并发送到模板填充API
3. LLM服务根据模板配置进行智能分析
4. 返回符合模板要求的结构化数据
5. 前端填充到预览表单
6. 用户确认或编辑后保存

## 测试验证

### 测试用例
对于反馈"语言切换功能还是ssl的橘色button,应该改成黄色,这个最好快点处理"：

**预期结果**:
- **问题类型**: 设计需求优化（涉及颜色和视觉设计）
- **优先级**: P0-紧急（包含"快点"关键词）
- **解决方式**: 体验优化（视觉设计改进）
- **所属地区**: SSL（用户选择）
- **归属终端**: 门店端（用户选择）

### 验证方法
1. **启动服务**:
   ```bash
   cd backend && python main.py
   cd frontend && npm run dev
   ```

2. **运行测试**:
   ```bash
   python test_template_fill.py
   ```

3. **界面验证**:
   - 填写反馈信息
   - 点击"模板填充"按钮
   - 检查预览面板中的字段填充

## 关键改进

### 1. 选项匹配
- ✅ 问题类型: 设计需求优化、交互功能bug、视觉还原度bug、历史遗留
- ✅ 解决方式: 体验优化、需求优化
- ✅ 优先级: P0-紧急、P1-高、P2-中、P3-低
- ✅ 解决状态: 待确认(未提给研发)、研发中(已提给研发)、待走查(已研发完成)、已解决(走查完成并上线)、暂不解决

### 2. 智能推断
- ✅ 基于关键词的问题类型识别
- ✅ 基于紧急程度的优先级判断
- ✅ 基于问题类型的解决方式选择
- ✅ 智能标题和解决方案生成

### 3. 模板配置
- ✅ 完整的字段定义和选项配置
- ✅ LLM推断字段标记
- ✅ 默认值和必填字段设置
- ✅ 字段类型和验证规则

## 使用说明

### 1. 模板填充 vs 智能解析
- **模板填充**: 使用设计体验问题模板，严格按照模板选项填充
- **智能解析**: 使用通用分析，返回扩展的分析信息

### 2. 推荐使用流程
1. 填写问题描述、选择地区和模块
2. 点击"模板填充"按钮（推荐）
3. 查看预览面板中的正确字段填充
4. 确认或编辑后保存

### 3. 错误处理
- API调用失败时自动降级到模拟填充
- 参数验证和格式检查
- 用户友好的错误提示

## 相关文件

### 后端文件
- `backend/app/api/fill_template.py` - 模板填充API端点
- `backend/app/services/llm_service.py` - LLM服务增强
- `backend/app/services/template_service.py` - 模板服务配置
- `backend/main.py` - 路由注册

### 前端文件
- `frontend/src/services/api.ts` - API调用方法
- `frontend/src/hooks/useFeedback.ts` - 模板填充hooks
- `frontend/src/components/FeedbackForm/index.tsx` - 表单组件更新

### 测试文件
- `test_template_fill.py` - 模板填充功能测试
- `TEMPLATE_FILL_IMPLEMENTATION.md` - 本实现说明

## 总结

通过实现专门的模板填充功能，现在系统能够：

1. **严格按照模板配置**进行字段填充
2. **智能推断**问题类型、优先级和解决方式
3. **正确匹配**模板中定义的选项
4. **提供完整的**模板字段填充
5. **支持多层降级**确保服务稳定性

用户现在可以通过"模板填充"按钮获得符合模板要求的准确字段填充，解决了之前选项不匹配和LLM推断缺失的问题。
