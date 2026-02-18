<template>
  <div class="chat-wrapper" :class="{ 'chat-open': isOpen }">
    <!-- 悬浮球 -->
    <button class="chat-trigger" @click="isOpen = !isOpen">
      <span v-if="!isOpen">🧠 AI 咨询</span>
      <span v-else>✖ 关闭</span>
    </button>

    <!-- 聊天窗口 -->
    <div v-if="isOpen" class="chat-window">
      <div class="chat-header">
        <h3>延寿助手 (Beta)</h3>
        <p>基于医学证据的实时对话</p>
      </div>
      
      <div class="chat-messages" ref="messageContainer">
        <div v-for="(msg, i) in messages" :key="i" :class="['message', msg.role]">
          <div class="content">{{ msg.text }}</div>
        </div>
        <div v-if="isLoading" class="message assistant loading">
          正在查阅医学证据...
        </div>
      </div>

      <div class="chat-input-area">
        <input 
          v-model="userInput" 
          @keyup.enter="sendMessage"
          placeholder="问问关于健康的问题..." 
          :disabled="isLoading"
        />
        <button @click="startVoice" class="voice-btn" title="语音输入">🎙️</button>
        <button @click="sendMessage" :disabled="isLoading" class="send-btn">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

const isOpen = ref(false)
const userInput = ref('')
const isLoading = ref(false)
const messageContainer = ref(null)
const messages = ref([
  { role: 'assistant', text: '你好！我是白领延寿助手的 AI。我可以基于本手册的医学研究为你提供建议。你想了解哪方面的健康数据？' }
])

const GEMINI_KEY = "AIzaSyBqO2BBVA25h_1LYJmNLNpkSEZMKFJDbJo"

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return
  
  const text = userInput.value
  messages.value.push({ role: 'user', text })
  userInput.value = ''
  isLoading.value = true
  
  await scrollBottom()

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `你是一个健康顾问。基于《程序员/白领延寿指南》回答问题。问题是：${text}` }]
        }]
      })
    })
    
    const data = await response.json()
    const aiText = data.candidates[0].content.parts[0].text
    messages.value.push({ role: 'assistant', text: aiText })
  } catch (e) {
    messages.value.push({ role: 'assistant', text: '抱歉，我现在连接不上医学库。请稍后再试。' })
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
  recognition.onresult = (event) => {
    userInput.value = event.results[0][0].transcript
  }
  recognition.start()
}
</script>

<style scoped>
.chat-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: sans-serif;
}

.chat-trigger {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  font-weight: bold;
  transition: transform 0.2s;
}

.chat-trigger:hover {
  transform: scale(1.05);
}

.chat-window {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #eee;
}

.chat-header {
  background: #3498db;
  color: white;
  padding: 15px;
}

.chat-header h3 { margin: 0; font-size: 16px; }
.chat-header p { margin: 5px 0 0; font-size: 12px; opacity: 0.8; }

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f9f9f9;
}

.message {
  max-width: 85%;
  padding: 10px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
}

.user {
  align-self: flex-end;
  background: #3498db;
  color: white;
  border-bottom-right-radius: 2px;
}

.assistant {
  align-self: flex-start;
  background: white;
  color: #333;
  border-bottom-left-radius: 2px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.loading { color: #888; font-style: italic; }

.chat-input-area {
  padding: 10px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 8px;
  background: white;
}

.chat-input-area input {
  flex: 1;
  border: 1px solid #ddd;
  padding: 8px 12px;
  border-radius: 20px;
  outline: none;
}

.voice-btn, .send-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
}

.send-btn {
  color: #3498db;
  font-weight: bold;
  font-size: 14px;
}
</style>
