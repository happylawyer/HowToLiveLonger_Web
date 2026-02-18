import os
import requests
import json

# API Key
GEMINI_API_KEY = "AIzaSyBqO2BBVA25h_1LYJmNLNpkSEZMKFJDbJo"

def ask_gemini(question, context):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    
    prompt = f"""
    你是一个专门基于《程序员延寿指南》提供建议的公益 AI 助手。
    请严格基于以下【参考文档】内容回答用户的【问题】。
    要求：
    1. 尽量引用文档中的 ACM (全因死亡率) 数据。
    2. 如果文档中没有相关信息，请礼貌地告知并建议用户咨询专业医生。
    3. 语言风格要专业、客观且简洁。

    【参考文档】：
    {context}

    【问题】：
    {question}
    """
    
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        result = response.json()
        return result['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        # 调试信息：如果失败，返回详细错误
        return f"调用失败: {str(e)}\n响应详情: {response.text if 'response' in locals() else 'No response'}"

if __name__ == "__main__":
    # 模拟知识库内容（从 README 提取的核心证据）
    knowledge_base = """
    - 挥拍运动：每周3次45分钟，降低 47% 全因死亡率(ACM)。
    - 睡眠：每天睡 7 小时全因死亡率最低；22-24点间入睡。早睡+43% ACM，晚睡+15% ACM。
    - 刷牙：过早死亡风险降低 25%。
    - 咖啡：降低 15-22% ACM。
    - 戒烟戒酒：吸烟减少寿命 11-12 年。
    - 饮食：多吃辣降低 23% ACM；吃坚果降低 20% ACM。
    - 液体：每天一斤牛奶，全因死亡风险下降 17%。
    """
    
    # 自动测试一个问题
    test_question = "健康的一天怎么度过？"
    print(f"--- 正在自动测试 AI 问答 ---")
    print(f"提问: {test_question}")
    
    answer = ask_gemini(test_question, knowledge_base)
    print("\nAI 的回答:")
    print("-" * 30)
    print(answer)
    print("-" * 30)
