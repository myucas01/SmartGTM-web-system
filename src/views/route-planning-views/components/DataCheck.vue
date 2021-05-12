<!--数据检查-->
<template>
    <div class="data-check-wrap">
        <h1 class="title">检查数据</h1>
        <div class="data-check-content">
            <div class="data-check-content-header">
                <div class="title-box">
                    <span>计划名称：</span>
                    <h5 v-if="!editBoolean">{{prePlanName}}</h5>
                    <span class="edit-icons" @click="editName">
                           <svg-icon v-if="!editBoolean" icon-class="edit"></svg-icon>
                       </span>
                    <el-input v-if="editBoolean" v-model="prePlanName" placeholder="请输入内容" ></el-input>
                  <el-button v-if="editBoolean" type="text" class="sure-name" @click="handleChangePlanName">保存</el-button>
                  <el-button v-if="editBoolean" type="text" class="cancel-name" @click="editBoolean=!editBoolean">取消</el-button>
                </div>
                <p class="plan-time">数据推送时间：{{syncTime}}</p>
            </div>
            <div class="data-check-content-table">
                <slot v-if="queryData.buildLineCode === 'ai'">
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
                                width="215">
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
                                width="220">
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
                                            @click="openStoreLayer">{{item.num |currency({fractionCount: 0})}}</li>
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
                                <span v-else>{{scope.row.plannedPeopleNumber |currency({fractionCount: 0})}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="workingHours"
                                label="工作时长"
                                width="120"
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
                                width="110"
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
                        <el-table-column
                                label="操作"
                                width="170"
                                align="center">
                            <template slot-scope="scope">
                                <div v-if="scope.row.plannedPeopleNumber !== '-' && scope.row.employeesNumber !== '-' ">
                                    <el-button type="text" size="small" @click="editSalesType(scope.row)">编辑</el-button>
                                    <el-button type="text" size="small" @click="clearData(scope.row, scope.$index)">清空</el-button>
                                </div>
                               <div v-else :class="{'color-c3c3c3': scope.row.plannedPeopleNumber === '-' && scope.row.employeesNumber === '-' }">
                                   -
                               </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="total-box" v-if='tableData.length > 0'>
                        <div class="total-name width-214">合计</div>
                        <div class="total-customer width-219 color-930CEA text-align" @click="openStoreLayer">{{planData.customerPointsTotal|currency({fractionCount: 0})}}</div>
                        <div class="total-employees width-160 color-930CEA">
                            <el-tooltip class="item" effect="dark"
                                        placement="top-start">
                              <div slot="content" class="dark-tooltip">{{totalPeople}}</div>
                                <span>{{planData.employeesNumberTotal |currency({fractionCount: 0})}}</span>
                            </el-tooltip>
                        </div>
                        <div class="total-planned width-158 color-4A4A4A" >{{planData.plannedPeopleNumberTotal |currency({fractionCount: 0})}}</div>
                        <div class="total-planned width-120 color-4A4A4A text-align">{{planData.workingHoursTotal}}</div>
                        <div class="total-planned width-109 color-4A4A4A">{{planData.serviceDaysTotal |currency({fractionCount: 0})}}</div>
                        <div class="total-operating width-170 color-4A4A4A text-align" >-</div>
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
                                width="215">
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
                                width="150">
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
                                    <ul class="generation-uls point-uls width-152">
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
                                width="210"
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
                        <div class="total-name width-220">合计</div>
                        <div class="total-customer width-153 color-930CEA" @click="openStoreLayer">{{planData.customerPointsTotal |currency({fractionCount: 0})}}</div>
                        <div class="total-employees width-183 color-930CEA">
                            <el-tooltip class="item"  effect="dark"
                                        placement="top-start">
                              <div slot="content" class="dark-tooltip">{{totalPeople}}</div>
                                <span>{{planData.employeesNumberTotal |currency({fractionCount: 0})}}</span>
                            </el-tooltip>
                        </div>
                        <div class="total-planned width-203">{{planData.plannedPeopleNumberTotal |currency({fractionCount: 0})}}</div>
                        <div class="total-planned width-204">{{planData.workingHoursTotal}}</div>
                        <div class="total-planned width-215">{{planData.serviceDaysTotal |currency({fractionCount: 0})}}</div>
                    </div>
                </slot>
            </div>
        </div>
        <!-- 修改数据 -->
        <el-dialog
                title="编辑"
                :visible.sync="dialogVisible"
                width="670px"
        >
            <div class="edit-content">
                <div class="form-box">
                    <div class="form-item">
                        <label>岗位</label>
                        <p>{{form.representativePost}}</p>
                    </div>
                    <div class="form-item">
                        <label>客户点数</label>
                        <p>{{form.customerPoints}}</p>
                    </div>
                    <div class="form-item">
                        <label>在职人数</label>
                        <p>{{form.employeesNumber}}</p>
                    </div>
                    <div class="form-item">
                        <label>人均工作时长</label>
                        <div class="form-item-wrap">
                            <el-input v-model="form.workingHoursMin"  :min="0" :max='24' type="number"
                                      placeholder="请输入内容"></el-input>
                            <span class="line"></span>
                            <el-input v-model="form.workingHoursMax"
                                      :min="0" :max='24' type="number"
                                      placeholder="请输入内容"></el-input>
                        </div>
                        <span>小时/天</span>
                    </div>
                    <div class="form-item">
                        <label>工作日天数</label>
                        <div class="form-item-wrap ">
                            <el-input v-model="form.serviceDays" type="number" @blur="blurServiceDay" :min="1" :max="7"
                                      class="width235" placeholder="请输入内容"></el-input>
                        </div>
                        <span>天/周</span>
                    </div>
                    <div class="form-item" v-if="queryData.areaCode == 'ai'">
                        <label>规划人数</label>
                        <div class="form-item-wrap ">
                            <el-input v-model="form.plannedPopulation" type="number" :min="0" class="width235"
                                      placeholder="请输入内容"></el-input>
                        </div>
                        <span>个</span>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editPlanConfig(true)">确认</el-button>
            </div>
        </el-dialog>
        <!-- 客户数详情 -->
        <store-layer
                v-show="storeLayerShow"
                :draftId="planId"
                @closeDialog="closeDialog"
                ref="storeChild" :edit="true"
                :abnormalLatLng="abnormalLatLng"
                :abnormalVisitRate="abnormalVisitRate"
                :notConfiguredTotal="notConfiguredTotal"
                :abnormalStoreType="abnormalStoreType"/>
    </div>
</template>

<script>
    import storeLayer from './StoreLayer'
    import ROUTE_PLANNING_API from '@api/route/index'

    export default {
        name: "DataCheck",
        title() {
            return '数据检查'
        },
        components: {
            storeLayer
        },
        data() {
            return {
                form: {
                    planId: '',
                    plannedPopulation: '',
                    salesVolume: '',
                    sellingPoints: '',
                    serviceDays: '',
                    visitDuration: false,
                    workingHours: '',
                    workingHoursMin: '',
                    workingHoursMax: '',
                    representativePost: '',
                    customerPoints: '',
                    employeesNumber: '',
                    salesTypeCode: ''
                },
                planId: '',
                nowType: 'Sales',
                dialogVisible: false,
                tableData: [],
                totalTable: [],
                needCheckData: [], // 需要校验的配置 数据
                totalPeople: '',
                planData: '',
                abnormalLatLng: '',
                abnormalStoreType: '',
                abnormalVisitRate: '',
                notConfiguredTotal: '',
                syncTime: '', // 数据同步时间
                queryData: '',
                prePlanName: '',
                editBoolean: false,
                storeLayerShow: false // 客户数详情弹层 控制
            }
        },
        mounted() {
            this.queryData = this.$route.query
            this.planId = this.$route.query.draftId
            this.getPlanData()

        },
        updated() {
            this.$nextTick(() => {
                // this.$refs['table'].doLayout();
            })
        },
        methods: {
            // 获取 计划配置数据
            async getPlanData() {
                if(!this.queryData){
                    this.$message.error('数据检查 - 获取计划配置数据 - 当前参数异常');
                }
                let result = await ROUTE_PLANNING_API.getDraftPlanParameter({
                    orgId:  this.queryData.organizeId,
                    planId:  this.queryData.draftId
                })
                if (result.code === '200') {
                    this.tableData = [
                        ...result.data.planDataList
                    ]
                    this.needCheckData = result.data.planDataList
                    this.syncTime = result.data.syncTime
                    this.planData = result.data
                    this.prePlanName = result.data.prePlanName
                    if(this.tableData && this.tableData.length > 0) {
                        for(let item of this.tableData) {
                            this.totalPeople += `${item.employeesName},`
                        }
                    }
                }
            },
            // 获取权重值
            getWeightsVal() {
                this.form.salesVolume = 20
                this.form.sellingPoints = 50
                this.form.visitDuration = 30
            },
            // 表单校验 工作日天数
            blurServiceDay() {
                if (this.form.serviceDays) {
                    if (this.form.serviceDays > 7) {
                        this.form.serviceDays = 7
                    }
                    if (this.form.serviceDays < 1) {
                        this.form.serviceDays = 1
                    }
                } else {
                    this.form.serviceDays = 1
                }
            },
            // 表单校验 工作时长
            blurWorkHour(type) {
                if (type == 'min') {
                    if (this.form.workingHoursMin) {
                        if (this.form.workingHoursMin > 24) {
                            this.form.workingHoursMin = 24
                        }
                    } else {
                        this.form.workingHoursMin = 0
                    }
                } else {
                    if (this.form.workingHoursMax) {
                        if (this.form.workingHoursMax < this.form.workingHoursMin) {
                            this.form.workingHoursMax = Number(this.form.workingHoursMin) + 1
                        }
                        if (this.form.workingHoursMax > 24) {
                            this.form.workingHoursMax = 24
                        }
                    } else {
                        this.form.workingHoursMax = Number(this.form.workingHoursMin) + 1
                    }
                }

            },
            // 查看客户数/在职人数
            openStoreLayer() {
                this.storeLayerShow = true
                this.$refs.storeChild.defaultOpen()
            },
            // 关闭客户数弹层
            closeDialog() {
                this.storeLayerShow = false
                // 更新列表数据
                this.getPlanData()
            },
            /**
             * 更新配置
             */
            editPlanConfig() {
                let forms = {
                    ownJobMax: this.form.workingHoursMax,
                    ownJobMin: this.form.workingHoursMin,
                    plannedPopulation: this.form.plannedPopulation,
                    planId: this.$route.query.draftId,
                    salesVolume: this.form.salesVolume,
                    sellingPoints: this.form.sellingPoints,
                    serviceDays: this.form.serviceDays,
                    visitDuration: this.form.visitDuration,
                    salesTypeCode: this.form.salesTypeCode
                }
                if(Number(this.form.workingHoursMin) > Number(this.form.workingHoursMax)) {
                  this.$message({
                    message: '最大工作时长必须大于等于最小工作时长',
                    type: 'warning'
                  })
                  return
                }
                ROUTE_PLANNING_API.upDraftPlanParameter(forms)
                    .then(res => {
                        if (res.code === '200') {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            })
                            this.getPlanData()
                            this.dialogVisible = false
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })

            },
            // 编辑业代参数
            editSalesType(row) {
                this.form = {
                    planId: this.$route.query.draftId,
                    plannedPopulation: row.plannedPeopleNumber,
                    salesVolume: Number(row.salesVolume),
                    sellingPoints: Number(row.sellingPoints),
                    visitDuration: Number(row.visitDuration),
                    serviceDays: row.serviceDays,
                    workingHours: row.workingHours,
                    workingHoursMin: row.workingHours.split('-')[0],
                    workingHoursMax: row.workingHours.split('-')[1],
                    representativePost: row.representativePost,
                    customerPoints: (function () {
                        if(row.customerDataList && row.customerDataList.length > 0) {
                           return row.customerDataList.reduce(function (total, item) {
                              return  total + item.num
                            },0)
                       } else {
                           return 0
                       }
                    }()),
                    employeesNumber: row.employeesNumber,
                    salesTypeCode: row.representativePostCode
                }
                this.dialogVisible = true
            },
            // 清空
            clearData(row) {
              this.form = {
                planId: this.$route.query.draftId,
                plannedPopulation: 0,
                salesVolume: 0,
                sellingPoints: 0,
                visitDuration: 0,
                serviceDays: 0,
                workingHours: 0,
                workingHoursMin: 0,
                workingHoursMax: 0,
                representativePost: 0,
                customerPoints: 0,
                employeesNumber: 0,
                salesTypeCode: row.representativePostCode
              }
              this.editPlanConfig(false)
            },
            tableRowClassName({row}) {
                if(row.customerDataList && row.customerDataList.length > 0) {
                    return '';
                } else {
                    return 'padding'
                }
            },
            handleChangePlanName() {
                if(!this.prePlanName) {
                    this.$message({
                        message: '请填写计划名称',
                        type: 'warning'
                    })
                    return
                }
                if(this.prePlanName.length > 70) {
                    this.$message({
                        message: '计划名字长度不能超过70个字符',
                        type: 'warning'
                    })
                    return
                }
                ROUTE_PLANNING_API.updatePlanName({
                    planId: this.$route.query.draftId,
                    planName: this.prePlanName
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
    .data-check-wrap {
        padding-top: 36px;

        .title {
            font-size: 32px;
            font-weight: 600;
            color: #000000;
            text-align: center;
        }

        .data-check-content {
            width: 1194px;
            background: #FFFFFF;

            &-header {
                display: flex;
                justify-content: space-between;
                height: 44px;
                line-height: 44px;
                box-shadow: 0px 1px 0px 0px #CED3DD;

                .plan-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333333;
                    margin-left: 24px;
                }
                .title-box{
                    display: flex;
                    margin-left: 10px;
                    h5 {
                        font-size: 16px;
                        font-weight: 600;
                        color: #333333;
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

                .plan-time {
                    font-size: 14px;
                    font-weight: 400;
                    color: #999999;
                    margin-right: 10px;
                }
            }

            &-table {
                padding: 0 18px 40px;

                .label-span {
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                }
            }
        }

        ::v-deep .el-table__footer {
            background-color: #fff;

            td {
                background-color: #fff;
            }

            .el-table_1_column_3, .el-table_1_column_2 {
                color: #930CEA;
                cursor: pointer;
                font-weight: 500;
            }
        }
        ::v-deep .el-table--border{
            border-bottom: none !important;
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
                line-height: 30px;
            }
        }
        .color-c3c3c3{
            color: #c3c3c3 !important;
        }
        .edit-content {
            .form-box {
                .form-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;

                    label {
                        display: inline-block;
                        width: 224px;
                        font-size: 14px;
                        font-weight: 400;
                        color: #495060;
                        text-align: right;
                    }

                    p {
                        font-size: 12px;
                        font-weight: 400;
                        color: #333333;
                        margin-left: 25px;
                    }

                    span {
                        font-size: 12px;
                        font-weight: 400;
                        color: #495060;
                        margin-left: 5px;
                    }

                    .form-item-wrap {
                        display: flex;
                        align-items: center;
                        margin-left: 25px;

                        ::v-deep .el-input {
                            width: 95px;
                        }

                        .width235 {
                            width: 235px;
                        }

                        span {
                            display: inline-block;
                            width: 45px;
                            height: 30px;
                            line-height: 30px;
                            text-align: center;
                            position: relative;
                            margin: 0;
                            padding: 0;

                            &:after {
                                content: '';
                                width: 20px;
                                height: 1px;
                                background-color: #DCDFE6;
                                position: absolute;
                                top: 15px;
                                left: 10px;
                            }
                        }
                    }

                    .title-box {
                        width: 224px;
                        text-align: right;
                        position: relative;
                        top: -24px;

                        p {
                            font-size: 14px;
                            font-weight: 400;
                            color: #495060;
                            margin-bottom: 5px;
                        }

                        .font14 {
                            font-size: 14px;
                        }

                        .font12 {
                            font-size: 12px;
                        }

                        button {
                            width: 80px;
                            height: 24px;
                            border-radius: 4px;
                            border: 1px solid #930CEA;
                            outline: none;
                            font-size: 12px;
                            font-weight: 500;
                            color: #930CEA;
                            margin-top: 10px;
                        }
                    }

                    .input-box {
                        margin-left: 25px;

                        .input-item {
                            display: flex;
                            align-items: center;
                            margin-bottom: 10px;

                            .switch-box {
                                display: flex;

                                span {
                                    display: inline-block;
                                    width: 40px;
                                    height: 24px;
                                    line-height: 24px;
                                    font-size: 12px;
                                    font-weight: 400;
                                    color: #495060;
                                    border: 1px solid #DDDEE1;
                                    text-align: center;
                                    margin: 0;
                                    padding: 0;
                                    border-radius: 4px 0px 0px 4px;
                                    cursor: pointer;

                                    &:last-child {
                                        border-left: none;
                                        border-radius: 0px 4px 4px 0px;
                                    }
                                }

                                .active {
                                    color: #930CEA;
                                    border-color: #930CEA;
                                }
                            }

                            .width100 {
                                width: 100px;
                            }
                        }

                        .input-box-content {
                            margin-left: 20px;

                            ::v-deep .el-input-number {
                                width: 100px;
                            }
                        }
                    }
                }
            }
        }
        .generation-uls{
            width: 215px;
            position: relative;
            left: -10px;
            li{
                border-top: 1px solid #DDDEE1;
                padding-left: 10px;
                padding-top: 10px;
                padding-bottom: 10px;
                &:first-child{
                    border: none;
                }
            }
        }
        .point-uls{
            width: 219px;
            li{
                text-align: center;
                padding-left: 0;
                padding-top: 10px;
                padding-bottom: 10px;
            }
        }
        .width-152{
            width: 152px;
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
                cursor: pointer;
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
            .width-220{
                width: 220px;
            }
            .width-153{
                width: 153px;
            }
            .width-183{
                width: 183px;
            }
            .width-203{
                width: 203px;
            }
            .width-204{
                width: 204px;
            }
            .width-215{
                width: 215px;
            }
            .width-120{
                width: 120px;
            }
            .width-214{
                width: 214px;
            }
            .width-219{
                width: 219px;
            }
            .width-160{
                width: 160px;
            }
            .width-158{
                width: 158px;
            }
            .width-109{
                width: 109px;
            }
            .width-170{
                width: 170px;
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
   .data-check-wrap .el-table .padding  td{
            padding-top: 10px;
            padding-bottom: 10px;
    }
</style>
