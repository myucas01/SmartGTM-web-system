<template>
    <div class="planDetail-wrap">
        <div class="planDetail-content">
            <div class="plan-info">
                <div class="plan-info-header">
                   <div class="title-box">
                       <span>计划名称：</span>
                       <h5 v-if="!editBoolean">{{planName}}</h5>
                       <span class="edit-icons" @click="editName">
                           <svg-icon v-if="!editBoolean" icon-class="edit"></svg-icon>
                       </span>
                       <el-input v-if="editBoolean" v-model="planName" placeholder="请输入内容" @keyup.enter.native="handleChangePlanName"></el-input>
                     <el-button v-if="editBoolean" type="text" class="sure-name" @click="handleChangePlanName">保存</el-button>
                     <el-button v-if="editBoolean" type="text" class="cancel-name" @click="editBoolean=!editBoolean">取消</el-button>
                   </div>
                    <p>数据推送时间：{{syncTime}}</p>
                </div>
                <div class="plan-info-content">
                  <div class="plan-info-content-item">
                    <div class="item-title">规划时间</div>
                    <p>{{ $route.query.year }}-{{ $route.query.month }}</p>
                  </div>
                    <div class="plan-info-content-item">
                        <div class="item-title">营业所</div>
                        <p>{{organizeName}}</p>
                    </div>
                    <div class="plan-info-content-item">
                        <div class="item-title">服务标准</div>
                        <p class="redirect-info" @click="toDetail('serviceStandards')">查看详情</p>
                    </div>
                    <div class="plan-info-content-item">
                        <div class="item-title">岗位作业标准</div>
                        <p class="redirect-info" @click="toDetail('jobStandards')">查看详情</p>
                    </div>
                </div>
            </div>
            <div class="plan-data">
                <slot v-if="buildLineCode === 'ai'">
                    <el-table
                            ref="table"
                            class="smart_table_light"
                            :data="tableData"
                            :row-class-name="tableRowClassName"
                            border
                            height="300"
                            style="width: 100%; margin-top: 20px">
                        <el-table-column
                                class="t-cell"
                                prop="representativePost"
                                label="业代类型"
                                align="center"
                                width="250">
                            <template slot-scope="scope">
                                <div v-if="scope.row.plannedPeopleNumber === '-' && scope.row.employeesNumber === '-' ">
                                    <span class="color-c3c3c3">
                                        {{scope.row.representativePost}}
                                    </span>
                                </div>
                                <div v-else>
                                    <ul class="generation-uls">
                                        <li v-for="item of scope.row.customerDataList" :key="item.salesTypeCode">{{item.salesTypeName}}</li>
                                    </ul>
                                </div>

                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="customerPoints"
                                label="客户点数"
                                align="center"
                                width="240">
                            <template slot="header">
                                <div class="custom-header">
                                    <h5>客户点数
                                        <el-tooltip class="item" effect="dark" content="目标岗位每人的可规划总点数" placement="top-start">
                                            <svg-icon icon-class="tip" class-name="header-icons"/>
                                        </el-tooltip>
                                    </h5>
                                    <p>(点)</p>
                                </div>
                            </template>
                            <template slot-scope="scope">
                                <span v-if="scope.row.plannedPeopleNumber === '-' && scope.row.employeesNumber === '-' " :class="{'color-c3c3c3': scope.row.plannedPeopleNumber === '-' && scope.row.employeesNumber === '-' }">{{scope.row.customerPoints}}</span>
                                <div v-else>
                                    <ul class="generation-uls point-uls">
                                        <li v-for="item of scope.row.customerDataList"
                                            :key="item.salesTypeCode+'_'+item.num"
                                            class="font-purple label-span"
                                            @click="openStoreLayer">{{item.num  |currency({fractionCount: 0})}}</li>
                                    </ul>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="employeesNumber"
                                label="在职人数"
                                width="160"
                                align="center"
                        >
                            <template slot="header">
                                <div class="custom-header">
                                    <h5>在职人数</h5>
                                    <p>(人)</p>
                                </div>
                            </template>
                            <template slot-scope="scope">
                                <div v-if="scope.row.plannedPeopleNumber === '-' && scope.row.employeesNumber === '-' "  class="color-c3c3c3">
                                    {{scope.row.employeesNumber}}
                                </div>
                                <div v-else>
                                    <el-tooltip
                                        :disabled=" Number(scope.row.employeesNumber)  > 0? false : true"
                                        class="item" effect="dark"
                                                placement="top-start">
                                      <div slot="content" class="dark-tooltip">{{scope.row.employeesName}}</div>
                                      <span class="font-purple label-span">{{scope.row.employeesNumber  |currency({fractionCount: 0})}}</span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="plannedPeopleNumber"
                                label="规划人数"
                                width="160"
                                align="center"
                        >
                            <template slot="header">
                                <div class="custom-header">
                                    <h5>规划人数</h5>
                                    <p>(人)</p>
                                </div>
                            </template>
                            <template slot-scope="scope">
                                <span v-if="scope.row.plannedPeopleNumber === '-' && scope.row.employeesNumber === '-' " class="color-c3c3c3">-</span>
                                <span v-else>{{scope.row.plannedPeopleNumber  |currency({fractionCount: 0})}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="workingHours"
                                label="工作时长"
                                width="160"
                                align="center"

                        >
                            <template slot="header">
                                <div class="custom-header">
                                    <h5>工作时长
                                        <el-tooltip class="item" effect="dark" content="目标岗位每人每天第一家门店进店打卡至最后一家门店离店打卡之间的工作总时长（不包含1小时午休）" placement="top-start">
                                            <svg-icon icon-class="tip" class-name="header-icons"/>
                                        </el-tooltip>
                                    </h5>
                                    <p>(小时/人/天)</p>
                                </div>
                            </template>
                            <template slot-scope="scope">
                                <span v-if="scope.row.plannedPeopleNumber === '-' && scope.row.employeesNumber === '-' " class="color-c3c3c3">-</span>
                                <span v-else>{{scope.row.workingHours}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="serviceDays"
                                label="服务天数"
                                width="180"
                                align="center"
                        >
                            <template slot="header">
                                <div class="custom-header">
                                    <h5>服务日天数
                                        <el-tooltip class="item" effect="dark" content="目标岗位每人每周的拜访天数" placement="top-start">
                                            <svg-icon icon-class="tip" class-name="header-icons"/>
                                        </el-tooltip>
                                    </h5>
                                    <p>(天/周)</p>
                                </div>
                            </template>
                            <template slot-scope="scope">
                                <span v-if="scope.row.plannedPeopleNumber === '-' && scope.row.employeesNumber === '-' " class="color-c3c3c3">-</span>
                                <span v-else>{{scope.row.serviceDays  |currency({fractionCount: 0})}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="total-box" v-if='tableData.length > 0'>
                        <div class="total-name width-249">合计</div>
                        <div class="total-customer width-239 color-930CEA text-align" @click="openStoreLayer">{{planData.customerPointsTotal  |currency({fractionCount: 0})}}</div>
                        <div class="total-employees width-159 color-930CEA">
                            <el-tooltip
                                :disabled=" Number(planData.employeesNumberTotal)  > 0? false : true"
                                class="item" effect="dark"
                                        placement="top-start">
                              <div slot="content" class="dark-tooltip">{{totalPeople}}</div>
                              <span>{{planData.employeesNumberTotal  |currency({fractionCount: 0})}}</span>
                            </el-tooltip>
                        </div>
                        <div class="total-planned width-159 color-4A4A4A" >{{planData.plannedPeopleNumberTotal |currency({fractionCount: 0}) }}</div>
                        <div class="total-planned width-159 color-4A4A4A text-align">{{planData.workingHoursTotal}}</div>
                        <div class="total-planned width-179 color-4A4A4A">{{planData.serviceDaysTotal |currency({fractionCount: 0})}}</div>
                    </div>
                </slot>
                <slot v-else>
                    <el-table
                            ref="table"
                            class="smart_table_light"
                            :data="tableData"
                            :row-class-name="tableRowClassName"
                            border
                            height="300"
                            style="width: 100%; margin-top: 20px">
                        <el-table-column
                                prop="representativePost"
                                label="业代类型"
                                align="center"
                                width="213">
                            <template slot-scope="scope">
                                <div v-if="scope.row.plannedPeopleNumber === '-' && scope.row.employeesNumber === '-' ">
                                    <span class="color-c3c3c3">
                                        {{scope.row.representativePost}}
                                    </span>
                                </div>
                                <div v-else>
                                    <ul class="generation-uls">
                                        <li v-for="item of scope.row.customerDataList" :key="item.salesTypeCode">{{item.salesTypeName}}</li>
                                    </ul>
                                </div>

                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="customerPoints"
                                label="客户点数"
                                align="center"
                                width="160">
                            <template slot="header">
                                <div class="custom-header">
                                    <h5>客户点数
                                        <el-tooltip class="item" effect="dark" content="目标岗位每人的可规划总点数" placement="top-start">
                                            <svg-icon icon-class="tip" class-name="header-icons"/>
                                        </el-tooltip>
                                    </h5>
                                    <p>(点)</p>
                                </div>
                            </template>
                            <template slot-scope="scope">
                                <span v-if="scope.row.plannedPeopleNumber === '-' && scope.row.employeesNumber === '-' " :class="{'color-c3c3c3': scope.row.plannedPeopleNumber === '-' && scope.row.employeesNumber === '-' }">{{scope.row.customerPoints}}</span>
                                <div v-else>
                                    <ul class="generation-uls point-uls width-160">
                                        <li v-for="item of scope.row.customerDataList"
                                            :key="item.salesTypeCode+'_'+item.num"
                                            class="font-purple label-span"
                                            @click="openStoreLayer">{{item.num |currency({fractionCount: 0})}}</li>
                                    </ul>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="employeesNumber"
                                label="在职人数"
                                width="180"
                                align="center"
                        >
                            <template slot="header">
                                <div class="custom-header">
                                    <h5>在职人数</h5>
                                    <p>(人)</p>
                                </div>
                            </template>
                            <template slot-scope="scope">
                                <div v-if="scope.row.plannedPeopleNumber === '-' && scope.row.employeesNumber === '-' "  class="color-c3c3c3">
                                    {{scope.row.employeesNumber }}
                                </div>
                                <div v-else>
                                    <el-tooltip
                                        :disabled=" Number(scope.row.employeesNumber)  > 0? false : true"
                                        class="item" effect="dark"
                                                placement="top-start">
                                      <div slot="content" class="dark-tooltip">{{scope.row.employeesName}}</div>
                                      <span class="font-purple label-span">{{scope.row.employeesNumber |currency({fractionCount: 0})}}</span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="plannedPeopleNumber"
                                label="规划人数"
                                width="200"
                                align="center"
                        >
                            <template slot="header">
                                <div class="custom-header">
                                    <h5>规划人数</h5>
                                    <p>(人)</p>
                                </div>
                            </template>
                            <template slot-scope="scope">
                                <span v-if="scope.row.plannedPeopleNumber === '-' && scope.row.employeesNumber === '-' " class="color-c3c3c3">-</span>
                                <span v-else>{{scope.row.plannedPeopleNumber |currency({fractionCount: 0})}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="workingHours"
                                label="工作时长"
                                width="200"
                                align="center"
                        >
                            <template slot="header">
                                <div class="custom-header">
                                    <h5>工作时长
                                        <el-tooltip class="item" effect="dark" content="目标岗位每人每天第一家门店进店打卡至最后一家门店离店打卡之间的工作总时长（不包含1小时午休" placement="top-start">
                                            <svg-icon icon-class="tip" class-name="header-icons"/>
                                        </el-tooltip>
                                    </h5>
                                    <p>(小时/人/天)</p>
                                </div>
                            </template>
                            <template slot-scope="scope">
                                <span v-if="scope.row.plannedPeopleNumber === '-' && scope.row.employeesNumber === '-' " class="color-c3c3c3">-</span>
                                <span v-else>{{scope.row.workingHours}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="serviceDays"
                                label="服务天数"
                                width="200"
                                align="center"
                        >
                            <template slot="header">
                                <div class="custom-header">
                                    <h5>服务日天数
                                        <el-tooltip class="item" effect="dark" content="目标岗位每人每周的拜访天数" placement="top-start">
                                            <svg-icon icon-class="tip" class-name="header-icons"/>
                                        </el-tooltip>
                                    </h5>
                                    <p>(天/周)</p>
                                </div>
                            </template>
                            <template slot-scope="scope">
                                <span v-if="scope.row.plannedPeopleNumber === '-' && scope.row.employeesNumber === '-' " class="color-c3c3c3">-</span>
                                <span v-else>{{scope.row.serviceDays |currency({fractionCount: 0})}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="total-box" v-if='tableData.length > 0'>
                        <div class="total-name width-212">合计</div>
                        <div class="total-customer width-159 color-930CEA" @click="openStoreLayer">{{planData.customerPointsTotal |currency({fractionCount: 0})}}</div>
                        <div class="total-employees width-179 color-930CEA">
                            <el-tooltip
                                :disabled=" Number(planData.employeesNumberTotal)  > 0? false : true"
                                class="item" effect="dark"
                                        placement="top-start">
                              <div slot="content" class="dark-tooltip">{{totalPeople}}</div>
                              <span>{{planData.employeesNumberTotal |currency({fractionCount: 0})}}</span>
                            </el-tooltip>
                        </div>
                        <div class="total-planned width-199">{{planData.plannedPeopleNumberTotal |currency({fractionCount: 0})}}</div>
                        <div class="total-planned width-199">{{planData.workingHoursTotal}}</div>
                        <div class="total-planned width-199">{{planData.serviceDaysTotal |currency({fractionCount: 0})}}</div>
                    </div>
                </slot>
            </div>
        </div>
        <storeLayer v-show="storeLayerShow" ref="storeChild" :draftId="planId" @closeDialog="closeDialog"  :edit="false"/>
    </div>
</template>

<script>
    import ROUTE_PLANNING_API from '@api/route/index'
    import {mapGetters} from 'vuex'
    import storeLayer from './components/StoreLayer'

    export default {
        name: "PlanDetail",
        components: {
            storeLayer
        },
        data() {
            return {
                search: '',
                tableData: [],
                storeLayerShow: false,
                organization: '',
                planName: '',
                organizeName: '',
                precinctTypeCode: '',
                buildLineCode: '',
                planData: '',
                abnormalLatLng: '',
                abnormalStoreType: '',
                abnormalVisitRate: '',
                notConfiguredTotal: '',
                syncTime: '',
                planId: '',
                editBoolean: false,
                totalPeople: ''
            }
        },
      beforeCreate() {
        const windHeigth = document.documentElement.clientHeight || document.body.clientHeight
        if(windHeigth < 800) {
          document.querySelector('.home main').setAttribute('style', 'overflow: auto !important;')
        }
      },
      beforeDestroy() {
        if(document.querySelector('.home main').getAttribute('style')) {
          document.querySelector('.home main').removeAttribute('style')

        }
      },
        beforeRouteEnter(to, form, next) {
            next(vm => {
                const {id} = vm.$route.params;
                const {planName} = vm.$route.query;
                vm.planId = id
                vm.$store.commit('addTabs', {
                    title: `${planName}`,
                    link: decodeURIComponent(to.fullPath),
                    on: true,
                    needCatch: true,
                });
                vm.getParentOrg()
                vm.getPlanDetail()
            })
        },
        computed: {
            ...mapGetters('routerPlanning', ['visitOrgId', 'draftId'])
        },
        mounted() {
            this.precinctTypeCode = this.$route.query.precinctTypeCode
            this.buildLineCode = this.$route.query.buildLineCode
        },
        methods: {
            // 获取 计划 详情
            getPlanDetail() {
                const {id} = this.$route.params;
                ROUTE_PLANNING_API.getDraftPlanParameter({
                    orgId: this.$route.query.organizeId,
                    planId: id
                })
                    .then(result => {
                        if (result.code === '200') {
                            this.tableData = [
                                ...result.data.planDataList
                            ]
                            this.syncTime = result.data.syncTime
                            this.planData = result.data
                            this.planName = result.data.prePlanName
                            if (this.tableData && this.tableData.length > 0) {
                                for (let item of this.tableData) {
                                    this.totalPeople += `${item.employeesName},`
                                }
                            }
                        }
                    })
            },
            // 查看客户数/在职人数
            openStoreLayer() {
                this.storeLayerShow = true
                this.$refs.storeChild.defaultOpen()
            },
            closeDialog() {
                this.storeLayerShow = false
            },
            // 查看详情
            toDetail(type) {
                switch (type) {
                    case 'customer': // 客户规模
                        this.$router.push({
                            path: '/route-planning/company-scale-edit',
                            query: {
                                orgName: this.organization.grandfatherOrgName, // 行销公司名称
                                orgId: this.organization.grandfatherOrgId, // 行销公司ID
                                isEdit: false
                            }
                        })
                        break;
                    case 'serviceStandards': // 服务标准
                        this.$store.commit('routerPlanning/SET_CURRENT_SERVICE_NAME', this.organization.templateName); // 服务标准name
                        this.$store.commit('routerPlanning/SET_CURRENT_SERVICE_ID', this.organization.templateId); // 服务标准id
                        this.$store.commit('routerPlanning/SET_CURRENT_SERVICE_TYPE', 'true'); // 新增or编辑服务标准
                        this.$store.commit('routerPlanning/SET_CURRENT_SERVICE_DISABLE', true); // 表格是否限制编辑 true:限制 false:不限制
                        this.$router.push({
                            path: '/route-planning/service-standards-edit',
                            query: {
                                planId: this.$route.params.id
                            },
                        });
                        break;
                    case 'jobStandards': // 岗位作业标准
                        this.$router.push({
                            path: '/route-planning/work-standards-edit',
                            query: {
                                isDisable: true
                            },
                        })
                        break;

                }
            },
            // 获取组织架构
            async getParentOrg() {
                const {id} = this.$route.params;
                let result = await ROUTE_PLANNING_API.getParentOrg({orgId: this.$route.query.organizeId, prePlanNo: id})
                if(result.code === '200') {
                    this.organization = result.data
                    this.organizeName = result.data.orgName
                }
            },
            tableRowClassName({row}) {
                if(row.customerDataList && row.customerDataList.length > 0) {
                    return '';
                } else {
                    return 'padding'
                }
            },
            handleChangePlanName() {
                if(!this.planName) {
                    this.$message({
                        message: '请填写计划名称',
                        type: 'warning'
                    })
                    return
                }
                if(this.planName.length > 70) {
                    this.$message({
                        message: '计划名字长度不能超过70个字符',
                        type: 'warning'
                    })
                    return
                }
                ROUTE_PLANNING_API.updatePlanName({
                    planId: this.$route.params.id,
                    planName: this.planName
                })
                .then(res => {
                    if(res.code === '200') {
                        this.editBoolean = false
                    }
                })
            },
            editName() {
                this.editBoolean = true
            }
        }
    }
</script>

<style scoped lang="scss">
.dark-tooltip{
  max-width: 30vh;
}
    .planDetail-wrap {
        width: 100%;
        background: #F8F8F9;

        .planDetail-content {
            width: 1194px;
            margin: 20px auto;
        }

        .plan-info {
            background: #FFF;
            box-shadow: 0px 1px 0px 0px #E3E4E6;

            &-header {
                display: flex;
                height: 45px;
                line-height: 45px;
                justify-content: space-between;
                padding: 0 20px;
                box-shadow: 0px 1px 0px 0px #CED3DD;
                .title-box{
                    display: flex;
                    h5 {
                        font-size: 16px;
                        font-weight: 600;
                        color: #333333;
                    }
                    .edit-icons{
                        position: relative;
                        top: 0;
                        left: 10px;
                        cursor: pointer;
                    }
                  .sure-name{
                    margin-left: 24px;
                  }
                  .edit-icons{
                    position: relative;
                    top: 0;
                    left: 10px;
                    cursor: pointer;
                  }
                  .cancel-name{
                    color: #666666;
                  }
                    ::v-deep {
                        .el-input{
                            width: 400px;
                        }
                        .el-input__inner{
                            width: 400px;
                            height: 30px;
                        }
                    }

                }
                p {
                    font-size: 14px;
                    font-weight: 400;
                    color: #999999;
                }
            }

            &-content {
                height: 200px;
                padding-top: 20px;

                &-item {
                    display: flex;
                    height: 40px;
                    line-height: 40px;
                    font-size: 14px;
                    font-weight: 400;
                    color: #495060;

                    .item-title {
                        width: 160px;
                        text-align: right;
                        margin-right: 20px;
                    }

                    .redirect-info {
                        font-size: 14px;
                        font-weight: 400;
                        color: #930CEA;
                        cursor: pointer;
                    }
                }
            }

        }

        .plan-data {
            background-color: #fff;
            margin-top: 20px;
            padding: 20px;
        }

        .custom-header {
            text-align: center;

            p {
                font-size: 12px;
                font-weight: 400;
                color: #495060;
            }

            .header-icons {
                display: inline-block;
                width: 15px;
                height: 15px;
            }
        }
        .color-c3c3c3{
            color: #c3c3c3 !important;
        }
        .generation-uls{
            width: 250px;
            position: relative;
            left: -10px;
            li{
                border-top: 1px solid #DDDEE1;
                line-height: 25px;
                padding-left: 10px;
                padding-top: 10px;
                padding-bottom: 10px;
                &:first-child{
                    border: none;
                }
            }
        }
        ::v-deep .el-table{
            /*&:before{*/
            /*    display: none;*/
            /*}*/
            /*&:after{*/
            /*    display: none;*/
            /*}*/
            td{
                padding-top: 0;
                padding-bottom: 0;
            }
        }
        .point-uls{
            width: 250px;
            li{
                text-align: center;
                padding-left: 0;
                padding-top: 10px;
                padding-bottom: 10px;
            }
        }
        .width-160{
            width: 160px;
        }
        .total-box{
            width: 100%;
            display: flex;
            height: 40px;
            line-height: 40px;
            position: relative;
            div{
                text-align: center;
            }
            &:before{
                content: '';
                width: 100%;
                height:1px;
                background-color: #DDDEE1;
                position: absolute;
                top: -1px;
                left: 0;
            }

            .border{
                border-bottom: 1px solid #DDDEE1;
                border-right: 1px solid #DDDEE1;
            }
            .total-name{
                width:116px;
                text-align: center;
                color: RGBA(176, 176, 176, 1);
                cursor: pointer;
                border-left: 1px solid #DDDEE1;
                @extend .border;
            }
            .total-customer{
                width: 89px;
                text-indent: 10px;
                font-size: 12px;
                @extend .border;
            }
            .total-employees{
                text-indent: 10px;
                font-size: 12px;
                @extend .border;
            }
            .total-planned{
                @extend .total-employees;
            }
            .total-operating{
                @extend .total-employees;
            }
            .width-212{
                width: 212px;
            }
            .width-199{
                width: 199px;
            }


            .width-249{
                width: 249px;
            }
            .width-239{
                width: 239px;
            }
            .width-159{
                width: 159px;
            }
            .width-179{
                width: 179px;
            }
            .color-4A4A4A{
                color: #4A4A4A;
            }
            .color-930CEA{
                color: #930CEA;
            }
            .text-align{
                text-align: center;
            }


        }
    }
</style>
<style>
    .planDetail-wrap .el-table .padding  td{
        padding-top: 10px;
        padding-bottom: 10px;
    }
</style>
