<template>
  <el-dialog
      class="service-standards-config-dialog"
      title="服务标准配置"
      :visible.sync="visible"
      width="1000px"
      :before-close="handleClose">
    <div class="btn-block">
      <!--        <el-button-->
      <!--          v-auth="'lineplan:config:serve:setadd'"-->
      <!--          type="primary"-->
      <!--          icon="el-icon-plus"-->
      <!--          size="small"-->
      <!--          @click="addNewItem">-->
      <!--          新增-->
      <!--        </el-button>-->
      <el-button
          type="primary"
          size="small"
          @click="importConfig">
        导入配置
      </el-button>
    </div>
    <div class="content-block">
      <el-table
          class="global-configuration-table"
          :data="tableData"
          border
          max-height="272"
          style="width: 100%">
        <el-table-column
            label="方案名称"
            align="center">
          <template slot-scope="scope">
            <div
                v-if="scope.row.templateName"
                class="btn-edit"
                @click="handleRowConfig(scope.row)">
              {{ scope.row.templateName }}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column
            prop="createUser"
            label="创建人"
            align="center">
        </el-table-column>
        <el-table-column
            prop="modifyTime"
            label="修改时间"
            sortable
            align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.modifyTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            width="100">
          <template slot-scope="scope">
              <span
                  v-auth="'lineplan:config:serve:setselect'"
                  class="btn-edit"
                  @click="handleRowOperate(scope.row.id)">
                选择
              </span>
            <span
                class="btn-delete"
                @click="handleRowDelete(scope.row.id)">
                删除
              </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-block">
      <el-pagination
          background
          @size-change="sizeChanged"
          @current-change="currentChanged"
          layout="total, prev, pager, next, sizes"
          :page-sizes="[10, 20, 30, 50, 100]"
          :page-size="pageSize"
          :total="totalNumber">
      </el-pagination>
    </div>
    <el-dialog title="导入配置" width="500px" append-to-body :visible.sync="innerVisible">
      <div class="import_content">
        <el-upload
            :on-remove="handleRemove"
            ref="upload"
            :limit="1"
            :on-success="handleSuccess"
            action="/api/expand/upload"
            :accept="acceptText"
            :before-upload="beforeUpload">
          <el-button class="im" type="primary" size="small" v-if="fileNum == 0">点击上传</el-button>
          <el-button class="im" type="primary" size="small" v-else @click="resetUpload">重新上传</el-button>
        </el-upload>
        <p class="im"><a download href="/api/route/service/download-server-standard-data">点击下载配置模板</a></p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" :disabled="fileNum == 0" @click="analysisFile">确定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import ROUTE_PLANNING_API from '@api/route/index';

export default {
  name: 'serviceStandardsConfigDialog',
  props: {
    visible: {
      default: false,
    },
    row: {}, // 营业所 多选的结果
  },
  data() {
    return {
      tableData: [
        // {
        //   createUser: '苏州营业部',
        //   modifyTime: '苏州士多北所',
        //   templateName: '服务标准配置1',
        // },
        // {
        //   createUser: '苏州营业部',
        //   modifyTime: '苏州士多北所',
        //   templateName: '服务标准配置1',
        // },
      ],
      currentPage: 1,
      pageSize: 10,
      totalNumber: 0,
      innerVisible: false,
      exportFile: null,
      fileNum: 0,
      requestBoolean: false,
      acceptText: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
    };
  },
  computed: {},
  created() {
  },
  methods: {
    handleClose() {
      this.$emit('handleClose', false);
      this.resetForm();
    },
    resetForm() {
      this.tableData = [];
    },
    handleRowConfig(row) {
      // console.log(row);
      this.$store.commit('routerPlanning/SET_CURRENT_SERVICE_NAME', row.templateName);
      this.$store.commit('routerPlanning/SET_CURRENT_SERVICE_ID', row.id);
      this.$store.commit('routerPlanning/SET_CURRENT_SERVICE_TYPE', 'true');
      this.$store.commit('routerPlanning/SET_CURRENT_SERVICE_DISABLE', false);
      // sessionStorage.setItem('currentServiceName', row.templateName);
      // sessionStorage.setItem('currentServiceId', row.id);
      // sessionStorage.setItem('currentServiceType', 'true');
      this.$router.push({
        path: 'service-standards-edit',
      });
      this.$emit('handleClose');
    },
    // 营业所关联服务标准配置
    handleRowOperate(id) {
      const params = {
        org_id: this.row.map(item => item.id).join(','),
        template_id: id,
      };
      ROUTE_PLANNING_API.get_service_standard_relevance(params).then((res) => {
        const {code, message} = res;
        if (code === '200') {
          this.$message({
            type: 'success',
            message,
            showClose: true,
          })
        }
        this.$emit('handleClose', 'refresh');
      }).catch((err) => {
        console.log(err);
      });

    },
    sizeChanged(page) {
      this.pageSize = page;
      this.getTableData();
    },
    currentChanged(page) {
      this.currentPage = page;
      this.getTableData();
    },
    // 导入服务标准配置
    importConfig() {
      let _this = this
      _this.$set(_this, 'innerVisible', true)
    },
    // 删除文件
    handleRemove(file, fileList) {
      let _this = this
      _this.$set(_this, 'fileNum', fileList.length)
    },
    // 上传文件成功
    handleSuccess(response, file, fileList) {
      let _this = this
      _this.$set(_this, 'fileNum', fileList.length)
      _this.$set(_this, 'exportFile', file.raw)
    },
    // 重新上传文件
    resetUpload() {
      let _this = this
      _this.$refs.upload.clearFiles()
      _this.$set(_this, 'fileNum', 0)
    },
    // 确定导入配置
    async analysisFile() {
      if (this.requestBoolean) {
        return
      }
      this.requestBoolean = true
      let _this = this
      let params = new FormData()
      params.append("file", _this.exportFile)
      await ROUTE_PLANNING_API.post_service_export_file(params).then((res) => {
        const {code, message} = res;
        _this.requestBoolean = false
        if (code == 200) {
          this.$message({
            type: 'success',
            message: message,
            showClose: true,
          })
          _this.innerVisible = false
          _this.getTableData()
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    beforeUpload(file) {
      if (!this.acceptText.includes(file.type)) {
        this.$message({
          message: '文件类型不正确，请重新上传',
          type: 'warning',
          showClose: true,
        })
        return false;
      }
    },
    addNewItem() {
      this.$store.commit('routerPlanning/SET_CURRENT_SERVICE_TYPE', '');
      this.$store.commit('routerPlanning/SET_CURRENT_SERVICE_DISABLE', false);
      sessionStorage.setItem('currentServiceType', '');
      this.$router.push({
        path: 'service-standards-edit',
        query: {
          isDisable: false,
        },
      });
      this.$emit('handleClose');
    },
    getTableData() {
      // const res = {
      //   code: "200",
      //   data: [
      //     {
      //       id: "5d972f5d216848ef8f280f9a2da5bff0",
      //       templateName: "ybtfl_配置",
      //       createUser: "ybtfl",
      //       createDate: "2020-09-18T08:09:39.000+0000",
      //       modifyTime: "2020-09-18T08:09:39.000+0000",
      //       modifyUser: "ybtfl",
      //       userId: "root"
      //     },
      //     {
      //       id: "358812b1d38a4750a588532d17033b97",
      //       templateName: "ybtfl_tree123456",
      //       createUser: "ybtfl",
      //       createDate: "2020-09-18T09:18:55.000+0000",
      //       modifyTime: "2020-09-18T09:18:55.000+0000",
      //       modifyUser: "ybtfl",
      //       userId: "root"
      //     }
      //   ],
      //   message: null,
      //   extData: {
      //     total: 2,
      //     pageNum: 1,
      //     pageSize: 10
      //   },
      //   pageCursor: null
      // }
      // this.tableData = res.data;
      // this.totalNumber = res.extData.total;

      const params = {
        page_size: this.pageSize,
        page_num: this.currentPage,
      };
      ROUTE_PLANNING_API.get_service_standards_list(params).then((res) => {
        const {code, data, extData} = res;
        if (code === '200') {
          this.tableData = data;
          this.totalNumber = extData.total;
        } else {
          this.tableData = [];
        }
      }).catch(() => {
        this.tableData = [];
      });
    },
    handleRowDelete(customerId) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          template_id: customerId,
        }
        ROUTE_PLANNING_API.post_del_service_config(params).then((res) => {
          const {code} = res;
          if (code === '200') {
            this.$message({
              message: '删除成功',
              type: 'success',
              showClose: true,
            })
            this.$emit('handleRefresh', 'refresh')
          } else {
            this.$message({
              message: '删除失败',
              type: 'error',
              showClose: true,
            })
          }
          this.getTableData();
        });
      });
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.getTableData();
      }
    },
    innerVisible(val) {
      if (!val) {
        this.resetUpload();
      }
    },
  },
}
</script>

<style lang="scss">
.service-standards-config-dialog {
  .btn-block {
    height: 24px;
    margin-bottom: 10px;

    button {
      width: 80px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      border: 1px solid #930cea;
      background-color: #ffffff;
      color: #930cea;
      border-radius: 4px;
      padding: 0;
    }
  }

  .page-block {
    border-top: 1px solid #CED3DD;
    padding: 5px;
    text-align: right;
  }
}

.import_content {
  text-align: center;

  .im {
    margin-top: 15px;
  }

  a {
    cursor: pointer;
    color: #930cea;
  }

  .el-icon-document {
    color: #930cea;
  }

  .el-upload-list {
    position: absolute;
    top: 50px;
    width: 90%;
  }
}
</style>
