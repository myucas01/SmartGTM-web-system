<!--
 * @Description: In User Settings Edit.selectCombo /deep/.el-select--mini .el-input .el-input__inner {
  color: rgba(0, 0, 0, 0);
  background: none;
}.selectCombo /deep/.el-select--mini .el-input .el-input__inner {
  color: rgba(0, 0, 0, 0);
  background: none;
}
 * @Author: your name
 * @Date: 2019-09-16 22:02:13
 * @LastEditTime: 2019-09-18 11:04:33
 * @LastEditors: Please set LastEditors
 -->
<template>
    <div class='selectCombo'>
            <div  class="selectP">
                <p>
                    <img class="selectImg" :src="checkValue" v-if="checkValue"/>
                </p>
                <el-select style="color:rgba(0,0,0,0)"
                           v-model="checkValue"
                           id="imgSelectInput"
                           size='small'
                           placeholder="请选择"
                           class="selectInput smart_select_deep"
                           @change="valueChange">
                    <el-option
                            v-for="(item,index) in dataArr"
                            :key="index"
                            :value='index'>
                             <img class="selectImg" :src="item.src"/>
                    </el-option>
                </el-select>

            </div>
    </div>
</template>

<script>
    export default {
        name: "select",
        data(){
            return{
                optionShow:false,
                checkValue:null,
                dataArr:[
                    {
                        id:1,
                        name:'',
                        src:'/img/selectIcon1.png'
                    },
                    {
                        id:2,
                        name:'',
                        src:'/img/selectIcon2.png'
                    },
                    {
                        id:3,
                        name:'',
                        src:'/img/selectIcon3.png'
                    },
                    {
                        id:4,
                        name:'',
                        src:'/img/selectIcon4.png'
                    },
                    {
                        id:5,
                        name:'',
                        src:'/img/selectIcon5.png'
                    },
                    {
                        id:6,
                        name:'',
                        src:'/img/selectIcon6.png'
                    },

                ],
                checkImg:''
            }
        },
        mounted(){
            let  el =document.getElementById('imgSelectInput')
            el.style.cssText="color:rgba(0,0,0,0) !important;background: none;"
        },
        props:['params'],
        watch:{
            params(val){
                if(val){

                    let n=''
                    this.dataArr.forEach((item)=>{
                        if(item.id==val){
                           n=item.src

                        }
                    })
                    this.checkValue=n
                }
            }
        },
        methods:{

            valueChange(i){
                this.checkValue=this.dataArr[i].src;
                this.$emit('iconChange',this.dataArr[i])
                //this.hideOption()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .selectCombo{
        /*position: relative;*/
    }
    .selectImg{
        display: inline-block;
        width: 22px;
        height: 22px;
        position: relative;
    }
    .selectP{
        height: 30px;
    }
    .selectP p{
        line-height: 30px;
        height:30px;
        padding: 0 15px;
        width: 90%;
        text-align: left;
    }
    .selectInput{
        float: left;
        background: none;
        position: relative;
        top: -30px;
    }
</style>
