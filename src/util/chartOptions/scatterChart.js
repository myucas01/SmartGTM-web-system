// 散点图
import * as filtersFun from '@/util/filters.js'
function scatterChart(data = []) {
    return {
        grid: {
            left: '3%',
            right: '3%',
            top: '10%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            // 是否显示轴线上的刻度
            axisTick: {
                show: false
            },
            // 是否显示轴线
            axisLine: {
                lineStyle: {
                    color: '#979797'
                }
            },
            // x轴坐标label文本设置
            axisLabel: {
                // 字体大小10
                fontSize: 10,
                color: '#DDDEE1',
                // 显示所有类型
                interval: 0,
                rotate: 40
            }
        },
        yAxis: {
            // 轴线
            axisLine: {
                // 是否显示
                show: false
            },
            // 是否显示轴线上的刻度
            axisTick: {
                show: false
            },
            // y轴坐标label文本设置
            axisLabel: {
                // 字体大小10
                fontSize: 10,
                color: '#ffffff'
            },
            // x轴在grid中的分割线
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dotted',
                    color: '#979797'
                }
            }
        },
        series: [
            {
                data: data,
                type: 'scatter',
                // 控制点大小，以元数据第三个值为标准
                symbolSize: function (data) {
                    return Math.sqrt(data[2]) * 5
                    // return data[2] * 100
                },
                itemStyle: {
                    color: (e) => {
                        if (e.data[1] < 100) {
                            return '#ED3F14'
                        } else {
                            return '#5CADFF'
                        }
                    }
                },
                tooltip: {
                    // 放格式化数据
                }
            }
        ],
        // 鼠标经过提示
        tooltip: {
            // 当鼠标hover时，触发X轴，而不是非要hover在散点才触发
            trigger: 'axis',
            // 十字线显示
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#ffffff'
                }
            },
            backgroundColor: 'transparent',
            // 文本样式
            textStyle: {
                color: '#ffffff',
                fontSize: 10
            },
            formatter: params => {
                return (
                    '<div style="background-color:rgba(121,9,193,0.7);padding:6px; border-radius:4px;">' +
                    '<div style="font-size:14px;margin-bottom:8px;font-weight:bold">' + params[0].value[0] + '</div>' +
                    '<div><span style="width:30px; display:inline-block">TGI</span> ' + filtersFun.numFormat(params[0].value[1]) + ' %</div>' +
                    '<div><span style="width:30px; display:inline-block">占比</span> ' + filtersFun.numFormat(params[0].value[2]) + '%</div>' +
                    '<div><span style="width:40px; display:inline-block">门店数</span> ' + filtersFun.numFormat(params[0].value[3]) + '</div>' +
                    '</div>'
                )
            }
        }
    }
}

export default scatterChart