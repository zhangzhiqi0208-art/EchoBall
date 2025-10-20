#!/usr/bin/env python3
"""
用户原声清洗模板测试脚本
测试三种输入类型的处理功能
"""

import asyncio
import sys
import os

# 添加backend路径到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.services.llm_service import LLMService
from backend.app.services.template_service import TemplateService

async def test_original_sound_analysis():
    """测试原声分析功能"""
    print("🧪 开始测试用户原声清洗功能...")
    
    # 初始化服务
    llm_service = LLMService()
    template_service = TemplateService()
    
    # 测试数据
    test_cases = [
        {
            "user_input": "Deberian de hacer algo para garantizar los tiempos de entrega prometidos y que estos no cambien conforme salen otros pedidos, aveces las personas tienen tiempos contados debido a sus labores y el que cambien a su voluntad, ocaciona que no puedan disfrutar sus alimentos o lo hagan apresurados.",
            "source_language": "西语",
            "target_language": "中文",
            "expected_type": "服务反馈"
        },
        {
            "user_input": "界面设计不够美观，用户体验很差，希望可以优化一下视觉效果",
            "source_language": "中文",
            "target_language": "中文",
            "expected_type": "体验反馈"
        },
        {
            "user_input": "功能缺失，无法完成基本操作，建议增加相关功能",
            "source_language": "中文",
            "target_language": "中文",
            "expected_type": "功能反馈"
        }
    ]
    
    # 获取模板配置
    try:
        template = await template_service.get_template("original_sound_cleaning")
        print(f"✅ 模板配置加载成功: {template.get('name', '未知模板')}")
    except Exception as e:
        print(f"❌ 模板配置加载失败: {str(e)}")
        return
    
    # 测试每个用例
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📝 测试用例 {i}: {test_case['source_language']} -> {test_case['target_language']}")
        print(f"输入: {test_case['user_input'][:50]}...")
        
        try:
            # 调用原声分析
            result = await llm_service.analyze_original_sound(
                user_input=test_case['user_input'],
                source_language=test_case['source_language'],
                target_language=test_case['target_language'],
                template=template
            )
            
            print(f"✅ 分析成功")
            print(f"   反馈类型: {result.get('feedback_type', '未知')}")
            print(f"   使用建议: {result.get('usage_suggestion', '未知')[:50]}...")
            print(f"   翻译结果: {result.get('original_translation', '未知')[:50]}...")
            print(f"   总结内容: {result.get('original_summary', '未知')[:50]}...")
            
            # 验证结果
            if result.get('feedback_type') == test_case['expected_type']:
                print(f"✅ 反馈类型预测正确")
            else:
                print(f"⚠️ 反馈类型预测可能不准确 (期望: {test_case['expected_type']}, 实际: {result.get('feedback_type')})")
                
        except Exception as e:
            print(f"❌ 分析失败: {str(e)}")
    
    print(f"\n🎉 测试完成！")
    
    # 清理资源
    await llm_service.close()

async def test_template_generation():
    """测试模板生成功能"""
    print("\n🧪 测试模板生成功能...")
    
    template_service = TemplateService()
    
    try:
        # 获取原声清洗模板
        template = await template_service.get_template("original_sound_cleaning")
        
        if template:
            print(f"✅ 模板获取成功")
            print(f"   模板ID: {template.get('id', '未知')}")
            print(f"   模板名称: {template.get('name', '未知')}")
            print(f"   模板描述: {template.get('description', '未知')}")
            print(f"   支持输入类型: {template.get('input_types', [])}")
            print(f"   字段数量: {len(template.get('fields', []))}")
        else:
            print(f"❌ 模板获取失败")
            
    except Exception as e:
        print(f"❌ 模板获取异常: {str(e)}")

if __name__ == "__main__":
    print("🚀 用户原声清洗模板测试")
    print("=" * 50)
    
    # 运行测试
    asyncio.run(test_template_generation())
    asyncio.run(test_original_sound_analysis())
