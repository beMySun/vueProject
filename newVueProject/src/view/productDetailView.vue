<template>
    <div class="prodcut_detail">
        <div class="main">
        <!-- router -->
            <div class="main_top">
                <div class="banner" id="banner">
                    <div class="mask">
                        <div class="text_area">
                            <h2>{{aData.productName}}</h2>
                            <div class="intro">{{aData.qualifiedCrowd}}</div>
                        </div>
                    </div>
                </div>
                <p class="message black">保险期限：{{myInsurePeriod}}</p>
                <div class="advantage">
                    <p class="black">保险优势：</p>
                    <ul>
                        <li v-for="item in items">{{item.text}}</li>
                    </ul>
                </div>
            </div>
            <div class="main_bottom">
                <div class="plan">
                    <h2 class="black">保障计划</h2>
                    <group>
                        <popup-picker :title="personName" :data="personNameList" :columns="1" :value.sync="personNameCur" show-name></popup-picker>
                        <div class="fix_height" v-if="aData.needInsurBirthday == 'Y'">
                            <datetime v-if=showNewFlag1 :value.sync="birthday" :max-day="maxDay" :min-day="minDay" :max-month="maxMonth" :min-month="minMonth" :min-year="maxYear" :max-year="minYear" title="生日"></datetime>
                        </div>
                        <popup-picker :title="ageGroup" :data="ageGroupList" :columns="1" :value.sync="ageGroupCur" show-name v-if="aData.needInsurBirthday == 'N'"></popup-picker>
                        <!-- fix_height用来防止组件刷新重新渲染时dom元素的塌陷 -->
                        <div class="fix_height">
                            <datetime v-if=showNewFlag2 :value.sync="effectDateCur" :max-Day="effectMaxDay" :min-Day="effectMinDay" :max-month="effectMaxMonth" :min-month="effectMinMonth" :min-year="effectMinYear" :max-year="effectMaxYear" title="生效日"></datetime>
                        </div>
                        <cell><span style="font-size:0.3rem;">零时起 至 {{stopDate}} 二十四时止</span></cell>
                    </group>
                </div>
                <tab active-color="#4285F7">
                    <tab-item :selected="personProductCurrent === personProduct.id" @click="tagClick" id={{personProduct.id}} v-for="personProduct in personProducts">{{personProduct.name}}</tab-item>
                </tab>
                <ul class="taocan">
                    <li v-for="duty in dutysList">
                        <div class="unit arrow" @click="dutyShow(duty)">
                            <div>{{duty.name}}</div>
                            <span>{{duty.text}}</span>
                        </div>
                        <div class="unit_desc" v-show="duty.show">{{duty.desc}}</div>
                    </li>
                </ul>
            </div>
            <div class="agree">
                <div class="diy_checkbox" @click="agreeFlag" v-bind:class="{ 'off': isOff, 'on': isOn }"><icon type="success_no_circle" class="icon_small" v-show="isOn" style="position:absolute;top:-7px;left:-2px;"></icon></div>
                <span>我已经阅读并同意<a @click="enterNotice">《投保须知和保险条款内容》</a></span>
            </div>
            <div class="enter">
                <p>优惠价：￥{{payPremium}}<spinner type="ios-small" slot="value" v-show="spinnerFlag" style="z-index:250;"></spinner></p>
                <div class="btn" @click="enterInfo">{{btnTxt}}</div>
            </div>
        </div>
    </div>
    <alert :show.sync="alertFlag" :title="alertMes"></alert>
    <toast :show.sync="toastFlag" type="text" width="auto">{{toastMes}}</toast>
    <loading :show="loadingFlag" :text="loadingMes"></loading>
</template>
<script type="text/javascript">
import { Tab, TabItem, Sticky, Divider, XButton, Cell, Group, Picker, PopupPicker, Datetime, Alert, Switch, Spinner, Icon, Toast, Loading } from '../components';
import {getAhProductDetail, policyInquiry, ahPolicyInsure, aesDecrypt} from '../apis/productBuy.api';
import {setupWebViewJavascriptBridge} from '../libs/tool/webViewBridge.js';
import {productData} from '../vuex/actions';
import {msgProductDataGetter} from '../vuex/getters';

export default{
    components: {
        Cell,
        PopupPicker,
        Group,
        Picker,
        XButton,
        Tab,
        TabItem,
        Sticky,
        Divider,
        Datetime,
        Alert,
        Switch,
        Spinner,
        Icon,
        Toast,
        Loading
    },
    vuex: {
        getters: {
            getProductData: msgProductDataGetter
        },
        actions: {
            saveProductData: productData
        }
    },
    data () {
        return {
            urlData: '',//url参数
            aData: '',//详情展示数据
            signData: '',//解密后参数
            btnTxt: '',//按钮文本内容
            myInsurePeriod: '',//保障期限
            myInsurePeriodType: '',//时间单位
            effectTime: '',//保障期限时间（无单位）
            items: [],//产品优势列表
            personProducts: [],//组合产品列表
            personName: '被保人',
            ageGroup: '年龄',
            effectDate: '生效日',
            stopDate: '',
            birthday: '',
            payPremium: '',
            personNameList: [],
            ageGroupList: [],
            personNameCur: [],
            ageGroupCur: [],
            effectDateCur: '',
            personProductCurrent: '',
            showFlag : '',
            dutysList: [],
            handlePersonProductsList: [],
            isOff: true,
            isOn: false,
            idProductCombined: '',
            alertFlag: false,
            alertMes: '',
            toastFlag: false,
            toastMes: '',
            spinnerFlag: false,
            loadingFlag: false,
            loadingMes: '正在加载',
            maxYear: 2100,
            minYear: 1900,
            maxMonth: 12,
            minMonth: 1,
            maxDay: 31,
            minDay: 1,
            effectMaxDay: 31,
            effectMinDay: 1,
            effectMaxMonth: 12,
            effectMinMonth: 1,
            effectMaxYear: 2100,
            effectMinYear: 1900,
            showNewFlag1: true,//用于更新时间（生日）范围时重新渲染时间控件
            showNewFlag2: true,//用于更新时间（生效日）范围时重新渲染时间控件
            minEffectDay: '',//最早生效日
            maxAge: '',
            minAge: '',
            sexFlag: '',//用于后面录入被保人信息性别校验
            chachePersonProductCurrentFlag: false,//记录用户选中过的组合产品
            chacheAgeGroupCurFlag: false, //记录用户选中过的年龄段
            chooseBirthdayFlag: false //记录用户选中过的年龄段
        };
    },
    ready: function () {
        //获取url参数
        this.urlData = this.$route.query;
        if (this.getProductData.productData){
            this.aData = this.getProductData.productData;
            var curProductData = this.getProductData.curProductData;
            this.showData();
            this.personNameCur = curProductData.personNameCur;
            this.effectDateCur = curProductData.effectDateCur;
            this.chachePersonProductCurrentFlag = true;//记录用户选中过的组合产品
            if (this.aData.needInsurBirthday === 'Y') {
                this.birthday = curProductData.chooseBirthday;
                this.chooseBirthdayFlag = true;
            }else{
                this.chacheAgeGroupCurFlag = true;//记录用户选中过的年龄段
            };
        }else {
            this.loadingFlag = true;
            //请求解密
            aesDecrypt({
                sign: this.urlData.sign?this.urlData.sign:''
            }).then((data) => {
                if (data.data.resultCode === '00000') {
                    this.signData = data.data.decryptStr;
                    if (this.signData) {
                        //处理signData参数
                        function signDataHandle(signData){
                            var myData = {};
                            if (signData) {
                                var data = signData.split('&');
                                for(var i=0;i<data.length;i++){
                                    var con = data[i].split('=');
                                    myData[[con[0]]] = con[1];
                                }
                            };
                            return myData;
                        }

                        var handleSignData = signDataHandle(this.signData);
                        this.signData = handleSignData;
                        //请求详情数据
                        getAhProductDetail({
                            icpProductCode: handleSignData.icpProductCode?handleSignData.icpProductCode:'',
                            partnerCode: handleSignData.partnerCode?handleSignData.partnerCode:'',
                            userId: handleSignData.userId?handleSignData.userId:'',
                            empno: handleSignData.empno?handleSignData.empno:'',
                            agencyNo: handleSignData.agencyNo?handleSignData.agencyNo:''
                        }).then((data) => {
                            this.loadingFlag = false;
                            if (data.data.resultCode === '00000') {
                                this.aData = data.data;
                                this.showData();
                            }else{
                                this.alertFlag = true;
                                this.alertMes = data.data.resultMsg;
                            };
                        }, (data) => {
                            this.loadingFlag = false;
                            this.alertFlag = true;
                            this.alertMes = '数据请求异常';
                        });
                    };
                }else{
                    this.loadingFlag = false;
                    this.alertFlag = true;
                    this.alertMes = data.data.resultMsg;
                };
            }, (data) => {
                this.loadingFlag = false;
                this.alertFlag = true;
                this.alertMes = '数据请求异常';
            });
        };
    },
    methods: {
        tagClick: function (event) {
            //清空组合产品，组合产品列表
            this.dutysList = [];
            //切换tag
            this.personProductCurrent = event.target.id;
            for (var i = 0; i < this.handlePersonProductsList.length; i++){
                if (this.handlePersonProductsList[i].idProductCombined == this.personProductCurrent) {
                    for (var j = 0; j < this.handlePersonProductsList[i].dutys.length; j++){
                        this.dutysList.push({
                            name: this.handlePersonProductsList[i].dutys[j].dutyName,
                            text: this.handlePersonProductsList[i].dutys[j].amountName,
                            dutyId: this.handlePersonProductsList[i].dutys[j].dutyId,
                            desc: this.aData.dutyItems[this.handlePersonProductsList[i].dutys[j].dutyId].undwrtRange,
                            show: false
                        }); 
                    };
                };
            };
        },
        dutyShow: function (flag) {
            if (flag.show) {
                flag.show = false;
                event.currentTarget.className = 'unit arrow hide';
            }else{
                flag.show = true;
                event.currentTarget.className = 'unit arrow show';
            };
        },
        agreeFlag: function () {
            if (this.isOff) {
                this.isOff = false;
                this.isOn = true;
            }else{
                this.isOff = true;
                this.isOn = false;
            };
        },
        enterNotice: function () {
            var originalUrlSign = JSON.stringify(this.urlData.sign);
            sessionStorage.setItem('originalUrlSign', originalUrlSign);
            sessionStorage.setItem('usage', this.urlData.usage);
            //获取缓存的sign参数
            var cacheSignData;
            if(this.getProductData.curProductData.signData){
                cacheSignData = this.getProductData.curProductData.signData;
            }else{
                cacheSignData = this.signData;
            }
            //处理用户选择的年龄段或者生日信息
            var chooseBirthday
            if (this.aData.needInsurBirthday === 'Y') {
                chooseBirthday = this.birthday;
            }else{
                chooseBirthday = this.ageGroupCur;
            };
            //缓存
            var productData = this.aData;
            var curProductData = {
                personNameCur: this.personNameCur,
                idProductCombined: this.idProductCombined,
                chooseBirthday: chooseBirthday,
                effectDateCur: this.effectDateCur,
                signData: cacheSignData,
                inMyField: true
            };
            this.saveProductData(productData, curProductData);
            this.$router.go({
                name: 'insuranceNotice'
            });
        },
        enterInfo: function () {
            if (this.urlData.usage != 'share') {
                //判断是否同意协议
                if (this.isOff) {
                    this.alertFlag = true;
                    this.alertMes = '请勾选投保须知';
                    return;
                };
            };

            //判断app内核，分享
            var nowNavigator = navigator.userAgent;
            var title = this.aData.productName?this.aData.productName:'';
            var desc = this.aData.productDesc?this.aData.productDesc:'';
            var imgUrl;
            if (this.aData.smallPictureLink) {
                imgUrl = window.location.origin + this.aData.smallPictureLink;
            };
            //分享url
            var signCode = window.location.hash;
            var myData = [];
            signCode = signCode.split('?');
            signCode = signCode[1].split('&');
            for(var i=0;i<signCode.length;i++){
                var con = signCode[i].split('=');
                myData[con[0]] = con[1];
            }
            signCode = myData.sign;

            var jumpUrl = window.location.href;

            jumpUrl = jumpUrl.split('?');
            jumpUrl = jumpUrl[0] + '?sign=' + signCode;

            if (this.urlData.usage == 'share') {
                if (nowNavigator.indexOf('Android') > -1 || nowNavigator.indexOf('Adr') > -1) {
                    window.androidObj.share(jumpUrl,title,desc,imgUrl);
                    return;
                }else if (!!nowNavigator.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                    //设置调用接口
                    setupWebViewJavascriptBridge(function(bridge) {
                        var shareData ={
                            'title': title,
                            'desc': desc,
                            'url': jumpUrl,
                            'imgUrl': imgUrl
                        }
                        bridge.callHandler('InsuranceProductShare', {shareData},function(response) {})
                    });
                    return;
                };                
            };

            if (this.getProductData.curProductData.saleRecordId) {
                var saleRecordId = this.getProductData.curProductData.saleRecordId
            };
            //获取被保人生日信息
            var protectedBirthday = [];
            if (this.aData.needInsurBirthday === 'Y') {
                protectedBirthday.push(this.birthday);
            }else{
                for (var i = 0; i < this.aData.insurPersons.length; i++){
                    if (this.aData.insurPersons[i].idPersonType == this.personNameCur[0]){
                        for (var j = 0; j < this.aData.insurPersons[i].insType.length; j++){
                            if (this.aData.insurPersons[i].insType[j].idInsType == this.ageGroupCur[0]) {
                                protectedBirthday.push(this.aData.insurPersons[i].insType[j].minInsAge);
                                protectedBirthday.push(this.aData.insurPersons[i].insType[j].maxInsAge);
                            };
                        }
                    } 
                }                
            };

            //获取责任保额id
            var submitDutyId = [];
            for (var i = 0; i < this.handlePersonProductsList.length; i++){
                if (this.handlePersonProductsList[i].idProductCombined == this.personProductCurrent) {
                    for (var j = 0; j < this.handlePersonProductsList[i].dutys.length; j++){
                        submitDutyId.push({
                            combinedDutyId: this.handlePersonProductsList[i].dutys[j].combinedDutyId
                        }); 
                    };
               };
            };
            //获取缓存的sign参数
            var cacheSignData;
            if(this.getProductData.curProductData.signData){
                cacheSignData = this.getProductData.curProductData.signData;
            }else{
                cacheSignData = this.signData;
            }

            this.loadingFlag = true;
            //立即投保
            ahPolicyInsure({
                idProductCombined: this.idProductCombined,
                icpProductCode: cacheSignData.icpProductCode?cacheSignData.icpProductCode:'',
                partnerCode: cacheSignData.partnerCode?cacheSignData.partnerCode:'',
                userId: cacheSignData.userId?cacheSignData.userId:'',
                empno: cacheSignData.empno?cacheSignData.empno:'',
                agencyNo: cacheSignData.agencyNo?cacheSignData.agencyNo:'',
                saleAmount: this.payPremium,
                effDate: this.effectDateCur,
                saleRecordId: saleRecordId?saleRecordId:'',
                dutys: submitDutyId
            }).then((data) => {
                this.loadingFlag = false;
                if (data.data.resultCode === '00000') {
                    //处理用户选择的年龄段或者生日信息
                    var chooseBirthday
                    if (this.aData.needInsurBirthday === 'Y') {
                        chooseBirthday = this.birthday;
                    }else{
                        chooseBirthday = this.ageGroupCur;
                    };
                    //缓存
                    var productData = this.aData;
                    var curProductData = {
                        personNameCur: this.personNameCur,
                        idProductCombined: this.idProductCombined,
                        chooseBirthday: chooseBirthday,
                        stopDate: this.stopDate,
                        effectDateCur: this.effectDateCur,
                        dutysList: this.dutysList,//用于订单确认时展示责任
                        saleRecordId: data.data.saleRecordId,
                        saleAmount: this.payPremium,//询价结果
                        protectedBirthday: protectedBirthday,//用于录入信息生日校验
                        sexFlag: this.sexFlag,//用于录入信息性别校验
                        signData: cacheSignData,
                        inMyField: true
                    };
                    this.saveProductData(productData, curProductData);
                    var originalUrlSign = JSON.stringify(this.urlData.sign);
                    sessionStorage.setItem('originalUrlSign', originalUrlSign);
                    //跳转
                    this.$router.go({
                        name: 'healthNotice'
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
        showData: function () {
            //判断环境显示按钮内容
            if (this.urlData.usage == 'share') {
                this.btnTxt = '分享';
            }else{
                this.btnTxt = '立即投保';
            };

            //设置标题
            document.title = this.aData.productName;
            
            if (this.urlData.usage == 'share') {
                //设置好标题推送ios标识
                var nowNavigator = navigator.userAgent;
                if (!!nowNavigator.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
                    setupWebViewJavascriptBridge(function(bridge) {
                        bridge.callHandler('setTitleFlag', {'setTitle': 'ok'});
                    });        
                }
            };

            //保险期限
            var unit,
            insurePeriodType = this.aData.insurePeriodType;
            if (insurePeriodType === 'D') {
                unit = '天';
            }else if(insurePeriodType === 'M'){
                unit = '个月';
            }else if(insurePeriodType === 'Y'){
                unit = '年';
            };
            this.myInsurePeriodType = this.aData.insurePeriodType;//记录时间单位
            this.effectTime = this.aData.insurePeriod;//记录保障期限时间
            this.myInsurePeriod = this.aData.insurePeriod + unit;
            //保险优势
            if (this.aData.productDetail) {
                var productDetail = this.aData.productDetail.split('|');
                for(var i = 0; i < productDetail.length; i++){
                    var myItem = {};
                    myItem.text = productDetail[i];
                    this.items.push(myItem);
                }
            };

            //生效日期
            if (this.aData.fixedEffDate) {
                this.effectDateCur = this.aData.fixedEffDate;
            } else {
                this.effectDateCur = this.getEffectDay(this.aData.maxEffDelay, this.aData.minEffDelay);
            };

            //人群，年龄
            for (var i = 0; i < this.aData.insurPersons.length; i++) {
                //载入人群列表视图
                this.personNameList.push({
                    name: this.aData.insurPersons[i].personName,
                    value: this.aData.insurPersons[i].idPersonType
                });
                if (this.aData.insurPersons[i].idPersonType === this.aData.defaultShow.idPersonType) {
                    //默认人群
                    this.personNameCur = [this.aData.insurPersons[i].idPersonType];
                    //记录人群性别标识
                    this.sexFlag = this.aData.insurPersons[i].gender;
                    //默认年龄
                    if (this.aData.needInsurBirthday === 'N') {
                        for (var j = 0; j < this.aData.insurPersons[i].insType.length; j++) {
                            this.ageGroupList.push({
                                name: (this.aData.insurPersons[i].insType[j].minInsAge + '-' + this.aData.insurPersons[i].insType[j].maxInsAge),
                                value: this.aData.insurPersons[i].insType[j].idInsType
                            });
                            if (this.aData.insurPersons[i].insType[j].idInsType === this.aData.defaultShow.idInsType) {
                                this.ageGroupCur = [this.aData.insurPersons[i].insType[j].idInsType];
                            };
                        }
                    } else if (this.aData.needInsurBirthday === 'Y') {
                        this.maxAge = this.aData.insurPersons[i].personMaxAge;
                        this.minAge = this.aData.insurPersons[i].personMinAge;
                        this.dateLimit();
                    };
                };
            };
            
            //默认组合产品
            this.personProductCurrent = this.aData.defaultShow.idProductCombined;
            
            //设置banner图
            document.getElementById('banner').style.backgroundImage = 'url(' + this.aData.bigPictureLink + ')';
        },
        //计算生日年范围
        dateLimit: function (noChangeBirthday,effectDate) {
            var nowDate;
            if (effectDate) {
                nowDate = new Date(this.minEffectDay);
            }else{
                nowDate = new Date(this.effectDateCur);
            };
            var maxYear = this.maxAge;
            var minYear = this.minAge;
            maxYear = nowDate.getFullYear() - maxYear;
            minYear = nowDate.getFullYear() - minYear;
            var nowMonth = parseInt(nowDate.getMonth()) + 1,
                nowDay = parseInt(nowDate.getDate());
            if (nowMonth < 10) {
                nowMonth = '0' + nowMonth;
            };
            if (nowDay < 10) {
                nowDay = '0' + nowDay;
            };
            if (noChangeBirthday) {
                this.birthdayCheck(this.birthday);
            }else{
                var s = maxYear + '-' + nowMonth + '-' + nowDay;
                s = this.changeDate(s);
                this.birthday = s;
            };
            //时间范围改变重新渲染组件
            this.showNewFlag1 = false
            this.maxYear = maxYear;
            this.minYear = minYear;
            setTimeout( () => {
                this.showNewFlag1 = true
            }, 0);
        },
        personProductsList: function () {
            //清空组合产品，组合产品列表
            this.personProducts = [];
            this.dutysList = [];
            this.handlePersonProductsList = [];
            var myIdPersonType = this.personNameCur,//当前人群id
                orderNumList = [],//产品排序id
                personProductsList = [],//符合条件产品
                handlePersonProductsList = this.handlePersonProductsList;//处理后的符合条件产品
            //组合产品
            if (this.aData.needInsurBirthday === 'N') {
                for (var i = 0; i < this.aData.personProducts[myIdPersonType].length; i++) {
                    //当前年龄段
                    if (this.aData.personProducts[myIdPersonType][i].idInsType == this.ageGroupCur) {
                        orderNumList.push(this.aData.personProducts[myIdPersonType][i].combinedOrder);
                        personProductsList[this.aData.personProducts[myIdPersonType][i].combinedOrder] = this.aData.personProducts[myIdPersonType][i];
                    };
                };
            }else if (this.aData.needInsurBirthday === 'Y') {
                for (var i = 0; i < this.aData.personProducts[myIdPersonType].length; i++) {
                    orderNumList.push(this.aData.personProducts[myIdPersonType][i].combinedOrder);
                    personProductsList[this.aData.personProducts[myIdPersonType][i].combinedOrder] = this.aData.personProducts[myIdPersonType][i];
                };
            };

            //组合产品排序
            for (var x = 0; x < orderNumList.length; x++){
                for (var y = x+1; y < orderNumList.length; y++){
                    if (orderNumList[x] > orderNumList[y]) {
                        var tmp = personProductsList[orderNumList[x]];
                        personProductsList[orderNumList[x]] = personProductsList[orderNumList[y]];
                        personProductsList[orderNumList[y]] = tmp;
                    };
                }
            };
            //得到处理后的产品
            for (var z = 0; z < personProductsList.length; z++){
                if (typeof(personProductsList[z]) != 'undefined') {
                    handlePersonProductsList.push(personProductsList[z])
                };
            };
            //加载产品
            for (var i = 0; i < handlePersonProductsList.length; i++){
                this.personProducts.push({
                    name: handlePersonProductsList[i].combinedName,
                    id: handlePersonProductsList[i].idProductCombined
                });
                //默认组合产品
                this.personProductCurrent = handlePersonProductsList[0].idProductCombined;
            };
            //默认组合产品列表
            if (handlePersonProductsList[0]) {
                for (var i = 0; i < handlePersonProductsList[0].dutys.length; i++){
                    this.dutysList.push({
                        name: handlePersonProductsList[0].dutys[i].dutyName,
                        text: handlePersonProductsList[0].dutys[i].amountName,
                        dutyId: handlePersonProductsList[0].dutys[i].dutyId,
                        desc: this.aData.dutyItems[handlePersonProductsList[0].dutys[i].dutyId].undwrtRange,
                        show: false
                    });
                };
            };
            //更新处理后的产品handlePersonProductsList
            this.handlePersonProductsList = handlePersonProductsList;
            

            //判断用户选择的组合产品
            if (this.aData.needInsurBirthday === 'Y') {
                if (this.chachePersonProductCurrentFlag) {
                    var curProductData = this.getProductData.curProductData;
                    this.chachePersonProductCurrentFlag = false;
                    this.personProductCurrent = curProductData.idProductCombined;
                };
            };
            
        },
        //needInsurBirthday为Y的时候获取年龄段
        protectBirthday: function (type, i) {
            var nowDate = new Date(this.effectDateCur);
            //投保人
            var AgeMin = this.aData.insurPersons[i].personMinAge;
            var AgeMax = this.aData.insurPersons[i].personMaxAge;
            var maxYear = nowDate.getFullYear() - AgeMax;
            var minYear = nowDate.getFullYear() - AgeMin;
            if (type === 'minYear') {
                return minYear;
            }else if(type === 'maxYear') {
                return maxYear;
            }else if(type === 'cardNum') {
                return [minYear, maxYear];
            };
        },
        birthdayCheck: function (value, isSub) {
            var maxYear,minYear;
            maxYear = this.maxYear;
            minYear = this.minYear;
            var s = value.split('-');
            var yy = parseInt(s[0]),
                mm = parseInt(s[1]),
                dd = parseInt(s[2]);
            var nowDate = new Date(this.effectDateCur),
                nowMonth = parseInt(nowDate.getMonth()) + 1,
                nowDay = parseInt(nowDate.getDate());
                this.changeDate(this.effectDateCur)
            if (nowMonth < 10) {
                nowMonth = '0' + nowMonth;
            };
            if (nowDay < 10) {
                nowDay = '0' + nowDay;
            };
            var birthday = maxYear + '-' + nowMonth + '-' + nowDay;
            //最大日限制
            if (yy > minYear) {
                this.toastFlag = true;
                this.toastMes = '生日不能超过' + minYear + '年';
                this.birthday = birthday;
            }else if (yy == minYear) {
                if (mm > nowMonth) {
                    this.toastFlag = true;
                    this.toastMes = '生日不能超过' + nowMonth + '月';
                    this.birthday = birthday;
                }else if (mm == nowMonth) {
                    if (dd > nowDay) {
                        this.toastFlag = true;
                        this.toastMes = '生日不能超过' + nowDay + '日';
                        birthday = this.changeDate(birthday);
                        this.birthday = birthday;
                    };
                };
            };
            
            //最小日限制
            if (yy < maxYear) {
                this.toastFlag = true;
                this.toastMes = '生日不能小于' + maxYear + '年';
                this.birthday = birthday;
            }else if (yy == maxYear) {
                if (mm < nowMonth) {
                    this.toastFlag = true;
                    this.toastMes = '生日不能小于' + nowMonth + '月';
                    this.birthday = birthday;
                }else if (mm == nowMonth) {
                    if (dd <= nowDay) {
                        this.toastFlag = true;
                        this.toastMes = '生日不能小于' + nowDay + '日';
                        birthday = this.changeDate(birthday);
                        this.birthday = birthday;
                    };
                };
            };   
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
        //生效日期
        getEffectDay: function (maxDay, minDay) {
            var day = new Date();
            var maxEffectDay,minEffectDay;
            minEffectDay = +day + 1000*60*60*24*(minDay);
            minEffectDay = this.addZero(minEffectDay, 'min');

            maxEffectDay = +day + 1000*60*60*24*(maxDay);
            maxEffectDay = this.addZero(maxEffectDay, 'max');

            this.minEffectDay = minEffectDay;
            return minEffectDay;
        },
        //截止日期
        stopDay: function () {
            var myEffectTime,
                s;
            if (this.myInsurePeriodType === 'D') {
                myEffectTime = (parseInt(this.effectTime) - 1)*1000*60*60*24;
                s = new Date(myEffectTime);
                this.stopDate = s.getFullYear() + '-' + (s.getMonth()+1)+ '-' + s.getDate();
            }else if (this.myInsurePeriodType === 'M') {
                if (this.effectDateCur) {
                    s = this.effectDateCur.split('-');
                    var yy = parseInt(s[0]),
                        mm = parseInt(s[1]) - 1,
                        dd = parseInt(s[2]);
                    var dt = new Date(yy,mm,dd);
                    dt.setMonth(dt.getMonth() + parseInt(this.effectTime));
                    var stopMonth = parseInt(dt.getMonth()) + 1;
                    if (stopMonth < 10) {
                        stopMonth = '0' + stopMonth;
                    };
                    if (dd < 10) {
                        dd = '0' + dd;
                    };
                    s = dt.getFullYear() + '-' + stopMonth + '-' + dd;
                    s = new Date(s);
                    s = +s - 1000*60*60*24;
                    s = new Date(s);
                    this.stopDate = s.getFullYear() + '-' + (s.getMonth()+1)+ '-' + s.getDate();
                };
            };    
        },
        //校验费用
        myAhPolicyInquiry: function () {
            //Icp套餐代码
            //当前人群
            var myIdPersonType = this.personNameCur?this.personNameCur:'';
            var ProductCombined;
            if (this.aData.needInsurBirthday === 'N') {
                for (var i = 0; i < this.aData.personProducts[myIdPersonType].length; i++) {
                    //当前年龄段
                    if ((this.aData.personProducts[myIdPersonType][i].idInsType == this.ageGroupCur) && (this.aData.personProducts[myIdPersonType][i].idProductCombined == this.personProductCurrent)) {
                        ProductCombined = this.aData.personProducts[myIdPersonType][i].idProductCombined;
                    };
                }; 
            }else if(this.aData.needInsurBirthday === 'Y'){
                ProductCombined = this.personProductCurrent;
            }   

            var submitData = {};

            //出生日期
            var myBirthday;
            if (this.aData.needInsurBirthday === 'Y') {

                myBirthday = this.birthday.split('-');
                myBirthday = myBirthday.join('');
            };
            //生效日
            var myEffDate;
            myEffDate = this.effectDateCur;
            myEffDate = myEffDate.split('-');
            myEffDate = myEffDate.join('');

            //保存套餐代码
            this.idProductCombined = ProductCombined;

            //提交数据
            submitData.idProductCombined = ProductCombined?ProductCombined:'';
            submitData.insurePeriod = this.aData.insurePeriod?this.aData.insurePeriod:'';
            submitData.insurePeriodType = this.aData.insurePeriodType?this.aData.insurePeriodType:'';
            submitData.insureBirthday = myBirthday?myBirthday:'';
            submitData.effDate = myEffDate?myEffDate:'';
            //费用查询loading on
            this.payPremium = '';
            this.spinnerFlag = true;
            if (submitData.idProductCombined) {
                //询问费用
                policyInquiry(submitData).then((requestData) => {
                    if (requestData.data.resultCode === '00000') {
                        //费用查询loading off
                        this.spinnerFlag = false;
                        //渲染费用
                        this.payPremium = requestData.data.payPremium;
                    }else{
                        //费用查询loading off
                        this.spinnerFlag = false;
                        this.alertFlag = true;
                        this.alertMes = requestData.data.resultMsg;
                    };
                }, (requestData) => {
                    //费用查询loading off
                    this.spinnerFlag = false;
                    this.alertFlag = true;
                    this.alertMes = '数据请求异常';
                });
            };
        }
    },
    watch: {
        //监测被保人群value
        personNameCur (v) {
            for (var i = 0; i < this.aData.insurPersons.length; i++) {
                if (this.aData.insurPersons[i].idPersonType == v) {
                    this.maxAge = this.aData.insurPersons[i].personMaxAge;
                    this.minAge = this.aData.insurPersons[i].personMinAge;
                    //记录人群性别标识
                    this.sexFlag = this.aData.insurPersons[i].gender;
                    //无需出生日期
                    if (this.aData.needInsurBirthday === 'N') {
                        this.ageGroupList = [];
                        if (v == this.aData.defaultShow.idPersonType) {
                            this.ageGroupCur = [this.aData.defaultShow.idInsType];
                        }else{
                            this.ageGroupCur = [this.aData.insurPersons[i].insType[0].idInsType];
                        };
                        if (this.chacheAgeGroupCurFlag) {
                            var curProductData = this.getProductData.curProductData;
                            this.chacheAgeGroupCurFlag = false;
                            this.ageGroupCur = curProductData.chooseBirthday;
                        };
                        if (this.aData.insurPersons[i].insType.length != 0) {
                            for (var j = 0; j < this.aData.insurPersons[i].insType.length; j++) {
                                this.ageGroupList.push({
                                    name: (this.aData.insurPersons[i].insType[j].minInsAge + '~' + this.aData.insurPersons[i].insType[j].maxInsAge),
                                    value: this.aData.insurPersons[i].insType[j].idInsType
                                });
                            };
                        };
                    }else if (this.aData.needInsurBirthday === 'Y') {
                        this.dateLimit(false,true);
                        this.effectDateCur = this.minEffectDay;
                        
                    };
                };
            };
            this.personProductsList();
            if (this.aData.needInsurBirthday === 'Y') {
                this.myAhPolicyInquiry();
            };
        },
        //年龄段
        ageGroupCur (v) {
            this.personProductsList();
            if (this.aData.needInsurBirthday === 'N') {
                if (this.chachePersonProductCurrentFlag) {
                    var curProductData = this.getProductData.curProductData;
                    this.chachePersonProductCurrentFlag = false;
                    this.personProductCurrent = curProductData.idProductCombined;
                };
            };
        },
        //生效日期
        effectDateCur (v) {
            this.stopDay();
            if (this.aData.needInsurBirthday === 'Y') {
                this.dateLimit(true);
            };

            //为了取得最小最大日月
            //最大的往后推一天不能等于  最小等于当天 可以往前推
            //时间范围改变重新渲染组件
            this.showNewFlag1 = false
            
            var dateList = v.split('-');
            this.maxMonth = parseInt(dateList[1]);
            this.maxDay = parseInt(dateList[2]);
            //处理范围中最小生效月日
            var s = this.maxYear + '-' + dateList[1] + '-' + dateList[2];
            s = this.changeDate(s);
            var dateList2 = s.split('-');
            this.minMonth = parseInt(dateList2[1]);
            this.minDay = parseInt(dateList2[2]);

            setTimeout( () => {
                this.showNewFlag1 = true
            }, 0);
            
            this.myAhPolicyInquiry();
        },
        //套餐Id
        personProductCurrent (v){
            this.myAhPolicyInquiry();
        },
        //生日
        birthday (v) {
            this.birthdayCheck(v);
            this.myAhPolicyInquiry();
        }
    }
}
</script>
<style lang="less">
.prodcut_detail{
    .main{
        width: 100%;
        padding-bottom: 1.5rem;
        font-size: 0.36rem;
        background: #f6f6f6;
    }
    .main_top{
        background: #fff;
    }
    .banner{
        height: 4.5rem;
        background: no-repeat;
        background-size: 100%;
        position: relative;
    }
    .banner .mask{
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.4);
    }
    .banner h2{
        padding: 0 0.3rem 0.2rem;
        color: #fff;
        font-size: 0.6rem;
    }
    .banner .intro{
        color: #fff;
        padding: 0 0.3rem;
        font-size: 0.36rem;
    }
    .text_area{
        position: absolute;
        bottom: 0.3rem;
    }
    .message{
        height: 1rem;
        line-height: 1rem;
        padding-left: 0.25rem;
        border-bottom: 1px solid #ececec;
    }
    .advantage{
        padding-left: 0.25rem;
        padding-bottom: 0.25rem;
        border-bottom: 1px solid #ececec;
    }
    .advantage p{
        height: 0.75rem;
        line-height: 0.75rem;
    }
    .advantage ul li{
        line-height: 0.5rem;
        color: #666;
        margin-right: 0.1rem;
    }
    .main_bottom{
        background: #fff;
        margin-top: 0.25rem;
    }
    .plan{
        border-top: 1px solid #ececec;
    }
    .plan h2{
        height: 1.2rem;
        line-height: 1.2rem;
        font-size: 0.45rem;
        text-align: center;
    }
    .plan ul li{
        height: 1.1rem;
        line-height: 1.1rem;
        padding: 0 0.25rem;
        border-bottom: 1px solid #eee;
    }
    .plan ul li label{
        float: left;
    }
    .plan ul li span{
        float: right;
    }
    .agree{
        margin-top: 0.25rem;
        padding: 0.25rem;
        background: #fff;
        border-top: 1px solid #ececec;
        border-bottom: 1px solid #ececec;
    }
    .agree span{
        margin-left: 0.2rem;
    }
    .agree span a{
        color: #4285F7;
    }
    .diy_checkbox{
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 3px;
        border: 1px solid #4285F7;
        position:relative;
        margin-top: 2px;
        -webkit-tap-highlight-color:rgba(0,0,0,0);
    }
    .enter{
        font-size: 0.36rem;
        height: 1.25rem;
        color: #fff;
        position:fixed;
        bottom:0;
        width:100%;
        z-index:233;
    }
    .enter p{
        padding-left: 2%;
        float: left;
        width: 60%;
        line-height: 1.25rem;
        background: #6b6565;
        height:100%;
    }
    .enter .btn{
        float: right;
        width: 38%;
        background: #4285F7;
        height: 1.25rem;
        font-size: 0.36rem;
        color: #fff;
        line-height: 1.25rem;
        text-align: center;
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
    .fix_height{
        height: 42px;
        position: relative;
        -webkit-box-align: center;
        -webkit-align-items: center;
        -webkit-tap-highlight-color:rgba(0,0,0,0);
    }
    .fix_height:before{
        content: '';
        position: absolute;
        top: 0;
        display: inline-block;
        height: 0;
        width: 100%;
        margin-left: 15px;
        border-top: 1px solid #ececec;
    }
    .vux-tab-item{
        z-index:3;
    }
    .vux-no-group-title{
        margin-top:0 !important;
    }
    .vux-popup-picker-header{
        color: #4285F7 !important;
    }
    .picker-dialog{
        font-size: 17px !important;
    }
    .vux-tab{
        font-size: 0.36rem !important;
    }
    .dp-header .dp-item {
        color: #4285F7 !important;
    }
    .weui_cell_bd{
        font-size: 0.36rem;
    }
    .vux-popup-picker-value{
        font-size: 0.36rem;
    }
    .weui_cell_ft.with_arrow.vux-datetime-value{
        font-size: 0.36rem !important;
    }
    .vux-spinner svg{
        float: left;
    }
}
</style>