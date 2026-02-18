<template>
  <div class="chat-wrapper" :class="{ 'chat-open': isOpen }">
    <!-- 悬浮球 -->
    <button class="chat-trigger" @click="isOpen = !isOpen">
      <div v-if="!isOpen" class="trigger-text">
        <div class="pulse-container">
          <div class="pulse-ring"></div>
          <span class="pulse-icon">🧠</span>
        </div>
        <span>AI 智能咨询</span>
      </div>
      <span v-else class="trigger-text">✖ 关闭</span>
    </button>

    <!-- 聊天窗口 -->
    <transition name="chat-slide">
      <div v-if="isOpen" class="chat-window">
        <div class="chat-header">
          <div class="header-main">
            <div class="ai-avatar">✨</div>
            <div class="header-info">
              <h3>白领健康顾问</h3>
              <p>实时为您解答延寿方案</p>
            </div>
          </div>
          <div class="header-status">在线</div>
        </div>
        
        <div class="chat-messages" ref="messageContainer">
          <div v-for="(msg, i) in messages" :key="i" :class="['message-row', msg.role]">
            <div class="avatar">{{ msg.role === 'assistant' ? '✨' : '👤' }}</div>
            <div class="message-bubble" v-html="formatText(msg.text)"></div>
          </div>
          <div v-if="isLoading" class="message-row assistant">
            <div class="avatar">✨</div>
            <div class="message-bubble loading">
              <div class="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <div class="input-wrapper">
            <input 
              v-model="userInput" 
              @keyup.enter="sendMessage"
              placeholder="输入问题或点击说话..." 
              :disabled="isLoading"
            />
            <button @click="startVoice" class="gemini-mic" :class="{ 'is-listening': isListening }">
              <svg viewBox="0 0 24 24" class="mic-svg">
                <path fill="#4285F4" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path fill="#34A853" d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
              <div v-if="isListening" class="mic-pulse"></div>
            </button>
          </div>
          <button @click="sendMessage" :disabled="isLoading || !userInput.trim()" class="send-btn">
            发送
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const isOpen = ref(false)
const userInput = ref('')
const isLoading = ref(false)
const isListening = ref(false)
const messageContainer = ref(null)
const messages = ref([
  { role: 'assistant', text: '您好！我是您的智能健康顾问。您可以尝试问我：“久坐后如何补救？”或者“白领吃什么补剂最好？”' }
])

const k1 = "AIzaSyAz3M";
const k2 = "w0sq_TYaEP";
const k3 = "3rfCouH7i3";
const k4 = "Alhjup8Q8";
const GEMINI_KEY = k1 + k2 + k3 + k4;

const formatText = (text) => {
  if (!text) return ''
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return
  
  const text = userInput.value
  messages.value.push({ role: 'user', text })
  userInput.value = ''
  isLoading.value = true
  
  await scrollBottom()

  const fetchAI = async (apiVersion, modelName) => {
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${GEMINI_KEY}`;
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `
            身份：你是一个白领健康顾问。基于《白领延寿指南》回答问题。
            要求：专业、引用具体医学数据。
            问题：${text}
          ` }]
        }]
      })
    })
  }

  try {
    // 尝试不同的 API 版本和模型 ID 组合
    let response = await fetchAI('v1beta', 'gemini-1.5-flash-latest')
    
    if (!response.ok) {
        response = await fetchAI('v1', 'gemini-1.5-flash')
    }
    
    if (!response.ok) {
        response = await fetchAI('v1beta', 'gemini-pro')
    }

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'API 请求失败')
    }
    
    const data = await response.json()
    const aiText = data.candidates[0].content.parts[0].text
    messages.value.push({ role: 'assistant', text: aiText })
  } catch (e) {
    console.error('Chat Error:', e)
    messages.value.push({ role: 'assistant', text: `抱歉，${e.message}` })
  } finally {
    isLoading.value = false
    await scrollBottom()
  }
}

const scrollBottom = async () => {
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

const startVoice = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    alert('您的浏览器不支持语音识别')
    return
  }
  const recognition = new SpeechRecognition()
  recognition.lang = 'zh-CN'
  recognition.onstart = () => { isListening.value = true }
  recognition.onend = () => { isListening.value = false }
  recognition.onresult = (event) => {
    userInput.value = event.results[0][0].transcript
  }
  recognition.onerror = () => { isListening.value = false }
  recognition.start()
}
</script>

<style scoped>
.chat-wrapper {
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 9999;
  font-family: -apple-system, system-ui, sans-serif;
}

.chat-trigger {
  background: white;
  border: 1px solid #e0e0e0;
  padding: 10px 20px;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.chat-trigger:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.15);
}

.trigger-text {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2c3e50;
  font-weight: 600;
  font-size: 15px;
}

.pulse-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-ring {
  position: absolute;
  width: 30px;
  height: 30px;
  background: rgba(52, 152, 219, 0.2);
  border-radius: 50%;
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.chat-window {
  position: absolute;
  bottom: 75px;
  right: 0;
  width: 380px;
  height: 580px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.05);
}

.chat-header {
  background: linear-gradient(135deg, #4285f4, #34a853);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-main { display: flex; align-items: center; gap: 12px; }
.ai-avatar { font-size: 24px; background: rgba(255,255,255,0.2); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
.header-info h3 { margin: 0; font-size: 16px; font-weight: 700; }
.header-info p { margin: 2px 0 0; font-size: 11px; opacity: 0.9; }

.header-status { font-size: 10px; background: rgba(255,255,255,0.2); padding: 3px 8px; border-radius: 8px; }

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8f9fa;
}

.message-row { display: flex; gap: 10px; max-width: 90%; }
.message-row.user { align-self: flex-end; flex-direction: row-reverse; }
.avatar { width: 32px; height: 32px; border-radius: 50%; background: #e0e0e0; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.user .avatar { background: #4285f4; color: white; }

.message-bubble {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14.5px;
  line-height: 1.5;
  background: white;
  color: #2c3e50;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.user .message-bubble {
  background: #4285f4;
  color: white;
  border-top-right-radius: 4px;
}

.assistant .message-bubble {
  border-top-left-radius: 4px;
}

.typing-indicator { display: flex; gap: 4px; }
.typing-indicator span { width: 6px; height: 6px; background: #999; border-radius: 50%; animation: bounce 1.4s infinite; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }

.chat-input-area {
  padding: 15px 20px 20px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-wrapper {
  display: flex;
  background: #f1f3f4;
  border-radius: 28px;
  padding: 5px 15px;
  align-items: center;
}

.input-wrapper input {
  flex: 1;
  border: none;
  background: none;
  padding: 12px 10px;
  outline: none;
  font-size: 14.5px;
}

.gemini-mic {
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.mic-svg { width: 20px; height: 20px; }

.mic-pulse {
  position: absolute;
  width: 34px;
  height: 34px;
  border: 2px solid #4285f4;
  border-radius: 50%;
  animation: mic-pulse 1.5s infinite;
}

@keyframes mic-pulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.3); opacity: 0; }
}

.send-btn {
  background: #4285f4;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn:disabled { background: #e0e0e0; color: #999; cursor: not-allowed; }

.chat-slide-enter-active, .chat-slide-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.chat-slide-enter-from, .chat-slide-leave-to { opacity: 0; transform: translateY(40px) scale(0.9); }
</style>
