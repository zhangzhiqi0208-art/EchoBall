#!/usr/bin/env python3
import requests
import json

def test_api_fix():
    print("🚀 测试API修复...")
    
    # 测试根路径
    try:
        response = requests.get("http://localhost:8000/")
        print(f"根路径状态码: {response.status_code}")
        print(f"根路径响应: {response.text}")
        print(f"根路径Content-Type: {response.headers.get('Content-Type')}")
    except Exception as e:
        print(f"根路径测试失败: {e}")
    
    # 测试健康检查
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"健康检查状态码: {response.status_code}")
        print(f"健康检查响应: {response.text}")
        print(f"健康检查Content-Type: {response.headers.get('Content-Type')}")
    except Exception as e:
        print(f"健康检查测试失败: {e}")
    
    # 测试原声处理API
    try:
        data = {
            "user_input": "Capaciten a sus motociclistas xq no dan con los domicilios y terminan cancelando los servicios y a uno lo dejan con hambre y eso que hasta con la ubicación que les envía uno a través de su app, gracias",
            "source_language": "西班牙语",
            "target_language": "中文",
            "user_id": "test_user"
        }
        
        response = requests.post("http://localhost:8000/api/original-sound/process-text", data=data)
        print(f"原声处理状态码: {response.status_code}")
        print(f"原声处理响应: {response.text}")
        print(f"原声处理Content-Type: {response.headers.get('Content-Type')}")
        
        if response.status_code == 200:
            try:
                result = response.json()
                print(f"JSON解析成功: {result}")
            except:
                print("JSON解析失败，响应不是有效的JSON")
                
    except Exception as e:
        print(f"原声处理测试失败: {e}")

if __name__ == "__main__":
    test_api_fix()

