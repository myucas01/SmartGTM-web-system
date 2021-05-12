<template>
	<div class="rp-org-index">
		<Calendar/>
	</div>
</template>

<script>
	import Calendar from './Calendar'
	export default {
		components: {
			Calendar,
		},
		data() {
			return {
				type: 1
			}
		},
		mounted() {
			let visitMonth  = this.$store.state.routerPlanning.visitMonth
			let visitYear = this.$store.state.routerPlanning.visitYear
			if (visitMonth && visitYear) {
				this.type = 2
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				//TODO 此处是否需要区分角色去设计
				vm.$store.commit('addTabs', {
					title: '选择月份',
					link: '/route-planning',
					on: true,
					needCatch: true
				});
			});
		}
	}
</script>

<style scoped lang="scss">
	.rp-org-index {
		width: 100%;
		overflow: auto;
		background-color: #F8F8F9;

		&::-webkit-scrollbar {
			display: none;
		}
	}
</style>
