<template>
    <div class="buy_card">
        <div class="main">
            <group>
                <cell title="防癌医疗保险" class="title"></cell>
                <cell title="购买数量">1</cell>
                <cell title="总价"><span style="color:#f60;">{{showAmount}}</span></cell>
            </group>
            <group>
                <popup-picker :title="payType" :data="payTypeList" :value.sync="payTypeListCur"></popup-picker>
            </group>
            <div class="footer">
                <div class="btn" @click="toPay">确认支付</div>
            </div>
            <form :action="jumpUrl" method="post" id="postData">
                <input type="hidden" name="orderNo" :value="orderNo">
                <input type="hidden" name="partnerId" :value="partnerId">
                <input type="hidden" name="amount" :value="amount">
                <input type="hidden" name="sign" :value="sign">
            </form>
            <alert :show.sync="alertFlag" :title="alertMes">{{alertSubMes}}</alert>
            <loading :show="loadingFlag" :text="loadingMes"></loading>
        </div>
    </div>
</template>
<script>
import {XButton, Cell, Group, Picker, PopupPicker, Alert, Loading} from '../components'
import {pay} from '../apis/productBuy.api';
import {msgProductDataGetter} from '../vuex/getters';

export default{
    components: {
        Cell,
        Group,
        XButton,
        Picker,
        PopupPicker,
        Alert,
        Loading
    },
    vuex: {
        getters: {
            getProductData: msgProductDataGetter
        }
    },
    data () {
        return {
            orderNo: '',
            amount: '',
            showAmount: '',
            sign: '',
            partnerId: '',
            jumpUrl: '',
            saleRecordId: '',
            payType: '支付方式',
            payTypeList: [['平安付']],
            payTypeListCur: ['平安付'],
            alertMes: '',
            alertSubMes: '',
            alertFlag: false,
            loadingFlag: false,
            loadingMes: '正在加载'
        }
    },
    ready: function () {
        if (this.getProductData.curProductData.saleRecordId) {
            this.saleRecordId = this.getProductData.curProductData.saleRecordId;
            sessionStorage.setItem('mySaleRecordId', this.saleRecordId);
        }else if (sessionStorage.getItem('mySaleRecordId')) {
            this.saleRecordId = sessionStorage.getItem('mySaleRecordId');
        };
        this.loadingFlag = true;
        pay({
            saleRecordId: this.saleRecordId
        }).then((data) => {
            this.loadingFlag = false;
            if (data.data.resultCode === '00000') {
                var a = data.data.amount;
                this.showAmount = a.substring(0,a.length-2) + '.' + a.substring(a,a.length-2);
                this.orderNo = data.data.orderNo;
                this.amount = data.data.amount;
                this.sign = data.data.sign;
                this.partnerId = data.data.partnerId;
                this.jumpUrl = data.data.payUrl;
            }else if (data.data.resultCode === '13001') {
                var sign = sessionStorage.getItem('originalUrlSign');
                this.$router.go({
                    name: 'productDetail',
                    query: {sign: sign}
                });
            }else{
                this.loadingFlag = false;
                this.alertFlag = true;
                this.alertMes = data.data.resultMsg;
            };
        }, (data) => {
            this.alertFlag = true;
            this.alertMes = '数据请求异常';
        });
    },
    methods: {
        toPay: function () {
            document.getElementById('postData').submit();
        }
    }
}
</script>
<style lang="less">
.buy_card{
    .main{
        width: 100%;
        background: #f6f6f6;
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
    .vux-no-group-title{
        font-size: 0.36rem;
    }
    .title{
        font-size: 0.4rem;
        font-weight: bold;
    }
    .vux-popup-picker-header{
        color: #4285F7 !important;
    }
}
</style>