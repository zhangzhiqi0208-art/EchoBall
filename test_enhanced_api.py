#!/usr/bin/env python3
"""
测试增强版API功能
"""
import requests
import json

def test_enhanced_api():
    """测试增强版API"""
    print("🧪 测试增强版API...")
    
    # 测试数据
    test_data = {
        'user_input': 'Capaciten a sus motociclistas xq no dan con los domicilios y terminan cancelando los servicios y a uno lo dejan con hambre y eso que hasta con la ubicación que les envía uno a través de su app, gracias',
        'source_language': '西班牙语',
        'target_language': '中文',
        'user_id': 'test_user'
    }
    
    try:
        # 发送请求
        response = requests.post('http://localhost:8001/api/original-sound/process-text', data=test_data)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API调用成功")
            print(f"📊 情感分类: {result['analysis']['sentiment_classification']}")
            print(f"📈 情感强度: {result['analysis']['sentiment_intensity']}")
            print(f"🌐 翻译结果: {result['analysis']['original_translation'][:100]}...")
            print(f"🧠 智能总结: {result['analysis']['ai_optimized_summary'][:100]}...")
            print(f"📝 关键要点: {result['analysis']['key_points'][:100]}...")
            return True
        else:
            print(f"❌ API调用失败: {response.status_code}")
            print(f"错误信息: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 测试异常: {e}")
        return False

def test_health():
    """测试健康检查"""
    try:
        response = requests.get('http://localhost:8001/health')
        if response.status_code == 200:
            print("✅ 健康检查通过")
            return True
        else:
            print(f"❌ 健康检查失败: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ 健康检查异常: {e}")
        return False

if __name__ == "__main__":
    print("🔍 开始测试增强版API...")
    
    # 测试健康检查
    if not test_health():
        print("❌ 服务未启动，请先启动增强版服务器")
        exit(1)
    
    # 测试API功能
    if test_enhanced_api():
        print("\n🎉 增强版API测试成功！")
        print("现在用户原声模板将返回真实的AI分析结果")
    else:
        print("\n❌ 增强版API测试失败")
        print("请检查服务器日志和API配置")

