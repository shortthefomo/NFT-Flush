<template>
    <header class="container">
        <Landing v-if="components.Landing" :client="client" :Sdk="Sdk" :nodetype="nodetype">{NFT Flush}</Landing>
        <Viewer v-if="components.Viewer" :client="client" :Sdk="Sdk" :nodetype="nodetype">{NFT Flush}</Viewer>
        
    </header>

    <main class="container flex-shrink-0 mb-4">
    </main>

    <footer class="container footer mb-2 mt-auto">
        <div class="border-top py-3">
            &copy; Three
            <Refs />
        </div>
    </footer>
</template>

<script>
    import Refs from './components/Refs.vue'
    import Landing from './components/Landing.vue'
    import Viewer from './components/Viewer.vue'

    import { XrplClient } from 'xrpl-client'

    const xapp = window.xAppSdk

    import {XummSdkJwt} from 'xumm-sdk'

    export default {
        components: {
            Landing,
            Viewer,
            Refs
        },
        data() {
            return {
                Sdk: new XummSdkJwt(import.meta.env.VITE_APP_NFT_KEY),
                nodetype: 'TESTNET',
                socket: null,
                timeout_socket: null,
                reconnect_socket: 0,
                pong: false,
                ready: false,
                components: {
                    Landing: false,
                    Viewer: false
                },
                client: null,
                signedIn: false
            }
        },
        async mounted() {
            if (this.components.Landing) { return }
            await this.jwtFlow()
            this.components.Landing = true
            if (this.$store.getters.getAccount == 'rThREeXrp54XTQueDowPV1RxmkEAGUmg8') {
                this.components.Landing = false
                this.components.Viewer = true
            }
            
        },
        methods: {

            async getStoreage() {
			    const storageGet = await this.Sdk.storage.get()
			    console.log('storageGet', storageGet)
            },
            async jwtFlow() {
                const tokenData = await this.Sdk.getOttData()
                console.log('tokenData', tokenData)
                this.$store.dispatch('xummTokenData', tokenData)
                console.log('account', tokenData.account)
                this.$store.dispatch('setAccount', tokenData.account)
                this.nodetype = tokenData.nodetype

                const servers = [tokenData.nodewss]
                if (tokenData.nodetype == 'MAINNET') {
                    servers.unshift('wss://node.panicbot.xyz')
                }
                console.log('ws servers', servers)
                
                this.client = new XrplClient(servers)

                const callback = async (event) => {
                    let request = {
                        'id': 'xrpl-local',
                        'command': 'ledger',
                        'ledger_hash': event.ledger_hash,
                        'ledger_index': 'validated',
                        'transactions': true,
                        'expand': true,
                        'owner_funds': true
                    }
    
                    const ledger_result = await this.client.send(request)
                    if ('error' in ledger_result) {
                        console.log('XRPL error', ledger_result)
                    }
                    
                    if ('ledger' in ledger_result) {
                        // console.log('ledger', ledger_result)
                        this.$store.dispatch('setLedger', ledger_result.ledger.ledger_index)
                    }
                }
                this.client.on('ledger', callback)
                await this.connectWebsocket()
                // await this.jwtSignIn()
            },
            async jwtSignIn() {
                const self = this
                const request  = { txjson: { TransactionType: 'SignIn' }}
                // const subscription = await this.Sdk.payload.create(request)

                const subscription = await this.Sdk.payload.createAndSubscribe(request, async event => {
                    console.log('New payload event:', event.data)

                    if (event.data.signed === true) {
                        console.log('Woohoo! The sign request was signed :)')
                        self.signedIn = true
                        self.$store.dispatch('setUserToken', event.data.payload_uuidv4)
                        await self.connectWebsocket()
                        await self.getStoreage()
                        return event.data
                    }

                    if (event.data.signed === false) {
                        console.log('The sign request was rejected :(')
                        xapp.close({ refreshEvents: true })
                            .then(d => {
                                // d (returned value) can be Error or return data:
                                console.log('close response:', d instanceof Error ? d.message : d)
                            })
                            .catch(e => console.log('Error:', e.message))
                        return false
                    }
                })
                console.log('subscription', subscription)

                xapp.openSignRequest({ uuid: subscription.created.uuid })
                    .then(d => {
                        // d (returned value) can be Error or return data:
                        console.log('openSignRequest response:', d instanceof Error ? d.message : d)
                    })
                    .catch(e => console.log('Error:', e.message))
            },
            async connectWebsocket() {
                const self = this
                console.log('location', window.location.origin)
                if ('https://192.168.0.20:3007' == window.location.origin) {
                    console.log('using local socket')
                    this.socket = new WebSocket(this.connection.socket_local)
                }
                else {
                    console.log('using remote socket')
                    this.socket = new WebSocket(this.connection.socket)    
                }
                const server_info = await this.client.getState()
                console.log('client connection', server_info)

                this.reconnect_socket++
                this.socket.onopen = function (message) {
                    const tokenData = self.$store.getters.getXummTokenData
                    self.socket.send(JSON.stringify({
                        request: 'SUBSCRIBE',
                        message: {
                            app: 'NFT-Flush',
                            appkey: import.meta.env.VITE_APP_NFT_KEY,
                            account: self.$store.getters.getAccount, 
                            uuid: self.$store.getters.getUserToken, 
                            version: tokenData.version,
                            locale: tokenData.locale,
                            currency: tokenData.currency,
                            nodetype: tokenData.nodetype,
                            nodewss: server_info.server.uri,
                            user: tokenData.user
                        },
                        channel: self.$store.getters.getAccount
                    }))
                    self.ping()

                    console.log('NFT Flush sockets connected! :)')
                }
                this.socket.onmessage = async function (message) {
                    if (self.timeout_socket != null) {
                        clearTimeout(self.timeout_socket)
                        self.timeout_socket = null
                    }
                    let data = JSON.parse(message.data)
                    const account = self.$store.getters.getAccount
                    if (account in data) {
                        if ('PONG' in data[account]) {
                            self.pong = true
                        }
                        if ('SUBSCRIBED' in data[account]) {
                            console.log('SUBSCRIBED!')
                        }
                    }
                }
                setInterval(() => {
                    self.pong = false
                    self.ping()
                }, 10_000)

                this.socket.onerror = function (message) {
                    console.log('There was an error connection to three NFT Flush socket! :(')
                    console.log(message)
                    self.socket.close()
                }

                this.socket.onclose = function (message) {
                    console.log('three socket NFT Flush disconnected!', message)
                    if (self.timeout_socket == null && message.code != 1005) {
                        self.timeout_socket = setTimeout(async () => {
                            if (self.reconnect_socket < 30) {
                                await self.connectWebsocket() 
                            }
                        }, 3000)
                    }
                }
            },
            ping() {
                if (this.$store.getters.getAccount != '') {
                    this.socket.send(JSON.stringify({
                        request: 'PING',
                        message: {account: this.$store.getters.getAccount},
                        channel: this.$store.getters.getAccount
                    }))
                }
                else {
                    console.log('account is empty')
                }
            },
        }
    }
</script>