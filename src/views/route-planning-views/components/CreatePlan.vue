<!--创建计划-->
<template>
  <div class="create-wrap">
    <!-- 业代类型 -->
    <div class="header-type">
      <div class="header-type-fixed">{{ queryData.year }}-{{ queryData.month }}{{ queryData.organizeName }}</div>
      <div class="header-type-content">
        <ul ref="headerWrapper">
          <li class="placeholder-195"></li>
          <li v-for="(item, index) of businessType" :key="index+'table'">{{ item.salesTypeName }}</li>
          <li class="placeholder-234" style="width: 243px !important;"></li>
        </ul>
      </div>

      <div class="header-type-fixed-right"></div>
    </div>
    <!-- 选定拜访计划 -->
    <div class="choose-plan-box">
      <div class="choose-plan-box-left fixed-item">
        <h5>选定拜访计划</h5>
      </div>
      <div class="choose-plan-box-content">
        <ul ref="chooseTypeWrapper" id="choose-uls">
          <li class="placeholder-195"></li>
          <li v-for="(item, index) of bindSalesType" :key="'choose'+index">
            <div v-if="item.bindPlanNo"
                 :class="{'bind-type': item.bindPlanNo, 'repeat-type': item.status} ">
                            <span class="repeat-icon" v-if="item.status"> <svg-icon
                                icon-class="icon_warningsmall"/></span>
              {{ item.bindPlanName }}
            </div>
            <span v-else style="line-height: 59px;">未计划</span>
          </li>
          <li class="placeholder-234" style="width: 258px !important;"></li>
        </ul>
      </div>
      <div class="choose-plan-box-right fixed-item">
        <!--   下载 主计划     -->
        <el-button
            v-auth="'lineplan:build:list:main:download'"
            icon="el-icon-download"
            :disabled="downBoolean('main')"
            class="down-btn"
            @click="downPlan(mainPlan.id,'main')"></el-button>
        <!--   对比     -->
        <el-button
            v-auth="'lineplan:build:list:compare'"
            :disabled="downBoolean('main')"
            :class="downBoolean('main')?'uncompar-btn':'comparison-btn'"
            @click="comparisonPlan(mainPlan,'main')">
          <svg-icon
              icon-class="icon_comparison"
              :class="downBoolean('main')?'uncomparison':'comparisonstyle'"
          ></svg-icon>
        </el-button>
        <!--日志 按钮-->
        <el-tooltip v-if="logBtnShow" class="item" effect="dark" content="门店调整日志" placement="top">
          <el-button
              class="log-btn"
              @click="openLogDialog(mainPlan.id, true)">
            <svg-icon
                icon-class="log-svg"
                :class="downBoolean('main')?'uncomparison':'comparisonstyle'"
            ></svg-icon>
          </el-button>
        </el-tooltip>
        <!--计划预览-->
        <el-button
            v-auth="'lineplan:build:list:main:mapshow'"
            class="text-btn text-view"
            :disabled="!viewBoolean()"
            :class="{'no-disable': !viewBoolean()}"
            @click="planView"><span style="margin-bottom: 3px;">计划</span><span>预览</span></el-button>
        <!--提交-->
        <el-button
            v-auth="'lineplan:build:check:createApprove'"
            :class="{'no-disable': !editBoolean}"
            class="text-btn approve-btn disabled-btn text-view"
            :disabled="!editBoolean"
            @click="subApproval" v-html="planApproveStatusText(planApproveStatus) ">
        </el-button>
        <input type="hidden" :value="subBtn">
      </div>
    </div>
    <!-- 拜访计划 列表-->
    <div class="plan-box">
      <div class="plan-content" ref="bodyWrapper">
        <ul>
          <li v-for="(item,index) of planData" :key="'content'+index">
            <div class="lis-item placeholder-195">{{ item.prePlanName }}</div>
            <div v-for="(saleItem, saleIndex) of item.saleList"
                 :key="'saleItem'+ saleIndex"
                 class="lis-item lis-com"
                 :class="{'no_plan': saleItem.isPlan === '0', 'bind_plan': saleItem.isBind === '1'}"
            >
              <span v-if="saleItem.isPlan === '0'">未计划</span>
              <div class="yet-plan" v-else>
                <el-checkbox v-if="saleItem.isBind === '0'"
                             v-model="saleItem.isBind"
                             @change="bindChange($event,saleItem, index, saleIndex)"
                             :true-label="'1'"
                             :false-label="'0'"
                             :disabled="editDisabled(saleItem)"
                />
                <div class="yet-bind" v-else @click="bindChange(0,saleItem, index, saleIndex)">
                  <svg-icon icon-class="icon_gouxuan" class="checkIcon"></svg-icon>
                </div>
              </div>
            </div>
            <div class="lis-item placeholder-234"></div>
          </li>
        </ul>
      </div>
      <div class="plan-table-fixed" ref="leftFixedBodyWrapper" v-mousewheel="handleFixedMousewheel">
        <ul>
          <li v-for="(item,index) of planData" :key="index+ '_' + 'left'"
              :class="{'not-generate': item.areaType === '1' || item.areaType === '10'  ,'failure':item.areaType === '3', 'not-generated': item.areaType === '0'}"
              @click="navToDetail(item)">
            <el-tooltip class="item" effect="dark" :content="item.prePlanName" placement="top-start">
              <span> {{ item.prePlanName|ellipsis(30) }}</span>
            </el-tooltip>
          </li>
        </ul>
      </div>
      <div class="plan-table-fixed-right" ref="rightFixedBodyWrapper" v-mousewheel="handleFixedMousewheel">
        <!--  草稿计划 操作区   -->
        <ul>
          <li v-for="(item,index) of planData" :key="item.prePlanNo +'&' + index">
            <!-- 地图可视化 按钮 -->
            <el-button
                v-auth="'lineplan:build:list:pred:mapshow'"
                @click="openMap(item)"
                :disabled="editControl(item)"
                class="map-btn"
                :class="{'view-disabled': editControl(item)}"
            >
              地图可视化调整
            </el-button>
            <!-- 下载草稿计划 按钮 -->
<!--         需求SCRUM-2471   <el-button-->
<!--                v-auth="'lineplan:build:list:pred:download'"-->
<!--                icon="el-icon-download" class="plan-down"-->
<!--                :disabled="downBoolean('draft', item)"-->
<!--                :class="{'view-disabled': item.areaType === '3' || item.areaType === '10' || item.areaType === '0' || item.areaType === '1'}"-->
<!--                @click="downPlan(item.prePlanNo, 'draft',index)"></el-button>-->
            <!-- 对比 按钮 -->
            <el-button
                v-auth="'lineplan:build:list:compare'"
                :disabled="downBoolean('draft', item)"
                :class="downBoolean('draft', item)?'uncompar-btn':'comparison-btn'"
                @click="comparisonPlan(item,'draft')">
              <svg-icon icon-class="icon_comparison"
                        :class="downBoolean('draft', item)?'uncomparison':'comparisonstyle'"></svg-icon>
            </el-button>
            <!-- 日志 按钮 -->
            <el-button
                v-if="logBtnShow"
                class="log-btn"
                @click="openLogDialog(item.prePlanNo, false)">
              <el-tooltip effect="dark" content="门店调整日志" placement="top">
                <svg-icon icon-class="log-svg"></svg-icon>
              </el-tooltip>
            </el-button>
            <!-- 删除 按钮 -->
            <el-button
                v-auth="'lineplan:build:list:pred:delete'"
                icon="el-icon-delete"
                class="delete-btn"
                :disabled="deletePermit(item)"
                @click="deletePlan(item.prePlanNo, 'openDialog')"></el-button>
          </li>
        </ul>
      </div>
    </div>
    <!-- 阴影效果 -->
    <div class="shadow-left" v-if="scrollPosition !== 'left' && bindSalesType.length > 6"></div>
    <div class="shadow-right" v-if="scrollPosition !== 'right' && bindSalesType.length > 6"></div>
    <!-- 弹层 重复数据 -->
    <el-dialog
        title="注意"
        :visible.sync="dialogVisible"
        width="660px"
    >
      <div class="dialog-content">
        <h5>当前业代类型路线中存在部分客户与拜访计划中其他业代类型的客户重复，请检查计划</h5>
        <el-table
            class="smart_table_light"
            :data="tableData"
            border
            size="small"
            style="width: 100%">
          <el-table-column
              prop="customerId"
              label="客户编码"
              width="180">
          </el-table-column>
          <el-table-column
              prop="customerName"
              label="客户名称"
              width="180">
          </el-table-column>
          <el-table-column
              prop="busPreName"
              label="业代类型">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 弹层 下载 -->
    <el-dialog
        title="下载客户主档和拜访计划"
        :visible.sync="downDialogVisible"
        class="downDialog"
        width="500"
    >
      <div class="down-content">
        <div class="down-content-item">
          <p>请选择要下载的业代类型</p>
          <div class="type-box">
            <div class="type-item" v-for="item in downPlanSales" :key="item.salesTypeCode">
              <el-checkbox v-model="item.checkStatus" :disabled="item.disabled">{{ item.salesTypeName }}</el-checkbox>
            </div>
          </div>
        </div>
        <div class="down-content-type" style="display: none;">
          <p>下载方式</p>
          <div class="down-content-box">
            <ul>
              <li @click="handleChangeType('1')" :class="{'li-active': downType === '1'}">每日计划</li>
              <li @click="handleChangeType('2')" :class="{'li-active': downType === '2'}">周期计划</li>
            </ul>
            <el-date-picker
                v-model="timeRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </div>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="downDialogVisible = false" class="recall-btn"> 取 消</el-button>
        <el-button type="primary" @click="downMethod">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹层 对比 -->
    <el-dialog
        title="对比"
        :visible.sync="mouthVisible"
        width="40%"
        class="compareDialog"
        :append-to-body="true"
        :close-on-click-modal="false"
    >
      <span class="checkplanbox"><p>已选计划</p>{{ nowCheckPlanName }}</span>
      <span class="checkplanbox"><p>实际拜访</p>
                    <el-date-picker
                        v-model="valueMouth"
                        type="month"
                        size="small"
                        format="yyyy-M"
                        value-format='yyyy-M'
                        :picker-options="pickerOptions"
                        placeholder="请选择月份">
                    </el-date-picker>
                </span>
      <span slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="mouthVisible = false"
                    >取 消</el-button
                    >
                    <el-button size="mini" type="primary" @click="getmouthPlan"
                    >确 定</el-button
                    >
                </span>
    </el-dialog>
    <!-- 弹层 日志 -->
    <el-dialog
        :visible.sync="logDialogVisible"
        :lock-scroll="true"
        class="logDialog"
        width="1194px"
        center>
      <div slot="title" class="log-dialog-title">
        <span>门店调整日志</span>
        <svg-icon icon-class="describe-linght" class-name="log-tip"></svg-icon>
        <div class="export-box" @click="downLog">
          <svg-icon icon-class="daochu"></svg-icon>
          导出
        </div>
      </div>
      <div class="log-content">
        <div class="log-content-header">
          <el-form :inline="true" :model="logFormInline" class="demo-form-inline">
            <el-form-item label="门店名称">
              <el-input v-model="logFormInline.storeName" placeholder="请输入门店名称"></el-input>
            </el-form-item>
            <el-form-item label="操作类型">
              <el-select v-model="logFormInline.operationTypeCode" placeholder="请选择">
                <el-option
                    v-for="item in storeOperationType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getStoreLog">查询</el-button>
              <el-button type="danger" @click="resetStoreLog">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="log-content-box">
          <el-table
              :data="logTableData"
              border
              :header-cell-style="{background: '#F8F8F9',color: '#1C2438'}"
              style="width: 100%"
              max-height="500">
            <el-table-column
                prop="storeId"
                label="门店ID"
                align="center"
                width="180">
            </el-table-column>
            <el-table-column
                prop="storeName"
                label="门店名称"
                align="center"
                width="180">
            </el-table-column>
            <el-table-column
                prop="operationType"
                align="center"
                label="操作类型">
            </el-table-column>
            <el-table-column
                prop="modifyBefore"
                align="center"
                label="调整前">
            </el-table-column>
            <el-table-column
                prop="modifyAfter"
                align="center"
                label="调整后">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="log-footer">
        <p>共 {{ logFormInline.total }} 条数据 第 {{ logFormInline.pageNum }} /
          {{ logFormInline.total | computedPage(logFormInline.pageSize) }} 页</p>
        <el-pagination
            background
            layout=" prev, pager, next, sizes"
            :page-sizes="[10,20,30,50,80,100]"
            :current-page.sync="logFormInline.pageNum"
            :page-size="logFormInline.pageSize"
            @size-change="handleSizeChangeLog"
            @current-change="handleCurrentChangeLog"
            :total="logFormInline.total">
        </el-pagination>
      </div>
    </el-dialog>
    <!-- 弹层 确认是否删除 -->
    <el-dialog
        title="提示"
        :visible.sync="deleteDialog"
        width="30%"
    >
      <p class="delete-txt">是否确认要删除该方案？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deletePlan(deletePlanNo, 'delete')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加计划 -->
    <div v-auth="'lineplan:build:list:add'" class="add-plan" @click="backZoning">
      <svg-icon icon-class="jiahao" class-name="add-icons"/>
      <span>添加计划</span>
    </div>
  </div>
</template>

<script>
import {throttle} from 'throttle-debounce';
import Mousewheel from '@/util/directives/mousewheel.js';
import ROUTE_PLANNING_API from "@api/route/index";
import {Authorities} from '@/util/authority'
import {mapGetters} from 'vuex'
import {computedPage} from '@/util/index'

export default {
  name: 'CreatePlan',
  directives: {
    Mousewheel
  },
  data() {
    return {
      checked: true,
      jobPurview: false, // 角色权限 非审批权限者可操作
      businessType: [],
      planData: '',
      scrollPosition: 'left',
      dialogVisible: false,
      tableData: [],
      repeatIntercept: false,  // 门店数据重复之后无法继续绑定
      bindSalesType: [], // 选定拜访计划
      mainPlan: '', // 主计划
      planApproveStatus: '',
      planStatus: '', //  主方案 状态
      editBoolean: false, // 是否可操作
      queryData: '',
      mouthVisible: false, //是否显示月份弹框
      nowCheckPlanName: null, //当前已选择计划名称
      nowCheckPlanId: null, //当前已选择id
      valueMouth: null, //当前选中月份
      comisPlan: null, //进行对比的是否是主计划
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      downDialogVisible: false,
      downPlanParams: '',
      downPlanSales: [],
      timeRange: '',
      downType: '1',
      logDialogVisible: false,
      logFormInline: {    // 日志弹层
        operationTypeCode: '',
        storeName: '',
        pageNum: 1,
        pageSize: 10,
        prePlanNo: '',
        total: 0
      },
      logTableData: [],
      logBtnShow: false,
      deletePlanNo: '', // 要删除方案的编号
      deleteDialog: false, // 删除 提示弹层
      storeOperationType: []   // 门店调整类型
    }
  },
  computed: {
    bodyWrapper() {
      return this.$refs.bodyWrapper;
    },
    ...mapGetters('common', ['currentMessage']),
    subBtn() {
      if (this.bindSalesType && this.bindSalesType.length > 0) {
        console.info('sss')
        return new Date().getTime()
      } else {
        return new Date().getTime()
      }
    }
  },
  watch: {
    // 消息 监听 刷新列表 同步数据状态
    currentMessage() {
      if (this.currentMessage) {
        let currentMessage = JSON.parse(this.currentMessage)
        // 划区 审批 建线
        if (currentMessage.bussinessCode === '102' || currentMessage.bussinessCode === '101' || currentMessage.bussinessCode === '103') {
          this.getStoreType()
          this.getPlanlist()
        }

      }
    }
  },
  mounted() {
    this.queryData = this.$route.query
    this.bindEvents()
    this.getStoreType()
    this.getPlanlist()
    this.getStoreOperationType()
    this.jobPurview = Authorities('lineplan:build:check:createApprove') // 拥有发起审批权限的无法编辑
  },
  filters: {
    ellipsis(value, length) {
      if (!value) return ''
      if (value.length > length) {
        return value.slice(0, length) + '...'
      }
      return value
    },
    computedPage
  },
  destroyed() {
    this.unbindEvents();
  },
  methods: {
    planApproveStatusText(val) {
      if (val) {
        if (val === '0') {
          return '<span class="txt-box">提交</span><span class="txt-box">审批</span>'
        }
        if (val === '1') {
          return '撤回'
        }
        if (val === '2') {
          return '已审批'
        }
        if (val === '3') {
          return '<span class="txt-box">提交</span><span class="txt-box">审批</span>'
        }
        if (val === '4') {
          return '<span class="txt-box">提交</span><span class="txt-box">审批</span>'
        }
      } else {
        return '<span class="txt-box">提交</span><span class="txt-box">审批</span>'
      }
    },
    Authorities,
    editDisabled(saleItem) {
      if (this.jobPurview) {
        if (saleItem.routeStatus !== '2') {
          // 路线 未生成/失败/错误
          return true
        } else {
          if (this.repeatIntercept) {
            // 数据重复 无法继续绑定
            return true
          } else {
            if (this.planApproveStatus === '1' || this.planApproveStatus === '2') {
              return true
            } else {
              return false
            }
          }
        }
      } else {
        return true
      }
    },
    // 绑定 滚动
    bindEvents() {
      this.bodyWrapper.addEventListener('scroll', this.syncPostion, {passive: true});
    },
    // 取消 滚动
    unbindEvents() {
      this.bodyWrapper.removeEventListener('scroll', this.syncPostion, {passive: true});
    },
    // 动态 监听 table 滚动
    syncPostion: throttle(20, function () {
      const {scrollTop, scrollLeft, scrollWidth, offsetWidth} = this.bodyWrapper
      const {leftFixedBodyWrapper, rightFixedBodyWrapper, chooseTypeWrapper, headerWrapper} = this.$refs

      if (headerWrapper) headerWrapper.scrollLeft = scrollLeft;
      if (chooseTypeWrapper) chooseTypeWrapper.scrollLeft = scrollLeft;
      if (leftFixedBodyWrapper) leftFixedBodyWrapper.scrollTop = scrollTop;
      if (rightFixedBodyWrapper) rightFixedBodyWrapper.scrollTop = scrollTop;

      const maxScrollLeftPosition = scrollWidth - offsetWidth - 1;
      if (scrollLeft >= maxScrollLeftPosition) {
        this.scrollPosition = 'right';
      } else if (scrollLeft === 0) {
        this.scrollPosition = 'left';
      } else {
        this.scrollPosition = 'middle';
      }
    }),
    // 滑动 监听
    handleFixedMousewheel(event, data) {
      const bodyWrapper = this.bodyWrapper;
      if (Math.abs(data.spinY) > 0) {
        const currentScrollTop = bodyWrapper.scrollTop;
        if (data.pixelY < 0 && currentScrollTop !== 0) {
          event.preventDefault();
        }
        if (data.pixelY > 0 && bodyWrapper.scrollHeight - bodyWrapper.clientHeight > currentScrollTop) {
          event.preventDefault();
        }
        bodyWrapper.scrollTop += Math.ceil(data.pixelY / 5);
      } else {
        bodyWrapper.scrollLeft += Math.ceil(data.pixelX / 5);
      }
    },
    // 地图可视化操作
    editControl(editItem) {
      if (editItem) {
        if (editItem.areaType !== '2') {
          // 没有成功划区
          return true
        } else {
          if (editItem.saleList && editItem.saleList.length > 0) {
            let salesList = editItem.saleList.filter(item => item.isPlan == '1')
            // 已规划的可以操作
            if (salesList && salesList.length > 0) {
              let bindList = salesList.filter(item => item.isBind === '1')
              // if (bindList && bindList.length > 0 && (this.planApproveStatus === '1' || this.planApproveStatus === '2')) {
              //   return true
              // } else {
              //   return false
              // }
              if (bindList && bindList.length > 0 ) {
                return true
              } else {
                return false
              }

            } else {
              return true
            }

          } else {
            return true
          }
        }

      } else {
        return true
      }
    },
    // 是否允许下载 规则
    downBoolean(type, data) {
      if (type === 'draft') {
        if (data.areaType !== '2') {
          return true
        } else {
          let filterData = data.saleList.filter(item => item.routeStatus === '2')
          if (filterData && filterData.length > 0) {
            return false
          } else {
            return true
          }
        }
      } else {
        let yetBind = this.bindSalesType.filter(item => item.bindPlanNo)
        if (yetBind && yetBind.length > 0) {
          return false
        } else {
          return true
        }
      }
    },
    // 添加计划
    backZoning() {
      if (this.planData.length >= 30) {
        this.$message({
          message: '您建的的计划已超过上限，建议删除部分无效计划',
          type: 'warning'
        })
        return
      }
      const {month, year, organizeName, organizeId, planStatus} = this.$route.query
      let urlSuffix = `month=${month}&year=${year}&organizeName=${organizeName}&organizeId=${organizeId}&planStatus=${planStatus}&create=true`
      this.$router.push(`/route-planning/build-route?${urlSuffix}`)
    },
    // 获取主计划相关
    async getMainInfo() {
      let result = await ROUTE_PLANNING_API.getMainPlan({
        orgId: this.queryData ? this.queryData.organizeId : '',
        yearMonth: this.queryData ? `${this.queryData.year}-${this.queryData.month}` : ''
      })
      if (result.code === '200') {
        this.mainPlan = {
          id: result.data.planNo,
          name: result.data.planName
        }
        this.planApproveStatus = result.data.planApproveStatus  // 当前主计划 审批状态
        this.planStatus = result.data.planStatus  // 当前主计划 状态
        if (result.data.bind) {
          for (let item of this.bindSalesType) {
            for (let bindItem of result.data.bind) {
              if (item.salesTypeCode === bindItem.salesTypeNo) {
                this.$set(item, 'bindPlanNo', bindItem.prePlanNo)
                this.$set(item, 'bindPlanName', bindItem.prePlanName)
              }
            }
          }

        }
        this.editBoolean = this.btnEditMethod()
      }
    },
    // 是否可操作
    btnEditMethod() {
      if (this.planApproveStatus && this.planStatus) {
        if (this.planStatus === '2') {
          // 审批中
          if (this.planApproveStatus === '3') {
            // 审批中 被驳回
            let yetBind = this.bindSalesType.filter(item => item.bindPlanNo)
            if (yetBind.length === 0) {
              return false
            } else {
              return true
            }
          }
          // 撤回
          if (this.planApproveStatus === '4') {
            return true
          }
          if (this.planApproveStatus === '1') {
            return true
          }
          return false
        }
        if (this.planStatus === '3') {
          // 审批通过
          return false
        }
        if (this.planStatus === '1') {
          // 未提交
          let yetBind = this.bindSalesType.filter(item => item.bindPlanNo)
          if (yetBind.length === 0) {
            return false
          } else {
            return true
          }
        }

      } else {
        return false
      }
    },
    // 是否可预览
    viewBoolean() {
      let yetBind = this.bindSalesType.filter(item => item.bindPlanNo)
      if (yetBind.length === 0) {
        return false
      } else {
        return true
      }
    },
    // 计划 地图可视化调整
    openMap(item) {
      this.$store.commit('routerPlanning/SET_MAP_VIEW_ID', item.prePlanNo)
      this.$router.push({path: `/route-planning/plan-preview?planName=${item.prePlanName}&planId=${item.prePlanNo}&edit=true&planAhead=false&precinctsCode=${item.precinctTypeCode}&routeCode=${item.routeTypeCode}`})
    },
    // 查看计划详情
    navToDetail(item) {
      const {organizeId} = this.$route.query
      this.$router.push(`/route-planning/plan-detail/${item.prePlanNo}?planName=${encodeURIComponent(item.prePlanName)}&precinctTypeCode=${item.precinctTypeCode}&organizeId=${organizeId}&buildLineCode=${item.routeTypeCode}`)
    },
    // 主计划 预览
    planView() {
      if (this.mainPlan) {
        this.$router.push({path: `/route-planning/plan-preview?planName=${this.mainPlan.name}&planId=${this.mainPlan.id}&edit=false&planAhead=true&precinctsCode=&routeCode=`})
      }
    },
    // 获取业代类型
    async getStoreType() {
      let result = await ROUTE_PLANNING_API.orgBuspreList({
        orgId: this.queryData ? this.queryData.organizeId : '',
        yearMonth: this.queryData ? `${this.queryData.year}-${this.queryData.month}` : ''
      })
      if (result.code === '200') {
        this.bindSalesType = []
        this.businessType = result.data
        for (let item of result.data) {
          this.bindSalesType.push({
            ...item,
            bindPlanNo: '', // 绑定草稿计划 id
            bindPlanName: '', // 绑定草稿计划 名称
            status: '' // 当前数据 是否重复
          })
        }
      }
      this.getMainInfo()
    },
    // 获取预(草稿)计划
    async getPlanlist() {
      let result = await ROUTE_PLANNING_API.draftPlanList({
        orgId: this.queryData ? this.queryData.organizeId : '',
        yearMonth: this.queryData ? `${this.queryData.year}-${this.queryData.month}` : '',
        isLoading: false
      })
      if (result.code === '200') {
        this.planData = result.data
      }
    },
    // 删除草稿计划
    deletePlan(planNo, type='openDialog') {
      if(type === 'openDialog') {
        this.deleteDialog = true
        this.deletePlanNo = planNo
        return
      }
      ROUTE_PLANNING_API.deleteDraftPlan(planNo)
          .then(res => {
            if (res.code === '200') {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.deleteDialog = false
              this.deletePlanNo = ''
              this.getPlanlist()
            }
          })
          .catch(err => console.log(err))
    },
    // 绑定切换
    bindChange(val, salesItem, index, saleIndex) {
      if (this.planApproveStatus === '1' || this.planApproveStatus == '2') {
        // 审核中 / 已审核
        this.$message({
          message: this.planApproveStatus === '1' ? '方案审核中...' : '当前方案已审核通过，无法再次操作！',
          type: 'warning'
        })
        return
      }
      this.$set(this.planData[index]['saleList'][saleIndex], 'isBind', val.toString())
      let cancelPlanNo
      // 取消其他绑定标示
      for (let i = 0; i < this.planData.length; i++) {
        let planItem = this.planData[i]
        if (i !== index) {
          for (let sItem of planItem.saleList) {
            if (sItem.salesTypeCode == salesItem.salesTypeCode) {
              if (sItem.isBind == '1') {
                cancelPlanNo = planItem.prePlanNo
              }
              this.$set(sItem, 'isBind', '0')
            }
          }
        }
      }
      // 取消绑定
      if (cancelPlanNo) {
        this.bindMianPlan({
          prePlanNo: cancelPlanNo,
          salesType: salesItem.salesTypeCode,
          checkType: '0'
        })
      }
      // 切换主计划 绑定状态
      for (let item of this.bindSalesType) {
        if (item.salesTypeCode === salesItem.salesTypeCode) {
          if (val) {
            item.bindPlanNo = this.planData[index].prePlanNo
            item.bindPlanName = this.planData[index].prePlanName

          } else {
            item.bindPlanNo = ''
            item.bindPlanName = ''
          }
        }
      }
      // 进行绑定
      this.bindMianPlan({
        prePlanNo: this.planData[index].prePlanNo,
        salesType: salesItem.salesTypeCode,
        checkType: val.toString()
      })
      this.editBoolean = this.btnEditMethod()
    },
    // 勾选/取消勾选
    bindMianPlan(options) {
      ROUTE_PLANNING_API.bindMainPlan({
        orgId: this.queryData ? this.queryData.organizeId : '',
        prePlanNo: options.prePlanNo,
        salesType: options.salesType,
        checkType: options.checkType,
        yearMonth: this.queryData ? `${this.queryData.year}-${this.queryData.month}` : '',

      })
          .then(res => {
            if (res.code === '200') {
              this.$message({
                message: options.checkType === '1' ? `已选中该方案作为主计划方案` : `已取消该方案作为主计划方案`,
                type: options.checkType === '1' ? 'success' : 'warning'
              })
              if (res.data) {
                this.tableData = res.data.repeat
                this.repeatIntercept = res.data.repeat && res.data.repeat.length > 0 ? true : false
                this.mainPlan = {
                  id: res.data.planNo,
                  name: res.data.planName
                }
              }
            }
          })
          .catch(err => console.log(err))
    },
    /**
     * 删除 状态 判断
     * 已绑定的预计划无法删除
     * @param saleList
     * @returns {boolean}
     */
    deletePermit(item) {
      const saleList = item.saleList
      if (saleList && saleList.length > 0) {
        const bindPlan = saleList.filter(item => item.isBind === '1')
        if (bindPlan && bindPlan.length > 0) {
          return true
        } else {
          /**
           * 划区生成中，不能删除
           */
          if (item.areaType === '1') {
            return true
          } else {
            return false
          }
        }
      } else {
        if (item.areaType === '1') {
          return true
        } else {
          return false
        }
      }
    },
    // 重复数据弹层
    openRepeatLayer() {
      this.dialogVisible = true
    },
    // 提交审批
    subApproval() {
      if (this.planApproveStatus === '1' && this.planStatus === '2') {
        this.refuseApproval()
        return;
      }
      let yetBind = this.bindSalesType.filter(item => item.bindPlanNo)
      if (yetBind.length === 0) {
        this.$message({
          message: '当前主计划未绑定，请检查',
          type: 'warning'
        })
        return
      }
      ROUTE_PLANNING_API.createApproval({
        orgId: this.queryData ? this.queryData.organizeId : '',
        yearMonth: this.queryData ? `${this.queryData.year}-${this.queryData.month}` : '',
      })
          .then(res => {
            if (res.code === '200') {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              // 步骤 到 审批
              this.$store.commit('routerPlanning/SET_STEP', 'Approve')
              // 页面跳转
              const {month, year, organizeName, organizeId, planStatus} = this.$route.query
              let urlSuffix = `month=${month}&year=${year}&organizeName=${organizeName}&organizeId=${organizeId}&planStatus=${planStatus}`
              this.$router.push({path: `/route-planning/approve?${urlSuffix}`})
            }
          })
    },
    // 拒绝审批
    refuseApproval() {
      ROUTE_PLANNING_API.replyApproval({
        orgId: this.queryData ? this.queryData.organizeId : '',
        yearMonth: this.queryData ? `${this.queryData.year}-${this.queryData.month}` : '',
        isResult: 4
      })
          .then(res => {
            if (res.code === '200') {
              this.$message({
                message: '撤回操作成功',
                type: 'success'
              })
              this.getMainInfo()
            }
          })

    },
    // 下载拜访计划
    downPlan(prePlanNo, type, index) {
      this.downDialogVisible = true
      this.downPlanParams = {
        prePlanNo: prePlanNo,
        type: type
      }
      this.downPlanSales = []
      if (type === 'draft') {
        this.downPlanSales = this.planData[index]['saleList']
        if (this.downPlanSales && this.downPlanSales.length > 0) {
          for (let item of this.downPlanSales) {
            this.$set(item, 'checkStatus', false)
            this.$set(item, 'disabled', true)
            if (item.routeStatus === '2') {
              this.$set(item, 'disabled', false)
            }
          }
        }
      } else {
        if (this.bindSalesType && this.bindSalesType.length > 0) {
          for (let item of this.bindSalesType) {
            this.$set(item, 'checkStatus', false)
            this.$set(item, 'disabled', true)
            if (item.bindPlanNo) {
              this.$set(item, 'disabled', false)
            }
          }
        }
        this.downPlanSales = this.bindSalesType
      }
    },
    downMethod() {
      if (!this.downPlanParams) {
        return
      }
      let chooseSalesCode = []
      for (let item of this.downPlanSales) {
        if (item.checkStatus) {
          chooseSalesCode.push(item.salesTypeCode)
        }
      }
      chooseSalesCode = chooseSalesCode && chooseSalesCode.length > 0 ? chooseSalesCode.join(',') : ''
      this.downVisitData(this.downPlanParams.prePlanNo, this.downPlanParams.type, chooseSalesCode)
      this.downData(this.downPlanParams.prePlanNo, this.downPlanParams.type, chooseSalesCode)
      this.$message({
        showClose: true,
        message: '计划下载中,请稍等...'
      })
      this.downDialogVisible = false
      this.downPlanSales = []
    },
    downVisitData(prePlanNo, type, chooseSalesCode) {
      const iframeVisit = document.createElement("iframe")
      iframeVisit.style.display = "none"
      iframeVisit.style.height = 0
      iframeVisit.src = ROUTE_PLANNING_API.downMainVisitPlan({
        orgId: this.queryData ? this.queryData.organizeId : '',
        endTime: this.queryData ? `${this.queryData.year}-${this.queryData.month}-31` : '',
        startTime: this.queryData ? `${this.queryData.year}-${this.queryData.month}-01` : '',
        prePlanNo: type === 'main' ? '' : prePlanNo,
        salesTypeCodeS: chooseSalesCode
      })
      document.body.appendChild(iframeVisit)
      setTimeout(() => {
        iframeVisit.remove()
      }, 5 * 60 * 1000)
    },
    downData(prePlanNo, type, chooseSalesCode) {
      const iframe = document.createElement("iframe")
      iframe.style.display = "none"
      iframe.style.height = 0
      iframe.src = ROUTE_PLANNING_API.downPlanData({
        orgId: this.queryData ? this.queryData.organizeId : '',
        endTime: this.queryData ? `${this.queryData.year}-${this.queryData.month}-31` : '',
        startTime: this.queryData ? `${this.queryData.year}-${this.queryData.month}-01` : '',
        prePlanNo: type === 'main' ? '' : prePlanNo,
        salesTypeCodeS: chooseSalesCode
      })
      document.body.appendChild(iframe)
      setTimeout(() => {
        iframe.remove()
      }, 5 * 60 * 1000)
    },
    // 对比计划
    comparisonPlan(PlanData, type) {
      if (type === 'draft') {
        this.nowCheckPlanName = PlanData.prePlanName
        this.nowCheckPlanId = PlanData.prePlanNo
        this.comisPlan = false
      } else {
        this.nowCheckPlanName = PlanData.name + ' 主计划'
        this.nowCheckPlanId = PlanData.id
        this.comisPlan = true
      }
      this.mouthVisible = true
    },
    // 确定月份，跳转对比页面
    getmouthPlan() {
      if (this.valueMouth) {
        ROUTE_PLANNING_API.get_all_history({
          orgId: this.queryData.organizeId,
          planMonth: this.valueMouth
        })
            .then(res => {
              if (res.code === '200') {
                this.$message({message: '查询成功', type: 'success'})
                this.$router.push(
                    `/route-planning/comparison-plan?leftPlanId=${
                        this.nowCheckPlanId
                    }&leftPlanName=${encodeURIComponent(
                        this.nowCheckPlanName
                    )}&leftisPlan=${this.comisPlan}&rightPlanId=${
                        res.data.programId
                    }&rightPlanName=${encodeURIComponent(this.valueMouth + '实际拜访')}`
                )
              }
            })
            .catch(err => {
              console.log(err)
            })
      } else {
        this.$message({message: '请先选择对比实际拜访月份', type: 'warning'})
      }
    },
    // 获取 门店 操作类型
    getStoreOperationType() {
      ROUTE_PLANNING_API.getStoreOperationType()
          .then(res => {
            if (res.code === '200') {
              console.log(res.data)
              this.storeOperationType = res.data
            }
          })
    },
    // 开启 日志 弹层
    openLogDialog(prePlanNo, boolean) {
      this.logDialogVisible = true
      this.logFormInline.pageNum = 1
      this.logFormInline.pageSize = 10
      this.logFormInline.prePlanNo = prePlanNo
      this.logFormInline.isPlan = boolean
      this.logFormInline.isExport = false
      this.getStoreLog()
    },
    // 重置
    resetStoreLog() {
      this.logFormInline.storeName = ''
      this.logFormInline.pageNum = 1
      this.logFormInline.pageSize = 10
      this.logFormInline.operationTypeCode = ''
      this.getStoreLog()
    },
    // 获取 门店 操作日志
    getStoreLog() {
      ROUTE_PLANNING_API.getStoreLog({
        ...this.logFormInline,
      })
          .then(res => {
            if (res.code === '200') {
              this.logTableData = res.data.list
              this.logFormInline.total = res.data.total
            }
          })
    },
    // 切换日志 每页条数
    handleSizeChangeLog(val) {
      this.logFormInline.pageSize = val
      this.getStoreLog()
    },
    // 切换日志 每页页码
    handleCurrentChangeLog(val) {
      this.logFormInline.pageNum = val
      this.getStoreLog()
    },
    // 下载 日志
    downLog() {
      const iframeVisit = document.createElement("iframe")
      iframeVisit.style.display = "none"
      iframeVisit.style.height = 0
      iframeVisit.src = ROUTE_PLANNING_API.downStoreLog({
        ...this.logFormInline,
        isExport: true
      })
      document.body.appendChild(iframeVisit)
      setTimeout(() => {
        iframeVisit.remove()
      }, 5 * 60 * 1000)
    }
  }
}
</script>

<style scoped lang="scss">
$boxHeight: calc(100vh - 410px);
$boxWidth: 1160px;
.placeholder-195 {
  width: 195px !important;
  height: 60px;
  visibility: hidden;
}

.placeholder-234 {
  width: 234px !important;
  height: 60px;
  visibility: hidden;
}

.create-wrap {
  width: 1194px;
  margin: 20px auto 0;
  background: #F8F8F9;
  position: relative;

  .header-type {
    width: 1166px;
    padding: 0 14px;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    font-weight: 600;
    color: #666666;
    overflow: hidden;
    position: relative;
    margin-bottom: 10px;

    .header-type-content {
      width: 1160px;

      ul {
        display: flex;
        width: 1160px;
        overflow: hidden;
      }

      li {
        height: 30px;
        flex-shrink: 0;
        width: 110px;
        margin-right: 10px;
        text-align: center;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    &-fixed {
      width: 200px;
      height: 30px;
      position: absolute;
      top: 0;
      left: 11px;
      background-color: #F8F8F9;
    }

    &-fixed-right {
      width: 242px;
      height: 30px;
      position: absolute;
      top: 0;
      right: 20px;
      background-color: #F8F8F9;
    }
  }

  .fixed-item {
    width: 210px;
    height: 80px;
    background: #ffffff;
    border: 1px solid #ededed;
    position: absolute;
    top: 0;
  }

  .choose-plan-box {
    width: 1166px;
    height: 80px;
    position: relative;
    padding: 0 14px;

    &-left {
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
      border-radius: 40px 0px 0px 40px;
      left: 0;

      h5 {
        font-size: 14px;
        font-weight: 600;
        color: #000000;
        text-align: center;
        line-height: 80px;
      }
    }

    &-right {
      width: 257px;
      display: flex;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
      border-radius: 0px 40px 40px 0px;
      right: 0;
      align-items: center;
      padding: 0 10px;

      .down-btn {
        display: inline-block;
        width: 40px;
        height: 40px;
        background: #FAFAFA;
        border-radius: 4px;
        border: 1px solid #DDDDDD;
        text-align: center;
        line-height: 40px;
        padding: 0;
        margin: 0;
      }

      .uncompar-btn {
        display: inline-block;
        line-height: 40px;
        text-align: center;
        font-size: 15px;
        width: 40px;
        height: 40px;
        padding: 0;
        background: #FAFAFA;
        border-radius: 4px;
        border: 1px solid #DDDDDD;
        margin: 0px 10px;
        color: #C0C4CC;
        cursor: not-allowed;
      }

      .comparison-btn {
        font-size: 15px;
        width: 40px;
        height: 40px;
        padding: 0;
        background: #FAFAFA;
        border-radius: 4px;
        border: 1px solid #DDDDDD;
        margin-left: 10px;
        color: #666666;
        cursor: pointer;
      }

      .text-btn {
        width: 81px;
        height: 40px;
        text-align: center;
        background: rgba(147, 12, 234, 0.2);
        border-radius: 4px;
        border: 1px solid #930CEA;
        font-size: 12px;
        font-weight: 500;
        color: #930CEA;
        padding: 0;
      }

      .text-view {
        width: 44px;
        height: 40px;
        background: rgba(147, 12, 234, 0.2);
        border-radius: 4px;
        border: 1px solid #930CEA;

        span {
          display: block;
        }
      }

      .approve-btn {
        display: block;
        width: 52px;
        background: #930CEA;
        border-radius: 4px;
        color: #fff;
      }

      .no-disable {
        background: #CED3DD;
        color: #7A7A7A;
        border-color: #CED3DD;
      }

      .log-btn {
        width: 40px;
        height: 40px;
        padding: 0;
        cursor: pointer;
      }

      .log-svg {
        display: inline-block;
        width: 40px;
        height: 40px;
      }

    }

    &-content {
      display: flex;
      width: $boxWidth;
      height: 82px;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
      align-items: center;

      border-radius: 40px;

      ul {
        display: flex;
        overflow: hidden;
        padding: 3px 0;
      }

      li {
        flex-shrink: 0;
        width: 110px;
        height: 59px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #EDEDED;
        margin-right: 10px;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: #495060;

        .bind-type {
          height: 51px;
          padding: 5px;
          color: #087E42;
          background: #D1F2E1;
          border-radius: 4px;
          border: 1px solid #19BE6B;
          text-align: left;
        }

        .repeat-type {
          padding: 5px;
          background: #FFE7C0;
          border-radius: 4px;
          border: 1px solid #F5A623;
          font-weight: 400;
          color: #946312;
          text-align: left;
          position: relative;
        }

        .repeat-icon {
          position: absolute;
          top: -6px;
          right: -4px;
          cursor: pointer;
        }

      }

      .placeholder-234 {
        @extend .placeholder-234;
      }

      .placeholder-195 {
        @extend .placeholder-195;
      }
    }
  }

  .plan-box {
    height: 425px;
    width: 1166px;
    position: relative;
    padding: 0 14px;
    margin-top: 15px;

    .plan-content {
      width: $boxWidth;
      height: $boxHeight;
      overflow: auto;

      ul {
        li {
          display: flex;
          margin-bottom: 15px;

          &:last-child {
            margin-bottom: 0;
          }

          .lis-item {
            flex-shrink: 0;
            width: 110px;
            height: 59px;
            background: #FFFFFF;
            border: 1px solid #EDEDED;
            margin-right: 10px;

            ::v-deep .is-disabled {
              .el-checkbox__inner {
                width: 25px;
                height: 25px;
                background-color: #EDEDED;
              }
            }

            ::v-deep .el-checkbox__inner {
              width: 25px;
              height: 25px;
            }

            .checkIcon {
              width: 25px;
              height: 25px;
              position: relative;
              top: 6px;
            }
          }

          .lis-com {
            text-align: center;
            line-height: 58px;

            .yet-plan {
              cursor: pointer;
            }

            .yet-bind {
              width: 100%;
              height: 100%;
            }

          }

          .no_plan {
            background: #F4F4F4;
            border: 1px solid #EDEDED;
            font-size: 14px;
            font-weight: 400;
            color: #999999;

          }

          .bind_plan {
            background: #D1F2E1;
            border: 1px solid #19BE6B;
          }

          .placeholder-234 {
            @extend .placeholder-234;
          }

          .placeholder-195 {
            @extend .placeholder-195;
          }
        }
      }
    }

    .plan-table-fixed {
      width: 200px;
      height: $boxHeight;
      position: absolute;
      top: 0;
      left: 11px;
      z-index: 10;
      overflow-x: hidden;
      overflow-y: hidden;
      background: #F8F8F9;

      ul {
        li {
          width: 168px;
          height: 43px;
          background: #FFFFFF;
          border: 1px solid #EDEDED;
          padding: 8px 17px;
          font-size: 14px;
          font-weight: 400;
          color: #000000;
          margin-bottom: 15px;
          cursor: pointer;

          &:last-child {
            margin-bottom: 0;
          }

          &:hover {
            color: #930CEA;
          }
        }

        /*未生成*/
        .not-generate {
          position: relative;
          padding-left: 30px;
          background: #F4F4F4;
          color: #999999;

          &:before {
            width: 24px;
            height: 59px;
            line-height: 27px;
            text-align: center;
            content: '生成中';
            background: #BFBFBF;
            border: 1px solid #EDEDED;
            position: absolute;
            top: 0;
            left: 0;
            -webkit-writing-mode: vertical-rl;
            writing-mode: vertical-rl;
            font-size: 12px;
            font-weight: 400;
            color: #FFFFFF;
          }
        }

        /*失败*/
        .failure {
          position: relative;
          padding-left: 30px;
          background: #F4F4F4;
          color: #999999;

          &:before {
            width: 24px;
            height: 59px;
            line-height: 27px;
            text-align: center;
            content: '失败';
            background: #BFBFBF;
            border: 1px solid #EDEDED;
            position: absolute;
            top: 0;
            left: 0;
            -webkit-writing-mode: vertical-rl;
            writing-mode: vertical-rl;
            font-size: 12px;
            font-weight: 400;
            color: #FFFFFF;
          }
        }

        /*未生成*/
        .not-generated {
          position: relative;
          padding-left: 30px;
          background: #F4F4F4;
          color: #999999;

          &:before {
            width: 24px;
            height: 59px;
            line-height: 27px;
            text-align: center;
            content: '未生成';
            background: #BFBFBF;
            border: 1px solid #EDEDED;
            position: absolute;
            top: 0;
            left: 0;
            -webkit-writing-mode: vertical-rl;
            writing-mode: vertical-rl;
            font-size: 12px;
            font-weight: 400;
            color: #FFFFFF;
          }
        }
      }
    }

    .plan-table-fixed-right {
      width: 259px;
      height: $boxHeight;
      background: #F8F8F9;
      position: absolute;
      top: 0;
      right: 20px;
      z-index: 10;
      overflow-x: hidden;
      overflow-y: hidden;

      ul {
        li {
          height: 59px;
          background: #FFFFFF;
          border-radius: 4px;
          border: 1px solid #EDEDED;
          margin-bottom: 15px;
          cursor: pointer;

          &:last-child {
            margin-bottom: 0;
          }

          &:hover {
            color: #930CEA;
          }

          button {
            border: none;
            border-radius: 0;
            padding: 0;
            margin: 0;

            &:hover {
              border-top: none;
              border-left: none;
              border-bottom: none;
              border-radius: 0;
              border-right: 1px solid #EDEDED;
            }
          }

          .map-btn {
            //width: 105px;
            //width: 140px;
            width: 179px;
            height: 59px;
            border-right: 1px solid #EDEDED;
            color: #A634EF;
            text-decoration: underline;
            font-size: 12px;

            span {
              font-size: 12px;
            }
          }

          .plan-down {
            width: 38px;
            height: 59px;
            border-right: 1px solid #EDEDED;
          }

          .comparison-btn {
            width: 38px;
            height: 59px;
            border-right: 1px solid #EDEDED;
            display: inline-block;
            text-align: center;
            cursor: pointer;

            &:hover {
              background-color: rgba(147, 12, 234, 0.1);
              border-right: 1px solid #EDEDED;
            }
          }

          .uncompar-btn {
            width: 38px;
            color: #C0C4CC;
            height: 59px;
            border-right: 1px solid #EDEDED;
            display: inline-block;
            text-align: center;
            cursor: not-allowed;
          }

          .delete-btn {
            width: 38px;
            height: 59px;
            border-right: none;
          }

          .log-btn {
            width: 38px;
            height: 59px;
            border-right: 1px solid #EDEDED;
          }

          .view-disabled {
            background: #FFFFFF;
            color: #a09c9cbf;
            text-decoration: none;
          }
        }
      }
    }


  }
}

.shadow-left {
  width: 80px;
  height: 120%;
  position: absolute;
  top: -18px;
  left: 210px;
  background: linear-gradient(90deg, #F8F8F9 0%, rgba(248, 248, 249, 0) 100%);
}

.shadow-right {
  width: 80px;
  height: 120%;
  position: absolute;
  top: -18px;
  right: 263px;
  background: linear-gradient(270deg, #F8F8F9 0%, rgba(248, 248, 249, 0) 100%);
}

.dialog-content {
  h5 {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    text-align: left;
    margin-bottom: 10px;
  }
}

.add-plan {
  width: 1194px;
  height: 40px;
  background: #FFFFFF;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 40px;
  border: 1px solid #EDEDED;
  margin: 0 auto;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
  position: fixed;
  bottom: 100px;

  .add-icons {
    width: 14px;
    height: 14px
  }

  span {
    font-size: 13px;
    font-weight: 400;
    color: #495060;
  }
}

.checkplanbox {
  display: block;
  margin: 0 0 20px 0;
  font-size: 14px;

  p {
    display: inline-block;
    margin-right: 15px;
  }
}

.uncomparison {
  cursor: not-allowed;
}

.comparisonstyle {
  &:hover {
    fill: currentColor;
    color: #A634EF;
  }
}

.compareDialog {
  ::v-deep .el-dialog__title {
    color: #1F2D3D;
    font-weight: 600;
  }

  ::v-deep .el-dialog__body {
    padding: 20px 70px 30px 70px;
    margin-bottom: 10px;
    border-bottom: #CED3DD 1px solid;

  }
}

.downDialog {
  ::v-deep .el-dialog__header {
    padding: 10px !important;
  }

  ::v-deep .el-dialog__title {
    font-size: 16px;
    font-weight: 600;
    color: #1F2D3D;
  }

  ::v-deep .el-dialog__headerbtn {
    top: 14px;
  }

  ::v-deep .el-dialog__body {
    padding: 0 15px;
  }

  ::v-deep .el-dialog__footer {
    border-top: 1px solid #CED3DD;
  }

  .down-content {
    padding-top: 30px;
    min-height: 150px;

    &-item {
      p {
        font-size: 14px;
        font-weight: 400;
        color: #495060;
        margin-bottom: 10px;
      }

      .type-box {
        width: 100%;
        display: flex;
        flex-wrap: wrap;

        .type-item {
          padding: 0 15px;
          font-size: 12px;
          font-weight: 400;
          color: #495060;
          flex-shrink: 0;
          margin-bottom: 10px;
        }
      }
    }

    &-type {
      display: flex;

      p {
        line-height: 40px;
        margin-right: 20px;
      }

      .down-content-box {
        ul {
          display: flex;
          margin-bottom: 10px;

          li {
            width: 130px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-radius: 4px 0px 0px 4px;
            border: 1px solid rgba(0, 0, 0, 0.05);
            color: rgba(0, 0, 0, 0.65);
            cursor: pointer;

            &:last-child {
              border-radius: 0px 4px 4px 0px;
            }
          }

          .li-active {
            color: #fff;
            background: #930CEA;
          }
        }

        ::v-deep .el-range-editor.el-input__inner {
          width: 264px;
        }

      }
    }
  }

  .recall-btn {
    background-color: transparent;
    border: none;
  }
}

.logDialog {
  ::v-deep .el-dialog__header {
    box-shadow: 0px 1px 0px 0px #E3E4E6;
  }

  ::v-deep .el-dialog__body {
    padding: 0;
  }
}
</style>
<style>
.txt-box {
  display: block;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 3px;
  margin-top: 4px;
}

.log-dialog-title {
  font-size: 16px;
  font-weight: 600;
  color: #1C2438;
  position: relative;
}

.export-box {
  width: 64px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  border-radius: 4px;
  border: 1px solid #BBBEC4;
  font-size: 12px;
  font-weight: 400;
  color: #172A40;
  position: absolute;
  top: -7px;
  right: 65px;
  cursor: pointer;
}

.log-dialog-title .log-tip {
  display: inline-block;
  width: 12px;
  height: 12px;
  position: relative;
  top: -5px;
  left: 3px;
}

.log-content-header {
  margin: 20px auto;
  padding-left: 34px;
  box-shadow: 0px 1px 0px 0px #E3E4E6;
}

.log-content-header .el-form-item__label {
  font-size: 12px;
  font-weight: 500;
  color: #4A4A4A;
}

.log-content-header .el-input__inner {
  width: 217px;
  height: 30px;
  font-size: 12px;
}

.log-content-header .el-button--primary {
  width: 80px;
  height: 28px;
  line-height: 28px;
  background: #930CEA;
  border-radius: 4px;
  padding: 0;
}

.log-content-header .el-button--danger {
  width: 80px;
  height: 28px;
  line-height: 28px;
  background: #fff;
  border-radius: 4px;
  padding: 0;
  font-weight: 500;
  color: #495060;
  border: 1px solid #BBBEC4;
}

.log-content-box {
  width: 1168px;
  margin: 0 auto;
  height: 515px;
}

.log-footer {
  display: flex;
  height: 44px;
  background: #FFFFFF;
  box-shadow: 0px -1px 0px 0px #CED3DD;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.delete-txt {
  font-size: 16px;
  font-weight: 600;
  color: #1F2D3D;
  text-align: center;
}
</style>
