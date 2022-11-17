<template>
    <div class="p-5 mb-4 bg-light rounded-3">
        <div class="container-fluid py-5">
            <img class="bog-roll" src="dist/assets/e.png">
            <p class="col-md-8 fs-4">
                <p class="text-muted text-end fs-6">by three</p>
            </p>
            <p class="col-md-12 fs-4">
                <p class="text-center">
                    <a class="btn btn-purple" @click="flushAll" role="button" id="flushAll" v-if="account != ''">flush all</a>
                </p>
            </p>
        </div>
    </div>

    <div v-if="NFTokenOffers.length > 0" class="py-5 mb-4">
        <div class="container-fluid pb-5">
            <h1 class="display-5 fw-bold">{OPEN NFT Offers}</h1>
            <table class="table">
                <thead class="table-dark">
                    <tr>
                        <th style="cursor: pointer;" scope="col" v-for="col in columns" v-on:click="sortTable(col)">{{col}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in NFTokenOffers">
                        <td scope="row">{{numeralFormat((row['Amount']/1_000_000), '0,0[.]00000000') }}</td>
                        <td scope="row">{{row['NFTokenID']}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <footer>
        <p>XRPL ledger: {{ledger}}</p>
        <p>account: {{account}}</p>
    </footer>
</template>

<script>
    import { XrplClient } from 'xrpl-client'
    // import xapp from '../plugins/xapp.js'

    const xapp = new xAppSdk()

    import {XummSdkJwt} from 'xumm-sdk'
    const Sdk = new XummSdkJwt(import.meta.env.VITE_APP_NFT_KEY)

    export default {
        name: 'Landing',
        data() {
            return {
                isLoading: true,
                client: new XrplClient(['wss://hooks-testnet-v2.xrpl-labs.com']),
                NFTokenOffers:[],
                ascending: false
            }
        },
        async mounted() {
            console.log('landing mounted...')
            if (this.$store.getters.getAccount != '') {
                console.log('landing fetchNFTs...')
                await this.fetchNFTs()
            }
        },
        computed: {
            ledger() {
                return this.$store.getters.getLedger
            },
            account() {
                return this.$store.getters.getAccount
            },
            columns() {
                if (this.NFTokenOffers.length == 0) {
                    return []
                }
                return ['Amount', 'NFTokenID']
                //return Object.keys(this.NFTokenOffers[0]).filter( code => code !== 'ledger')
            }
        },
        watch: {
            async account() {
                if (this.$store.getters.getAccount != '') {
                    console.log('landing fetchNFTs...')
                    await this.fetchNFTs()
                }
            }
        },
        methods: {
            async fetchNFTs() {
                if (this.$store.getters.getAccount == '') { return }

                const payload = {
                    'id': 8,
                    'command': 'account_objects',
                    'account': this.$store.getters.getAccount,
                    'ledger_index': 'validated',
                    'limit': 200
                }
                const res = await this.client.send(payload)
                // console.log('res', res)
                for (let index = 0; index < res.account_objects.length; index++) {
                    const element = res.account_objects[index]
                    if (element?.LedgerEntryType === 'NFTokenOffer') {
                        // console.log('NFTokenOffer', element)
                        this.NFTokenOffers.push(element)
                    }
                }
                this.isLoading = false
            },
            async flushAll() {
                if (this.$store.getters.getAccount == '') { return }

                const openOffers = this.NFTokenOffers.reduce((a, b) => a.concat(b.NFTokenID), [])
                // console.log('openOffers', openOffers)
                const tx = {
                    TransactionType: 'NFTokenCancelOffer',
                    Account: this.$store.getters.getAccount,
                    NFTokenOffers: openOffers
                }
                console.log('signPayload', tx)
                // const signPayload = await Sdk.payload.create({ txjson: tx})

                // const {data} = await xapp.signPayload({ txjson: tx })


                // const payload = await Sdk.payload.create(tx)
                const signPayload = await xapp.openSignRequest({ txjson: tx})
                
                
                console.log('result', signPayload)
            },
            sortTable(col) {
                if (this.sortColumn === col) {
                    this.ascending = !this.ascending
                } else {
                    this.ascending = true
                    this.sortColumn = col
                }

                let ascending = this.ascending

                this.NFTokenOffers.sort(function(a, b) {
                    if (a[col] > b[col]) {
                    return ascending ? 1 : -1
                    } else if (a[col] < b[col]) {
                    return ascending ? -1 : 1
                    }
                    return 0
                })
            },
            currencyHexToUTF8(code) {
				if (code.length === 3)
					return code

				let decoded = new TextDecoder()
					.decode(this.hexToBytes(code))
				let padNull = decoded.length

				while (decoded.charAt(padNull - 1) === '\0')
					padNull--

				return decoded.slice(0, padNull)
			},
            hexToBytes(hex) {
				let bytes = new Uint8Array(hex.length / 2)

				for (let i = 0; i !== bytes.length; i++) {
					bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
				}

				return bytes
			}
        },
    }
</script>
<style scoped>
    .bog-roll {
        width: 100%;
    }
    .main-text {
        color: #753ee2;
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: black;
    }
    .btn-purple {
        background-color: #753ee2;
        color: #ffffff;
    }
    .btn-pink {
        background-color: #ff1a8b;
        color: #ffffff;
    }

    .btn-green {
        background-color: #00e56a;
        color: #ffffff;
    }
</style>
