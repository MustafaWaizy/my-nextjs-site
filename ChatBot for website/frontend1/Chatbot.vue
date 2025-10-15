<template>
  <Transition name="slide-fade">
    <div
      v-if="visible"
      class="fixed top-0 right-0 w-[40vw] h-screen bg-white border-l rounded-l-xl shadow-lg flex flex-col z-50"
    >
      <!-- Header -->
      <div class="p-3 bg-blue-600 text-white font-bold flex justify-between items-center rounded-tl-xl">
        <span>UnityToServe Chatbot</span>
        <button @click="$emit('close')" class="text-white hover:text-gray-300 text-xl leading-none">&times;</button>
      </div>

      <!-- Message area -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-3">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="flex items-start gap-3 flex-col"
        >
          <!-- Avatar and Message -->
          <div class="flex gap-3 items-start">
            <img
              :src="msg.from === 'user' ? '/user.png' : '/bot.png'"
              :class="msg.from === 'user' ? 'w-12 h-12 rounded-full object-cover border' : 'w-12 h-12 object-cover border'"
              alt="avatar"
            />
            <div>
              <div
                :class="msg.from === 'user' ? 'bg-blue-100' : 'bg-gray-200'"
                class="px-3 py-2 rounded-lg max-w-xs chat-message-text"
              >
                <span v-if="msg.from === 'bot'" v-html="renderMessage(msg.text)"></span>
                <span v-else>{{ msg.text }}</span>
              </div>
              <div class="text-xs text-gray-400 mt-1 chat-message-time">
                {{ formatTimestamp(msg.timestamp) }}
              </div>
            </div>
          </div>

          <!-- Suggestions -->
          <div
            v-if="msg.from === 'bot' && msg.suggestions?.length > 0 && index === messages.length - 1"
            class="pl-16"
          >
            <div class="text-sm text-blue-700 font-semibold mb-1">Did you mean one of the following?</div>
            <div class="flex flex-col gap-2">
              <button
                v-for="(s, i) in msg.suggestions"
                :key="i"
                @click="handleSuggestionClick(s.intent)"
                class="text-sm px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition chat-message-text text-left"
              >
                {{ s.text }}
              </button>
            </div>
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="typing" class="text-sm text-gray-400 italic">Bot is typing...</div>
      </div>

      <!-- Input area -->
      <div class="p-3 border-t flex gap-2">
        <input
          v-model="input"
          @keyup.enter="send"
          class="flex-1 border rounded px-3 py-2 text-sm"
          placeholder="Ask something..."
        />
        <button @click="send" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
          Send
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps(['visible'])
const emit = defineEmits(['close'])

const input = ref('')
const messages = ref([])
const typing = ref(false)
const chatContainer = ref(null)

function formatTimestamp(isoString) {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function renderMessage(text) {
  // Make URLs clickable
  const urlRegex = /(https?:\/\/[^\s]+)/g
  text = text.replace(urlRegex, url => {
    return `<a href="${url}" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">${url}</a>`
  })

  // Make emails clickable
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
  text = text.replace(emailRegex, email => {
    return `<a href="mailto:${email}" class="text-blue-600 underline">${email}</a>`
  })

  return text
}

async function scrollToBottom() {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

async function handleSuggestionClick(intent) {
  input.value = intent
  await send()
}

async function send() {
  if (!input.value.trim()) return

  const now = new Date().toISOString()
  const userMessage = input.value
  messages.value.push({ from: 'user', text: userMessage, timestamp: now })
  input.value = ''
  await scrollToBottom()

  typing.value = true
  try {
    const response = await fetch('http://127.0.0.1:8000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    })

    const data = await response.json()
    const botResponse = data?.response || '[No response]'
    const botSuggestions = data?.suggestions || []

    messages.value.push({
      from: 'bot',
      text: botResponse,
      timestamp: new Date().toISOString(),
      suggestions: botSuggestions,
    })

    await scrollToBottom()
  } catch {
    messages.value.push({
      from: 'bot',
      text: '[Error connecting to backend]',
      timestamp: new Date().toISOString(),
      suggestions: [],
    })
    await scrollToBottom()
  } finally {
    typing.value = false
  }
}
</script>

<style scoped>
:deep(.slide-fade-enter-active) {
  transition: all 0.3s ease;
}
:deep(.slide-fade-leave-active) {
  transition: all 0.2s ease;
}
:deep(.slide-fade-enter-from) {
  opacity: 0;
  transform: translateY(20px);
}
:deep(.slide-fade-enter-to) {
  opacity: 1;
  transform: translateY(0);
}
:deep(.slide-fade-leave-from) {
  opacity: 1;
  transform: translateY(0);
}
:deep(.slide-fade-leave-to) {
  opacity: 0;
  transform: translateY(20px);
}

.chat-message-text,
.chat-message-time {
  font-family: Arial, sans-serif;
  font-size: 18px;
  line-height: 1.4;
}
</style>
