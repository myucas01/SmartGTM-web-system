<template>
	<div class="main_top">
		<div class="topbox">
			<span>异动门店</span>
			<span class="close" @click="changeVIew()">
				<i class="el-icon-close"></i>
			</span>
			<span class="enlarge" @click="showEnlarge()">
				<svg class="icon" aria-hidden="true">
					<use xlink:href="#iconicon_table_fullscreen"></use>
				</svg>
			</span>
      <span class="screen">
<!--				<svg class="icon" aria-hidden="true">-->
<!--					<use xlink:href="#iconicon_addplan_import"></use>-->
<!--				</svg>-->
        <a :href="linkUrl" download>
					<span class="el-icon-download downloadIcon" style="color:#ffffff;">
					</span>
				</a>
			</span>
			<span class="screen" @click="storeScreen()">
				<svg class="icon" aria-hidden="true">
					<use xlink:href="#iconicon_shaixuan"></use>
				</svg>
			</span>
		</div>
		<div class="bottom_tab">
			<storeList ref="storeList" :tableList="tableList"></storeList>
		</div>
		<screenForm ref="screenForm" :getStoreList="getStoreList"></screenForm>
		<enlargeScreenForm ref="enlargeScreenForm" :tableList="tableList"></enlargeScreenForm>
	</div>
</template>

<script>
	import storeList from "./storeList"
	import screenForm from "./screenForm"
	import enlargeScreenForm from "./enlargeScreenForm"
	import {
		mapGetters
	} from 'vuex'
export default {
	components: {
		storeList,
		screenForm,
		enlargeScreenForm
	},
	computed: {
		...mapGetters('routerPlanning', ['mapViewId']),
    linkUrl() {


      const params = {
        prePlanNo: this.mapViewId,
				isPre: this.formData.isPre,
        precinctNo:this.formData.precinctNo,
        changeTypeCode: this.formData.changeTypeCode,
        storeNo: this.formData.storeNo,
        storeTypeCode: this.formData.storeTypeCode,
        storeName: this.formData.storeName,
        storeScale: this.formData.storeScale,
        storeAddress: this.formData.storeAddress,
        shopTime: this.formData.shopTime,
        visitRate: this.formData.visitRate,
      }

      let tempParam = '';
      Object.keys(params).forEach((key, idx) => {
        if (idx === 0) {
          tempParam += `${key}=${params[key]}`;
        } else {
          tempParam += `&${key}=${params[key]}`;
        }
      });
      return `/api/route/abnormal/download-normal-stores?${tempParam}`;
    },
	},
	data() {
		return {
			tableList: [],
			formData: {
				isPre: '',
				prePlanNo: '',
				precinctNo: '',
				changeTypeCode: '',
				storeNo: '',
				storeTypeCode: '',
				storeName: '',
				storeScale: '',
				storeAddress: '',
				shopTime: '',
				visitRate: '',
			}
		}
	},
	mounted() {
		this.formData.prePlanNo = this.mapViewId ? this.mapViewId : this.$route.query.planId
		this.formData.isPre = this.$route.query.planAhead === 'true' ? 0 : 1
		this.getStoreList(this.formData)
	},
	methods: {
		changeVIew() {
			this.$parent.$refs.topMeau.changeStore()
		},
		storeScreen() {
			this.$refs.screenForm.dialogVisible = true
		},
    goDown(){
      // let url = '/api/route/abnormal/normalStores'
      // this.$fetch.post(url, data).then((res) => {
      //   this.tableList = res.data
      // })
      let url = '/api/route/abnormal/download-normal-stores'
      this.$fetch.get(url, {
        prePlanNo: this.mapViewId
      }).then((res) => {
        console.log(res)
        // this.tableList = res.data
      })
    },
		showEnlarge() {
			this.$refs.enlargeScreenForm.dialogVisible = true
		},
		getStoreList(data) {
			let url = '/api/route/abnormal/normalStores'
			this.$fetch.post(url, data).then((res) => {
				this.tableList = res.data
        this.formData = data
        console.log(this.formData)
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.main_top {
		display: flex;
		width: calc(100% - 340px);
		height: auto !important;
		background: #0a2757;
		position: absolute;
		z-index: 161;
		right: 0px;
		bottom: 0px;
		flex-wrap: wrap;
		min-height: 170px;
		overflow: hidden;
	}

	.topbox {
		height: 32px;
		display: block;
		width: 100%;
		line-height: 32px;
		background: #133773;
		color: #ffffff;
		font-size: 14px;
		padding: 0px 12px;
		text-align: left;
		width: 100%;

		span {
			cursor: pointer;
		}

		.screen {
			float: right;
			margin-right: 20px;
		}

		.enlarge {
			float: right;
			margin-right: 20px;
		}

		.close {
			float: right;
		}
	}

	.bottom_tab {
		display: block;
		background-color: #102f63;
		width: 99%;
		margin: 10px 8px;
	}
</style>
