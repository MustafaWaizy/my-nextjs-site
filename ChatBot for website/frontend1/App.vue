<template>
  <ChatToggleButton @toggle="show = !show" />
  <Chatbot :visible="show" @close="show = false" />
</template>

<script setup>
import { ref } from 'vue'
import Chatbot from './Chatbot.vue'
import ChatToggleButton from './ChatToggleButton.vue'

const show = ref(false)
</script>
