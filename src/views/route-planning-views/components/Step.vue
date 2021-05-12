<!--步骤条-->
<template>
    <div class="step-wrap">
        <ul>
            <li v-for="item of stepOptions" :key="item.name"
                :class="{'active': item.status === 'active', 'complete': item.status === 'complete'}">
                <div class="steps-item-icon" @click="redirectHere(item.url, item.id)">
                    <span class="steps-icon"></span>
                    <i class="icon-box">
                        <svg-icon v-if="item.status === 'complete'" icon-class="duihao" class-name="icons"></svg-icon>
                        <svg-icon v-if="item.status === 'active'" icon-class="yuandian" class-name="icons"></svg-icon>
                    </i>
                </div>
                <div class="steps-item-content" @click="redirectHere(item.url, item.id)">
                    <div class="steps-item-title">{{item.name}}</div>
                </div>
                <div style="visibility: hidden">{{setStatus}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import axios from 'axios';
export default {
  name: "step",
  title() {
    return '步骤条'
  },
  computed: {
    ...mapGetters('routerPlanning', [
      'NowStep',
      'organizePlanStatus',
      'planApproveStatus'
    ]),
    setStatus() {
      if (this.NowStep) {
        let activeIndex = 0
        for (let i = 0; i < this.stepOptions.length; i++) {
          this.$set(this.stepOptions[i], 'status', 'complete')
          if (this.stepOptions[i].id === this.NowStep) {
            this.$set(this.stepOptions[i], 'status', 'active')
            activeIndex = i
          }
        }
        if (activeIndex < this.stepOptions.length - 1) {
          for (let i = 0; i < this.stepOptions.length; i++) {

            if (i > activeIndex) {
              this.$set(this.stepOptions[i], 'status', 'stillness')
            }
          }
        } else {
          if (this.planApproveStatus === '2' && this.organizePlanStatus == '3') {
            this.$set(this.stepOptions[2], 'status', 'complete')
          }
        }
      }
      return null
    }
  },
  data() {
    return {
      // stillness  静止
      // active  活跃
      // complete 已完成
      stepOptions: [
        {
          id: 'CommonConfig',
          name: '全局配置',
          status: 'complete',
          url: '/route-planning/global-config'
        },
        {
          id: 'PlanRoute',
          name: '划区建线',
          status: 'active',
          url: '/route-planning/build-route'
        },
        {
          id: 'Approve',
          name: '审批生效',
          status: 'stillness',
          url: '/route-planning/approve'
        },
        // {
        //     id: 'ExportPlan',
        //     name: '导出计划',
        //     status: 'stillness',
        //     url: '/route-planning/approve'
        // }
      ],
      mainPlan: '' // 主计划
    }
  },
  methods: {
    async redirectHere(url, id) {
      await this.getMainInfo()
      if (this.mainPlan && this.mainPlan.planStatus) {
        // 当前所 已有草稿计划
        if (this.mainPlan.planStatus === '1') {
          if (id === 'Approve') {
            this.$message({
              message: this.messageTip(id),
              type: 'warning'
            })
            return
          }
        }
        this.redirectMethod(url, id)
      } else {
        const targetIndex =  this.stepOptions.findIndex(item => item.id === id)
        const nowIndex = this.stepOptions.findIndex(item => item.status === 'active')
        if(targetIndex < nowIndex) {
          this.redirectMethod(url, id)
        } else {
          this.$message({
            message: this.messageTip(id),
            type: 'warning'
          })
        }
      }
    },
    redirectMethod(url, id) {
      this.$store.dispatch('routerPlanning/set_step', id)
          .then(() => {
            const {month, year, organizeName, organizeId, planStatus} = this.$route.query
            let urlSuffix = `month=${month}&year=${year}&organizeName=${organizeName}&organizeId=${organizeId}&planStatus=${planStatus}`
            this.$router.push({path: `${url}?${urlSuffix}`})
          })
          .catch((err) => {
            console.error('步骤出错，请检查', err)
          })
    },
    // 获取主计划相关
    async getMainInfo() {
      let result = await axios.get('/api/route/plan/getplaninfo',{
        params: {
          orgId: this.$route.query ? this.$route.query.organizeId : '',
          yearMonth: this.$route.query ? `${this.$route.query.year}-${this.$route.query.month}` : '',
          isLoading: true
        }
      })
      if (result.data.code === '200') {
        this.mainPlan = result.data.data
      }
    },
    messageTip(id) {
      const messageObj = {
        'PlanRoute': '当前月份暂未创建计划',
        'Approve': '当前所该月份暂无提交记录',
        'CommonConfig': '配置该月份全局配置'
      }
      return messageObj[id]
    }
  }
}
</script>

<style scoped lang="scss">
    .step-wrap {
        width: 1194px;
        margin: 0 auto;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
        font-weight: 400;

        ul {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            color: rgba(0, 0, 0, .65);
            font-size: 14px;
            font-variant: tabular-nums;
            line-height: 1.5;
            list-style: none;
            font-feature-settings: "tnum";
            display: flex;
            width: 100%;

            li {
                position: relative;
                display: inline-block;
                flex: 1;
                overflow: hidden;
                vertical-align: top;
                margin-right: 16px;
                white-space: nowrap;
                text-align: left;


                &:last-child {
                    flex: none;
                }

                .steps-item-icon {
                    display: inline-block;
                    vertical-align: top;
                    width: 16px;
                    height: 16px;
                    margin-right: 8px;
                    font-size: 12px;
                    line-height: 21px;
                    text-align: center;
                    border: 1px solid rgba(0, 0, 0, .25);
                    border-radius: 16px;
                    transition: background-color .3s, border-color .3s;
                    cursor: pointer;

                    .steps-icon {
                        position: relative;
                        top: -1px;
                        color: #1890ff;
                        line-height: 1;
                    }

                    .icon-box {
                        position: relative;
                        top: -1px;
                        left: -1px;
                    }

                    .icons {
                        width: 1.5em;
                        height: 1.5em;
                    }
                }

                .steps-item-content {
                    display: inline-block;
                    vertical-align: top;
                    cursor: pointer;

                    .steps-item-title {
                        position: relative;
                        display: inline-block;
                        padding-right: 16px;
                        color: rgba(0, 0, 0, 0.45);
                        font-size: 14px;
                        line-height: 22px;

                        &:after {
                            position: absolute;
                            top: 10px;
                            left: 100%;
                            display: block;
                            width: 9999px;
                            height: 1px;
                            background: rgba(0, 0, 0, 0.15);
                            content: "";
                        }
                    }
                }
            }

            .active {
                .steps-item-icon {
                    border-color: #930CEA;
                }

                .steps-item-content > .steps-item-title {
                    color: #930CEA;
                    font-weight: 500;
                }
            }

            .complete {
                .steps-item-icon {
                    border-color: #19BE6B;
                    background-color: #19BE6B;
                }

                .steps-item-content > .steps-item-title {
                    color: #19BE6B;
                    font-weight: 500;
                }
            }
        }
    }
</style>
