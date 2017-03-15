<template>
    <div class="vali_info">
        <div class="main">
            <group>
                <div class="my_title unit arrow show" @click="moduleShow('part1')">保险内容</div>
                <ul class="taocan" v-show="moduleList.part1">
                    <li v-for="duty in dutysList">
                        <div class="unit arrow" @click="dutyShow(duty)">
                            <div>{{duty.name}}</div>
                            <span>{{duty.text}}</span>
                        </div>
                        <div class="unit_desc" v-show="duty.show">{{duty.desc}}</div>
                    </li>
                </ul>
            </group>
            <group>
                <div class="my_title unit arrow show" @click="moduleShow('part2')">投保人信息</div>
                <div v-show="moduleList.part2" class="show_box">
                    <cell title="姓名">{{customData.protectName}}</cell>
                    <cell title="证件类型">{{customData.cardTypeListCurName}}</cell>
                    <cell title="证件号">{{customData.cardNum}}</cell>
                    <cell title="生日" v-if="hideForm.cardTypeFlag">{{customData.protectBirthday}}</cell>
                    <cell title="性别" v-if="hideForm.cardTypeFlag">{{customData.protectSexListCurName}}</cell>
                    <cell title="手机号">{{customData.phoneNum}}</cell>
                </div>
            </group>
            <group>
                <div class="my_title unit arrow show" @click="moduleShow('part3')">被保人信息</div>
                <div v-show="moduleList.part3" class="show_box">
                    <cell title="姓名">{{customData.protectedName}}</cell>
                    <cell title="与投保人关系">{{customData.relationListCurName}}</cell>
                    <cell title="证件类型">{{customData.cardTypeSubListCurName}}</cell>
                    <cell title="证件号">{{customData.protectedCardNum}}</cell>
                    <cell title="生日" v-if="hideForm.cardTypeSubFlag">{{customData.protectedBirthday}}</cell>
                    <cell title="性别" v-if="hideForm.cardTypeSubFlag">{{customData.protectedSexListCurName}}</cell>
                    <cell title="手机号">{{customData.protectedPhoneNum}}</cell>
                </div>
            </group>
            <group>
                <div class="my_title unit arrow show" @click="moduleShow('part4')">受益人</div>
                <div v-show="moduleList.part4" class="show_box">
                    <cell title="受益人">法定受益人</cell>
                </div>
            </group>
            <group>
                <div class="my_title unit arrow show" @click="moduleShow('part5')">保障期限</div>
                <div v-show="moduleList.part5" class="show_box effect_time">
                    <p>自：{{productData.effectDateCur}} 零时起</p>
                    <p>至：{{productData.stopDate}} 二十四时止</p>
                    <p>共：{{effectDays}} 天</p>
                </div>
            </group>
            <group>
                <div class="my_title unit arrow show" @click="moduleShow('part6')">保费</div>
                <div v-show="moduleList.part6" class="show_box black">
                    <cell title="保险费">{{productData.saleAmount}}</cell>
                </div>
            </group>
            <div class="footer">
                <div class="btn" @click="buyCard">订单支付</div>
            </div>
            <alert :show.sync="alertFlag" :title="alertMes">{{alertSubMes}}</alert>
            <loading :show="loadingFlag" :text="loadingMes"></loading>
        </div>
    </div>
</template>
<script>
import {XButton, Cell, Group, Picker, PopupPicker, XInput, Loading, Alert} from '../components'
import {policyUndwrt} from '../apis/productBuy.api';
import {msgProductDataGetter, msgCustomDataGetter} from '../vuex/getters';

export default{
    components: {
        Cell,
        Group,
        XButton,
        XInput,
        Picker,
        PopupPicker,
        Loading,
        Alert
    },
    vuex: {
        getters: {
            getProductData: msgProductDataGetter,
            getCustomData: msgCustomDataGetter
        }
    },
    created: function () {
        if (!this.getProductData.curProductData.inMyField) {
            var sign = sessionStorage.getItem('originalUrlSign');
            this.$router.go({
                name: 'productDetail',
                query: {sign: sign}
            });
        };
    },
    data () {
        return {
            effectDays: '',
            customData: '',
            productData: '',
            dutysList: '',
            isOff: true,
            isOn: false,
            moduleList: {
                part1: true,
                part2: true,
                part3: true,
                part4: true,
                part5: true,
                part6: true
            },
            hideForm: {
                cardTypeFlag: '',
                cardTypeSubFlag: '',
            },
            loadingFlag: false,
            loadingMes: '正在加载',
            alertMes: '',
            alertSubMes: '',
            alertFlag: false,
        }
    },
    ready: function () {
        this.effectDays = this.getCacheData('effectDays');
        this.customData = this.getCacheData('customData');
        this.productData = this.getCacheData('productData');
        this.dutysList = this.getCacheData('dutysList');
        this.hideForm.cardTypeFlag = this.getCacheData('cardTypeFlag');
        this.hideForm.cardTypeSubFlag = this.getCacheData('cardTypeSubFlag');
    },
    methods: {
        dutyShow: function (flag) {
            if (flag.show) {
                flag.show = false;
                event.currentTarget.className = 'unit arrow hide';
            }else{
                flag.show = true;
                event.currentTarget.className = 'unit arrow show';
            };
        },
        moduleShow: function (part) {
            if (this.moduleList[part]) {
                this.moduleList[part] = false;
                event.target.className = 'my_title unit arrow hide';
            }else{
                this.moduleList[part] = true;
                event.target.className = 'my_title unit arrow show';
            };
        },
        buyCard: function () {
            var cacheCurProData = this.getProductData.curProductData;
            var submitData ={
                saleRecordId: cacheCurProData.saleRecordId
            };
            this.loadingFlag = true;
            policyUndwrt(submitData).then((data) => {
                this.loadingFlag = false;
                if (data.data.resultCode === '00000') {
                    this.$router.go({
                        name: 'buyCard'
                    });
                }else{
                    this.alertFlag = true;
                    this.alertMes = data.data.resultMsg;
                };
            }, (data) => {
                this.loadingFlag = false;
                this.alertFlag = true;
                this.alertMes = '数据请求异常';
            });
        },
        dataHandle: function (date) {
            var s = date.split('-');
            var yy = parseInt(s[0]),
                mm = parseInt(s[1]),
                dd = parseInt(s[2]);
            if (mm < 10) {
                mm = '0' + mm;
            };
            if (dd < 10) {
                dd = '0' + dd;
            };
            return s = yy + '-' + mm + '-' + dd;
        },
        getCacheData: function (data) {
            var cacheData = this.$store.state;
            if (data === 'customData') {
                return this.getCustomData.customData;
            }else if(data === 'productData') {
                return this.getProductData.curProductData;
            }else if(data === 'dutysList') {
                return this.getProductData.curProductData.dutysList;
            }else if(data === 'effectDays') {
                var a = this.getProductData.curProductData.effectDateCur;
                var b = this.getProductData.curProductData.stopDate;
                a = new Date(this.dataHandle(a));
                b = new Date(this.dataHandle(b));
                var c = +b - (+a) + 24*60*60*1000;
                return c/1000/60/60/24;
            }else if(data === 'cardTypeFlag') {
                if (this.getCustomData.customData.cardTypeListCur == '01') {
                    return 0;
                }else{
                    return 1;
                };
            }else if(data === 'cardTypeSubFlag') {
                if (this.getCustomData.customData.cardTypeSubListCur == '01') {
                    return 0;
                }else{
                    return 1;
                };
            };
        }
    }
}
</script>
<style lang="less">
.vali_info{
    .main{
        width: 100%;
        background: #f6f6f6;
        padding-bottom: 2rem;
    }
    .main .footer{
        height: 1.5rem;
        width: 100%;
        position: fixed;
        bottom: 0;
        background: #fff;
        border-top: 1px solid #ececec;
    }
    .main .btn{
        height: 1.1rem;
        background: #4285F7;
        border-radius: 5px;
        font-size: 0.36rem;
        color: #fff;
        width: 85%;
        position: absolute;
        bottom: 0.2rem;
        left: 0;
        right: 0;
        margin: 0 auto;
        line-height: 1.1rem;
        text-align: center;
    }
    .my_title{
        border-left: 2px solid #4285F7;
        text-align: left;
        color: #000;
        padding-left: 5px;
        margin: 0.27rem 0;
        font-size: 0.4rem;
    }
    .agree{
        padding: 0.25rem 15px;
        background: #fff;
        border-top: 1px solid #ececec;
        position: relative;
    }
    .agree span{
        color:#666;
    }
    .on.diy_checkbox{
        background: #4285F7;
    }
    .diy_checkbox{
        display: inline-block;
        width: 0.27rem;
        height: 0.27rem;
        border-radius: 3px;
        border: 1px solid #4285F7;
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
    }
    .taocan{
        background: #fff;
        margin-top: -1px;
        border-bottom: 1px solid #ececec;
    }
    .taocan li{
        line-height: 1.1rem;
        margin-left: 15px;
    }
    .taocan .unit{
        border-top: 1px solid #ececec;
        height: 1.1rem;
    }
    .unit.arrow{
        position: relative;
    }
    .unit.arrow:after{
        content: '';
        width: 6px;
        height: 6px;
        display: inline-block;
        position: absolute;
        top: 50%;
        right: 15px;
        border-top: 2px solid #C8C8CD;
        border-right: 2px solid #C8C8CD;
        transform: translateY(-50%) rotateZ(45deg);
        transition: all 0.5s;
    }
    .unit.arrow.hide:after{
        transform: translateY(-50%) rotateZ(45deg);
    }
    .unit.arrow.show:after{
        transform: translateY(-50%) rotateZ(135deg);
    }
    .taocan .unit_desc{
        border-top: 1px solid #ececec;
        line-height: 0.5rem;
        padding: 0.3rem 15px 0.3rem 0;
        color: #666;
    }
    .taocan .show_desc .unit_desc{
        display: block !important;
    }
    .taocan .unit div{
        float: left;
    }
    .taocan .unit span{
        float: right;
        margin-right: 30px;
    }
    .show_box{
        border-top: 1px solid #ececec;
    }
    .effect_time{
        margin-left: 15px;
        line-height: 0.7rem;
        padding: 0.2rem 0;
    }
    .vux-no-group-title{
        font-size: 0.36rem;
    }
    .weui_input{
        text-align: right;
    }
    .vux-popup-picker-header{
        color: #4285F7 !important;
    }
    .vux-popup-picker-value{
        color: #000;
    }
    .full_line:before{
        left: 0;
    }
    .weui_label{
        color: #666;
    }
    .black .weui_cell_bd p{
        color: #000;
    }
    .weui_cell_bd p{
        color: #666;
    }
    .black .weui_cell_ft{
        color: #000;
    }
}
</style>