<template>
    <div class="approve-wrap" >
        <div v-if="stepShow" class="step-box">
            <step/>
        </div>
        <management v-if="show" ref="manageMentChild" :mainPlanData="mainPlan"/>
        <div class="submit-box" v-else>
            <h1 v-if="planApproveStatus === '1'">拜访计划审批中，请等待…</h1>
            <h1 v-if="planApproveStatus === '2'"><svg t="1605579799781" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5079" width="200" height="200"><path d="M512 512m-455.111111 0a455.111111 455.111111 0 1 0 910.222222 0 455.111111 455.111111 0 1 0-910.222222 0Z" fill="#19BE6B" p-id="5080"></path><path d="M719.758222 335.36h-52.110222c-11.320889 0-22.072889 5.404444-28.785778 14.791111l-174.648889 242.176-79.075555-109.795555a35.555556 35.555556 0 0 0-28.785778-14.791112h-52.110222a8.931556 8.931556 0 0 0-7.224889 14.165334l138.410667 192a35.328 35.328 0 0 0 57.457777 0l233.984-324.437334a8.874667 8.874667 0 0 0-7.111111-14.108444z" fill="#FFFFFF" p-id="5081"></path><path d="M512 14.222222a497.777778 497.777778 0 1 0 0.056889 995.612445A497.777778 497.777778 0 0 0 512 14.222222z m0 911.132445A413.411556 413.411556 0 0 1 512 98.645333a413.411556 413.411556 0 0 1 0 826.709334z" fill="#FFFFFF" p-id="5082"></path></svg>拜访计划已审批通过</h1>
            <h1 v-if="planApproveStatus === '3'"><svg t="1605579785501" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4950" width="200" height="200"><path d="M511.996018 511.997156m-455.099986 0a455.099986 455.099986 0 1 0 910.199973 0 455.099986 455.099986 0 1 0-910.199973 0Z" fill="#FFFFFF" p-id="4951"></path><path d="M511.996018 1023.98464a501.747735 501.747735 0 0 1-199.390681-39.991911A513.807885 513.807885 0 0 1 149.622654 874.37052a513.807885 513.807885 0 0 1-109.565322-163.03957A501.747735 501.747735 0 0 1 0.008533 511.997156c0-70.540498 13.311675-137.041983 39.991912-199.390682A513.807885 513.807885 0 0 1 149.622654 149.623791 513.807885 513.807885 0 0 1 312.605337 40.001582 501.747735 501.747735 0 0 1 511.996018 0.009671a501.747735 501.747735 0 0 1 199.390682 39.991911A513.807885 513.807885 0 0 1 874.369382 149.623791a513.807885 513.807885 0 0 1 109.565322 163.039571A501.747735 501.747735 0 0 1 1023.983503 511.997156a501.747735 501.747735 0 0 1-39.991911 199.390681 513.807885 513.807885 0 0 1-109.565322 163.03957 513.807885 513.807885 0 0 1-163.03957 109.565322A501.747735 501.747735 0 0 1 511.996018 1023.98464z m235.059143-660.918955a24.290962 24.290962 0 0 0 7.395375-17.805787 24.290962 24.290962 0 0 0-7.395375-17.862674l-52.905373-51.710736a23.608312 23.608312 0 0 0-34.473824 0L511.996018 423.366433 363.064548 275.686488a23.608312 23.608312 0 0 0-34.473824 0l-52.905374 51.710736a26.964674 26.964674 0 0 0-6.14385 17.862674c0 6.940275 2.04795 12.913462 6.14385 17.805787l148.931471 147.679946-148.931471 147.736833a26.964674 26.964674 0 0 0-6.14385 17.805787c0 6.997162 2.04795 12.913462 6.14385 17.862674l52.905374 51.710736a23.608312 23.608312 0 0 0 34.473824 0L511.996018 598.124828l147.679946 147.736833a23.608312 23.608312 0 0 0 34.473824 0l52.905373-51.767623a24.290962 24.290962 0 0 0 7.395375-17.805787 24.290962 24.290962 0 0 0-7.395375-17.805787l-148.93147-147.736833 148.93147-147.679946z" fill="#ED3F14" p-id="4952"></path></svg>拜访计划已驳回</h1>
            <div class="approve-content">
              <p class="build-title">{{$route.query.year}}-{{$route.query.month}} {{$route.query.organizeName}}</p>
                <h5>审批流程</h5>
                <ul class="approve-uls">
                    <template v-for="item of tableData">
                        <li class="approve-lis" :key="item.approveTime + '_' + item.approveUserName">
                            <div class="approve-lis-icon">
                                <span class="approve-name">{{item.approveUserName ?item.approveUserName.substring(0,2) : ''}}</span>
                                <i class="approve-icon-status">
                                    <svg-icon v-if="item.approveStatus == '0'" icon-class="pending-icon" class-name="status-icons"/>
                                    <svg-icon v-if="item.approveStatus == '3'" icon-class="reject-icon" class-name="status-icons"/>
                                    <svg-icon v-if="item.approveStatus == '2'" icon-class="agree-icon" class-name="status-icons"/>
                                </i>
                            </div>
                            <div class="approve-lis-info">
                                <div class="approve-status">
                                    <p class="approve-status-title" v-if="item.approveType === '0'">发起申请</p>
                                    <p class="approve-status-title" v-if="item.approveType === '1' && item.approveStatus == '2'">同意</p>
                                    <p class="approve-status-title" v-if="item.approveType === '1' && item.approveStatus == '3'">驳回</p>
                                    <p class="approve-status-time">{{item.approveTime}}</p>
                                </div>
                                <p class="approve-user">{{item.approveUserName}}</p>
                                <div class="reject-reason" v-if="item.approveStatus =='3' && item.approveMsg">{{item.approveMsg}}</div>
                            </div>
                        </li>
                    </template>
                </ul>
                <div class="down-box">
                    <div @click="downPlan">下载拜访计划</div>
                </div>
            </div>
        </div>
        <button class="previous" @click="backStep">上一步</button>
    </div>
</template>

<script>
    import step from './components/Step'
    import management from "./components/management";
    import ROUTE_PLANNING_API from "@api/route/index";
    import { mapGetters } from 'vuex'
    import {Authorities} from '@/util/authority'
    export default {
        name: "Approve",
        components: {
            step,
            management
        },
        data() {
            return {
                tableData: [],
                show: false,
                downBoolean: false,
                planApproveStatus: '',
                planStatus: '',
                approvalStatus: false,
                mainPlan: '',
                queryData: '',
                stepShow: false
            }
        },
        computed: {
            ...mapGetters('routerPlanning', [
                'visitOrgId',
                'visitMonth',
                'visitYear'
            ]),
            ...mapGetters('common', ['currentMessage'])
        },
        watch: {
            // 消息 监听 刷新 数据状态
            currentMessage() {
                if (this.currentMessage) {
                    let currentMessage = JSON.parse(this.currentMessage)
                    if (currentMessage.bussinessCode === '101') {
                        if (!this.show) {
                            this.getApprovalList()
                        }
                        this.getMainInfo()
                    }
                }
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                const {month, year, organizeName} = vm.$route.query
                vm.$store.commit('addTabs', {
                    title: `${year}-${month}-${organizeName}-审批流程`,
                    link: decodeURIComponent(to.fullPath),
                    on: false,
                    needCatch: true
                });
            });
        },
        mounted() {
            let _this = this
            _this.queryData = _this.$route.query
            _this.show = Authorities('lineplan:build:check:approve')
            _this.stepShow = !Authorities('lineplan:build:check:approve')
            _this.$store.commit('routerPlanning/SET_STEP', 'Approve')
            // 更新 当前table 地址

            if (!_this.show) {
                _this.getApprovalList()
            }
            _this.getMainInfo()
        },
        methods: {
            // 获取审批流程
            getApprovalList() {
                ROUTE_PLANNING_API.approvalList({
                    orgId: this.$route.query.organizeId,
                    yearMonth: this.queryData ? `${this.queryData.year}-${this.queryData.month}` : '',
                })
                    .then(res => {
                        if (res.code == '200') {
                            this.tableData = res.data.splice(0, 2)
                            if(this.tableData && this.tableData.length === 2) {
                                this.tableData[1]['approveUserName'] = '所长'
                            }
                        }
                    })
                    .catch(err => console.log(err))
            },
            // 下载拜访计划
            downPlan() {
                let _this = this
                _this.$message({
                    showClose: true,
                    message: '计划下载中,请稍等...'
                })
                if (_this.downBoolean) {
                    return
                }
                _this.downBoolean = true
                _this.downVisitData()
                _this.downData()
            },
            downVisitData() {
                console.log(`%cdownVisitData`, 'background:orange;font-size:18px;color: blue')
                let _this = this
                const iframeVisit = document.createElement("iframe")
                iframeVisit.style.display = "none"
                iframeVisit.style.height = 0
                iframeVisit.src = ROUTE_PLANNING_API.downMainVisitPlan({
                    orgId: this.queryData ? this.queryData.organizeId : '',
                    endTime: this.queryData ? `${this.queryData.year}-${this.queryData.month}-31` : '',
                    startTime: this.queryData ? `${this.queryData.year}-${this.queryData.month}-01` : '',
                })
                document.body.appendChild(iframeVisit)
                setTimeout(() => {
                    iframeVisit.remove()
                    _this.downBoolean = false
                }, 5 * 60 * 1000)
            },
            downData() {
                console.log(`%cdownData`, 'background:orange;font-size:18px;color: blue')

                let _this = this
                const iframe = document.createElement("iframe")
                iframe.style.display = "none"
                iframe.style.height = 0
                iframe.src = ROUTE_PLANNING_API.downPlanData({
                    orgId: this.queryData ? this.queryData.organizeId : '',
                    endTime: this.queryData ? `${this.queryData.year}-${this.queryData.month}-31` : '',
                    startTime: this.queryData ? `${this.queryData.year}-${this.queryData.month}-01` : '',
                })
                document.body.appendChild(iframe)
                setTimeout(() => {
                    iframe.remove()
                    _this.downBoolean = false
                }, 5 * 60 * 1000)
            },
            // 返回上一步
            backStep() {
                const {month, year, organizeName, organizeId, planStatus} = this.$route.query
                let urlSuffix = `month=${month}&year=${year}&organizeName=${organizeName}&organizeId=${organizeId}&planStatus=${planStatus}`
                console.info(Authorities('lineplan:build:check:approve'))
                // 审批者 直接返回至 营业所选择界面
                if(Authorities('lineplan:build:check:approve')) {
                    this.$router.push(`/route-planning/organize-list?year=${year}&month=${month}`)
                } else {
                    this.$router.push(`/route-planning/plan-list?${urlSuffix}`)
                }
            },
            // 获取主计划相关
            async getMainInfo() {
                let result = await ROUTE_PLANNING_API.getMainPlan({
                    orgId: this.queryData ? this.queryData.organizeId : '',
                    yearMonth: this.queryData ? `${this.queryData.year}-${this.queryData.month}` : '',
                })
                if (result.code === '200') {
                    this.planApproveStatus = result.data.planApproveStatus
                    this.planStatus = result.data.planStatus
                    this.approvalStatus = false
                    if (this.planStatus === '2') {
                        if (this.planApproveStatus === '1') {
                            this.approvalStatus = true
                        }
                    }
                    this.mainPlan = {
                        id: result.data.planNo,
                        name: result.data.planName,
                        approvalStatus: this.approvalStatus,
                        planApproveStatus: result.data.planApproveStatus,
                        planStatus: result.data.planStatus
                    }
                    this.$store.commit('routerPlanning/SET_ORGANIZE_PLAN_STATUS', result.data.planStatus)
                    this.$store.commit('routerPlanning/SET_PLAN_APPROVE_STATUS', result.data.planApproveStatus)
                    this.$nextTick(function () {
                        if (this.show) {
                            this.$refs.manageMentChild.getApprovalPlan()
                        }
                    })
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .approve-wrap {
        width: 100%;
        background-color: #F8F8F9;

        .step-box {
            display: flex;
            height: 60px;
            align-items: center;
            background-color: #F8F8F9;
        }

        h1 {
            font-size: 24px;
            font-weight: 400;
            color: #000000;
            text-align: center;
            margin-top: 30px;
        }

        .approve-content {
            width: 1194px;
            height: 466px;
            background: #FFFFFF;
            margin: 30px auto;
            padding-top: 80px;
            position: relative;
          .build-title{
            font-size: 16px;
            font-weight: 600;
            position: absolute;
            top: -35px;
            left: 0;
          }
            h5 {
                font-size: 14px;
                font-weight: 600;
                color: #495060;
                text-align: center;
            }

            .approve-uls {
                width: 380px;
                margin: 20px auto 0;

                .approve-lis {
                    display: flex;
                    min-height: 80px;
                    overflow: hidden;

                    &:last-child {
                        .approve-name {
                            &:after {
                                display: none;
                            }
                        }
                    }
                }

                .approve-lis-icon {
                    width: 44px;
                    height: 44px;
                    background: #C7DBFF;
                    border: 1px solid #FFFFFF;
                    border-radius: 50%;
                    text-align: center;
                    position: relative;

                    .approve-name {
                        font-size: 12px;
                        font-weight: 400;
                        color: #495060;
                        line-height: 44px;
                        position: relative;

                        &:after {
                            position: absolute;
                            top: 32px;
                            left: 50%;
                            display: block;
                            width: 1px;
                            height: 3000px;
                            background: rgba(0, 0, 0, 0.15);
                            content: "";
                        }
                    }
                    .approve-icon-status{
                        display: inline-block;
                        width: 18px;
                        height: 18px;
                        position: absolute;
                        right: 0;
                        bottom: -3px;
                        z-index: 10;
                        .status-icons{
                            width: 18px;
                            height: 18px;
                        }
                    }
                }

                .approve-lis-info {
                    flex: 1;
                    align-items: flex-start;
                    margin-left: 10px;

                    .approve-status {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                        line-height: 23px;
                    }

                    .approve-user {
                        text-align: left;
                    }
                }
            }
            .down-box{
                display: flex;
                width: 700px;
                height: 40px;
                line-height: 40px;
                margin: 70px auto 0;
                justify-content: center;

                > div{
                    font-size: 14px;
                    font-weight: 400;
                    color: #930CEA;
                    text-decoration: underline;
                    margin-right: 60px;
                    cursor: pointer;
                    &:last-child{
                        margin-right: 0;
                    }
                }
            }
            .reject-reason{
                background: #F2F2F2;
                padding: 7px 4px;
                margin-bottom: 10px;
                margin-top: 5px;
                font-size: 12px;
                font-weight: 400;
                color: #495060;
            }
        }
        .previous{
            width: 120px;
            height: 32px;
            background: #FFFFFF;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            border: 1px solid #DDDEE1;
            position: fixed;
            left: 50%;
            bottom: 42px;
            margin-left: -60px;
        }
    }
</style>
