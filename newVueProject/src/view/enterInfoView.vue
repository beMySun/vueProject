<template>
    <div class="enter_info">
        <div class="main">
            <group>
                <div class="my_title">投保人信息</div>
                <div class="line"></div>
                <div class="input_area first_line">
                    <span>姓名</span>
                    <input type="text" checkType="chinaName" placeholder="请填写姓名" @blur="check" @focus="buttonMove" v-model="protectName" id="protectName">
                </div>
                <popup-picker :title="cardType" :data="cardTypeList" :columns="1" :value.sync="cardTypeListCur" show-name></popup-picker>
                <div class="input_area">
                    <span>证件号码</span>
                    <input type="text" checkType="card" id="cardNum" placeholder="请填写证件号" @blur="check" @focus="buttonMove" v-model="cardNum">
                </div>
                <datetime :value.sync="protectBirthday" title="生日" v-if="hideForm.cardTypeFlag" :min-year="minYear" :max-year="maxYear" :min-month="minMonth" :max-month="maxMonth" :min-day="minDay" :max-day="maxDay"></datetime>
                <popup-picker title="性别" :data="protectSexList" :columns="1" :value.sync="protectSexListCur" show-name v-if="hideForm.cardTypeFlag"></popup-picker>
                <div class="input_area">
                    <span>手机号</span>
                    <input type="tel" checkType="phone" placeholder="请填写手机号" @blur="check" @focus="buttonMove" v-model="phoneNum" id="phoneNum">
                </div>
            </group>
            <group>
                <div class="my_title">被保人信息</div>
                <div class="agree">
                    <span>被保人同投保人</span>
                    <div class="diy_checkbox" @click="agreeFlag" v-bind:class="{ 'off': isOff, 'on': isOn }"><icon type="success_no_circle" class="icon_small" v-show="isOn" style="position:absolute;top:-7px;left:-2px;"></icon></div>
                </div>
                <div class="line"></div>
                <div class="input_area first_line">
                    <span>姓名</span>
                    <input type="text" checkType="chinaName" placeholder="请填写姓名" @blur="check" @focus="buttonMove" v-model="protectedName" id="protectedName">
                </div>
                <popup-picker :title="relation" :data="relationList" :columns="1" :value.sync="relationListCur"  show-name></popup-picker>
                <popup-picker :title="cardTypeSub" :data="cardTypeSubList" :columns="1" :value.sync="cardTypeSubListCur" show-name></popup-picker>
                <div class="input_area">
                    <span>证件号码</span>
                    <input type="text" checkType="card" placeholder="请填写证件号" id="protectedCardNum" @blur="check" @focus="buttonMove" v-model="protectedCardNum">
                </div>
                <cell title="生日" v-if="!protectedBirthdayType&&hideForm.cardTypeSubFlag">{{protectedBirthdayOne}}</cell>
                <datetime :value.sync="protectedBirthday" title="生日" v-if="hideForm.cardTypeSubFlag&&protectedBirthdayType" :min-year="minYearSub" :max-year="maxYearSub" :min-month="minMonthSub" :max-month="maxMonthSub" :min-day="minDaySub" :max-day="maxDaySub"></datetime>
                <cell title="性别" v-if="sexFlag&&hideForm.cardTypeSubFlag">{{fixSex}}</cell>
                <popup-picker title="性别" :data="protectedSexList" :columns="1" :value.sync="protectedSexListCur" show-name v-if="!sexFlag&&hideForm.cardTypeSubFlag"></popup-picker>
                <div class="input_area">
                    <span>手机号</span>
                    <input type="tel" checkType="phone" placeholder="请填写手机号" @blur="check" @focus="buttonMove" v-model="protectedPhoneNum" id="protectedPhoneNum">
                </div>
            </group>
            <div class="footer" v-bind:class="{ 'fixPosition': buttonMoveFlag }">
                <div class="btn" @click="next" v-bind:class="{ 'absPosition': buttonMoveFlag }">下一步</div>
            </div>
            <alert :show.sync="alertFlag" :title="alertMes">{{alertSubMes}}</alert>
            <toast :show.sync="toastFlag" type="text" width="auto">{{toastMes}}</toast>
            <loading :show="loadingFlag" :text="loadingMes"></loading>
        </div>
    </div>
</template>
<script>
import { XButton, Cell, Group, Picker, PopupPicker, XInput, Datetime, Alert, Icon, Toast, Loading } from '../components'
import { recordInsured } from '../apis/productBuy.api';
import {productData, customData} from '../vuex/actions';
import {msgProductDataGetter, msgCustomDataGetter} from '../vuex/getters';

export default{
    components: {
        Cell,
        Group,
        XButton,
        XInput,
        Picker,
        PopupPicker,
        Datetime,
        Alert,
        Icon,
        Toast,
        Loading
    },
    vuex: {
        getters: {
            getProductData: msgProductDataGetter,
            getCustomData: msgCustomDataGetter
        },
        actions: {
            saveProductData: productData,
            saveCustomData: customData
        }
    },
    data () {
        return {
            cardType: '证件类型',
            cardTypeList: [{
                name: '身份证',
                value: '01'
            },{
                name: '护照',
                value: '02'
            },{
                name: '军官证',
                value: '03'
            },{
                name: '少儿证',
                value: '04'
            },{
                name: '出生证',
                value: '07'
            },{
                name: '户口本',
                value: '08'
            },{
                name: '其他',
                value: '99'
            }],
            cardTypeListCur: ['01'],
            cardTypeSub: '证件类型',
            cardTypeSubList: [{
                name: '身份证',
                value: '01'
            },{
                name: '护照',
                value: '02'
            },{
                name: '军官证',
                value: '03'
            },{
                name: '少儿证',
                value: '04'
            },{
                name: '出生证',
                value: '07'
            },{
                name: '户口本',
                value: '08'
            },{
                name: '其他',
                value: '99'
            }],
            cardTypeSubListCur: ['01'],
            protectSexList: [{
                name: '男',
                value: 'M'
            },{
                name: '女',
                value: 'F'
            }],
            protectSexListCur: ['M'],
            protectedSexList: [{
                name: '男',
                value: 'M'
            },{
                name: '女',
                value: 'F'
            }],
            protectedSexListCur: ['M'],
            relation: '和投保人关系',
            relationList: [{
                name: '本人',
                value: '1'
            },{
                name: '配偶',
                value: '2'
            },{
                name: '子女',
                value: '3'
            },{
                name: '父母',
                value: '4'
            }],
            relationListCur: ['1'],
            cardNum: '',
            protectName: '',
            phoneNum: '',
            protectedCardNum: '',
            protectedCardNumCheckFlag: false,//用于判断被保人证件号码同步时何时被校验
            protectedName: '',
            protectedPhoneNum: '',
            protectBirthday: '',
            protectedBirthday: '',
            protectedBirthdayOne: '',
            isOff: true,
            isOn: false,
            minYear: this.getProtectBirthday('minYear'),
            maxYear: this.getProtectBirthday('maxYear'),
            minMonth: this.getProtectBirthday('minMonth'),
            maxMonth: this.getProtectBirthday('maxMonth'),
            minDay: this.getProtectBirthday('minDay'),
            maxDay: this.getProtectBirthday('maxDay'),
            minYearSub: this.getProtectedBirthday('minYear'),
            maxYearSub: this.getProtectedBirthday('maxYear'),
            minMonthSub: this.getProtectedBirthday('minMonth'),
            maxMonthSub: this.getProtectedBirthday('maxMonth'),
            minDaySub: this.getProtectedBirthday('minDay'),
            maxDaySub: this.getProtectedBirthday('maxDay'),
            protectedBirthdayType: '',
            sexFlag: false,
            fixSex: '',
            hideForm: {
                cardTypeFlag: false,
                cardTypeSubFlag: false,
            },
            alertMes: '',
            alertSubMes: '',
            alertFlag: false,
            toastFlag: false,
            toastMes: '',
            loadingFlag: false,
            loadingMes: '正在加载',
            buttonMoveFlag: true
        }
    },
    ready: function () {
        var curProductData = this.getProductData.curProductData;
        var productData = this.getProductData.productData;
        var customData = this.getCustomData.customData;
        //详情页选择人群固定性别判断
        if (curProductData.sexFlag == 'M') {
            this.sexFlag = true
            this.fixSex = '男';
        }else if (curProductData.sexFlag == 'F') {
            this.sexFlag = true
            this.fixSex = '女';
        }else{
            this.sexFlag = false;
        };

        //被保人生日类型
        if (curProductData.protectedBirthday.length == 1){
            this.protectedBirthdayType = false;
        }else{
            this.protectedBirthdayType = true;
        };

        //获取生日
        this.protectBirthday = this.getProtectBirthday('birthday');
        this.protectedBirthday = this.getProtectedBirthday('birthday');

        //被保人固定的生日
        var protectedBirthday = curProductData.protectedBirthday;
        if (protectedBirthday.length == 1) {
            this.protectedBirthdayOne = protectedBirthday[0];
        };

        //读取缓存
        if (customData) {
            //退回时证件类型不为身份证时显示性别和生日
            this.cardTypeListCur = customData.cardTypeListCur;
            this.cardTypeSubListCur = customData.cardTypeSubListCur;
            this.protectSexListCur = customData.protectSexListCur;
            this.protectedSexListCur = customData.protectedSexListCur;
            this.relationListCur = customData.relationListCur;
            if (this.cardTypeListCur[0] != '01') {
                this.hideForm.cardTypeFlag =true;
            };
            if (this.cardTypeSubListCur[0] != '01') {
                this.hideForm.cardTypeSubFlag =true;
            };
            //缓存数据
            this.cardNum = this.getCacheData('cardNum');
            this.protectName = this.getCacheData('protectName');
            this.phoneNum = this.getCacheData('phoneNum');
            this.protectedCardNum = this.getCacheData('protectedCardNum');
            this.protectedName = this.getCacheData('protectedName');
            this.protectedPhoneNum = this.getCacheData('protectedPhoneNum');
            this.protectBirthday = this.getCacheData('protectBirthday');
            this.protectedBirthday = this.getCacheData('protectedBirthday');
        }
    },
    methods: {
        agreeFlag: function () {
            if (this.isOff) {
                this.isOff = false;
                this.isOn = true;
                this.protectedName = this.protectName;
                this.protectedCardNum = this.cardNum;
                this.protectedPhoneNum = this.phoneNum;
                this.cardTypeSubListCur = [];
                this.protectedSexListCur = [];
                this.protectedBirthday = this.protectBirthday;
                this.cardTypeSubListCur.push(this.cardTypeListCur[0]);
                this.protectedSexListCur.push(this.protectSexListCur[0]);
                if (this.relationListCur[0] != 1) {
                    this.relationListCur = [];
                    this.relationListCur.push('1');
                };
                //同步时校验被保人证件号码
                this.check('', 'card', this.protectedCardNum, 'protectedCardNum');
            }else{
                this.isOff = true;
                this.isOn = false;
            };
        },
        next: function () {
            //统一两种情况的生日变量
            if (this.getProductData.curProductData.protectedBirthday.length != 1) {
                var protectedBirthday = this.protectedBirthday;
            }else{
                var protectedBirthday = this.protectedBirthdayOne;
            };
            //判断为空
            if (this.cardTypeListCur[0] == '01') {
                if (this.protectName&&this.cardTypeListCur&&this.cardNum&&this.phoneNum&&this.protectedName&&this.relationListCur&&this.cardTypeSubListCur&&this.protectedCardNum) {
                }else{
                    this.alertFlag = true;
                    this.alertMes = '信息不能为空';
                    return;
                };                
            }else{
                if (this.protectName&&this.cardTypeListCur&&this.cardNum&&this.phoneNum&&this.protectedName&&this.relationListCur&&this.cardTypeSubListCur&&this.protectedCardNum&&this.protectBirthday&&this.protectSexListCur&&protectedBirthday&&this.protectedSexListCur) {
                }else{
                    this.alertFlag = true;
                    this.alertMes = '信息不能为空';
                    return;
                };
            };

            var cardTypeListCurName = this.cardTypeListChange(this.cardTypeListCur[0]);
            var cardTypeSubListCurName = this.cardTypeListChange(this.cardTypeSubListCur[0]);
            var relationListCurName = this.relationListChange(this.relationListCur[0]);
            var protectSexListCurName = this.sexListChange(this.protectSexListCur[0]);
            var protectedSexListCurName = this.sexFlag?this.sexListChange(this.getProductData.curProductData.sexFlag):this.sexListChange(this.protectedSexListCur[0]);
            
            //取缓存
            var cacheCurProData = this.getProductData.curProductData;
            //投保人被保人缓存信息
            var customData = {
                protectName: this.protectName,
                cardNum: this.cardNum,
                phoneNum: this.phoneNum,
                cardTypeListCur: this.cardTypeListCur,
                cardTypeListCurName: cardTypeListCurName,
                protectBirthday: this.protectBirthday,
                protectSexListCur: this.protectSexListCur,
                protectSexListCurName: protectSexListCurName,
                protectedBirthday: protectedBirthday,
                protectedSexListCur: this.protectedSexListCur,
                protectedSexListCurName: protectedSexListCurName,
                relationListCur: this.relationListCur,
                relationListCurName: relationListCurName,
                cardTypeSubListCur: this.cardTypeSubListCur,
                cardTypeSubListCurName: cardTypeSubListCurName,
                protectedCardNum: this.protectedCardNum,
                protectedName: this.protectedName,
                protectedPhoneNum: this.protectedPhoneNum
            };
            //投保人被保人缓存信息写入缓存
            this.saveCustomData(customData);
            //生日提交数据处理
            var submitProtectBirthday = this.submitBirthday(this.protectBirthday);
            var submitProtectedBirthday = this.submitBirthday(protectedBirthday);
            //性别提交处理
            if (this.fixSex) {
                if (this.fixSex == '男') {
                    this.protectedSexListCur = 'M';
                }else if (this.fixSex == '女') {
                    this.protectedSexListCur = 'F';
                };
            };
            //记录投保人被保人提交信息
            var submitData ={
                saleRecordId: cacheCurProData.saleRecordId,
                appClientName: this.protectName,
                appIdType: this.cardTypeListCur[0],
                appIdNo: this.cardNum,
                appGender: this.protectSexListCur,
                appBirthday: submitProtectBirthday,
                appMobile: this.phoneNum,
                insurGender: this.protectedSexListCur,
                insurClientName: this.protectedName,
                insurIdType: this.cardTypeSubListCur[0],
                insurIdNo: this.protectedCardNum,
                insurBirthday: submitProtectedBirthday,
                insurMobile: this.protectedPhoneNum,
                relationShipCode: this.relationListCur[0]
            };

            this.loadingFlag = true;
            //记录投保人被保人
            recordInsured(submitData).then((data) => {
                this.loadingFlag = false;
                if (data.data.resultCode === '00000') {
                    //成功跳转
                    this.$router.go({
                        name: 'valiInfo'
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
        buttonMove: function () {
            //按钮定位类型切换
            this.buttonMoveFlag = false;
        },
        check: function (event, type, value, id) {
            //按钮定位类型切换
            this.buttonMoveFlag = true;
            var checkType,
                curValue,
                curId;
            if (type && value && id) {
                checkType = type;
                curValue = value;
                curId = id;
            }else if (!type && !value && !id) {
                checkType = event.target.attributes.checkType.value;
                curValue = event.target.value;
                curId = event.target.id;
            }else{
                return;
            };
            var checkType = checkType;
            if (checkType == 'chinaName') {
                if (curValue.length < 2) {
                    this.toastFlag = true;
                    this.toastMes = '姓名长度不能小于2';
                    this[curId] = '';
                };
            }else if(checkType == 'phone'){
                var exg = /^1\d{10}$/
                if (exg.test(curValue)) {
                }else{
                    this.toastFlag = true;
                    this.toastMes = '手机号码不符合要求';
                    this[curId] = '';
                }
            }else if(checkType == 'card'){
                if (this.cardTypeListCur[0] == '01' && curId == 'cardNum') {
                    if (this.isOn) {
                        this.check('', 'card', this.protectedCardNum, 'protectedCardNum');
                    };
                    if (curValue.length == 15 || curValue.length == 18) {
                        var cardBirthday = curValue.substr(6,4) + '-' + curValue.substr(10,2) + '-' + curValue.substr(12,2);
                        var x = new Date(),
                            mm = parseInt(x.getMonth()) + 1,
                            dd = parseInt(x.getDate());
                        if (mm < 10) {
                            mm = '0' + mm;
                        };
                        if (dd < 10) {
                            dd = '0' + dd;
                        };
                        var limit = this.getProtectBirthday(curId);
                        var min = new Date((limit[0] + '-' + mm + '-' + dd));
                        var max = new Date((limit[1] + '-' + mm + '-' + dd));
                        var now = new Date(cardBirthday);
                        if (+now > +max || +now < +min) {
                            this.toastFlag = true;
                            this.toastMes = '身份证不符合条件(年龄不在投保人年龄范围内)';
                            this[curId] = '';
                        };
                    }else{
                        this.toastFlag = true;
                        this.toastMes = '身份证不符合条件(长度不符合要求)';
                        this[curId] = '';
                    };
                }else if(this.cardTypeSubListCur[0] == '01' && curId == 'protectedCardNum'){
                    if (curValue.length == 15 || curValue.length == 18) {
                        var cardBirthday = curValue.substr(6,4) + '-' + curValue.substr(10,2) + '-' + curValue.substr(12,2);
                        if (this.getProductData.curProductData.protectedBirthday.length != 1) {
                            var x = new Date(),
                                mm = parseInt(x.getMonth()) + 1,
                                dd = parseInt(x.getDate());
                            if (mm < 10) {
                                mm = '0' + mm;
                            };
                            if (dd < 10) {
                                dd = '0' + dd;
                            };
                            var limit = this.getProtectedBirthday(curId);
                            var min = new Date((limit[0] + '-' + mm + '-' + dd));
                            var max = new Date((limit[1] + '-' + mm + '-' + dd));
                            var now = new Date(cardBirthday);
                            if (+now > +max || +now < +min) {
                                this.toastFlag = true;
                                this.toastMes = '身份证不符合条件(与之前填写的被保人年龄范围不符)';
                                this[curId] = '';
                            };
                        }else{
                            if (this.getProductData.curProductData.protectedBirthday != cardBirthday) {
                                this.toastFlag = true;
                                this.toastMes = '身份证与填写信息不符';
                                this[curId] = '';
                            };
                        };
                    }else{
                        this.toastFlag = true;
                        this.toastMes = '身份证不符合条件(长度不符合要求)';
                        this[curId] = '';
                    };
                }else{
                    if (curValue.length < 3) {
                        this.toastFlag = true;
                        this.toastMes = '长度不能小于3';
                        this[curId] = '';
                    };
                };
            };
        },

        //获取缓存数据
        getCacheData: function (type) {
            var cacheData = this.getCustomData.customData[type]?this.getCustomData.customData[type]:'';
            return cacheData;
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
        //时间处理函数+1day
        changeDate: function (date) {
            var day = new Date(date);
            day = +day + 1000*60*60*24;
            day = this.addZero(day);
            return day;
        },
        //日期格式修改,+'0'+'-'
        addZero: function (v, type) {
            var date = new Date(v);
            var mm = date.getMonth()+1;
            var dd = date.getDate();
            var yy = date.getFullYear();
            if (mm < 10) {
                mm = '0' + mm;
            };
            if (dd < 10) {
                dd = '0' + dd;
            };
            date = yy + '-' + mm + '-' + dd;
            if (type == 'min') {
                //时间范围改变重新渲染组件
                this.showNewFlag2 = false
                this.effectMinYear = parseInt(yy);
                this.effectMinMonth = parseInt(mm);
                this.effectMinDay = parseInt(dd);
                setTimeout( () => {
                    this.showNewFlag2 = true
                }, 0);
            }else if (type == 'max') {
                //时间范围改变重新渲染组件
                this.showNewFlag2 = false
                this.effectMaxYear = parseInt(yy);
                this.effectMaxMonth = parseInt(mm);
                this.effectMaxDay = parseInt(dd);
                setTimeout( () => {
                    this.showNewFlag2 = true
                }, 0);
            };
            return date;
        },
        //获取投保人生日范围
        getProtectBirthday: function (type) {
            var nowDate = new Date();
            //投保人
            var AgeMin = this.getProductData.productData.appAgeMin;
            var AgeMax = this.getProductData.productData.appAgeMax;
            var maxYear = nowDate.getFullYear() - AgeMin;
            var minYear = nowDate.getFullYear() - AgeMax;

            //为了取得最小最大日月
            var maxMonth = parseInt(nowDate.getMonth() + 1);
            var maxDay = parseInt(nowDate.getDate());

            //处理范围中最小生效月日
            var minDate = minYear + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
            minDate = this.dataHandle(minDate);
            minDate = this.changeDate(minDate);
            var dateList = minDate.split('-');
            minYear = parseInt(dateList[0]);
            var minMonth = parseInt(dateList[1]);
            var minDay = parseInt(dateList[2]);

            if(type === 'cardNum') {
                return [minYear, maxYear];
            }else if (type === 'maxYear') {
                return maxYear;
            }else if (type === 'minYear') {
                return minYear;
            }else if (type === 'maxMonth') {
                return maxMonth;
            }else if (type === 'minMonth') {
                return minMonth;
            }else if (type === 'maxDay') {
                return maxDay;
            }else if (type === 'minDay') {
                return minDay;
            }else if (type === 'birthday') {
                return this.dataHandle(minYear + '-' + minMonth + '-' + minDay);
            }
        },
        //获取被保人生日范围
        getProtectedBirthday: function (type) {
            if (this.getProductData.curProductData) {
                var protectedBirthday = this.getProductData.curProductData.protectedBirthday;
                if (protectedBirthday.length == 2) {
                    var nowDate = new Date();
                    var AgeMinSub = protectedBirthday[0];
                    var AgeMaxSub = protectedBirthday[1];
                    var maxYearSub = nowDate.getFullYear() - AgeMinSub;
                    var minYearSub = nowDate.getFullYear() - AgeMaxSub;

                    //为了取得最小最大日月
                    maxYearSub = maxYearSub;
                    var maxMonthSub = parseInt(nowDate.getMonth() + 1);
                    var maxDaySub = parseInt(nowDate.getDate());

                    //处理范围中最小生效月日
                    var minDate = minYearSub + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
                    minDate = this.dataHandle(minDate);
                    minDate = this.changeDate(minDate);
                    var dateList = minDate.split('-');
                    minYearSub = parseInt(dateList[0]);
                    var minMonthSub = parseInt(dateList[1]);
                    var minDaySub = parseInt(dateList[2]);

                    if(type === 'protectedCardNum') {
                        return [minYear, maxYear];
                    }else if (type === 'maxYear') {
                        return maxYearSub;
                    }else if (type === 'minYear') {
                        return minYearSub;
                    }else if (type === 'maxMonth') {
                        return maxMonthSub;
                    }else if (type === 'minMonth') {
                        return minMonthSub;
                    }else if (type === 'maxDay') {
                        return maxDaySub;
                    }else if (type === 'minDay') {
                        return minDaySub;
                    }else if (type === 'birthday') {
                        return this.dataHandle(minYearSub + '-' + minMonthSub + '-' + minDaySub);
                    }

                };    
            };
        },
        //生日校验
        birthdayCheck: function (value, isSub) {
            var protectedBirthday = this.getProductData.curProductData.protectedBirthday;
            if (!(protectedBirthday.length == 1 && isSub)) {
                var maxYear,minYear;
                if (isSub) {
                    maxYear = this.maxYearSub;
                    minYear = this.minYearSub;
                }else{
                    maxYear = this.maxYear;
                    minYear = this.minYear;
                };
                var s = value.split('-');
                var yy = parseInt(s[0]),
                    mm = parseInt(s[1]),
                    dd = parseInt(s[2]);
                var nowDate = new Date(),
                    nowMonth = parseInt(nowDate.getMonth()) + 1,
                    nowDay = parseInt(nowDate.getDate());
                //最大日限制
                if (yy > maxYear) {
                    this.toastFlag = true;
                    this.toastMes = '不能超过' + maxYear + '年';
                    if (isSub) {
                        this.protectedBirthday = '';
                    }else{
                        this.protectBirthday = '';
                    };
                }else if (yy == maxYear) {
                    if (mm > nowMonth) {
                        this.toastFlag = true;
                        this.toastMes = '不能超过' + nowMonth + '月';
                        if (isSub) {
                            this.protectedBirthday = '';
                        }else{
                            this.protectBirthday = '';
                        };
                    }else if (mm == nowMonth) {
                        if (dd > nowDay) {
                            this.toastFlag = true;
                            this.toastMes = '不能超过' + nowDay + '日';
                            if (isSub) {
                                this.protectedBirthday = '';
                            }else{
                                this.protectBirthday = '';
                            };
                        };
                    };
                };
                
                //最小日限制
                if (yy < minYear) {
                    this.toastFlag = true;
                    this.toastMes = '不能小于' + minYear + '年';
                    if (isSub) {
                        this.protectedBirthday = '';
                    }else{
                        this.protectBirthday = '';
                    };
                }else if (yy == minYear) {
                    if (mm < nowMonth) {
                        this.toastFlag = true;
                        this.toastMes = '不能小于' + nowMonth + '月';
                        if (isSub) {
                            this.protectedBirthday = '';
                        }else{
                            this.protectBirthday = '';
                        };
                    }else if (mm == nowMonth) {
                        if (dd <= nowDay) {
                            this.toastFlag = true;
                            this.toastMes = '不能小于' + nowDay + '日';
                            if (isSub) {
                                this.protectedBirthday = '';
                            }else{
                                this.protectBirthday = '';
                            };
                        };
                    };
                };        
            };
        },
        cardTypeListChange: function (value){
            var name;
            if (value === '01') {
                name = '身份证'
            }else if (value === '02') {
                name = '护照'
            }else if (value === '03') {
                name = '军官证'
            }else if (value === '04') {
                name = '少儿证'
            }else if (value === '07') {
                name = '出生证'
            }else if (value === '08') {
                name = '户口本'
            }else if (value === '99') {
                name = '其他'
            };
            return name;
        },
        relationListChange: function (value){
            var name;
            if (value === '1') {
                name = '本人'
            }else if (value === '2') {
                name = '配偶'
            }else if (value === '3') {
                name = '子女'
            }else if (value === '4') {
                name = '父母'
            };
            return name;
        },
        sexListChange: function (value) {
            var name;
            if (value === 'M') {
                name = '男'
            }else if (value === 'F') {
                name = '女'
            };
            return name;
        },
        submitBirthday: function (birthday) {
            var submitBirthday;
            submitBirthday = birthday.split('-');
            submitBirthday = submitBirthday.join('');
            return submitBirthday
        }
    },
    watch: {
        protectName (v) {
            if (this.isOn) {
                this.protectedName = this.protectName;
            };
        },
        protectedName (v) {
            if (this.isOn) {
                if(v != this.protectName){
                    this.isOn = false;
                    this.isOff = true; 
                }
            };
        },
        cardNum (v) {
            if (this.isOn) {
                this.protectedCardNum = this.cardNum;
            };
        },
        protectedCardNum (v) {
            if (this.isOn) {
                if(v != this.cardNum){
                    this.isOn = false;
                    this.isOff = true; 
                }
            };
        },
        phoneNum (v) {
            if (this.isOn) {
                this.protectedPhoneNum = this.phoneNum;
            };
        },
        protectedPhoneNum (v) {
            if (this.isOn) {
                if(v != this.phoneNum){
                    this.isOn = false;
                    this.isOff = true; 
                }
            };
        },
        protectSexListCur (v) {
            if (this.isOn) {
                this.protectedSexListCur = [];
                this.protectedSexListCur.push(this.protectSexListCur[0]);
            };
            if (this.relationListCur == '2') {
                if (this.sexFlag) {
                    var curProductData = this.getProductData.curProductData;
                    if (v[0] == curProductData.sexFlag) {
                        this.toastFlag = true;
                        this.toastMes = '配偶性别不能相同';
                        this.relationListCur = ['1'];
                    };
                }else{
                    if (v == this.protectedSexListCur) {
                        this.toastFlag = true;
                        this.toastMes = '配偶性别不能相同';
                        this.relationListCur = ['1'];
                    }; 
                };
            };
        },
        protectedSexListCur (v) {
            if (this.protectSexListCur.length != 0) {
                if (this.isOn) {
                    if(v != this.protectSexListCur[0]){
                        this.isOn = false;
                        this.isOff = true; 
                    }
                };
            };
        },
        cardTypeListCur (v) {
            if (v == '01') {
                this.check('', 'card', this.cardNum, 'cardNum');
                this.hideForm.cardTypeFlag = false;
            }else{
                this.hideForm.cardTypeFlag = true;
            };
            if (this.isOn) {
                this.cardTypeSubListCur = [];
                this.cardTypeSubListCur.push(this.cardTypeListCur[0]);
            };
        },
        cardTypeSubListCur (v) {
            if (v == '01') {
                this.check('', 'card', this.protectedCardNum, 'protectedCardNum');
                this.hideForm.cardTypeSubFlag = false;
            }else{
                this.hideForm.cardTypeSubFlag = true;
            };
            if (this.isOn) {
                if(v != this.cardTypeListCur[0]){
                    this.isOn = false;
                    this.isOff = true; 
                }
            };
        },
        protectBirthday (v) {
            this.birthdayCheck(v, false);
            if (this.isOn) {
                this.protectedBirthday = this.protectBirthday;
            };
        },
        protectedBirthday (v) {
            if (this.protectedBirthdayOne) {
                this.birthdayCheck(v, true);
                if (this.isOn) {
                    if(this.protectedBirthday != this.protectBirthday){
                        this.isOn = false;
                        this.isOff = true; 
                    }
                };    
            };
        },
        relationListCur (v) {
            if (v != '1') {
                this.isOn = false;
                this.isOff = true;
                if (this.cardTypeListCur != '01' && this.cardTypeSubListCur != '01') {
                    if (v == '2') {
                        if (this.sexFlag) {
                            var curProductData = this.getProductData.curProductData;
                            if (this.protectSexListCur[0] == curProductData.sexFlag) {
                                this.toastFlag = true;
                                this.toastMes = '配偶性别不能相同';
                                this.relationListCur = ['1'];
                            };
                        }else{
                            if (this.protectSexListCur == this.protectedSexListCur) {
                                this.toastFlag = true;
                                this.toastMes = '配偶性别不能相同';
                                this.relationListCur = ['1'];
                            }; 
                        };
                    };
                };
            };
        }
    }
}
</script>
<style lang="less">
.enter_info{
    .main{
        width: 100%;
        background: #f6f6f6;
        padding-bottom:2rem;
    }
    .main .footer{
        height: 1.5rem;
        width: 100%;
        bottom: 0;
        background: #fff;
        border-top: 0;
    }
    .footer.fixPosition{
        position: fixed;
        border-top: 1px solid #ececec;
    }
    .main .btn{
        height: 1.1rem;
        background: #4285F7;
        border-radius: 5px;
        font-size: 0.36rem;
        color: #fff;
        width: 85%;
        bottom: 0.2rem;
        left: 0;
        right: 0;
        margin: 7px auto 0;
        line-height: 1.1rem;
        text-align: center;
    }
    .absPosition.btn{
        position: absolute;
        margin-top: 0;
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
    .diy_checkbox{
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 2px;
        border: 1px solid #4285F7;
        position: relative;
        float: right;
        margin-top: 2px;
    }
    .input_area{
        overflow: hidden;
        line-height: 20px;
        padding: 10px 15px 10px 0;
        margin-left: 15px;
        border-top: 1px solid #ececec;
    }
    .input_area.first_line{
        border-top:none;
    }
    .line{
        height: 1px;
        width: 100%;
        background: #ececec;
    }
    .input_area input{
        float: right;
        width: 55%;
        outline: none;
        text-align: right;
        line-height: 20px;
        font-size:0.36rem;
    }
    .input_area span{
        float: left;
        width: 40%;
        color: #666;
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
        left:0;
    }
    .weui_label{
        color:#666;
    }
    .weui_cell_bd p{
        color:#666;
    }
    .weui_icon_warn:before{
        font-size:0.4rem;
    }
}
</style>