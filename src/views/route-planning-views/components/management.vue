<template>
    <div class="management-wrap">
        <div v-show="showMain">
            <p class="data-title">审批计划</p>
            <div class="sales-types">
                <ul ref="headerWrapper">
                    <li v-for="item of tableData" :key="item.salesTypeName">{{item.salesTypeName}}</li>
                </ul>
            </div>
            <div class="sales-plan">
              <p class="build-title">{{$route.query.year}}-{{$route.query.month}} {{$route.query.organizeName}}</p>
              <div class="sales-plan-left">拜访计划</div>
                <div class="sales-plan-content">
                    <ul ref="bodyWrapper">
                        <li  v-for="item of tableData" :key="'L'+item.salesTypeCode">
                            <span class="span_active" v-if="item.isPlan === '1'">已计划</span>
                            <span v-else>未计划</span>
                        </li>
                    </ul>
                </div>
                <div class="sales-plan-right">
                    <el-button icon="el-icon-download" class="plan-down" @click="downPlan"></el-button>
                    <el-button class="map-btn" @click="toView">计划预览</el-button>
                </div>
            </div>
            <div class="sales-footer" v-if="approvalStatus">
                <button v-auth="'lineplan:build:check:approve'"  @click="dialogVisible = true">通过</button>
                <button v-auth="'lineplan:build:check:approve'"  @click="rejectDialogVisible = true">驳回</button>
            </div>
        </div>
        <div v-if="!showMain">
            <p class="no-title">审批计划</p>
            <div class="no-content">
                <svg-icon icon-class="no_plan_data"  class-name="no-icon"></svg-icon>
                <p>暂无需要审批计划</p>
            </div>
        </div>
        <el-dialog
                :visible.sync="dialogVisible"
                width="400px">
            <div style="font-size: 16px;font-weight: 600;color: #1F2D3D;">请确认是否通过审批</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="passPlan">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="请输入驳回备注"
                :visible.sync="rejectDialogVisible"
                width="400px">
            <div>
                <el-input
                        type="textarea"
                        :rows="2"
                        autosize
                        placeholder="请输入内容"
                        v-model="refuseText">
                </el-input>
                <p style="text-align: right;">{{refuseText.length}}/200</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rejectDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="rejectPlan">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {throttle} from 'throttle-debounce';
    import ROUTE_PLANNING_API from "@api/route/index";
    import { mapGetters } from 'vuex'
    export default {
        name: "management",
        title() {
            return '管理者审批'
        },
        props: ['mainPlanData'],
        data() {
            return{
                dialogVisible: false,
                rejectDialogVisible: false,
                tableData: [],
                refuseText: '',
                approvalStatus: false,
                mainPlan: this.mainPlanData, // 主计划
                queryData: '',
                showMain: ''
            }
        },
        computed: {
            bodyWrapper() {
                return this.$refs.bodyWrapper;
            },
            ...mapGetters('routerPlanning', [
                'visitOrgId',
                'visitMonth',
                'visitYear'
            ]),
            ...mapGetters('common',['currentMessage'])
        },
        watch: {
            // 消息 监听 刷新 数据状态
            currentMessage() {
                if(this.currentMessage) {
                    let currentMessage = JSON.parse(this.currentMessage)
                    if(currentMessage.bussinessCode === '101') {
                        if(!this.show) {
                            this.getApprovalPlan()
                        }
                    }
                }
            },
            mainPlanData() {
                if(this.mainPlanData) {
                    if(this.mainPlanData.planStatus === '1'){
                        this.showMain = false
                        return
                    }
                    if(this.mainPlanData.planStatus === '2' || this.mainPlanData.planStatus === '3' || this.mainPlanData.planStatus === '4'){
                        this.showMain = true
                        return
                    }
                    this.showMain = false
                } else {
                    this.showMain = false
                }
            }
        },
        mounted() {
            this.queryData = this.$route.query
            this.bindEvents()
        },
        destroyed() {
            this.unbindEvents();
        },
        methods: {
            // 绑定 滚动监听
            bindEvents() {
                this.bodyWrapper.addEventListener('scroll', this.syncPostion, {passive: true});
            },
            // 销毁绑定 滚动监听
            unbindEvents() {
                this.bodyWrapper.removeEventListener('scroll', this.syncPostion, {passive: true});
            },
            syncPostion: throttle(20, function () {
                const {scrollLeft} = this.bodyWrapper
                const {headerWrapper} = this.$refs
                if(headerWrapper) headerWrapper.scrollLeft = scrollLeft
            }),
            passPlan() {
                this.replyApproval({
                    orgId: this.queryData ? this.queryData.organizeId : '',
                    yearMonth:  this.queryData ? `${this.queryData.year}-${this.queryData.month}` : '',
                    isResult: 2
                })
            },
            rejectPlan() {
                this.replyApproval({
                    orgId: this.queryData ? this.queryData.organizeId : '',
                    yearMonth:  this.queryData ? `${this.queryData.year}-${this.queryData.month}` : '',
                    isResult: 3,
                    refuse: this.refuseText
                })
            },
            // 获取 提交审批 计划 （审批者专属）
            getApprovalPlan() {
                ROUTE_PLANNING_API.approvalPlan(
                    {
                        orgId: this.queryData ? this.queryData.organizeId : '',
                        yearMonth:  this.queryData ? `${this.queryData.year}-${this.queryData.month}` : '',
                    }
                )
                .then(res => {
                    if(res.code === '200') {
                        console.log(this.mainPlanData)
                        this.approvalStatus = this.mainPlanData.approvalStatus
                        this.tableData = res.data
                    }
                })
            },
            // 同意/拒绝 审批
            replyApproval(params) {
               ROUTE_PLANNING_API.replyApproval(params)
                .then(res => {
                    if(res.code == 200) {
                        this.$message({
                            message: '审批完成',
                            type: 'success'
                        })
                        this.approvalStatus = false
                        this.rejectDialogVisible = false
                        this.dialogVisible = false
                        this.$parent.getMainInfo()
                    }
                })
            },
            toView() {
                this.$store.commit('routerPlanning/SET_MAP_VIEW_ID', this.mainPlanData.id)
                this.$router.push({path: `/route-planning/plan-preview?planName=${encodeURIComponent(this.mainPlanData.name)}&planId=${this.mainPlanData.id}&edit=false&planAhead=true&precinctsCode=&routeCode=`})
            },
            downPlan() {
                this.$message({
                    showClose: true,
                    message: '计划下载中,请稍等...'
                })
                this.downVisitData()
                this.downData()
            },
            downVisitData() {
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
                setTimeout(()=>{
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
                setTimeout(()=>{
                    iframe.remove()
                    _this.downBoolean = false
                }, 5 * 60 * 1000)
            },
        }
    }
</script>

<style scoped lang="scss">
    .management-wrap{
        width: 1194px;
        margin: 0 auto;
        .sales-types{
            height: 30px;
            line-height: 30px;
            ul{
                display: flex;
                width: 800px;
                overflow: hidden;
                margin-left: 175px;
                li{
                    min-width: 110px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #087E42;
                    margin-right: 10px;
                    text-align: center;
                    &:last-child{
                        margin-right: 0;
                    }
                }
            }
        }
        .sales-plan{
            width: 1194px;
            height: 80px;
            background: #FFFFFF;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
            border-radius: 40px;
            border: 1px solid #EDEDED;
            align-items: center;
            position: relative;
            .build-title{
              font-size: 16px;
              font-weight: 600;
              position: absolute;
              top: -28px;
              left: 10;
            }
            &-left{
                width: 145px;
                line-height: 80px;
                font-size: 14px;
                font-weight: 600;
                color: #000000;
                text-align: center;
                margin-left: 30px;
                position: absolute;
                top: 0;
                left: 0;
            }
            &-right{
                width: 242px;
                height: 80px;
                line-height: 80px;
                position: absolute;
                top: 0;
                right: 0;

                button {
                    border: none;
                    border-radius: 0;
                    padding: 0;
                    margin: 0;

                    &:hover {
                        border: none;
                        border-radius: 0;
                    }
                }
                .plan-down{
                    width: 40px;
                    height: 40px;
                    background: #FAFAFA;
                    border-radius: 4px;
                    border: 1px solid #DDDDDD;
                    margin-left: 60px;
                }
                .map-btn{
                    width: 81px;
                    height: 40px;
                    background: rgba(147, 12, 234, 0.2);
                    border-radius: 4px;
                    border: 1px solid #930CEA;
                    text-align: center;
                    font-size: 12px;
                    font-weight: 500;
                    color: #930CEA;
                    margin-left: 15px;
                }
            }
            &-content{
                height: 80px;
              ul{
                  display: flex;
                  width: 800px;
                  height: 80px;
                  align-items: center;
                  overflow-x: auto;
                  overflow-y: hidden;
                  margin-left: 175px;
                  li{
                      width: 110px;
                      height: 59px;
                      flex-shrink: 0;
                      text-align: center;
                      line-height: 59px;
                      font-size: 12px;
                      font-weight: 400;
                      margin-right: 10px;
                      span{
                          display: inline-block;
                          width: 100%;
                          height: 100%;
                          border: 1px solid #EDEDED;
                          border-radius: 4px;
                          font-size: 12px;
                      }
                      .span_active{
                          background: #D1F2E1;
                          border: 1px solid #19BE6B;
                      }
                  }
              }
            }
        }
        .sales-footer{
            display: flex;
            width: 100%;
            justify-content: center;
            margin-top: 50px;
            button{
                height: 32px;
                background: #930CEA;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                border: 1px solid #DDDEE1;
                padding: 0 33px;
                margin-right: 50px;
                color: #fff;
                &:focus{
                    border:none;
                }
                &:last-child{
                    margin-right: 0;
                    background-color: #930CEA;
                    background: #ED3F14;
                }
            }
        }
    }
    .no-title{
        font-size: 24px;
        font-weight: 400;
        color: #000000;
        text-align: center;
        padding: 30px 0 40px 0;
    }
    .no-content{
        height: 407px;
        background: #FFFFFF;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        border: 1px solid #EDEDED;
        text-align: center;
        .no-icon{
            display: inline-block;
            width: 210px;
            height: 160px;
            margin-top: 100px;
        }
        p{
            font-size: 20px;
            font-weight: 400;
            color: #000000;
            margin-top: 45px;
        }
    }
    .data-title{
        font-size: 24px;
        font-weight: 400;
        color: #000000;
        padding: 30px 0 40px 0;
        text-align: center;
    }
</style>
