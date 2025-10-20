// 全局变量
let uploadedFiles = [];
let isConverting = false;

// 简化的Tab切换函数 - 全局函数
function switchTab(templateType) {
    console.log('switchTab 被调用，模板类型:', templateType);
    
    try {
        // 移除所有tab的active状态
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // 添加当前tab的active状态
        const currentTab = document.querySelector(`[data-template="${templateType}"]`);
        if (currentTab) {
            currentTab.classList.add('active');
            console.log('激活标签:', currentTab.textContent);
        } else {
            console.error('找不到标签:', templateType);
        }
        
        // 根据模板类型更新界面内容
        updateTemplateContent(templateType);
        
        // 显示切换提示
        const templateName = templateType === 'design' ? '设计体验问题模板' : '用户原声清洗模板';
        console.log('已切换到:', templateName);
    } catch (error) {
        console.error('switchTab 错误:', error);
    }
}

// 更新模板内容 - 全局函数
function updateTemplateContent(templateType) {
    console.log('更新模板内容:', templateType);
    
    if (templateType === 'design') {
        // 显示设计体验问题模板
        console.log('切换到设计体验问题模板');
        
        // 隐藏用户原声清洗模板相关元素
        const originalSoundElements = [
            'originalSoundInputGroup',
            'originalSoundConvertBtn'
        ];
        
        originalSoundElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
                console.log('隐藏元素:', id);
            }
        });
        
        // 显示所有input-card元素
        const inputCards = document.querySelectorAll('.input-card');
        inputCards.forEach(card => {
            card.style.display = 'block';
            console.log('显示input-card元素');
        });
        
        // 显示设计体验问题模板相关元素
        const designElements = [
            'designInputGroup',
            'designFileUploadGroup',
            'designSystemTypeGroup',
            'designModuleGroup',
            'convertBtn'
        ];
        
        designElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'block';
                console.log('显示元素:', id);
            }
        });
        
        // 清空预览区域
        const previewContent = document.getElementById('previewContent');
        if (previewContent) {
            previewContent.innerHTML = `
                <div class="preview-placeholder">
                    <i class="fas fa-eye preview-icon"></i>
                    <p>转化后的标准化内容将在此处显示</p>
                </div>
            `;
        }
        
    } else if (templateType === 'feedback') {
        // 显示用户原声清洗模板
        console.log('切换到用户原声清洗模板');
        
        // 隐藏设计体验问题模板相关元素
        const designElements = [
            'designInputGroup',
            'designFileUploadGroup',
            'designSystemTypeGroup',
            'designModuleGroup',
            'convertBtn'
        ];
        
        designElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
                console.log('隐藏元素:', id);
            }
        });
        
        // 隐藏所有input-card元素，但保留用户原声卡片的控制权给switchInputType函数
        const inputCards = document.querySelectorAll('.input-card');
        inputCards.forEach(card => {
            // 跳过用户原声卡片，让switchInputType函数来控制它的显示
            if (card.id !== 'userOriginalSoundCard') {
                card.style.display = 'none';
                console.log('隐藏input-card元素:', card.id);
            }
        });
        
        // 显示用户原声清洗模板相关元素
        const originalSoundElements = [
            'originalSoundInputGroup',
            'originalSoundConvertBtn'
        ];
        
        originalSoundElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'block';
                console.log('显示元素:', id, '元素存在:', !!element);
            } else {
                console.log('元素不存在:', id);
            }
        });
        
        // 清空预览区域
        const previewContent = document.getElementById('previewContent');
        if (previewContent) {
            previewContent.innerHTML = `
                <div class="preview-placeholder">
                    <i class="fas fa-eye preview-icon"></i>
                    <p>转化后的标准化内容将在此处显示</p>
                </div>
            `;
        }
        
        // 初始化用户原声清洗模板并设置正确的输入类型
        if (typeof OriginalSoundTemplate !== 'undefined') {
            if (!OriginalSoundTemplate.initialized) {
                OriginalSoundTemplate.init();
            }
            OriginalSoundTemplate.switchInputType('text'); // 默认设置为文本原声，这会正确处理用户原声卡片的显示
        }
    }
}

// 智能分析引擎
const SmartAnalysisEngine = {
    // 学习缓存
    learningCache: {
        userPreferences: {},
        commonPatterns: {},
        successRates: {}
    },

    // 初始化学习缓存
    initLearningCache() {
        const cached = localStorage.getItem('smartAnalysis_learningCache');
        if (cached) {
            try {
                this.learningCache = { ...this.learningCache, ...JSON.parse(cached) };
            } catch (error) {
                console.warn('Failed to load learning cache:', error);
            }
        }
    },

    // 保存学习缓存
    saveLearningCache() {
        try {
            localStorage.setItem('smartAnalysis_learningCache', JSON.stringify(this.learningCache));
        } catch (error) {
            console.warn('Failed to save learning cache:', error);
        }
    },

    // 记录用户原声
    recordUserFeedback(analysis, userAction) {
        const feedback = {
            timestamp: new Date().toISOString(),
            analysis: {
                predictedType: analysis.predictedType,
                priority: analysis.priority,
                confidence: analysis.analysisConfidence
            },
            userAction: userAction, // 'accepted', 'modified', 'rejected'
            success: userAction === 'accepted'
        };

        // 更新成功率统计
        const key = `${analysis.predictedType}_${analysis.priority}`;
        if (!this.learningCache.successRates[key]) {
            this.learningCache.successRates[key] = { total: 0, success: 0 };
        }
        
        this.learningCache.successRates[key].total++;
        if (feedback.success) {
            this.learningCache.successRates[key].success++;
        }

        // 保存缓存
        this.saveLearningCache();
    },

    // 获取成功率
    getSuccessRate(problemType, priority) {
        const key = `${problemType}_${priority}`;
        const stats = this.learningCache.successRates[key];
        if (!stats || stats.total === 0) return 0.5; // 默认50%
        return stats.success / stats.total;
    },
    // 问题类型预测模型（根据设计体验问题模板）
    problemTypePatterns: {
        '设计需求优化': [
            '设计', '界面', '布局', '美观', '颜色', '样式', '外观', '视觉', 'UI', 'UX',
            '按钮', '图标', '字体', '间距', '配色', '风格', '主题', '品牌'
        ],
        '交互功能bug': [
            '交互', '操作', '点击', '按钮', '功能', '无法', '不能', '错误', '异常', 'bug',
            '失效', '不工作', '故障', '报错', '崩溃', '闪退', '白屏', '显示', '数据', '保存', '提交'
        ],
        '视觉还原度bug': [
            '还原', '实现', '不一致', '偏差', '效果', '显示', '渲染', '像素', '对齐',
            '尺寸', '位置', '比例', '清晰度', '分辨率',
            // 颜色/品牌色相关关键词（增强视觉类判断）
            '颜色', '色值', '配色', '品牌色', '主色', '辅色', '高亮色',
            '黄色', '橙色', '橘色', '蓝色', '绿色', '红色',
            // 字体/字号/像素等
            '字体', '字号', '字重', '粗细', 'px', '像素', '大小', 'line-height', 'letter-spacing', '行高', '字间距', '间距',
            // 英文/混写常见词
            'button', 'btn', 'icon color', 'text color', 'background color'
        ],
        '历史遗留': [
            '历史', '遗留', '老', '旧', '一直', '长期', '存在', '之前', '以前', '早就',
            '很久', '持续', '反复', '多次'
        ]
    },

    // 优先级分析规则（根据设计体验问题模板）
    priorityRules: {
        'P0-紧急': [
            '崩溃', '闪退', '无法登录', '数据丢失', '安全漏洞', '支付', '交易',
            '核心功能', '主要流程', '影响所有用户', '快点', '尽快', '紧急', '严重'
        ],
        'P1-高': [
            '功能', '异常', '错误', 'bug', '失效', '不工作', '故障', '卡顿', '加载慢'
        ],
        'P2-中': [
            '界面问题', '操作不便', '功能异常', '显示错误', '部分用户', '非核心功能'
        ],
        'P3-低': [
            '界面优化', '体验改进', '细节调整', '建议', '优化建议', '小问题'
        ]
    },

    // 解决方案模板库（根据设计体验问题模板）
    solutionTemplates: {
        '设计需求优化': [
            '优化用户界面设计，提升视觉效果和用户体验',
            '改进交互设计，简化操作流程',
            '统一设计规范，保持界面风格一致性',
            '调整视觉元素，提升界面美观度'
        ],
        '交互功能bug': [
            '修复交互逻辑错误，确保功能正常运行',
            '完善异常处理机制，提升系统稳定性',
            '优化数据处理流程，确保数据准确性',
            '增强功能容错性，提升用户体验'
        ],
        '视觉还原度bug': [
            '调整视觉实现，确保与设计稿一致',
            '优化渲染效果，提升视觉质量',
            '建立设计还原度检查机制',
            '完善像素级对齐和尺寸控制'
        ],
        '历史遗留': [
            '制定历史问题处理计划，逐步优化',
            '重构相关模块，提升代码质量',
            '建立问题跟踪机制，避免问题积累',
            '系统性解决长期存在的设计问题'
        ]
    },

    // 影响分析模板（根据设计体验问题模板）
    impactAnalysis: {
        'P0-紧急': '严重影响用户体验，可能导致用户流失，需要立即处理',
        'P1-高': '影响主要业务流程，建议尽快处理以避免问题扩大',
        'P2-中': '影响部分用户体验，可以在后续版本中优化处理',
        'P3-低': '轻微影响用户体验，可以在后续版本中优化处理'
    },

    // 智能分析主函数
    async analyzeProblem(description, systemTypes, modules) {
        console.log('开始智能分析...');
        
        // 1. 问题类型预测
        const predictedType = this.predictProblemType(description);
        
        // 2. 优先级分析
        const priority = this.analyzePriority(description, predictedType);
        
        // 3. 解决方案推荐
        const recommendedSolutions = this.recommendSolutions(predictedType, description);
        
        // 4. 影响分析
        const impact = this.analyzeImpact(priority, description);
        
        // 5. 预估时间
        const estimatedTime = this.estimateTime(priority, predictedType);
        
        // 6. 相关模块分析
        const relatedModules = this.analyzeRelatedModules(description, modules);
        
        // 7. 历史相似问题分析
        const similarIssues = this.findSimilarIssues(description);
        
        // 8. 智能推荐处理方式
        const processingMethod = this.recommendProcessingMethod(description, predictedType, priority);
        
        // 9. 计算最终置信度
        const analysisConfidence = this.calculateConfidence(description, predictedType, priority);
        
        return {
            predictedType,
            priority,
            recommendedSolutions,
            impact,
            estimatedTime,
            relatedModules,
            similarIssues,
            processingMethod,
            analysisConfidence
        };
    },

    // 问题类型预测
    predictProblemType(description) {
        const text = description.toLowerCase();
        // 强优先规则：视觉/颜色措辞直接判为视觉还原度bug
        const strongVisualPatterns = [
            '颜色', '色值', '配色', '品牌色', '主色', '辅色', '高亮色',
            '黄色', '橙色', '橘色', '蓝色', '绿色', '红色',
            '对齐', '不一致', '还原', '还原度', '视觉', '像素', '间距', '阴影', '圆角',
            '字体', '字号', '字重', '粗细', 'px', '大小', '行高', '字间距', 'letter-spacing', 'line-height',
            'button 颜色', 'btn 颜色', 'icon 颜色', 'text color', 'background color', '浅', '深',
            '样式', '文案', '展示', '不全', '截断', '溢出', '布局', '排版', '边距',
            '选中', '状态', 'hover', 'active', 'focus', '外观', '界面', 'UI', '设计稿',
            '透明度', '渐变', '图标', '图片', '图片显示'
        ];
        if (strongVisualPatterns.some(k => text.includes(k))) {
            return '视觉还原度bug';
        }

        let maxScore = 0;
        let predictedType = '设计需求优化';
        for (const [type, patterns] of Object.entries(this.problemTypePatterns)) {
            let score = 0;
            patterns.forEach(pattern => {
                if (text.includes(pattern)) {
                    score += 1;
                }
            });
            if (score > maxScore) {
                maxScore = score;
                predictedType = type;
            }
        }
        return predictedType;
    },

    // 优先级分析
    analyzePriority(description, problemType) {
        const text = description.toLowerCase();
        
        for (const [priority, keywords] of Object.entries(this.priorityRules)) {
            for (const keyword of keywords) {
                if (text.includes(keyword)) {
                    return priority;
                }
            }
        }
        
        // 根据问题类型默认优先级（根据设计体验问题模板）
        const defaultPriority = {
            '交互功能bug': 'P1-高',
            '视觉还原度bug': 'P2-中',
            '设计需求优化': 'P2-中',
            '历史遗留': 'P3-低'
        };
        
        return defaultPriority[problemType] || 'P2-中';
    },

    // 解决方案推荐 - 增强个性化分析
    recommendSolutions(problemType, description) {
        const text = description.toLowerCase();
        
        // 基于具体问题场景生成针对性解决方案
        const personalizedSolutions = this.generatePersonalizedSolutions(description, problemType);
        if (personalizedSolutions.length > 0) {
            return personalizedSolutions;
        }
        
        // 降级到模板匹配
        const templates = this.solutionTemplates[problemType] || this.solutionTemplates['设计需求优化'];
        const relevantSolutions = templates.filter(solution => {
            const solutionKeywords = solution.split('，')[0].toLowerCase();
            return text.includes(solutionKeywords.split(' ')[0]) || Math.random() > 0.5;
        });
        
        return relevantSolutions.length > 0 ? relevantSolutions : templates.slice(0, 2);
    },

    // 生成个性化解决方案
    generatePersonalizedSolutions(description, problemType) {
        const text = description.toLowerCase();
        const solutions = [];
        
        // 针对具体问题场景的解决方案
        if (text.includes('导航') && text.includes('菜单')) {
            if (text.includes('样式') || text.includes('选中')) {
                solutions.push('优化导航菜单选中状态样式，确保视觉层次清晰，提升用户识别度');
                solutions.push('调整导航文案长度限制，避免文案截断问题，保证信息完整性');
            }
        }
        
        if (text.includes('字体') || text.includes('字号')) {
            solutions.push('根据设计规范调整字体大小和字重，确保文字清晰可读');
            solutions.push('优化文字排版和行高，提升阅读体验和视觉舒适度');
        }
        
        if (text.includes('颜色') || text.includes('色值')) {
            solutions.push('按设计稿规范调整颜色值，确保品牌色彩一致性');
            solutions.push('优化颜色对比度，提升可访问性和视觉层次');
        }
        
        if (text.includes('按钮') || text.includes('点击')) {
            solutions.push('检查并修复按钮点击事件绑定与触发逻辑，避免事件被遮挡或冒泡阻断');
            solutions.push('为关键操作提供交互反馈（禁用按钮/Loading/Toast），并添加异常兜底与重试');
        }
        
        if (text.includes('加载') || text.includes('慢')) {
            solutions.push('优化页面加载性能，减少用户等待时间');
            solutions.push('添加加载状态提示，改善用户等待体验');
        }
        
        if (text.includes('弹窗') || text.includes('对话框')) {
            solutions.push('优化弹窗交互逻辑，确保操作流程顺畅');
            solutions.push('调整弹窗尺寸和位置，避免遮挡重要信息');
        }
        
        // 根据问题类型补充通用解决方案
        if (solutions.length === 0) {
            const typeSpecificSolutions = {
                '视觉还原度bug': [
                    '按设计稿规范进行视觉还原，确保实现效果与设计一致',
                    '建立设计走查机制，及时发现和修复视觉偏差'
                ],
                '交互功能bug': [
                    '修复交互逻辑错误，确保功能正常运行',
                    '优化操作流程，提升用户操作效率'
                ],
                '设计需求优化': [
                    '基于用户原声优化设计方案，提升用户体验',
                    '建立用户原声收集机制，持续改进产品设计'
                ]
            };
            
            solutions.push(...(typeSpecificSolutions[problemType] || []));
        }
        
        return solutions.slice(0, 3); // 最多返回3个解决方案
    },

    // 影响分析 - 增强个性化分析
    analyzeImpact(priority, description) {
        const baseImpact = this.impactAnalysis[priority];
        const text = description.toLowerCase();
        
        // 基于具体问题场景的个性化影响分析
        let specificImpact = '';
        
        if (text.includes('导航') && text.includes('菜单')) {
            specificImpact = '影响用户导航体验，可能导致用户迷失方向，降低操作效率';
        } else if (text.includes('字体') || text.includes('字号')) {
            specificImpact = '影响文字可读性，可能导致用户阅读困难，影响信息获取效率';
        } else if (text.includes('颜色') || text.includes('色值')) {
            specificImpact = '影响视觉识别度，可能导致用户无法快速识别重要信息';
        } else if (text.includes('按钮') || text.includes('点击')) {
            specificImpact = '影响用户操作体验，可能导致误操作或操作失败';
        } else if (text.includes('加载') || text.includes('慢')) {
            specificImpact = '影响用户等待体验，可能导致用户流失和满意度下降';
        } else if (text.includes('弹窗') || text.includes('对话框')) {
            specificImpact = '影响用户操作流程，可能导致流程中断或操作困惑';
        } else if (text.includes('样式') || text.includes('外观')) {
            specificImpact = '影响视觉体验一致性，可能导致用户对产品专业度产生质疑';
        } else if (text.includes('功能') || text.includes('异常')) {
            specificImpact = '影响核心功能使用，可能导致业务流程受阻';
        }
        
        // 根据影响范围调整
        let scopeImpact = '';
        if (text.includes('所有用户') || text.includes('全部')) {
            scopeImpact = '，影响范围广泛';
        } else if (text.includes('部分用户') || text.includes('少数')) {
            scopeImpact = '，影响范围有限';
        } else if (text.includes('新用户') || text.includes('首次')) {
            scopeImpact = '，主要影响新用户体验';
        } else if (text.includes('老用户') || text.includes('熟练')) {
            scopeImpact = '，主要影响熟练用户操作效率';
        }
        
        return specificImpact || baseImpact + scopeImpact;
    },

    // 预估时间（根据设计体验问题模板）
    estimateTime(priority, problemType) {
        const timeMap = {
            'P0-紧急': {
                '交互功能bug': '1-2个工作日',
                '视觉还原度bug': '1-2个工作日',
                '设计需求优化': '1-2个工作日',
                '历史遗留': '2-3个工作日'
            },
            'P1-高': {
                '交互功能bug': '2-3个工作日',
                '视觉还原度bug': '2-3个工作日',
                '设计需求优化': '2-3个工作日',
                '历史遗留': '3-5个工作日'
            },
            'P2-中': {
                '交互功能bug': '3-5个工作日',
                '视觉还原度bug': '3-5个工作日',
                '设计需求优化': '3-5个工作日',
                '历史遗留': '5-7个工作日'
            },
            'P3-低': {
                '交互功能bug': '5-7个工作日',
                '视觉还原度bug': '5-7个工作日',
                '设计需求优化': '5-7个工作日',
                '历史遗留': '7-10个工作日'
            }
        };
        
        return timeMap[priority]?.[problemType] || '3-5个工作日';
    },

    // 相关模块分析
    analyzeRelatedModules(description, selectedModules) {
        const text = description.toLowerCase();
        const moduleKeywords = {
            '管理端': ['管理', '后台', 'admin', '配置', '设置'],
            '门店端': ['门店', '收银', 'pos', '销售', '库存'],
            '移动端': ['手机', 'app', '移动', '客户端', '扫码']
        };
        
        const relatedModules = [...selectedModules];
        
        // 根据描述内容推荐相关模块
        for (const [module, keywords] of Object.entries(moduleKeywords)) {
            if (!relatedModules.includes(module)) {
                for (const keyword of keywords) {
                    if (text.includes(keyword)) {
                        relatedModules.push(module);
                        break;
                    }
                }
            }
        }
        
        return relatedModules;
    },

    // 查找相似问题
    findSimilarIssues(description) {
        const history = JSON.parse(localStorage.getItem('feedbackBridge_history') || '[]');
        const text = description.toLowerCase();
        
        // 使用更精准的相似度算法
        const similarIssues = history.map(issue => {
            const issueText = issue.description?.toLowerCase() || '';
            const similarity = this.calculateSimilarity(text, issueText);
            return { ...issue, similarity };
        })
        .filter(issue => issue.similarity > 0.3) // 相似度阈值
        .sort((a, b) => b.similarity - a.similarity) // 按相似度排序
        .slice(0, 3);
        
        return similarIssues.map(issue => ({
            title: issue.standardFormat?.title || '历史问题',
            description: issue.description?.substring(0, 100) + '...',
            solution: issue.standardFormat?.expectedResult || '已解决',
            similarity: Math.round(issue.similarity * 100) + '%'
        }));
    },

    // 计算文本相似度
    calculateSimilarity(text1, text2) {
        if (!text1 || !text2) return 0;
        
        // 分词
        const words1 = this.tokenize(text1);
        const words2 = this.tokenize(text2);
        
        // 计算Jaccard相似度
        const set1 = new Set(words1);
        const set2 = new Set(words2);
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        
        return intersection.size / union.size;
    },

    // 文本分词
    tokenize(text) {
        // 简单的中文分词，基于常见词汇
        const commonWords = [
            '登录', '支付', '订单', '商品', '用户', '界面', '操作', '功能',
            '性能', '速度', '安全', '数据', '文件', '上传', '下载', '卡顿',
            '慢', '加载', '响应', '错误', '异常', 'bug', '故障', '崩溃',
            '闪退', '白屏', '显示', '保存', '提交', '管理', '后台', '配置',
            '设置', '门店', '收银', 'pos', '销售', '库存', '手机', 'app',
            '移动', '客户端', '扫码', '权限', '密码', '验证', '加密', '泄露'
        ];
        
        const words = [];
        
        // 提取常见词汇
        commonWords.forEach(word => {
            if (text.includes(word)) {
                words.push(word);
            }
        });
        
        // 提取其他有意义的词汇（长度大于1的连续字符）
        const otherWords = text.match(/[\u4e00-\u9fa5]{2,}/g) || [];
        words.push(...otherWords);
        
        return words;
    },

    // 智能推荐处理方式
    recommendProcessingMethod(description, problemType, priority) {
        const text = description.toLowerCase();
        
        // 根据问题类型和优先级推荐处理方式（根据设计体验问题模板）
        const recommendations = {
            'P0-紧急': {
                '交互功能bug': {
                    method: '体验优化',
                    assignee: '开发团队',
                    timeline: '1-2个工作日',
                    escalation: '需要立即上报'
                },
                '视觉还原度bug': {
                    method: '体验优化',
                    assignee: '开发团队',
                    timeline: '1-2个工作日',
                    escalation: '优先处理'
                },
                '设计需求优化': {
                    method: '需求优化',
                    assignee: '产品团队',
                    timeline: '1-2个工作日',
                    escalation: '快速响应'
                },
                '历史遗留': {
                    method: '体验优化',
                    assignee: '产品团队',
                    timeline: '2-3个工作日',
                    escalation: '监控处理'
                }
            },
            'P1-高': {
                '交互功能bug': {
                    method: '体验优化',
                    assignee: '开发团队',
                    timeline: '2-3个工作日',
                    escalation: '正常处理'
                },
                '视觉还原度bug': {
                    method: '体验优化',
                    assignee: '开发团队',
                    timeline: '2-3个工作日',
                    escalation: '按计划处理'
                },
                '设计需求优化': {
                    method: '需求优化',
                    assignee: '产品团队',
                    timeline: '2-3个工作日',
                    escalation: '计划处理'
                },
                '历史遗留': {
                    method: '体验优化',
                    assignee: '产品团队',
                    timeline: '3-5个工作日',
                    escalation: '优化处理'
                }
            },
            'P2-中': {
                '交互功能bug': {
                    method: '体验优化',
                    assignee: '开发团队',
                    timeline: '3-5个工作日',
                    escalation: '下个版本'
                },
                '视觉还原度bug': {
                    method: '体验优化',
                    assignee: '开发团队',
                    timeline: '3-5个工作日',
                    escalation: '下个版本'
                },
                '设计需求优化': {
                    method: '需求优化',
                    assignee: '产品团队',
                    timeline: '3-5个工作日',
                    escalation: '下个版本'
                },
                '历史遗留': {
                    method: '体验优化',
                    assignee: '产品团队',
                    timeline: '5-7个工作日',
                    escalation: '下个版本'
                }
            },
            'P3-低': {
                '交互功能bug': {
                    method: '体验优化',
                    assignee: '开发团队',
                    timeline: '5-7个工作日',
                    escalation: '下个版本'
                },
                '视觉还原度bug': {
                    method: '体验优化',
                    assignee: '开发团队',
                    timeline: '5-7个工作日',
                    escalation: '下个版本'
                },
                '设计需求优化': {
                    method: '需求优化',
                    assignee: '产品团队',
                    timeline: '5-7个工作日',
                    escalation: '下个版本'
                },
                '历史遗留': {
                    method: '体验优化',
                    assignee: '产品团队',
                    timeline: '7-10个工作日',
                    escalation: '下个版本'
                }
            }
        };
        
        return recommendations[priority]?.[problemType] || recommendations['P2-中']['设计需求优化'];
    },

    // 计算分析置信度
    calculateConfidence(description, predictedType, priority) {
        const text = description.toLowerCase();
        let confidence = 0.5; // 基础置信度
        
        // 根据描述长度调整置信度
        if (description.length > 50) confidence += 0.1;
        if (description.length > 100) confidence += 0.1;
        
        // 根据关键词匹配调整置信度
        const allKeywords = Object.values(this.problemTypePatterns).flat();
        const matchedKeywords = allKeywords.filter(keyword => text.includes(keyword));
        confidence += matchedKeywords.length * 0.05;
        
        // 根据历史成功率调整置信度
        const successRate = this.getSuccessRate(predictedType, priority);
        confidence = (confidence + successRate) / 2;
        
        return Math.min(confidence, 0.95);
    }
};

// DOM 元素
const elements = {
    issueDescription: document.getElementById('issueDescription'),
    fileUploadArea: document.getElementById('fileUploadArea'),
    fileInput: document.getElementById('fileInput'),
    uploadedFiles: document.getElementById('uploadedFiles'),
    systemTypeSelect: document.getElementById('systemTypeSelect'),
    moduleSelect: document.getElementById('moduleSelect'),
    convertBtn: document.getElementById('convertBtn'),
    previewContent: document.getElementById('previewContent'),
    previewActions: document.getElementById('previewActions'),
    loadingModal: document.getElementById('loadingModal'),
    historyBtn: document.getElementById('historyBtn'),
    draftsBtn: document.getElementById('draftsBtn'),
    newSessionBtn: document.getElementById('newSessionBtn'),
    inputSection: document.querySelector('.input-section'),
};

// 控制输入区域禁用状态
function setInputAreaDisabled(disabled) {
    if (disabled) {
        elements.inputSection.classList.add('disabled');
        // 禁用所有输入元素
        elements.issueDescription.disabled = true;
        elements.fileInput.disabled = true;
        elements.newSessionBtn.disabled = true;
        
        // 禁用所有复选框
        const checkboxes = elements.inputSection.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.disabled = true;
        });
    } else {
        elements.inputSection.classList.remove('disabled');
        // 启用所有输入元素
        elements.issueDescription.disabled = false;
        elements.fileInput.disabled = false;
        elements.newSessionBtn.disabled = false;
        
        // 启用所有复选框
        const checkboxes = elements.inputSection.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.disabled = false;
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化智能分析引擎
    SmartAnalysisEngine.initLearningCache();
    
    initializeEventListeners();
    loadDraftData();
    
    // 用户原声卡片的显示状态将由switchInputType函数控制
});

// 初始化事件监听器
function initializeEventListeners() {
    // 文件上传相关事件 - 检查元素是否存在
    if (elements.fileUploadArea && elements.fileInput) {
        // 点击上传区域时，触发文件选择并获得焦点
        elements.fileUploadArea.addEventListener('click', (e) => {
            // 如果点击的不是已上传的图片，则触发文件选择
            if (!e.target.closest('.uploaded-image-item') && !e.target.closest('.remove-image-btn')) {
                console.log('📍 文件上传区域被点击，获得焦点并触发文件选择');
                elements.fileUploadArea.focus();
                elements.fileInput.click();
            }
        });
        
        elements.fileInput.addEventListener('change', handleFileSelect);
        
        // 拖拽上传
        elements.fileUploadArea.addEventListener('dragover', handleDragOver);
        elements.fileUploadArea.addEventListener('dragleave', handleDragLeave);
        elements.fileUploadArea.addEventListener('drop', handleDrop);
        
        // 为文件上传区域添加粘贴事件监听器
        elements.fileUploadArea.addEventListener('paste', handlePaste);
    }
    
    // 粘贴图片 - 全局监听
    document.addEventListener('paste', handlePaste);
    
    // 转化按钮 - 检查元素是否存在
    if (elements.convertBtn) {
        elements.convertBtn.addEventListener('click', handleConvert);
    }
    
    // 导航按钮 - 检查元素是否存在
    if (elements.historyBtn) {
        elements.historyBtn.addEventListener('click', showHistory);
    }
    if (elements.draftsBtn) {
        elements.draftsBtn.addEventListener('click', showDrafts);
    }
    
    // 新会话按钮 - 检查元素是否存在
    if (elements.newSessionBtn) {
        elements.newSessionBtn.addEventListener('click', startNewSession);
    }
    
    // Tab切换事件已通过HTML中的onclick处理
    
    // 初始化用户原声清洗模板（避免重复初始化）
    if (!OriginalSoundTemplate.initialized) {
        OriginalSoundTemplate.init();
    }
    
    // 自动保存草稿和检查按钮状态 - 检查元素是否存在
    if (elements.issueDescription) {
        elements.issueDescription.addEventListener('input', function() {
            debounce(saveDraft, 1000)();
            checkConvertButtonState();
        });
    }
    
    // 初始化按钮状态
    checkConvertButtonState();
    
    // 为系统类型复选框添加事件监听器
    const systemTypeCheckboxes = elements.systemTypeSelect.querySelectorAll('input[type="checkbox"]');
    systemTypeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', debounce(saveDraft, 1000));
    });
    
    // 为模块复选框添加事件监听器
    const moduleCheckboxes = elements.moduleSelect.querySelectorAll('input[type="checkbox"]');
    moduleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', debounce(saveDraft, 1000));
    });
    
}

// 文件选择处理
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    processFiles(files);
}

// 拖拽处理
function handleDragOver(event) {
    event.preventDefault();
    elements.fileUploadArea.classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    elements.fileUploadArea.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    elements.fileUploadArea.classList.remove('dragover');
    
    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
}

// 粘贴处理
function handlePaste(event) {
    console.log('🔍 粘贴事件触发:', event);
    console.log('🔍 剪贴板数据:', event.clipboardData);
    console.log('🔍 剪贴板项目数量:', event.clipboardData.items.length);
    
    const items = event.clipboardData.items;
    const files = [];
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log(`🔍 剪贴板项目 ${i}:`, {
            kind: item.kind,
            type: item.type,
            size: item.size
        });
        
        if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            if (file) {
                console.log('✅ 找到图片文件:', {
                    name: file.name,
                    type: file.type,
                    size: file.size
                });
                files.push(file);
            }
        }
    }
    
    console.log('🔍 找到的文件数量:', files.length);
    
    if (files.length > 0) {
        event.preventDefault();
        console.log('🚀 开始处理文件...');
        processFiles(files);
    } else {
        console.log('⚠️ 没有找到图片文件');
    }
}

// 处理文件
function processFiles(files) {
    console.log('📁 开始处理文件，文件数量:', files.length);
    
    files.forEach((file, index) => {
        console.log(`📄 处理文件 ${index + 1}:`, {
            name: file.name,
            type: file.type,
            size: file.size
        });
        
        if (validateFile(file)) {
            console.log('✅ 文件验证通过，添加到上传列表');
            uploadedFiles.push(file);
            displayUploadedFile(file);
        } else {
            console.log('❌ 文件验证失败');
        }
    });
    
    // 清空input，允许重复选择同一文件
    elements.fileInput.value = '';
}

// 验证文件
function validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
    
    if (file.size > maxSize) {
        showNotification('文件大小不能超过10MB', 'error');
        return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
        showNotification('只支持图片和视频文件', 'error');
        return false;
    }
    
    return true;
}

// 显示已上传文件
function displayUploadedFile(file) {
    // 检查是否为图片文件
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // 创建图片容器
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-item-container';
            imageContainer.dataset.fileName = file.name;
            
            // 创建图片元素
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = file.name;
            img.className = 'uploaded-image';
            
            // 创建删除按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'image-delete-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.onclick = function() {
                removeUploadedImage(file.name);
            };
            
            // 组装元素
            imageContainer.appendChild(img);
            imageContainer.appendChild(deleteBtn);
            
            // 添加到图片容器
            const container = document.getElementById('uploadedImagesContainer');
            if (container) {
                container.appendChild(imageContainer);
            }
        };
        reader.readAsDataURL(file);
    } else {
        // 非图片文件显示通知
        showNotification('只支持图片文件', 'error');
    }
}

// 删除上传的图片
function removeUploadedImage(fileName) {
    // 从数组中移除文件
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    
    // 从DOM中移除图片容器
    const container = document.getElementById('uploadedImagesContainer');
    if (container) {
        const imageContainer = container.querySelector(`[data-file-name="${fileName}"]`);
        if (imageContainer) {
            imageContainer.remove();
        }
    }
    
    showNotification('图片已删除', 'success');
}

// 获取文件图标
function getFileIcon(type) {
    if (type.startsWith('image/')) {
        return 'fa-image';
    } else if (type.startsWith('video/')) {
        return 'fa-video';
    } else {
        return 'fa-file';
    }
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 移除文件
function removeFile(fileName) {
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    
    const fileItem = elements.uploadedFiles.querySelector(`[data-file-name="${fileName}"]`);
    if (fileItem) {
        fileItem.remove();
    }
}


// 防抖处理
let convertTimeout = null;

// 转化处理
async function handleConvert() {
    if (isConverting) return;
    
    // 清除之前的防抖定时器
    if (convertTimeout) {
        clearTimeout(convertTimeout);
    }
    
    // 设置防抖延迟
    convertTimeout = setTimeout(async () => {
        await performConvert();
    }, 300); // 300ms防抖
}

// 实际执行转化
async function performConvert() {
    
    const issueDescription = elements.issueDescription.value.trim();
    const selectedSystemTypes = elements.systemTypeSelect.querySelectorAll('input[type="checkbox"]:checked');
    const systemTypes = Array.from(selectedSystemTypes).map(checkbox => checkbox.value);
    const selectedModules = elements.moduleSelect.querySelectorAll('input[type="checkbox"]:checked');
    const modules = Array.from(selectedModules).map(checkbox => checkbox.value);
    
    // 验证输入
    if (!issueDescription) {
        showNotification('请填写体验问题描述', 'error');
        elements.issueDescription.focus();
        return;
    }
    
    if (systemTypes.length === 0) {
        showNotification('请选择所属地区', 'error');
        return;
    }
    
    if (modules.length === 0) {
        showNotification('请选择归属终端/模块', 'error');
        return;
    }
    
    isConverting = true;
    elements.convertBtn.disabled = true;
    elements.convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 转化中...';
    
    // 禁用整个输入区域
    setInputAreaDisabled(true);
    
    // 在预览区域显示加载状态
    showPreviewLoading();
    
    try {
        // 模拟API调用
        const result = await convertToStandardFormat({
            description: issueDescription,
            systemTypes: systemTypes,
            modules: modules,
            files: uploadedFiles
        });
        
        // 验证结果
        if (!result || !result.standardFormat) {
            throw new Error('转化结果格式错误');
        }
        
        // 标记转化完成
        window.conversionCompleted = true;
        
        // 清除进度动画
        if (window.progressInterval) {
            clearInterval(window.progressInterval);
        }
        
        displayPreviewResult(result);
        showNotification('转化成功！', 'success');
        
        // 保存到历史记录
        saveToHistory(result);
        
    } catch (error) {
        console.error('转化失败:', error);
        showNotification('转化失败，请重试', 'error');
        
        // 显示错误状态
        elements.previewContent.innerHTML = `
            <div class="preview-error">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="error-text">转化过程中出现错误</div>
                <div class="error-subtitle">请检查输入内容后重试</div>
            </div>
        `;
    } finally {
        isConverting = false;
        elements.convertBtn.disabled = false;
        elements.convertBtn.innerHTML = '<i class="fas fa-magic"></i> 一键转化';
        
        // 重新启用输入区域
        setInputAreaDisabled(false);
    }
}

// 智能转化API
async function convertToStandardFormat(data) {
    
    // 先尝试调用后端 LLM 解析接口
    try {
        updateAnalysisProgress('正在调用智能解析服务...', 15);
        const formData = new FormData();
        formData.append('description', data.description);
        formData.append('system_types', JSON.stringify(data.systemTypes));
        formData.append('modules', JSON.stringify(data.modules));
        formData.append('template_id', 'default');
        formData.append('user_id', getCurrentUserId());
        
        // 设置30秒超时，给LLM足够时间
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const resp = await fetch('http://localhost:8000/api/analysis/parse-feedback', {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        if (resp.ok) {
            const result = await resp.json();
            console.log('API响应:', result); // 调试信息
            if (result && result.success && result.data) {
                const d = result.data;
                console.log('API数据:', d); // 调试信息
                const mapped = {
                    id: generateId(),
                    timestamp: new Date().toISOString(),
                    title: d.title,
                    description: d.problem_description,
                    systemTypes: (d.region || '').split(/[,、，]/).filter(Boolean),
                    modules: (d.terminal || '').split(/[,、，]/).filter(Boolean),
                    files: data.files || [],
                    analysis: result.analysis || {},
                    // 直接采用模板字段
                    standardFormat: {
                        title: d.title,
                        region: d.region,
                        terminal: d.terminal,
                        issue_type: d.issue_type,
                        resolution_method: d.resolution_method,
                        priority: d.priority,
                        problem_description: d.problem_description,
                        solution: d.solution,
                        status: d.status,
                        target_version: d.target_version,
                        screenshots: d.screenshots,
                        attachments: d.attachments
                    }
                };
                // 基于描述做视觉还原度识别的结果纠偏（后端偶发给到泛化类型时）
                try {
                    const textForType = `${d.problem_description || ''}\n${d.title || ''}`;
                    if (detectVisualMismatch(textForType)) {
                        mapped.standardFormat.issue_type = '视觉还原度bug';
                        mapped.standardFormat.resolution_method = '体验优化';
                        if (mapped.analysis) {
                            mapped.analysis.predictedType = '视觉还原度bug';
                            if (!mapped.analysis.processingMethod) mapped.analysis.processingMethod = {};
                            mapped.analysis.processingMethod.method = '体验优化';
                        }
                    }
                } catch (_) {}
                // 标题纠偏：若LLM标题冗长或带分条，按问题句提炼
                try {
                    const regionText = mapped.systemTypes.length > 1 ? mapped.systemTypes.join('+') : (mapped.systemTypes[0] || '');
                    const moduleText = mapped.modules.length > 1 ? mapped.modules.join('+') : (mapped.modules[0] || '');
                    const base = extractTitleContent(d.problem_description || data.description || '');
                    if (base) {
                        mapped.title = `【${regionText}：${moduleText}】${base}`;
                        mapped.standardFormat.title = mapped.title;
                    }
                } catch (_) {}
                // 完全信任后端（LLM）抽取结果；仅在字段缺失时做最小兜底，不二次改写
                try {
                    if (!mapped.standardFormat.problem_description || !mapped.standardFormat.solution) {
                        const { problemText, solutionText } = splitProblemAndSolution(data.description);
                        const enriched = enrichProblemAndSolution(problemText, solutionText, data.description);
                        if (!mapped.standardFormat.problem_description && problemText) {
                            mapped.standardFormat.problem_description = enriched.problem || problemText;
                        }
                        if (!mapped.standardFormat.solution && solutionText) {
                            mapped.standardFormat.solution = enriched.solution || solutionText;
                        }
                    }
                    // 若后端未返回solution且从原文也未拆出，则基于分析结果生成动作型方案
                    if (!mapped.standardFormat.solution || /请详细描述问题现象和期望的解决方案|待分析/.test(mapped.standardFormat.solution)) {
                        const rec = (mapped.analysis && mapped.analysis.recommendedSolutions) || [];
                        mapped.standardFormat.solution = generateSmartSolution(
                            data.description,
                            rec
                        );
                    }
                    // 若方案看起来仍是“问题列表”，前端做最终一次动作化改写（与后端策略一致）
                    if (mapped.standardFormat.solution && looksLikeProblemList(mapped.standardFormat.solution)) {
                        mapped.standardFormat.solution = rewriteProblemListToActions(mapped.standardFormat.solution);
                    }
                } catch (e) {
                    console.warn('最小兜底失败，保留后端结果：', e);
                }
                updateAnalysisProgress('转化完成！', 100);
                await new Promise(resolve => setTimeout(resolve, 200));
                return mapped;
            }
        }
    } catch (err) {
        // 忽略错误，进入本地回退逻辑
        console.warn('调用后端解析失败，使用本地规则回退:', err);
        console.log('错误详情:', err.message);
        console.log('错误类型:', err.name);
        console.log('错误堆栈:', err.stack);
    }

    // 回退到本地规则
    updateAnalysisProgress('正在分析问题类型...', 20);
    await new Promise(resolve => setTimeout(resolve, 300));

    updateAnalysisProgress('正在预测问题类型和优先级...', 40);
    const analysis = await SmartAnalysisEngine.analyzeProblem(
        data.description,
        data.systemTypes,
        data.modules
    );

    updateAnalysisProgress('正在生成解决方案...', 60);
    await new Promise(resolve => setTimeout(resolve, 300));

    const enhancedContent = await enhanceContent(data, analysis);

    updateAnalysisProgress('正在生成标准化文档...', 80);
    await new Promise(resolve => setTimeout(resolve, 300));

    const regionNames = data.systemTypes.join('、');
    const moduleNames = data.modules.map(module => getModuleName(module)).join('、');

    // 生成与模板一致的字段
    // 从用户原始描述中尽量拆分“问题/解决方案”
    const { problemText, solutionText } = splitProblemAndSolution(data.description);
    const enriched = enrichProblemAndSolution(problemText, solutionText, data.description);

    const fallbackStandard = {
        title: enhancedContent.title,
        region: regionNames,
        terminal: moduleNames,
        issue_type: analysis.predictedType,
        resolution_method: (analysis.processingMethod && analysis.processingMethod.method) || '体验优化',
        priority: analysis.priority || 'P2-中',
        problem_description: enriched.problem,
        solution: enriched.solution || enhancedContent.solution,
        status: '待确认(未提给研发)',
        target_version: '未定',
        screenshots: '',
        attachments: ''
    };

    const result = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        title: enhancedContent.title,
        description: data.description,
        systemTypes: data.systemTypes,
        modules: data.modules,
        files: data.files,
        analysis: analysis,
        standardFormat: fallbackStandard
    };

    updateAnalysisProgress('转化完成！', 100);
    await new Promise(resolve => setTimeout(resolve, 200));
    return result;
}

// 内容增强函数
async function enhanceContent(data, analysis) {
    const regionNames = data.systemTypes.join('、');
    const moduleNames = data.modules.map(module => getModuleName(module)).join('、');
    
    // 智能生成标题
    const title = generateSmartTitle(data.description, analysis.predictedType, regionNames, moduleNames);
    
    // 智能生成背景描述
    const background = generateSmartBackground(data.description, analysis.predictedType, regionNames, moduleNames);
    
    // 智能生成解决方案
    const solution = generateSmartSolution(data.description, analysis.recommendedSolutions);
    
    // 智能生成验收标准
    const acceptanceCriteria = generateSmartAcceptanceCriteria(analysis.predictedType, analysis.priority);
    
    return {
        title,
        background,
        solution,
        acceptanceCriteria
    };
}

// 智能生成标题
function generateSmartTitle(description, problemType, regionNames, moduleNames) {
    // 特例：识别“X组件…希望…与…样式对齐/一致” → 标题直接输出“X组件样式有误”
    const wishInfo = findAlignWishInfo(description);
    if (wishInfo && wishInfo.component) {
        const regionText = Array.isArray(regionNames) ? (regionNames.length > 1 ? regionNames.join('+') : regionNames[0]) : regionNames;
        const moduleText = Array.isArray(moduleNames) ? (moduleNames.length > 1 ? moduleNames.join('+') : moduleNames[0]) : moduleNames;
        const titleContent = `${wishInfo.component}样式有误`;
        return `【${regionText}：${moduleText}】${titleContent}`;
    }

    // 特例：描述中明确出现“与设计图/设计稿不一致”→ 标题概括为“场景 + 与设计图不一致”
    if (/设计[图稿].*不一致/.test(description)) {
        const regionText = Array.isArray(regionNames) ? (regionNames.length > 1 ? regionNames.join('+') : regionNames[0]) : regionNames;
        const moduleText = Array.isArray(moduleNames) ? (moduleNames.length > 1 ? moduleNames.join('+') : moduleNames[0]) : moduleNames;
        // 场景：优先取冒号前的短语，否则取第一句到逗号
        let scene = '';
        const m1 = description.match(/^(.*?)[：:]/);
        if (m1 && m1[1]) {
            scene = m1[1].trim();
        } else {
            const m2 = description.match(/^(.*?)[，,。\n]/);
            scene = (m2 && m2[1]) ? m2[1].trim() : description.slice(0, 20).trim();
        }
        // 去除 scene 内已包含的同义短语与多余标点
        scene = scene.replace(/与[^，。]*设计[图稿]?.*不一致/g, '').replace(/[，,。;；\s]+$/,'');
        const titleContent = `${scene ? scene + '与' : ''}设计图不一致`;
        return `【${regionText}：${moduleText}】${titleContent}`.replace(/(与设计图不一致){2,}/g,'与设计图不一致');
    }
    // 处理多选地区和终端
    let regionText, moduleText;
    
    if (Array.isArray(regionNames)) {
        regionText = regionNames.length > 1 ? regionNames.join('+') : regionNames[0];
    } else {
        regionText = regionNames;
    }
    
    if (Array.isArray(moduleNames)) {
        moduleText = moduleNames.length > 1 ? moduleNames.join('+') : moduleNames[0];
    } else {
        moduleText = moduleNames;
    }
    
    // 从描述中精准提取标题内容，保留关键信息
    let titleContent = extractTitleContent(description);
    
    // 保持原有格式，但精简标题内容
    return `【${regionText}：${moduleText}】${titleContent}`;
}

// 从描述中提取标题内容
function extractTitleContent(description) {
    // 优先匹配“X有问题，……(将/把/需要/统一/调整/改为/优化…)”结构，标题取逗号前的问题部分
    const problemThenAction = /^(.*?有问题)[，,。；;\s]+(将|把|需要|统一|调整|改为|改成|优化|修复|修改|更改)/;
    const pm = (description || '').match(problemThenAction);
    if (pm && pm[1]) {
        return optimizeTitleContent(pm[1].trim());
    }
    // 处理“以下/如下 … ：”列点结构，标题取冒号前场景句
    const preColonMatch = (description || '').match(/^(.+?)[:：]/);
    if (preColonMatch && preColonMatch[1]) {
        const pre = preColonMatch[1];
        // 场景对象（在“以下/如下”之前）
        const scenePart = (pre.split(/以下|如下/)[0] || pre).trim();
        // 抽取“与XXX不一致”的对比目标
        const target = ((pre.match(/与([^：:]+?)不一致/) || [])[1] || '设计图').trim();
        const sentence = `${scenePart}与${target}不一致`;
        return optimizeTitleContent(sentence);
    }
    // 智能提取核心问题描述，彻底移除解决方案相关描述
    let content = description;
    
    // 先移除解决方案相关的描述（更彻底的匹配，支持多行）
    // 匹配以"建议"开头的所有内容（包括换行符）
    content = content.replace(/建议[\s\S]*$/g, '').trim();
    // 匹配以数字开头的建议项（如"1. 优先找产品..."）
    content = content.replace(/\d+\.\s*[\s\S]*$/g, '').trim();
    // 匹配以"应该"、"需要"、"要"等开头的建议
    content = content.replace(/(应该|需要|要|可以|希望|期待)[\s\S]*$/g, '').trim();
    // 匹配以"如果"开头的条件建议
    content = content.replace(/如果[\s\S]*$/g, '').trim();
    // 匹配以"尝试"开头的建议
    content = content.replace(/尝试[\s\S]*$/g, '').trim();
    // 匹配"调整为"、"改为"等解决方案描述
    content = content.replace(/调整为[\s\S]*$/g, '').trim();
    content = content.replace(/改为[\s\S]*$/g, '').trim();
    
    // 精简标题内容，提取核心问题
    content = extractCoreProblem(content);
    
    return content || '问题描述';
}

// 识别“组件样式对齐”类愿望表达，抽取组件与愿望文本
function findAlignWishInfo(text) {
    if (!text) return null;
    const m = text.match(/([^。\n]*?组件)[^。\n]*?(?:希望|期望)[^。\n]*?(?:与|和)[^。\n]*?(?:样式)?(?:对齐|一致)/);
    if (m) {
        const component = (m[1] || '').trim();
        // 提取从“希望/期望”开始的愿望句
        const wish = (text.match(/((?:希望|期望)[^。\n]*)(?:。|$)/) || [])[1] || '';
        return { component, wish: wish.trim() };
    }
    return null;
}

// 提取核心问题，精简标题内容
function extractCoreProblem(content) {
    if (!content) return content;
    
    // 移除冗余的描述性词汇
    const redundantWords = [
        '截图中的', '图片中的', '界面中的', '页面中的',
        '发现', '看到', '注意到', '观察到',
        '存在', '出现', '发生', '产生',
        '导致', '造成', '引起', '使得',
        '用户', '使用者', '操作者'
    ];
    
    let coreContent = content;
    redundantWords.forEach(word => {
        coreContent = coreContent.replace(new RegExp(word, 'g'), '');
    });
    // 清理“与设计图不一致/请核对规范”等前导结论与编号样式，避免标题围绕结论或解决方案
    coreContent = coreContent
        .replace(/与[^，。]*设计[图稿]?.*不一致[:：]?/g, '')
        .replace(/与[^，。]*规范.*不一致[:：]?/g, '')
        .replace(/请核对规范[:：]?/g, '')
        .replace(/\n+/g, '，')
        .replace(/(^|[，,\s])([0-9一二三四五六七八九十]+)[、\.)]/g, '，')
        .replace(/[：:]/g, '，');

    // 优先保留前两个分句，避免只保留一个要点
    const primaryParts = coreContent
        .split(/同时|以及|并且|、|[，,。；;]+/)
        .filter(Boolean)
        .map(s => s.trim());

    // 识别“问题关键词”分句，优先用真正的问题点生成标题
    const issueRegex = /(未到边|到顶|重叠|遮挡|异常|错误|不对|不符|不一致|显示不全|显示|截断|布局|间距|对齐|底色|颜色|样式|边距|高度|宽度|位置|阴影|圆角)/;
    const contextCandidate = primaryParts[0] && !issueRegex.test(primaryParts[0]) ? primaryParts[0] : '';
    const issueParts = primaryParts.filter(p => issueRegex.test(p));
    if (issueParts.length > 0) {
        const issues = issueParts.slice(0, 2).join('、');
        coreContent = contextCandidate ? `${contextCandidate}：${issues}` : issues;
    } else {
        if (primaryParts.length >= 2) {
            coreContent = `${primaryParts[0]}、${primaryParts[1]}`;
        } else if (primaryParts.length === 1) {
            coreContent = primaryParts[0];
        }
    }

    // 提取关键问题词汇（仅在仍然过短或未命中时作为补充）
    const problemKeywords = [
        '字体大小不对', '字体大小', '字号不对', '字号',
        '颜色不对', '颜色', '色值不对', '色值',
        '样式不对', '样式', '外观不对', '外观',
        '布局不对', '布局', '排版不对', '排版',
        '对齐不对', '对齐', '间距不对', '间距',
        '选中状态', '选中', 'hover状态', 'hover',
        '按钮大小', '按钮', '图标大小', '图标',
        '文案显示', '文案', '文字显示', '文字',
        '导航菜单', '导航', '菜单',
        '弹窗', '对话框', '提示框',
        '加载', '响应', '速度'
    ];
    if (coreContent.length < 6) {
        for (const keyword of problemKeywords) {
            if (content.includes(keyword)) {
                const regex = new RegExp(`[^，。！？]*${keyword}[^，。！？]*`, 'g');
                const matches = content.match(regex);
                if (matches && matches.length > 0) {
                    let phrase = matches[0].trim();
                    phrase = phrase.replace(/^[，。！？\s]+/, '').replace(/[，。！？\s]+$/, '');
                    coreContent = phrase;
                    break;
                }
            }
        }
    }
    
    // 去除不恰当的设计规范措辞（本质为功能/交互问题时不应出现）
    coreContent = coreContent
        .replace(/与?设计稿?存在不一致[，。]*/g, '')
        .replace(/请核对规范[，。]*/g, '')
        .replace(/按设计稿|按规范|规范要求[，。]*/g, '');

    // 限制长度，确保标题简洁（不加省略号，保持一句话表述）
    if (coreContent.length > 30) {
        coreContent = coreContent.substring(0, 30);
    }
    
    return coreContent;
}

// 优化标题内容，确保语句通顺
function optimizeTitleContent(content) {
    if (!content) return content;
    
    // 智能优化常见表达，确保语句通顺（先应用优化规则，再移除冗余词汇）
    const optimizations = {
        // 尺寸问题优化
        '按钮的尺寸不对,太小了,高度应该是40px': '按钮尺寸过小，高度不够',
        '尺寸不对,太小了,高度应该是40px': '尺寸过小，高度不够',
        '按钮的尺寸不对,太小了,高度': '按钮尺寸过小，高度不够',
        '尺寸不对,太小了,高度': '尺寸过小，高度不够',
        '按钮的高度应该是40px': '按钮高度不符合规范',
        '高度应该是40px': '高度不符合规范',
        '按钮的高度': '按钮高度异常',
        '尺寸不对,太小了': '尺寸过小',
        '太小了,高度': '高度过小',
        '按钮的尺寸不对': '按钮尺寸不对',
        '按钮尺寸不对,太小了': '按钮尺寸过小',
        
        // 样式问题优化
        'Tab选中态的样式需加粗为bold': 'Tab选中态样式不够突出',
        '样式需加粗为bold': '样式不够突出',
        '样式需加粗': '样式不够突出',
        '需加粗为bold': '样式不够突出',
        
        // 显示问题优化
        '展示不全': '显示不全',
        '显示不全,截断': '显示不全',
        '文案显示不全': '文案显示不全',
        
        // 布局问题优化
        '布局不对': '布局异常',
        '间距不对': '间距异常',
        '对齐不对': '对齐异常',
        
        // 颜色问题优化
        '颜色不对': '颜色异常',
        '颜色不符': '颜色不匹配',
        
        // 通用优化
        '导致': '，',
        '放大后': '放大'
    };
    
    // 先应用优化规则
    Object.entries(optimizations).forEach(([pattern, replacement]) => {
        content = content.replace(new RegExp(pattern, 'g'), replacement);
    });
    
    // 然后移除常见的冗余词汇，但保留核心问题描述
    const redundantWords = ["应该", "需要", "要", "可以", "希望", "期待", "需"];
    redundantWords.forEach(word => {
        content = content.replace(new RegExp(word, 'g'), '');
    });
    
    // 清理多余的标点符号，但保留必要的逗号
    content = content.replace(/。$/, '').replace(/；$/, '').replace(/，$/, '').trim();
    
    // 清理多余的标点符号
    content = content
        .replace(/，+/g, '，')   // 合并多个逗号
        .replace(/^，/, '')      // 移除开头的逗号
        .replace(/，$/, '')      // 移除结尾的逗号
        .trim();
    
    // 如果内容太短，尝试补充
    if (content.length < 3) {
        content = "问题描述";
    }
    
    return content;
}

// 智能生成背景描述
function generateSmartBackground(description, problemType, regionNames, moduleNames) {
    const typeMap = {
        '设计需求优化': '设计体验问题',
        '交互功能bug': '交互功能问题',
        '视觉还原度bug': '视觉还原度问题',
        '历史遗留': '历史遗留问题'
    };
    
    const typeText = typeMap[problemType] || '设计体验问题';
    
    return `用户原声在${regionNames}地区的${moduleNames}使用过程中发现${typeText}，${getImpactDescription(problemType)}，需要及时处理解决。`;
}

// 智能生成解决方案 - 增强个性化分析
function generateSmartSolution(description, recommendedSolutions) {
    if (recommendedSolutions && recommendedSolutions.length > 0) {
        const first = (recommendedSolutions[0] || '').trim();
        // 忽略占位/无效建议
        if (first && !/请详细描述问题现象和期望的解决方案|请详细描述|待分析/.test(first)) {
            return first;
        }
    }
    
    // 根据描述内容生成基础解决方案
    const text = description.toLowerCase();
    // 1) 若是“分条问题”输入，优先按问题反推方案
    const fromProblems = buildSolutionsFromProblemList(description);
    if (fromProblems) {
        return normalizeSolutionPunctuation(fromProblems);
    }
    const { solutionText } = splitProblemAndSolution(description);
    
    // 如果提取到了解决方案文本，进行优化处理
    if (solutionText) {
        return normalizeSolutionPunctuation(optimizeSolutionText(
            solutionText
                .replace(/与?设计稿?存在不一致[，。]*/g, '')
                .replace(/请核对规范[，。]*/g, '')
                .replace(/按设计稿|按规范|规范要求[，。]*/g, '')
        ));
    }
    
    // 基于具体问题场景生成针对性解决方案
    const personalizedSolution = generatePersonalizedSolution(description);
    if (personalizedSolution) {
        return personalizedSolution;
    }
    
    // 根据问题类型生成对应的解决方案
    if (text.includes('慢') || text.includes('卡顿')) {
        return normalizeSolutionPunctuation('优化系统性能，提升响应速度，改善用户体验');
    } else if (text.includes('颜色') || text.includes('还原') || text.includes('对齐') || text.includes('样式') || text.includes('字体')) {
        return normalizeSolutionPunctuation('按设计稿还原视觉规范（色值、对齐、间距、圆角、阴影等），并进行设计走查');
    } else if (text.includes('界面') || text.includes('操作') || text.includes('菜单') || text.includes('导航')) {
        return normalizeSolutionPunctuation('优化用户界面设计，简化操作流程，提升易用性');
    } else if (text.includes('功能') || text.includes('无法') || text.includes('错误') || text.includes('异常')) {
        return normalizeSolutionPunctuation('修复功能逻辑错误，补充异常兜底，确保功能稳定运行');
    }
    return normalizeSolutionPunctuation('根据问题具体情况制定针对性解决方案');
}

// 生成个性化解决方案
function generatePersonalizedSolution(description) {
    const text = description.toLowerCase();
    
    // 针对具体问题场景的个性化解决方案
    if (text.includes('导航') && text.includes('菜单') && text.includes('选中')) {
        return '优化导航菜单选中状态样式，确保视觉层次清晰，提升用户识别度。调整导航文案长度限制，避免文案截断问题，保证信息完整性。';
    }
    
    if (text.includes('字体') && (text.includes('大小') || text.includes('字号'))) {
        return '根据设计规范调整字体大小和字重，确保文字清晰可读。优化文字排版和行高，提升阅读体验和视觉舒适度。';
    }
    
    if (text.includes('颜色') && (text.includes('不一致') || text.includes('还原'))) {
        return '按设计稿规范调整颜色值，确保品牌色彩一致性。优化颜色对比度，提升可访问性和视觉层次。';
    }
    
    if (text.includes('按钮') && (text.includes('点击') || text.includes('交互'))) {
        return '修复按钮事件绑定与触发逻辑，提供明确的交互反馈（禁用/Loading/Toast），并补充异常兜底与重试。';
    }
    
    if (text.includes('加载') && text.includes('慢')) {
        return '优化页面加载性能，减少用户等待时间。添加加载状态提示，改善用户等待体验。';
    }
    
    if (text.includes('弹窗') || text.includes('对话框')) {
        return '优化弹窗交互逻辑，确保操作流程顺畅。调整弹窗尺寸和位置，避免遮挡重要信息。';
    }
    
    if (text.includes('样式') && text.includes('不佳')) {
        return '优化样式与交互状态的一致性，修复异常样式或状态切换问题，并建立走查机制及时发现偏差。';
    }
    
    return null; // 没有匹配到具体场景，返回null让调用方使用默认逻辑
}

// 从“分条问题”反推方案（严格遵循你的期望表达）
function buildSolutionsFromProblemList(description) {
    if (!description) return '';
    let raw = String(description).trim();
    // 去掉开头的场景描述（直到中文/英文冒号）
    raw = raw.replace(/^[^\n:：]*[:：]\s*/,'');
    // 统一换行与分隔符
    raw = raw.replace(/\r?\n+/g,'\n');
    // 用更宽松的规则拆分 1/2/3…（支持（1.）、1.、1、等）
    const parts = raw.split(/[\n\s]*[（(]?\d+[、\.．\)）]\s*/).map(s => s.trim()).filter(Boolean);
    if (parts.length === 0) return '';
    const actions = [];
    parts.forEach(p => {
        // 底部框到边 + 到顶
        if (/底部框/.test(p) && /到边/.test(p)) {
            actions.push('底部框左右对齐边缘，顶部不顶到顶');
            return;
        }
        // 顶部提示与图片/文字重叠
        if (/(顶部|上方).*提示/.test(p) && /(重叠|遮挡)/.test(p)) {
            actions.push('调整提示与图片/文字的层级或间距，避免重叠');
            return;
        }
        // 文字区底色/背景色
        if (/(文字|文案).*底色|背景/.test(p)) {
            actions.push('移除文字区底色或按设计设为正确底色');
            return;
        }
    });
    if (actions.length === 0) return '';
    return actions.join('；');
}

// 判断一段文本是否更像“问题描述列表”而非“动作型方案”
function looksLikeProblemList(text){
    if(!text) return false;
    const s = String(text).trim();
    // 命中特征：
    // 1) 大量“是/有/不/与…不一致/存在”等“状态/问题”词汇
    // 2) 以数字列点开头的多句
    const issueHints = /(有问题|不一致|异常|错误|重叠|遮挡|不到边|到顶|显示不全|存在|是)/g;
    const countIssue = (s.match(issueHints) || []).length;
    const countAction = (s.match(/(将|把|需要|统一|调整|改为|改成|优化|修复|修改|更改)/g) || []).length;
    const listLike = /\d+[^\n]*[。；;，,]/.test(s) || /\n/.test(s);
    return countIssue > countAction && listLike;
}

// 将“问题列表”改写为“动作型解决方案”
function rewriteProblemListToActions(text){
    const raw = String(text).replace(/^[^\n:：]*[:：]\s*/,'').trim();
    const items = raw.split(/[\n\s]*[（(]?\d+[、\.．\)）]\s*/).map(s=>s.trim()).filter(Boolean);
    const actions = [];
    items.forEach(p=>{
        // 到边/到顶
        if(/底部框/.test(p) && /到边/.test(p)) actions.push('底部框左右对齐边缘，顶部不顶到顶');
        // 重叠/遮挡
        if(/(顶部|上方).*提示/.test(p) && /(重叠|遮挡)/.test(p)) actions.push('调整提示与图片/文字的层级或间距，避免重叠');
        // 文字底色
        if(/(文字|文案).*底色|背景/.test(p)) actions.push('移除文字区底色或按设计设为正确底色');
    });
    if(actions.length === 0){
        return `针对上述问题逐项优化，确保视觉与交互符合设计预期。`;
    }
    return actions.join('；') + '。';
}

// 规范问题描述：取冒号前第一句，并补句号
function normalizeProblemDescription(text){
    if(!text) return '';
    const s = String(text).split(/[:：]/)[0].trim();
    return s ? (/[。.!？?]$/.test(s) ? s : s + '。') : '';
}

// 优化解决方案文本，确保内容完整通顺
function optimizeSolutionText(solutionText) {
    if (!solutionText) return '';
    
    let solution = solutionText.trim();
    
    // 如果解决方案已经包含"建议"前缀，直接处理数字格式
    if (solution.includes('建议')) {
        // 处理"建议1.xxx 2.xxx"这样的格式
        solution = solution.replace(/建议(\d+)\./g, '建议$1：');
        // 处理独立的数字开头（如" 2.xxx"）
        solution = solution.replace(/(\s+)(\d+)\./g, '$1建议$2：');
    } else {
        // 如果解决方案以数字开头（如"1.优先找产品..."），进行格式化处理
        if (/^\d+\./.test(solution)) {
            // 将数字开头的建议转换为更完整的格式
            solution = solution.replace(/^(\d+)\.\s*/, '建议$1：');
            
            // 如果包含多个建议点，进行合并处理
            const parts = solution.split(/(?=\d+\.)/);
            if (parts.length > 1) {
                const formattedParts = parts.map((part, index) => {
                    if (index === 0) return part;
                    return part.replace(/^(\d+)\.\s*/, `建议${index + 1}：`);
                });
                solution = formattedParts.join(' ');
            }
        }
    }
    
    // 若文本更像“问题列表”，则改写为“动作型方案”
    if (looksLikeProblemList(solution)) {
        solution = rewriteProblemListToActions(solution);
    }
    
    // 确保解决方案以句号结尾
    if (!solution.endsWith('。') && !solution.endsWith('！') && !solution.endsWith('？')) {
        solution += '。';
    }
    
    // 如果解决方案太短，尝试补充上下文
    if (solution.length < 10) {
        solution = `根据问题具体情况，建议：${solution}`;
    }
    
    return normalizeSolutionPunctuation(solution);
}

// 统一清洗方案文本的重复标点
function normalizeSolutionPunctuation(text) {
    if (!text) return '';
    let s = String(text)
        .replace(/[，,]{2,}/g, '，')
        .replace(/[。\.]{2,}/g, '。')
        .replace(/[；;]{2,}/g, '；')
        .replace(/[、]{2,}/g, '、')
        .replace(/，(。|；|、)/g, '$1')
        .replace(/(。|；|，|、){2,}/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();
    if (!/[。！!？?]$/.test(s)) s += '。';
    return s;
}

// 智能生成验收标准
function generateSmartAcceptanceCriteria(problemType, priority) {
    const baseCriteria = [
        '问题得到有效解决',
        '用户体验明显改善',
        '无新的相关问题产生'
    ];
    
    const typeSpecificCriteria = {
        '设计需求优化': [
            '设计效果符合预期',
            '界面美观度显著提升',
            '用户满意度明显改善'
        ],
        '交互功能bug': [
            '交互功能运行稳定可靠',
            '异常情况得到妥善处理',
            '功能性能符合预期'
        ],
        '视觉还原度bug': [
            '视觉实现与设计稿完全一致',
            '像素级对齐准确无误',
            '视觉效果符合设计规范'
        ],
        '历史遗留': [
            '历史问题得到系统性解决',
            '代码质量得到显著提升',
            '长期稳定性得到保障'
        ]
    };
    
    const criteria = typeSpecificCriteria[problemType] || baseCriteria;
    
    // 根据优先级调整验收标准
    if (priority === 'P0-紧急' || priority === 'P1-高') {
        criteria.unshift('问题完全解决，无任何遗留问题');
    }
    
    return criteria;
}

// 提取关键词
function extractKeywords(description) {
    const keywords = [];
    const text = description.toLowerCase();
    
    const importantWords = [
        '登录', '支付', '订单', '商品', '用户', '界面', '操作', '功能',
        '性能', '速度', '安全', '数据', '文件', '上传', '下载'
    ];
    
    importantWords.forEach(word => {
        if (text.includes(word)) {
            keywords.push(word);
        }
    });
    
    return keywords.slice(0, 2); // 最多返回2个关键词
}

// 识别是否为“视觉还原度bug”
function detectVisualMismatch(text){
    if(!text) return false;
    const s = String(text).toLowerCase();
    const zh = String(text);
    const visualWords = [
        '不一致','不符','偏差','还原','样式','对齐','间距','色值','颜色','边距','圆角','阴影','字号','字体','显示不全','截断','布局','排版','重叠','遮挡','到底','到边','到顶','白色底色','底色'
    ];
    // 命中任一中文关键字
    if (visualWords.some(w => zh.includes(w))) return true;
    // 英文/开发口语化
    const enWords = ['visual', 'style', 'css', 'align', 'spacing', 'color', 'radius', 'shadow', 'font', 'truncate', 'overlap'];
    return enWords.some(w => s.includes(w));
}

// 从用户输入中拆分"问题/解决方案"
function splitProblemAndSolution(description) {
    const text = (description || '').trim();
    if (!text) return { problemText: '', solutionText: '' };

    // 1) 先按显式分隔词拆分
    const separators = [
        /解决方案[:：]/i,
        /建议[:：]/i,
        /期望[:：]/i,
        /希望[:：]/i,
        /临时处理[:：]/i,
        /调整为[:：]/i,
        /改为[:：]/i,
        /应(?:该)?(?:为|是)[:：]?/i,
        /建议\s*\d+[:：]?/i,  // 匹配"建议1："这样的格式
        /^\s*\d+\.\s*建议/i   // 匹配"1. 建议"这样的格式
    ];

    for (const reg of separators) {
        const idx = text.search(reg);
        if (idx !== -1) {
            const problem = text.slice(0, idx).trim();
            let solution = text.slice(idx).trim();
            
            // 特殊处理：如果匹配到"建议"相关的分隔符，不要删除"建议"部分
            if (reg.source.includes('建议')) {
                // 保持完整的解决方案文本，不删除"建议"前缀
                solution = solution;
            } else {
                // 其他情况才删除匹配的分隔符
                solution = solution.replace(reg, '').trim();
            }
            
            return {
                problemText: problem || text,
                solutionText: solution
            };
        }
    }
    
    // 2) 特殊处理：如果输入包含"调整为"、"改为"等解决方案词汇，进行智能拆分
    const solutionPatterns = [
        /调整为\s*(\d+px|\d+像素|\d+号|[\u4e00-\u9fa5]+)/i,
        /改为\s*(\d+px|\d+像素|\d+号|[\u4e00-\u9fa5]+)/i,
        /需要\s*(\d+px|\d+像素|\d+号|[\u4e00-\u9fa5]+)/i,
        /应该\s*(\d+px|\d+像素|\d+号|[\u4e00-\u9fa5]+)/i
    ];
    
    for (const pattern of solutionPatterns) {
        const match = text.match(pattern);
        if (match) {
            const solutionStart = text.indexOf(match[0]);
            const problem = text.slice(0, solutionStart).trim();
            const solution = text.slice(solutionStart).trim();
            
            return {
                problemText: problem,
                solutionText: solution
            };
        }
    }
    // 2) 若无显式分隔：按句子扫描，并处理“有问题，…将/把/需要/统一/调整/改为/优化…”的结构
    const sentences = text.split(/(?<=[。！？!?.；;\n])/).map(s => s.trim()).filter(Boolean);
    // 特例：首句包含“有问题/异常/错误/不一致”等问题词，次句以行动动词开头 → 问题/方案拆分
    if (sentences.length >= 2) {
        const issueHint = /(有问题|异常|错误|不对|不符|不一致|显示不全|显示异常|布局异常|样式异常)/;
        const actionLead = /^(将|把|需要|统一|调整|改为|改成|优化|修复|修改|更改|调整为)/;
        const s1 = sentences[0].replace(/[，,。；;]+$/,'');
        const s2 = sentences.slice(1).join(' ').trim();
        if (issueHint.test(s1) && actionLead.test(s2)) {
            return {
                problemText: s1,
                solutionText: s2
            };
        }
        // 另一种形式：单句中包含“有问题，将/把/需要/统一/调整/改为/优化…”，按第一个逗号拆分
        if (text.includes('，')) {
            const [left, right] = text.split('，');
            if (issueHint.test(left) && actionLead.test(right)) {
                return {
                    problemText: left.trim(),
                    solutionText: text.slice(text.indexOf('，') + 1).trim()
                };
            }
        }
    }
    const solutionIndicators = [
        /应(?:该)?(?:为|是)/i,
        /调整为/i,
        /改为/i,
        /建议/i,
        /期望/i,
        /希望/i,
        /^\s*\d+\.\s*/i  // 匹配以数字开头的句子
    ];
    const solutionSentences = [];
    const problemSentences = [];
    sentences.forEach(s => {
        if (solutionIndicators.some(r => r.test(s))) {
            solutionSentences.push(s.replace(/^[-——\s]*/, ''));
        } else {
            problemSentences.push(s);
        }
    });
    if (solutionSentences.length > 0) {
        return {
            problemText: problemSentences.join(' '),
            solutionText: solutionSentences.join(' ')
        };
    }
    // 3) 仍未识别：按换行/破折号做兜底拆分
    const parts = text.split(/\n+|——|--/).map(s => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
        return { problemText: parts[0], solutionText: parts.slice(1).join('；') };
    }
    return { problemText: text, solutionText: '' };
}

// 文本润色与补全：让过短的内容变成完整句式
function enrichProblemAndSolution(problemText, solutionText, original) {
    const problem = (problemText || '').trim();
    let solution = (solutionText || '').trim();

    // 特例：若包含“组件样式对齐/一致”的愿望表达，问题/方案按需求输出
    const wishInfo = findAlignWishInfo(original || '');
    if (wishInfo && wishInfo.component) {
        const normalizedWish = wishInfo.wish ? (wishInfo.wish.endsWith('。') ? wishInfo.wish : wishInfo.wish + '。') : '';
        return {
            problem: `${wishInfo.component}需修改。`,
            solution: normalizeSolutionPunctuation(normalizedWish || '与对应头图组件样式对齐。')
        };
    }

    // 确保问题和解决方案不重复
    if (solution && problem.includes(solution)) {
        // 如果问题描述中包含了解决方案，从问题描述中移除解决方案部分
        const cleanProblem = problem.replace(solution, '').trim();
        return {
            problem: cleanProblem || '体验问题需要优化',
            solution: normalizeSolutionPunctuation(solution)
        };
    }

    // 若方案只有类似"20px/黄色/加粗"等简短词，补全为完整句
    if (/^#?[0-9a-fA-F]{3,8}$/.test(solution) || /\d+\s*px$/i.test(solution) || /[\u4e00-\u9fa5A-Za-z]+$/.test(solution) && solution.length <= 8) {
        solution = `按设计规范进行还原，目标为：${solution}。`;
    }

    // 如果方案为空但原文包含"应/应当/应该/应为/应是/调整为/改为"后缀，尝试抽取
    if (!solution) {
        const m = (original || '').match(/(?:应当|应该|应为|应是|应|调整为|改为)[:：]?\s*([^。；;\n]+)/);
        if (m && m[1]) {
            solution = `按设计稿调整为：${m[1].trim()}。`;
        }
    }

    // 问题语句：清理设计规范相关措辞，保持交互/功能聚焦
    let enrichedProblem = problem
        .replace(/与?设计稿?存在不一致[，。]*/g, '')
        .replace(/请核对规范[，。]*/g, '')
        .replace(/按设计稿|按规范|规范要求[，。]*/g, '');
    if (enrichedProblem && !/[。.!；;]$/.test(enrichedProblem)) {
        enrichedProblem += '。';
    }

    return { problem: enrichedProblem || (original || ''), solution: normalizeSolutionPunctuation(solution) };
}

// 获取影响描述
function getImpactDescription(problemType) {
    const impactMap = {
        '设计需求优化': '影响用户使用体验',
        '交互功能bug': '影响系统功能正常使用',
        '视觉还原度bug': '影响界面视觉效果',
        '历史遗留': '影响系统长期稳定性'
    };
    
    return impactMap[problemType] || '影响用户体验';
}

// 生成增强的标准化格式
function generateEnhancedStandardFormat(data, analysis, enhancedContent) {
    const regionNames = data.systemTypes.join('、');
    const moduleNames = data.modules.map(module => getModuleName(module)).join('、');
    
    return {
        title: enhancedContent.title,
        background: enhancedContent.background,
        problem: data.description,
        impact: analysis.impact,
        priority: analysis.priority,
        problemType: analysis.predictedType,
        expectedResult: enhancedContent.solution,
        acceptanceCriteria: enhancedContent.acceptanceCriteria,
        estimatedTime: analysis.estimatedTime,
        assignee: analysis.processingMethod.assignee,
        status: '待处理',
        confidence: Math.round(analysis.analysisConfidence * 100) + '%',
        similarIssues: analysis.similarIssues,
        processingMethod: analysis.processingMethod.method,
        escalation: analysis.processingMethod.escalation,
        recommendedTimeline: analysis.processingMethod.timeline
    };
}

// 更新分析进度
function updateAnalysisProgress(message, progress) {
    const loadingText = elements.previewContent.querySelector('.loading-text');
    const progressFill = elements.previewContent.querySelector('.progress-fill');
    
    if (loadingText) {
        loadingText.textContent = message;
    }
    
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    
    // 如果进度达到100%，标记转化完成
    if (progress >= 100) {
        window.conversionCompleted = true;
    }
}

// 获取模块名称
function getModuleName(module) {
    const moduleNames = {
        '管理端': '管理端',
        '门店端': '门店端',
        '移动端': '移动端'
    };
    return moduleNames[module] || module;
}

// 显示预览结果
function displayPreviewResult(result) {
    const f = result.standardFormat;
    console.log('显示预览结果:', result); // 调试信息
    console.log('标题字段:', result.title, f.title); // 调试信息
    // 保存当前分析结果
    window.currentAnalysisResult = result;
    // 显示操作按钮
    elements.previewActions.style.display = 'flex';

    // 获取相关图片（第11个字段）
    const relatedImages = result.files.filter(file => file.type.startsWith('image/'));
    
    elements.previewContent.innerHTML = `
        <!-- 内容详情卡片 -->
        <div class="preview-card" id="contentDetailsCard">
            <h3 class="preview-card-title">内容详情</h3>
            <div class="preview-card-content" id="contentDetailsContent">
                <div class="detail-row detail-row-title">
                    <div class="detail-label">标题</div>
                    <div class="detail-value">
                        <div class="detail-display">${(result.title || f.title || '').replace(/"/g, '&quot;')}</div>
                        <textarea class="detail-input detail-textarea" data-field="title" rows="2">${(result.title || f.title || '').replace(/"/g, '&quot;')}</textarea>
                    </div>
                </div>
                
                <div class="detail-row detail-row-description">
                    <div class="detail-label">问题描述</div>
                    <div class="detail-value">
                        <div class="detail-display">${f.problem_description || ''}</div>
                        <textarea class="detail-input detail-textarea" data-field="problem_description" rows="3">${f.problem_description || ''}</textarea>
                    </div>
                </div>
                
                <div class="detail-row detail-row-solution">
                    <div class="detail-label">解决方案</div>
                    <div class="detail-value">
                        <div class="detail-display">${f.solution || ''}</div>
                        <textarea class="detail-input detail-textarea" data-field="solution" rows="3">${f.solution || ''}</textarea>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">所属地区</div>
                    <div class="detail-value">
                        <div class="detail-display">${f.region || ''}</div>
                        <div class="detail-input detail-checkbox-group" data-field="region">
                            <label class="detail-checkbox-item">
                                <input type="checkbox" value="BR" ${(f.region||'').includes('BR') ? 'checked' : ''}>
                                <span class="detail-checkbox-label">BR</span>
                            </label>
                            <label class="detail-checkbox-item">
                                <input type="checkbox" value="SSL" ${(f.region||'').includes('SSL') ? 'checked' : ''}>
                                <span class="detail-checkbox-label">SSL</span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">归属终端</div>
                    <div class="detail-value">
                        <div class="detail-display">${f.terminal || ''}</div>
                        <div class="detail-input detail-checkbox-group" data-field="terminal">
                            <label class="detail-checkbox-item">
                                <input type="checkbox" value="管理端" ${(f.terminal||'').includes('管理端') ? 'checked' : ''}>
                                <span class="detail-checkbox-label">管理端</span>
                            </label>
                            <label class="detail-checkbox-item">
                                <input type="checkbox" value="门店端" ${(f.terminal||'').includes('门店端') ? 'checked' : ''}>
                                <span class="detail-checkbox-label">门店端</span>
                            </label>
                            <label class="detail-checkbox-item">
                                <input type="checkbox" value="移动端" ${(f.terminal||'').includes('移动端') ? 'checked' : ''}>
                                <span class="detail-checkbox-label">移动端</span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">问题类型</div>
                    <div class="detail-value">
                        <div class="detail-display">${f.issue_type || ''}</div>
                        <select class="detail-input detail-select" data-field="issue_type">
                            <option value="设计需求优化" ${f.issue_type === '设计需求优化' ? 'selected' : ''}>设计需求优化</option>
                            <option value="交互功能bug" ${f.issue_type === '交互功能bug' ? 'selected' : ''}>交互功能bug</option>
                            <option value="视觉还原度bug" ${f.issue_type === '视觉还原度bug' ? 'selected' : ''}>视觉还原度bug</option>
                            <option value="历史遗留" ${f.issue_type === '历史遗留' ? 'selected' : ''}>历史遗留</option>
                        </select>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">解决方式</div>
                    <div class="detail-value">
                        <div class="detail-display">${f.resolution_method || ''}</div>
                        <select class="detail-input detail-select" data-field="resolution_method">
                            <option value="体验优化" ${f.resolution_method === '体验优化' ? 'selected' : ''}>体验优化</option>
                            <option value="需求优化" ${f.resolution_method === '需求优化' ? 'selected' : ''}>需求优化</option>
                        </select>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">优先级</div>
                    <div class="detail-value">
                        <div class="detail-display">${f.priority || ''}</div>
                        <select class="detail-input detail-select" data-field="priority">
                            <option value="P0-紧急" ${f.priority === 'P0-紧急' ? 'selected' : ''}>P0-紧急</option>
                            <option value="P1-高" ${f.priority === 'P1-高' ? 'selected' : ''}>P1-高</option>
                            <option value="P2-中" ${f.priority === 'P2-中' ? 'selected' : ''}>P2-中</option>
                            <option value="P3-低" ${f.priority === 'P3-低' ? 'selected' : ''}>P3-低</option>
                        </select>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">解决状态</div>
                    <div class="detail-value">
                        <div class="detail-display">${f.status || ''}</div>
                        <select class="detail-input detail-select" data-field="status">
                            <option value="待确认(未提给研发)" ${f.status === '待确认(未提给研发)' ? 'selected' : ''}>待确认(未提给研发)</option>
                            <option value="研发中(已提给研发)" ${f.status === '研发中(已提给研发)' ? 'selected' : ''}>研发中(已提给研发)</option>
                            <option value="待走查(已研发完成)" ${f.status === '待走查(已研发完成)' ? 'selected' : ''}>待走查(已研发完成)</option>
                            <option value="已解决(走查完成并上线)" ${f.status === '已解决(走查完成并上线)' ? 'selected' : ''}>已解决(走查完成并上线)</option>
                            <option value="暂不解决" ${f.status === '暂不解决' ? 'selected' : ''}>暂不解决</option>
                        </select>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">期望修复版本</div>
                    <div class="detail-value">
                        <div class="detail-display">${f.target_version || '未定'}</div>
                        <input type="text" class="detail-input detail-text" data-field="target_version" value="${f.target_version || '未定'}">
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 相关图片卡片 -->
        <div class="preview-card" id="relatedImagesCard">
            <h3 class="preview-card-title">相关图片</h3>
            <div class="preview-card-content" id="relatedImagesContent">
                ${relatedImages.length > 0 ? 
                    relatedImages.map((file, index) => {
                        try {
                            if (file instanceof File) {
                                const imageUrl = URL.createObjectURL(file);
                                return `
                                    <div class="image-item">
                                        <img src="${imageUrl}" alt="${file.name}" class="image-thumbnail">
                                        <div class="image-caption">${file.name}</div>
                                    </div>
                                `;
                            }
                        } catch (error) {
                            console.error('Error creating image URL:', error);
                        }
                        return '';
                    }).join('') : 
                    '<div class="no-images">暂无相关图片</div>'
                }
            </div>
        </div>
    `;
    
    // 初始化编辑功能
    initializeEditableContent();
}


// 导出文档
function exportAsDoc() {
    const content = elements.previewContent.innerText;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `需求文档_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('文档已导出', 'success');
}

// 显示加载模态框
function showLoadingModal() {
    elements.loadingModal.classList.add('show');
}

// 隐藏加载模态框
function hideLoadingModal() {
    elements.loadingModal.classList.remove('show');
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 24px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 12px 16px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 获取通知图标
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// 获取通知颜色
function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || colors.info;
}

// 生成ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 获取当前用户ID
function getCurrentUserId() {
    // 从localStorage获取用户ID，如果没有则生成一个
    let userId = localStorage.getItem('feedbackBridge_userId');
    if (!userId) {
        userId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
        localStorage.setItem('feedbackBridge_userId', userId);
    }
    return userId;
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 检查转化按钮状态
function checkConvertButtonState() {
    const description = elements.issueDescription.value.trim();
    const charCount = description.length;
    const shouldEnable = charCount > 10;
    
    // 更新按钮状态
    elements.convertBtn.disabled = !shouldEnable;
    
    if (shouldEnable) {
        elements.convertBtn.classList.remove('disabled');
        elements.convertBtn.style.opacity = '1';
        elements.convertBtn.style.cursor = 'pointer';
    } else {
        elements.convertBtn.classList.add('disabled');
        elements.convertBtn.style.opacity = '0.5';
        elements.convertBtn.style.cursor = 'not-allowed';
    }
    
}


// 在预览区域显示加载状态
function showPreviewLoading() {
    elements.previewContent.innerHTML = `
        <div class="preview-loading">
            <div class="loading-spinner">
                <i class="fas fa-brain fa-pulse"></i>
            </div>
            <div class="loading-text">正在智能分析问题...</div>
            <div class="loading-subtitle">请稍候，我们正在为您智能转化体验问题</div>
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
            </div>
            <div class="loading-tips">
                <div class="tip-item">💡 首次分析可能需要几秒钟，相似问题会更快</div>
                <div class="tip-item">🚀 系统会自动缓存结果，提升后续响应速度</div>
                <div class="tip-item">⚡ 如果等待时间过长，系统会自动降级到快速模式</div>
            </div>
        </div>
    `;
    
    // 启动进度动画
    startProgressAnimation();
}

// 启动进度动画
function startProgressAnimation() {
    let progress = 0;
    const progressFill = elements.previewContent.querySelector('.progress-fill');
    const loadingText = elements.previewContent.querySelector('.loading-text');
    
    const messages = [
        "正在智能分析问题...",
        "正在识别问题类型...",
        "正在评估优先级...",
        "正在生成解决方案...",
        "正在优化输出格式...",
        "即将完成分析..."
    ];
    
    let messageIndex = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 15; // 随机增长，更真实
        if (progress > 90) progress = 90; // 不超过90%，等待实际完成
        
        if (progressFill) progressFill.style.width = progress + '%';
        
        // 更新消息
        if (progress > messageIndex * 15 && messageIndex < messages.length - 1) {
            messageIndex++;
            if (loadingText) loadingText.textContent = messages[messageIndex];
        }
        
        // 如果转化完成，清除定时器
        if (window.conversionCompleted) {
            clearInterval(interval);
            if (progressFill) progressFill.style.width = '100%';
            if (loadingText) loadingText.textContent = '分析完成！';
        }
    }, 200);
    
    // 保存定时器引用，以便后续清除
    window.progressInterval = interval;
}

// 重新生成内容
function regenerateContent() {
    if (isConverting) return;
    
    // 直接调用转化函数
    handleConvert();
}

// 保存至草稿箱
function saveToDraft() {
    // 获取当前表单数据
    const issueDescription = elements.issueDescription.value.trim();
    const selectedSystemTypes = elements.systemTypeSelect.querySelectorAll('input[type="checkbox"]:checked');
    const systemTypes = Array.from(selectedSystemTypes).map(checkbox => checkbox.value);
    const selectedModules = elements.moduleSelect.querySelectorAll('input[type="checkbox"]:checked');
    const modules = Array.from(selectedModules).map(checkbox => checkbox.value);
    
    const draft = {
        description: issueDescription,
        systemTypes: systemTypes,
        modules: modules,
        files: uploadedFiles,
        timestamp: new Date().toISOString()
    };
    
    // 保存到草稿箱
    const drafts = JSON.parse(localStorage.getItem('feedbackBridge_drafts') || '[]');
    drafts.unshift(draft);
    
    // 只保留最近20个草稿
    if (drafts.length > 20) {
        drafts.splice(20);
    }
    
    localStorage.setItem('feedbackBridge_drafts', JSON.stringify(drafts));
    showNotification('已保存至草稿箱', 'success');
}










// Excel+图片复制功能（专门解决Excel图片显示问题）
async function copyExcelWithImages() {
    // 记录用户原声 - 接受了智能分析结果
    if (window.currentAnalysisResult) {
        SmartAnalysisEngine.recordUserFeedback(window.currentAnalysisResult.analysis, 'accepted');
    }
    
    // 获取预览内容
    const previewContent = document.getElementById('previewContent');
    if (!previewContent) {
        showNotification('没有可复制的内容', 'error');
        return;
    }
    
    // 提取表单中的实际内容值
    const contentValues = extractFormContentValues(previewContent);
    
    if (!contentValues || contentValues.trim() === '') {
        showNotification('没有可复制的内容', 'error');
        return;
    }
    
    // 提取图片数据
    const imageData = await extractImageData();
    
    console.log('Excel+图片复制 - 文本内容:', contentValues);
    console.log('Excel+图片复制 - 图片数量:', imageData.length);
    
    if (navigator.clipboard && window.isSecureContext) {
        try {
            // 创建包含图片的HTML内容
            const htmlWithImages = await createGoogleSheetsCompatibleHTML(contentValues, imageData);
            
            // 创建剪贴板数据
            const clipboardItemData = {
                'text/html': new Blob([htmlWithImages], { type: 'text/html' }),
                'text/plain': new Blob([contentValues], { type: 'text/plain' })
            };
            
            // 添加图片到剪贴板（转换为PNG格式以提高兼容性）
            if (imageData.length > 0) {
                console.log(`准备添加${imageData.length}张图片到剪贴板`);
                
                for (let i = 0; i < imageData.length; i++) {
                    const image = imageData[i];
                    console.log(`处理图片${i + 1}:`, {
                        name: image.name,
                        type: image.type,
                        size: image.blob.size
                    });
                    
                    // 将图片转换为PNG格式以提高剪贴板兼容性
                    try {
                        const pngBlob = await convertToPNG(image.blob);
                        console.log(`✅ 成功转换图片${i + 1}为PNG格式:`, {
                            原始大小: image.blob.size,
                            PNG大小: pngBlob.size,
                            原始类型: image.blob.type,
                            新类型: pngBlob.type
                        });
                        
                        // 使用唯一的键名避免覆盖
                        const imageKey = imageData.length === 1 ? 'image/png' : `image/png-${i + 1}`;
                        clipboardItemData[imageKey] = pngBlob;
                        
                    } catch (error) {
                        console.error(`❌ 转换图片${i + 1}为PNG失败:`, error);
                        // 如果转换失败，尝试使用原始格式
                        const originalKey = imageData.length === 1 ? image.type : `${image.type}-${i + 1}`;
                        clipboardItemData[originalKey] = image.blob;
                    }
                }
                
                console.log('最终剪贴板数据键名:', Object.keys(clipboardItemData));
            }
            
            console.log('Excel+图片 - 剪贴板数据类型:', Object.keys(clipboardItemData));
            await navigator.clipboard.write([new ClipboardItem(clipboardItemData)]);
            
            if (imageData.length > 0) {
                showNotification(`🎯 一键复制成功！\n\n内容已复制到剪贴板：\n• 文本内容（制表符分隔）\n• HTML格式（包含图片）\n• ${imageData.length}张图片（PNG格式）\n\n使用方法：\n• Ctrl+V：粘贴文本到多个单元格\n• 选择性粘贴 → HTML：粘贴文本+图片\n• 选择性粘贴 → 图片：只粘贴图片\n\n图片已单独复制，可直接粘贴！`, 'success');
            } else {
                showNotification('✅ 文本已复制到剪贴板', 'success');
            }
            
        } catch (err) {
            console.error('Excel+图片复制失败:', err);
            
            // 如果失败，尝试只复制文本
            try {
                await navigator.clipboard.writeText(contentValues);
                showNotification('⚠️ 文本已复制到剪贴板\n图片复制失败', 'warning');
            } catch (textErr) {
                fallbackCopyTextToClipboard(contentValues);
            }
        }
    } else {
        fallbackCopyTextToClipboard(contentValues);
    }
}

// 创建包含图片的HTML内容
async function createHTMLWithImages(textContent, imageData) {
    const fields = textContent.split('\t');
    
    // 创建HTML内容
    let html = '<div style="font-family: Arial, sans-serif;">';
    
    // 添加表格
    html += '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">';
    html += '<tr>';
    fields.forEach((field, index) => {
        html += `<td style="padding: 8px; border: 1px solid #ccc;">${field || ''}</td>`;
    });
    html += '</tr>';
    html += '</table>';
    
    // 添加图片
    if (imageData.length > 0) {
        html += '<br><h3>相关图片：</h3>';
        
        for (const image of imageData) {
            try {
                // 将图片转换为base64
                const base64 = await blobToBase64(image.blob);
                html += `<img src="${base64}" alt="${image.name}" style="max-width: 400px; max-height: 300px; border: 2px solid #007acc; margin: 10px 0; display: block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">`;
            } catch (error) {
                console.error('HTML图片转换失败:', error);
                html += `<p style="color: red;">图片 ${image.name} (转换失败)</p>`;
            }
        }
    }
    
    html += '</div>';
    
    return html;
}


// 创建Google Sheets兼容的HTML内容 - 文本在表格中，图片集中在一个单元格
async function createGoogleSheetsCompatibleHTML(textContent, imageData) {
    const fields = textContent.split('\t');
    
    let html = '<div style="font-family: Arial, sans-serif;">';
    
    // 创建表格，文本内容分布在多个单元格中
    html += '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">';
    html += '<tr>';
    
    // 将文本字段放入不同的单元格
    fields.forEach((field, index) => {
        html += `<td style="padding: 8px; border: 1px solid #ccc; vertical-align: top;">${field || ''}</td>`;
    });
    
    // 如果有图片，在最后一个单元格中添加所有图片信息
    if (imageData.length > 0) {
        html += '<td style="padding: 8px; border: 1px solid #ccc; vertical-align: top; text-align: center;">';
        html += '<div style="font-weight: bold; margin-bottom: 10px; color: #1890ff;">相关图片</div>';
        
        // 将所有图片集中在一个单元格中展示
        for (let i = 0; i < imageData.length; i++) {
            const image = imageData[i];
            try {
                const base64 = await blobToBase64(image.blob);
                html += `<div style="margin-bottom: 8px; display: inline-block; margin-right: 5px;">`;
                html += `<img src="${base64}" style="max-width: 100px; max-height: 70px; border: 1px solid #ddd; border-radius: 4px;" alt="图片${i + 1}" />`;
                html += `<div style="margin-top: 2px; font-size: 9px; color: #666;">${image.name}</div>`;
                html += `</div>`;
            } catch (error) {
                console.error(`转换图片${i + 1}为Base64失败:`, error);
                html += `<div style="margin-bottom: 5px; color: #999; font-size: 9px;">图片${i + 1}: ${image.name}</div>`;
            }
        }
        
        html += '</td>';
    }
    
    html += '</tr>';
    html += '</table>';
    html += '</div>';
    
    return html;
}


// 创建Google Sheets友好的内容格式
function createGoogleSheetsContent(textContent, imageData) {
    const fields = textContent.split('\t');
    
    // 为Google Sheets创建制表符分隔的格式
    let sheetsText = textContent;
    
    // 如果有图片，添加图片信息
    if (imageData.length > 0) {
        sheetsText += '\n\n=== 相关图片信息 ===\n';
        imageData.forEach((image, index) => {
            sheetsText += `图片${index + 1}: ${image.name}\n`;
        });
        sheetsText += '\n注意：图片需要手动插入到Google Sheets中\n';
        sheetsText += '方法：插入 → 图片 → 上传到云端硬盘\n';
    }
    
    return sheetsText;
}

// 将Blob转换为Base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// 将图片转换为PNG格式（提高剪贴板兼容性）
function convertToPNG(blob) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        img.onload = () => {
            // 设置画布尺寸
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 绘制图片到画布
            ctx.drawImage(img, 0, 0);
            
            // 转换为PNG格式的Blob
            canvas.toBlob((pngBlob) => {
                if (pngBlob) {
                    console.log('图片转换成功:', {
                        原始大小: blob.size,
                        PNG大小: pngBlob.size,
                        原始类型: blob.type,
                        新类型: pngBlob.type
                    });
                    resolve(pngBlob);
                } else {
                    reject(new Error('PNG转换失败'));
                }
            }, 'image/png', 0.9);
        };
        
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = URL.createObjectURL(blob);
    });
}

// 提取表单内容值的函数
function extractFormContentValues(previewContent) {
    const contentParts = [];
    
    // 提取各个字段的值
    const fields = [
        { selector: '[data-field="title"]', label: '标题' },
        { selector: '[data-field="region"]', label: '所属地区', isSelect: true },
        { selector: '[data-field="terminal"]', label: '归属终端', isSelect: true },
        { selector: '[data-field="issue_type"]', label: '问题类型', isSelect: true },
        { selector: '[data-field="resolution_method"]', label: '解决方式', isSelect: true },
        { selector: '[data-field="priority"]', label: '优先级', isSelect: true },
        { selector: '[data-field="problem_description"]', label: '问题描述' },
        { selector: '[data-field="solution"]', label: '解决方案' },
        { selector: '[data-field="status"]', label: '解决状态', isSelect: true },
        { selector: '[data-field="target_version"]', label: '期望修复版本' }
    ];
    
    fields.forEach(field => {
        const element = previewContent.querySelector(field.selector);
        if (element) {
            let value = '';
            
            if (field.isSelect) {
                // 处理select元素
                if (element.multiple) {
                    // 多选
                    const selectedOptions = Array.from(element.selectedOptions);
                    value = selectedOptions.map(option => option.value).join('、');
                } else {
                    // 单选
                    value = element.value || '';
                }
            } else {
                // 处理input和textarea元素
                value = element.value || element.textContent || '';
            }
            
            // 只有当值不为空时才添加到结果中
            if (value && value.trim() !== '') {
                contentParts.push(value.trim());
            }
        }
    });
    
    // 返回用制表符连接的内容，便于在表格中横向粘贴
    const result = contentParts.join('\t');
    console.log('复制内容预览:', result);
    console.log('字段数量:', contentParts.length);
    console.log('制表符位置:', result.split('\t').map((part, index) => `${index}: "${part}"`));
    return result;
}

// 降级复制方案
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // 避免滚动到底部
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('内容已复制到剪贴板', 'success');
        } else {
            showNotification('复制失败，请手动复制', 'error');
        }
    } catch (err) {
        console.error('降级复制失败:', err);
        showNotification('复制失败，请手动复制', 'error');
    }
    
    document.body.removeChild(textArea);
}

// 提取图片数据（改进版）
async function extractImageData() {
    const imageData = [];
    console.log('🔍 开始提取图片数据...');
    
    // 检查所有可能的图片源
    console.log('📋 检查图片源...');
    console.log('window.currentScreenshots:', window.currentScreenshots);
    console.log('window.currentAnalysisResult:', window.currentAnalysisResult);
    
    // 方法1：从全局文件状态中获取图片文件
    if (window.currentScreenshots && window.currentScreenshots.length > 0) {
        console.log('📁 从全局截图文件提取:', window.currentScreenshots.length, '个文件');
        
        for (const file of window.currentScreenshots) {
            try {
                console.log('🖼️ 处理截图文件:', file.name, file.type, '大小:', file.size);
                const arrayBuffer = await file.arrayBuffer();
                const blob = new Blob([arrayBuffer], { type: file.type });
                imageData.push({
                    blob: blob,
                    name: file.name,
                    type: file.type
                });
                console.log('✅ 成功提取截图:', file.name);
            } catch (error) {
                console.error('❌ 提取截图数据失败:', error);
            }
        }
    } else {
        console.log('⚠️ 没有找到全局截图文件');
    }
    
    // 方法2：从分析结果中获取文件信息
    if (window.currentAnalysisResult && window.currentAnalysisResult.files) {
        console.log('📄 从分析结果提取文件信息:', window.currentAnalysisResult.files);
        // 注意：这里只有文件信息，没有实际的File对象
    }
    
    // 方法3：从预览区域中获取显示的图片
    const previewImages = document.querySelectorAll('#screenshotPreviewContainer img, .screenshot-preview img, .file-preview img');
    console.log('🖼️ 预览区域中的图片数量:', previewImages.length);
    
    for (const img of previewImages) {
        try {
            console.log('🔄 处理预览图片:', img.src, img.alt);
            // 检查是否是blob URL
            if (img.src.startsWith('blob:')) {
                const response = await fetch(img.src);
                const blob = await response.blob();
                imageData.push({
                    blob: blob,
                    name: img.alt || 'preview-image.png',
                    type: blob.type
                });
                console.log('✅ 成功提取预览图片:', img.alt || 'preview-image.png');
            } else {
                console.log('⚠️ 跳过非blob图片:', img.src);
            }
        } catch (error) {
            console.error('❌ 提取预览图片失败:', error);
        }
    }
    
    // 方法4：从文件上传区域获取图片
    const uploadedFiles = document.querySelectorAll('.file-item img, .uploaded-file img');
    console.log('📤 上传文件区域中的图片数量:', uploadedFiles.length);
    
    for (const img of uploadedFiles) {
        try {
            console.log('🔄 处理上传文件图片:', img.src, img.alt);
            if (img.src.startsWith('blob:')) {
                const response = await fetch(img.src);
                const blob = await response.blob();
                imageData.push({
                    blob: blob,
                    name: img.alt || 'uploaded-image.png',
                    type: blob.type
                });
                console.log('✅ 成功提取上传文件图片:', img.alt || 'uploaded-image.png');
            }
        } catch (error) {
            console.error('❌ 提取上传文件图片失败:', error);
        }
    }
    
    // 方法5：从input元素中获取文件
    const fileInputs = document.querySelectorAll('input[type="file"]');
    for (const input of fileInputs) {
        if (input.files && input.files.length > 0) {
            console.log('📁 从input元素提取文件:', input.files.length, '个文件');
            for (const file of input.files) {
                if (file.type.startsWith('image/')) {
                    try {
                        const arrayBuffer = await file.arrayBuffer();
                        const blob = new Blob([arrayBuffer], { type: file.type });
                        imageData.push({
                            blob: blob,
                            name: file.name,
                            type: file.type
                        });
                        console.log('✅ 成功从input提取图片:', file.name);
                    } catch (error) {
                        console.error('❌ 从input提取图片失败:', error);
                    }
                }
            }
        }
    }
    
    console.log('🎯 最终提取的图片数据:', imageData.length, '张图片');
    imageData.forEach((img, index) => {
        console.log(`图片${index + 1}:`, img.name, img.type, '大小:', img.blob.size);
    });
    
    return imageData;
}


// 复制包含图片的内容
async function copyWithImages(textContent, imageData) {
    console.log('开始复制包含图片的内容...');
    console.log('文本内容:', textContent);
    console.log('图片数据:', imageData);
    
    // 方法1：尝试使用单个ClipboardItem包含文本和图片
    try {
        console.log('尝试方法1：单个ClipboardItem包含文本和图片');
        const clipboardItemData = {
            'text/plain': new Blob([textContent], { type: 'text/plain' })
        };
        
        // 添加所有图片到同一个ClipboardItem中（转换为PNG格式）
        for (const image of imageData) {
            console.log('添加图片到剪贴板:', image.name, image.type, '大小:', image.blob.size);
            
            try {
                const pngBlob = await convertToPNG(image.blob);
                clipboardItemData['image/png'] = pngBlob;
                console.log('✅ 成功转换图片为PNG格式');
            } catch (error) {
                console.error('❌ 转换图片为PNG失败:', error);
                clipboardItemData[image.type] = image.blob;
            }
        }
        
        console.log('剪贴板数据类型:', Object.keys(clipboardItemData));
        
        // 写入剪贴板
        await navigator.clipboard.write([new ClipboardItem(clipboardItemData)]);
        console.log('成功写入剪贴板（方法1）');
        return;
    } catch (error) {
        console.error('方法1失败:', error);
    }
    
    // 方法2：尝试使用单个ClipboardItem包含多种类型
    try {
        console.log('尝试方法2：单个ClipboardItem包含多种类型');
        const clipboardItemData = {
            'text/plain': new Blob([textContent], { type: 'text/plain' })
        };
        
        // 只添加第一张图片，避免过多内容
        if (imageData.length > 0) {
            const firstImage = imageData[0];
            console.log('添加第一张图片:', firstImage.name, firstImage.type);
            clipboardItemData[firstImage.type] = firstImage.blob;
        }
        
        await navigator.clipboard.write([new ClipboardItem(clipboardItemData)]);
        console.log('成功写入剪贴板（方法2）');
        return;
    } catch (error) {
        console.error('方法2失败:', error);
    }
    
    // 方法3：只复制文本
    try {
        console.log('尝试方法3：只复制文本');
        await navigator.clipboard.writeText(textContent);
        console.log('成功写入文本到剪贴板（方法3）');
        return;
    } catch (error) {
        console.error('方法3失败:', error);
        throw error;
    }
}

// 初始化编辑功能
function initializeEditableContent() {
    // 为输入框添加样式
    const inputElements = elements.previewContent.querySelectorAll('.field-input, .field-textarea, .field-select, .field-multiselect');
    
    inputElements.forEach(element => {
        // 添加焦点状态样式
        element.addEventListener('focus', function() {
            this.classList.add('editing');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('editing');
        });
        
        // 为输入框添加变化监听
        element.addEventListener('input', function() {
            // 可以在这里添加实时保存或其他逻辑
            console.log('Field changed:', this.dataset.field, this.value);
        });
    });
    
    // 为多选字段添加变化监听
    const multiselects = elements.previewContent.querySelectorAll('.field-multiselect[data-field]');
    multiselects.forEach(select => {
        select.addEventListener('change', function() {
            const fieldName = this.dataset.field;
            const selectedValues = Array.from(this.selectedOptions).map(option => option.value);
            console.log('Multi-select field changed:', fieldName, selectedValues);
        });
    });
}

// 保存草稿
function saveDraft() {
    const selectedSystemTypes = elements.systemTypeSelect.querySelectorAll('input[type="checkbox"]:checked');
    const systemTypes = Array.from(selectedSystemTypes).map(checkbox => checkbox.value);
    const selectedModules = elements.moduleSelect.querySelectorAll('input[type="checkbox"]:checked');
    const modules = Array.from(selectedModules).map(checkbox => checkbox.value);
    
    const draft = {
        description: elements.issueDescription.value,
        systemTypes: systemTypes,
        modules: modules,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('feedbackBridge_draft', JSON.stringify(draft));
}

// 加载草稿
function loadDraftData() {
    const draft = localStorage.getItem('feedbackBridge_draft');
    if (draft) {
        try {
            const data = JSON.parse(draft);
            elements.issueDescription.value = data.description || '';
            
            // 设置系统类型复选框的选中状态
            if (data.systemTypes && data.systemTypes.length > 0) {
                const systemTypeCheckboxes = elements.systemTypeSelect.querySelectorAll('input[type="checkbox"]');
                systemTypeCheckboxes.forEach(checkbox => {
                    checkbox.checked = data.systemTypes.includes(checkbox.value);
                });
            }
            
            // 设置模块复选框的选中状态
            if (data.modules && data.modules.length > 0) {
                const moduleCheckboxes = elements.moduleSelect.querySelectorAll('input[type="checkbox"]');
                moduleCheckboxes.forEach(checkbox => {
                    checkbox.checked = data.modules.includes(checkbox.value);
                });
            }
            
            // 检查按钮状态和更新字数统计
            checkConvertButtonState();
        } catch (error) {
            console.error('加载草稿失败:', error);
        }
    }
}

// 保存到历史记录
function saveToHistory(result) {
    const history = JSON.parse(localStorage.getItem('feedbackBridge_history') || '[]');
    
    // 创建一个可序列化的结果副本
    const serializableResult = {
        ...result,
        files: result.files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        }))
    };
    
    history.unshift(serializableResult);
    
    // 只保留最近50条记录
    if (history.length > 50) {
        history.splice(50);
    }
    
    localStorage.setItem('feedbackBridge_history', JSON.stringify(history));
}

// 显示历史记录
async function showHistory() {
    console.log('showHistory 函数被调用');
    try {
        showNotification('正在加载历史记录...', 'info');
        
        const userId = getCurrentUserId();
        console.log('用户ID:', userId);
        
        // 首先尝试从localStorage获取历史记录作为降级方案
        const localHistory = JSON.parse(localStorage.getItem('feedbackBridge_history') || '[]');
        console.log('本地历史记录:', localHistory);
        
        try {
            const response = await fetch(`http://localhost:8000/api/history/list?user_id=${userId}&page=1&page_size=20`, {
                timeout: 5000 // 5秒超时
            });
        console.log('API响应状态:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('API响应数据:', result);
            
            if (result.success) {
                    // 使用服务器数据
                console.log('准备显示抽屉，数据:', result.data);
                displayHistoryModal(result.data || [], result.pagination || {total: 0, page: 1, page_size: 20, total_pages: 0});
                    return;
                }
            }
        } catch (apiError) {
            console.warn('API调用失败，使用本地数据:', apiError);
        }
        
        // 如果API失败，使用本地存储的历史记录
        if (localHistory.length > 0) {
            console.log('使用本地历史记录数据');
            const pagination = {
                total: localHistory.length,
                page: 1,
                page_size: 20,
                total_pages: Math.ceil(localHistory.length / 20)
            };
            displayHistoryModal(localHistory, pagination);
        } else {
            // 显示空状态
            displayHistoryModal([], {total: 0, page: 1, page_size: 20, total_pages: 0});
        }
        
    } catch (error) {
        console.error('获取历史记录失败:', error);
        showNotification('获取历史记录失败，请重试', 'error');
    }
}

// 显示草稿箱
function showDrafts() {
    const draft = localStorage.getItem('feedbackBridge_draft');
    
    if (!draft) {
        showNotification('暂无草稿', 'info');
        return;
    }
    
    showNotification('已加载草稿内容', 'success');
}

// 显示历史记录抽屉
function displayHistoryModal(historyData, pagination) {
    console.log('displayHistoryModal 被调用，数据:', historyData, '分页:', pagination);
    
    // 创建抽屉HTML
    const drawerHtml = `
        <div class="history-drawer-overlay" id="historyDrawerOverlay" onclick="closeHistoryModal()">
            <div class="history-drawer" id="historyDrawer" onclick="event.stopPropagation()">
                <div class="history-drawer-header">
                    <h2>转化历史记录</h2>
                    <button class="history-close-btn" onclick="closeHistoryModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="history-drawer-body">
                    <div class="history-stats">
                        <span>共 ${pagination.total} 条记录</span>
                        <button class="clear-history-btn" onclick="clearAllHistory()">
                            <i class="fas fa-trash"></i> 清空历史
                        </button>
                    </div>
                    <div class="history-list" id="historyList">
                        ${historyData.length > 0 ? historyData.map(record => {
                            // 兼容不同的数据格式
                            const recordId = record.id || record.timestamp || Date.now();
                            const title = record.title || record.standardFormat?.title || '历史记录';
                            const description = record.original_description || record.description || '';
                            const systemTypes = record.system_types || record.systemTypes || [];
                            const modules = record.modules || [];
                            const createdAt = record.created_at || record.timestamp || new Date().toISOString();
                            
                            return `
                            <div class="history-item" data-id="${recordId}">
                                <div class="history-item-header">
                                    <h3 class="history-title">${title}</h3>
                                    <div class="history-actions">
                                        <button class="history-action-btn view-btn" onclick="viewHistoryDetail('${recordId}')">
                                            <i class="fas fa-eye"></i> 查看
                                        </button>
                                        <button class="history-action-btn delete-btn" onclick="deleteHistoryRecord('${recordId}')">
                                            <i class="fas fa-trash"></i> 删除
                                        </button>
                                    </div>
                                </div>
                                <div class="history-item-content">
                                    <div class="history-description">${description}</div>
                                    <div class="history-meta">
                                        <span class="history-region">${Array.isArray(systemTypes) ? systemTypes.join('、') : systemTypes}</span>
                                        <span class="history-module">${Array.isArray(modules) ? modules.join('、') : modules}</span>
                                        <span class="history-time">${formatDateTime(createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                            `;
                        }).join('') : `
                            <div class="empty-history">
                                <div class="empty-icon">📚</div>
                                <div class="empty-title">暂无历史记录</div>
                                <div class="empty-description">开始转化您的第一个问题，历史记录将在这里显示</div>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 添加到页面
    document.body.insertAdjacentHTML('beforeend', drawerHtml);
    
    // 添加样式
    addHistoryDrawerStyles();
    console.log('样式已添加');
    
    // 确保样式已加载
    setTimeout(() => {
        const testElement = document.querySelector('.history-drawer-overlay');
        if (testElement) {
            console.log('抽屉元素已创建，样式已应用');
        } else {
            console.error('抽屉元素创建失败');
        }
    }, 100);
    
    // 添加动画效果
    setTimeout(() => {
        const overlay = document.getElementById('historyDrawerOverlay');
        const drawer = document.getElementById('historyDrawer');
        console.log('查找抽屉元素:', overlay, drawer);
        
        if (overlay && drawer) {
            console.log('添加show类');
            overlay.classList.add('show');
            drawer.classList.add('show');
        } else {
            console.error('找不到抽屉元素');
        }
    }, 10);
    
    // 添加ESC键关闭功能
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            closeHistoryModal();
            document.removeEventListener('keydown', handleKeyDown);
        }
    };
    document.addEventListener('keydown', handleKeyDown);
}

// 添加历史记录抽屉样式
function addHistoryDrawerStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .history-drawer-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .history-drawer-overlay.show {
            opacity: 1;
        }
        
        .history-drawer {
            position: fixed;
            top: 0;
            right: 0;
            width: 480px;
            height: 100%;
            background: white;
            box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            display: flex;
            flex-direction: column;
        }
        
        .history-drawer.show {
            transform: translateX(0);
        }
        
        .history-drawer-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid #eee;
            background: #f8f9fa;
            flex-shrink: 0;
        }
        
        .history-drawer-header h2 {
            margin: 0;
            color: #333;
            font-size: 18px;
            font-weight: 600;
        }
        
        .history-close-btn {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #666;
            padding: 8px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        
        .history-close-btn:hover {
            color: #333;
            background: #f0f0f0;
        }
        
        .history-drawer-body {
            flex: 1;
            padding: 20px 24px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }
        
        .history-stats {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid #eee;
            flex-shrink: 0;
        }
        
        .history-stats span {
            font-size: 14px;
            color: #666;
            font-weight: 500;
        }
        
        .clear-history-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.2s ease;
        }
        
        .clear-history-btn:hover {
            background: #c82333;
        }
        
        .history-list {
            flex: 1;
            overflow-y: auto;
        }
        
        .history-item {
            border: 1px solid #e9ecef;
            border-radius: 8px;
            margin-bottom: 12px;
            padding: 16px;
            transition: all 0.2s ease;
            background: #fff;
        }
        
        .history-item:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            border-color: #007bff;
        }
        
        .history-item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
        }
        
        .history-title {
            margin: 0;
            font-size: 15px;
            color: #333;
            flex: 1;
            margin-right: 12px;
            line-height: 1.4;
            font-weight: 500;
        }
        
        .history-actions {
            display: flex;
            gap: 6px;
            flex-shrink: 0;
        }
        
        .history-action-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.2s ease;
        }
        
        .history-action-btn.delete-btn {
            background: #dc3545;
        }
        
        .history-action-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        
        .history-description {
            color: #666;
            margin-bottom: 12px;
            line-height: 1.5;
            font-size: 13px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .history-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            font-size: 11px;
            color: #999;
        }
        
        .history-meta span {
            background: #f8f9fa;
            padding: 2px 6px;
            border-radius: 10px;
            border: 1px solid #e9ecef;
        }
        
        .history-region {
            color: #007bff !important;
            background: #e3f2fd !important;
            border-color: #bbdefb !important;
        }
        
        .history-module {
            color: #28a745 !important;
            background: #e8f5e8 !important;
            border-color: #c3e6c3 !important;
        }
        
        .history-time {
            color: #6c757d !important;
            background: #f8f9fa !important;
            border-color: #e9ecef !important;
        }
        
        .empty-history {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            text-align: center;
            color: #999;
        }
        
        .empty-icon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.6;
        }
        
        .empty-title {
            font-size: 18px;
            font-weight: 500;
            color: #666;
            margin-bottom: 8px;
        }
        
        .empty-description {
            font-size: 14px;
            color: #999;
            line-height: 1.5;
            max-width: 280px;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
            .history-drawer {
                width: 100%;
            }
        }
        
        @media (max-width: 480px) {
            .history-drawer-header {
                padding: 16px 20px;
            }
            
            .history-drawer-body {
                padding: 16px 20px;
            }
            
            .history-item {
                padding: 12px;
            }
            
            .history-actions {
                flex-direction: column;
                gap: 4px;
            }
            
            .history-action-btn {
                font-size: 10px;
                padding: 3px 6px;
            }
        }
    `;
    document.head.appendChild(style);
}

// 关闭历史记录抽屉
function closeHistoryModal() {
    const overlay = document.getElementById('historyDrawerOverlay');
    const drawer = document.getElementById('historyDrawer');
    
    if (overlay && drawer) {
        // 添加关闭动画
        overlay.classList.remove('show');
        drawer.classList.remove('show');
        
        // 等待动画完成后移除元素
        setTimeout(() => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
}

// 格式化日期时间
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 查看历史记录详情
async function viewHistoryDetail(recordId) {
    try {
        const userId = getCurrentUserId();
        const response = await fetch(`http://localhost:8000/api/history/detail/${recordId}?user_id=${userId}`);
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                displayHistoryDetailModal(result.data);
            } else {
                showNotification('获取历史记录详情失败', 'error');
            }
        } else {
            throw new Error('获取历史记录详情失败');
        }
    } catch (error) {
        console.error('获取历史记录详情失败:', error);
        showNotification('获取历史记录详情失败，请重试', 'error');
    }
}

// 显示历史记录详情模态框
function displayHistoryDetailModal(record) {
    const modalHtml = `
        <div class="history-detail-modal" id="historyDetailModal">
            <div class="history-detail-content">
                <div class="history-detail-header">
                    <h2>历史记录详情</h2>
                    <button class="history-close-btn" onclick="closeHistoryDetailModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="history-detail-body">
                    <div class="detail-section">
                        <h3>基本信息</h3>
                        <div class="detail-item">
                            <label>标题：</label>
                            <span>${record.title}</span>
                        </div>
                        <div class="detail-item">
                            <label>所属地区：</label>
                            <span>${record.system_types.join('、')}</span>
                        </div>
                        <div class="detail-item">
                            <label>归属终端：</label>
                            <span>${record.modules.join('、')}</span>
                        </div>
                        <div class="detail-item">
                            <label>创建时间：</label>
                            <span>${formatDateTime(record.created_at)}</span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>原始描述</h3>
                        <div class="detail-content">${record.original_description}</div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>转化结果</h3>
                        <div class="standard-format-preview">
                            ${Object.entries(record.standard_format || {}).map(([key, value]) => `
                                <div class="format-item">
                                    <label>${key}：</label>
                                    <span>${value}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-actions">
                        <button class="action-btn regenerate-btn" onclick="regenerateFromHistory('${record.id}')">
                            <i class="fas fa-redo"></i> 重新转化
                        </button>
                        <button class="action-btn copy-btn" onclick="copyHistoryContent('${record.id}')">
                            <i class="fas fa-copy"></i> 复制内容
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    addHistoryDetailModalStyles();
}

// 添加历史记录详情模态框样式
function addHistoryDetailModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .history-detail-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1001;
        }
        
        .history-detail-content {
            background: white;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .history-detail-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
            background: #f8f9fa;
        }
        
        .history-detail-body {
            padding: 20px;
            max-height: 60vh;
            overflow-y: auto;
        }
        
        .detail-section {
            margin-bottom: 25px;
        }
        
        .detail-section h3 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 16px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 5px;
        }
        
        .detail-item {
            display: flex;
            margin-bottom: 10px;
        }
        
        .detail-item label {
            font-weight: bold;
            min-width: 80px;
            color: #666;
        }
        
        .detail-content {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            line-height: 1.5;
            color: #333;
        }
        
        .standard-format-preview {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
        }
        
        .format-item {
            display: flex;
            margin-bottom: 8px;
        }
        
        .format-item label {
            font-weight: bold;
            min-width: 100px;
            color: #666;
        }
        
        .detail-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        
        .action-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        
        .action-btn:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
}

// 关闭历史记录详情模态框
function closeHistoryDetailModal() {
    const modal = document.getElementById('historyDetailModal');
    if (modal) {
        modal.remove();
    }
}

// 删除历史记录
async function deleteHistoryRecord(recordId) {
    if (!confirm('确定要删除这条历史记录吗？')) {
        return;
    }
    
    try {
        const userId = getCurrentUserId();
        const response = await fetch(`http://localhost:8000/api/history/delete/${recordId}?user_id=${userId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                showNotification('历史记录删除成功', 'success');
                // 重新加载历史记录列表
                closeHistoryModal();
                setTimeout(() => {
                    showHistory();
                }, 350);
            } else {
                showNotification('删除历史记录失败', 'error');
            }
        } else {
            throw new Error('删除历史记录失败');
        }
    } catch (error) {
        console.error('删除历史记录失败:', error);
        showNotification('删除历史记录失败，请重试', 'error');
    }
}

// 清空所有历史记录
async function clearAllHistory() {
    if (!confirm('确定要清空所有历史记录吗？此操作不可恢复！')) {
        return;
    }
    
    try {
        const userId = getCurrentUserId();
        const response = await fetch(`http://localhost:8000/api/history/clear?user_id=${userId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                showNotification(result.message, 'success');
                closeHistoryModal();
            } else {
                showNotification('清空历史记录失败', 'error');
            }
        } else {
            throw new Error('清空历史记录失败');
        }
    } catch (error) {
        console.error('清空历史记录失败:', error);
        showNotification('清空历史记录失败，请重试', 'error');
    }
}

// 从历史记录重新转化
async function regenerateFromHistory(recordId) {
    try {
        const userId = getCurrentUserId();
        const response = await fetch(`http://localhost:8000/api/history/detail/${recordId}?user_id=${userId}`);
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                const record = result.data;
                
                // 填充表单
                elements.issueDescription.value = record.original_description;
                
                // 设置系统类型复选框
                const systemTypeCheckboxes = elements.systemTypeSelect.querySelectorAll('input[type="checkbox"]');
                systemTypeCheckboxes.forEach(checkbox => {
                    checkbox.checked = record.system_types.includes(checkbox.value);
                });
                
                // 设置模块复选框
                const moduleCheckboxes = elements.moduleSelect.querySelectorAll('input[type="checkbox"]');
                moduleCheckboxes.forEach(checkbox => {
                    checkbox.checked = record.modules.includes(checkbox.value);
                });
                
                // 关闭模态框
                closeHistoryDetailModal();
                closeHistoryModal();
                
                // 自动触发转化
                setTimeout(() => {
                    handleConvert();
                }, 500);
                
                showNotification('已加载历史记录，开始重新转化...', 'success');
            } else {
                showNotification('获取历史记录失败', 'error');
            }
        } else {
            throw new Error('获取历史记录失败');
        }
    } catch (error) {
        console.error('重新转化失败:', error);
        showNotification('重新转化失败，请重试', 'error');
    }
}

// 复制历史记录内容
function copyHistoryContent(recordId) {
    // 这里可以实现复制功能
    showNotification('复制功能待实现', 'info');
}


// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 文件上传和删除功能
let currentScreenshots = [];
let currentAttachments = [];

// 处理截图上传
document.addEventListener('change', function(e) {
    if (e.target.id === 'screenshotUpload') {
        const files = Array.from(e.target.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/') && 
            (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'));
        
        if (imageFiles.length !== files.length) {
            alert('只支持 .jpg 和 .png 格式的图片');
        }
        
        if (imageFiles.length > 0) {
            currentScreenshots = [...currentScreenshots, ...imageFiles];
            updateScreenshotDisplay();
        }
        
        // 清空input
        e.target.value = '';
    }
    
    if (e.target.id === 'attachmentUpload') {
        const files = Array.from(e.target.files);
        const allowedTypes = ['application/pdf', 'video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
        const validFiles = files.filter(file => allowedTypes.includes(file.type));
        
        if (validFiles.length !== files.length) {
            alert('只支持 PDF 和视频格式的附件');
        }
        
        if (validFiles.length > 0) {
            currentAttachments = [...currentAttachments, ...validFiles];
            updateAttachmentDisplay();
        }
        
        // 清空input
        e.target.value = '';
    }
});

// 更新截图显示
function updateScreenshotDisplay() {
    const screenshotField = document.querySelector('[data-field="screenshots"] .attachment-text');
    if (screenshotField) {
        screenshotField.textContent = currentScreenshots.length > 0 ? 
            '已上传 ' + currentScreenshots.length + ' 张截图' : '暂无截图';
    }
    
    // 更新图片预览
    const previewContainer = document.getElementById('screenshotPreviewContainer');
    if (previewContainer) {
        if (currentScreenshots.length > 0) {
            previewContainer.innerHTML = currentScreenshots.map((file, index) => {
                try {
                    const imageUrl = URL.createObjectURL(file);
                    return `
                        <div class="screenshot-preview-item">
                            <img src="${imageUrl}" alt="${file.name}" class="screenshot-preview-image">
                            <div class="screenshot-overlay">
                                <div class="screenshot-filename">${file.name}</div>
                                <button type="button" class="delete-single-btn" data-index="${index}" onclick="removeSingleScreenshot(${index})">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    `;
                } catch (error) {
                    console.error('Error creating image URL:', error);
                    return '';
                }
            }).join('');
        } else {
            previewContainer.innerHTML = '';
        }
    }
}

// 更新附件显示
function updateAttachmentDisplay() {
    const attachmentField = document.querySelector('[data-field="attachments"] .attachment-text');
    if (attachmentField) {
        attachmentField.textContent = currentAttachments.length > 0 ? 
            currentAttachments.map(f => f.name).join(', ') : '暂无附件';
    }
    
    // 更新删除按钮显示
    const deleteBtn = document.querySelector('[data-field="attachments"] .delete-btn');
    if (deleteBtn) {
        deleteBtn.style.display = currentAttachments.length > 0 ? 'inline-block' : 'none';
    }
}

// 删除单张截图
function removeSingleScreenshot(index) {
    if (index >= 0 && index < currentScreenshots.length) {
        currentScreenshots.splice(index, 1);
        updateScreenshotDisplay();
    }
}

// 删除所有截图
function removeScreenshots() {
    currentScreenshots = [];
    updateScreenshotDisplay();
}

// 删除附件
function removeAttachments() {
    currentAttachments = [];
    updateAttachmentDisplay();
}


// Tab切换处理
function handleTabSwitch(event) {
    console.log('handleTabSwitch 被调用');
    const clickedTab = event.target;
    const templateType = clickedTab.dataset.template;
    
    console.log('点击的标签:', clickedTab.textContent);
    console.log('模板类型:', templateType);
    
    // 检查是否已经激活
    if (clickedTab.classList.contains('active')) {
        console.log('标签已经激活，无需切换');
        return;
    }
    
    // 移除所有tab的active状态
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        console.log('移除active状态:', tab.textContent);
    });
    
    // 添加当前tab的active状态
    clickedTab.classList.add('active');
    console.log('添加active状态:', clickedTab.textContent);
    
    // 根据模板类型更新界面内容
    updateTemplateContent(templateType);
    
    // 显示切换提示
    const templateName = templateType === 'design' ? '设计体验问题模板' : '用户原声清洗模板';
    showNotification(`已切换到${templateName}`, 'info');
}

// 开始新会话
function startNewSession() {
    // 如果正在转换中，不允许开始新会话
    if (isConverting) return;
    
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

// 用户原声清洗模板功能
const OriginalSoundTemplate = {
    currentInputType: 'text',
    initialized: false,
    
    // 初始化用户原声清洗模板
    init() {
        if (this.initialized) {
            console.log('用户原声清洗模板已经初始化，跳过重复初始化');
            return;
        }
        
        console.log('初始化用户原声清洗模板...');
        this.initializeEventListeners();
        // 移除过早的 initializeFileUpload 调用，它会在切换到录音原声时被调用
        // this.initializeFileUpload();
        this.initializeFormValidation();
        
        // 确保语言切换卡片显示
        const languageSwitchCard = document.getElementById('languageSwitchCard');
        if (languageSwitchCard) {
            languageSwitchCard.style.display = 'block';
            languageSwitchCard.style.visibility = 'visible';
            languageSwitchCard.style.opacity = '1';
            console.log('初始化: 确保语言切换卡片显示');
        } else {
            console.error('初始化: 找不到语言切换卡片');
        }
        
        // 标记为已初始化
        this.initialized = true;
    },
    
    // 初始化事件监听器
    initializeEventListeners() {
        // 输入类型切换
        document.querySelectorAll('.input-type-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const inputType = e.currentTarget.dataset.type;
                this.switchInputType(inputType);
            });
        });
        
        // 原声文本输入监听
        const originalSoundText = document.getElementById('originalSoundText');
        if (originalSoundText) {
            originalSoundText.addEventListener('input', () => {
                this.updateCharCount();
            });
        }
        
        // 转化按钮（避免重复绑定）
        const convertBtn = document.getElementById('originalSoundConvertBtn');
        if (convertBtn && !convertBtn.hasAttribute('data-listener-added')) {
            convertBtn.addEventListener('click', () => {
                console.log('转化按钮被点击');
                this.convertOriginalSound();
            });
            convertBtn.setAttribute('data-listener-added', 'true');
        }
    },
    
    // 切换输入类型
    switchInputType(inputType) {
        this.currentInputType = inputType;
        
        // 更新标签页状态
        document.querySelectorAll('.input-type-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-type="${inputType}"]`).classList.add('active');
        
        // 更新内容显示
        document.querySelectorAll('.input-type-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // 只有当对应的输入内容元素存在时才添加active类
        const inputContentElement = document.getElementById(`${inputType}InputContent`);
        if (inputContentElement) {
            inputContentElement.classList.add('active');
        }
        
        // 控制各个卡片的显示和移除
        console.log('switchInputType: 输入类型 =', inputType);
        
        // 处理用户原声卡片
        const userOriginalSoundCard = document.getElementById('userOriginalSoundCard');
        if (inputType === 'text') {
            // 文本原声：显示用户原声卡片
            if (userOriginalSoundCard) {
                userOriginalSoundCard.style.display = 'block';
                userOriginalSoundCard.style.visibility = 'visible';
                userOriginalSoundCard.style.opacity = '1';
                console.log('switchInputType: 显示用户原声卡片');
            } else {
                // 如果卡片不存在，需要重新创建
                this.createUserOriginalSoundCard();
                console.log('switchInputType: 重新创建用户原声卡片');
            }
        } else {
            // 录音原声或Excel文件：完全移除用户原声卡片
            if (userOriginalSoundCard) {
                userOriginalSoundCard.remove();
                console.log('switchInputType: 完全移除用户原声卡片');
            }
        }
        
        // 处理音频上传卡片
        const audioInputContent = document.getElementById('audioInputContent');
        console.log('🎵 处理音频上传卡片，输入类型:', inputType, '卡片存在:', !!audioInputContent);
        if (inputType === 'audio') {
            // 录音原声：显示音频上传卡片
            if (audioInputContent) {
                audioInputContent.style.display = 'block';
                audioInputContent.style.visibility = 'visible';
                audioInputContent.style.opacity = '1';
                console.log('✅ switchInputType: 显示音频上传卡片');
            } else {
                // 如果卡片不存在，需要重新创建
                console.log('🔧 switchInputType: 重新创建音频上传卡片');
                this.createAudioUploadCard();
            }
            
            // 无论卡片是显示还是重新创建，都需要绑定事件监听器
            setTimeout(() => {
                this.initializeFileUpload();
                console.log('✅ switchInputType: 音频上传事件监听器已重新绑定');
            }, 100);
        } else {
            // 文本原声或Excel文件：完全移除音频上传卡片
            if (audioInputContent) {
                audioInputContent.remove();
                console.log('🗑️ switchInputType: 完全移除音频上传卡片');
            }
        }
        
        // 处理Excel上传卡片
        const excelInputContent = document.getElementById('excelInputContent');
        console.log('📊 处理Excel上传卡片，输入类型:', inputType, '卡片存在:', !!excelInputContent);
        if (inputType === 'excel') {
            // Excel文件：显示Excel上传卡片
            if (excelInputContent) {
                excelInputContent.style.display = 'block';
                excelInputContent.style.visibility = 'visible';
                excelInputContent.style.opacity = '1';
                console.log('✅ switchInputType: 显示Excel上传卡片');
            } else {
                // 如果卡片不存在，需要重新创建
                console.log('🔧 switchInputType: 重新创建Excel上传卡片');
                this.createExcelUploadCard();
            }
            
            // 无论卡片是显示还是重新创建，都需要绑定事件监听器
            setTimeout(() => {
                this.initializeFileUpload();
                console.log('✅ switchInputType: Excel上传事件监听器已重新绑定');
            }, 100);
        } else {
            // 文本原声或录音原声：完全移除Excel上传卡片
            if (excelInputContent) {
                excelInputContent.remove();
                console.log('🗑️ switchInputType: 完全移除Excel上传卡片');
            }
        }
        
        // 确保语言切换卡片始终显示
        const languageSwitchCard = document.getElementById('languageSwitchCard');
        if (languageSwitchCard) {
            languageSwitchCard.style.display = 'block';
            languageSwitchCard.style.visibility = 'visible';
            languageSwitchCard.style.opacity = '1';
            console.log('switchInputType: 确保语言切换卡片显示');
        } else {
            console.error('找不到语言切换卡片');
        }
    },
    
    // 创建用户原声卡片
    createUserOriginalSoundCard() {
        // 找到用户原声清洗输入区域的容器
        const originalSoundInputGroup = document.getElementById('originalSoundInputGroup');
        if (!originalSoundInputGroup) {
            console.error('找不到用户原声清洗输入区域');
            return;
        }
        
        // 创建用户原声卡片HTML
        const userOriginalSoundCardHTML = `
            <div class="input-card" id="userOriginalSoundCard">
                <div class="input-group">
                    <label for="originalSoundText" class="input-label">
                        用户原声
                    </label>
                    <div class="textarea-container">
                        <textarea 
                            id="originalSoundText" 
                            class="textarea-input antd-style" 
                            placeholder="请输入用户原声内容..."
                            rows="6"
                        ></textarea>
                    </div>
                </div>
            </div>
        `;
        
        // 在语言切换卡片之前插入用户原声卡片
        const languageSwitchCard = document.getElementById('languageSwitchCard');
        if (languageSwitchCard) {
            languageSwitchCard.insertAdjacentHTML('beforebegin', userOriginalSoundCardHTML);
            console.log('用户原声卡片已重新创建');
        } else {
            console.error('找不到语言切换卡片，无法插入用户原声卡片');
        }
    },
    
    // 创建音频上传卡片
    createAudioUploadCard() {
        console.log('🎵 开始创建音频上传卡片');
        const originalSoundInputGroup = document.getElementById('originalSoundInputGroup');
        if (!originalSoundInputGroup) {
            console.error('找不到用户原声清洗输入区域');
            return;
        }
        
        const audioUploadCardHTML = `
            <div class="input-type-content" id="audioInputContent" style="display: block;">
                <div class="input-group">
                    <label class="input-label">上传音频文件</label>
                    <div class="file-upload-area antd-style" id="audioUploadArea">
                        <div class="upload-content">
                            <i class="fas fa-microphone upload-icon"></i>
                            <p class="upload-text">点击或拖拽音频文件到此区域上传</p>
                            <p class="upload-hint">支持 MP3、WAV、M4A、OGG 格式，最大 25MB</p>
                        </div>
                        <input type="file" id="audioFileInput" accept="audio/*" style="display: none;">
                    </div>
                    <div class="uploaded-files" id="audioUploadedFiles"></div>
                </div>
            </div>
        `;
        
        // 在语言切换卡片之前插入音频上传卡片
        const languageSwitchCard = document.getElementById('languageSwitchCard');
        if (languageSwitchCard) {
            languageSwitchCard.insertAdjacentHTML('beforebegin', audioUploadCardHTML);
            console.log('✅ 音频上传卡片已重新创建');
            
            // 确保卡片显示
            const audioInputContent = document.getElementById('audioInputContent');
            if (audioInputContent) {
                audioInputContent.style.display = 'block';
                audioInputContent.style.visibility = 'visible';
                audioInputContent.style.opacity = '1';
                console.log('✅ 音频上传卡片已设置为显示状态');
            }
        } else {
            console.error('❌ 找不到语言切换卡片，无法插入音频上传卡片');
        }
    },
    
    // 创建Excel上传卡片
    createExcelUploadCard() {
        console.log('📊 开始创建Excel上传卡片');
        const originalSoundInputGroup = document.getElementById('originalSoundInputGroup');
        if (!originalSoundInputGroup) {
            console.error('找不到用户原声清洗输入区域');
            return;
        }
        
        const excelUploadCardHTML = `
            <div class="input-type-content" id="excelInputContent" style="display: block;">
                <div class="input-group">
                    <label class="input-label">上传Excel文件</label>
                    <div class="file-upload-area antd-style" id="excelUploadArea">
                        <div class="upload-content">
                            <i class="fas fa-file-excel upload-icon"></i>
                            <p class="upload-text">点击或拖拽Excel文件到此区域上传</p>
                            <p class="upload-hint">支持 .xlsx、.xls 格式，最大 20MB</p>
                        </div>
                        <input type="file" id="excelFileInput" accept=".xlsx,.xls" style="display: none;">
                    </div>
                    <div class="uploaded-files" id="excelUploadedFiles"></div>
                </div>
            </div>
        `;
        
        // 在语言切换卡片之前插入Excel上传卡片
        const languageSwitchCard = document.getElementById('languageSwitchCard');
        if (languageSwitchCard) {
            languageSwitchCard.insertAdjacentHTML('beforebegin', excelUploadCardHTML);
            console.log('✅ Excel上传卡片已重新创建');
            
            // 确保卡片显示
            const excelInputContent = document.getElementById('excelInputContent');
            if (excelInputContent) {
                excelInputContent.style.display = 'block';
                excelInputContent.style.visibility = 'visible';
                excelInputContent.style.opacity = '1';
                console.log('✅ Excel上传卡片已设置为显示状态');
            }
        } else {
            console.error('❌ 找不到语言切换卡片，无法插入Excel上传卡片');
        }
    },
    
    // 初始化文件上传
    initializeFileUpload() {
        // 音频文件上传
        const audioUploadArea = document.getElementById('audioUploadArea');
        const audioFileInput = document.getElementById('audioFileInput');
        
        console.log('检查音频上传元素:', {
            audioUploadArea: !!audioUploadArea,
            audioFileInput: !!audioFileInput
        });
        
        if (audioUploadArea && audioFileInput) {
            console.log('找到音频上传元素，开始绑定事件');
            
            // 先移除旧的事件监听器，防止重复绑定
            audioUploadArea.onclick = null;
            audioFileInput.onchange = null;
            
            // 移除通过addEventListener绑定的事件监听器
            audioUploadArea.removeEventListener('click', audioUploadArea._clickHandler);
            audioFileInput.removeEventListener('change', audioFileInput._changeHandler);
            
            // 创建事件处理器并保存到元素上
            audioUploadArea._clickHandler = (e) => {
                console.log('音频上传区域被点击');
                // 移除preventDefault和stopPropagation，让点击事件正常工作
                
                // 确保文件输入元素存在且可点击
                if (audioFileInput) {
                    console.log('触发音频文件选择');
                    audioUploadArea.focus(); // 先获得焦点，与图片上传保持一致
                    audioFileInput.click();
                } else {
                    console.error('音频文件输入元素不存在');
                }
            };
            
            audioFileInput._changeHandler = (e) => {
                console.log('音频文件被选择');
                this.handleAudioFileUpload(e);
            };
            
            // 绑定事件监听器
            audioUploadArea.addEventListener('click', audioUploadArea._clickHandler);
            audioFileInput.addEventListener('change', audioFileInput._changeHandler);
            
            // 添加拖拽功能（使用与图片上传相同的处理方式）
            audioUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                audioUploadArea.classList.add('dragover');
                console.log('音频拖拽悬停');
            });
            
            audioUploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                audioUploadArea.classList.remove('dragover');
                console.log('音频拖拽离开');
            });
            
            audioUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                audioUploadArea.classList.remove('dragover');
                console.log('音频文件拖拽放下');
                
                const files = Array.from(e.dataTransfer.files);
                if (files.length > 0) {
                    console.log('拖拽音频文件:', files[0].name);
                    // 创建文件列表并触发change事件
                    const dt = new DataTransfer();
                    dt.items.add(files[0]);
                    audioFileInput.files = dt.files;
                    
                    // 触发change事件
                    const changeEvent = new Event('change', { bubbles: true });
                    audioFileInput.dispatchEvent(changeEvent);
                }
            });
            
            console.log('音频上传事件监听器已绑定');
        } else {
            console.error('找不到音频上传元素:', {
                audioUploadArea: !!audioUploadArea,
                audioFileInput: !!audioFileInput
            });
        }
        
        // Excel文件上传
        const excelUploadArea = document.getElementById('excelUploadArea');
        const excelFileInput = document.getElementById('excelFileInput');
        
        if (excelUploadArea && excelFileInput) {
            console.log('找到Excel上传元素，开始绑定事件');
            
            // 先移除旧的事件监听器，防止重复绑定
            excelUploadArea.onclick = null;
            excelFileInput.onchange = null;
            
            // 使用与图片上传相同的绑定方式
            excelUploadArea.addEventListener('click', (e) => {
                console.log('Excel上传区域被点击');
                // 移除preventDefault和stopPropagation，让点击事件正常工作
                
                // 确保文件输入元素存在且可点击
                if (excelFileInput) {
                    console.log('触发Excel文件选择');
                    excelUploadArea.focus(); // 先获得焦点，与图片上传保持一致
                    excelFileInput.click();
                } else {
                    console.error('Excel文件输入元素不存在');
                }
            });
            
            excelFileInput.addEventListener('change', (e) => {
                console.log('Excel文件被选择');
                this.handleExcelFileUpload(e);
            });
            
            // 添加拖拽功能（使用与图片上传相同的处理方式）
            excelUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                excelUploadArea.classList.add('dragover');
                console.log('Excel拖拽悬停');
            });
            
            excelUploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                excelUploadArea.classList.remove('dragover');
                console.log('Excel拖拽离开');
            });
            
            excelUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                excelUploadArea.classList.remove('dragover');
                console.log('Excel文件拖拽放下');
                
                const files = Array.from(e.dataTransfer.files);
                if (files.length > 0) {
                    console.log('拖拽Excel文件:', files[0].name);
                    // 创建文件列表并触发change事件
                    const dt = new DataTransfer();
                    dt.items.add(files[0]);
                    excelFileInput.files = dt.files;
                    
                    // 触发change事件
                    const changeEvent = new Event('change', { bubbles: true });
                    excelFileInput.dispatchEvent(changeEvent);
                }
            });
            
            console.log('Excel上传事件监听器已绑定');
        } else {
            console.error('找不到Excel上传元素:', {
                excelUploadArea: !!excelUploadArea,
                excelFileInput: !!excelFileInput
            });
        }
    },
    
    // 处理音频文件上传
    handleAudioFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        console.log('🎵 处理音频文件上传:', file.name, file.size, file.type);
        
        // 验证文件类型
        if (!file.type.startsWith('audio/')) {
            showNotification('请选择音频文件', 'error');
            return;
        }
        
        // 验证文件大小 (25MB)
        if (file.size > 25 * 1024 * 1024) {
            showNotification('音频文件超过25MB限制', 'error');
            return;
        }
        
        // 存储文件到全局变量，供processAudioOriginalSound使用
        window.selectedAudioFile = file;
        console.log('✅ 音频文件已存储到全局变量:', file.name);
        
        this.displayUploadedFile(file, 'audioUploadedFiles');
        
        // 清空input，允许重复选择同一文件
        event.target.value = '';
    },
    
    // 处理Excel文件上传
    handleExcelFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // 验证文件类型
        const validTypes = ['.xlsx', '.xls'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!validTypes.includes(fileExtension)) {
            showNotification('请选择Excel文件(.xlsx或.xls)', 'error');
            return;
        }
        
        // 验证文件大小 (20MB)
        if (file.size > 20 * 1024 * 1024) {
            showNotification('Excel文件超过20MB限制', 'error');
            return;
        }
        
        this.displayUploadedFile(file, 'excelUploadedFiles');
        
        // 清空input，允许重复选择同一文件
        event.target.value = '';
    },
    
    // 显示上传的文件
    displayUploadedFile(file, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // 根据文件类型选择图标
        let fileIcon = 'fas fa-file';
        if (file.type.startsWith('audio/')) {
            fileIcon = 'fas fa-file-audio';
        } else if (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
            fileIcon = 'fas fa-file-excel';
        }
        
        const fileItem = document.createElement('div');
        fileItem.className = 'uploaded-file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="${fileIcon}"></i>
                <span class="file-name">${file.name}</span>
            </div>
            <button class="delete-file-btn" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.innerHTML = '';
        container.appendChild(fileItem);
    },
    
    // 格式化文件大小
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    // 更新字符计数
    updateCharCount() {
        const textarea = document.getElementById('originalSoundText');
        const charCount = document.getElementById('originalSoundCharCount');
        
        if (textarea && charCount) {
            const length = textarea.value.length;
            charCount.textContent = `${length} 字 (不少于5个字)`;
            charCount.style.color = length < 5 ? '#ff4d4f' : '#666';
        }
    },
    
    // 初始化表单验证
    initializeFormValidation() {
        // 这里可以添加表单验证逻辑
    },
    
    // 转化用户原声
    async convertOriginalSound() {
        if (isConverting) return;
        
        try {
            isConverting = true;
            showLoadingModal('正在处理原声内容，请稍候...');
            
            let result;
            
            if (this.currentInputType === 'text') {
                result = await this.processTextOriginalSound();
            } else if (this.currentInputType === 'audio') {
                result = await this.processAudioOriginalSound();
            } else if (this.currentInputType === 'excel') {
                result = await this.processExcelOriginalSound();
            }
            
            console.log('🔍 处理结果检查:', {
                result: result,
                hasSuccess: result && result.success,
                resultType: typeof result
            });
            
            if (result && result.success) {
                console.log('✅ 调用displayOriginalSoundResult');
                this.displayOriginalSoundResult(result);
                showNotification('原声处理完成', 'success');
            } else {
                console.log('❌ 处理失败，结果:', result);
                showNotification(result?.message || '处理失败', 'error');
            }
            
        } catch (error) {
            console.error('原声处理失败:', error);
            showNotification('处理失败: ' + error.message, 'error');
        } finally {
            isConverting = false;
            hideLoadingModal();
        }
    },
    
    // 处理文本原声
    async processTextOriginalSound() {
        const userInput = document.getElementById('originalSoundText').value.trim();
        const sourceLanguageElement = document.querySelector('input[name="sourceLanguage"]:checked');
        const targetLanguageElement = document.querySelector('input[name="targetLanguage"]:checked');
        
        if (!sourceLanguageElement || !targetLanguageElement) {
            throw new Error('请选择源语言和目标语言');
        }
        
        const sourceLanguage = sourceLanguageElement.value;
        const targetLanguage = targetLanguageElement.value;
        
        if (!userInput || userInput.length < 5) {
            throw new Error('请输入至少5个字符的用户原声内容');
        }
        
        const formData = new FormData();
        formData.append('user_input', userInput);
        formData.append('source_language', sourceLanguage);
        formData.append('target_language', targetLanguage);
        formData.append('user_id', 'default_user');
        
        const response = await fetch('http://localhost:8001/api/original-sound/process-text', {
            method: 'POST',
            body: formData
        });
        
        return await response.json();
    },
    
    // 处理录音原声
    async processAudioOriginalSound() {
        console.log('🎵 开始处理音频原声');
        
        // 尝试多种方式获取音频文件
        let audioFile = null;
        
        // 方式1：从input元素获取
        const audioFileInput = document.getElementById('audioFileInput');
        if (audioFileInput && audioFileInput.files && audioFileInput.files[0]) {
            audioFile = audioFileInput.files[0];
            console.log('✅ 从input元素获取音频文件:', audioFile.name);
        }
        
        // 方式2：从已上传的文件显示区域获取
        if (!audioFile) {
            const uploadedFilesContainer = document.getElementById('audioUploadedFiles');
            if (uploadedFilesContainer && uploadedFilesContainer.dataset.file) {
                // 尝试从data属性获取文件信息
                const fileInfo = JSON.parse(uploadedFilesContainer.dataset.file);
                console.log('📁 从已上传文件区域获取文件信息:', fileInfo);
            }
        }
        
        // 方式3：检查是否有全局存储的音频文件
        if (!audioFile && window.selectedAudioFile) {
            audioFile = window.selectedAudioFile;
            console.log('🌐 从全局变量获取音频文件:', audioFile.name);
        }
        
        const sourceLanguageElement = document.querySelector('input[name="sourceLanguage"]:checked');
        const targetLanguageElement = document.querySelector('input[name="targetLanguage"]:checked');
        
        if (!sourceLanguageElement || !targetLanguageElement) {
            throw new Error('请选择源语言和目标语言');
        }
        
        const sourceLanguage = sourceLanguageElement.value;
        const targetLanguage = targetLanguageElement.value;
        
        console.log('🔍 音频文件检查结果:', {
            audioFile: !!audioFile,
            fileName: audioFile ? audioFile.name : '无',
            sourceLanguage,
            targetLanguage
        });
        
        if (!audioFile) {
            throw new Error('请选择音频文件');
        }
        
        const formData = new FormData();
        formData.append('audio_file', audioFile);
        formData.append('source_language', sourceLanguage);
        formData.append('target_language', targetLanguage);
        formData.append('user_id', 'default_user');

        // 使用稳定端口（8001）。如需切换端口，请仅修改此数组，避免多端口导致的连接拒绝噪音
        const endpoints = [
            'http://localhost:8001/api/original-sound/process-audio'
        ];

        let lastError = null;
        for (const url of endpoints) {
            try {
                console.log('📡 调用接口:', url);
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData
                });

                // 404时尝试下一个端点，其它非2xx也抛错
                if (response.status === 404) {
                    console.warn('⚠️ 接口不存在(404)，尝试下一个端点');
                    lastError = new Error('接口不存在: ' + url);
                    continue;
                }

                if (!response.ok) {
                    // 优先解析JSON错误
                    let errorText = '';
                    try {
                        const maybeJson = await response.json();
                        errorText = maybeJson?.detail || maybeJson?.message || JSON.stringify(maybeJson);
                    } catch (_) {
                        errorText = await response.text();
                    }
                    throw new Error(`接口错误(${response.status}): ${errorText || '未知错误'}`);
                }

                try {
                    return await response.json();
                } catch (e) {
                    throw new Error('解析响应失败');
                }
            } catch (err) {
                console.warn('接口调用失败，尝试下一个端点:', err?.message || err);
                lastError = err;
                // 继续尝试下一个端点
            }
        }

        // 若所有端点均失败，抛出最后一个错误
        throw lastError || new Error('无法连接到后端服务');
    },
    
    // 处理Excel原声
    async processExcelOriginalSound() {
        const excelFile = document.getElementById('excelFileInput').files[0];
        const sourceLanguageElement = document.querySelector('input[name="sourceLanguage"]:checked');
        const targetLanguageElement = document.querySelector('input[name="targetLanguage"]:checked');
        
        if (!sourceLanguageElement || !targetLanguageElement) {
            throw new Error('请选择源语言和目标语言');
        }
        
        const sourceLanguage = sourceLanguageElement.value;
        const targetLanguage = targetLanguageElement.value;
        
        if (!excelFile) {
            throw new Error('请选择Excel文件');
        }
        
        const formData = new FormData();
        formData.append('excel_file', excelFile);
        formData.append('source_language', sourceLanguage);
        formData.append('target_language', targetLanguage);
        formData.append('user_id', 'default_user');
        
        const response = await fetch('http://localhost:8001/api/original-sound/process-excel', {
            method: 'POST',
            body: formData
        });
        
        return await response.json();
    },
    
    // 显示原声处理结果
    displayOriginalSoundResult(result) {
        const previewContent = document.getElementById('previewContent');
        if (!previewContent) return;
        
        const analysis = result.analysis;
        const standardFormat = result.standard_format;
        const transcribedText = result.transcribed_text; // 录音识别文本（若有）
        
        const transcribedBlock = transcribedText
            ? `
                <div class="result-section">
                    <h3>📝 识别文本 <span class="from-api-badge">来自后端</span></h3>
                    <div class="analysis-item">
                        <div class="value transcription">${transcribedText}</div>
                    </div>
                </div>
            `
            : '';

        const resultHTML = `
            <div class="original-sound-result">
                ${transcribedBlock}
                <div class="result-section">
                    <h3>🎭 情感分析</h3>
                    <div class="analysis-item">
                        <span class="label">情感分类</span>
                        <span class="value sentiment ${analysis.sentiment_classification}">${analysis.sentiment_classification}</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">情感强度</span>
                        <span class="value intensity ${analysis.sentiment_intensity}">${analysis.sentiment_intensity}</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">情感分析</span>
                        <div class="value analysis">${analysis.sentiment_analysis}</div>
                    </div>
                </div>
                
                <div class="result-section">
                    <h3>🌐 翻译结果</h3>
                    <div class="analysis-item">
                        <span class="label">原声翻译</span>
                        <div class="value translation">${analysis.original_translation}</div>
                    </div>
                </div>
                
                <div class="result-section">
                    <h3>🧠 智能总结</h3>
                    <div class="analysis-item">
                        <span class="label">核心主旨</span>
                        <div class="value summary">${analysis.ai_optimized_summary}</div>
                    </div>
                    <div class="analysis-item">
                        <span class="label">重点分析</span>
                        <div class="value key-points">${analysis.key_points}</div>
                    </div>
                </div>
            </div>
        `;
        
        previewContent.innerHTML = resultHTML;
        
        // 显示预览操作按钮
        const previewActions = document.getElementById('previewActions');
        if (previewActions) {
            previewActions.style.display = 'flex';
        }
    }
};

