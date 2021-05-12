<!--
    地图图例面板
-->
<template>
  <section>
    <el-dialog
      class="exportTablePop"
      :visible.sync="isShowExportTable"
      width="1237px"
      :show-close="false"
      @close="closePop"
      :before-close="closePop"
      :close-on-click-modal="false"
    >
      <div class="exportTable" id="export_table">
        <!--头部-->
        <div class="tableHeader">
          门店明细
          <span class="el-icon-close closeIcon" @click="closePop"></span>
          <span class="el-icon-download downloadIcon" @click="downExcel">
          </span>
        </div>
        <!--表格区域-->
        <div class="tableContainer">
          <!--过滤器表单-->
          <div class="forms">
            <div class="selectArea" v-show="false">
              <span class="label">分类</span>
              <!-- 多选时 加multiple -->
              <el-select
                v-model="typeValue"
                placeholder="请选择"
                size="small"
                class="typeSelect"
                multiple
                collapse-tags
                popper-class="selectPopover"
                @change="typeValueChanged"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="selectArea">
              <span class="label">层级架构</span>
              <el-select
                v-model="levelValue"
                placeholder="请选择"
                size="small"
                class="levelSelect"
                popper-class="selectPopover"
                @change="typeValueChanged"
              >
                <el-option
                  v-for="item in levelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="selectArea" v-show="levelValue === '组织边界'">
              <span class="label">组织架构</span>
              <select-tree
                width="200"
                :clear="isClear"
                @handleCloseId="treeOptionsClosed"
              />
            </div>
            <div class="selectArea" v-show="levelValue === '行政边界'">
              <span class="label">行政架构</span>
              <el-cascader
                ref="adminTree"
                v-model="adminValue"
                :options="adminTree"
                :props="adminOptions"
                @change="adminTreeChanged"
                separator=">"
                clearable
                class="adminInput typeCascader"
                popper-class="orgPopover"
              ></el-cascader>
            </div>
            <div class="selectArea" style="margin-left: 200px">
              <span class="label">筛选字段</span>
              <el-select
                v-model="filterValue"
                placeholder="请选择"
                size="small"
                class="fieldSelect"
                popper-class="selectPopover"
                @change="filterValueChanged"
              >
                <el-option
                  v-for="item in filterHeaders"
                  :key="item.key"
                  :label="item.name"
                  :value="item.key"
                >
                  <span style="float: left">{{ item.name }}</span>
                  <span
                    style="float: right"
                    v-show="
                      Array.isArray(inputObj[item.key])
                        ? inputObj[item.key].length
                        : inputObj[item.key]
                    "
                  >
                    <i class="el-icon-check"></i>
                  </span>
                </el-option>
              </el-select>
            </div>
            <div class="selectArea">
              <!-- 门店类型 -->
              <el-cascader
                v-if="filterValue === 'storeCategoryNames'"
                v-model="inputObj.storeCategoryNames"
                :options="storeTypeOpts"
                :props="{
                  multiple: true,
                  emitPath: false,
                  label: 'name',
                  value: 'id'
                }"
                collapse-tags
                placeholder="请选择"
                size="small"
                class="keyInput typeCascader"
                popper-class="orgPopover"
                :disabled="inputDisable"
              >
              </el-cascader>
              <!-- 标签信息 -->
              <!-- <el-cascader
                v-else-if="filterValue === 'labelNames'"
                v-model="inputObj.labelNames"
                :options="labelTypeOpts"
                :props="{ multiple: true, emitPath:false }"
                collapse-tags
                placeholder="请选择"
                size="small"
                class="keyInput typeCascader"
                popper-class="orgPopover"
                :disabled="inputDisable">
              </el-cascader> -->
              <el-select
                v-else-if="filterValue === 'labelNames'"
                v-model="inputObj.labelNames"
                placeholder="请选择"
                size="small"
                class="keyInput"
                popper-class="selectPopover"
              >
                <el-option
                  v-for="item in labelTypeOpts"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <!-- 推送状态 -->
              <el-select
                v-else-if="filterValue === 'pushStatus'"
                v-model="inputObj.pushStatus"
                placeholder="请选择"
                size="small"
                class="keyInput"
                popper-class="selectPopover"
              >
                <el-option
                  v-for="item in pushStatusOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <!-- 周围环境POI -->
              <el-cascader
                v-else-if="filterValue === 'storePoiDevelopmentTagCodes'"
                v-model="inputObj.storePoiDevelopmentTagCodes"
                :options="storePoiDevelopmentTagCodes"
                :props="{
                  multiple: true,
                  emitPath: false,
                  value: 'code',
                  label: 'name'
                }"
                collapse-tags
                placeholder="请选择"
                size="small"
                class="keyInput typeCascader"
                popper-class="orgPopover"
              >
              </el-cascader>
              <!-- 标签-人流量 -->
              <el-cascader
                v-else-if="filterValue === 'populationTagCodes'"
                v-model="inputObj.populationTagCodes"
                :options="populationTagCodes"
                :props="{
                  multiple: true,
                  emitPath: false,
                  value: 'code',
                  label: 'name'
                }"
                collapse-tags
                placeholder="请选择"
                size="small"
                class="keyInput typeCascader"
                popper-class="orgPopover"
              >
              </el-cascader>
              <!-- 标签-交通便利 -->
              <el-cascader
                v-else-if="filterValue === 'trafficConditionTagCodes'"
                v-model="inputObj.trafficConditionTagCodes"
                :options="trafficConditionTagCodes"
                :props="{
                  multiple: true,
                  emitPath: false,
                  value: 'code',
                  label: 'name'
                }"
                collapse-tags
                placeholder="请选择"
                size="small"
                class="keyInput typeCascader"
                popper-class="orgPopover"
              >
              </el-cascader>
              <!-- 标签-消费力指数 -->
              <el-cascader
                v-else-if="filterValue === 'consumptionTagCodes'"
                v-model="inputObj.consumptionTagCodes"
                :options="consumptionTagCodes"
                :props="{
                  multiple: true,
                  emitPath: false,
                  value: 'code',
                  label: 'name'
                }"
                collapse-tags
                placeholder="请选择"
                size="small"
                class="keyInput typeCascader"
                popper-class="orgPopover"
              >
              </el-cascader>
              <!-- 标签-门店密集程度 -->
              <el-cascader
                v-else-if="filterValue === 'storeDensityTagCodes'"
                v-model="inputObj.storeDensityTagCodes"
                :options="storeDensityTagCodes"
                :props="{
                  multiple: true,
                  emitPath: false,
                  value: 'code',
                  label: 'name'
                }"
                collapse-tags
                placeholder="请选择"
                size="small"
                class="keyInput typeCascader"
                popper-class="orgPopover"
              >
              </el-cascader>
              <!-- 标签-房价 -->
              <el-cascader
                v-else-if="filterValue === 'housePriceTagCodes'"
                v-model="inputObj.housePriceTagCodes"
                :options="housePriceTagCodes"
                :props="{
                  multiple: true,
                  emitPath: false,
                  value: 'code',
                  label: 'name'
                }"
                collapse-tags
                placeholder="请选择"
                size="small"
                class="keyInput typeCascader"
                popper-class="orgPopover"
              >
              </el-cascader>
              <!-- 门店名称、门店地址... -->
              <el-input
                v-else
                v-model="inputObj[filterValue]"
                clearable
                size="small"
                class="keyInput"
                :disabled="inputDisable"
                :type="filterValue === 'similarity' ? 'number' : 'text'"
                :placeholder="
                  inputDisable ? '请先选择筛选字段，然后输入' : '请输入'
                "
              >
              </el-input>
            </div>
            <div class="selectArea" style="margin-right: 0">
              <span class="filter-btn left-btn" @click="keyupValueFilter">
                确定
              </span>
              <span class="filter-btn" @click="resetFilter">重置</span>
            </div>
          </div>
          <div class="tableList">
            <!--浮层字段排序，过滤-->
            <el-popover
              placement="bottom"
              trigger="click"
              popper-class="filterPopover"
              width="288"
            >
              <table class="filterTableHeader" cellspacing="0" cellpadding="0">
                <thead>
                  <tr>
                    <th class="thShow">是否显示</th>
                    <th class="fieldName">字段名称</th>
                    <th class="thOperateHeader">操作</th>
                  </tr>
                </thead>
              </table>
              <table
                class="filterTableHeader filterTableBody"
                cellspacing="0"
                cellpadding="0"
              >
                <tbody>
                  <draggable
                    @end="sortChange"
                    v-model="tableHeader"
                    style="max-height: 300px; overflow-y: auto"
                  >
                    <tr v-for="(item, index) in tableHeader" :key="index">
                      <td class="thShow" @click.stop="chooseView(item, index)">
                        <div class="checkedIconContainer">
                          <img
                            v-if="item.show"
                            class="checkedIcon"
                            src="../../assets/img/checked@2x.png"
                            alt
                          />
                        </div>
                      </td>
                      <td class="fieldName">{{ item.name }}</td>
                      <td class="thOperate">
                        <svg-icon
                          icon-class="field-drag-bar-icon"
                          class-name="fieldDragBarIcon"
                        />
                      </td>
                    </tr>
                  </draggable>
                </tbody>
              </table>
              <div class="resetFilterArea" @click="InitHeader">
                <div class="resetButton">恢复默认</div>
              </div>
              <div slot="reference" class="el-icon-setting settingIcon"></div>
            </el-popover>
            <!--店铺列表-->
            <el-table
              :data="tableData"
              max-height="313"
              class="dataTable"
              style="width: 100%"
              row-class-name="dataRow"
              :key="tableKey"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <template v-for="item in tableHeader">
                <el-table-column
                  v-if="item.show && item.key !== 'labelNames'"
                  :key="item.key"
                  :prop="item.key"
                  :label="item.name"
                  show-overflow-tooltip
                  :sortable="
                    item.name === '相似度' || item.name === '上次推送时间'
                  "
                  :min-width="
                    ['上次推送时间', '同步时间', '营业部', '营业所'].includes(
                      item.name
                    )
                      ? '150'
                      : ['门店名称', '门店地址'].includes(item.name)
                      ? '200'
                      : '120'
                  "
                >
                  <!-- <template slot-scope="scope">
                    <div>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row[item.key]"
                        :open-delay="800"
                        placement="top-start">
                        <div class="tdAddress">{{scope.row[item.key]}}</div>
                      </el-tooltip>
                    </div>
                  </template> -->
                  <template slot-scope="scope">
                    <div v-if="item.key === 'similarity'">
                      {{
                        scope.row[item.key] ? `${scope.row[item.key]}%` : '-'
                      }}
                    </div>
                    <div v-else-if="scope.row[item.key]" class="over-text">
                      {{ scope.row[item.key] }}
                    </div>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="item.show && item.key === 'labelNames'"
                  :key="item.key"
                  :prop="item.key"
                  :label="item.name"
                  width="250"
                >
                  <template slot-scope="scope">
                    <div class="tdTags">
                      <div
                        class="tagGroup"
                        :class="{ tagGroupHeightAuto: scope.row.isShow }"
                      >
                        <span
                          v-for="(item, index) in scope.row.labelNames.filter(
                            it => it !== null && it !== ''
                          )"
                          :class="item.id === 'SELF' ? 'tag2' : 'tag'"
                          :key="index"
                        >
                          {{ item.name }}
                        </span>
                      </div>
                      <span
                        class="switchButton"
                        @click="switchMore(scope.$index)"
                        >{{ scope.row.isShow ? '收起' : '展开' }}</span
                      >
                    </div>
                  </template>
                </el-table-column>
              </template>
              <el-table-column label="操作" width="120" fixed="right">
                <template slot-scope="scope">
                  <div
                    style="cursor: pointer"
                    @click="delExistStore(scope.row.id)"
                  >
                    移除已有门店
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!--分页区域-->
        <div class="pageList">
          <div class="totlaNum">
            共 {{ totalNumber }} 条数据 第 {{ currentPage }} /
            {{ totalPage }} 页
          </div>
          <div class="paging">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="totalNumber"
              :page-size="pageSize"
              :current-page.sync="currentPage"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
        </div>
        <!--控制菜单-->
        <div class="bottomMenu">
          <!-- <div class="buttonList exportButton" @click="exportCurrentList">
            推送
          </div> -->
          <div class="buttonList goBackButton" @click="closePop">返回</div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="delExistStorePopShow"
      width="360px"
      :before-close="delExistStorePopCancel"
    >
      <span>此操作将在本店群中移除该门店，之后无法恢复，是否继续？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delExistStorePopCancel">取 消</el-button>
        <el-button type="primary" @click="delExistStorePopClose"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </section>
</template>

<script>
// import { Notification } from 'element-ui'
import draggable from 'vuedraggable'
import BUSINESS_NAVIGATE_API from '../../../api/business_navigate_api'
import BUSINESS_EXPANSION_API from '../../../api/business-expansion_api'
import SelectTree from '@/views/route-planning-views/GolbalConfigComponents/selectTree'

// 筛选下拉框
const storeExportHeader = [
  {
    key: 'storeId',
    name: '门店ID',
    show: false, // 字段在表格中显示/隐藏
    filter: true, // 该字段是否可以过滤
    multi: false // 该字段是否可以多选
  },
  {
    key: 'storeName',
    name: '门店名称',
    show: true,
    filter: true,
    multi: false
  },
  {
    key: 'address',
    name: '门店地址',
    show: true,
    filter: true,
    multi: false
  },
  {
    key: 'storeCategoryNames',
    name: '门店类型',
    show: true,
    filter: true,
    multi: true
  },
  {
    key: 'similarity',
    name: '相似度',
    show: false,
    filter: true,
    multi: false
  },
  // {
  //   key: 'pushStatus',
  //   name: '推送状态',
  //   show: true,
  //   filter: true,
  //   multi: false
  // },
  // {
  //   key: 'exportTime',
  //   name: '上次推送时间',
  //   show: true,
  //   filter: false,
  //   multi: false
  // },
  // {
  // 	key: 'labelNames',
  // 	name: '标签信息',
  // 	show: true,
  // 	filter: true,
  // 	// multi: true,
  // 	multi: false,
  // },
  {
    key: 'storePoiDevelopmentTagCodes',
    name: '标签-周围环境POI',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'populationTagCodes',
    name: '标签-人流量',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'trafficConditionTagCodes',
    name: '标签-交通便利',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'consumptionTagCodes',
    name: '标签-消费力指数',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'storeDensityTagCodes',
    name: '标签-门店密集程度',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'housePriceTagCodes',
    name: '标签-房价',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'marketingOrgName',
    name: '行销公司',
    show: false,
    filter: true,
    multi: false
  },
  {
    key: 'departmentOrgName',
    name: '营业部',
    show: false,
    filter: true,
    multi: false
  },
  {
    key: 'orgName',
    name: '营业所',
    show: false,
    filter: true,
    multi: false
  }
]

// 表格列
const storeExportHeaderS = [
  {
    key: 'storeId',
    name: '门店ID',
    show: false, // 字段在表格中显示/隐藏
    filter: true, // 该字段是否可以过滤
    multi: false // 该字段是否可以多选
  },
  {
    key: 'storeName',
    name: '门店名称',
    show: true,
    filter: true,
    multi: false
  },
  {
    key: 'address',
    name: '门店地址',
    show: true,
    filter: true,
    multi: false
  },
  {
    // key: 'storeType',
    key: 'storeCategoryNames',
    name: '门店类型',
    show: true,
    filter: true,
    multi: true
  },
  {
    key: 'similarity',
    name: '相似度',
    show: false,
    filter: true,
    multi: false
  },
  {
    key: 'tel',
    name: '门店电话',
    show: false,
    filter: true,
    multi: false
  },
  {
    key: 'provinceName',
    name: '省',
    show: false,
    filter: true,
    multi: false
  },
  {
    key: 'cityName',
    name: '市',
    show: false,
    filter: true,
    multi: false
  },
  {
    key: 'districtName',
    name: '区',
    show: false,
    filter: true,
    multi: false
  },
  // {
  //   key: 'pushStatus',
  //   name: '推送状态',
  //   show: true,
  //   filter: true,
  //   multi: false
  // },
  // {
  //   key: 'exportTime',
  //   name: '上次推送时间',
  //   show: true,
  //   filter: false,
  //   multi: false
  // },
  {
    key: 'marketingOrgName',
    name: '行销公司',
    show: false,
    filter: true,
    multi: false
  },
  {
    key: 'departmentOrgName',
    name: '营业部',
    show: false,
    filter: true,
    multi: false
  },
  {
    key: 'orgName',
    name: '营业所',
    show: false,
    filter: true,
    multi: false
  },
  {
    key: 'labelNames',
    name: '标签信息',
    show: true,
    filter: true,
    multi: false
  }
]
export default {
  components: {
    draggable,
    SelectTree
  },
  data() {
    return {
      isShow: true,
      // ------ 搜索 分类、层级架构、组织架构 ------
      typeOptions: [
        // { value: "一阶", label: "一阶" },
        // { value: "二阶", label: "二阶" },
      ],
      levelOptions: [
        { value: '行政边界', label: '行政边界' },
        { value: '组织边界', label: '组织边界' }
      ],
      regionTree: [],
      // regionProps: { // 行政架构props
      // 	expandTrigger: 'hover',
      // 	children: 'list',
      // 	label: 'regionName',
      // 	value: 'regionCode',
      // },
      regionProps: {
        // 组织架构props
        children: 'children',
        label: 'name',
        value: 'id'
      },
      adminValue: [],
      adminTree: [],
      // 行政架构props
      adminOptions: {
        children: 'children',
        label: 'name',
        value: 'id',
        checkStrictly: true
      },
      // 行政架构选择的多个层级[省、市、区]
      adminSelectNodes: {
        provinceName: '',
        cityName: '',
        districtName: ''
      },
      // typeValue: '', // 分类
      typeValue: [], // 分类
      levelValue: '组织边界', // 层级架构
      // orgValue: [],
      orgValue: '',
      isClear: false, // 组织架构下拉框清空
      // ------ table ------
      totalNumber: 0,
      pageSize: 80,
      currentPage: 1,
      totalPage: 0,
      tableData: [], // 过滤展示的表格数据
      tableHeader: [], // 表头数据
      tableKey: 0, // 表格key
      multipleSelection: [], // 表格checkbox多选 用来下载和推送
      // ------ 筛选 ------
      filterValue: '', // 筛选字段下拉框值
      filterHeaders: [], // 筛选下拉框数据
      selectedFilters: [], // 已经筛选过的字段
      inputObj: {}, // 筛选字段对应的输入框v-model值 和筛选字段一一对应
      inputDisable: true, // 筛选下拉框字段没选 input不可输入
      pushStatusOpts: [
        // 推送状态下拉框数据
        { label: '已推送', value: '0' },
        { label: '未推送', value: '1' }
      ],
      // 门店类型可选数据
      storeTypeOpts: [],
      // 标签信息可选数据
      labelTypeOpts: [],
      //标签-周围环境POI下拉框数据
      // poi: [],
      storePoiDevelopmentTagCodes: [],
      // 删除已有门店确认弹框
      delExistStorePopShow: false,
      // 删除已有门店当前id
      delExistStorePopId: '',
      // 标签-人流量
      populationTagCodes: [],
      // 标签-交通便利
      trafficConditionTagCodes: [],
      // 标签-消费力指数
      consumptionTagCodes: [],
      // 门店-门店密集程度
      storeDensityTagCodes: [],
      // 标签-房价
      housePriceTagCodes: []
    }
  },
  props: ['isShowExportTable'],
  watch: {
    isShowExportTable(data) {
      // ---页码初始化---
      this.currentPage = 1
      this.totalPage = 0
      this.totalNumber = 0
      // ---搜索条件初始化---
      this.initFilter()
      // ---分类初始化---
      this.typeValue = []
      if (data) {
        this.isClear = true
        this.adminValue = [] // 行政选择框数据初始化
        // if (this.orgId) {
        //   this.orgValue = this.orgId // 初始化赋值
        // } else if (this.$cookies.get('orgId')) {
        //   this.orgValue = this.$cookies.get('orgId')
        // } else {
        //   this.orgValue = '5074727057550190748' // 苏州区域
        // }
        this.orgValue = this.queryObj.orgId || ''
        this.getTableData()
      } else {
        this.isClear = false
        this.orgValue = ''
      }
    }
  },
  computed: {
    orgId() {
      return this.$route.query.orgId
      // return '6119182312266498395';
    },
    queryObj() {
      return this.$route.query
    },
    linkUrl() {
      let selectedCols = []
      this.tableHeader.filter(item => {
        if (item.show) selectedCols.push(item)
      })
      const params = {
        ...this.formatParams(true),
        columns: selectedCols.map(item => item.name).join(',')
      }
      let tempParam = ''
      Object.keys(params).forEach((key, idx) => {
        if (idx === 0) {
          tempParam += `${key}=${params[key]}`
        } else {
          tempParam += `&${key}=${params[key]}`
        }
      })
      return `/api/expand/business/export?${tempParam}`
    }
  },
  mounted() {
    this.getRegionList()
    this.getTypeList()
    this.getIconList()
    this.getCustomerTypeList()
    this.getLabelTypeList()
    this.getDistrictList()
    this.getAdminList()
    this.getTotalLabesList()
    this.storeTypeHeader(this.$route.query.storeType)
  },
  methods: {
    // ---------------------------------------------------------
    // 判断是种子门店还是商机门店 展示不同的字段
    storeTypeHeader(val) {
      this.tableHeader = []
      this.filterHeaders = []
      // 门店类型-如果为种子门店-相似度字段不显示
      if (val === 'seed_store') {
        storeExportHeaderS.forEach(item => {
          if (item.key !== 'similarity') {
            this.tableHeader.push(item)
          }
        })
        storeExportHeader.forEach(item => {
          if (item.filter && item.key !== 'similarity')
            this.filterHeaders.push(item)
        })
      } else {
        this.tableHeader = JSON.parse(JSON.stringify(storeExportHeaderS))
        storeExportHeader.forEach(item => {
          if (item.filter) this.filterHeaders.push(item)
        })
      }
      this.filterHeaders.forEach(item => {
        if (item.multi) {
          this.$set(this.inputObj, item.key, [])
        } else {
          this.$set(this.inputObj, item.key, '')
        }
      })
    },
    // 获取分类下拉框数据
    async getTypeList() {
      this.typeOptions = []
      const tempList = await BUSINESS_NAVIGATE_API.get_store_type_list({
        cate: 1
      })
      tempList.forEach(item => {
        this.typeOptions.push({
          value: item.channel,
          label: item.channel
        })
      })
    },
    //获取门店类型树形结构数据
    async getIconList() {
      this.storeTypeOpts = []
      const tempList = await BUSINESS_EXPANSION_API.get_store_type_select()
      this.storeTypeOpts = this.dealTreeData(tempList)
    },
    // 递归判断，把最深层级的children=[]设为undefined，防止级联选择器最后一级出现暂无数据的情况
    dealTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.dealTreeData(data[i].children)
        }
      }
      return data
    },
    // 获取组织架构树
    async getRegionList() {
      const res = await BUSINESS_NAVIGATE_API.sync_group_list({})
      if (res && res.length) {
        this.regionTree = res
      } else {
        this.regionTree = []
      }
    },
    // 获取行政架构树
    async getAdminList() {
      const res = await BUSINESS_EXPANSION_API.sync_admin_tree_list({})
      if (res && res.length) {
        this.adminTree = this.dealTreeData(res)
      } else {
        this.adminTree = []
      }
    },
    // 获取不同类型的标签下拉框数据
    async getTotalLabesList() {
      const res = await BUSINESS_EXPANSION_API.sync_total_labels_list({})
      const {
        poiLabels,
        houspriceLabels,
        spendingpowerLabels,
        storedensityLabels,
        transportationLabels,
        visitorsLabels
      } = res
      this.storePoiDevelopmentTagCodes = poiLabels || [] // poi
      this.housePriceTagCodes = houspriceLabels || [] // 房价
      this.consumptionTagCodes = spendingpowerLabels || [] // 消费力指数
      this.trafficConditionTagCodes = transportationLabels || [] // 交通便利指数
      this.populationTagCodes = visitorsLabels || [] // 人流量
      this.storeDensityTagCodes = storedensityLabels || [] // 门店密集程度
    },
    // 获取客户类型下拉框数据
    async getCustomerTypeList() {},
    // 获取标签信息下拉框数据
    async getLabelTypeList() {
      const tempList = await BUSINESS_NAVIGATE_API.get_poi_list({})
      this.labelTypeOpts = tempList
    },
    // 获取销售区域下拉框数据
    async getDistrictList() {},
    // 格式化传参
    formatParams(isCheck = false) {
      // 门店类型
      let tempStoreType = []
      tempStoreType = tempStoreType.concat(this.inputObj.storeCategoryNames)

      // 处理不同类型的 筛选标签
      let tempInputObj = {}
      for (let it in this.inputObj) {
        if (it === 'similarity') {
          // similarity处理数字类型
          tempInputObj[it] = this.inputObj[it].length
            ? Number(this.inputObj[it])
            : ''
        } else if (
          Array.isArray(this.inputObj[it]) &&
          it !== 'storeCategoryNames' &&
          it.includes('TagCodes')
        ) {
          // 处理不同类型的标签
          tempInputObj[it] = this.inputObj[it].join(',')
        } else if (it !== 'storeCategoryNames') {
          // storeCategoryNames参数不传
          tempInputObj[it] = this.inputObj[it]
        }
      }

      const params = {
        // ...this.queryObj,
        storesId: this.queryObj.storesId,
        storeType: this.queryObj.storeType, // 种子门店 or 商机门店
        // orgId: this.orgValue,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        // type: this.typeValue.map((item) => item).join(','), // 目前没有分类选项
        // storeType: tempStoreType.join(','),
        storeCategoryIds: tempStoreType, // 门店类型ids
        storeIds: isCheck ? this.multipleSelection : [], // 勾选的id 只有下载和推送时传
        ...tempInputObj
      }

      if (this.levelValue === '组织边界') {
        this.$set(params, 'orgId', this.orgValue)
      } else {
        for (let key in this.adminSelectNodes) {
          this.$set(params, key, this.adminSelectNodes[key])
        }
      }
      // console.log('params', params)
      return params
    },
    // ---------------------------------------------------------
    // 收起/展开标签组
    switchMore(index) {
      this.tableData[index].isShow = !this.tableData[index].isShow
    },
    // 导出当前分页的店铺 同步-右下角“推送”按钮
    exportCurrentList() {
      BUSINESS_NAVIGATE_API.sync_store_list(this.formatParams(true)).then(
        res => {
          this.$message({
            message: res,
            type: 'success'
          })
        }
      )
    },
    // 关闭弹窗
    closePop() {
      // this.$emit('switchShowExportTable', false);
      this.$store.commit('businessExpansionModule/SET_IS_OPEN_EXPORT', false)
    },
    // 地域层级变化回调
    orgChange() {
      console.log('地域层级变化')
    },
    // 切换表头顺序
    sortChange() {
      this.tableKey++
    },
    // 是否显示该表头
    chooseView(headerItem, index) {
      this.tableHeader[index].show = !this.tableHeader[index].show
    },
    // 恢复默认
    InitHeader() {
      this.tableHeader = JSON.parse(JSON.stringify(storeExportHeaderS))
      this.tableKey++
    },
    getTableData() {
      // table请求 初始化的数据
      this.multipleSelection = []
      this.tableData = []

      BUSINESS_EXPANSION_API.post_export_store_list(
        this.formatParams(false)
      ).then(res => {
        const { pager, total, pages, list } = res
        this.currentPage = pager
        this.totalNumber = total
        this.totalPage = pages
        if (list && list.length) {
          list.forEach(item => {
            this.tableData.push({
              isShow: false, // 标签展示/隐藏
              ...item
            })
          })
        }
      })
    },
    typeValueChanged() {
      // this.currentPage = 1
      // this.getTableData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTableData()
    },
    // 字段筛选
    filterValueChanged() {
      if (this.inputDisable) this.inputDisable = false
      // if (this.selectedFilters.indexOf(this.filterValue) < 0) {
      // 	this.selectedFilters.push(this.filterValue);
      // }
    },
    keyupValueFilter() {
      this.currentPage = 1
      this.getTableData()
    },
    // 延时搜索 1000ms
    debounce(fn, delaytime) {
      let timer = null
      if (timer) clearTimeout(timer)
      timer = setTimeout(fn, delaytime)
    },
    treeOptionsClosed(val) {
      if (val) {
        this.currentPage = 1
        this.orgValue = val
        this.getTableData()
      }
    },
    // 过滤条件重置
    resetFilter() {
      this.initFilter()
      this.keyupValueFilter()
    },
    // 初始化过滤条件
    initFilter() {
      this.filterValue = ''
      this.inputDisable = true
      for (let it in this.inputObj) {
        if (Array.isArray(this.inputObj[it])) {
          this.inputObj[it] = []
        } else {
          this.inputObj[it] = ''
        }
      }
    },
    // 第一列 CheckBox勾选数据
    handleSelectionChange(val) {
      if (val && val.length) {
        this.multipleSelection = val.map(it => it.storeId)
      } else {
        this.multipleSelection = []
      }
    },
    // 移除已有门店
    delExistStore(storeId) {
      this.delExistStorePopShow = true
      this.delExistStorePopId = storeId
    },
    delExistStorePopCancel() {
      this.delExistStorePopShow = false
    },
    delExistStorePopClose() {
      // 调接口操作
      BUSINESS_EXPANSION_API.post_del_export_store({
        id: this.delExistStorePopId
      })
        .then(res => {
          if (res.code === '200') {
            this.$message({
              message: '移除成功',
              type: 'success'
            })
          }
          this.delExistStorePopShow = false
          this.getTableData() // 刷新列表
        })
        .catch(err => {
          this.$message({
            message: err,
            type: 'error'
          })
          this.delExistStorePopShow = false
        })
    },
    downExcel() {
      // Notification({
      //   title: '已经开始下载',
      //   type: 'success',
      //   duration: 5000,
      //   showClose: true,
      // })
      const iframeVisit = document.createElement('iframe')
      iframeVisit.style.display = 'none'
      iframeVisit.style.height = 0
      iframeVisit.src = this.linkUrl
      document.body.appendChild(iframeVisit)
    },
    adminTreeChanged() {
      for (let it in this.adminSelectNodes) {
        this.adminSelectNodes[it] = ''
      }
      const tempNodes = this.$refs.adminTree.getCheckedNodes().length
        ? this.$refs.adminTree.getCheckedNodes()[0].pathNodes
        : []
      if (tempNodes.length) {
        tempNodes.forEach(item => {
          if (item.data.regionLevel === '1') {
            // 省
            this.adminSelectNodes.provinceName = item.label
          } else if (item.data.regionLevel === '2') {
            // 市
            this.adminSelectNodes.cityName = item.label
          } else if (item.data.regionLevel === '3') {
            // 区
            this.adminSelectNodes.districtName = item.label
          }
        })
      }
      this.currentPage = 1
      this.getTableData()
    }
  }
}
</script>

<style scoped lang="scss">
.exportTablePop {
  #export_table {
    width: 1237px;
    height: 600px;
    font-size: 12px;
    background-color: #0a2757;
    .tableHeader {
      height: 40px;
      line-height: 40px;
      width: 1237px;
      text-align: center;
      overflow: hidden;
      padding-left: 20px;
      padding-right: 20px;
      background-color: #081f45;
      font-size: 16px;
      box-sizing: border-box;
      span {
        cursor: pointer;
        float: right;
        color: #ffffff;
        font-size: 20px;
        margin-top: 10px;
      }
      form {
        float: right;
      }
      .closeIcon {
        margin-left: 20px;
      }
    }
    .tableContainer {
      width: 1190px;
      height: 410px;
      margin-left: auto;
      margin-right: auto;
      border: 1px solid #930cea;
      border-radius: 2px;
      margin-top: 16px;
      margin-bottom: 16px;
      .forms {
        margin-top: 18px;
        margin-bottom: 5px;
        padding-left: 15px;
        // overflow: hidden;
        height: 33px;
        .selectArea {
          float: left;
          margin-right: 12px;
          .label {
            margin-right: 8px;
          }
          .typeSelect,
          .levelSelect,
          .orgSelect {
            width: 140px;
            height: 32px;
            border-radius: 4px;
          }
          .levelSelect {
            width: 120px;
          }
          .orgSelect {
            width: 300px;
          }
          .fieldSelect {
            width: 120px;
          }
          .keyInput {
            width: 219px;
          }
          .adminInput {
            width: 200px;
          }
          .filter-btn {
            display: inline-block;
            width: 30px;
            height: 30px;
            line-height: 30px;
            // margin-top: 7px;
            border-radius: 4px;
            // background-color: #930cea;
            cursor: pointer;
            padding: 0 5px;
            border: 1px solid #930cea;
            text-align: center;
          }
          .left-btn {
            background-color: #930cea;
            margin-right: 5px;
          }
        }
      }
      .tableList {
        .settingIcon {
          float: right;
          font-size: 20px;
          margin-bottom: 10px;
          margin-right: 20px;
          margin-top: 10px;
        }
        .dataTable {
          width: 1155px;
          margin-left: auto;
          margin-right: auto;
          background-color: #0a2757;
          .tdAddress,
          .tdStoreName {
            width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .tdStoreName {
            width: 80px;
          }
          .tdTags {
            display: flex;
            color: #ffffff;
            .tagGroup {
              flex: 1;
              padding: 1px;
              overflow: hidden;
              height: 30px;
              transition: all 0.3s;
              // GAIA标签style
              .tag {
                display: inline-block;
                margin-right: 5px;
                margin-top: 4px;
                height: 22px;
                line-height: 22px;
                padding-left: 10px;
                padding-right: 10px;
                background: #7909c1;
                border-radius: 2px;
                border: 1px solid #930cea;
                // cursor: pointer;
              }
              // 自有标签style
              .tag2 {
                display: inline-block;
                margin-right: 5px;
                margin-top: 4px;
                height: 22px;
                line-height: 22px;
                padding-left: 10px;
                padding-right: 10px;
                background: #ed3f14;
                border-radius: 2px;
                border: 1px solid #ed3f14;
                // cursor: pointer;
              }
            }
            .tagGroupHeightAuto {
              height: auto;
            }
            .switchButton {
              width: 25px;
              margin-top: 4px;
              cursor: pointer;
            }
          }
          .over-text {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }
    // 分页
    .pageList {
      height: 62px;
      background: #0a2757;
      box-shadow: 0px -1px 0px 0px #4b1f98;
      overflow: hidden;
      .totlaNum {
        float: left;
        color: #ced3dd;
        font-size: 12px;
        margin-top: 22px;
        margin-left: 68px;
      }
      .paging {
        float: right;
        margin-right: 12px;
        margin-top: 15px;
      }
    }
    .bottomMenu {
      height: 52px;
      line-height: 52px;
      padding-right: 50px;
      overflow: hidden;
      background-color: #102f63;
      .buttonList {
        width: 80px;
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        text-align: center;
        background: #415982;
        border-radius: 4px;
        transition: all 0.3s;
        float: right;
        margin-top: 10px;
        cursor: pointer;
      }
      .buttonList:hover {
        // background-color: #930cea;
      }
      .exportButton {
        background-color: #930cea;
      }
      .goBackButton {
        // margin-right: 20px;
      }
    }
  }
}
</style>

<style lang="scss">
// 此处为覆盖饿了么UI的样式，需要放在非局部样式中，增加#export_table来防止影响其他模块
.exportTablePop {
  .el-dialog {
    margin-top: 8vh !important;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    color: #ffffff;
    padding: 0;
    #export_table {
      .el-table__header {
        thead {
          th {
            background-color: #252174;
            color: #fff;
          }
        }
      }
      .dataRow {
        background-color: #0a2757;
        border-bottom: 1px solid #283f65;
        color: #ffffff;
        font-size: 12px;
      }
      .el-table__body {
        padding-bottom: 1px;
        tr {
          td {
            border-bottom: 1px dashed #283f65;
          }
          &.hover-row > td {
            background: #252174;
          }
        }
        tr:hover {
          td {
            background-color: #0a2757;
          }
        }
      }
      .el-table::before {
        background-color: #0a2757;
      }
      .is-leaf {
        border-color: #0a2757;
      }
      .el-table__body-wrapper {
        background-color: #0a2757;
      }
      .el-table__fixed-right::before {
        height: 0;
      }
      .el-input__inner {
        font-size: 12px;
        background-color: #0a2757;
        border: 1px solid #8199a4;
        color: #ffffff;
      }
      .el-cascader {
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        width: 260px;
        .el-input {
          height: 32px;
          line-height: 32px;
          .el-input__inner {
            height: 32px;
            line-height: 32px;
          }
          .el-input__icon {
            line-height: 32px;
          }
        }
      }
    }
  }
}
// 覆盖饿了么UI的 popover 弹窗，改变背景颜色，边框
.filterPopover,
.orgPopover,
.selectPopover {
  background-color: #0a2757;
  border-color: #0a2757;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.7);
  font-size: 12px;
  .popper__arrow {
    border-bottom-color: #0a2757 !important;
    &::after {
      border-bottom-color: #0a2757 !important;
    }
  }
}
.filterPopover {
  .filterTableHeader {
    background-color: #0a2757;
    width: 285px;
    line-height: 25px;
    text-align: center;
    // border: 1px solid #3f6076;
    border-collapse: collapse;
    color: #ffffff;
    &.filterTableBody {
      margin-bottom: 18px;
    }
    thead {
      background-color: #4e19a0;
    }
    tr {
      height: 30px;
      cursor: pointer;
    }
    td,
    th {
      border: 1px solid #3f6076;
      padding: 5px;
    }
    .thShow {
      width: 100px;
    }
    .thOperateHeader {
      width: 47px;
    }
    .thOperate {
      width: 40px;
    }
    .fieldValue {
      text-align: left;
      padding-left: 10px;
      width: 130px;
    }
    .fieldName {
      text-align: left;
      padding-left: 10px;
      width: 130px;
    }
    .checkedIconContainer {
      width: 14px;
      height: 14px;
      border-radius: 2px;
      background-color: #ffffff;
      margin-right: auto;
      margin-left: auto;
    }
    .checkedIcon {
      width: 14px;
      height: 14px;
      display: block;
    }
  }
  .resetFilterArea {
    border-top: 1px solid #133f58;
    overflow: hidden;
    .resetButton {
      width: 80px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background: #102f63;
      border-radius: 4px;
      border: 1px solid #4f707f;
      margin-top: 10px;
      float: right;
      color: #ffffff;
      cursor: pointer;
    }
  }
}
.orgPopover {
  li {
    color: #ffffff;
    transition: all 0.3s;
    font-size: 12px;
  }
  li:hover {
    background-color: #4b1f98;
    font-size: 12px;
  }
  .in-active-path {
    background-color: #4b1f98;
    color: #ffffff;
    font-weight: normal;
    font-size: 12px;
  }
  .el-cascader-node:not(.is-disabled):hover,
  .el-cascader-node:not(.is-disabled):focus {
    background-color: #4e19a0;
    font-weight: normal;
    font-size: 12px;
  }
  .el-cascader-menu {
    border-right: 1px solid #1b3961;
    font-size: 12px;
  }
}
.typeSelect {
  .el-select__tags {
    .el-tag.el-tag--info {
      background-color: #0a2757;
      border: none;
      color: #fff;
      .el-tag__close {
        display: none;
      }
    }
  }
}
.typeCascader {
  margin-top: -1.5px;
  .el-cascader__tags {
    .el-tag.el-tag--info {
      max-width: 130px;
      background-color: #0a2757;
      color: #fff;
      border: 1px solid #ccc;
      .el-tag__close {
        display: none;
      }
    }
  }
}
.selectPopover {
  li {
    color: #ffffff;
    transition: all 0.3s;
    font-size: 12px;
  }
  li:hover {
    background-color: #4b1f98;
    font-size: 12px;
  }
}
// 后期优化，标签增加tooltip-label时的样式
.el-tooltip__popper.label-infos-tooltip {
  background-color: transparent;
  padding: 10px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  font-size: 10px;
  .father-tag {
    padding: 2px 8px;
    background: rgba(166, 52, 239, 0.3);
    border: 1px solid #a634ef;
    display: inline-block;
    border-radius: 2px;
  }
  .tag-tips {
    margin-top: 4px;
  }
}
</style>
