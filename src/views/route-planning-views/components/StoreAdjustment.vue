<!--门店调整-->
<template>
    <div class="store-edit-wrap" v-show="storeShow" :style="{top: topVal, left: leftVal}">
        <div class="info_event" id="addPoint" v-show="addPointShow">
            <span @click="openDialogVisible(storeId,storeObj.storeNo,storeObj.storeName)"><img src="@assets/img/add.png" alt=""></span><span>加入到路线</span>
        </div>
        <div class="info_event" id="dlePoint" v-show="dlePointShow">
            <span @click="deleteStore(storeId)"><img src="@assets/img/delete.png"></span><span>从路线中删除</span>
        </div>
        <el-dialog title="加入到路线" :visible.sync="dialogVisible" width="438px" :append-to-body="true">
            <el-row v-if="showArea">
                <el-col class="line40">*所属岗位、区域：</el-col>
                <el-col>
                    <el-cascader
                            v-model="precinctNo"
                            :options="options"
                            :props="propsOption"
                            class="smart_cascader_deep"
                    />
                </el-col>
            </el-row>
            <el-row>
                <el-col>*拜访频次：</el-col>
                <el-col>
                    <el-select v-model="visitRate" placeholder="请选择" class="selectInput smart_select_deep">
                        <el-option label="一周一访" value="1"/>
                        <el-option label="一周二访" value="2"/>
                        <el-option label="一周三访" value="3"/>
                    </el-select>
<!--                    <span style="display: inline-block; width: 30px; text-align: center;">次</span>-->
                </el-col>
            </el-row>
            <el-row>
                <el-col>*所属服务日：</el-col>
                <el-col>
                    <el-select v-model="visitWeekDay" placeholder="请选择" multiple :multiple-limit="Number(visitRate)"
                               class="selectInput smart_select_deep">
                        <el-option value="1" label="周一">周一</el-option>
                        <el-option value="2" label="周二">周二</el-option>
                        <el-option value="3" label="周三">周三</el-option>
                        <el-option value="4" label="周四">周四</el-option>
                        <el-option value="5" label="周五">周五</el-option>
                        <el-option value="6" label="周六">周六</el-option>
                        <el-option value="7" label="周日">周日</el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col>*拜访周：</el-col>
                <el-col>
                    <el-select v-model="visitWeek" placeholder="请选择" multiple class="selectInput smart_select_deep">
                        <el-option value="1" label="第一周">第一周</el-option>
                        <el-option value="2" label="第二周">第二周</el-option>
                        <el-option value="3" label="第三周">第三周</el-option>
                        <el-option value="4" label="第四周">第四周</el-option>
                    </el-select>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
			<span @click="dialogVisible = false">取 消</span>
			<span type="primary" @click="subEdit">保 存</span>
		</span>
        </el-dialog>
    </div>
</template>

<script>
    import ROUTE_PLANNING_API from '@api/route/index'
    import {mapGetters} from 'vuex'
    import {eventBus} from '@/util/eventBut.js'

    export default {
        props: ['AMap', 'editStoreLng', 'programId', 'whetherStoreEdit', 'openjobId'],
        computed: {
            ...mapGetters('routerPlanning', [
                'mapViewId',
                'jobLayer',
                'updateNoPlanStore',
                'nowPostId'
            ])
        },
        data() {
            return {
                storeKey: new Date().getTime(),
                storeShow: true,
                addPointShow: false,
                dlePointShow: false,
                dialogVisible: false,
                visitWeek: '',
                visitWeekDay: '',
                visitRate: '',
                precinctNo: '', // 片区编号
                storeType: '',
                options: [],
                Lanlat: '',
                offset: {
                    x: -20,
                    y: 20
                },
                topVal: 0,
                leftVal: 0,
                propsOption: {
                    value: 'areaId',
                    label: 'areaName',
                    children: 'areaList',
                },
                storeId: '',
                areaId: '',
                roundPointLayer: '',
                storeObj: {
                    storeNo: '',
                    storeName: ''
                },
                showArea:true
            };
        },
        watch: {
            whetherStoreEdit() {
                if (!this.whetherStoreEdit) {
                    this.storeShow = false
                    this.storeShow = false
                }
            },
            updateNoPlanStore() {
                let legendJob = this.jobLayer
                if (legendJob.includes('未计划')) {
                    this.getNoPlanStore()
                } else {
                    this.clearNoPlanStore()
                }
            }
        },
        methods: {
            hide() {
                this.storeShow = false
            },
            // 弹层 显隐控制
            windowCtr(storeId, nowPosition, type, storeData, Dottype) {
                if(Dottype==='noService') {
                    this.showArea = false
                } else {
                    this.showArea = true
                }
                let _this = this
                _this.storeId = storeId
                _this.storeShow = true
                if (type === 'delete') {
                    _this.addPointShow = false
                    _this.dlePointShow = true
                } else {
                    _this.addPointShow = true
                    _this.dlePointShow = false
                    _this.storeObj = storeData
                    _this.storeObj.storeName = storeData.storeName
                    _this.storeObj.storeNo = storeData.storeCode
                    _this.getStoreArea()
                }
                _this.storeKey = new Date().getTime()
                if (storeId) {
                    _this.Lanlat = _this.editStoreLng

                    _this.topVal = `${(nowPosition.y + _this.offset.y).toFixed(0)}px`
                    _this.leftVal = `${(nowPosition.x + _this.offset.x).toFixed(0)}px`

                    _this.mapMove()
                }
            },
            mapMove() {
                let _this = this
                if (!_this.Lanlat) {
                    return
                }
                _this.AMap.on('mapmove', () => {
                    let nowPosition = _this.AMap.lngLatToContainer([_this.Lanlat.lng, _this.Lanlat.lat])

                    _this.topVal = (nowPosition.y + _this.offset.y) + 'px'
                    _this.leftVal = (nowPosition.x + _this.offset.x) + 'px'

                })
            },
            openDialogVisible(storeId,storeNo,storeName) {
                this.dialogVisible = true
                this.visitWeek = ''
                this.visitWeekDay = ''
                this.visitRate = '1'
                this.precinctNo = ''
                this.storeId = storeId
                this.storeObj.storeNo = storeNo
                this.storeObj.storeName = storeName

            },
            // 获取所属 岗位区域
            async getStoreArea() {
                let result = await ROUTE_PLANNING_API.get_route_position({isOpen: false, programId: this.mapViewId})
                if (result.code === '200') {
                    if (result.data && result.data.length > 0) {
                        for (let item of result.data) {
                            item['areaName'] = item.jobName
                            item['areaId'] = item.jobId
                            for(let childItem of item.areaList) {
                                const newareaName = childItem.areaName?childItem.areaName:''
                                const newsaleName = childItem.saleName?('('+childItem.saleName+')'):''
                                childItem.areaName = newareaName + newsaleName

                            }
                        }
                    }
                    this.options = result.data
                }
            },
            moseLeaveStore() {
                this.dialogVisible = false
                this.storeShow = false
            },
            // 保存修改服务日
            subEdit() {
                if(this.showArea){
                    this.getaddRouteStore()
                } else {
                    this.getAddNoservice()
                }
            },
            // 未计划的点加入到路线
            getaddRouteStore(){
                ROUTE_PLANNING_API.add_route_store({
                    "prePlanNo": this.programId,
                    "precinctNo": this.precinctNo[this.precinctNo.length - 1],
                    "storeId": this.storeId,
                    "visitRate": this.visitRate,
                    "visitWeek": this.visitWeek.join(','),
                    "visitWeekDay": this.visitWeekDay.join(','),
                    "storeNo":  this.storeObj.storeNo,
                    "storeName": this.storeObj.storeName
                })
                    .then(res => {
                        if (res.code === '200') {
                            this.dialogVisible = false
                            this.storeShow = false
                            if (this.jobLayer.includes('未计划')) {
                                this.getNoPlanStore()
                            }
                            eventBus.$emit('handle-node-click','调整点位所属区域')
                        }
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            // 无服务日的点加入到路线
            getAddNoservice(){
                ROUTE_PLANNING_API.get_insert_noday({
                    "prePlanNo": this.programId,
                    "precinctNo": this.storeObj.areaId,
                    "salesTypeCode": this.nowPostId,
                    "storeId": this.storeId,
                    "storeName": this.storeObj.storeName,
                    "storeNo":  this.storeObj.storeCode,
                    "visitRate": this.visitRate,
                    "visitWeek": this.visitWeek.join(','),
                    "visitWeekDay": this.visitWeekDay.join(',')
                })
                    .then(res => {
                        if (res.code === '200') {
                            this.$message({ message: res.message, type: 'success' })
                            this.dialogVisible = false
                            this.storeShow = false
                            eventBus.$emit('handle-node-click',this.storeObj.areaId)
                        }
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            // 从路线中移除
            deleteStore(storeId) {
                ROUTE_PLANNING_API.delete_route_store({
                    prePlanNo: this.mapViewId ? this.mapViewId : this.$route.query.planId,
                    storeId: storeId
                })
                    .then(res => {
                        if (res.code === '200') {
                            this.$message({
                                message: '移除成功',
                                type: 'success'
                            })
                            this.storeShow = false
                            this.storeShow = false
                            if (this.jobLayer.includes('未计划')) {
                                this.getNoPlanStore()
                            }
                            eventBus.$emit('handle-node-click', this.areaId)
                        }
                    })
                    .catch(err => console.error('门店移除失败', err))
            },
            // 获取未计划门店
            getNoPlanStore() {
                ROUTE_PLANNING_API.get_no_plan_store({
                    programId: this.programId,
                    isLoading: false,
                    salesTypeCode: this.nowPostId
                }).then(res => {
                    if (res.code === '200') {
                        let pointData = this.dataDeal(res.data)
                        this.clearNoPlanStore()
                        if (pointData) {
                            // 存入未计划的店到批量选点
                            this.$store.commit('routerPlanning/SET_POINT_NEEDDATA', {
                                id: this.nowPostId,
                                value: pointData
                            })
                            this.drawNoPlanStore(pointData)
                        }else{
                            this.$message('无未计划门店');
                        }
                    }
                })
            },
            // 数据处理
            dataDeal(data) {
                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        let item = data[i]
                        if (item.storeLat && item.storeLng) {
                            item['center'] = [item.storeLng, item.storeLat]
                            item['fillColor'] = '#999999'
                            item['strokeOpacity'] = 1
                            item['strokeWeight'] = 2
                            item['Radius'] = 8
                        }
                    }
                    return data
                } else {
                    return ''
                }
            },
            moveEnter() {
                let _this = this
                for (let item of this.roundPointLayer) {
                    item.on('mouseover', function (e) {
                        if (!_this.whetherStoreEdit) {
                            return
                        }
                        let storeId = e.target.w.extData.storeId
                        _this.areaId = e.target.w.extData.areaId
                        _this.storeId = storeId
                        let nowPosition = e.pixel
                        _this.windowCtr(storeId, nowPosition, 'add',e.target.w.extData)
                    })
                    // 查看门店详情
                    item.on('click', function (e) {
                        _this.$parent.openNoPlanStoreDetail(e.target.w.extData, e.lnglat)
                    })
                }
            },
            // 绘制未计划门店
            async drawNoPlanStore(data) {
                this.roundPointLayer = await this.$parent.drawNoPlanStore(data)
                if (this.roundPointLayer) {
                    this.moveEnter()
                }
            },
            // 清除绘制未计划门店
            clearNoPlanStore() {
                if (this.roundPointLayer && this.roundPointLayer.length > 0) {
                    for (let item of this.roundPointLayer) {
                        this.AMap.remove(item)
                    }
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    ::v-deep .el-dialog {
        background-color: #0A2757;

        .el-dialog__header {
            padding: 0;
            height: 34px;
            line-height: 34px;

            .el-dialog__title {
                color: #FFFFFF;
                font-size: 14px;
                padding-left: 10px;
                background-color: #0A2757;
            }

            .el-dialog__headerbtn {
                top: 0;
            }
        }

        .el-dialog__body {
            padding: 4px 0px;
        }

        .el-dialog__footer {
            padding: 10px;

            .dialog-footer {
                width: 100%;

                span {
                    font-size: 12px;
                    color: #FFFFFF;
                    width: 83px;
                    height: 24px;
                    line-height: 24px;
                    display: inline-block;
                    text-align: center;
                    cursor: pointer;

                    &:last-child {
                        background-color: #930CEA;
                        border-radius: 4px;
                    }
                }
            }
        }
    }

    ::v-deep .el-row {
        display: flex;
        background-color: #133773;

        &:first-child {
            padding-top: 18px;
        }

        &:last-child {
            padding-bottom: 18px;
        }

        .el-col {
            color: #FFFFFF;
            font-size: 13px;
            padding: 5px 0px;

            &:first-child {
                width: 200px;
                text-align: right;
                margin-right: 5px;
            }

            .el-input__inner {
                height: 24px;
            }

            .el-input__icon {
                line-height: 24px;
            }
        }
    }

    .line40 {
        line-height: 40px;
    }

    .store-edit-wrap {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 999;
    }

    .info_event {
        width: 125px;
        height: 30px;
        overflow: hidden;

        span {
            display: inline-block;
            float: left;
            color: #fff;
            line-height: 30px;
            text-align: center;

            &:first-child {
                width: 30px;
                height: 30px;
                background: rgba(248, 248, 248, .5);
                border-radius: 2px 0px 0px 2px;

                img {
                    display: inline-block;
                    width: 20px;
                    cursor: pointer;
                }
            }

            &:last-child {
                width: 95px;
                height: 31px;
                background: rgba(255, 255, 255, .8);
                border-radius: 0px 2px 2px 0px;
                font-size: 13px;
                font-weight: 400;
                color: rgba(73, 80, 96, 1);
            }
        }
    }
</style>
