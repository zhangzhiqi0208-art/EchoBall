#!/usr/bin/env python3
import requests
import json

def test_api():
    url = "http://localhost:8000/api/original-sound/process-text"
    
    data = {
        "user_input": "Capaciten a sus motociclistas xq no dan con los domicilios y terminan cancelando los servicios y a uno lo dejan con hambre y eso que hasta con la ubicación que les envía uno a través de su app, gracias",
        "source_language": "西班牙语",
        "target_language": "中文",
        "user_id": "test_user"
    }
    
    try:
        print("🚀 测试API调用...")
        response = requests.post(url, data=data, timeout=30)
        print(f"状态码: {response.status_code}")
        print(f"响应头: {response.headers}")
        print(f"响应内容: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API调用成功!")
            print(f"成功状态: {result.get('success', 'N/A')}")
            if 'analysis' in result:
                analysis = result['analysis']
                print(f"情感分类: {analysis.get('sentiment_classification', 'N/A')}")
                print(f"情感强度: {analysis.get('sentiment_intensity', 'N/A')}")
                print(f"翻译结果: {analysis.get('original_translation', 'N/A')[:100]}...")
        else:
            print(f"❌ API调用失败: {response.status_code}")
            
    except Exception as e:
        print(f"❌ 请求异常: {e}")

if __name__ == "__main__":
    test_api()

