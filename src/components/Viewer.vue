<template>
    <!-- Content -->
    <div class="container d-flex justify-content-center my-4 mb-5">

        <div id="mobile-box">

        <!-- Card -->
        <div class="card">
            <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
            <img class="card-img-top" src="https://mdbootstrap.com/wp-content/uploads/2019/02/flam.jpg"
                alt="Card image cap">
            <a href="#!">
                <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
            </a>
            </div>
            <div class="card-body text-center">

            <h5 class="h5 font-weight-bold"><a href="#" target="_blank">Dj Flam</a></h5>
            <p class="mb-0">Urban Bachata remix</p>

            <audio id="music" preload="true">
                <source src="#">
            </audio>
            <div id="audioplayer">
                <i id="pButton" class="fas fa-play"></i>
                <div id="timeline">
                <div id="playhead"></div>
                </div>
            </div>

            </div>
        </div>
        <!-- Card -->
        </div>
    </div>
    <!-- Content -->
</template>

<script>
const xapp = window.xAppSdk
import { Buffer } from 'buffer'

export default {
    name: 'Viewer',
    props: ['client', 'Sdk', 'nodetype'],
    data() {
        return {
            selected: 0,
            account_nfts: [],
            three: null,
            image: null,
            video: {
                muted: true,
                loop: false,
                autoplay: true,
                controls: true
            },
            audio: {
                muted: false,
                loop: false,
                autoplay: true,
                controls: true
            }
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
        async getImageURL(NFT, index) {
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
            const { data } = await this.axios.get(convertedURI, { timeout: 1000 })
            this.account_nfts[index]['data'] = {}
            console.log('data', data)
            if ('image' in data) {
                const result = data.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                if (result != '') {
                    this.account_nfts[index]['data']['image'] = result
                    console.log('image', result)
                }
            }

            if ('video' in data) {
                const result = data.video.replace('ipfs://', 'https://ipfs.io/ipfs/')
                if (result != '') {
                    this.account_nfts[index]['data']['video'] = result
                    console.log('video', result)
                    this.account_nfts[index]['data']['video_extension'] = this.getExtensionURL()
                }
            }

            if ('audio' in data) {
                const result = data.audio.replace('ipfs://', 'https://ipfs.io/ipfs/')
                if (result != '') {
                    this.account_nfts[index]['data']['audio'] = result
                    console.log('audio', result)
                }
            }
        },
        getExtensionURL(url) {
            return url.split(/[#?]/)[0].split('.').pop().trim();
        }
    }
}
</script>

<style scoped>
    video[poster] {
        /* height: 100% !important; */
        /* object-fit: cover; */
        /* position: absolute; */
    }
    .media-image {
        height: 100% !important; 
        width: 100% !important;
        
        position: absolute;
        background-position: center; background-repeat: no-repeat; background-size: cover;
    }

</style>