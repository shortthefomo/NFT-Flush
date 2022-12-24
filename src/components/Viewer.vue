<template>
    <div class="p-5 mb-4 bg-light rounded-3">
        <div class="container-fluid py-5">
            <div v-if="three != null"><p>3D</p></div>
            <div v-if="image != null"><p>show image</p></div>
            <div v-if="video != null"><p>show video</p></div>
            <div v-if="audio != null"><p>listen audio</p></div>
        </div>
    </div>
</template>

<script>
    const xapp = window.xAppSdk
    import { Buffer } from 'buffer'

    export default {
        name: 'Viewer',
        props: ['client', 'Sdk', 'nodetype'],
        data() {
            return {
                account_nfts: [],
                three: null,
                image: null,
                video: null,
                audio: null
            }
        },
        async mounted() {
            console.log('viewer mounted...')
            await this.fetchNFTs()
        },
        methods: {
            async fetchNFTs() {
                const payload = {
                    'id': 9,
                    'command': 'account_nfts',
                    'account': this.$store.getters.getAccount,
                    'ledger_index': 'validated'
                }

                let res = await this.client.send(payload)
                this.account_nfts = res.account_nfts           
                while (res['marker'] !== undefined) {
                    console.log('marker', res['marker'])
                    payload.marker = res['marker']
                    const res = await this.client.send(payload)
                    this.account_nfts.concat(res.account_nfts)
                }
                console.log('account_nfts', this.account_nfts)
                for (let index = 0; index < this.account_nfts.length; index++) {
                    const element = this.account_nfts[index]
                    this.getImageURL(element, index)
                }
            },
            async getImageURL(NFT,index) {
                try {
                    const URI = Buffer.from(NFT.URI, 'hex').toString('utf8')
                    await this.convertURI(URI, index)
                    return true
                } catch (e) {
                    console.log('error', e)
                }
                console.log('NOT FOUND!!!')
                return false
            },
            async convertURI(URI, index) {
                const convertedURI = URI.replace('ipfs://', 'https://ipfs.io/ipfs/')
                const {data} = await this.axios.get(convertedURI, { timeout: 1000 })
                this.account_nfts[index]['data'] = {}
                console.log('data', data)
                if ('image' in data) {
                    console.log('image', data.image.replace('ipfs://', 'https://ipfs.io/ipfs/'))
                    this.account_nfts[index]['data']['image'] = data.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                    console.log('image', this.account_nfts[index]['data']['image'])
                }

                if ('video' in data) {
                    console.log('video', data.video.replace('ipfs://', 'https://ipfs.io/ipfs/'))
                    this.account_nfts[index]['data']['video'] = data.video.replace('ipfs://', 'https://ipfs.io/ipfs/')
                    console.log('video', this.account_nfts[index]['data']['video'])
                }

                if ('audio' in data) {
                    console.log('audio', data.audio.replace('ipfs://', 'https://ipfs.io/ipfs/'))
                    this.account_nfts[index]['data']['audio'] = data.audio.replace('ipfs://', 'https://ipfs.io/ipfs/')
                    console.log('audio', this.account_nfts[index]['data']['audio'])
                }
            }
        }
    }
</script>

<style scoped>
</style>