import * as filtersFun from '@/util/filters.js'
function multiBarChart(category_data = [], negative_data = [], positive_data = [], other_data = []) {
    return {
        grid: {
            left: '8%',
            right: '8%',
            bottom: '3%',
            top: '15%',
            containLabel: true
        },
        xAxis: [
            {
                show: false,
                type: 'value',
                boundaryGap: true,
                axisLabel: {
                    formatter: function (val) {
                        return val + 100
                    }
                }
            }
        ],
        yAxis: {
            name: '100',
            nameLocation: 'start',
            nameTextStyle: {
                color: '#ffffff',
                fontSize: '10'
            },
            type: 'category',
            axisTick: {
                show: false
            },
            // Y轴偏移
            offset: 10,
            // Y轴文本样式
            axisLabel: {
                color: '#ffffff',
                fontSize: 10
            },
            axisLine:{
                lineStyle:{
                    color:'#755A99',
                    type: 'dashed'
                }
            },
            data: category_data,
            // 反转Y轴类目从高->低
            inverse:true
        },
        series: [
            {
                type: 'bar',
                stack: '数值',
                label: {
                    show: false
                    // position: 'insideRight',
                    // fontSize: 10,
                    // color: '#fff'
                },
                itemStyle: {
                    color: '#5CADFF',
                    barBorderRadius: [0, 7, 7, 0]
                },
                // 设置柱子宽度
                barWidth: 14,
                data: positive_data,
                other: other_data
            },
            {
                type: 'bar',
                stack: '数值',
                label: {
                    show: false,
                    // position: 'insideLeft',
                    // fontSize: 10,
                    // color: '#fff',
                    // formatter: (value) => {
                    //     // 值都是负数的 所以需要取反一下
                    //     console.log('取反')
                    //     return -value.data
                    // }
                },
                itemStyle: {
                    color: '#ED3F14',
                    // borderColor: '#ffffff',
                    barBorderRadius: [7, 0, 0, 7]
                },
                data: negative_data,
                other: other_data
            }
        ],
        // 鼠标经过提示
        tooltip: {
            trigger: 'item',
            // 十字线显示
            axisPointer: {
                type: 'none'
            },
            backgroundColor: 'transparent',
            // 文本样式
            textStyle: {
                color: '#ffffff',
                fontSize: 10
            },
            formatter: params => {
                if(params.value >= 100) {
                    return (
                        '<div style="background-color:rgba(121,9,193,0.7);padding:6px; border-radius:4px;">' +
                        '<div style="font-size:12px;margin-bottom:8px;font-weight:bold">' + params.name + '</div>' +
                        '<div><span style="width:40px; display:inline-block">TGI</span> ' + ((params.value + 100)).toFixed(2) + '%</div>' +
                        '<div><span style="width:40px; display:inline-block">门店数</span> ' + filtersFun.numFormat(params.data.storeNumber) + '</div>' +
                        '<div><span style="width:55px; display:inline-block">店群占比</span> ' + filtersFun.numFormat(params.data.perCent) + '%</div>' +
                        '<div><span style="width:80px; display:inline-block">GAIA大盘占比</span> ' + filtersFun.numFormat(params.data.theBigBoard) + ' %</div>' +
                        '</div>'
                    )
                } else {
                    // 因为小于100的值是负值，所以要用 100 + value求正值来显示
                    return (
                        '<div style="background-color:rgba(121,9,193,0.7);padding:6px; border-radius:4px;">' +
                        '<div style="font-size:12px;margin-bottom:8px;font-weight:bold">' + params.name + '</div>' +
                        '<div><span style="width:40px; display:inline-block">TGI</span> ' + ((params.value + 100)).toFixed(2) + '%</div>' +
                        '<div><span style="width:40px; display:inline-block">门店数</span> ' + filtersFun.numFormat(params.data.storeNumber) + '</div>' +
                        '<div><span style="width:55px; display:inline-block">店群占比</span> ' + filtersFun.numFormat(params.data.perCent) + '%</div>' +
                        '<div><span style="width:80px; display:inline-block">GAIA大盘占比</span> ' + filtersFun.numFormat(params.data.theBigBoard) + ' %</div>' +
                        '</div>'
                    )
                }
            }
        }
    }
}

export default multiBarChart