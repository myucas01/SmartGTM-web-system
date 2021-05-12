<template>
    <div class="build-wrap">
        <div class="step-box">
            <step/>
        </div>
        <div class="build-wrap-content">
            <!--创建计划-->
            <createPlan/>
            <div class="footer-btn">
                <button class="previous" @click="nowBack">返回</button>
            </div>
        </div>
    </div>
</template>

<script>
    import step from './components/Step'
    import createPlan from './components/CreatePlan'
    export default {
        name: "PlanList",
        title() {
            return '划区建线 - 计划列表'
        },
        components: {
            step,
            createPlan
        },
        data() {
            return {
                requestBoolean: false
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                const {month, year,organizeName} = vm.$route.query

                vm.$store.commit('addTabs', {
                    title: `${year}-${month}-${organizeName}-计划列表`,
                    link: decodeURIComponent(to.fullPath),
                    on: true,
                    needCatch: true
                });
            });
        },
        mounted() {
          const windHeigth = document.documentElement.clientHeight || document.body.clientHeight
          if(windHeigth < 800) {
            document.querySelector('.home main').setAttribute('style', 'overflow: hidden !important;;')
            document.querySelector('#routePlan').setAttribute('style', `height: ${windHeigth}px`)
          }
            this.$store.commit('routerPlanning/SET_STEP', 'PlanRoute')
        },
        methods: {
            // 上一步
            nowBack() {
                const {month, year,organizeName,organizeId,planStatus } = this.$route.query
                let urlSuffix = `month=${month}&year=${year}&organizeName=${organizeName}&organizeId=${organizeId}&planStatus=${planStatus}`
                this.$router.push(`/route-planning/global-config?${urlSuffix}`)
            }
        }
    }
</script>

<style scoped lang="scss">
    .build-wrap {
        width: 100%;
        background-color: #F8F8F9;
        overflow: hidden;
        .step-box {
            display: flex;
            height: 60px;
            align-items: center;
            background-color: #F8F8F9;
            box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.5);
        }

        &-content {
            width: 1194px;
            margin: 0 auto;
        }
        .footer-btn{
            display: flex;
            width: 100%;
            height: 40px;
            position: fixed;
            bottom: 42px;
            left: 0;
            justify-content: center;
            button{
                height: 32px;
                background: #FFFFFF;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                border: 1px solid #DDDEE1;
                padding: 0 33px;
                margin-right: 10px;
                &:focus{
                    border:none;
                }
                &:last-child{
                    margin-right: 0;
                    background-color: #930CEA;
                    color: #fff;
                }
            }
        }
    }
</style>
