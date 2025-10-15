export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts}",   // <-- add this to cover nested Vue files
    "./*.vue"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
