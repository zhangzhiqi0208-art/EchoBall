# 新会话功能实现说明

## 功能概述

在左侧输入区域的第一个模板卡片右侧，新增了一个独立的"+新会话"按钮。该按钮允许用户快速开始新的问题转化会话，同时智能保留用户的选择偏好。

## 功能特性

### ✅ 已实现功能

1. **独立的新会话按钮**
   - 位置：模板卡片右侧
   - 样式：蓝色边框，白色背景，悬停时变为蓝色背景
   - 图标：使用 Font Awesome 的 plus 图标

2. **智能表单重置**
   - 清空体验问题描述
   - 清空所有上传的截图和文件
   - 保持所属地区选择（BR/SSL）
   - 保持归属终端/模块选择（管理端/门店端/移动端）

3. **预览区域重置**
   - 恢复为默认状态（显示"转化后的标准化内容将在此处显示"）
   - 隐藏预览操作按钮
   - 清空当前分析结果

4. **用户体验优化**
   - 显示成功提示："新会话已开始，表单已重置"
   - 自动聚焦到问题描述输入框
   - 重置转化按钮状态

## 技术实现

### HTML 修改
```html
<!-- 在模板选择区域添加新会话按钮 -->
<div class="template-selector">
    <div class="template-card">
        <!-- 原有模板卡片内容 -->
    </div>
    <button class="new-session-btn" id="newSessionBtn">
        <i class="fas fa-plus"></i>
        新会话
    </button>
</div>
```

### CSS 样式
```css
/* 新会话按钮样式 */
.new-session-btn {
    width: 100%;
    padding: 12px 16px;
    background: #fff;
    color: #1890ff;
    border: 1px solid #1890ff;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 1px 2px rgba(24, 144, 255, 0.1);
}

.new-session-btn:hover {
    background: #1890ff;
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(24, 144, 255, 0.2);
}
```

### JavaScript 功能
```javascript
// 开始新会话
function startNewSession() {
    // 保存当前选择的地区和模块
    const selectedSystemTypes = elements.systemTypeSelect.querySelectorAll('input[type="checkbox"]:checked');
    const systemTypes = Array.from(selectedSystemTypes).map(checkbox => checkbox.value);
    const selectedModules = elements.moduleSelect.querySelectorAll('input[type="checkbox"]:checked');
    const modules = Array.from(selectedModules).map(checkbox => checkbox.value);
    
    // 清空体验问题描述
    elements.issueDescription.value = '';
    
    // 清空已上传的文件
    uploadedFiles = [];
    elements.uploadedFiles.innerHTML = '';
    
    // 清空预览区域，恢复默认状态
    elements.previewContent.innerHTML = `
        <div class="preview-placeholder">
            <i class="fas fa-eye preview-icon"></i>
            <p>转化后的标准化内容将在此处显示</p>
        </div>
    `;
    
    // 隐藏预览操作按钮
    elements.previewActions.style.display = 'none';
    
    // 重置转化按钮状态
    checkConvertButtonState();
    
    // 恢复地区和模块的选择（保持用户上次的选择）
    if (systemTypes.length > 0) {
        const systemTypeCheckboxes = elements.systemTypeSelect.querySelectorAll('input[type="checkbox"]');
        systemTypeCheckboxes.forEach(checkbox => {
            checkbox.checked = systemTypes.includes(checkbox.value);
        });
    }
    
    if (modules.length > 0) {
        const moduleCheckboxes = elements.moduleSelect.querySelectorAll('input[type="checkbox"]');
        moduleCheckboxes.forEach(checkbox => {
            checkbox.checked = modules.includes(checkbox.value);
        });
    }
    
    // 清空当前分析结果
    window.currentAnalysisResult = null;
    window.conversionCompleted = false;
    
    // 显示成功提示
    showNotification('新会话已开始，表单已重置', 'success');
    
    // 聚焦到问题描述输入框
    elements.issueDescription.focus();
}
```

## 使用流程

1. 用户填写体验问题描述
2. 选择所属地区和归属模块
3. 上传相关截图或文件
4. 点击"一键转化"进行问题转化
5. 查看转化结果
6. 点击"+新会话"按钮开始新的会话
7. 系统自动清空问题描述和文件，但保留地区和模块选择
8. 预览区域重置为默认状态
9. 用户可以继续输入新的问题

## 设计理念

### 智能保留用户选择
- **所属地区**和**归属模块**的选择会被保留，因为这些通常是用户的工作环境偏好
- 避免用户每次都需要重新选择相同的地区和模块

### 完全重置内容
- **体验问题描述**和**截图文件**会被清空，确保新会话的独立性
- **预览区域**重置为默认状态，避免混淆

### 用户体验优化
- 提供明确的反馈提示
- 自动聚焦到输入框，方便用户继续操作
- 按钮样式与整体设计保持一致

## 测试验证

请参考 `test_new_session.html` 文件中的详细测试步骤，验证功能的正确性。

## 兼容性

- 与现有的草稿保存功能完全兼容
- 不影响历史记录功能
- 与转化功能无缝集成
- 支持所有现代浏览器

## 未来扩展

可以考虑的功能扩展：
1. 添加确认对话框，防止误操作
2. 支持快捷键操作（如 Ctrl+N）
3. 添加会话计数或统计功能
4. 支持保存多个会话模板
