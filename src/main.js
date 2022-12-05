import { createApp } from 'vue'

import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
import { createStore } from 'vuex'
import App from './App.vue'
import VueNumerals from 'vue-numerals'
import Connection from './plugins/connection.js'

import { AppStore } from './store/app_store.js'

// const connection = {
// 	site: 'https://panicbot.app',
// 	socket: 'ws://127.0.0.1:3006',
// 	url: 'http://127.0.0.1:3006'
// }

const connection = {
	site: 'https://nft-flush.panicbot.xyz',
	socket: 'wss://three-apps.panicbot.xyz',
	socket_local: 'wss://192.168.0.19:3006',
	url: 'https://three-apps.panicbot.xyz'
}

const app = createApp(App)

const store = createStore({
    modules: {
        AppStore
    }
})

app.use(store)
app.use(Connection, connection)
app.use(VueNumerals)
app.use(VueAxios, axios)
app.mount('#app')