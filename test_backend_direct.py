#!/usr/bin/env python3
import sys
import os
sys.path.append('/Users/didi/zhangzhiqi/feedback-bridge/backend')

from app.services.llm_service import LLMService
from app.services.template_service import TemplateService

async def test_backend_direct():
    print("🚀 直接测试后端服务...")
    
    try:
        # 测试LLM服务
        print("1. 测试LLM服务...")
        llm_service = LLMService()
        print("✅ LLM服务初始化成功")
        
        # 测试模板服务
        print("2. 测试模板服务...")
        template_service = TemplateService()
        templates = await template_service.get_all_templates()
        print(f"✅ 模板服务初始化成功，找到 {len(templates)} 个模板")
        
        # 测试原声分析
        print("3. 测试原声分析...")
        user_input = "Capaciten a sus motociclistas xq no dan con los domicilios y terminan cancelando los servicios y a uno lo dejan con hambre y eso que hasta con la ubicación que les envía uno a través de su app, gracias"
        source_language = "西班牙语"
        target_language = "中文"
        
        result = await llm_service.analyze_original_sound(user_input, source_language, target_language)
        print(f"✅ 原声分析成功: {result}")
        
    except Exception as e:
        print(f"❌ 后端服务测试失败: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_backend_direct())
