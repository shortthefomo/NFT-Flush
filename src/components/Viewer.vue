<template>
    <div class="simple-audio-player" id="simp" data-config='{"shide_top":false,"shide_btm":false,"auto_load":false}'>
        <div class="simp-playlist">
            <ul>
                <li><span class="simp-source" data-src="http://www.archive.org/download/CanonInD_261/CanoninD.mp3">Canon
                        in D</span><span class="simp-desc">Johann Pachelbel</span></li>
                <li><span class="simp-source" data-src="https://www.script-tutorials.com/demos/363/data/05.mp3">Artist
                        5</span></li>
                <li><span class="simp-source" data-src="https://www.dropbox.com/s/6pays95q2a9jrsf/2020.01.02.mp3?dl=1"
                        data-cover="https://i.postimg.cc/sDBycWS8/NMS-2019.jpg">Nightmare Side</span><span
                        class="simp-desc">Set Stori</span></li>
                <li class="simp-active"><span class="simp-source"
                        data-src="https://www.dropbox.com/s/k011ag91uktonbv/Angklung%20Preman%20Pensiun.mp3?dl=1">Angklung
                        Preman Pensiun</span></li>
                <li><span class="simp-source"
                        data-src="https://www.dropbox.com/s/prgte33m86n9ce7/Canon%20Rock%20%28JerryC%29%20-%20funtwo.mp3?dl=1">Canon
                        Rock (JerryC)</span><span class="simp-desc">by Funtwo</span></li>
                <li><span class="simp-source" data-src="http://listento.ardanradio.com:1059/;">105.9 FM Ardan
                        Radio</span><span class="simp-desc">Streaming Radio</span></li>
                <li><span class="simp-source"
                        data-src="https://archive.org/download/78_jailhouse-rock_elvis-presley-jerry-leiber-mike-stoller_gbia0080595b/Jailhouse%20Rock%20-%20Elvis%20Presley%20-%20Jerry%20Leiber-restored.mp3">Jailhouse
                        Rock</span><span class="simp-desc">Elvis Presley</span></li>
                <li><span class="simp-source"
                        data-src="https://archive.org/download/J._Period_and_Michael_Jackson_-_Man_Or_The_Music-2010/17%20Smooth%20Criminal.mp3">Smooth
                        Criminal</span><span class="simp-desc">Michael Jackson</span></li>
                <li><span class="simp-source"
                        data-src="https://archive.org/download/OldPop_256/VillagePeople-Y.m.c.a.mp3">Y.M.C.A</span><span
                        class="simp-desc">Village People</span></li>
                <li><span class="simp-source"
                        data-src="https://archive.org/download/chuckberryjohnnyb.goode/Chuck%20Berry%20-%20Johnny%20B.%20Goode.mp3">Johnny
                        B. Goode</span><span class="simp-desc">Chuck Berry</span></li>
                <li><span class="simp-source"
                        data-src="https://archive.org/download/AnimalsTheHouseOfTheRisingSun_201811/Animals%20-%20The%20House%20Of%20The%20Rising%20Sun.mp3">House
                        of the Rising Sun</span><span class="simp-desc">The Animals</span></li>
                <li><span class="simp-source"
                        data-src="https://archive.org/download/DontStopMeNow_255/Queen-DontStopMeNow.mp3">Don't Stop Me
                        Now</span><span class="simp-desc">Queen</span></li>
                <li><span class="simp-source"
                        data-src="https://archive.org/download/NeverGonnaGiveYouUpOriginal/Never%20Gonna%20Give%20You%20Up%20Original.mp3">Never
                        Gonna Give You Up</span><span class="simp-desc">Rick Astley</span></li>
                <li><span class="simp-source"
                        data-src="https://archive.org/download/gunsnrosessweetchildomine_202003/Guns%20N%27%20Roses%20-%20Sweet%20Child%20%27O%20Mine.mp3">Sweet
                        Child O' Mine</span><span class="simp-desc">Guns N' Roses</span></li>
                <li><span class="simp-source"
                        data-src="https://archive.org/download/01.TheFinalCountdown/01.%20The%20Final%20Countdown.mp3">The
                        Final Countdown</span><span class="simp-desc">Europe</span></li>
                <li><span class="simp-source"
                        data-src="https://archive.org/download/1MyHeartWillGoOnLoveThemeFromTitanic/1%20-%20My%20Heart%20Will%20Go%20On%20%28Love%20Theme%20from%20_Titanic_%29.mp3">My
                        Heart Will Go On</span><span class="simp-desc">Céline Dion</span></li>
                <li><span class="simp-source"
                        data-src="https://archive.org/download/tntvillage_323140/John%20Lennon%20-%20Imagine/01%20Imagine.mp3">Imagine</span><span
                        class="simp-desc">John Lennon</span></li>
                <li><span class="simp-source"
                        data-src="https://archive.org/download/TheBeatles1970HeyJudeAppleRecords6e062.0434807HeyJude/The%20Beatles%20-%201970%20-%20Hey%20Jude%20%28Apple%20Records%3B%20%236e%20062.04348%29_07%20-%20Hey%20Jude.mp3">Hey
                        Jude</span><span class="simp-desc">The Beatles</span></li>
                <li><span class="simp-source"
                        data-src="https://archive.org/download/TakeMeHomeCountryRoad/JohnDenver-TakeMeHomeCountryRoad.mp3">Take
                        Me Home, Country Roads</span><span class="simp-desc">John Denver</span></li>
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
            },


            simp_auto_load: null,
            simp_audio: null, 
            simp_album: null, 
            simp_cover: null, 
            simp_title: null, 
            simp_artist: null, 
            simp_controls: null, 
            simp_progress: null, 
            simp_volume: null, 
            simp_v_slider: null, 
            simp_v_num: null, 
            simp_others: null, 
            ap_simp: null, 
            simp_playlist: null, 
            simp_source: null, 
            simp_a_url: null, 
            simp_a_index: 0, 
            simp_isPlaying: false, 
            simp_isNext: false,  //auto play
            simp_isRandom: false,  //play random
            simp_isRanext: false,  //check if before random starts, simp_isNext value is true
            simp_isStrea: false,  //radio streaming
            simp_isLoaded: false,  //audio file has loaded
            simp_config: null
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
                this.ap_simp = document.querySelector('#simp')
                this.simp_playlist = ap_simp.querySelector('.simp-playlist')
                this.simp_source = simp_playlist.querySelectorAll('li')
                this.simp_a_url = simp_playlist.querySelectorAll('[data-src]')
                this.simp_a_index = 0
                this.simp_isPlaying = false
                this.simp_isNext = false //auto play
                this.simp_isRandom = false //play random
                this.simp_isRanext = false //check if before random starts, simp_isNext value is true
                this.simp_isStream = false //radio streaming
                this.simp_isLoaded = false //audio file has loaded
                this.simp_config = this.ap_simp.dataset.config ? JSON.parse(this.ap_simp.dataset.config) : {
                    shide_top: false, //show/hide album
                    shide_btm: false, //show/hide playlist
                    auto_load: false //auto load audio file
                }

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
                this.simp_player.classList.add('simp-player')
                this.simp_player.innerHTML = simp_elem
                this.ap_simp.insertBefore(simp_player, this.simp_playlist)
                this.simp_startScript()
            }
        },


        addEventListener_multi(element, eventNames, handler) {
            let events = eventNames.split(' ')
            events.forEach(e => element.addEventListener(e, handler, false))
        },

        // Random numbers in a specific range
        getRandom(min, max) {
            min = Math.ceil(min)
            max = Math.floor(max)
            return Math.floor(Math.random() * (max - min + 1)) + min
        },

        // Position element inside element
        getRelativePos(elm) {
            let pPos = elm.parentNode.getBoundingClientRect() // parent pos
            let cPos = elm.getBoundingClientRect() // target pos
            let pos = {}

            pos.top = cPos.top - pPos.top + elm.parentNode.scrollTop,
                pos.right = cPos.right - pPos.right,
                pos.bottom = cPos.bottom - pPos.bottom,
                pos.left = cPos.left - pPos.left

            return pos
        },
        formatTime(val) {
            let h = 0, m = 0, s
            val = parseInt(val, 10)
            if (val > 60 * 60) {
                h = parseInt(val / (60 * 60), 10)
                val -= h * 60 * 60
            }
            if (val > 60) {
                m = parseInt(val / 60, 10)
                val -= m * 60
            }
            s = val
            val = (h > 0) ? h + ':' : ''
            val += (m > 0) ? ((m < 10 && h > 0) ? '0' : '') + m + ':' : '0:'
            val += ((s < 10) ? '0' : '') + s
            return val
        },

        simp_initTime() {
            this.simp_controls.querySelector('.start-time').innerHTML = this.formatTime(this.simp_audio.currentTime) //calculate current value time
            if (!simp_isStream) {
                this.simp_controls.querySelector('.end-time').innerHTML = this.formatTime(this.simp_audio.duration) //calculate total value time
                this.simp_progress.value = this.simp_audio.currentTime / this.simp_audio.duration * 100 //progress bar
            }

            // ended of the audio
            if (this.simp_audio.currentTime == this.simp_audio.duration) {
                this.simp_controls.querySelector('.simp-plause').classList.remove('fa-pause')
                this.simp_controls.querySelector('.simp-plause').classList.add('fa-play')
                this.simp_audio.removeEventListener('timeupdate', this.simp_initTime())

                if (simp_isNext) { //auto load next audio
                    let elem
                    this.simp_a_index++
                    if (this.simp_a_index == this.simp_a_url.length) { //repeat all audio
                        this.simp_a_index = 0
                        elem = this.simp_a_url[0]
                    } else {
                        elem = this.simp_a_url[simp_a_index]
                    }
                    this.simp_changeAudio(elem)
                    this.simp_setAlbum(this.simp_a_index)
                } else {
                    this.simp_isPlaying = false
                }
            }
        },

        simp_initAudio() {
            // if readyState more than 2, audio file has loaded
            this.simp_isLoaded = this.simp_audio.readyState == 4 ? true : false
            this.simp_isStream = this.simp_audio.duration == 'Infinity' ? true : false
            this.simp_controls.querySelector('.simp-plause').disabled = false
            this.simp_progress.disabled = this.simp_isStream ? true : false
            if (!this.simp_isStream) {
                this.simp_progress.parentNode.classList.remove('simp-load', 'simp-loading')
                this.simp_controls.querySelector('.end-time').innerHTML = this.formatTime(this.simp_audio.duration)
            }
            this.simp_audio.addEventListener('timeupdate', this.simp_initTime()) //tracking load progress
            if (this.simp_isLoaded && this.simp_isPlaying) this.simp_audio.play()

            // progress bar click event
            this.addEventListener_multi(simp_progress, 'touchstart mousedown', function (e) {
                if (simp_isStream) {
                    e.stopPropagation()
                    return false
                }
                if (simp_audio.readyState == 4) {
                    simp_audio.removeEventListener('timeupdate', this.simp_initTime())
                    simp_audio.pause()
                }
            })

            this.addEventListener_multi(simp_progress, 'touchend mouseup', function (e) {
                if (this.simp_isStream) {
                    e.stopPropagation();
                    return false;
                }
                if (this.simp_audio.readyState == 4) {
                    this.simp_audio.currentTime = simp_progress.value * this.simp_audio.duration / 100
                    this.simp_audio.addEventListener('timeupdate', this.simp_initTime())
                    if (this.simp_isPlaying) this.simp_audio.play()
                }
            })
        },

        simp_loadAudio(elem) {
            this.simp_progress.parentNode.classList.add('simp-loading')
            this.simp_controls.querySelector('.simp-plause').disabled = true
            this.simp_audio.querySelector('source').src = elem.dataset.src
            this.simp_audio.load()

            this.simp_audio.volume = parseFloat(this.simp_v_num / 100) //based on valume input value
            this.simp_audio.addEventListener('canplaythrough', this.simp_initAudio()) //play audio without stop for buffering

            // if audio fails to load, only IE/Edge 9.0 or above
            this.simp_audio.addEventListener('error', function () {
                alert('Please reload the page.')
            })
        },

        simp_setAlbum(index) {
            this.simp_cover.innerHTML = simp_a_url[index].dataset.cover ? '<div style="background:url(' + this.simp_a_url[index].dataset.cover + ') no-repeat;background-size:cover;width:80px;height:80px;"></div>' : '<i class="fa fa-music fa-5x"></i>'
            this.simp_title.innerHTML = simp_source[index].querySelector('.simp-source').innerHTML
            this.simp_artist.innerHTML = simp_source[index].querySelector('.simp-desc') ? this.simp_source[index].querySelector('.simp-desc').innerHTML : ''
        },

        simp_changeAudio(elem) {
            this.simp_isLoaded = false
            this.simp_controls.querySelector('.simp-prev').disabled = simp_a_index == 0 ? true : false
            this.simp_controls.querySelector('.simp-plause').disabled = simp_auto_load ? true : false
            this.simp_controls.querySelector('.simp-next').disabled = simp_a_index == simp_a_url.length - 1 ? true : false
            this.simp_progress.parentNode.classList.add('simp-load')
            this.simp_progress.disabled = true
            this.simp_progress.value = 0
            this.simp_controls.querySelector('.start-time').innerHTML = '00:00'
            this.simp_controls.querySelector('.end-time').innerHTML = '00:00'
            elem = this.simp_isRandom && this.simp_isNext ? this.simp_a_url[this.getRandom(0, this.simp_a_url.length - 1)] : elem

            // playlist, audio is running
            for (var i = 0; i < this.simp_a_url.length; i++) {
                this.simp_a_url[i].parentNode.classList.remove('simp-active')
                if (this.simp_a_url[i] == elem) {
                    this.simp_a_index = i
                    this.simp_a_url[i].parentNode.classList.add('simp-active')
                }
            }

            // scrolling to element inside element
            var simp_active = this.getRelativePos(this.simp_source[this.simp_a_index])
            this.simp_source[this.simp_a_index].parentNode.scrollTop = this.simp_active.top

            if (this.simp_auto_load || this.simp_isPlaying) this.simp_loadAudio(elem)

            if (this.simp_isPlaying) {
                this.simp_controls.querySelector('.simp-plause').classList.remove('fa-play')
                this.simp_controls.querySelector('.simp-plause').classList.add('fa-pause')
            }
        },

        simp_startScript() {
            this.ap_simp = document.querySelector('#simp')
            this.simp_audio = ap_simp.querySelector('#audio')
            this.simp_album = ap_simp.querySelector('.simp-album')
            this.simp_cover = simp_album.querySelector('.simp-cover')
            this.simp_title = simp_album.querySelector('.simp-title')
            this.simp_artist = simp_album.querySelector('.simp-artist')
            this.simp_controls = ap_simp.querySelector('.simp-controls')
            this.simp_progress = simp_controls.querySelector('.simp-progress')
            this.simp_volume = simp_controls.querySelector('.simp-volume')
            this.simp_v_slider = simp_volume.querySelector('.simp-v-slider')
            this.simp_v_num = simp_v_slider.value; //default volume
            this.simp_others = simp_controls.querySelector('.simp-others')
            this.simp_auto_load = simp_config.auto_load; //auto load audio file

            if (this.simp_config.shide_top) this.simp_album.parentNode.classList.toggle('simp-hide')
            if (this.simp_config.shide_btm) {
                this.simp_playlist.classList.add('simp-display')
                this.simp_playlist.classList.toggle('simp-hide')
            }

            if (this.simp_a_url.length <= 1) {
                this.simp_controls.querySelector('.simp-prev').style.display = 'none'
                this.simp_controls.querySelector('.simp-next').style.display = 'none'
                this.simp_others.querySelector('.simp-plext').style.display = 'none'
                this.simp_others.querySelector('.simp-random').style.display = 'none'
            }

            // Playlist listeners
            this.simp_source.forEach(function (item, index) {
                if (item.classList.contains('simp-active')) this.simp_a_index = index; //playlist contains '.simp-active'
                item.addEventListener('click', function () {
                    this.simp_audio.removeEventListener('timeupdate', this.simp_initTime())
                    this.simp_a_index = index
                    this.simp_changeAudio(this.querySelector('.simp-source'))
                    this.simp_setAlbum(this.simp_a_index)
                })
            })

            // FIRST AUDIO LOAD =======
            this.simp_changeAudio(this.simp_a_url[this.simp_a_index])
            this.simp_setAlbum(this.simp_a_index)
            // FIRST AUDIO LOAD =======

            // Controls listeners
            simp_controls.querySelector('.simp-plauseward').addEventListener('click', function (e) {
                var eles = e.target.classList
                if (eles.contains('simp-plause')) {
                    if (this.simp_audio.paused) {
                        if (!this.simp_isLoaded) this.simp_loadAudio(this.simp_a_url[this.simp_a_index])
                        this.simp_audio.play()
                        this.simp_isPlaying = true
                        eles.remove('fa-play')
                        eles.add('fa-pause')
                    } else {
                        this.simp_audio.pause()
                        this.simp_isPlaying = false
                        eles.remove('fa-pause')
                        eles.add('fa-play')
                    }
                } else {
                    if (eles.contains('simp-prev') && this.simp_a_index != 0) {
                        this.simp_a_index = this.simp_a_index - 1
                        e.target.disabled = this.simp_a_index == 0 ? true : false
                    } else if (eles.contains('simp-next') && this.simp_a_index != this.simp_a_url.length - 1) {
                        this.simp_a_index = this.simp_a_index + 1
                        e.target.disabled = this.simp_a_index == this.simp_a_url.length - 1 ? true : false
                    }
                    this.simp_audio.removeEventListener('timeupdate', this.simp_initTime())
                    this.simp_changeAudio(this.simp_a_url[this.simp_a_index])
                    this.simp_setAlbum(this.simp_a_index)
                }
            })

            // Audio volume
            this.simp_volume.addEventListener('click', function (e) {
                var eles = e.target.classList
                if (eles.contains('simp-mute')) {
                    if (eles.contains('fa-volume-up')) {
                        eles.remove('fa-volume-up')
                        eles.add('fa-volume-off')
                        this.simp_v_slider.value = 0
                    } else {
                        eles.remove('fa-volume-off')
                        eles.add('fa-volume-up')
                        this.simp_v_slider.value = this.simp_v_num
                    }
                } else {
                    this.simp_v_num = this.simp_v_slider.value
                    if (this.simp_v_num != 0) {
                        this.simp_controls.querySelector('.simp-mute').classList.remove('fa-volume-off')
                        this.simp_controls.querySelector('.simp-mute').classList.add('fa-volume-up')
                    }
                }
                this.simp_audio.volume = parseFloat(this.simp_v_slider.value / 100)
            })

            // Others
            simp_others.addEventListener('click', function (e) {
                var eles = e.target.classList

                if (eles.contains('simp-plext')) {
                    this.simp_isNext = this.simp_isNext && !this.simp_isRandom ? false : true
                    if (!this.simp_isRandom) this.simp_isRanext = this.simp_isRanext ? false : true
                    eles.contains('simp-active') && !simp_isRandom ? eles.remove('simp-active') : eles.add('simp-active')
                } else if (eles.contains('simp-random')) {
                    this.simp_isRandom = this.simp_isRandom ? false : true
                    if (this.simp_isNext && !this.simp_isRanext) {
                        this.simp_isNext = false;
                        this.simp_others.querySelector('.simp-plext').classList.remove('simp-active');
                    } else {
                        this.simp_isNext = true;
                        this.simp_others.querySelector('.simp-plext').classList.add('simp-active');
                    }
                    eles.contains('simp-active') ? eles.remove('simp-active') : eles.add('simp-active')
                } else if (eles.contains('simp-shide-top')) {
                    this.simp_album.parentNode.classList.toggle('simp-hide')
                } else if (eles.contains('simp-shide-bottom')) {
                    this.simp_playlist.classList.add('simp-display')
                    this.simp_playlist.classList.toggle('simp-hide')
                }
            })
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
#simp button,
#simp input,
#simp img {
    border: 0;
}

#simp {
    max-width: 600px;
    font-size: 14px;
    font-family: "Segoe UI", Tahoma, sans-serif;
    text-align: initial;
    line-height: initial;
    background: #17212b;
    color: #ddd;
    margin: 0 auto;
    border-radius: 6px;
    overflow: hidden;
}

#simp .simp-album {
    padding: 20px 25px 5px;
}

#simp .simp-album .simp-cover {
    margin-right: 20px;
}

#simp .simp-album .simp-cover img {
    max-width: 80px;
    width: 100%;
    margin: 0;
    padding: 0;
    display: block;
}

#simp .simp-album .simp-title {
    font-size: 120%;
    font-weight: bold;
}

#simp .simp-album .simp-artist {
    font-size: 90%;
    color: #6c7883;
}

#simp .simp-controls {
    padding: 15px;
}

#simp .simp-controls button {
    font-size: 130%;
    width: 32px;
    height: 32px;
    background: none;
    color: #ddd;
    padding: 7px;
    cursor: pointer;
    border: 0;
    border-radius: 3px;
}

#simp .simp-controls button[disabled] {
    color: #636469;
    cursor: initial;
}

#simp .simp-controls button:not([disabled]):hover {
    background: #4082bc;
    color: #fff;
}

#simp .simp-controls .simp-prev,
#simp .simp-controls .simp-next {
    font-size: 100%;
}

#simp .simp-controls .simp-tracker,
#simp .simp-controls .simp-volume {
    flex: 1;
    margin-left: 10px;
    position: relative;
}

#simp .simp-controls .simp-buffer {
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    height: 5px;
    margin-top: -2.5px;
    border-radius: 100px;
}

#simp .simp-controls .simp-loading .simp-buffer {
    -webkit-animation: audio-progress 1s linear infinite;
    animation: audio-progress 1s linear infinite;
    background-image: linear-gradient(-45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent);
    background-repeat: repeat-x;
    background-size: 25px 25px;
    color: transparent;
}

#simp .simp-controls .simp-time,
#simp .simp-controls .simp-others {
    margin-left: 10px;
}

#simp .simp-controls .simp-volume {
    max-width: 110px;
}

#simp .simp-controls .simp-volume .simp-mute {
    margin-right: 5px;
}

#simp .simp-controls .simp-others .simp-active {
    background: #242f3d;
}

#simp .simp-controls .simp-others .simp-shide button {
    font-size: 100%;
    padding: 0;
    width: 24px;
    height: 14px;
    display: block;
}

#simp .simp-controls input[type=range] {
    -webkit-appearance: none;
    background: transparent;
    height: 19px;
    margin: 0;
    width: 100%;
    display: block;
    position: relative;
    z-index: 2;
}

#simp .simp-controls input[type=range]::-webkit-slider-runnable-track {
    background: rgba(183, 197, 205, .66);
    height: 5px;
    border-radius: 2.5px;
    transition: box-shadow .3s ease;
    position: relative;
}

#simp .simp-controls input[type=range]::-moz-range-track {
    background: rgba(183, 197, 205, .66);
    height: 5px;
    border-radius: 2.5px;
    transition: box-shadow .3s ease;
    position: relative;
}

#simp .simp-controls .simp-load .simp-progress::-webkit-slider-runnable-track {
    background: #2f3841;
}

#simp .simp-controls .simp-load .simp-progress::-moz-range-track {
    background: #2f3841;
}

#simp .simp-controls .simp-loading .simp-progress::-webkit-slider-runnable-track {
    background: rgba(255, 255, 255, .25);
}

#simp .simp-controls .simp-loading .simp-progress::-moz-range-track {
    background: rgba(255, 255, 255, .25);
}

#simp .simp-controls input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: #fff;
    height: 13px;
    width: 13px;
    margin-top: -4px;
    cursor: pointer;
    border-radius: 50%;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .15), 0 0 0 1px rgba(47, 52, 61, .2);
}

#simp .simp-controls input[type=range]::-moz-range-thumb {
    -webkit-appearance: none;
    background: #fff;
    height: 13px;
    width: 13px;
    cursor: pointer;
    border-radius: 50%;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .15), 0 0 0 1px rgba(47, 52, 61, .2);
}

#simp .simp-footer {
    padding: 10px 10px 12px;
    font-size: 90%;
    text-align: center;
    opacity: .7;
}

#simp .simp-display {
    overflow: hidden;
    max-height: 650px;
    transition: max-height .5s ease-in-out;
}

#simp .simp-hide {
    max-height: 0;
}

/* playlist */
#simp ul {
    margin: 5px 0 0;
    padding: 0;
    list-style: none;
    max-height: 245px;
}

#simp ul li {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    margin: 0;
    padding: 8px 20px;
    cursor: pointer;
}

#simp ul li:last-child {
    padding-bottom: 13px;
}

#simp ul li:nth-child(odd) {
    background: #0e1621;
}

#simp ul li:hover {
    background: #242f3d;
}

#simp ul li.simp-active {
    background: #4082bc;
    color: #fff;
}

#simp ul li .simp-desc {
    font-size: 90%;
    opacity: .5;
    margin-left: 5px;
}

/* playlist scrollbar */
#simp ul {
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-color: #73797f #2f3841;
}

#simp ul::-webkit-scrollbar-track {
    background-color: #2f3841;
}

#simp ul::-webkit-scrollbar {
    width: 6px;
    background-color: #2f3841;
}

#simp ul::-webkit-scrollbar-thumb {
    background-color: #73797f;
}

/* progress animation */
@-webkit-keyframes audio-progress {
    to {
        background-position: 25px 0;
    }
}

@keyframes audio-progress {
    to {
        background-position: 25px 0;
    }
}

/* mobile */
@media screen and (max-width:480px) {

    #simp .simp-controls .simp-volume,
    #simp .simp-controls .simp-others {
        display: none;
    }

    #simp .simp-controls .simp-time {
        margin-right: 10px;
    }
}

@media screen and (max-width:370px) {

    #simp .simp-time .simp-slash,
    #simp .simp-time .end-time {
        display: none;
    }
}
</style>