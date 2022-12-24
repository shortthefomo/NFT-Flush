<template>
    <div class="simple-audio-player" id="simp" data-config='{"shide_top":false,"shide_btm":false,"auto_load":false}'>
    <div class="simp-playlist">
        <ul>
        <li><span class="simp-source" data-src="http://www.archive.org/download/CanonInD_261/CanoninD.mp3">Canon in D</span><span class="simp-desc">Johann Pachelbel</span></li>
        <li><span class="simp-source" data-src="https://www.script-tutorials.com/demos/363/data/05.mp3">Artist 5</span></li>
        <li><span class="simp-source" data-src="https://www.dropbox.com/s/6pays95q2a9jrsf/2020.01.02.mp3?dl=1" data-cover="https://i.postimg.cc/sDBycWS8/NMS-2019.jpg">Nightmare Side</span><span class="simp-desc">Set Stori</span></li>
        <li class="simp-active"><span class="simp-source" data-src="https://www.dropbox.com/s/k011ag91uktonbv/Angklung%20Preman%20Pensiun.mp3?dl=1">Angklung Preman Pensiun</span></li>
        <li><span class="simp-source" data-src="https://www.dropbox.com/s/prgte33m86n9ce7/Canon%20Rock%20%28JerryC%29%20-%20funtwo.mp3?dl=1">Canon Rock (JerryC)</span><span class="simp-desc">by Funtwo</span></li>
        <li><span class="simp-source" data-src="http://listento.ardanradio.com:1059/;">105.9 FM Ardan Radio</span><span class="simp-desc">Streaming Radio</span></li>
        <li><span class="simp-source" data-src="https://archive.org/download/78_jailhouse-rock_elvis-presley-jerry-leiber-mike-stoller_gbia0080595b/Jailhouse%20Rock%20-%20Elvis%20Presley%20-%20Jerry%20Leiber-restored.mp3">Jailhouse Rock</span><span class="simp-desc">Elvis Presley</span></li>
        <li><span class="simp-source" data-src="https://archive.org/download/J._Period_and_Michael_Jackson_-_Man_Or_The_Music-2010/17%20Smooth%20Criminal.mp3">Smooth Criminal</span><span class="simp-desc">Michael Jackson</span></li>
        <li><span class="simp-source" data-src="https://archive.org/download/OldPop_256/VillagePeople-Y.m.c.a.mp3">Y.M.C.A</span><span class="simp-desc">Village People</span></li>
        <li><span class="simp-source" data-src="https://archive.org/download/chuckberryjohnnyb.goode/Chuck%20Berry%20-%20Johnny%20B.%20Goode.mp3">Johnny B. Goode</span><span class="simp-desc">Chuck Berry</span></li>
        <li><span class="simp-source" data-src="https://archive.org/download/AnimalsTheHouseOfTheRisingSun_201811/Animals%20-%20The%20House%20Of%20The%20Rising%20Sun.mp3">House of the Rising Sun</span><span class="simp-desc">The Animals</span></li>
        <li><span class="simp-source" data-src="https://archive.org/download/DontStopMeNow_255/Queen-DontStopMeNow.mp3">Don't Stop Me Now</span><span class="simp-desc">Queen</span></li>
        <li><span class="simp-source" data-src="https://archive.org/download/NeverGonnaGiveYouUpOriginal/Never%20Gonna%20Give%20You%20Up%20Original.mp3">Never Gonna Give You Up</span><span class="simp-desc">Rick Astley</span></li>
        <li><span class="simp-source" data-src="https://archive.org/download/gunsnrosessweetchildomine_202003/Guns%20N%27%20Roses%20-%20Sweet%20Child%20%27O%20Mine.mp3">Sweet Child O' Mine</span><span class="simp-desc">Guns N' Roses</span></li>
        <li><span class="simp-source" data-src="https://archive.org/download/01.TheFinalCountdown/01.%20The%20Final%20Countdown.mp3">The Final Countdown</span><span class="simp-desc">Europe</span></li>
        <li><span class="simp-source" data-src="https://archive.org/download/1MyHeartWillGoOnLoveThemeFromTitanic/1%20-%20My%20Heart%20Will%20Go%20On%20%28Love%20Theme%20from%20_Titanic_%29.mp3">My Heart Will Go On</span><span class="simp-desc">Céline Dion</span></li>
        <li><span class="simp-source" data-src="https://archive.org/download/tntvillage_323140/John%20Lennon%20-%20Imagine/01%20Imagine.mp3">Imagine</span><span class="simp-desc">John Lennon</span></li>
        <li><span class="simp-source" data-src="https://archive.org/download/TheBeatles1970HeyJudeAppleRecords6e062.0434807HeyJude/The%20Beatles%20-%201970%20-%20Hey%20Jude%20%28Apple%20Records%3B%20%236e%20062.04348%29_07%20-%20Hey%20Jude.mp3">Hey Jude</span><span class="simp-desc">The Beatles</span></li>
        <li><span class="simp-source" data-src="https://archive.org/download/TakeMeHomeCountryRoad/JohnDenver-TakeMeHomeCountryRoad.mp3">Take Me Home, Country Roads</span><span class="simp-desc">John Denver</span></li>
        </ul>
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
        this.start()
    },
    methods: {
        start() {
            if (document.querySelector('#simp')) {
                let simp_auto_load, simp_audio, simp_album, simp_cover, simp_title, simp_artist, simp_controls, simp_progress, simp_volume, simp_v_slider, simp_v_num, simp_others
                let ap_simp = document.querySelector('#simp')
                let simp_playlist = ap_simp.querySelector('.simp-playlist')
                let simp_source = simp_playlist.querySelectorAll('li')
                let simp_a_url = simp_playlist.querySelectorAll('[data-src]')
                let simp_a_index = 0
                let simp_isPlaying = false
                let simp_isNext = false //auto play
                let simp_isRandom = false //play random
                let simp_isRanext = false //check if before random starts, simp_isNext value is true
                let simp_isStream = false //radio streaming
                let simp_isLoaded = false //audio file has loaded
                let simp_config = ap_simp.dataset.config ? JSON.parse(ap_simp.dataset.config) : {
                    shide_top: false, //show/hide album
                    shide_btm: false, //show/hide playlist
                    auto_load: false //auto load audio file
                };
                
                let simp_elem = ''
                simp_elem += '<audio id="audio" preload><source src="" type="audio/mpeg"></audio>';
                simp_elem += '<div class="simp-display"><div class="simp-album w-full flex-wrap"><div class="simp-cover"><i class="fa fa-music fa-5x"></i></div><div class="simp-info"><div class="simp-title">Title</div><div class="simp-artist">Artist</div></div></div></div>';
                simp_elem += '<div class="simp-controls flex-wrap flex-align">';
                simp_elem += '<div class="simp-plauseward flex flex-align"><button type="button" class="simp-prev fa fa-backward" disabled></button><button type="button" class="simp-plause fa fa-play" disabled></button><button type="button" class="simp-next fa fa-forward" disabled></button></div>';
                simp_elem += '<div class="simp-tracker simp-load"><input class="simp-progress" type="range" min="0" max="100" value="0" disabled/><div class="simp-buffer"></div></div>';
                simp_elem += '<div class="simp-time flex flex-align"><span class="start-time">00:00</span><span class="simp-slash"> / </span><span class="end-time">00:00</span></div>';
                simp_elem += '<div class="simp-volume flex flex-align"><button type="button" class="simp-mute fa fa-volume-up"></button><input class="simp-v-slider" type="range" min="0" max="100" value="100"/></div>';
                simp_elem += '<div class="simp-others flex flex-align"><button type="button" class="simp-plext fa fa-play-circle" title="Auto Play"></button><button type="button" class="simp-random fa fa-random" title="Random"></button><div class="simp-shide"><button type="button" class="simp-shide-top fa fa-caret-up" title="Show/Hide Album"></button><button type="button" class="simp-shide-bottom fa fa-caret-down" title="Show/Hide Playlist"></button></div></div>';
                simp_elem += '</div>' //simp-controls
                
                let simp_player = document.createElement('div')
                simp_player.classList.add('simp-player')
                simp_player.innerHTML = simp_elem
                ap_simp.insertBefore(simp_player, simp_playlist)
                simp_startScript()
            }
        },  
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

#simp button,#simp input,#simp img{border:0;}
#simp{max-width:600px;font-size:14px;font-family:"Segoe UI", Tahoma, sans-serif;text-align:initial;line-height:initial;background:#17212b;color:#ddd;margin:0 auto;border-radius:6px;overflow:hidden;}
#simp .simp-album{padding:20px 25px 5px;}
#simp .simp-album .simp-cover{margin-right:20px;}
#simp .simp-album .simp-cover img{max-width:80px;width:100%;margin:0;padding:0;display:block;}
#simp .simp-album .simp-title{font-size:120%;font-weight:bold;}
#simp .simp-album .simp-artist{font-size:90%;color:#6c7883;}
#simp .simp-controls{padding:15px;}
#simp .simp-controls button{font-size:130%;width:32px;height:32px;background:none;color:#ddd;padding:7px;cursor:pointer;border:0;border-radius:3px;}
#simp .simp-controls button[disabled]{color:#636469;cursor:initial;}
#simp .simp-controls button:not([disabled]):hover{background:#4082bc;color:#fff;}
#simp .simp-controls .simp-prev,#simp .simp-controls .simp-next{font-size:100%;}
#simp .simp-controls .simp-tracker,#simp .simp-controls .simp-volume{flex:1;margin-left:10px;position:relative;}
#simp .simp-controls .simp-buffer {position:absolute;top:50%;right:0;left:0;height:5px;margin-top:-2.5px;border-radius:100px;}
#simp .simp-controls .simp-loading .simp-buffer {-webkit-animation:audio-progress 1s linear infinite;animation:audio-progress 1s linear infinite;background-image: linear-gradient(-45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent);background-repeat:repeat-x;background-size:25px 25px;color:transparent;}
#simp .simp-controls .simp-time,#simp .simp-controls .simp-others{margin-left:10px;}
#simp .simp-controls .simp-volume{max-width:110px;}
#simp .simp-controls .simp-volume .simp-mute{margin-right:5px;}
#simp .simp-controls .simp-others .simp-active{background:#242f3d;}
#simp .simp-controls .simp-others .simp-shide button{font-size:100%;padding:0;width:24px;height:14px;display:block;}
#simp .simp-controls input[type=range]{-webkit-appearance:none;background:transparent;height:19px;margin:0;width:100%;display:block;position:relative;z-index:2;}
#simp .simp-controls input[type=range]::-webkit-slider-runnable-track{background:rgba(183,197,205,.66);height:5px;border-radius:2.5px;transition:box-shadow .3s ease;position:relative;}
#simp .simp-controls input[type=range]::-moz-range-track{background:rgba(183,197,205,.66);height:5px;border-radius:2.5px;transition:box-shadow .3s ease;position:relative;}
#simp .simp-controls .simp-load .simp-progress::-webkit-slider-runnable-track{background:#2f3841;}
#simp .simp-controls .simp-load .simp-progress::-moz-range-track{background:#2f3841;}
#simp .simp-controls .simp-loading .simp-progress::-webkit-slider-runnable-track{background:rgba(255,255,255,.25);}
#simp .simp-controls .simp-loading .simp-progress::-moz-range-track{background:rgba(255,255,255,.25);}
#simp .simp-controls input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;background:#fff;height:13px;width:13px;margin-top:-4px;cursor:pointer;border-radius:50%;box-shadow:0 1px 1px rgba(0,0,0,.15), 0 0 0 1px rgba(47,52,61,.2);}
#simp .simp-controls input[type=range]::-moz-range-thumb{-webkit-appearance:none;background:#fff;height:13px;width:13px;cursor:pointer;border-radius:50%;box-shadow:0 1px 1px rgba(0,0,0,.15), 0 0 0 1px rgba(47,52,61,.2);}
#simp .simp-footer{padding:10px 10px 12px;font-size:90%;text-align:center;opacity:.7;}
#simp .simp-display{overflow:hidden;max-height:650px;transition:max-height .5s ease-in-out;}
#simp .simp-hide{max-height:0;}
/* playlist */
#simp ul{margin:5px 0 0;padding:0;list-style:none;max-height:245px;}
#simp ul li{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;margin:0;padding:8px 20px;cursor:pointer;}
#simp ul li:last-child{padding-bottom:13px;}
#simp ul li:nth-child(odd){background:#0e1621;}
#simp ul li:hover{background:#242f3d;}
#simp ul li.simp-active{background:#4082bc;color:#fff;}
#simp ul li .simp-desc{font-size:90%;opacity:.5;margin-left:5px;}
/* playlist scrollbar */
#simp ul{overflow-y:auto;overflow-x:hidden;scrollbar-color:#73797f #2f3841;}
#simp ul::-webkit-scrollbar-track{background-color:#2f3841;}
#simp ul::-webkit-scrollbar{width:6px;background-color:#2f3841;}
#simp ul::-webkit-scrollbar-thumb{background-color:#73797f;}
/* progress animation */
@-webkit-keyframes audio-progress{to{background-position:25px 0;}}
@keyframes audio-progress{to{background-position:25px 0;}}
/* mobile */
@media screen and (max-width:480px) {
    #simp .simp-controls .simp-volume,#simp .simp-controls .simp-others{display:none;}
    #simp .simp-controls .simp-time{margin-right:10px;}
}
@media screen and (max-width:370px) {
    #simp .simp-time .simp-slash,#simp .simp-time .end-time{display:none;}
}
</style>