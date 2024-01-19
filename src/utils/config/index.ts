const isProd = false
const urlDb = isProd ? "https://nusafmstream.vercel.app/api_radio_id.json" : "http://localhost:3000/api_radio_id.json"

export { isProd, urlDb }