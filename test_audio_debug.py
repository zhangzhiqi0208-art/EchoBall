#!/usr/bin/env python3
"""
音频处理调试脚本
"""
import requests
import json
import os

def test_audio_processing():
    """测试音频处理API"""
    print("🔍 开始测试音频处理API...")
    
    # 测试8001端口
    print("\n📡 测试8001端口...")
    try:
        # 创建一个测试音频文件
        test_audio_path = "/tmp/test_audio.m4a"
        with open(test_audio_path, "wb") as f:
            f.write(b"fake audio data")
        
        with open(test_audio_path, "rb") as f:
            files = {"audio_file": ("test.m4a", f, "audio/m4a")}
            data = {
                "source_language": "葡语",
                "target_language": "中文",
                "user_id": "test_user"
            }
            
            response = requests.post(
                "http://localhost:8001/api/original-sound/process-audio",
                files=files,
                data=data,
                timeout=30
            )
            
            print(f"状态码: {response.status_code}")
            print(f"响应头: {dict(response.headers)}")
            print(f"响应内容: {response.text}")
            
    except Exception as e:
        print(f"❌ 8001端口测试失败: {e}")
    
    # 测试8002端口
    print("\n📡 测试8002端口...")
    try:
        with open(test_audio_path, "rb") as f:
            files = {"audio_file": ("test.m4a", f, "audio/m4a")}
            data = {
                "source_language": "葡语",
                "target_language": "中文",
                "user_id": "test_user"
            }
            
            response = requests.post(
                "http://localhost:8002/api/original-sound/process-audio",
                files=files,
                data=data,
                timeout=30
            )
            
            print(f"状态码: {response.status_code}")
            print(f"响应头: {dict(response.headers)}")
            print(f"响应内容: {response.text}")
            
    except Exception as e:
        print(f"❌ 8002端口测试失败: {e}")
    
    # 清理测试文件
    if os.path.exists(test_audio_path):
        os.remove(test_audio_path)

if __name__ == "__main__":
    test_audio_processing()

