<template>
    <div class="player">
        <div class="player__top">
            <div class="player-cover">
                <transition-group :name="transitionName">
                    <div class="player-cover__item" v-if="$index === currentTrackIndex"
                        :style="{ backgroundImage: `url(${track.cover})` }" v-for="(track, $index) in tracks"
                        :key="$index"></div>
                </transition-group>
            </div>
            <div class="player-controls">
                <div class="player-controls__item -favorite" :class="{ active: currentTrack.favorited }"
                    @click="favorite">
                    <svg class="icon">
                        <use xlink:href="#icon-heart-o"></use>
                    </svg>
                </div>
                <a :href="currentTrack.url" target="_blank" class="player-controls__item">
                    <svg class="icon">
                        <use xlink:href="#icon-link"></use>
                    </svg>
                </a>
                <div class="player-controls__item" @click="prevTrack">
                    <svg class="icon">
                        <use xlink:href="#icon-prev"></use>
                    </svg>
                </div>
                <div class="player-controls__item" @click="nextTrack">
                    <svg class="icon">
                        <use xlink:href="#icon-next"></use>
                    </svg>
                </div>
                <div class="player-controls__item -xl js-play" @click="play">
                    <svg class="icon">
                        <use xlink:href="#icon-pause" v-if="isTimerPlaying"></use>
                        <use xlink:href="#icon-play" v-else></use>
                    </svg>
                </div>
            </div>
        </div>
        <div class="progress" ref="progress">
            <div class="progress__top">
                <div class="album-info" v-if="currentTrack">
                    <div class="album-info__name">{{ currentTrack.artist }}</div>
                    <div class="album-info__track">{{ currentTrack.name }}</div>
                </div>
                <div class="progress__duration">{{ duration }}</div>
            </div>
            <div class="progress__bar" @click="clickProgress">
                <div class="progress__current" :style="{ width: barWidth }"></div>
            </div>
            <div class="progress__time">{{ currentTime }}</div>
        </div>
        <div v-cloak></div>
    </div>
</template>

<script>
const xapp = window.xAppSdk
import { Buffer } from 'buffer's

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



            audio: null,
            circleLeft: null,
            barWidth: null,
            duration: null,
            currentTime: null,
            isTimerPlaying: false,
            tracks: [
                {
                    name: "Mekanın Sahibi",
                    artist: "Norm Ender",
                    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/1.jpg",
                    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/1.mp3",
                    url: "https://www.youtube.com/watch?v=z3wAjJXbYzA",
                    favorited: false
                },
                {
                    name: "Everybody Knows",
                    artist: "Leonard Cohen",
                    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/2.jpg",
                    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/2.mp3",
                    url: "https://www.youtube.com/watch?v=Lin-a2lTelg",
                    favorited: true
                },
                {
                    name: "Extreme Ways",
                    artist: "Moby",
                    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/3.jpg",
                    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/3.mp3",
                    url: "https://www.youtube.com/watch?v=ICjyAe9S54c",
                    favorited: false
                },
                {
                    name: "Butterflies",
                    artist: "Sia",
                    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/4.jpg",
                    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/4.mp3",
                    url: "https://www.youtube.com/watch?v=kYgGwWYOd9Y",
                    favorited: false
                },
                {
                    name: "The Final Victory",
                    artist: "Haggard",
                    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/5.jpg",
                    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/5.mp3",
                    url: "https://www.youtube.com/watch?v=0WlpALnQdN8",
                    favorited: true
                },
                {
                    name: "Genius ft. Sia, Diplo, Labrinth",
                    artist: "LSD",
                    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/6.jpg",
                    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/6.mp3",
                    url: "https://www.youtube.com/watch?v=HhoATZ1Imtw",
                    favorited: false
                },
                {
                    name: "The Comeback Kid",
                    artist: "Lindi Ortega",
                    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/7.jpg",
                    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/7.mp3",
                    url: "https://www.youtube.com/watch?v=me6aoX0wCV8",
                    favorited: true
                },
                {
                    name: "Overdose",
                    artist: "Grandson",
                    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/8.jpg",
                    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/8.mp3",
                    url: "https://www.youtube.com/watch?v=00-Rl3Jlx-o",
                    favorited: false
                },
                {
                    name: "Rag'n'Bone Man",
                    artist: "Human",
                    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/9.jpg",
                    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/9.mp3",
                    url: "https://www.youtube.com/watch?v=L3wKzyIN1yk",
                    favorited: false
                }
            ],
            currentTrack: null,
            currentTrackIndex: 0,
            transitionName: null
        }
    },
    created() {
        let vm = this;
        this.currentTrack = this.tracks[0];
        this.audio = new Audio();
        this.audio.src = this.currentTrack.source;
        this.audio.ontimeupdate = function () {
            vm.generateTime();
        };
        this.audio.onloadedmetadata = function () {
            vm.generateTime();
        };
        this.audio.onended = function () {
            vm.nextTrack();
            this.isTimerPlaying = true;
        };

        // this is optional (for preload covers)
        for (let index = 0; index < this.tracks.length; index++) {
            const element = this.tracks[index];
            let link = document.createElement('link');
            link.rel = "prefetch";
            link.href = element.cover;
            link.as = "image"
            document.head.appendChild(link)
        }
    },

    async mounted() {
        console.log('viewer mounted...')
        await this.fetchNFTs()
    },
    methods: {
        play() {
            if (this.audio.paused) {
                this.audio.play();
                this.isTimerPlaying = true;
            } else {
                this.audio.pause();
                this.isTimerPlaying = false;
            }
        },
        generateTime() {
            let width = (100 / this.audio.duration) * this.audio.currentTime;
            this.barWidth = width + "%";
            this.circleLeft = width + "%";
            let durmin = Math.floor(this.audio.duration / 60);
            let dursec = Math.floor(this.audio.duration - durmin * 60);
            let curmin = Math.floor(this.audio.currentTime / 60);
            let cursec = Math.floor(this.audio.currentTime - curmin * 60);
            if (durmin < 10) {
                durmin = "0" + durmin;
            }
            if (dursec < 10) {
                dursec = "0" + dursec;
            }
            if (curmin < 10) {
                curmin = "0" + curmin;
            }
            if (cursec < 10) {
                cursec = "0" + cursec;
            }
            this.duration = durmin + ":" + dursec;
            this.currentTime = curmin + ":" + cursec;
        },
        updateBar(x) {
            let progress = this.$refs.progress;
            let maxduration = this.audio.duration;
            let position = x - progress.offsetLeft;
            let percentage = (100 * position) / progress.offsetWidth;
            if (percentage > 100) {
                percentage = 100;
            }
            if (percentage < 0) {
                percentage = 0;
            }
            this.barWidth = percentage + "%";
            this.circleLeft = percentage + "%";
            this.audio.currentTime = (maxduration * percentage) / 100;
            this.audio.play();
        },
        clickProgress(e) {
            this.isTimerPlaying = true;
            this.audio.pause();
            this.updateBar(e.pageX);
        },
        prevTrack() {
            this.transitionName = "scale-in";
            this.isShowCover = false;
            if (this.currentTrackIndex > 0) {
                this.currentTrackIndex--;
            } else {
                this.currentTrackIndex = this.tracks.length - 1;
            }
            this.currentTrack = this.tracks[this.currentTrackIndex];
            this.resetPlayer();
        },
        nextTrack() {
            this.transitionName = "scale-out";
            this.isShowCover = false;
            if (this.currentTrackIndex < this.tracks.length - 1) {
                this.currentTrackIndex++;
            } else {
                this.currentTrackIndex = 0;
            }
            this.currentTrack = this.tracks[this.currentTrackIndex];
            this.resetPlayer();
        },
        resetPlayer() {
            this.barWidth = 0;
            this.circleLeft = 0;
            this.audio.currentTime = 0;
            this.audio.src = this.currentTrack.source;
            setTimeout(() => {
                if (this.isTimerPlaying) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            }, 300);
        },
        favorite() {
            this.tracks[this.currentTrackIndex].favorited = !this.tracks[
                this.currentTrackIndex
            ].favorited;
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

</style>