<!--客户数-->
<template>
    <div class="client-wrap" @click.self="handleClose">
        <div class="dialog">
            <div class="dialog-header">
                <p>客户数详情
                    <span class="tipsbox">
                        <el-tooltip placement="bottom-start">
                            <div slot="content">
                                <span>
                                1.可规划客户：进入到规划中的门店。<br/>
                                2.不参与规划客户：不参与此次规划的门店，用户可以将门店手动加入规划或从规划列表中移出。<br/>
                                3.异常数据：<br/>
                                     (1) 客户类型为空：在师傅通同步到系统的数据中，门店没有客户类型，导致此类门店无法进入路线规划。<br/>
                                     (2) 经纬度为空：门店没有经纬度数据，导致此类门店无法进入路线规划。<br/>
                                     (3) 服务关系未配置：在路线规划的全局配置页面，没有配置相应业代类型的服务关系，导致此类业代类型对应的门店无法进入路线规划。<br/>
                                     (4) 拜访频次与时长未配置：在路线规划的全局配置页面，没有配置相应门店类型的拜访频次与时在店时长，导致此类门店无法进入路线规划。<br/>
                                     (5) 跨组织业代拜访门店：在师傅通同步到系统的数据中，某个组织的门店的业代姓名为空或不属于该组织，导致此类门店无法进入路线规划。<br/>
                                </span>
                            </div>
                            <svg-icon icon-class="wenhao"/>
                        </el-tooltip>
                    </span>
                </p>
                <span @click="handleClose">
                 <svg t="1597114981779" class="icon" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="2084" width="24" height="24"><path
                         d="M519.02036023 459.47959989L221.8941505 162.35411435a37.07885742 37.07885742 0 1 0-52.45354772 52.40502656l297.12476134 297.15010821L169.44060278 809.05863314a37.07885742 37.07885742 0 1 0 52.42964924 52.42892505l297.15010821-297.12476136 297.15010822 297.12476136a37.07885742 37.07885742 0 1 0 52.42892504-52.40430237l-297.12476135-297.1740067 297.12476135-297.12548553a37.07885742 37.07885742 0 1 0-52.42892504-52.42964924L519.04498291 459.47959989z"
                         p-id="2085" fill="#495060"></path></svg>
                </span>
            </div>
            <div class="dialog-content">
                <div class="dialog-tabs">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane :label="`可规划客户(${staticsNums.activeNums})`" name="active"/>
                        <el-tab-pane :label="`不参与规划客户(${staticsNums.invalidNums})`" name="invalid"/>
                        <el-tab-pane :label="`异常数据(${staticsNums.unusualNum})`" name="unusual"/>
                    </el-tabs>
                    <el-button size="mini" @click="exportExcel">导出</el-button>
                </div>
                <!--筛选条件-->
                <div class="dialog-from">
                    <div class="from-left">
                        <el-form :inline="true" :model="formInline" class="demo-form-inline" :key="formKey">
                            <el-row :gutter="20">
                                <el-form-item label="客户编码">
                                    <el-input v-model="formInline.customerCode" placeholder="请输入内容"
                                              clearable></el-input>
                                </el-form-item>
                                <el-form-item label="客户名称">
                                    <el-input v-model="formInline.customerName" placeholder="请输入内容"
                                              clearable></el-input>
                                </el-form-item>
                                <el-form-item label="客户类型">
                                    <el-select v-model="formInline.customerType" filterable placeholder="请选择" clearable>
                                        <el-option
                                                v-for="item in filterData(storeTypeOptions)"
                                                :key="item.code"
                                                :label="item.codeName"
                                                :value="item.code">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="客户级别">
                                    <el-select v-model="formInline.customerLevel" filterable placeholder="请选择"
                                               clearable
                                    >
                                        <el-option
                                                v-for="item in filterData(storeLevelOption)"
                                                :key="item.code"
                                                :label="item.codeName"
                                                :value="item.code">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-row>
                            <el-row :gutter="20">
                                <el-form-item label="业代类型">
                                    <el-select v-model="formInline.agentType" filterable placeholder="请选择" clearable>
                                        <el-option
                                                v-for="item in filterData(agentTypeList)"
                                                :key="item.code"
                                                :label="item.codeName"
                                                :value="item.code">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="客户经理">
                                    <el-select v-model="formInline.accountManager" filterable placeholder="请选择"
                                               clearable>
                                        <el-option
                                                v-for="item in filterData(accountManagerList)"
                                                :key="item.code"
                                                :label="item.codeName"
                                                :value="item.code">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="详细地址">
                                    <el-input v-model="formInline.detailedAddress" placeholder="请输入内容"
                                              clearable></el-input>
                                </el-form-item>
                                <el-form-item label="异常数据类型" v-if="activeName === 'unusual'">
                                    <el-select v-model="formInline.unusualType" filterable placeholder="请选择" clearable>
                                        <el-option
                                                v-for="item in unusualOptions"
                                                :key="item.code"
                                                :label="item.codeName"
                                                :value="item.code">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-row>
                        </el-form>
                    </div>
                    <div class="from-right">
                        <el-button type="primary" @click="InquireStore">查询</el-button>
                        <el-button @click="reseverForm">重置</el-button>
                    </div>
                </div>
                <!--移除规划-->
                <div v-if="edit && activeName !== 'unusual'" style="padding: 10px 20px" @click="changeStoreStatus">
                    <el-button>{{activeName === 'active' ? '移除规划' : '移入规划'}}</el-button>
                </div>
                <!--表格-->
                <div class="dialog-table">
                    <el-table
                            v-loading="loading"
                            :data="tableData"
                            :key="tableKey"
                            border
                            ref="multipleTable"
                            height="310"
                            @selection-change="handleSelectionChange"
                            tooltip-effect="dark"
                            style="width: 100%">
                        <el-table-column
                                v-if="edit"
                                type="selection"
                                width="48"/>
                        <el-table-column
                                prop="customerCode"
                                align="center"
                                label="客户编码"/>
                        <el-table-column
                                prop="customerName"
                                align="center"
                                label="客户名称"/>
                        <el-table-column
                                prop="customerType"
                                align="center"
                                label="客户类型"/>
                        <el-table-column
                                v-if="activeName === 'unusual'"
                                prop="storeType"
                                align="center"
                                label="异常数据类型"/>
                        <el-table-column
                                prop="cooperationStatus"
                                align="center"
                                label="合作状态">
                            <template slot-scope="scope">
                                {{scope.row.cooperationStatus}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="visitFrequency"
                                align="center"
                                label="拜访频次"/>
                        <el-table-column
                                prop="gradeLabel"
                                align="center"
                                label="等级标签"/>
                        <el-table-column
                                prop="agentType"
                                align="center"
                                label="业代类型"/>
                        <el-table-column
                                prop="accountManager"
                                align="center"
                                label="客户经理"/>
                        <el-table-column
                                prop="customerLevel"
                                align="center"
                                label="客户级别">
                            <template slot-scope="scope">
                                {{scope.row.customerLevel}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="agencyName"
                                align="center"
                                label="经销商"/>
                        <el-table-column
                                prop="detailedAddress"
                                align="center"
                                label="详细地址"/>
                    </el-table>
                </div>
                <!--分页-->
                <div class="dialog-footer" :key="pageKey">
                    <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :page-size="pageSize"
                            :page-sizes="[10, 50, 100, 200, 300, 400]"
                            :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ROUTE_PLANNING_API from '@api/route/index'
    import {mapGetters} from 'vuex'

    export default {
        name: 'clientNums',
        props: ['closeDialog', 'edit', 'draftId'],
        data() {
            return {
                activeName: 'active',
                formInline: {
                    accountManager: '', // 客户经理
                    agentType: '', // 业代类型
                    customerCode: '', // 客户编码
                    customerLevel: '',// 客户级别
                    customerName: '',// 客户名称
                    customerType: '', // 客户类型
                    detailedAddress: '', // 详细地址
                    planId: '', // 计划id
                    unusualType: ''
                },
                tableData: [],
                packStatus: false,
                currentPage: 1,
                pageSize: 10,
                total: 0,
                staticsNums: {
                    activeNums: 0,
                    invalidNums: 0,
                    unusualNum: 0
                },
                unusualOptions: [
                    {
                        value: 'b',
                        label: '客户类型为空'
                    },
                    {
                        value: 'a',
                        label: '经纬度为空'
                    },
                    {
                        value: 'c',
                        label: '服务关系未配置'
                    },
                    {
                        value: 'd',
                        label: '拜访频次与时长未配置'
                    },
                    {
                        value: 'e',
                        label: '跨组织业代拜访门店'
                    }
                ],
                loading: false,
                formKey: new Date().getTime(),
                pageKey: new Date().getTime(),
                yetChooseStore: '',
                storeTypeOptions: [], // 客户类型
                storeLevelOption: [], // 客户级别
                agentTypeList: [], // 业代类型
                accountManagerList: [], // 客户经理
                tableKey: new Date().getTime()
            }
        },
        computed: {
            ...mapGetters('routerPlanning', [
                'precincts',
                'lineBuilding',
                'visitOrgId',
            ]),
        },
        methods: {
            defaultOpen() {
                this.currentPage = 1
                this.pageSize = 10
                this.pageKey = new Date().getTime()
                this.getStoreDictionary()
                this.getList()
            },
            // 过滤掉 null的数据
            filterData(val) {
                if (val && val.length > 0) {
                    return val.filter(item => item)
                } else {
                    return []
                }
            },
            // 获取 门店属性 字典数据
            async getStoreDictionary() {
                let _this = this
                let result = await ROUTE_PLANNING_API.clientAttribute({planId: this.draftId})
                if (result.code === '200') {
                    _this.accountManagerList = result.data.accountManagerList
                    _this.agentTypeList = result.data.agentTypeList
                    _this.storeLevelOption = result.data.customerLevelList
                    _this.storeTypeOptions = result.data.customerTypeList
                    _this.unusualOptions = result.data.unusualStoreTypelist
                    _this.formKey = new Date().getTime()
                }
            },
            // 关闭 弹层
            handleClose() {
                this.$emit('closeDialog')
            },
            // 切换 客户（门店） 规划状态
            changeStoreStatus() {
              if (this.dealStore() && this.dealStore().length === 0) {
                this.$message({
                  message: '请勾选门店',
                  type: 'warning'
                })
                return
              }
                this.editStoreStatus({
                    planId: this.draftId,
                    generationMode: this.activeName == 'active' ? 'n' : 'y',
                    storeId: this.dealStore()
                })
            },
            // 获取选中的客户数
            handleSelectionChange(val) {
                this.yetChooseStore = val
            },
            // 处理门店数据
            dealStore() {
                if (!this.yetChooseStore) {
                    return []
                }
                let data = []
                for (let item of this.yetChooseStore) {
                    data.push(item.storeId)
                }
                return data
            },
            // 切换 查看 客户（可规划/不可规划）数据
            handleClick() {
                this.getList()
                this.tableKey = new Date().getTime()
            },
            // 查询列表
            InquireStore() {
                this.getList()
            },
            initForm() {
                this.formInline = {
                    accountManager: '', // 客户经理
                    agentType: '', // 客户经理
                    customerCode: '', // 客户编码
                    customerLevel: '',// 客户级别
                    customerName: '',// 客户名称
                    customerType: '', // 客户类型
                    detailedAddress: '', // 详细地址
                    unusualType: ''
                }
            },
            // 重置
            reseverForm() {
                this.initForm()
                this.currentPage = 1
                this.pageSize = 10
                this.getList()
            },
            // 切换 条数
            handleSizeChange(val) {
                this.pageSize = val
                this.getList()
            },
            // 切换 页码
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
            },
            // 获取 客户数列表
            async getList() {
                let _this = this
                let result = await ROUTE_PLANNING_API.clientDetailList({
                    ..._this.formInline,
                    pageNum: _this.currentPage,
                    pageSize: _this.pageSize,
                    planId: _this.draftId,
                    storeType: (function() {
                        if (_this.activeName == 'active') {
                            return 'y'
                        }
                        if (_this.activeName == 'invalid') {
                            return 'n'
                        }
                        if (_this.activeName == 'unusual') {
                            if(_this.formInline.unusualType){
                                return _this.formInline.unusualType
                            }
                            return ''
                        }
                    }())
                })
                if (result.code === '200') {
                    _this.tableData = result.data.planDataDetailList
                    _this.total = result.extData.total
                    _this.staticsNums.activeNums = result.data.planningNum ? _this.toThousands(result.data.planningNum) : 0
                    _this.staticsNums.invalidNums = result.data.noPlanedNum ? _this.toThousands(result.data.noPlanedNum) : 0
                    _this.staticsNums.unusualNum = result.data.unusualNum ? _this.toThousands(result.data.unusualNum) : 0
                }
            },
            toThousands(num) {
                var result = [ ], counter = 0;
                num = (num || 0).toString().split('');
                for (var i = num.length - 1; i >= 0; i--) {
                    counter++;
                    result.unshift(num[i]);
                    if (!(counter % 3) && i != 0) { result.unshift(','); }
                }
                return result.join('');
            },
            // 修改门店状态
            async editStoreStatus(data) {
                let result = await ROUTE_PLANNING_API.updateStoreStatus(data)
                if (result.code === '200') {
                    this.$message({
                        message: '门店调整成功',
                        type: 'success'
                    })
                    this.reseverForm()
                }
            },
            /**
             * 门店导出
             */
            exportExcel() {
                let _this = this
              this.$message({
                message: '正在导出，请稍后...',
                type: 'success'
              })
                const iframe = document.createElement("iframe")
                iframe.style.display = "none"
                iframe.style.height = 0
                iframe.src = ROUTE_PLANNING_API.downPlanStore({
                    ..._this.formInline,
                    planId: _this.draftId,
                    storeType: (function() {
                        if (_this.activeName == 'active') {
                            return 'y'
                        }
                        if (_this.activeName == 'invalid') {
                            return 'n'
                        }
                        if (_this.activeName == 'unusual') {
                            if(_this.formInline.unusualType){
                                return _this.formInline.unusualType
                            }
                            return ''
                        }
                    }())
                })
                document.body.appendChild(iframe)
                setTimeout(() => {
                    iframe.remove()
                }, 5 * 60 * 1000)
            }
        }
    }
</script>

<style scoped lang="less">
    .diyElementSelect(@val) {
        /deep/ .el-input {
            width: @val;
            /*height: 30px;*/
            line-height: 30px;
            font-size: 12px;
        }
        /deep/ .el-input__inner {
            height: 30px;
            line-height: 30px;
        }
        /deep/ .el-input__icon {
            line-height: 30px;
        }
    }

    .client-wrap {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .dialog {
            width: 1194px;
            min-height: 650px;
            max-height: 100%;
            overflow-y: auto;
            /*position: absolute;*/
            /*top: 50%;*/
            /*left: 50%;*/
            /*margin-left: -597px;*/
            /*margin-top: -325px;*/
            background-color: #ffffff;

            &-header {
                height: 44px;
                background: rgba(238, 238, 238, 1);
                display: flex;
                align-items: center;
                padding: 0 20px;
                justify-content: space-between;
                position: relative;

                p {
                    font-size: 18px;
                    font-weight: 500;
                    color: rgba(73, 80, 96, 1);
                }

                span {
                    display: inline-block;
                    width: 24px;
                }
            }

            &-content {
                .dialog-tabs {
                    padding: 0 20px;
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    /deep/ .el-button {
                        background: #930CEA;
                        color: #fff;
                    }

                    .no-config-store {
                        color: red;
                        background-color: transparent;
                        position: relative;
                        left: -128px;
                    }

                    .abnormal-store {
                        color: red;
                        background-color: transparent;
                        position: relative;
                        left: -228px;
                    }
                }

                /deep/ .el-tabs__header {
                    margin: 0;
                }

                /deep/ .el-tabs__nav-wrap::after {
                    height: 0;
                }

                /deep/ .el-col-6 {
                    height: 40px;
                    line-height: 40px;
                    padding: 0 !important;
                }

                /deep/ .el-col-10 {
                    height: 40px;
                    line-height: 40px;
                    padding: 0 !important;
                }

                /deep/ .el-button {
                    width: 70px;
                    height: 30px;
                    line-height: 30px;
                    padding: 0;
                }

                .dialog-from {
                    /*height: 145px;*/
                    background: #F8F8F8;
                    display: flex;
                    /*align-items: center;*/
                    padding: 10px 20px;
                    border-top: 1px solid #CED3DD;
                    border-bottom: 1px solid #CED3DD;
                    .diyElementSelect(160px);

                    .from-left {
                        width: 1020px;
                    }

                    .from-right {
                        display: flex;
                        align-items: center;
                    }

                }

                .dialog-table {
                    padding: 0 20px;
                }

                .dialog-footer {
                    display: flex;
                    height: 60px;
                    justify-content: flex-end;
                    padding: 20px;
                }
            }
        }
    }
    .tipsbox {
        width: 200px;
    }
    .store-msg {
        width: 595px;
        height: 24px;
        line-height: 24px;
        background: rgba(245, 166, 35, 0.3);
        border-radius: 4px;
        position: absolute;
        top: 0;
        left: 300px;
        font-size: 12px;
        font-weight: 400;
        color: #666666;

        .icon {
            margin-left: 5px;
        }
    }
</style>
