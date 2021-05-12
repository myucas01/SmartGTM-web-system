<template>
    <div class="storeEntryBox">
        <business-opport ref="businessOpport"></business-opport>    
    </div>
</template>
<script>
import businessOpport from '../../components/business_expansion_comp/BusinessOpportunityStore'
export default {
    name: 'storeEntry',
    data() {
        return {

        }
    },
    components: {
        businessOpport,
    },
    // beforeRouteEnter(to,from,next) {
    //     next(vm => {
    //         vm.$store.commit('addTabs', {
    //             title: '商机门店',
    //             link: '/business-expansion/business-opportunity-store',
    //             on: true,
    //             needCatch: true
    //         })
    //     })
    // },   
}
</script>
<style scoped lang="scss">
.storeEntryBox {
    width: 100%;
    height: 100%;
}
</style>