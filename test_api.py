#!/usr/bin/env python3
"""
测试反馈解析API端点的功能
"""

import requests
import json
import time

# API基础URL
BASE_URL = "http://localhost:8000"

def test_parse_feedback_api():
    """测试反馈解析API"""
    print("🧪 开始测试反馈解析API...")
    
    # 测试数据
    test_data = {
        "description": "用户登录页面加载很慢，经常出现超时错误，影响用户体验。希望能够优化页面加载速度，提升用户登录体验。",
        "system_types": ["BR", "SSL"],
        "modules": ["管理端", "移动端"],
        "template_id": "default"
    }
    
    # 准备FormData
    form_data = {
        "description": test_data["description"],
        "system_types": json.dumps(test_data["system_types"]),
        "modules": json.dumps(test_data["modules"]),
        "template_id": test_data["template_id"]
    }
    
    try:
        print("📤 发送请求到 /api/analysis/parse-feedback...")
        response = requests.post(
            f"{BASE_URL}/api/analysis/parse-feedback",
            data=form_data,
            timeout=30
        )
        
        print(f"📊 响应状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API调用成功!")
            print(f"📝 响应消息: {result.get('message', 'N/A')}")
            
            # 检查返回的数据结构（只检查模板中定义的字段）
            if 'data' in result:
                data = result['data']
                print("\n📋 解析结果:")
                print("  【基本信息】")
                print(f"  - 标题: {data.get('title', 'N/A')}")
                print(f"  - 所属地区: {data.get('region', 'N/A')}")
                print(f"  - 归属终端: {data.get('terminal', 'N/A')}")
                print(f"  - 问题类型: {data.get('issue_type', 'N/A')}")
                print(f"  - 解决方式: {data.get('resolution_method', 'N/A')}")
                print(f"  - 优先级: {data.get('priority', 'N/A')}")
                print(f"  - 解决状态: {data.get('status', 'N/A')}")
                print(f"  - 期望修复版本: {data.get('target_version', 'N/A')}")
                
                print("  【问题详情】")
                print(f"  - 问题描述: {data.get('problem_description', 'N/A')[:100]}...")
                print(f"  - 解决方案: {data.get('solution', 'N/A')[:100]}...")
                
                # 检查附件信息
                if data.get('screenshots') or data.get('attachments'):
                    print("  【附件信息】")
                    print(f"  - 截图: {data.get('screenshots', '无')}")
                    print(f"  - 其他附件: {data.get('attachments', '无')}")
            
            # 检查分析结果
            if 'analysis' in result:
                analysis = result['analysis']
                print(f"\n🔍 分析详情:")
                print(f"  - 预测类型: {analysis.get('predictedType', 'N/A')}")
                print(f"  - 置信度: {analysis.get('confidence', 'N/A')}")
                print(f"  - 影响分析: {analysis.get('impact', 'N/A')[:100]}...")
                
                if 'recommendedSolutions' in analysis:
                    print(f"  - 推荐解决方案数量: {len(analysis['recommendedSolutions'])}")
            
            return True
            
        else:
            print(f"❌ API调用失败: {response.status_code}")
            print(f"错误信息: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ 请求异常: {e}")
        return False
    except Exception as e:
        print(f"❌ 其他错误: {e}")
        return False

def test_health_check():
    """测试健康检查"""
    print("\n🏥 测试健康检查...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ 服务健康状态正常")
            return True
        else:
            print(f"❌ 健康检查失败: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ 健康检查异常: {e}")
        return False

def main():
    """主测试函数"""
    print("🚀 开始API功能测试")
    print("=" * 50)
    
    # 测试健康检查
    health_ok = test_health_check()
    if not health_ok:
        print("❌ 服务不可用，请确保后端服务已启动")
        return
    
    # 等待一下确保服务完全启动
    time.sleep(1)
    
    # 测试反馈解析API
    parse_ok = test_parse_feedback_api()
    
    print("\n" + "=" * 50)
    if parse_ok:
        print("🎉 所有测试通过！反馈解析API功能正常")
    else:
        print("❌ 测试失败，请检查API实现")
    
    print("\n💡 使用说明:")
    print("1. 确保后端服务已启动 (python main.py)")
    print("2. 在前端界面填写反馈信息")
    print("3. 点击'智能解析'按钮测试功能")
    print("4. 查看预览面板中的数据填充效果")

if __name__ == "__main__":
    main()
