<template>
    <div class="row align-items-md-stretch">
        <!-- <div class="col-md-12 mb-4">
            <div class="h-100 p-5 text-white background-purple rounded-3">
                <h2>{{ msg }}</h2>
                <OpenLoans />
            </div>
        </div> -->
        
    </div>
</template>

<script>
    import { reactive } from "vue"
    import { Toast } from "bootstrap"

    export default {
        name: "Home",
        props: { msg: String },
        components: {
        },
        data() {
            return {
                state: reactive({ count: 0 }),
                modal: null,
                toast: null,
            };
        },
        mounted() {
            // this.modal = new Modal(this.$refs.infoModal);
            this.toast = new Toast(this.$refs.bsToast);
        },
    };
</script>

<style lang="scss" scoped>
    $bl: rgb(39, 41, 43);
    $blc: rgba($bl, 0.03);
    $lblc: rgba($bl, 0.1);
    $dive: 0.75rem;

    .emerge-11 {
        z-index: 11;
    }

    .bd-example-row {
        .row {
            & > [class^="col-"] {
                padding-top: $dive;
                padding-bottom: $dive;
                background-color: $blc;
                border: 1px solid $lblc;
            }
        }
    }

    .background-purple {
        background-color: #753ee2;
    }
</style>
