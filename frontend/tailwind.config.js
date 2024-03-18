import flowBite from "flowbite/plugin"
import autoprefixer from "autoprefixer"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowBite,
    autoprefixer,
  ],
}
