#!/usr/bin/env python3
"""
用户原声清洗功能调试脚本
用于排查处理失败的问题
"""

import asyncio
import sys
import os

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.app.services.template_service import TemplateService
from backend.app.services.llm_service import LLMService
from backend.app.services.prompt_service import PromptService

async def test_original_sound_processing():
    """测试原声处理功能"""
    print("🔍 开始调试用户原声清洗功能...")
    
    # 测试数据
    test_data = {
        "user_input": "Capaciten a sus motociclistas xq no dan con los domicilios y terminan cancelando los servicios y a uno lo dejan con hambre y eso que hasta con la ubicación que les envía uno a través de su app, gracias",
        "source_language": "西班牙语",
        "target_language": "中文"
    }
    
    try:
        # 1. 测试模板服务
        print("\n1️⃣ 测试模板服务...")
        template_service = TemplateService()
        template = await template_service.get_template("original_sound_cleaning")
        
        if template:
            print("✅ 模板服务正常，找到用户原声清洗模板")
            print(f"   模板ID: {template.get('id')}")
            print(f"   模板名称: {template.get('name')}")
        else:
            print("❌ 模板服务异常，未找到用户原声清洗模板")
            return False
        
        # 2. 测试提示词服务
        print("\n2️⃣ 测试提示词服务...")
        prompt_service = PromptService()
        prompt_config = prompt_service.get_prompt("original_sound_analysis")
        
        if prompt_config:
            print("✅ 提示词服务正常，找到原声分析提示词")
            print(f"   系统提示词长度: {len(prompt_config.get('system', ''))}")
            print(f"   用户提示词长度: {len(prompt_config.get('user', ''))}")
        else:
            print("❌ 提示词服务异常，未找到原声分析提示词")
            return False
        
        # 3. 测试LLM服务
        print("\n3️⃣ 测试LLM服务...")
        llm_service = LLMService()
        
        # 检查API密钥
        if hasattr(llm_service, 'api_key') and llm_service.api_key:
            print("✅ LLM服务API密钥已配置")
        else:
            print("⚠️ LLM服务API密钥未配置，将使用备用方法")
        
        # 4. 测试原声分析
        print("\n4️⃣ 测试原声分析...")
        analysis_result = await llm_service.analyze_original_sound(
            user_input=test_data["user_input"],
            source_language=test_data["source_language"],
            target_language=test_data["target_language"],
            template=template
        )
        
        if analysis_result:
            print("✅ 原声分析成功")
            print(f"   分析结果字段: {list(analysis_result.keys())}")
            
            # 检查必需字段
            required_fields = [
                "original_translation", "ai_optimized_summary", "key_points",
                "sentiment_classification", "sentiment_intensity", "sentiment_analysis"
            ]
            
            missing_fields = [field for field in required_fields if field not in analysis_result]
            if missing_fields:
                print(f"❌ 缺少必需字段: {missing_fields}")
                return False
            else:
                print("✅ 所有必需字段都存在")
                
            # 显示分析结果
            print("\n📊 分析结果预览:")
            for field, value in analysis_result.items():
                if isinstance(value, str) and len(value) > 50:
                    print(f"   {field}: {value[:50]}...")
                else:
                    print(f"   {field}: {value}")
        else:
            print("❌ 原声分析失败")
            return False
        
        # 5. 测试标准化格式生成
        print("\n5️⃣ 测试标准化格式生成...")
        standard_format = await template_service.generate_standard_format(
            analysis_result, template
        )
        
        if standard_format:
            print("✅ 标准化格式生成成功")
            print(f"   标准化格式字段: {list(standard_format.keys())}")
        else:
            print("❌ 标准化格式生成失败")
            return False
        
        print("\n🎉 所有测试通过！用户原声清洗功能正常")
        return True
        
    except Exception as e:
        print(f"\n❌ 测试过程中出现异常: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

async def main():
    """主函数"""
    print("🚀 启动用户原声清洗功能调试...")
    
    success = await test_original_sound_processing()
    
    if success:
        print("\n✅ 调试完成：功能正常，可以处理用户原声")
    else:
        print("\n❌ 调试完成：发现问题，需要修复")
    
    return success

if __name__ == "__main__":
    asyncio.run(main())

