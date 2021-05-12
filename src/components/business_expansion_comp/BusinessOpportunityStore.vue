<!-- 商机门店 -->

<template>
    <div class="BusinessOpportunityStoreBox">
        <div class="headerBox">
            <span @click='goBack'><i class="el-icon-arrow-left
"></i><p>返回</p></span>
        </div>
        <div class="contentBox">
            <div class="contentBox_left">
                <div class="step">
                    <div class="stepNumBox" v-for="(item,index) in stepsNum" :key='index'>
                        <span class="writeStatus" v-if="stepNum === item-1">{{item}}</span>
                        <span class="sucessStatus" v-if='stepNum > item-1'><i class="el-icon-check"></i></span>
                        <span class="stepLine" :class="stepNum === item-1?'stepLineWriteStatus':'stepLineSucessStatus'" v-if="stepNum >= item-1"></span>
                    </div>
                </div>
            </div>
            <div class="contentBox_right">
                <div class="right_inBox">
                    <div class="selectStor1" v-if="stepNum === 0">
                        <span class="selectleft flex_row ">
                            <p class="h52">选择种子门店</p>
                            <el-select v-model="selectValue" size="small" filterable placeholder="请选择">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </span>
                        <router-link to='/business-expansion/index' class="selectright ">
                            <span  class="flex_row h32"><p class="h32">+</p> 创建新种子门店</span>
                        </router-link>
                    </div>
                    <div class="selectStor2" v-if="stepNum > 0 ">
                        <div>
                            <p class="h32">选择种子门店</p>
                            <p v-if="selectValue">{{selectValue}}</p>
                        </div>
                    </div>
                    <div class="magnitudeBox" v-if="stepNum >= 1">
                        <span class="magnitudeInnerTitle">
                            <p class="">拓展量级</p>
                        </span>
                        <div class="settingBox">
                            <p class="">相似度阈值</p>
                            <div class="settingPuc">
                                <div class="settingPucIn">
                                    <el-slider
                                    :disabled='stepNum !== 1'
                                    v-model="magnitudeValue"
                                    :format-tooltip="formatTooltip"
                                    :show-tooltip="true"
                                    :min="50"
                                    :max="100"
                                    ></el-slider>
                                    <span class="lalelBox">
                                        <p>50%</p>
                                        <p>100%</p>
                                    </span>
                                </div>
                                <span class="settingPucInRight flex_row">预计能达到 <p>245,987</p> 门店数</span>
                            </div>
                        </div>
                    </div>
                    <div class="storesMessage" v-if="stepNum >= 2">
                        <span class="magnitudeInnerTitle">
                            <p class="">填写店群名称和描述</p>
                        </span>
                        <div class="StoresContentBox">
                            <div class="storesName">
                                <p class="p1">店群名称</p>
                                <el-input v-if='stepNum === 2' placeholder="请输入种子店群名称（字数限制30字以内）" maxlength="30" ref='inputBox' v-model="storesName" size="small"></el-input>
                                <span v-if='stepNum !== 2 && storesName' class="storeNameshow">{{storesName}}</span>
                            </div>
                            <div class="miaoshu">
                                <span class="miaoshutittle">
                                    门店描述 
                                    <i class="el-icon-arrow-down" v-if="textAreaShow && stepNum === 2 && !textAreaShow" @click="textAreaShow=!textAreaShow"></i>
                                    <i class="el-icon-arrow-up" v-if="!textAreaShow && stepNum === 2 && !textAreaShow" @click="textAreaShow=!textAreaShow"></i>
                                </span>
                                <div class="textAreaBox" v-if="stepNum !== 2&&textarea !== ''">
                                    {{textarea}}
                                </div>
                                <el-input
                                type="textarea"
                                v-if='textAreaShow && stepNum === 2'
                                placeholder="请输入内容（选填）"
                                maxlength="100"
                                v-model="textarea">
                                </el-input>
                            </div>
                        </div>
                    </div>
                    <div class="weightSetting" v-if="stepNum >= 3">
                        <span class="magnitudeInnerTitle">
                            <p class="">确定特征权重</p>
                            <el-tooltip class="item" effect="light" placement="bottom-start">
                                <div slot="content"></div>
                                <p>?</p>
                            </el-tooltip>
                        </span>
                        <div class="weightSettingContentBox">
                            <div class="sliderBox" v-for="(item,index) in sliderInfo" :key='index'>
                                <p class="">{{item.name}}</p>
                                <div class="weightSettingPuc">
                                    <div class="weightSettingPucIn">
                                        <el-slider
                                        :disabled='stepNum !== 3'
                                        v-model="item.value"
                                        :show-tooltip="true"
                                        :min="-10"
                                        :max="10"
                                        ></el-slider>
                                        <span class="lalelBox">
                                            <p>-10</p>
                                            <p>10</p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="btnBox">
                <el-button size="small" @click='Back' v-if='stepNum !==0'>上一步</el-button>
                <el-button size="small" @click='next' v-if='stepNum !==4'>下一步</el-button>
                <el-button size="small" @click='creatStore' type="primary" v-if='stepNum ===4'>创建商机门店</el-button>
            </div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="TipsVisible"
            width="30%">
            <span>确认创建商机门店？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="TipsBackBtn">上一步</el-button>
                <el-button type="primary" @click="TipFixBtn">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="计算中"
            :visible.sync="calculationVisible"
            width="30%">
            <div class="img"><img src="/img/undraw_loading.png" alt=""></div>
            <div>预计还需要一天计算完成…</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="calculationBtn">店群详情</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'BusinessOpportunityStore',
    data() {
        return {
            stepNum: 0,
            magnitudeValue: 0,
            estimateStoreNum: '245,987',
            storesName:'',
            textAreaShow:false,
            textarea: '',
            visitorsFlowrateValue: 0,//人流量特征
            stepsNum: [1,2,3,4],
            TipsVisible: false,
            calculationVisible: false,
            sliderInfo: [
                {
                    name: '人流量特征',
                    value: 0
                },
                {
                    name: '交通便利特征',
                    value: 0
                },
                {
                    name: '消费力指数特征',
                    value: 0
                },
                {
                    name: '门店密集程度特征',
                    value: 0
                },
                {
                    name: '房价',
                    value: 0
                },
            ],
            marks: {
                50: '50%',
                100: '100%'
            },
            options: [
                {
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }
            ],
            selectValue: ''
            }
    },
    watch:{
    },
    
    created() {

    },
    mounted() {

    },
    methods: {
        goBack() {
            this.$router.go(-1)
        },
        formatTooltip(val) {
            return val + '%';
        },
        Back() {
            if(this.stepNum !== 0 ) {
                this.stepNum = --this.stepNum
            }else {
                this.stepNum = 0
            }
        },
        next() {
            if( this.stepNum === 0 && this.selectValue === '') {
                this.$message({
                    message: '请选择种子门店',
                    type: 'warning'
                })
                return
            }
            if( this.stepNum === 2 && this.storesName === '') {
                this.$message({
                    message: '填写店群名称',
                    type: 'warning'
                })
                return
            }
            if(this.stepNum !== 4 ) {
                this.stepNum = ++this.stepNum
            }else {
                this.stepNum = 4
            }
        },
        creatStore() {
            console.log('创建商机门店');
            this.TipsVisible = true
        },
        TipsBackBtn() {
            this.TipsVisible = false
        },
        TipFixBtn() {
            this.TipsVisible = false
            this.calculationVisible = true
        },
        calculationBtn() {
            this.calculationVisible = false
            this.$router.push('/business-expansion/store-community-list')
        }
    },

}
</script>
<style lang="scss" scoped>
.BusinessOpportunityStoreBox {
    position: relative;
    width: 100%;
    height: 100%;
    background: #F8F8F9;
    .headerBox {
        // width: 100%;
        position: absolute;
        top:0;
        left: 0;
        margin: 21px 0 0 0;
        padding-left: 14px;
        span {
            cursor:pointer;
            background: #fff;
            width: 80px;
            height: 32px;
            line-height: 32px;
            display: inline-block;
            border: 1px solid #DDDEE1;
            text-align: center;
            border-radius: 4px;
            font-size: 12px;
            color: #495060;
            p:nth-of-type(1) {
                display: inline;
                margin-left: 5px
            }
        }
    }
    .contentBox {
        margin: 0 auto;
        width: 790px;
        padding: 20px 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .contentBox_left {
            display: flex;
            flex-direction: column;
            .step {
                width: 32px;
                height: 500px;
                .stepNumBox {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    span {
                        width: 26px;
                        height: 26px;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 26px;
                        font-size: 18px;
                        font-weight: 600;
                        margin: 1px 0;
                        i{
                            font-weight: 600;
                        }
                    }
                    .writeStatus {
                        border: 2px solid #BBBEC4;
                        color: #BBBEC4;
                    }
                    .sucessStatus {
                        border: 2px solid #A634EF;
                        color: #A634EF;
                    }
                    .stepLine {
                        display: inline-block;
                        border-radius: 0%;
                        width: 0px;
                        height: 74px;
                        border: 1px solid #BBBEC4
                    }
                    .stepLineWriteStatus {
                        border-color: #BBBEC4;
                    }
                    .stepLineSucessStatus {
                        border-color: #A634EF;
                    }
                }
                .stepNumBox:nth-of-type(2) {
                    .stepLine {
                        height: 138px
                    }
                }
                .stepNumBox:nth-of-type(3) {
                    .stepLine {
                        height: 154px
                    }
                }
                .stepNumBox:nth-of-type(4) {
                    .stepLine {
                        height: 238px
                    }
                }
            }
        }
        .contentBox_right {
            width: 750px;
            display: flex;
            flex-direction: column;
            .right_inBox {
                width: 100%;
                .selectStor1 {
                    width: 100%;
                    padding:0 14px;
                    height: 52px;
                    line-height: 52px;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    background: #fff;
                    .selectleft {
                        p {
                            margin-right: 14px;
                            color: #495060;
                            font-weight: 600;
                            text-align: center;
                        }
                    }
                    .selectright {
                        height: 32px;
                        line-height: 32px;
                        span {
                            display: inline-block;
                            width: 121px;
                            height: 32px;
                            line-height: 32px;
                            padding: 0 9px;
                            display: flex;
                            flex-direction: row;
                            background: #A634EF;
                            color: #fff;
                            border-radius: 4px;
                            p {
                                width: 20px;
                                margin-right: 5px;
                                font-size: 32px;
                                
                            }
                        }
                    }
                }
                .selectStor2 {
                    height: 99px;
                    width: 100%;
                    padding:0 14px;
                    display: flex;
                    flex-direction: column;
                    background: #fff;
                    div {
                        p {
                            color: #495060;
                            font-weight: 600;
                        }
                        p:nth-of-type(2) {
                            display: inline-block;
                            height: 42px;
                            padding: 10px 8px;
                            background: #A634EF;
                            color: #fff;
                            border-radius: 4px;
                            box-sizing: border-box;
                        }
                    }
                }
                .magnitudeBox {
                    margin: 10px 0;
                    background: #fff;
                    height: 145px;
                    width: 100%;
                    padding: 10px 14px;
                    .magnitudeInnerTitle {
                        display: inline-block;
                        margin-bottom: 15px;
                        p {
                            color:#535A6B;
                            font-size: 12px;
                            font-weight: 600;
                        }
                    }
                    .settingBox {
                        p{
                            margin-bottom: 50px;
                        }
                        .settingPuc {
                            
                            display: flex;
                            flex-direction: row;
                            .settingPucIn {
                                width: 300px;
                                margin-left: 10px;
                                .lalelBox {
                                    width: 330px;
                                    height: 20px;
                                    margin-left: -10px;
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: space-between;
                                }
                            }
                            .settingPucInRight {
                                height: 38px;
                                line-height: 38px;
                                margin-left: 22px;
                                font-size: 12px;
                                p {
                                    color: #A634EF;
                                    margin: 0 5px;
                                }
                            }
                        }
                    }
                }
                .storesMessage{
                    height: 160px;
                    width: 100%;
                    background: #fff;
                    padding: 10px 14px;
                    .magnitudeInnerTitle {
                        display: inline-block;
                        margin-bottom: 15px;
                        p {
                            color:#535A6B;
                            font-size: 12px;
                            font-weight: 600;
                        }
                    }
                    .StoresContentBox {
                        .storesName {
                            display: flex;
                            flex-direction: row;
                            .p1 {
                                display: inline-block;
                                width: 53px;
                                height:32px;
                                line-height: 32px;
                                color: #7F8797;
                                margin-right: 20px;
                            }
                            ::v-deep.el-input {
                                .el-input__inner {
                                    width: 274px;
                                }
                            }
                        }
                        .storeNameshow {
                            height: 32px;
                            padding: 10px 8px;
                            background: #A634EF;
                            color: #fff;
                            border-radius: 4px;
                            box-sizing: border-box;
                        }
                        .miaoshu {
                            margin: 15px 0;
                            color: #7F8797;
                            display: flex;
                            flex-direction: row;
                            .miaoshutittle {
                                width: 73px;
                                display: flex;
                                margin-bottom: 5px;
                                flex-direction: row;
                                justify-content: space-between;
                            }
                            .textAreaBox {
                                flex: 1;
                                height: 74px;
                                padding: 10px 8px;
                                background: #A634EF;
                                color: #fff;
                                border-radius: 4px;
                                box-sizing: border-box;

                            }
                            ::v-deep.el-textarea {
                                .el-textarea__inner {
                                    height: 74px
                                }
                            }
                        }
                    }
                }
                .weightSetting {
                    margin: 10px 0;
                    background: #fff;
                    height: 254px;
                    width: 100%;
                    padding: 10px 14px;
                    .magnitudeInnerTitle {
                        display: inline-block;
                        margin-bottom: 15px;
                        position: relative;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        p {
                            color:#535A6B;
                            font-size: 12px;
                            font-weight: 600;
                        }
                        p:nth-of-type(2) {
                            width: 14px;
                            height: 14px;
                            line-height: 14px;
                            text-align: center;
                            border-radius: 7px;
                            color: #fff;
                            background: #DDDEE1;
                            margin-left: 5px;
                        }
                    }
                    .weightSettingContentBox {
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;
                        .sliderBox {
                            width: 230px;
                            height: 103px;
                            margin: 0 5px;
                            padding: 0 5px;
                            box-sizing: border-box;
                            .weightSettingPuc {
                                width: 230px;
                                padding-top: 50px;
                                border-right: 1px solid #E9EAEC;
                                margin-right: 5px;
                                box-sizing: border-box;
                                .weightSettingPucIn {
                                    width: 210px;
                                    margin: 0 auto;
                                    ::v-deep.el-slider__runway {
                                        margin: 4px 0;
                                    }
                                }
                                .lalelBox {
                                    width: 215px;
                                    height: 20px;
                                    margin-left: -5px;
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: space-between;
                                }
                            }
                            
                            
                        }
                        .sliderBox:nth-of-type(1),.sliderBox:nth-of-type(4) {
                            padding-left: 0px;
                        }
                        .sliderBox:nth-of-type(5),.sliderBox:nth-of-type(4) {
                            margin-top: 5px
                        }
                        .sliderBox:nth-of-type(3) {
                            .weightSettingPuc {
                                border-right: 1px solid rgba(0,0,0,0)
                            }
                        }
                    }
                }
            }
        }
    }
    .footer {
        width: 100%;
        height: 40px;
        position: absolute;
        bottom: 14px;
        left: 0;
        .btnBox {
            display: flex;
            flex-direction: row;
            justify-content: center;
            .el-button {
                width: 120px;
            }
        }
    }
    ::v-deep.el-dialog__body {
        text-align: center;
        .img{
            width: 156px;
            height: 120;
            margin:0 auto 20px;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
}
.settingPucIn,.weightSettingPucIn {
    ::v-deep.el-slider__runway.disabled .el-slider__bar {
        background-color: #CC7CFF
    }
    ::v-deep.el-slider__runway.disabled .el-slider__button {
        border-color: #CC7CFF
    }
}
.flex_row {
    display: flex;
    flex-direction: row;
}
.flex_column {
    display: flex;
    flex-direction: column;
}
.h32 {
    height: 32px;
    line-height: 32px;
}
.h52 {
    height: 52px;
    line-height: 52px;
}
.bg-zi {
    .el-input__inner {

        background: #930CEA;
    }
}
</style>