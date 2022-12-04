<template>
    <div class="p-5 mb-4 bg-light rounded-3">
        <div class="container-fluid py-5">
            <img class="bog-roll" src="/dist/assets/e.png">
            <p class="col-md-8 fs-4">
                <p class="text-muted text-end fs-6">by three</p>
            </p>
            <p class="col-md-12 fs-4">
                <p class="text-center">
                    <a v-if="account != '' && hasOffers" class="btn btn-purple me-2" @click="flushAll" role="button" id="flushAll">flush all</a>
                    <a v-if="account != '' && hasSelected" class="btn btn-pink me-2" @click="flushSelected" role="button" id="flushSelected">flush selected</a>
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
                    <tr v-for="row in NFTokenOffers" @click="selectedRow(row)" :class="highlights(row)">
                        <td v-if="typeof row['Amount'] === 'object'">{{numeralFormat((row['Amount'].value/1_000_000), '0,0[.]00000000') }} {{currencyHexToUTF8(row['Amount'].currency)}}</td>
                        <td v-else>{{numeralFormat((row['Amount']/1_000_000), '0,0[.]00000000')}} XRP</td>
                        <td style="max-width:60px;" v-if="('Image' in row)"><img class="img-fluid" :src="row['Image']" :alt="row['OfferID']" :title="row['OfferID']"></td>
                        <td v-else>{{row['OfferID']}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else>
        <div class="container-fluid pb-5">
            <h1 class="display-5 fw-bold">{OPEN NFT Offers}</h1>
            <p>There are no open offers on your account</p>
        </div>
    </div>
    <footer>
        <p>XRPL ledger: {{ledger}}</p>
        <p>account: {{account}}</p>
    </footer>
</template>

<script>
    const xapp = window.xAppSdk
    import {XummSdkJwt} from 'xumm-sdk'
    import { Buffer } from 'buffer'
    const Sdk = new XummSdkJwt(import.meta.env.VITE_APP_NFT_KEY)

    export default {
        name: 'Landing',
        props: ['client'],
        data() {
            return {
                isLoading: true,
                NFTokenOffers:[],
                selectedRows: [],
                ascending: false,
                awaitSign: false
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
            hasOffers() {
                const offers = (this.NFTokenOffers.length > 0) ? true:false
                return offers
            },
            hasSelected() {
                const selected = (this.selectedRows.length > 0) ? true:false
                return selected
            },
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
                return ['Offered', 'NFT']
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
            highlights(offer) {
                if (!this.selectedRows.includes(offer.OfferID)) {
                    return ''
                }
                return 'table-secondary'
            },
            selectedRow(offer) {
                console.log('offer', offer.OfferID)
                if (!this.selectedRows.includes(offer.OfferID)) {
                    this.selectedRows.push(offer.OfferID)
                }
                else {
                    this.selectedRows.splice(this.selectedRows.indexOf(offer.OfferID), 1)
                }
                console.log('Selected items', this.selectedRows)
            },
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
                this.NFTokenOffers = []
                console.log('res', res)
                console.log('objects', res.account_objects)

                for (let index = 0; index < res.account_objects.length; index++) {
                    const element = res.account_objects[index]
                    if (element?.LedgerEntryType === 'NFTokenOffer') {
                        // console.log('NFTokenOffer', element)
                        element.OfferID = element.index
                        this.NFTokenOffers.push(element)
                    }
                }

                this.isLoading = false
                try {
                    await this.fetchImages()
                } catch (error) {
                    console.log('fetchImages error', error)
                }
            },
            async fetchImages() {
                if (this.NFTokenOffers.length < 1) { return }

                for (let index = 0; index < this.NFTokenOffers.length; index++) {
                    const element = this.NFTokenOffers[index]
                    await this.fetchOwnerNFTs(element.Owner, element.NFTokenID, index)                    
                }
            },
            async fetchOwnerNFTs(account, NFTokenID, item) {
                const payload = {
                    'id': 8,
                    'command': 'account_nfts',
                    'account': account,
                    'ledger_index': 'validated',
                    'limit': 200
                }
                const res = await this.client.send(payload)
                // console.log('objects', res.account_nfts)

                for (let index = 0; index < res.account_nfts.length; index++) {
                    const element = res.account_nfts[index]
                    // console.log('searching for', element.NFTokenID)
                    try {
                        if (NFTokenID == element.NFTokenID) {
                            const URI = Buffer.from(element.URI, 'hex').toString('utf8')
                            const convertedURI = URI.replace('ipfs://', 'https://ipfs.io/ipfs/')
                            // console.log('convertedURI', convertedURI)
                            this.axios.get(convertedURI).then(res => {
                                // console.log('data', res.data)
                                try {
                                    // const ipfsData = JSON.parse(data)
                                    // console.log('image', res.data?.image)
                                    // console.log('item', item)
                                    // console.log('offf', this.NFTokenOffers[item])
                                    this.NFTokenOffers[item].Image = res.data?.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                                } catch (e) {
                                    console.log('error', e)
                                }
                            })
                        }
                    } catch (e) {
                        // console.log('error', e)
                    }
                }
            },
            findNFT(NFTokenID) {
                for (let index = 0; index < this.NFTokenOffers.length; index++) {
                    const element = this.NFTokenOffers[index]
                    if (NFTokenID == element.NFTokenID) {
                        return index
                    }
                }
                return false
            },
            async flushSelected() {
                if (this.$store.getters.getAccount == '') { return }
                if (this.selectedRows.length < 1) { return }
                const tx = {
                    TransactionType: 'NFTokenCancelOffer',
                    Account: this.$store.getters.getAccount,
                    NFTokenOffers: this.selectedRows
                }
                console.log('tx', tx)
                const count = this.selectedRows.length * import.meta.env.VITE_APP_XAPP_RESERVE
                
                const request = { custom_meta: { instruction: `Remove selected offers and return ${count} XRP reserve.`}, txjson: tx}

                const payload = await Sdk.payload.createAndSubscribe(request, async event => {
                    console.log('New payload event:', event.data)

                    if (event.data.signed === true) {
                        console.log('Woohoo! The sign request was signed :)')
                        await this.fetchNFTs()

                        return event.data
                    }

                    if (event.data.signed === false) {
                        console.log('The sign request was rejected :(')
                        return false
                    }
                })
                console.log('payload', payload)

                xapp.openSignRequest({ uuid: payload.created.uuid })
            },
            async flushAll() {
                if (this.$store.getters.getAccount == '') { return }
                
                const openOffers = this.NFTokenOffers.reduce((a, b) => a.concat(b.index), [])
                //console.log('openOffers', openOffers)
                if (openOffers.length < 1) { return }

                const tx = {
                    TransactionType: 'NFTokenCancelOffer',
                    Account: this.$store.getters.getAccount,
                    NFTokenOffers: openOffers
                }
                console.log('tx', tx)
                const count = openOffers.length * import.meta.env.VITE_APP_XAPP_RESERVE
                const request = { custom_meta: { instruction: `Remove all offers and return ${count} XRP reserve.` }, txjson: tx}               

                const payload = await Sdk.payload.createAndSubscribe(request, async event => {
                    console.log('New payload event:', event.data)

                    if (event.data.signed === true) {
                        console.log('Woohoo! The sign request was signed :)')
                        await this.fetchNFTs()
                        return event.data
                    }

                    if (event.data.signed === false) {
                        console.log('The sign request was rejected :(')
                        return false
                    }
                })
                console.log('payload', payload)

                xapp.openSignRequest({ uuid: payload.created.uuid })                
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

    .btn-yellow {
        background-color: #ffc107;
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
