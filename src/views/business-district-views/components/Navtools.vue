<!--导航 工具栏-->
<template>
  <div class="nav-wrap">
    <ul>
      <template v-for="item of navList">
        <li v-if="Authorities(item.authorityCode)"  :data-r="Authorities(item.authorityCode)" :key="item.svgIcon" @click="doSomething(item.code)">
          <svg-icon :icon-class="item.svgIcon"></svg-icon>
          <span>{{ item.name }}</span>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import Business_District_API from "@api/business-district/index";
//-------------------vuex------------------------
import {mapGetters} from 'vuex'
import {Authorities} from '@/util/authority'
export default {
  name: "navtools",
  data() {
    return {
      chooseBusinessDistrict: [],
      navList: [
        {
          name: '新增',
          code: 'add',
          svgIcon: 'business-add',
          authorityCode: 'business:layout:set:add',// 权限code 与权限系统挂钩
        },
        {
          name: '编辑',
          code: 'edit',
          svgIcon: 'business-edit',
          authorityCode: 'business:layout:set:modify',// 权限code 与权限系统挂钩
        },
        {
          name: '调整',
          code: 'adjust',
          svgIcon: 'business-adjustment',
          authorityCode: 'business:layout:set:adjust',// 权限code 与权限系统挂钩
        },
        {
          name: '删除',
          code: 'delete',
          svgIcon: 'business-delete',
          authorityCode: 'business:layout:set:del',// 权限code 与权限系统挂钩
        },
      ]
    }
  },
  computed: {
    ...mapGetters('businessPreview', ['chooseBusinessMap', 'chooseBusiness'])
  },
  watch: {
    chooseBusiness() {
      this.chooseBusinessDistrict = this.chooseBusiness
    }
  },
  methods: {
    Authorities,
    doSomething(code) {
      console.info(this.chooseBusinessMap)
      if( !this.verificationParams(code)) {
        return
      }
      this.$emit('choose-code', code)
      this.$store.commit('businessPreview/SET_OPERATION_CODE', code)
      if(code == 'adjust') {
        this.$router.push(`/business-district/adjust?id1=${this.chooseBusinessDistrict[0]}&id2=${this.chooseBusinessDistrict[1]}`)
        return
      }
      if(code === 'delete') {
        this.$confirm('您确定将该商圈删除吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteBusiness()
        }).catch(() => {
        });
      }
    },
    // 数据校验
    verificationParams(code) {
      if(code === 'add') {
        return true
      }
      if(this.chooseBusinessDistrict  && this.chooseBusinessDistrict.length > 0) {
        if(code === 'edit' || code === 'delete') {
          if(this.chooseBusinessDistrict.length !== 1) {
            this.$message({
              message: '请选择1个商圈进行操作',
              type: 'warning'
            })
            return false
          } else {
            return  true
          }
        }
        if(code === 'adjust') {
          if(this.chooseBusinessDistrict.length !== 2) {
            this.$message({
              message: '请选择相同营业部下的2个商圈进行调整',
              type: 'warning'
            })
            return false
          } else {
            if(this.chooseBusinessMap.get(this.chooseBusiness[0])['orgId'] === this.chooseBusinessMap.get(this.chooseBusiness[1])['orgId']) {
              return  true
            } else {
              this.$message({
                message: '请选择相同营业部下的2个商圈进行调整',
                type: 'warning'
              })
              return  false
            }
          }
        }
      } else {
        if(code === 'edit' || code === 'delete') {
          this.$message({
            message: '请选择1个商圈进行操作',
            type: 'warning'
          })
          return false
        }
        if(code === 'adjust'){
          this.$message({
            message: '请选择相同营业部下的2个商圈进行调整',
            type: 'warning'
          })
          return false
        }
        return false
      }
    },
    // 删除商圈
    deleteBusiness() {
      Business_District_API.deleteBusinessDistrict({businessNo: this.chooseBusinessDistrict[0]})
      .then(res => {
        if(res.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$store.commit('businessPreview/SET_DELETE_BUSINESS', new Date().getTime())
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.nav-wrap {
  width: 340px;
  height: 70px;
  background: #102F63;
  box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.5);

  ul {
    display: flex;
    height: 70px;
    align-items: center;
    align-content: center;

    li {
      font-size: 12px;
      font-weight: 500;
      color: #FFFFFF;
      flex: 1;
      text-align: center;
      cursor: pointer;

      svg {
        display: inline-block;
        width: 24px;
        height: 24px;
      }

      span {
        display: block;
        margin-top: 3px;
      }
    }
  }
}
</style>