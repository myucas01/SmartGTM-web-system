<template>
	<div class="rp-index">
		<div class="rp-m-main">
			<div class="rp-m-lips">你想进入哪个月的路线规划？</div>
			<div ref="refMonth" class="rp-m-month" @scroll="scrollsss">
				<div class="year">{{ year - 1 }}</div>
				<ul class="month">
					<li v-for="index of months" :key="index" @click="!(year - 1 > date.year || (year - 1 == date.year && index > date.month)) &&next(index, year - 1)" :class="[
              {
                monthClass: year - 1 == date.year && index == date.month,
                monthDisabled:
                  year - 1 > date.year ||
                  (year - 1 == date.year && index > date.month),
              },
            ]">
						{{ index }}月
					</li>
				</ul>
				<div ref="newMonth" class="year">{{ year }}</div>
				<ul class="month">
					<li v-for="index of months" :key="index" @click="!(year > date.year || (year == date.year && index > date.month)) && next(index, year)" :class="[
              {
                monthClass: year == date.year && index == date.month,
                monthDisabled:
                  year > date.year || (year == date.year && index > date.month),
              },
            ]">
						{{ index }}月
					</li>
				</ul>
				<div class="year">{{ year + 1 }}</div>
				<ul class="month">
					<li v-for="index of months" :key="index" @click="!(year + 1 > date.year || (year + 1 == date.year && index > date.month)) && next(index, year + 1)" :class="[
              {
                monthClass: year + 1 == date.year && index == date.month,
                monthDisabled:
                  year + 1 > date.year ||
                  (year + 1 == date.year && index > date.month),
              },
            ]">
						{{ index }}月
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: '',
		title() {
			return '路线规划'
		},
		data() {
			return {
				months: 12,
				year: '',
				date: {
					year: '',
					month: '',
					day: '',
				},
			}
		},
		created() {},
		mounted() {
			this.getDate()
			// console.log(this.$refs.newMonth.getBoundingClientRect().top)
			this.$refs.refMonth.scrollTop = this.$refs.newMonth.getBoundingClientRect().top - 150
		},
		methods: {
			// 获取当前年，月
			getDate() {
				let t = this
				let date = new Date()
				t.$set(t, 'year', date.getFullYear())
				t.$set(t, 'date', {
					year: date.getFullYear(),
					month: date.getDate() >= 1 ? date.getMonth() + 2 : date.getMonth() + 1,
					day: date.getDate(),
				})
				if (t.date.month > 12) {
					t.$set(t, 'date', {
						year: t.year + 1,
						month: 1,
						day: date.getDate(),
					})
				}
			},
			scrollsss() {
				let t = this
				if (this.$refs.refMonth) {
					if (this.$refs.refMonth.scrollTop == 0) {
						t.$set(t, 'year', t.year - 1)
						t.$refs.refMonth.scrollTop = t.$refs.refMonth.scrollHeight / 3
					}
					if (
						t.$refs.refMonth.scrollHeight -
						(this.$refs.refMonth.clientHeight + this.$refs.refMonth.scrollTop) <
						5
					) {
						t.$set(t, 'year', t.year + 1)
						t.$refs.refMonth.scrollTop = t.$refs.refMonth.scrollHeight / 5 - 250
					}
				}
			},
			next(month, year) {
				this.$router.push(`route-planning/organize-list?year=${year}&month=${month}`)
			},
		},
	}
</script>

<style scoped lang="scss">
	.rp-index {
		background-color: #f8f8f9;
		display: flex;
		width: 100%;

		h2 {
			position: absolute;
			z-index: 10000;
			text-align: center;
			width: 100%;
		}

		padding-top: 1vw;

		.rp-m-lips {
			font-size: 2vw;
			font-weight: 600;
			text-align: center;
		}

		.rp-m-month {
			width: 100%;
			height: 37vw;
			overflow: auto;

			&::-webkit-scrollbar {
				display: none;
			}

			.year {
				font-size: 2vw;
				color: #d6d6d6;
				text-align: center;
				margin-top: 1vw;
			}

			.month {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				padding: 0px 2vw;
				margin-top: 0.5vw;

				li {
					cursor: pointer;
					text-align: center;
					margin-bottom: 1vw;
					border: 4px solid #cccccc;
					background: #ffffff;
					border-radius: 28px;
					width: 22vw;
					height: 6vw;
					line-height: 6vw;
					color: #999999;
					font-size: 3vw;
				}

				.monthClass {
					background: #1ab467;
					color: #ffffff;
					border: 4px solid #1ab467;
				}

				.monthDisabled {
					background: #f7f7f7;
					border: 4px solid #eeeeee;
					color: #e2e2e2;
				}
			}
		}
	}
</style>
