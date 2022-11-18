<template>
    <header class="container">
        <Landing v-if="components.Landing" @action="buttonAction" :client="client">{NFT Flush}</Landing>
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
    import Refs from './components/Refs.vue'
    import Landing from './components/Landing.vue'
    //import xapp from './plugins/xapp.js'
    import { XrplClient } from 'xrpl-client'

    const xapp = window.xAppSdk

    import {XummSdkJwt} from 'xumm-sdk'

    const Sdk = new XummSdkJwt(import.meta.env.VITE_APP_NFT_KEY)

    export default {
        components: {
            Landing,
            Refs
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
                    Landing: false
                },
                client: null
            }
        },
        async mounted() {
            if (this.components.Landing) { return }
            await this.jwtFlow()
            this.components.Landing = true
        },
        methods: {
            async jwtFlow() {
                const tokenData = await Sdk.getOttData()
                console.log('tokenData', tokenData)
                this.$store.dispatch('xummTokenData', tokenData)
                console.log('account', tokenData.account)
                this.$store.dispatch('setAccount', tokenData.account)
                this.nodetype = tokenData.nodetype
                this.client = new XrplClient([tokenData.nodewss])

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
                await this.jwtSignIn()
            },
            async jwtSignIn() {
                const self = this
                const request  = { txjson: { TransactionType: 'SignIn' }}
                const subscription = await Sdk.payload.create(request)

                // const subscription = await Sdk.payload.createAndSubscribe(request, event => {
                //     console.log('New payload event:', event.data)

                //     if (event.data.signed === true) {
                //     console.log('Woohoo! The sign request was signed :)')
                //     return event.data
                //     }

                //     if (event.data.signed === false) {
                //     console.log('The sign request was rejected :(')
                //     return false
                //     }
                // })
                console.log('subscription', subscription)

                xapp.openSignRequest({ uuid: subscription.uuid })
                    .then(d => {
                        // d (returned value) can be Error or return data:
                        console.log('openSignRequest response:', d instanceof Error ? d.message : d)
                        console.log('d', d)

                        xapp.on('payload', function (data) {
                            console.log('Payload resolved', data)
                            if (data.reason == 'SIGNED') {
                                console.log('it was signeddd!!!')
                            }
                            else {
                                xapp.close({ refreshEvents: true })
                                    .then(d => {
                                        // d (returned value) can be Error or return data:
                                        console.log('close response:', d instanceof Error ? d.message : d)
                                    })
                                    .catch(e => console.log('Error:', e.message))
                            }
                        })
                    })
                    .catch(e => console.log('Error:', e.message))
            },
        }
    }
</script>