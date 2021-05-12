<template>
  <div class="basic-wrap">
    <div class="list-header" :class="{'list-header-active': !openStatus}" @click="openStatus = !openStatus">商圈基本信息</div>
    <collapse-transition>
      <div class="basic-content" v-show="openStatus">
        <div class="basic-item">
          <span class='basic-label'>商圈名称:</span>
          <div v-if="basicInfo">
           <p v-show="!editBoolean " class="basic-label-name" :title="basicInfo.businessName">{{ basicInfo.businessName | textEllipsis(11) }}
             <span v-if="!isPreview" class="edit-btn" @click="editBoolean=true"><svg-icon icon-class="bianji"
                                                                                          class-name="icon-edit"/></span></p>
           <el-input v-show="editBoolean" v-model="basicInfo.businessName" placeholder="请输入内容"
                     class="edit-name"></el-input>
          </div>
          <p v-if="!basicInfo" class="basic-label-name">-</p>
        </div>
        <div class="basic-item">
          <span class='basic-label'>商圈等级:</span>
          <p v-if="basicInfo" class="basic-label-name basic-level">
            <i class="level-color" :style="{'background':businessLevel.color}"/>
            <el-tooltip
                class="item"
                popper-class="popperClassTip"
                effect="dark"
                :content="businessLevel.name"
                :disabled="businessLevel.name && businessLevel.name.length < 11"
                placement="right">
                      <span > {{ businessLevel.name | textEllipsis(7)}}</span>
            </el-tooltip>

          </p>
          <p v-else class="basic-label-name basic-level">-</p>
        </div>
        <div class="basic-item">
          <span class='basic-label'>商圈归属:</span>
          <p v-if="basicInfo" class="basic-label-name basic-organize">{{ basicInfo.orgName }}</p>
          <p v-else class="basic-label-name basic-organize">-</p>
        </div>
        <div class="basic-item basic-range">
          <span class='basic-label'>商圈范围:</span>
          <p v-if="basicInfo" class="basic-label-range" :key="businessScopKey">
            <el-tooltip v-if=" basicInfo.businessScope && basicInfo.businessScope.length > 57" class="item" effect="dark" :content="basicInfo.businessScope" placement="right">
              <span>{{ basicInfo.businessScope | textEllipsis(57)}}</span>
            </el-tooltip>
            <span v-else>{{basicInfo.businessScope}}</span>
          </p>
          <p v-else class="basic-label-range" :key="businessScopKey">-</p>
        </div>
      </div>
    </collapse-transition>
  </div>
</template>

<script>
import Business_District_API from "@api/business-district/index";
import collapseTransition from '@/util/collapse'
import {textEllipsis} from '@/util/filters'
import {mapGetters} from 'vuex'
export default {
  name: "BasicInformation",
  components: {collapseTransition},
  data() {
    return {
      openStatus: true,
      editBoolean: false,
      basicInfo: '', // 商圈基本信息
      businessName: '', // 商圈名称
      businessScopKey: new Date().getTime(),
      businessLevel: {
        color: '',
        name: ''
      }
    }
  },
  filters: {
    textEllipsis
  },
  computed: {
    ...mapGetters('businessPreview',['operationCode', 'editBusinessScope', 'isPreview' ])
  },
  watch: {
    editBusinessScope() {
      if(this.operationCode === 'edit') {
        this.basicInfo.businessScope = this.editBusinessScope
        // if(this.editBusinessScope.levelLeader) {
        //   this.businessLevel.color = this.editBusinessScope.levelLeaderColor
        //   this.businessLevel.name = this.editBusinessScope.levelLeaderName
        // }
        // if(this.editBusinessScope.levelEmployee) {
        //   this.businessLevel.color = this.editBusinessScope.levelEmployeeColor
        //   this.businessLevel.name = this.editBusinessScope.levelEmployeeName
        // }
        this.businessScopKey = new Date().getTime()
      }
    }
  },
  methods: {
    async getBasicInfo(businessNo) {
      let result = await Business_District_API.businessCircleDetail({businessNo: businessNo})
      this.basicInfo = result.data
      if(result.data.levelLeader) {
        this.businessLevel.color = result.data.levelLeaderColor
        this.businessLevel.name = result.data.levelLeaderName
      }
      if(result.data.levelEmployee) {
        this.businessLevel.color = result.data.levelEmployeeColor
        this.businessLevel.name = result.data.levelEmployeeName
      }
      // 组织id
      this.$store.dispatch('map/setOrganizationId', result.data ? result.data.orgId : '')
      // 组织name
      this.$store.dispatch('map/setOrganizationName', result.data ? result.data.orgName : '')
      this.$emit('update-BusinessDistrict', result.data ? result.data : '')
    }
  }
}
</script>

<style scoped lang="less">
.basic-wrap {
  .list-header {
    height: 34px;
    line-height: 34px;
    background: #133773;
    box-shadow: 0px -1px 0px 0px #0A2757;
    font-size: 13px;
    font-weight: 600;
    color: #FFFFFF;
    padding-left: 15px;
    cursor: pointer;

    &:before {
      display: inline-block;
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 10px 7px 0 7px;
      border-color: #CED3DD transparent transparent transparent;
      position: relative;
      top: 2px;
      margin-right: 5px;
      transform-origin: 50% 30%;
      transition: transform .3s;
    }
  }

  .list-header-active {
    &:before {
      transform: rotate(-90deg)
    }
  }

  .basic-content {
    padding-top: 10px;
    padding-left: 14px;

    .basic-item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;

      .basic-label {
        font-size: 12px;
        color: rgba(252, 251, 251, 0.63);
        margin-right: 10px;
      }

      .basic-label-name {
        font-size: 16px;
        color: #fff;
      }

      .basic-label-range {
        width: 220px;
        color: #fff;
        font-size: 12px;
      }

      .basic-level {
        display: flex;
        font-size: 12px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.87);
      }

      .level-color {
        display: inline-block;
        width: 4px;
        height: 16px;
        margin-right: 5px;
      }

      .basic-organize {
        font-size: 12px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.87);
      }

      .edit-btn {
        display: inline-block;
        width: 18px;
        height: 22px;
      }

      .icon-edit {
        display: inline-block;
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
    }

    .basic-range {
      align-items: flex-start;
    }
  }

  .edit-name {
    width: 200px;

    /deep/ .el-input__inner {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      background-color: #081f45;
      border: 1px solid #647F9A;
      color: #fff;
    }
  }
}
</style>