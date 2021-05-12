<template>
    <div class='selectCombo'>
            <div  class="selectP">
                <div>
                    <hr class="edge-line" :style="{'border': value+'px solid black'}"/>
                </div>
                <el-select style="color:rgba(0,0,0,0)"
                           v-model="checkIndex"
                           id="borderInput"
                           size='small'
                           placeholder=" "
                           class="selectInput smart_select_deep"
                            @change="valueChange">
                    <el-option
                            v-for="(item,index) in opstionArr"
                            :key="index"
                            :label='item.name'
                            :value='index'>
                            <hr class="edge-line" :style="{'border': item.value+'px solid black'}"/>
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
                checkIndex:'',
                value:'',
                opstionArr:[
                    {
                        id:0,
                        name:'',
                        value:1
                    },
                    {
                        id:1,
                        name:'',
                        value:1.8
                    },
                    {
                        id:2,
                        name:'',
                        value:2.2
                    },
                    {
                        id:3,
                        name:'',
                        value:2.8
                    },
                    {
                        id:4,
                        name:'',
                        value:3
                    }

                ],
            }
        },
        mounted(){
            let  el =document.getElementById('borderInput')
            el.style.cssText="color:rgba(0,0,0,0) ;background: none;"
        },
        props:['params'],
        watch:{
            params(val){
                if(val){
                    this.value=val
                }
            }
        },
        methods:{
            valueChange(i){
                console.log(i)
                this.value=this.opstionArr[i].value
              this.$emit('borderSizeChange',this.opstionArr[i])
                //this.hideOption()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .selectCombo{
        // position: relative;
    }
    .options{
        position: absolute;
        background: #ffffff;
        width: 100%;
        z-index: 9999;
        color: #000000;
    }
    .colors{
      display: inline-block;
        width: 10%;
        height:5px
    }
    .selectP{
        height: 30px;
    }
    .selectP div:first-child{
        line-height: 30px;
        height:30px;
        padding: 0 15px;
        width: 75%;
    }
    .selectInput{
        float: left;
        background: none;
        position: relative;
        top: -30px;
    }
    .edge-line{
        position: relative;
        top: 50%;
        transform: translate(0,-50%);
        margin: 0;
    }
</style>
