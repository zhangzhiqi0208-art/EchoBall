#!/usr/bin/env python3
import requests
import json

def test_api_8001():
    print("🔍 测试8001端口API...")
    
    # 测试根路径
    try:
        response = requests.get("http://localhost:8001/", timeout=5)
        print(f"根路径状态码: {response.status_code}")
        print(f"根路径响应: {response.text}")
    except Exception as e:
        print(f"根路径测试失败: {e}")
    
    # 测试原声处理API
    try:
        data = {
            "user_input": "Capaciten a sus motociclistas xq no dan con los domicilios y terminan cancelando los servicios y a uno lo dejan con hambre y eso que hasta con la ubicación que les envía uno a través de su app, gracias",
            "source_language": "西班牙语",
            "target_language": "中文",
            "user_id": "test_user"
        }
        
        response = requests.post("http://localhost:8001/api/original-sound/process-text", data=data, timeout=10)
        print(f"原声处理状态码: {response.status_code}")
        print(f"原声处理响应: {response.text}")
        
        if response.status_code == 200:
            try:
                result = response.json()
                print("✅ API调用成功!")
                print(f"成功状态: {result.get('success', 'N/A')}")
                if 'analysis' in result:
                    analysis = result['analysis']
                    print(f"情感分类: {analysis.get('sentiment_classification', 'N/A')}")
                    print(f"翻译结果: {analysis.get('original_translation', 'N/A')[:50]}...")
            except:
                print("❌ JSON解析失败")
        else:
            print(f"❌ API调用失败: {response.status_code}")
            
    except Exception as e:
        print(f"原声处理测试失败: {e}")

if __name__ == "__main__":
    test_api_8001()

