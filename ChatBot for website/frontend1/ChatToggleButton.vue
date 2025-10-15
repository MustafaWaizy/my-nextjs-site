<template>
  <button
    @click="$emit('toggle')"
    class="fixed bottom-4 right-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
  >
    <!-- Chat bubble icon SVG -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.19-1.05L3 20l1.05-4.19A9.863 9.863 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>

    <span class="text-sm font-semibold">QUESTIONS? ASK ME!</span>
  </button>
</template>
