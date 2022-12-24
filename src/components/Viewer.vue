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

    export default {
        name: 'Viewer',
        props: ['client', 'Sdk', 'nodetype'],
        data() {
            return {
                three: null,
                image: null,
                video: null,
                audio: null
            }
        },
        async mounted() {
            console.log('viewer mounted...')
            await fetchNFTs()
        },
        async fetchNFTs() {
            const payload = {
                'id': 9,
                'command': 'account_nfts',
                'account': this.$store.getters.getAccount,
                'ledger_index': 'validated'
            }

            let res = await this.client.send(payload)
            let account_nfts = res.account_nfts           
            while (res['marker'] !== undefined) {
                console.log('marker', res['marker'])
                payload.marker = res['marker']
                const res = await this.client.send(payload)
                this.account_nfts.concat(res.account_nfts)
            }
            console.log('account_nfts', account_nfts)
        }
    }
</script>

<style scoped>
</style>