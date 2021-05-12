// 环状图
import * as filtersFun from '@/util/filters.js'
function pieChart(data = []) {
    // 将每个模块的颜色合成数组
    let color_arr = []
    data.forEach(item => {
        color_arr.push(item.color)
    })
    return {
        grid: {
            top: 0,
            bottom: 0
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            width:'400px',
            show: false
        },
        color: color_arr,
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: ['65%', '95%'],
                // 禁止鼠标经过弹起局部
                hoverAnimation:false,
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: false
                    }
                },
                labelLine: {
                    show: false
                },
                data: data,
                tooltip: {
                    // 背景色
                    backgroundColor: 'transparent',
                    padding: 0,
                    // 文本样式
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 12
                    },
                    formatter: function (params) {
                        return (
                            '<div style="background-color:rgba(70, 76, 91, 0.9);padding:4px; border-radius:4px;">' +
                            '<div>' + params.data.businessLevelName + '：' + filtersFun.numFormat(params.data.value) + '个' + '（' + params.data.businessProportion + '）' + '</div>' +
                            '</div>'
                        )
                    }
                }
            }
        ]
    }
}

export default pieChart