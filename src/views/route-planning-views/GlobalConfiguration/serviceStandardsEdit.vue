<template>
  <div class="service-standards-edit-wrapper">
    <div class="main-container">
      <div class="info-wrap">
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <el-form-item
              label="配置名称"
              prop="inputVal"
              :label-width="formLabelWidth"
              :rules="[{ validator: inputValueValidate, trigger: 'blur' }]"
          >
            <el-input
                v-model="form.inputVal"
                size="small"
                placeholder="请输入配置名称"
                @blur="updateStandardName"
                :disabled="isDisable"
            ></el-input>
          </el-form-item>
          <el-form-item label="更新时间" :label-width="formLabelWidth">
            <span class="time">{{
                form.time | dateFormat('YYYY-MM-DD HH:mm:ss')
              }}</span>
            <span class="log" v-show="serviceType" @click="handleLogDialog" v-auth="'lineplan:config:serve:loglist'"
            >查看操作日志</span
            >
          </el-form-item>
          <el-form-item label="应用对象" :label-width="formLabelWidth">
            <!-- <span class="apply">{{form.count}}</span> -->
            <el-popover
                placement="bottom"
                popper-class="popper-class-apply-wrapper"
                width="250"
                trigger="hover"
            >
              <el-tree
                  :data="treeData"
                  :props="defaultProps"
                  default-expand-all
              ></el-tree>
              <span class="apply" slot="reference"
              >{{ form.count }}个营业所</span
              >
            </el-popover>
          </el-form-item>
        </el-form>
      </div>
      <div class="bg-wrap">
        <div class="tabs-wrap" style="display: none;">
          <span
              class="sub-tab-item"
              v-for="(item, idx) in subTabsData"
              :key="idx"
              :class="{'active': activeIndex === idx}"
              @click="tabChanged(idx)">
            {{ item.text }}
          </span>
        </div>
        <div class="content-wrap">
          <div class="content-tab" v-show="activeIndex === 0">
            <div class="btn-add" v-show="!isDisable">
              <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="addtableItem(0)"
              >
                添加职务类型
              </el-button>
            </div>
            <div class="table-block">
              <el-table
                  class="global-configuration-table"
                  :data="tableData0"
                  border
                  fit
                  max-height="210"
                  style="width: 100%"
              >
                <el-table-column prop="" label="职务" width="300">
                  <template slot-scope="scope">
                    <div>
                      <el-select
                          v-model="scope.row.salesTypeCode"
                          placeholder="请选择"
                          size="small"
                          filterable
                          @change="
                          dutyOptionChanged(
                            scope.$index,
                            scope.row.salesTypeCode
                          )
                        "
                          :disabled="isDisable"
                      >
                        <el-option
                            v-for="item in dutyOptions"
                            :key="item.typeCode"
                            :label="item.typeName"
                            :value="item.typeCode"
                            :disabled="disableDutyOpts.includes(item.typeCode)"
                        >
                        </el-option>
                      </el-select>
                    </div>
                    <!-- 2 -->
                    <!-- <div>
                      <el-select
                        v-model="scope.row.salesType.salesTypeCode"
                        placeholder="请选择"
                        size="small"
                        @change="dutyOptionChanged(scope.$index, scope.row.salesType.salesTypeCode)">
                        <el-option
                          v-for="item in dutyOptions"
                          :key="item.typeCode"
                          :label="item.typeName"
                          :value="item.typeCode"
                          :disabled="disableDutyOpts.includes(item.typeCode)">
                        </el-option>
                      </el-select>
                    </div> -->
                  </template>
                </el-table-column>
                <el-table-column label="客户">
                  <template slot-scope="scope">
                    <div>
                      <div
                          class="type-item"
                          v-for="(cell, i) in scope.row.customers"
                          :key="i"
                      >
                        <el-select
                            v-model="scope.row.customers[i]['customerId']"
                            placeholder="请选择"
                            size="small"
                            value-key="customerId"
                            filterable
                            @change="
                            typeOptionChanged(
                              scope.$index,
                              i,
                              scope.row.customers[i]['customerId']
                            )
                          "
                            :disabled="isDisable"
                        >
                          <el-option
                              v-for="item in typeOptions"
                              :key="item.typeCode"
                              :label="item.typeName"
                              :value="item.typeCode"
                              :disabled="disableTypeOpts.includes(item.typeCode)"
                          >
                          </el-option>
                        </el-select>
                        <i
                            class="el-icon-remove-outline icon-style"
                            @click="removeItem(scope.row, i, scope.$index)"
                            v-show="!isDisable"
                        >
                        </i>
                        <i
                            class="el-icon-circle-plus-outline icon-style"
                            v-show="
                            (i > 0 || scope.row.customers.length === 1) &&
                              !isDisable
                          "
                            @click="addItem(scope.row)"
                        >
                        </i>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="content-tab" v-show="activeIndex === 1">
<!--            <div class="btn-add" v-show="!isDisable">-->
<!--              <el-button-->
<!--                  type="primary"-->
<!--                  icon="el-icon-plus"-->
<!--                  size="mini"-->
<!--                  @click="addtableItem(1)"-->
<!--              >-->
<!--                新增-->
<!--              </el-button>-->
<!--            </div>-->
            <div class="table-block" style="display: none;">
              <el-table
                  class="global-configuration-table"
                  :data="tableData1"
                  border
                  :max-height="tableHeight"
                  style="width: 100%"
                  :span-method="objectSpanMethod"
              >
                <el-table-column align="center" width="80">
                  <template slot="header">
                    <p class="weight-header">客户分级</p>
                  </template>
                  <template slot-scope="scope">
                    <div>{{ scope.row.labelName }}</div>
                  </template>
                </el-table-column>
                <el-table-column align="center" width="120">
                  <template slot="header">
                    <p class="weight-header">客户类型</p>
                  </template>
                  <template slot-scope="scope">
                    <div v-if="scope.row.storeTypeName">
                      <p
                          v-for="(cell, i) in scope.row.storeTypeName.split(',')"
                          :key="i"
                          class="bg-type"
                      >
                        {{ cell }}
                      </p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                    v-for="(item, idx) in columns1"
                    :key="idx"
                    :label="item.label"
                    :prop="item.prop"
                    :align="item.textAlign"
                >
                  <template slot="header">
                    <p class="weight-header" v-if="item.label === '客户类型'">
                      {{ item.label }}
                    </p>
                    <p class="weight-header column-header" v-else>
                      {{ item.label }}
                    </p>
                  </template>
                  <!-- <template v-show="!item.children" slot-scope="scope">
                    <div>
                      <p v-for="(ce, k) in scope.row[item.prop]"
                        :key="k"
                        class="bg-type">
                        {{ce}}
                      </p>
                    </div>
                  </template> -->
                  <el-table-column
                      v-show="item.children"
                      v-for="(cell, i) in item.children"
                      :key="i"
                      :label="cell.label"
                      :prop="cell.prop"
                      :align="cell.textAlign"
                  >
                    <template slot="header">
                      <p class="weight-header">{{ cell.label }}</p>
                      <p class="normal-header">{{ cell.subLabel }}</p>
                    </template>
                    <template slot-scope="scope">
                      <div v-if="i % 2 === 0">
                        {{ scope.row.data[idx] ? scope.row.data[idx].visitTimes : '-' }}
                      </div>
                      <div v-else>
                        {{ scope.row.data[idx] ? scope.row.data[idx].visitDuration : '-' }}
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column align="center" width="120" v-if="!isDisable">
                  <template slot="header">
                    <p class="weight-header">操作</p>
                  </template>
                  <template slot-scope="scope">
                    <div>
                                  <span class="btn-edit" @click="handleEdit(scope.row)">
                                    编辑
                                  </span>
                      <span class="btn-delete" @click="handleDelete(scope.row)">
                                    删除
                                  </span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="table-block">
              <el-table
                  :data="threeVos"
                  border
                  :max-height="tableHeight"
                  :header-cell-style="tableHeaderColor"
                  :cell-style="cellHeight"
                  :span-method="rightMerge">
                <el-table-column
                    prop="grandfather"
                    label="通路/渠道"
                    align="center"
                    width="100">
                  <div slot="header" class="table-item-header">通路/渠道</div>
                </el-table-column>
                <el-table-column
                    prop="parent"
                    label="渠道"
                    align="center"
                    width="100">
                  <div slot="header" class="table-item-header">渠道</div>
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.desc" placement="top-start">
                     <span>{{scope.row.parent}}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="configBigName"
                    label="客户分级"
                    align="center"
                    width="80">
                  <div slot="header" class="table-item-header">客户分级</div>
                </el-table-column>
                <el-table-column>
                  <div slot="header" class="diy-header">
                    0-3组货架
                  </div>
                  <el-table-column
                      prop="configBigName"
                      label="拜访频率" align="center">
                    <div slot="header" class="table-item-header">
                      拜访频率
                      <p>（次/周）</p>
                    </div>
                    <template slot-scope="OScope">
                      {{ OScope.row.data | filterParams(0, 'visitTimes') }}
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="configBigName"
                      label="在店时长参考" align="center">
                    <div slot="header" class="table-item-header">
                      在店时长参考
                      <p>（分钟/次）</p>
                    </div>
                    <template slot-scope="OScope">
                      {{ OScope.row.data | filterParams(0, 'visitDuration')}}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column>
                  <div slot="header" class="diy-header">
                    4-6组货架
                  </div>
                  <el-table-column
                      prop="configBigName"
                      label="拜访频率" align="center">
                    <div slot="header" class="table-item-header">
                      拜访频率
                      <p>（次/周）</p>
                    </div>
                    <template slot-scope="OScope">
                      {{ OScope.row.data | filterParams(1, 'visitTimes') }}
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="configBigName"
                      label="在店时长参考" align="center">
                    <div slot="header" class="table-item-header">
                      在店时长参考
                      <p>（分钟/次）</p>
                    </div>
                    <template slot-scope="OScope">
                      {{ OScope.row.data |filterParams(1, 'visitDuration') }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column>
                  <div slot="header" class="diy-header">
                    7组及以上货架
                  </div>
                  <el-table-column
                      prop="configBigName"
                      label="拜访频率" align="center">
                    <div slot="header" class="table-item-header">
                      拜访频率
                      <p>（次/周）</p>
                    </div>
                    <template slot-scope="OScope">
                      {{ OScope.row.data | filterParams(2, 'visitTimes') }}
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="configBigName"
                      label="在店时长参考" align="center">
                    <div slot="header" class="table-item-header">
                      在店时长参考
                      <p>（分钟/次）</p>
                    </div>
                    <template slot-scope="OScope">
                      {{ OScope.row.data | filterParams(2, 'visitDuration') }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                    prop="configBigName"
                    align="center"
                    label="操作">
                  <div slot="header" class="table-item-header">操作</div>
                  <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="handleDelete(scope.row)" type="text" size="small" style="color: #F56C6C">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-wrap" v-show="activeIndex === 0 && !isDisable">
        <span :class="{ disable: nextDisabled }" @click="handleSave">保存</span>
      </div>
    </div>
    <div class="btn-wrap-return" v-show="isReturn">
      <el-button type="primary" size="small" @click="handleReturn">保存</el-button>
    </div>
    <el-dialog title="提示" :visible.sync="tipDialogVisible" width="350px">
      <div style="text-align: center">确认删除吗</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tipDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteTab2Item">确 定</el-button>
      </span>
    </el-dialog>
    <log-dialog
        type="服务标准"
        :visible="logDialogVisible"
        @handleClose="logDialogClosed"
    />
    <edit-dialog
        :isEdit="isEdit"
        :row="rowInfo"
        :disableVisitOpts="disableVisitOpts"
        :inputVal="form.inputVal"
        :templateId="templateId"
        :visible="addDialogVisible"
        @handleClose="addDialogClosed"
    />
  </div>
</template>

<script>
import LogDialog from '../GolbalConfigComponents/logDialog'
import EditDialog from '../GolbalConfigComponents/serviceStandardsEditDialog'
import ROUTE_PLANNING_API from '@api/route/index'
export default {
  name: 'serviceStandardsEdit',
  components: {
    LogDialog,
    EditDialog
  },
  filters: {
    filterParams(val, index, key) {
      if (val) {
        if(val[index]) {
          return val[index][key]
        } else {
          return '-'
        }
      } else {
        return '-'
      }
    }
  },
  data() {
    return {
      spanData: [],
      twoVos: [],
      threeVos: [],
      threeSpanData: [],
      mockTable: [],
      tableHeight: 300,
      formLabelWidth: '120px',
      templateId: '',
      form: {
        inputVal: '',
        // time: '2020-10-10 09:10:10',
        time: '',
        // count: 15,
        count: 0
      },
      logDialogVisible: false,
      subTabsData: [
        // {
        //   text: '服务关系',
        //   id: '100',
        // },
        {
          text: '拜访频次与在店时长',
          id: '200'
        }
      ],
      // activeIndex: 0,
      activeIndex: 1,
      dutyOptions: [],
      typeOptions: [],
      // 服务关系 table
      tableData0: [
        {
          // salesType: {
          //   salesTypeCode: '',
          //   salesTypeName: '',
          // },
          salesTypeCode: '',
          salesTypeName: '',
          customers: [
            {customerId: '', customerName: ''},
            {customerId: '', customerName: ''}
          ]
        }
      ],
      // 拜访频次与在店时长 table
      columns1: [
        // {
        //   label: '客户类型',
        //   prop: 'type',
        //   textAlign: 'center',
        // },
        {
          label: '0-3组货架',
          prop: '',
          textAlign: 'center',
          children: [
            {
              label: '拜访频率',
              subLabel: '(次/周)',
              prop: 'fridgeHighFreq',
              textAlign: 'center'
            },
            {
              label: '在店时长',
              subLabel: '(分钟/次)',
              prop: 'fridgeHighTime',
              textAlign: 'center'
            }
          ]
        },
        {
          label: '4-6组货架',
          prop: '',
          textAlign: 'center',
          children: [
            {
              label: '拜访频率',
              subLabel: '(次/周)',
              prop: 'fridgePotentialFreq',
              textAlign: 'center'
            },
            {
              label: '在店时长',
              subLabel: '(分钟/次)',
              prop: 'fridgePotentialTime',
              textAlign: 'center'
            }
          ]
        },
        {
          label: '7组及以上货架',
          prop: '',
          textAlign: 'center',
          children: [
            {
              label: '拜访频率',
              subLabel: '(次/周)',
              prop: 'fridgeBaseFreq',
              textAlign: 'center'
            },
            {
              label: '在店时长',
              subLabel: '(分钟/次)',
              prop: 'fridgeBaseTime',
              textAlign: 'center',
            },
          ],
        },
      ],
      tableData1: [],
      nextDisabled: false,
      tipDialogVisible: false, // 删除提示对话框
      addDialogVisible: false, // 编辑/新增对话框
      isEdit: false, // 编辑/新增
      rowInfo: {}, // 编辑时某行的数据传入dialog
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // disableDutyOpts: [],
      // disableTypeOpts: [],
      rowId: '',
      addServiceId: '', // 新增时 接口返回的服务ID
      rules: {},
      fridgeTypes: [
        {
          name: 'A',
          id: '007',
        },
        {
          name: 'B',
          id: '008',
        },
        {
          name: '其他',
          id: '009',
        },
      ],
      disableVisitOpts: [], // 客户分级 禁用的选项[[...], [...], [...]]
    }
  },
  computed: {
    serviceName() {
      return (
          this.$store.state.routerPlanning.currentServiceName ||
          sessionStorage.getItem('currentServiceName')
      )
    },
    serviceId() {
      return (
          this.$store.state.routerPlanning.currentServiceId ||
          sessionStorage.getItem('currentServiceId')
      )
    },
    serviceType() {
      return Boolean(
          this.$store.state.routerPlanning.currentServiceType ||
          sessionStorage.getItem('currentServiceType')
      )
    },
    // 职务禁用的选项
    disableDutyOpts() {
      // return this.tableData0.map(item => item.salesType.salesTypeCode);
      return this.tableData0.map(item => item.salesTypeCode)
    },
    //客户禁用的选项
    disableTypeOpts() {
      let tempArr = []
      this.tableData0.forEach(item => {
        tempArr = tempArr.concat(item.customers)
      })
      return tempArr.map(cell => cell.customerId)
    },
    // disableVisitOpts() {
    //   let tempStr = ''
    //   this.tableData1.forEach((item, idx) => {
    //     if (idx === 0) {
    //       tempStr += item.storeTypeCode
    //     } else {
    //       tempStr += `,${item.storeTypeCode}`
    //     }
    //   })
    //   return tempStr.split(',')
    // },
    // 表格是否可编辑
    isDisable() {
      return this.$store.state.routerPlanning.currentServiceDisable
    },
    isReturn() {
      // return this.$route.query.isReturn === 'true';
      return true;
    },
  },
  created() {
    this.getTypeOptions()
    if (this.serviceType) {
      this.getTableData()
      this.getTreeData()
    } else {
      this.form.time = new Date()
      this.form.count = 0
      this.treeData = []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 400
      window.onresize = () => {
        this.tableHeight = window.innerHeight - 400
      }
    })
    this.dataDeal()
  },
  methods: {
    inputValueValidate: (rule, value, callback) => {
      const reg = /^[\w\u4E00-\u9FA5\uF900-\uFA2D]*$/g
      if (value === '') {
        callback(new Error('请填写配置名称'))
      } else if (value.length > 20) {
        callback(new Error('服务关系名称长度不超过20个字符'))
      } else if (!reg.test(value)) {
        callback(new Error('服务关系名称仅支持中英文、数字和下划线'))
      } else {
        callback()
      }
    },
    // 通过下拉框id获取对应名称
    handleSelectName(id) {
      let name = ''
      this.dutyOptions.filter(item => {
        if (item.typeCode === id) {
          name = item.typeName
        }
      })
      return name
    },
    getTypeOptions() {
      this.typeOptions = []
      this.dutyOptions = []
      ROUTE_PLANNING_API.get_service_position_list('sales_base')
          .then(res => {
            const {code, data} = res
            if (code === '200') {
              if (data && data.length) {
                data.forEach(item => {
                  this.typeOptions.push(item)
                  this.dutyOptions.push(item)
                })
              }
            }
          })
          .catch(err => {
            console.log(err)
            this.typeOptions = []
            this.dutyOptions = []
          })
    },
    handleLogDialog() {
      // 查看操作日志
      this.logDialogVisible = true
    },
    logDialogClosed() {
      this.logDialogVisible = false
    },
    tabChanged(idx) {
      this.activeIndex = idx
    },
    addtableItem(idx) {
      if (idx === 0) {
        // tab1下新增
        const obj = {
          // salesType: {
          //   salesTypeCode: '', // 职务id
          //   salesTypeName: '', // 职务名称
          // },
          salesTypeCode: '', // 职务id
          salesTypeName: '', // 职务名称
          customers: [
            {customerId: '', customerName: ''},
            {customerId: '', customerName: ''}
          ]
        }
        this.tableData0.push(obj)
      } else {
        // tab2下新增
        // --------服务关系名称提示---------
        const reg = /^[\w\u4E00-\u9FA5\uF900-\uFA2D]*$/g
        if (this.form.inputVal === '') {
          this.$message({
            message: '请填写服务关系名称',
            type: 'warning',
            showClose: true,
          })
          return
        } else if (this.form.inputVal.length > 20) {
          this.$message({
            message: '服务关系名称长度不超过20个字符',
            type: 'warning',
            showClose: true,
          })
          return
        } else if (!reg.test(this.form.inputVal)) {
          this.$message({
            message: '服务关系名称仅支持中英文、数字和下划线',
            type: 'warning',
            showClose: true,
          })
          return
        }
        // --------服务关系名称验证---------
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.rowInfo = {}
            this.isEdit = false
            this.addDialogVisible = true
          }
        })
      }
    },
    dutyOptionChanged(idx, val) {
      // console.log('val', idx, val);
      // 根据职务id 记录table该行对应的职务名称
      // this.tableData0[idx].salesType.salesTypeName = this.handleSelectName(val);
      this.tableData0[idx].salesTypeName = this.handleSelectName(val)
    },
    typeOptionChanged(idx, i, val) {
      // console.log(idx, i, val);
      // 根据客户id 记录对应的客户名称
      this.tableData0[idx].customers[i].customerName = this.handleSelectName(
          val
      )
    },
    removeItem(item, i, rowIndex) {
      item.customers.splice(i, 1)
      if (item.customers.length === 0) {
        this.tableData0.splice(rowIndex, 1)
      }
    },
    addItem(item) {
      const obj = {
        type: this.typeOptions[0].value
      }
      item.customers.push(obj)
    },
    handleEdit(row) {
      // console.log(row);
      this.rowInfo = row
      this.isEdit = true
      this.addDialogVisible = true
    },
    handleDelete(row) {
      this.rowId = row.templateDetailId
      this.tipDialogVisible = true
    },
    deleteTab2Item() {
      // 请求delete接口 delete_service_template_detail
      const params = {
        detailIds: this.rowId
      }
      ROUTE_PLANNING_API.delete_service_template_detail(params).then(res => {
        const {code} = res
        if (code === '200') {
          this.$message({
            message: '删除成功',
            type: 'success',
            showClose: true,
          })
        }
        this.getTableData()
        this.getTreeData()
        this.tipDialogVisible = false
      })
    },
    addDialogClosed(val) {
      if (val && val.length > 0) {
        // 如果在拜访频次与在店时长tab下面新增服务，拿到服务id回填
        this.addServiceId = val
        this.getTableData()
        this.getTreeData()
      }
      this.addDialogVisible = false
    },
    getTableData() {
      // mock
      // const template_id = 'b4e2e70fee264b559a2b15e28e1af4e1';
      // this.disableDutyOpts = [];
      // this.disableTypeOpts = [];
      this.disableVisitOpts = [];
      this.tableData0 = []
      this.tableData1 = []
      this.templateId = this.serviceType ? this.serviceId : this.addServiceId
      const params = {
        template_id: this.templateId,
        prePlanNo: this.$route.query.planId,
      }
      ROUTE_PLANNING_API.get_service_detail_list(params)
          .then(res => {
            if(res.code === '200' && res.data) {
              this.templateId = res.data.id
              this.form.inputVal = res.data.templateName
              this.form.time = res.data.modifyTime
              this.mockTable = res.data.oneVos
              this.dataDeal()
            }
            // const { code, data } = mock
            // if (code === '200' && data && data.length) {
            //   // this.templateId = data[0].id
            //   // this.form.inputVal = data[0].templateName
            //   // this.form.time = data[0].modifyTime || []
            //   // // this.tableData1 = data[0].saleTagInfos || []
            //   // this.tableData0 = data[0].serviceDetail || []
            //   // if (data[0].saleTag && data[0].saleTag.length) {
            //   //   let tempList = [];
            //   //   data[0].saleTag.forEach(item => {
            //   //     let disableStr = '';
            //   //     if (item.dataList) {
            //   //       item.dataList.forEach((cell, k) => {
            //   //         disableStr += k === 0 ? cell.storeTypeCode : `,${cell.storeTypeCode}`;
            //   //         tempList.push({
            //   //           labelId: item.labelId,
            //   //           labelName: item.labelName,
            //   //           // 第一列合并行数量
            //   //           rowSpanLen: k === 0 ? item.dataList.length : 0,
            //   //           ...cell,
            //   //         });
            //   //       });
            //   //     }
            //   //     this.disableVisitOpts.push(disableStr ? disableStr.split(',') : []);
            //   //   });
            //   //   this.tableData1 = tempList;
            //   // }
            // }
          })
          .catch(err => {
            console.log(err)
          })
    },
    getTreeData() {
      this.templateId = this.serviceType ? this.serviceId : this.addServiceId
      ROUTE_PLANNING_API.get_service_template_org_list(this.templateId)
          .then(res => {
            const {code, data} = res
            if (code === '200') {
              this.treeData = data.orgainzeList || []
              this.form.count = data.count || 0
            }
          })
          .catch(err => {
            console.log(err)
          })
    },
    handleSave() {
      // --------服务关系名称提示---------
      const reg = /^[\w\u4E00-\u9FA5\uF900-\uFA2D]*$/g
      if (this.form.inputVal === '') {
        this.$message({
          message: '请填写服务关系名称',
          type: 'warning',
          showClose: true,
        })
        return
      } else if (this.form.inputVal.length > 20) {
        this.$message({
          message: '服务关系名称长度不超过20个字符',
          type: 'warning',
          showClose: true,
        })
        return
      } else if (!reg.test(this.form.inputVal)) {
        this.$message({
          message: '服务关系名称仅支持中英文、数字和下划线',
          type: 'warning',
          showClose: true,
        })
        return
      }
      // --------服务关系名称验证---------
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.activeIndex === 0) {
            // 保存服务关系时
            const params1 = {
              positions: this.tableData0,
              templateId: this.templateId,
              templateName: this.form.inputVal
            }
            ROUTE_PLANNING_API.post_service_position_save(params1)
                .then(res => {
                  const {code, data} = res
                  if (code === '200') {
                    this.$message({
                      message: '保存成功',
                      type: 'success',
                      showClose: true,
                      duration: 2000,
                    })
                    if (!this.serviceType) this.addServiceId = data
                    this.$store.commit(
                        'routerPlanning/SET_CURRENT_SERVICE_NAME',
                        this.form.inputVal
                    )
                    this.$store.commit(
                        'routerPlanning/SET_CURRENT_SERVICE_ID',
                        data
                    )
                    this.$store.commit(
                        'routerPlanning/SET_CURRENT_SERVICE_TYPE',
                        'true'
                    )
                    this.$store.commit(
                        'routerPlanning/SET_CURRENT_SERVICE_DISABLE',
                        false
                    )
                    // sessionStorage.setItem('currentServiceName', this.form.inputVal);
                    // sessionStorage.setItem('currentServiceId', data);
                    // sessionStorage.setItem('currentServiceType', 'true');
                    this.getTableData()
                    this.getTreeData()
                  }
                })
                .catch(err => {
                  console.log(err)
                })
          }
        }
      })
      // else { // 保存拜访频次与在店时长
      //   const params1 = {
      //     sales: [], // 客户类型
      //     tagInfos: [], // 在店时长和拜访频率
      //     templateId: '', // 新建服务关系时 为空
      //     templateName: this.form.inputVal,
      //   }
      //   ROUTE_PLANNING_API.post_service_standards_update(params1).then((res) => {
      //     const { code, data } = res;
      //     if (code === '200') {
      //       console.log(data);
      //     }
      //   }).catch((err) => {
      //     console.log(err);
      //   });
      // }
    },
    // eslint-disable-next-line
    objectSpanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        if (row.rowSpanLen) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    handleReturn() {
      this.$router.go(-1)
    },
    // 数据处理
    dataDeal() {
      let mockData = this.mockTable, twoVos = []
      console.info(mockData)
      if (mockData && mockData.length > 0) {
        for (let item of mockData) {
          twoVos = twoVos.concat(item.twoVos)
        }
      }
      this.twoVos = twoVos

      let threeData = [], threeSpanData = [], threePos = 0, spanData = [], pos = 0
      for (let twoItem of twoVos) {
        threeData = threeData.concat(twoItem.threeVos)
      }
      for (let j = 0; j < threeData.length; j++) {
        if (j === 0) {
          threeSpanData.push(1)
          spanData.push(1)
          threePos = 0
          pos = 0
        } else {
          if (threeData[j].grandfather === threeData[j - 1].grandfather) {
            spanData[pos] += 1
            spanData.push(0)
          } else {
            spanData.push(1)
            pos = j
          }
          if (threeData[j].parent === threeData[j - 1].parent && threeData[j].desc === threeData[j - 1].desc) {
            threeSpanData[threePos] += 1
            threeSpanData.push(0)
          } else {
            threeSpanData.push(1)
            threePos = j
          }
        }
      }
      this.threeSpanData = threeSpanData
      this.threeVos = threeData
      this.spanData = spanData
    },
    // table 合并
    rightMerge({column, rowIndex}) {
      // 合并 通路/渠道
      if (column.property === 'grandfather') {
        const _row = this.spanData[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return [_row, _col]
      }
      // 合并 渠道
      if (column.property === 'parent') {
        const _row = this.threeSpanData[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return [_row, _col]
      }
    },
    tableHeaderColor() {
      return 'background-color: #F8F8F9'
    },
    cellHeight() {
      return 'padding: 0;height: 30px'
    },
    updateStandardName() {
      if(!this.form.inputVal) {
        return
      }
      ROUTE_PLANNING_API.edit_standard_name({
        templateId: this.templateId,
        templateName: this.form.inputVal
      })
      .then(res => {
        if(res.code === '200') {
          console.log('成功')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.service-standards-edit-wrapper {
  width: 100%;
  background-color: #f8f8f9;

  ::v-deep .el-table td {
    height: 40px;
    padding: 0;
  }

  .main-container {
    width: 1194px;
    margin: 15px auto;
    // background-color: #F8F8F9;
    padding: 0px;

    .info-wrap {
      background-color: #ffffff;
      padding-top: 10px;
      box-shadow: 0px 1px 0px 0px #ced3dd;

      .el-form {
        width: 400px;

        .el-form-item {
          margin-bottom: 10px;
        }

        .time {
          color: #495060;
        }

        .log {
          color: #a634ef;
          // text-decoration: underline;
          cursor: pointer;
          display: inline-block;
          margin-left: 20px;
        }

        .apply {
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }

    .bg-wrap {
      background-color: #ffffff;
      height: calc(100vh - 300px);

      .tabs-wrap {
        width: 100%;
        height: 36px;
        // background-color: #ffffff;
        box-shadow: 0px 1px 0px 0px #ced3dd;
        border-radius: 2px;
        margin-top: 10px;

        .sub-tab-item {
          display: inline-block;
          line-height: 36px;
          font-size: 14px;
          cursor: pointer;
          margin: 0 24px;
          padding: 0 20px;

          &.active {
            color: #930cea;
            border-bottom: 2px solid #930cea;
          }
        }
      }

      .content-wrap {
        // background-color: #ffffff;
        padding: 0px 20px 10px 20px;

        .content-tab {
          padding-top: 5px;

          .btn-add {
            margin: 10px;

            .el-button {
              background-color: #ffffff;
              color: #930cea;
            }
          }

          .table-block {
            .type-item {
              height: 46px;
              line-height: 46px;

              .icon-style {
                display: inline-block;
                color: #930cea;
                font-size: 16px;
                margin-left: 10px;
                vertical-align: middle;
                cursor: pointer;
              }
            }

            .diy-header {
              background: #EAEAEA;
              border-radius: 4px;
              border: 1px solid #DDDEE1;
              font-weight: 600;
              color: #1C2438;
              text-align: center;
            }
            .table-item-header{
              font-weight: 600;
              color: #1C2438;
              p{
                font-weight: 400;
                color: #495060;
              }
            }
          }
        }
      }
    }

    .btn-wrap {
      margin: 10px 0 9px;
      text-align: center;

      span {
        display: inline-block;
        width: 80px;
        height: 32px;
        line-height: 32px;
        color: #fff;
        border-radius: 4px;
        background-color: #930cea;
        cursor: pointer;

        &.disable {
          background-color: #c581f1;
          cursor: not-allowed;
        }
      }
    }
  }

  .btn-wrap-return {
    width: 100%;
    margin: 10px 0;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
</style>

<style lang="scss">
.popper-class-apply-wrapper {
  max-height: 320px;
  overflow-y: scroll;
}
</style>
