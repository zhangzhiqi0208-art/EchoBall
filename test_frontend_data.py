#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试前端接收到的数据结构
"""

import requests
import json

def test_frontend_data():
    """测试前端接收到的数据结构"""
    
    # 测试数据
    test_input = "弹窗尺寸太宽了，调整为480px"
    
    print(f"测试输入: {test_input}")
    print(f"{'='*60}")
    
    # API端点
    api_url = "http://localhost:8000/api/analysis/parse-feedback"
    
    # 准备请求数据
    form_data = {
        'description': test_input,
        'system_types': json.dumps(["BR", "SSL"]),
        'modules': json.dumps(["管理端", "门店端"]),
        'template_id': 'design_experience_issue'
    }
    
    try:
        # 发送请求
        response = requests.post(api_url, data=form_data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            
            print(f"✅ API调用成功")
            print(f"完整响应结构:")
            print(f"  success: {result.get('success')}")
            print(f"  message: {result.get('message')}")
            
            data = result.get('data', {})
            print(f"\n📊 data字段内容:")
            print(f"  title: {data.get('title')}")
            print(f"  region: {data.get('region')}")
            print(f"  terminal: {data.get('terminal')}")
            print(f"  issue_type: {data.get('issue_type')}")
            print(f"  resolution_method: {data.get('resolution_method')}")
            print(f"  priority: {data.get('priority')}")
            print(f"  problem_description: {data.get('problem_description')}")
            print(f"  solution: {data.get('solution')}")
            print(f"  status: {data.get('status')}")
            print(f"  target_version: {data.get('target_version')}")
            
            analysis = result.get('analysis', {})
            print(f"\n🔍 analysis字段内容:")
            print(f"  predictedType: {analysis.get('predictedType')}")
            print(f"  priority: {analysis.get('priority')}")
            print(f"  confidence: {analysis.get('confidence')}")
            
            # 检查标题格式
            title = data.get('title', '')
            if title.startswith('【BR+SSL：管理端】'):
                print(f"\n✅ 标题格式正确: {title}")
            else:
                print(f"\n❌ 标题格式错误: {title}")
                
        else:
            print(f"❌ API调用失败: {response.status_code}")
            print(f"错误信息: {response.text}")
            
    except Exception as e:
        print(f"❌ 请求异常: {str(e)}")

if __name__ == "__main__":
    test_frontend_data()
