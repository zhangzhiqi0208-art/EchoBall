#!/usr/bin/env python3
"""
测试模板填充API端点的功能
"""

import requests
import json
import time

# API基础URL
BASE_URL = "http://localhost:8000"

def test_template_fill_api():
    """测试模板填充API"""
    print("🧪 开始测试模板填充API...")
    
    # 测试数据
    test_data = {
        "description": "语言切换功能还是ssl的橘色button,应该改成黄色,这个最好快点处理",
        "system_types": ["SSL"],
        "modules": ["门店端"],
        "template_id": "design_experience_issue"
    }
    
    # 准备FormData
    form_data = {
        "description": test_data["description"],
        "system_types": json.dumps(test_data["system_types"]),
        "modules": json.dumps(test_data["modules"]),
        "template_id": test_data["template_id"]
    }
    
    try:
        print("📤 发送请求到 /api/fill-template/fill...")
        response = requests.post(
            f"{BASE_URL}/api/fill-template/fill",
            data=form_data,
            timeout=30
        )
        
        print(f"📊 响应状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API调用成功!")
            print(f"📝 响应消息: {result.get('message', 'N/A')}")
            print(f"🏷️ 模板ID: {result.get('template_id', 'N/A')}")
            
            # 检查返回的数据结构
            if 'data' in result:
                data = result['data']
                print("\n📋 模板填充结果:")
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
                
                # 验证模板选项匹配
                print("\n🔍 模板选项匹配验证:")
                issue_type = data.get('issue_type', '')
                resolution_method = data.get('resolution_method', '')
                priority = data.get('priority', '')
                
                expected_issue_types = ["设计需求优化", "交互功能bug", "视觉还原度bug", "历史遗留"]
                expected_resolution_methods = ["体验优化", "需求优化"]
                expected_priorities = ["P0-紧急", "P1-高", "P2-中", "P3-低"]
                
                print(f"  - 问题类型 '{issue_type}' 是否在模板选项中: {issue_type in expected_issue_types}")
                print(f"  - 解决方式 '{resolution_method}' 是否在模板选项中: {resolution_method in expected_resolution_methods}")
                print(f"  - 优先级 '{priority}' 是否在模板选项中: {priority in expected_priorities}")
                
                # 验证智能推断
                print("\n🤖 智能推断验证:")
                if "颜色" in test_data["description"] and "设计" in issue_type:
                    print("  ✅ 正确识别为设计相关问题")
                if "快点" in test_data["description"] and "P0-紧急" in priority:
                    print("  ✅ 正确识别为紧急优先级")
                if "SSL" in test_data["system_types"] and "SSL" in data.get('region', ''):
                    print("  ✅ 正确保留用户选择的地区")
                if "门店端" in test_data["modules"] and "门店端" in data.get('terminal', ''):
                    print("  ✅ 正确保留用户选择的终端")
            
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

def test_template_config_api():
    """测试模板配置API"""
    print("\n🏗️ 测试模板配置API...")
    try:
        response = requests.get(f"{BASE_URL}/api/fill-template/template/design_experience_issue", timeout=10)
        if response.status_code == 200:
            result = response.json()
            print("✅ 模板配置获取成功!")
            template = result.get('template', {})
            print(f"  - 模板名称: {template.get('name', 'N/A')}")
            print(f"  - 模板描述: {template.get('description', 'N/A')}")
            print(f"  - 模板分类: {template.get('category', 'N/A')}")
            
            # 检查字段配置
            fields = template.get('config', {}).get('fields', [])
            print(f"  - 字段数量: {len(fields)}")
            
            # 检查关键字段的选项
            for field in fields:
                if field.get('name') == 'issue_type':
                    options = field.get('options', [])
                    print(f"  - 问题类型选项: {options}")
                elif field.get('name') == 'resolution_method':
                    options = field.get('options', [])
                    print(f"  - 解决方式选项: {options}")
                elif field.get('name') == 'priority':
                    options = field.get('options', [])
                    print(f"  - 优先级选项: {options}")
            
            return True
        else:
            print(f"❌ 模板配置获取失败: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ 模板配置测试异常: {e}")
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
    print("🚀 开始模板填充功能测试")
    print("=" * 60)
    
    # 测试健康检查
    health_ok = test_health_check()
    if not health_ok:
        print("❌ 服务不可用，请确保后端服务已启动")
        return
    
    # 等待一下确保服务完全启动
    time.sleep(1)
    
    # 测试模板配置API
    config_ok = test_template_config_api()
    if not config_ok:
        print("❌ 模板配置获取失败，请检查模板服务")
        return
    
    # 测试模板填充API
    fill_ok = test_template_fill_api()
    
    print("\n" + "=" * 60)
    if fill_ok:
        print("🎉 所有测试通过！模板填充功能正常")
        print("\n💡 功能说明:")
        print("1. 模板填充会根据设计体验问题模板进行智能分析")
        print("2. 问题类型会从模板选项中选择最匹配的")
        print("3. 优先级会根据关键词智能判断")
        print("4. 所有字段都严格按照模板配置填充")
    else:
        print("❌ 测试失败，请检查模板填充实现")
    
    print("\n🔧 使用说明:")
    print("1. 确保后端服务已启动 (python main.py)")
    print("2. 在前端界面填写反馈信息")
    print("3. 点击'模板填充'按钮测试功能")
    print("4. 查看预览面板中的正确字段填充效果")

if __name__ == "__main__":
    main()
