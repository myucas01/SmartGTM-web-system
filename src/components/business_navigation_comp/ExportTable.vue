<!--
    ---地图图例面板---
-->
<template>
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
        <!-- <a :href="linkUrl" download>
          <span class="el-icon-download downloadIcon"> </span>
        </a> -->
        <template v-if="this.$route.path === '/business-navigate/sale'">
          <span v-auth="'navigation:sell:downloadstore'" class="el-icon-download downloadIcon" @click="downExcel"> </span>
        </template>
        <template v-else>
          <span v-auth="'navigation:question:downloadstore'" class="el-icon-download downloadIcon" @click="downExcel"> </span>
        </template>
      </div>
      <!--表格区域-->
      <div class="tableContainer">
        <!--过滤器表单-->
        <div class="forms">
          <div class="selectArea">
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
          <div class="selectArea">
            <!-- <span class="label">行政架构</span> -->
            <span class="label">组织架构</span>
            <!-- <el-select v-model="typeValue" placeholder="请选择" size="small" class="orgSelect">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>-->
            <!-- <el-cascader
							v-model="orgValue"
							:options="regionTree"
							:props="regionProps"
							separator=">"
							@change="orgChange"
							:show-all-levels="false"
							popper-class="orgPopover"
						></el-cascader> -->
            <select-tree
              width="200"
              :clear="isClear"
              @handleCloseId="treeOptionsClosed"
            />
          </div>
          <div class="selectArea" style="margin-left: 10px">
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
              v-if="filterValue === 'storeType'"
              v-model="inputObj.storeType"
              :options="storeTypeOpts"
              :props="{
                multiple: true,
                emitPath: false,
                label: 'name',
                value: 'name'
              }"
              collapse-tags
              placeholder="请选择"
              size="small"
              class="keyInput typeCascader"
              popper-class="orgPopover"
              :disabled="inputDisable"
            >
            </el-cascader>
            <!-- 客户类型 -->
            <el-cascader
              v-else-if="filterValue === 'customerType'"
              v-model="inputObj.customerType"
              :options="customerTypeOpts"
              :props="{ multiple: true, emitPath: false }"
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
							v-else-if="filterValue === 'storeTags'"
							v-model="inputObj.storeTags"
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
              v-else-if="filterValue === 'storeTags'"
              v-model="inputObj.storeTags"
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
            <!-- 销售区域 -->
            <el-cascader
              v-else-if="filterValue === 'district'"
              v-model="inputObj.district"
              :options="districtOpts"
              :props="{ multiple: true, emitPath: false }"
              collapse-tags
              placeholder="请选择"
              size="small"
              class="keyInput typeCascader"
              popper-class="orgPopover"
              :disabled="inputDisable"
            >
            </el-cascader>
            <!-- 数据状态 -->
            <el-select
              v-else-if="filterValue === 'dataStatus'"
              v-model="inputObj.dataStatus"
              placeholder="请选择"
              size="small"
              class="keyInput"
              popper-class="selectPopover"
            >
              <el-option
                v-for="item in dataStatusOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <!-- 业务状态 -->
            <el-select
              v-else-if="filterValue === 'businessStatus'"
              v-model="inputObj.businessStatus"
              placeholder="请选择"
              size="small"
              class="keyInput"
              popper-class="selectPopover"
            >
              <el-option
                v-for="item in businessStatusOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
            <!-- 销量情况 -->
            <el-select
              v-else-if="filterValue === 'substandard'"
              v-model="inputObj.substandard"
              placeholder="请选择"
              size="small"
              class="keyInput"
              popper-class="selectPopover"
            >
              <el-option
                v-for="item in substandard"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <!-- 成交情况 -->
            <el-cascader
              v-else-if="filterValue === 'dealStatus'"
              v-model="inputObj.dealStatus"
              :options="dealStatus"
              :props="{ multiple: true, emitPath: false }"
              collapse-tags
              placeholder="请选择"
              size="small"
              class="keyInput typeCascader"
              popper-class="orgPopover"
            >
            </el-cascader>
            <!-- 周围环境POI -->
            <el-cascader
              v-else-if="filterValue === 'poi'"
              v-model="inputObj.poi"
              :options="poi"
              :props="{ multiple: true, emitPath: false }"
              collapse-tags
              placeholder="请选择"
              size="small"
              class="keyInput typeCascader"
              popper-class="orgPopover"
            >
            </el-cascader>
            <!-- 既有门店 -->
            <el-cascader
              v-else-if="filterValue === 'visitStatus'"
              v-model="inputObj.visitStatus"
              :options="visitStatus"
              :props="{ multiple: true, emitPath: false }"
              collapse-tags
              placeholder="请选择"
              size="small"
              class="keyInput typeCascader"
              popper-class="orgPopover"
            >
            </el-cascader>
            <!-- 数据异常 -->
            <el-cascader
              v-else-if="filterValue === 'dataErrors'"
              v-model="inputObj.dataErrors"
              :options="dataErrors"
              :props="{ multiple: true, emitPath: false }"
              collapse-tags
              placeholder="请选择"
              size="small"
              class="keyInput typeCascader"
              popper-class="orgPopover"
            >
            </el-cascader>
            <!-- 业务异常 -->
            <el-cascader
              v-else-if="filterValue === 'businessErrors'"
              v-model="inputObj.businessErrors"
              :options="businessErrors"
              :props="{ multiple: true, emitPath: false }"
              collapse-tags
              placeholder="请选择"
              size="small"
              class="keyInput typeCascader"
              popper-class="orgPopover"
            >
            </el-cascader>
            <!-- 标签-模型标签-人流量 -->
            <el-cascader
              v-else-if="filterValue === 'flowrateModel'"
              v-model="inputObj.flowrateModel"
              :options="flowrateModel"
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
            >
            </el-cascader>
            <!-- 标签-模型标签-交通便利 -->
            <el-cascader
              v-else-if="filterValue === 'trafficModel'"
              v-model="inputObj.trafficModel"
              :options="trafficModel"
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
            >
            </el-cascader>
            <!-- 标签-模型标签-消费力指数 -->
            <el-cascader
              v-else-if="filterValue === 'cunsumptionModel'"
              v-model="inputObj.cunsumptionModel"
              :options="cunsumptionModel"
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
            >
            </el-cascader>
            <!-- 标签-模型标签-门店密集程度 -->
            <el-cascader
              v-else-if="filterValue === 'storeDenseModel'"
              v-model="inputObj.storeDenseModel"
              :options="storeDenseModel"
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
            >
            </el-cascader>
            <!-- 标签-模型标签-房价 -->
            <el-cascader
              v-else-if="filterValue === 'housePriceModel'"
              v-model="inputObj.housePriceModel"
              :options="housePriceModel"
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
            >
            </el-cascader>
            <!-- 标签-业务标签 -->
            <el-cascader
              v-else-if="filterValue === 'selfBusiness'"
              v-model="inputObj.selfBusiness"
              :options="selfBusiness"
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
            >
            </el-cascader>
            <!-- 标签-环境标签 -->
            <el-cascader
              v-else-if="filterValue === 'selfEnvironmental'"
              v-model="inputObj.selfEnvironmental"
              :options="selfEnvironmental"
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
                v-if="item.show && item.key !== 'storeTags'"
                :key="item.key"
                :prop="item.key"
                :label="item.name"
                show-overflow-tooltip
                :sortable="
                  item.name === '上次推送时间' || item.name === '同步时间'
                "
                :width="
                  ['上次推送时间', '同步时间', '门店创建时间', '经纬度修改时间', '客户编码'].includes(item.name)
                    ? '150'
                    : (['门店名称', '门店地址'].includes(item.name) ? '200' : '120')
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
                  <div v-if="scope.row[item.key]" class="over-text">
                    {{ scope.row[item.key] }}
                  </div>
                  <div v-else>-</div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="item.show && item.key === 'storeTags'"
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
                        v-for="(item, index) in scope.row.storeTags.filter(
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
          </el-table>
        </div>
      </div>
      <!--分页区域-->
      <div class="pageList">
        <div class="totlaNum">
          共 {{ totalNumber }} 条数据 第 {{ currentPage }} / {{ totalPage }} 页
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
      <div class="bottomMenu" v-if="this.$route.path === '/business-navigate/sale'">
        <div v-auth="'navigation:sell:sendstore'" class="buttonList exportButton" @click="exportCurrentList">
          推送
        </div>
        <div class="buttonList goBackButton" @click="closePop">返回</div>
      </div>
      <div class="bottomMenu" v-else>
        <div v-auth="'navigation:question:sendstore'" class="buttonList exportButton" @click="exportCurrentList">
          推送
        </div>
        <div class="buttonList goBackButton" @click="closePop">返回</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { Notification } from 'element-ui'
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import BUSINESS_NAVIGATE_API from '../../../api/business_navigate_api'
import BUSINESS_NAVIGATION_API from '../../../api/business_navigate_api'
import SelectTree from '@/views/route-planning-views/GolbalConfigComponents/selectTree'

// 筛选字段下拉框
const storeExportHeader = [
  {
    key: 'storeId',
    name: '门店ID',
    show: false, // 字段在表格中显示/隐藏
    filter: true, // 该字段是否可以过滤
    multi: false // 该字段是否可以多选
  },
  {
    key: 'storeCode',
    name: '客户编码',
    show: true,
    filter: true,
    multi: false
  },
  {
    key: 'name',
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
    key: 'gdLng',
    name: '门店经度',
    show: false,
    filter: false,
    multi: false
  },
  {
    key: 'gdLat',
    name: '门店纬度',
    show: false,
    filter: false,
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
    // key: 'storeClassification',
    key: 'storeType',
    name: '门店类型',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'empName',
    name: '客户经理',
    show: true,
    filter: true,
    multi: false
  },
  {
    key: 'agencyName',
    name: '经销商名称',
    show: false,
    filter: true,
    multi: false
  },
  {
    key: 'callDate',
    name: '同步时间',
    show: false,
    filter: false,
    multi: false
  },
  {
    key: 'dataStatus',
    name: '数据状态',
    show: true,
    filter: true,
    multi: false
  },
  {
    key: 'businessStatus',
    name: '业务状态',
    show: true,
    filter: true,
    multi: false
  },
  {
    key: 'pushStatus',
    name: '推送状态',
    show: true,
    filter: true,
    multi: false
  },
  {
    key: 'exportTime',
    name: '上次推送时间',
    show: true,
    filter: false,
    multi: false
  },
  {
    key: 'substandard',
    name: '标签-销量情况',
    show: false,
    filter: true,
    multi: false
  },
  {
    key: 'dealStatus',
    name: '标签-成交情况',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'poi',
    name: '标签-周围环境POI',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'visitStatus',
    name: '标签-既有门店',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'dataErrors',
    name: '标签-数据异常',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'businessErrors',
    name: '标签-业务异常',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'flowrateModel',
    name: '标签-人流量',
    show: false,
    filter: true,
    multi: true,
  },
  {
    key: 'trafficModel',
    name: '标签-交通便利',
    show: false,
    filter: true,
    multi: true,
  },
  {
    key: 'cunsumptionModel',
    name: '标签-消费力指数',
    show: false,
    filter: true,
    multi: true,
  },
  {
    key: 'storeDenseModel',
    name: '标签-门店密集程度',
    show: false,
    filter: true,
    multi: true,
  },
  {
    key: 'housePriceModel',
    name: '标签-房价',
    show: false,
    filter: true,
    multi: true,
  },
  {
    key: 'selfBusiness',
    name: '标签-业务标签',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'selfEnvironmental',
    name: '标签-环境标签',
    show: false,
    filter: true,
    multi: true
  },
]
// 表格列信息
const storeExportHeaderS = [
  {
    key: 'storeId',
    name: '门店ID',
    show: false, // 字段在表格中显示/隐藏
    filter: true, // 该字段是否可以过滤
    multi: false // 该字段是否可以多选
  },
  {
    key: 'storeCode',
    name: '客户编码',
    show: true,
    filter: true,
    multi: false
  },
  {
    key: 'name',
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
    key: 'gdLng',
    name: '门店经度',
    show: false,
    filter: false,
    multi: false
  },
  {
    key: 'gdLat',
    name: '门店纬度',
    show: false,
    filter: false,
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
    // key: 'storeClassification',
    key: 'storeType',
    name: '门店类型',
    show: false,
    filter: true,
    multi: true
  },
  // km-增加客户类型
  {
    key: 'storeClassification',
    name: '客户类型',
    show: true,
    // filter: true,
    filter: false,
    multi: false,
  },
  {
    key: 'empName',
    name: '客户经理',
    show: true,
    filter: true,
    multi: false
  },
  // {
  // 	key: 'district',
  // 	name: '销售区域',
  // 	show: true,
  // 	filter: true,
  // 	multi: false,
  // },
  {
    key: 'agencyName',
    name: '经销商名称',
    show: false,
    filter: true,
    multi: false
  },
  {
    key: 'callDate',
    name: '同步时间',
    show: false,
    filter: false,
    multi: false
  },
  // ky 新增 5个
  {
    key: 'dataStatus',
    name: '数据状态',
    show: true,
    filter: true,
    multi: false
  },
  {
    key: 'businessStatus',
    name: '业务状态',
    show: true,
    filter: true,
    multi: false
  },
  {
    key: 'pushStatus',
    name: '推送状态',
    show: true,
    filter: true,
    multi: false
  },
  {
    key: 'exportTime',
    name: '上次推送时间',
    show: true,
    filter: false,
    multi: false
  },
  {
    key: 'storeTags',
    name: '标签信息',
    show: true,
    filter: true,
    // multi: true,
    multi: false
  },
  {
    key: 'provinceName',
    name: '省',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'cityName',
    name: '市',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'areaName',
    name: '区',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'streetName',
    name: '街道',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'lngLatSource',
    name: '最终经纬度来源',
    show: true,
    filter: true,
    multi: true
  },
  {
    key: 'lngLatUpdateTime',
    name: '经纬度修改时间',
    show: true,
    filter: true,
    multi: true
  },
  {
    key: 'orgNameTree',
    name: '组织架构',
    show: false,
    filter: true,
    multi: true
  },
  {
    key: 'storeCreateTime',
    name: '门店创建时间',
    show: false,
    filter: true,
    multi: true
  },
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
        // { value: "行政边界", label: "行政边界" },
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
      storeTableData: [
        // 接口请求到的表格数据
        // {
        // 	id: "4622606934",
        // 	storeId: "4962550716883676517",
        // 	name: "王二的常客隆海虞高中店",
        // 	address:
        // 		"上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄",
        // 	tel: "13455554341",
        // 	exportTime: "2020-10-10 10:10:00",
        // 	storeTags: [
        // 		"门店产值高",
        // 		"门店产值高",
        // 		"门店产值高",
        // 		"门店产值高",
        // 		"门店产值高",
        // 	],
        // 	isShow: false,
        // },
      ],
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
      dataStatusOpts: [
        // 数据状态下拉框数据
        { label: '数据正常门店', value: '0' },
        { label: '数据异常门店', value: '1' }
      ],
      businessStatusOpts: [
        // 业务状态下拉框数据
        { label: '业务正常门店', value: '0' },
        { label: '业务异常门店', value: '1' }
      ],
      pushStatusOpts: [
        // 推送状态下拉框数据
        { label: '已推送', value: '0' },
        { label: '未推送', value: '1' }
      ],
      // 门店类型可选数据
      storeTypeOpts: [],
      // 客户类型可选数据
      customerTypeOpts: [],
      // 标签信息可选数据
      labelTypeOpts: [],
      // 销售区域可选数据
      districtOpts: [],
      //标签-销量情况下拉框数据
      substandard: [
        { label: '达标', value: '0' },
        { label: '不达标', value: '1' }
      ],
      //标签-成交情况下拉框数据
      dealStatus: [
        { label: '月月活', value: '1' },
        { label: '双月活', value: '2' },
        { label: '近期活跃', value: '3' },
        { label: '连续两个月未成交', value: '4' },
        { label: '未成交', value: '5' }
      ],
      //标签-周围环境POI下拉框数据
      poi: [],
      //标签-既有门店下拉框数据
      visitStatus: [
        { label: '新店', value: '0' },
        { label: '已拜访', value: '1' },
        { label: '未拜访', value: '2' }
      ],
      //标签-数据异常下拉框数据
      dataErrors: [
        { label: '门店编码错误', value: '1' },
        { label: '门店地址无效', value: '2' },
        { label: '门店名称无效', value: '3' },
        { label: '门店信息无效', value: '4' },
        { label: '经纬度与门店地址不匹配', value: '5' },
        { label: '经纬度缺失', value: '6' },
        { label: '经纬度在特殊地形', value: '7' },
        { label: '缺少客户类型', value: '8' },
        { label: '门店类型异常', value: '9' },
        { label: '客户经理缺失', value: '10' },
        { label: '与GAIA环境标签不匹配', value: '13' }
      ],
      //标签-门店异常下拉框数据
      businessErrors: [
        { label: '销量不达标', value: '1' },
        { label: '连续两个月未成交', value: '2' },
        { label: '未成交', value: '3' },
        { label: '门店落在营业所边界外', value: '4' },
        { label: '门店落在重叠区域', value: '5' }
      ],
      // 标签-业务标签下拉框数据
      selfBusiness: [],
      // 标签-环境标签下拉框数据
      selfEnvironmental: [],
      // 模型标签名称list
      modelList: ['flowrateModel', 'trafficModel', 'cunsumptionModel', 'storeDenseModel', 'housePriceModel'],
      // 模型标签-人流量下拉框数据
      flowrateModel: [],
      // 模型标签-交通便利下拉框数据
      trafficModel: [],
      // 模型标签-消费力指数下拉框数据
      cunsumptionModel: [],
      // 模型标签-门店密集程度下拉框数据
      storeDenseModel: [],
      // 模型标签-房价下拉框数据
      housePriceModel: [],
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
        if (this.orgId) {
          this.orgValue = this.orgId // 初始化赋值
        } else if (this.$cookies.get('orgId')) {
          this.orgValue = this.$cookies.get('orgId')
        } else {
          this.orgValue = '5074727057550190748' // 苏州区域
        }
        this.getTableData()
      } else {
        this.isClear = false
        this.orgValue = ''
      }
    },
    // 消息 监听 刷新列表 同步数据状态
    currentMessage() {
      if (this.currentMessage) {
        let currentMessage = JSON.parse(this.currentMessage)
        if (currentMessage.bussinessCode === '106') {
          if (currentMessage.status === 200) {
            setTimeout(() => {
              this.getTableData()
            }, 1000)
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters('common', ['currentMessage']),
    orgId() {
      return this.$route.query.orgId
      // return '5755978390254457341'; // mock 四川行销公司
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
      return `/api/bn/store/export?${tempParam}`
    }
  },
  mounted() {
    this.getRegionList()
    this.getTypeList()
    this.getIconList()
    this.getCustomerTypeList()
    this.getLabelTypeList()
    this.getDistrictList()
    this.getStorePoiList()
    this.getEnvironmentLabeList()
    this.getModelLabeList()
    this.tableHeader = JSON.parse(JSON.stringify(storeExportHeaderS))
    // 筛选下拉框数据
    this.filterHeaders = []
    storeExportHeader.forEach(item => {
      if (item.filter) this.filterHeaders.push(item)
    })
    this.filterHeaders.forEach(item => {
      if (item.multi) {
        this.$set(this.inputObj, item.key, [])
      } else {
        this.$set(this.inputObj, item.key, '')
      }
    })
  },
  methods: {
    // ---------------------------------------------------------
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
      const tempList = await BUSINESS_NAVIGATE_API.get_store_type_list({
        cate: 2
      })
      tempList.forEach(item => {
        this.storeTypeOpts.push({
          id: item.name,
          name: item.name,
          children: item.children
        })
      })
    },
    //获取周边环境POI下拉框
    async getStorePoiList() {
      this.poi = []
      const poiDate = await BUSINESS_NAVIGATION_API.get_poi_list()
      poiDate.forEach(re => {
        re = {
          label: re.name,
          value: re.name
        }
        this.poi.push(re)
      })
    },
    // 获取行政结构(目前先改成组织架构)
    async getRegionList() {
      // 行政架构树
      // const res = await BUSINESS_NAVIGATE_API.sync_region_list({});
      // 组织架构树
      const res = await BUSINESS_NAVIGATE_API.sync_group_list({})
      if (res && res.length) {
        this.regionTree = res
      } else {
        this.regionTree = []
      }
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
    // 获取 业务标签和环境标签
    async getEnvironmentLabeList() {
      const tempList = await BUSINESS_NAVIGATE_API.get_self_tags_list({})
      this.selfBusiness = tempList[0].tagList
      this.selfEnvironmental = tempList[1].tagList
    },
    // 获取 模型标签【标签、标签】
    async getModelLabeList() {
      const tempList = await BUSINESS_NAVIGATE_API.get_model_tags_list({})
      this.flowrateModel = tempList['人流量']
      this.trafficModel = tempList['交通便利']
      this.cunsumptionModel = tempList['消费力指数']
      this.storeDenseModel = tempList['门店密集程度']
      this.housePriceModel = tempList['房价']
    },
    // 格式化传参
    formatParams(isCheck = false) {
      // 处理门店类型，地址栏中的storeType 和 筛选字段中的storeType 组合在一起
      let tempStoreType = this.queryObj.storeType
        ? this.queryObj.storeType.split(',')
        : []
      // 全路径
      // let tempStoreType = []
      // if (this.inputObj.storeType && this.inputObj.storeType.length) {
      //   this.inputObj.storeType.forEach(item => {
      //     // const leaf = item.lastIndexOf(0); // 全路径-获取根节点id
      //     // tempStoreType.push(leaf);
      //     tempStoreType.push(item) // 只保留叶子节点的时候
      //   })
      // }

      // 处理inputObj中是数组的项 [1, 2, 3] -> '1,2,3'
      const tempInputObj = {
        modelTagTag: '',
        storeIds: isCheck ? this.multipleSelection : [] // 勾选的id 只有下载和推送时传
      }
      let modelTagArr = [] // 选中的模型标签
      for (let it in this.inputObj) {
        // 属于模型标签的单独处理 整合在一个字段里
        if (Array.isArray(this.inputObj[it]) && this.modelList.includes(it)) {
          modelTagArr = modelTagArr.concat(this.inputObj[it])
          tempInputObj.modelTagTag = modelTagArr.join(',')
        } else if (Array.isArray(this.inputObj[it])) {
          tempInputObj[it + 'Tag'] = this.inputObj[it].join(',')
        } else {
          tempInputObj[it + 'Tag'] = this.inputObj[it]
        }
      }

      const params = {
        ...this.queryObj,
        orgId: this.orgValue,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        type: this.typeValue.map(item => item).join(','),
        storeType: tempStoreType.join(','),
        ...tempInputObj
      }
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
          if (res.code === '200') {
            this.$message({
              message: res.extData ? res.message : res.data,
              type: res.extData ? 'warning' : 'success',
              showClose: true
            })
            if (!res.extData) {
              setTimeout(() => {
                this.getTableData()
              }, 1000);
            }
          }
        }
      )
    },
    // 关闭弹窗
    closePop() {
      this.$emit('switchShowExportTable', false)
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

      BUSINESS_NAVIGATE_API.get_export_store_list(
        this.formatParams(false)
      ).then(res => {
        const { pageNum, totalSize, totalPages, content } = res
        this.currentPage = pageNum
        this.totalNumber = totalSize
        this.totalPage = totalPages
        if (content && content.length) {
          content.forEach(item => {
            this.tableData.push({
              isShow: false, // 标签展示/隐藏
              ...item
            })
          })
        }
      })
    },
    typeValueChanged() {
      this.currentPage = 1
      this.getTableData()
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
      // let arr = [];
      // this.storeTableData.forEach((item) => {
      // 	if (this.selectedFilters.length) {
      // 		const bol = this.selectedFilters.every((cell) => {
      // 			// storeTags字段是数组 分开处理
      // 			if (cell === 'storeTags' && item.storeTags && item.storeTags.length) {
      // 				const joinTypes = item.storeTags.join(',');
      // 				return joinTypes.includes(this.inputObj[cell]);
      // 			} else {
      // 				return item[cell].includes(this.inputObj[cell]);
      // 			}
      // 		});
      // 		// 选择的筛选字段 均符合要求 放入临时数组里
      // 		if (bol) arr.push(item);
      // 	} else {
      // 		arr.push(item);
      // 	}
      // });
      // this.tableData = arr;
      // test
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
    downExcel() {
      Notification({
        title: '已经开始下载',
        type: 'success',
        duration: 5000,
        showClose: true,
      })
      const iframeVisit = document.createElement('iframe')
      iframeVisit.style.display = 'none'
      iframeVisit.style.height = 0
      iframeVisit.src = this.linkUrl
      document.body.appendChild(iframeVisit)
    },
  }
}
</script>

<style scoped lang="scss">
.exportTablePop {
  #export_table {
    width: 1237px;
    height: 600px;
    // position: absolute;
    // z-index: 10;
    // margin: auto;
    // left: 0;
    // right: 0;
    // top: 0;
    // bottom: 0;
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
        margin-right: 20px;
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
</style>
