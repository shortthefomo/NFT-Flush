<template>
    <div class="p-5 mb-4 bg-light rounded-3">
        <div class="container-fluid py-5">
            <img class="bog-roll" src="/e.png">
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
                        <td v-if="typeof row['Amount'] === 'object'"><span :class="styleLabel(row['Flags'])">{{row['Flags'] == 1 ? 'Sell': 'Buy'}}</span> {{numeralFormat((row['Amount'].value), '0,0') }} {{currencyHexToUTF8(row['Amount'].currency)}}</td>
                        <td v-else> <span :class="styleLabel(row['Flags'])">{{row['Flags'] == 1 ? 'Sell': 'Buy'}}</span> {{numeralFormat((row['Amount']/1_000_000), '0,0[.]00000000')}} XRP</td>

                        <td style="max-width:60px;" v-if="('Image' in row)"><img class="img-fluid" :src="row['Image']" :alt="row['OfferID']" :title="row['OfferID']"></td>
                        <td v-else style="width:60px !important; overflow: hidden;">...{{row['OfferID'].substring(row['OfferID'].length-5, row['OfferID'].length)}}</td>
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
    import { Buffer } from 'buffer'

    export default {
        name: 'Landing',
        props: ['client', 'Sdk', 'nodetype'],
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
                return ['Side', 'NFT']
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
            styleLabel(value) {
                if (value == 1) {
                    return 'btn-pink px-2 py-1'
                }
                return 'bg-info px-2 py-1'
            },
            highlights(offer) {
                if (!this.selectedRows.includes(offer.OfferID)) {
                    return ''
                }
                return 'table-secondary'
            },
            selectedRow(offer) {
                // console.log('offer', offer.OfferID)
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
                    'limit': 1000
                }
                const res = await this.client.send(payload)
                this.NFTokenOffers = []
                
                if ('error' in res) { return }
                if (!('account_objects' in res)) { return }
                const account_objects = res.account_objects

                while (res['marker'] !== undefined) {
                    payload.marker = res['marker']
                    res = await this.client.send(payload)
                    if ('error' in res) { return }
                    if (!('account_objects' in res)) { return }
                    account_objects.concat(res.account_objects)
                }


                for (let index = 0; index < account_objects.length; index++) {
                    const element = account_objects[index]
                    if (element.LedgerEntryType === 'NFTokenOffer') {
                        console.log('NFTokenOffer', element)
                        element.OfferID = element.index
                        this.NFTokenOffers.push(element)
                    }
                }

                this.isLoading = false
                await this.fetchImages()
                
            },
            async fetchImages() {
                if (this.NFTokenOffers.length < 1) { return }

                for (let index = 0; index < this.NFTokenOffers.length; index++) {
                    const element = this.NFTokenOffers[index]
                    this.fetchOwnerNFTs(element.NFTokenID, index)              
                }
            },
            async fetchOwnerNFTs(NFTokenID, item) {
                let account = null
                // console.log('fetchOwnerNFTs', NFTokenID, item)
                
                const payload_sell_offers = {
                    'id': 1,
                    'command': 'nft_sell_offers',
                    'nft_id': NFTokenID,
                    'ledger_index': 'validated'
                }
                let nft_offers = await this.client.send(payload_sell_offers)

                if (!('offers' in nft_offers)) { 
                    console.log('owner NOT FOUND no offers 1', NFTokenID)
                    console.log('nft_offers', nft_offers)
                    await this.fallbackXRPLServices(NFTokenID, item)
                    return }
                if (nft_offers.offers.length == 0) { 
                    console.log('owner NOT FOUND no offers 2', NFTokenID)
                    return }

                account = nft_offers.offers[0].owner
                console.log('owner FOUND', account)

                const payload = {
                    'id': 8,
                    'command': 'account_nfts',
                    'account': account,
                    'ledger_index': 'validated',
                    'limit': 400
                }
                let res = await this.client.send(payload)

                
                await this.getImageURL(res, item, NFTokenID)
                if (this.hasImage(item)) { return }
                while (res['marker'] !== undefined) {
                    console.log('marker', res['marker'])
                    payload.marker = res['marker']
                    res = await this.client.send(payload)
                    await this.getImageURL(res, item, NFTokenID)
                    if (this.hasImage(item)) { return }
                }
                await this.fallbackXRPLServices(NFTokenID)
            },
            async fallbackXRPLServices(NFTokenID, item) {
                if (this.nodetype != 'MAINNET') { return }
                try {
                    const {data} = await this.axios.get(`https://api.xrpldata.com/api/v1/xls20-nfts/nft/${NFTokenID}`, { timeout: 1000 })
                    const URI = Buffer.from(data.data.nft.URI, 'hex').toString('utf8')
                    // console.log('URRRIII', URI)
                    await this.convertURI(URI, item)
                } catch (e) {
                    // do nothing
                }
            },
            hasImage(item) {
                if (this.NFTokenOffers[item] != null && this.NFTokenOffers[item].Item != undefined) {
                    return true
                }
                return false
            },
            async getImageURL(res, item, NFTokenID) {
                try {
                    for (let index = 0; index < res.account_nfts.length; index++) {
                        const element = res.account_nfts[index]
                        if (NFTokenID == element.NFTokenID) {
                            // console.log('found', element)
                            const URI = Buffer.from(element.URI, 'hex').toString('utf8')
                            await this.convertURI(URI, item)
                            return true
                        }
                    }
                } catch (e) {
                    console.log('error', e)
                }
                console.log('NOT FOUND!!!')
                return false
            },
            async convertURI(URI, item) {
                const convertedURI = URI.replace('ipfs://', 'https://ipfs.io/ipfs/')
                const {data} = await this.axios.get(convertedURI, { timeout: 1000 })
                if ('image' in data) {
                    console.log('image', data.image.replace('ipfs://', 'https://ipfs.io/ipfs/'))
                    this.NFTokenOffers[item].Image = data.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                }
                if ('Image' in data) {
                    console.log('image', data.Image.replace('ipfs://', 'https://ipfs.io/ipfs/'))
                    this.NFTokenOffers[item].Image = data.Image.replace('ipfs://', 'https://ipfs.io/ipfs/')
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

                const payload = await this.Sdk.payload.createAndSubscribe(request, async event => {
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
                // console.log('tx', tx)
                const count = openOffers.length * import.meta.env.VITE_APP_XAPP_RESERVE
                const request = { custom_meta: { instruction: `Remove all offers and return ${count} XRP reserve.` }, txjson: tx}               

                const payload = await this.Sdk.payload.createAndSubscribe(request, async event => {
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
