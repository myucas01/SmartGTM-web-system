<template>
    <div class="store_m">
        <div class="store_h">
					<el-button icon="el-icon-arrow-left" @click="back">返回</el-button>
				</div>
				<div class="store_c">
					<div class="t">选择拓展门店方式</div>
					<div class="c">
						<div class="m" @click="storeClick">
							<div class="d f">
								<img src="../../assets/img/icon_addplan_import.png"/>
							</div>
							<div class="d w">自主拓展</div>
							<div class="d e">自主拓展门店的</div>
							<div class="d e">商机等</div>
						</div>
						<div class="m" @click="storeAiClick">
							<div class="d f">
								<img src="../../assets/img/icon_addplan_addline_ai.png" />
							</div>
							<div class="d w">AI自动拓展</div>
							<div class="d e">通过AI智能算法自动识别</div>
							<div class="d e">拓展门店</div>
						</div>
					</div>
				</div>
    </div>
</template>
<script>
export default {
    name: 'BusinessOpportunityStore',
    data() {
        return {

        }
    },
    // beforeRouteEnter(to,from,next) {
    //     next(vm => {
    //         vm.$store.commit('addTabs', {
    //             title: '商机门店',
    //             link: '/business-expansion/business-opportunity-store',
    //             on: true,
    //             needCatch: true
    //         })
    //     })
    // },
    created() {

    },
    mounted() {

    },
    methods: {
			back() {
				this.$router.go(-1)
			},
			storeClick() {
				let path = '/business-expansion/store-autonomy-dev'
				if (this.$route.query.storesId) {
					path += '?storesId=' + this.$route.query.storesId
				}
				this.$router.push({
					path: path
				})
			},
			storeAiClick() {
				let path = '/business-expansion/store-autonomy-Ai'
				if (this.$route.query.storesId) {
					path += '?storesId=' + this.$route.query.storesId
				}
				this.$router.push({
					path: path
				})
			}
    },

}
</script>
<style lang="scss" scoped>
	.store_m {
		width: 100%;
		padding: 20px 15px;
		.store_h {
			.el-button {
				width: 80px;
				height: 32px;
				line-height: 32px;
				padding: 0;
			}
		}
		.store_c {
			padding: 50px 0px;
			.t {
				text-align: center;
				font-size: 32px;
				font-weight: 600;
				color: #000000;
			}
			.c {
				text-align: center;
				margin-top: 60px;
				.m {
					&:first-child {
						cursor: pointer;
						margin-right: 85px;
					}
					&:last-child {
						cursor: pointer;
						margin-left: 85px;
						// background-color:#fbf7f7;
						// z-index:2;
						// opacity:0.3;
						// filter: alpha(opacity=30);
					}
					display: inline-block;
					width: 210px;
					height: 270px;
					box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
					border-radius: 4px;
					border: 1px solid #cfd0cc59;
					padding: 50px;
					.f {
						margin-bottom: 45px;
					}
					.w {
						font-size: 20px;
						font-weight: 600;
						color: #6A6A6A;
						margin-bottom: 40px;
					}
					.e {
						font-size: 14px;
						font-weight: 400;
						color: #A3A3A3;
					}
				}
			}
		}
	}
</style>