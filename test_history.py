#!/usr/bin/env python3
"""
历史记录功能测试脚本
"""

import requests
import json
import time

# 测试配置
BASE_URL = "http://localhost:8000"
USER_ID = "test_user_001"

def test_save_history():
    """测试保存历史记录"""
    print("🧪 测试保存历史记录...")
    
    url = f"{BASE_URL}/api/history/save"
    data = {
        "user_id": USER_ID,
        "title": "测试转化记录",
        "original_description": "这是一个测试问题描述，用于验证历史记录功能是否正常工作。",
        "system_types": ["BR", "SSL"],
        "modules": ["管理端", "移动端"],
        "analysis_result": {
            "predictedType": "设计需求优化",
            "priority": "P2-中",
            "confidence": 0.85
        },
        "standard_format": {
            "title": "【BR+SSL：管理端+移动端】测试转化记录",
            "region": "BR、SSL",
            "terminal": "管理端、移动端",
            "issue_type": "设计需求优化",
            "priority": "P2-中",
            "problem_description": "这是一个测试问题描述",
            "solution": "根据问题具体情况制定针对性解决方案"
        },
        "template_id": "default",
        "files_info": [
            {"name": "test.png", "size": 1024, "type": "image/png"}
        ]
    }
    
    try:
        # 发送JSON数据
        response = requests.post(url, json=data)
        print(f"响应状态码: {response.status_code}")
        print(f"响应内容: {response.text}")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ 保存成功: {result}")
            return result.get("id")
        else:
            print(f"❌ 保存失败: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ 请求异常: {e}")
        return None

def test_get_history_list():
    """测试获取历史记录列表"""
    print("🧪 测试获取历史记录列表...")
    
    url = f"{BASE_URL}/api/history/list"
    params = {
        "user_id": USER_ID,
        "page": 1,
        "page_size": 10
    }
    
    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ 获取成功: 共 {result['pagination']['total']} 条记录")
            if result['data']:
                print(f"📋 最新记录: {result['data'][0]['title']}")
            return result['data']
        else:
            print(f"❌ 获取失败: {response.status_code} - {response.text}")
            return []
    except Exception as e:
        print(f"❌ 请求异常: {e}")
        return []

def test_get_history_detail(record_id):
    """测试获取历史记录详情"""
    print(f"🧪 测试获取历史记录详情: {record_id}")
    
    url = f"{BASE_URL}/api/history/detail/{record_id}"
    params = {"user_id": USER_ID}
    
    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ 获取详情成功: {result['data']['title']}")
            return result['data']
        else:
            print(f"❌ 获取详情失败: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ 请求异常: {e}")
        return None

def test_delete_history(record_id):
    """测试删除历史记录"""
    print(f"🧪 测试删除历史记录: {record_id}")
    
    url = f"{BASE_URL}/api/history/delete/{record_id}"
    params = {"user_id": USER_ID}
    
    try:
        response = requests.delete(url, params=params)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ 删除成功: {result['message']}")
            return True
        else:
            print(f"❌ 删除失败: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ 请求异常: {e}")
        return False

def test_clear_history():
    """测试清空历史记录"""
    print("🧪 测试清空历史记录...")
    
    url = f"{BASE_URL}/api/history/clear"
    params = {"user_id": USER_ID}
    
    try:
        response = requests.delete(url, params=params)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ 清空成功: {result['message']}")
            return True
        else:
            print(f"❌ 清空失败: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ 请求异常: {e}")
        return False

def main():
    """主测试函数"""
    print("🚀 开始测试历史记录功能...")
    print(f"📍 测试用户ID: {USER_ID}")
    print(f"🌐 测试服务器: {BASE_URL}")
    print("-" * 50)
    
    # 1. 测试保存历史记录
    record_id = test_save_history()
    if not record_id:
        print("❌ 保存测试失败，终止测试")
        return
    
    time.sleep(1)
    
    # 2. 测试获取历史记录列表
    history_list = test_get_history_list()
    
    time.sleep(1)
    
    # 3. 测试获取历史记录详情
    if record_id:
        detail = test_get_history_detail(record_id)
    
    time.sleep(1)
    
    # 4. 测试删除历史记录
    if record_id:
        test_delete_history(record_id)
    
    time.sleep(1)
    
    # 5. 测试清空历史记录
    test_clear_history()
    
    print("-" * 50)
    print("🎉 历史记录功能测试完成！")

if __name__ == "__main__":
    main()
