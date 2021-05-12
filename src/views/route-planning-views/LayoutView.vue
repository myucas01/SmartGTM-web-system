<template>
  <div class="route-planning-layout" id="routePlan">
        <keep-alive>
      <router-view
        class="keep-sub-view"
        v-if="$route.meta.keepAlive"
        :key="$route.fullPath"
      ></router-view>
    </keep-alive>
    <router-view
      class="sub-view"
      v-if="!$route.meta.keepAlive"
      :key="$route.fullPath"
    ></router-view>
  </div>
</template>

<script>
export default {
  name: '',
  title() {
    return ''
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.route-planning-layout {
  flex: 1;
  display: flex;
}
</style>
<style lang="scss">
.basic-color {
  color: #930cea;
}
/* 字体 紫色*/
.font-purple {
  color: #930cea;
}
/* 全局配置的table样式 */
.global-configuration-table {
  .el-table__header-wrapper {
    .el-table__header {
      th {
        border-bottom: 1px solid #e0e6ed;
        background-color: #f8f8f9;
        height: 32px;
        padding: 0;
        .column-header {
          background-color: #dddee1;
          border-radius: 4px;
        }
        .weight-header {
          font-size: 12px;
          font-weight: 600;
          color: #1c2438;
        }
        .normal-header {
          font-size: 10px;
          scale: 0.83;
          color: #495060;
        }
      }
    }
  }
  .el-table__body-wrapper {
    .el-table__body {
      color: #000;
      tr {
        background: #ffffff;
        td {
          height: 40px;
          padding: 0;
          border-color: #ebeef5;
          .btn-edit {
            color: #a634ef;
            cursor: pointer;
            padding-right: 10px;
          }
          .btn-delete {
            color: #fe9e89;
            cursor: pointer;
            padding-right: 10px;
          }
          .bg-type {
            background-color: #dddee1;
            border-radius: 4px;
            margin-bottom: 5px;
          }
        }
        &:hover {
          td {
            background: #f8f8f9;
          }
        }
      }
    }
  }
}
</style>
