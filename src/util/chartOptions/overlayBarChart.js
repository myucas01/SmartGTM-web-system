// 堆叠柱状图
// import * as filtersFun from '@/util/filters.js'
function overlayBarChart(category = [], data = []) {
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            // 背景色
            backgroundColor: 'transparent',
            padding: 0,
            // 文本样式
            textStyle: {
                // color: '#ffffff',
                fontSize: 12
            },
            formatter: function (params) {
                let area_name = params[0].name
                let list_str = ''
                let total_num = 0
                for(let i = 0; i < params.length; i++){
                    total_num = total_num + parseInt(params[i].value)
                    list_str += `<div style="font-size:12px; color:#E8E8EA;margin-bottom:4px;">${params[i].seriesName}：${parseInt(params[i].value)}</div>`
                }
                return (
                    '<div style="background-color:rgba(70, 76, 91, 0.9);padding:8px; border-radius:4px;">' +
                        '<div style="font-size:14px;font-weight:bold">'+ area_name +'</div>' +
                        '<div style="font-size:12px;font-weight:bold;margin-top:14px;margin-bottom:4px;">合计：'+ total_num +'</div>' +
                        list_str +
                    '</div>'
                )
            }
        },
        legend: {
            show:false
        },
        color: ['#FFA300', '#FFC604', '#FAE900', '#00E7C0', '#308FE9', '#5BD800'],
        grid: {
            left: 0,
            right:0,
            top: '10%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: category,
            // x坐标轴刻度是否显示
            axisTick: {
                show: false
            },
            // x坐标轴线是否显示
            axisLine: {
                lineStyle: {
                    color: '#B3B3B3'
                }
            },
            // x轴坐标label文本设置
            axisLabel: {
                // 字体大小
                fontSize: 8,
                // 距离顶部20
                padding: [0, 0, 0, 0],
                // 强制所有x轴类别都显示
                interval: 0,
                rotate: 40,
                color: '#495060'
            }
        },
        yAxis: {
            type: 'value',
            // x坐标轴线是否显示
            axisLine: {
                lineStyle: {
                    color: '#B3B3B3'
                }
            },
        },
        series: data
    }
}

export default overlayBarChart