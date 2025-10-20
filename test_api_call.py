#!/usr/bin/env python3
"""
测试API调用的脚本
"""

import requests
import json

def test_original_sound_api():
    """测试原声处理API"""
    print("🔍 测试原声处理API调用...")
    
    # API端点
    url = "http://localhost:8000/api/original-sound/process-text"
    
    # 测试数据
    test_data = {
        "user_input": "Capaciten a sus motociclistas xq no dan con los domicilios y terminan cancelando los servicios y a uno lo dejan con hambre y eso que hasta con la ubicación que les envía uno a través de su app, gracias",
        "source_language": "西班牙语",
        "target_language": "中文",
        "user_id": "test_user"
    }
    
    try:
        print(f"📤 发送请求到: {url}")
        print(f"📝 请求数据: {test_data}")
        
        # 发送POST请求
        response = requests.post(url, data=test_data, timeout=30)
        
        print(f"📊 响应状态码: {response.status_code}")
        print(f"📊 响应头: {dict(response.headers)}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API调用成功！")
            print(f"📋 响应数据: {json.dumps(result, ensure_ascii=False, indent=2)}")
            return True
        else:
            print(f"❌ API调用失败: {response.status_code}")
            print(f"📋 错误信息: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ 连接失败：后端服务未启动")
        print("💡 请先启动后端服务：cd backend && python main.py")
        return False
    except requests.exceptions.Timeout:
        print("❌ 请求超时")
        return False
    except Exception as e:
        print(f"❌ 请求异常: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 开始测试API调用...")
    success = test_original_sound_api()
    
    if success:
        print("\n✅ API测试通过！")
    else:
        print("\n❌ API测试失败！")

