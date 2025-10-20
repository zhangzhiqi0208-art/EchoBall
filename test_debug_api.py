#!/usr/bin/env python3
import requests
import json

def test_debug_api():
    print("🔍 调试API问题...")
    
    # 测试根路径
    try:
        response = requests.get("http://localhost:8000/", timeout=5)
        print(f"根路径状态码: {response.status_code}")
        print(f"根路径响应: {repr(response.text)}")
        print(f"根路径Content-Type: {response.headers.get('Content-Type')}")
        print(f"根路径响应头: {dict(response.headers)}")
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
        
        response = requests.post("http://localhost:8000/api/original-sound/process-text", data=data, timeout=10)
        print(f"原声处理状态码: {response.status_code}")
        print(f"原声处理响应: {repr(response.text)}")
        print(f"原声处理Content-Type: {response.headers.get('Content-Type')}")
        
        if response.text == "1.0.0":
            print("❌ 问题确认：API返回版本号而不是JSON")
        else:
            print("✅ API返回正常内容")
            
    except Exception as e:
        print(f"原声处理测试失败: {e}")

if __name__ == "__main__":
    test_debug_api()

