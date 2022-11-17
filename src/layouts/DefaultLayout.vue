<template>
    <header class="container">
        <Landing v-if="components.Landing" @action="buttonAction">{NFT Flush}</Landing>
    </header>

    <main class="container flex-shrink-0 mb-4">
        <router-view />
    </main>

    <footer class="container footer mb-2 mt-auto">
        <div class="border-top py-3">
            &copy; Three
            <Refs />
        </div>
    </footer>
</template>

<script>
    import Refs from '../components/Refs.vue'
    import Landing from '../components/Landing.vue'
    import xapp from '../plugins/xapp.js'

    import {XummSdkJwt} from 'xumm-sdk'

    const Sdk = new XummSdkJwt(import.meta.env.VITE_APP_NFT_KEY)
    const xappSdk = new xAppSdk()

    export default {
        name: 'DefaultLayout',
        components: {
            Refs,
            Landing
        },
        data() {
            return {
                nodetype: 'TESTNET',
                socket: null,
                timeout_socket: null,
                reconnect_socket: 0,
                pong: false,
                ready: false,
                components: {
                    Landing: true,
                    Loan: false,
                    Actions: false
                }
            }
        },
        async mounted() {
            this.jwtFlow()
        },
        methods: {
            async jwtFlow() {
                const urlParams = new URLSearchParams(window.location.search)
                const ott = urlParams.get('xAppToken')
                const tokenData =  await xapp.getTokenData(ott)
                console.log('tokenData', tokenData)
                this.$store.dispatch('xummTokenData', tokenData)
                this.$store.dispatch('setAccount', tokenData.account)
                this.nodetype = tokenData.nodetype

                const {data} = await this.axios.get(this.connection.url + `/api/v1/loans/user?account=${tokenData.account}`)
                
                await this.jwtSignIn()

                // if (data.user == false) {
                //     await this.jwtSignIn()
                // }
                // else {
                //     console.log('user', data)
                //     this.$store.dispatch('setUserToken', data.uuid)
                // }
                
                // this.connectWebsocket()
            },
            async jwtSignIn() {
                console.log('jwtSignInjwtSignInjwtSignIn')
                const {data} = await xapp.signPayload({ txjson: { TransactionType: 'SignIn' }})
                console.log('result', data)
                console.log('UUID', data.application.issued_user_token)
                this.$store.dispatch('setUserToken', data.application.issued_user_token)  
            },
            connectWebsocket() {
                const self = this
                console.log('location', window.location.origin)
                if ('https://192.168.0.19:3007' == window.location.origin) {
                    console.log('using local socket')
                    this.socket = new WebSocket(this.connection.socket_local)
                }
                else {
                    console.log('using remote socket')
                    this.socket = new WebSocket(this.connection.socket)    
                }
                
                this.reconnect_socket++
                this.socket.onopen = function (message) {

                    const tokenData = self.$store.getters.getXummTokenData
                    console.log('getUserToken', self.$store.getters.getUserToken)
                    self.socket.send(JSON.stringify({
                        request: 'SUBSCRIBE',
                        message: {
                            account: self.$store.getters.getAccount, 
                            uuid: self.$store.getters.getUserToken, 
                            version: tokenData?.version,
                            locale: tokenData?.locale,
                            currency: tokenData?.currency,
                            nodetype: tokenData?.nodetype,
                            nodewss: tokenData?.nodewss,
                            user: tokenData?.user
                        },
                        channel: self.$store.getters.getAccount
                    }))
                    self.ping()

                    console.log('three escrow sockets connected! :)')
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
                            // console.log('PONG')
                            self.pong = true
                        }
                        if ('SUBSCRIBED' in data[account]) {
                            console.log('SUBSCRIBED!')
                        }
                        // if ('RATE_UPDATE' in data[account]) {
                        //     // console.log('RATE_UPDATE', data[account].RATE_UPDATE)
                        //     self.$store.dispatch('appendLoans', data[account].RATE_UPDATE)
                        // }
                        // if ('ESCROW_CREATE' in data[account]) {
                        //     console.log('ESCROW_CREATE', data[account].ESCROW_CREATE)
                        //     const result = await self.signPayload(data[account].ESCROW_CREATE)
                        //     console.log('result', result)
                        // }
                        // if ('ESCROW_CLEAR' in data[account]) {
                        //     console.log('ESCROW_CLEAR', data[account].ESCROW_CLEAR)
                        //     self.$store.dispatch('removeLoan', data[account].ESCROW_CLEAR)
                        // }
                    }
                }
                setInterval(() => {
                    self.pong = false
                    self.ping()
                }, 10_000)

                this.socket.onerror = function (message) {
                    console.log('There was an error connection to three escrow socket! :(')
                    console.log(message)
                    self.socket.close()
                }

                this.socket.onclose = function (message) {
                    console.log('three socket escrow disconnected!', message)
                    if (self.timeout_socket == null && message.code != 1005) {
                        self.timeout_socket = setTimeout(() => {
                            if (self.reconnect_socket < 30) {
                                self.connectWebsocket() 
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
            sendSocket(params) {
                this.socket.send(JSON.stringify(params))
            },
            buttonAction(action) {
                console.log('buttonAction', action)
                switch (action) {
                    case 'loan':
                        this.components.Loan = true
                        this.components.Landing = false
                        this.components.Actions = false
                        break
                    case 'home':
                        this.components.Landing = true
                        this.components.Loan = false
                        this.components.Actions = false
                        break
                    case 'loan-actions':
                        this.components.Landing = false
                        this.components.Loan = false
                        this.components.Actions = true
                        break
                }
            }
        } 
    }
</script>
