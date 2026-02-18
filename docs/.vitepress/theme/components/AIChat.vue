<template>
  <div class="chat-wrapper" :class="{ 'chat-open': isOpen }">
    <!-- 悬浮球 -->
    <button class="chat-trigger" @click="isOpen = !isOpen">
      <span v-if="!isOpen" class="trigger-text">
        <span class="pulse-icon">🧠</span> 问问 AI 医生
      </span>
      <span v-else class="trigger-text">✖ 关闭咨询</span>
    </button>

    <!-- 聊天窗口 -->
    <transition name="fade">
      <div v-if="isOpen" class="chat-window">
        <div class="chat-header">
          <div class="header-content">
            <h3>职场健康顾问 (Alpha)</h3>
            <p>基于《白领延寿指南》医学实证</p>
          </div>
          <div class="header-status">在线</div>
        </div>
        
        <div class="chat-messages" ref="messageContainer">
          <div v-for="(msg, i) in messages" :key="i" :class="['message', msg.role]">
            <div class="content" v-html="formatText(msg.text)"></div>
          </div>
          <div v-if="isLoading" class="message assistant loading">
            <span class="dots">正在查阅医学证据</span>
          </div>
        </div>

        <div class="chat-input-area">
          <div class="input-container">
            <input 
              v-model="userInput" 
              @keyup.enter="sendMessage"
              placeholder="问问关于健康的问题..." 
              :disabled="isLoading"
            />
            <button @click="startVoice" class="voice-btn" :class="{ 'is-listening': isListening }" title="点击说话">
              {{ isListening ? '📡' : '🎙️' }}
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
  { role: 'assistant', text: '您好！我是您的数字化健康顾问。您可以问我关于职场饮食、补救运动或睡眠策略的问题，我会基于医学实证为您解答。' }
])

const GEMINI_KEY = "AIzaSyBqO2BBVA25h_1LYJmNLNpkSEZMKFJDbJo"

const formatText = (text) => {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return
  
  const text = userInput.value
  messages.value.push({ role: 'user', text })
  userInput.value = ''
  isLoading.value = true
  
  await scrollBottom()

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `
            身份：你是“白领延寿指南”官方 AI 助手。
            任务：基于医学证据回答健康问题。
            原则：
            1. 优先引用 ACM（全因死亡率）数据。
            2. 语气专业、温和、克制。
            3. 如果问题不在指南范围内，请告知你专注于基于证据的长寿建议，并建议咨询医生。
            4. 重点关注：挥拍运动(-47% ACM)、咖啡(-15% ACM)、7小时睡眠、戒烟戒酒、白肉、坚果。
            用户问题：${text}
          ` }]
        }]
      })
    })
    
    const data = await response.json()
    const aiText = data.candidates[0].content.parts[0].text
    messages.value.push({ role: 'assistant', text: aiText })
  } catch (e) {
    messages.value.push({ role: 'assistant', text: '抱歉，连接医学数据库超时，请稍后再试。' })
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
  recognition.start()
}
</script>

<style scoped>
.chat-wrapper {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 2000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.chat-trigger {
  background: linear-gradient(135deg, #3498db, #2ecc71);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.3);
  font-weight: 600;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.chat-trigger:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(52, 152, 219, 0.4);
}

.trigger-text { display: flex; align-items: center; gap: 8px; }

.pulse-icon {
  animation: pulse 2s infinite;
  display: inline-block;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.chat-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 380px;
  height: 550px;
  max-height: calc(100vh - 120px);
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 50px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.05);
}

.chat-header {
  background: #3498db;
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h3 { margin: 0; font-size: 17px; font-weight: 700; }
.header-content p { margin: 4px 0 0; font-size: 12px; opacity: 0.9; }

.header-status {
  font-size: 11px;
  background: rgba(255,255,255,0.2);
  padding: 4px 10px;
  border-radius: 10px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fdfdfd;
}

.message {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14.5px;
  line-height: 1.5;
}

.user {
  align-self: flex-end;
  background: #3498db;
  color: white;
  border-bottom-right-radius: 4px;
}

.assistant {
  align-self: flex-start;
  background: #f1f1f1;
  color: #2c3e50;
  border-bottom-left-radius: 4px;
}

.loading .dots::after {
  content: '...';
  animation: loading-dots 1.5s infinite;
}

@keyframes loading-dots {
  0% { content: '.'; }
  33% { content: '..'; }
  66% { content: '...'; }
}

.chat-input-area {
  padding: 15px;
  background: white;
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-container {
  display: flex;
  background: #f5f7f9;
  border-radius: 15px;
  padding: 5px 15px;
  align-items: center;
}

.input-container input {
  flex: 1;
  border: none;
  background: none;
  padding: 10px 0;
  outline: none;
  font-size: 14px;
}

.voice-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.voice-btn.is-listening {
  animation: shake 0.5s infinite;
}

@keyframes shake {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  75% { transform: rotate(-5deg); }
}

.send-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(20px); }
</style>
