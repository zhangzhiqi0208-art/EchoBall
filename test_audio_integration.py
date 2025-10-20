#!/usr/bin/env python3
"""
测试音频转文字和模板处理的集成功能
"""

import asyncio
import sys
import os
import json
from pathlib import Path

# 添加backend目录到Python路径
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.services.llm_service import LLMService
from app.services.template_service import TemplateService

async def test_audio_to_text():
    """测试音频转文字功能"""
    print("🎤 测试音频转文字功能...")
    
    llm_service = LLMService()
    
    # 测试模拟音频转文字
    mock_audio_path = "test_audio.mp3"
    source_language = "英文"
    
    try:
        # 测试模拟语音识别
        transcribed_text = await llm_service._mock_transcribe_audio(mock_audio_path, source_language)
        print(f"✅ 模拟语音识别成功: {transcribed_text[:100]}...")
        return transcribed_text
    except Exception as e:
        print(f"❌ 音频转文字测试失败: {e}")
        return None

async def test_original_sound_analysis():
    """测试原声分析功能"""
    print("🔍 测试原声分析功能...")
    
    llm_service = LLMService()
    template_service = TemplateService()
    
    # 获取模板
    template = await template_service.get_template("original_sound_cleaning")
    print(f"✅ 获取模板成功: {template['name']}")
    
    # 测试文本
    test_text = "This is a mock transcription result for English audio. The user is reporting an issue with the delivery service where the motorcycle delivery person couldn't find the address and had to cancel the service, leaving the user hungry."
    source_language = "英文"
    target_language = "中文"
    
    try:
        # 测试原声分析
        analysis_result = await llm_service.analyze_original_sound(
            user_input=test_text,
            source_language=source_language,
            target_language=target_language,
            template=template
        )
        
        print("✅ 原声分析成功!")
        print(f"📊 分析结果:")
        print(f"  - 翻译结果: {analysis_result.get('original_translation', 'N/A')[:100]}...")
        print(f"  - AI总结: {analysis_result.get('ai_optimized_summary', 'N/A')[:100]}...")
        print(f"  - 关键要点: {analysis_result.get('key_points', 'N/A')[:100]}...")
        print(f"  - 情感分类: {analysis_result.get('sentiment_classification', 'N/A')}")
        print(f"  - 情感强度: {analysis_result.get('sentiment_intensity', 'N/A')}")
        
        return analysis_result
    except Exception as e:
        print(f"❌ 原声分析测试失败: {e}")
        return None

async def test_template_processing():
    """测试模板处理功能"""
    print("📋 测试模板处理功能...")
    
    template_service = TemplateService()
    
    # 模拟分析结果
    mock_analysis = {
        "original_translation": "这是英文音频的模拟转录结果。用户报告配送服务存在问题，摩托车配送员无法找到地址，不得不取消服务，让用户感到饥饿。",
        "ai_optimized_summary": "用户反馈配送服务存在问题，主要涉及摩托车配送员无法找到地址导致服务取消的问题。",
        "key_points": "• 配送员无法找到地址\n• 服务被取消\n• 用户感到饥饿\n• 即使通过应用发送了位置信息",
        "sentiment_classification": "负向",
        "sentiment_intensity": "中等",
        "sentiment_analysis": "用户表达了对配送服务的不满情绪，主要因为配送员无法找到地址导致服务取消，给用户带来了不便。"
    }
    
    try:
        # 获取模板
        template = await template_service.get_template("original_sound_cleaning")
        
        # 生成标准化格式
        standard_format = await template_service.generate_standard_format(mock_analysis, template)
        
        print("✅ 模板处理成功!")
        print(f"📊 标准化格式:")
        print(f"  - 源语言: {standard_format.get('source_language', 'N/A')}")
        print(f"  - 目标语言: {standard_format.get('target_language', 'N/A')}")
        print(f"  - 处理状态: {standard_format.get('processing_status', 'N/A')}")
        
        return standard_format
    except Exception as e:
        print(f"❌ 模板处理测试失败: {e}")
        return None

async def test_integration():
    """测试完整集成功能"""
    print("🚀 测试完整集成功能...")
    
    try:
        # 1. 测试音频转文字
        transcribed_text = await test_audio_to_text()
        if not transcribed_text:
            print("❌ 音频转文字失败，无法继续测试")
            return False
        
        # 2. 测试原声分析
        analysis_result = await test_original_sound_analysis()
        if not analysis_result:
            print("❌ 原声分析失败，无法继续测试")
            return False
        
        # 3. 测试模板处理
        standard_format = await test_template_processing()
        if not standard_format:
            print("❌ 模板处理失败，无法继续测试")
            return False
        
        print("🎉 所有测试通过！音频转文字和模板处理集成功能正常工作")
        return True
        
    except Exception as e:
        print(f"❌ 集成测试失败: {e}")
        return False

async def main():
    """主测试函数"""
    print("=" * 60)
    print("🧪 音频转文字和模板处理集成功能测试")
    print("=" * 60)
    
    # 运行集成测试
    success = await test_integration()
    
    print("=" * 60)
    if success:
        print("✅ 所有测试通过！功能集成成功")
    else:
        print("❌ 测试失败，请检查配置和实现")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())

