<template>
    <div class="health_notice">
        <h2>本人自愿投保，特告知以下事项：</h2>
        <div class="wrap">
            <div class="question">1、曾经被其他保险公司拒保，延期或加费</div>
            <div class="ans" id="check1" @click='change'>
                <p><i v-bind:class="{'current': !check1}" class="first_load"></i><span>是</span></p>
                <p><i v-bind:class="{'current': check1}"></i><span>否</span></p>
            </div>
        </div>
        <div class="wrap">
            <div class="question">2、近亲属（父母子女兄弟姐妹）有2个及以上在60周岁前患同一癌症；</div>
            <div class="ans" id="check2" @click='change'>
                <p><i v-bind:class="{'current': !check2}" class="first_load"></i><span>是</span></p>
                <p><i v-bind:class="{'current': check2}"></i><span>否</span></p>
            </div>
        </div>
        <div class="wrap">
            <div class="question">3、曾经或正患有下列任一疾病，体征或检查异常； a. 肿瘤指标*检查异常; b. 手术后组织病理活检异常（恶性/交界性）； c. 近两年发现肿块/息肉/结节/肿瘤/新生物且未手术； d. 恶性肿瘤（包括白血病）、癌前病变、原位癌、肝硬化、慢性活动性肝炎、慢性萎缩性胃炎、恶性葡萄胎 ； e. 乙肝指标*大三阳（HBeAg+且HBsAg+）； f. 子宫颈疾病，且宫颈上皮内瘤变检测CIN III或HPV阳性； g. 吞咽困难、咳血，吐血、便血或黑便，血尿，贫血，半年内体重减少5公斤以上。</div>
            <div class="ans" id="check3" @click='change'>
                <p><i v-bind:class="{'current': !check3}" class="first_load"></i><span>是</span></p>
                <p><i v-bind:class="{'current': check3}"></i><span>否</span></p>
            </div>
        </div>
        <div class="wrap">
            <div class="question">4、吸烟每天超过40支；</div>
            <div class="ans" id="check4" @click='change'>
                <p><i v-bind:class="{'current': !check4}" class="first_load"></i><span>是</span></p>
                <p><i v-bind:class="{'current': check4}"></i><span>否</span></p>
            </div>
        </div>
        <div class="wrap">
            <div class="question">5、每周饮酒单位大于等于50（每一个饮酒单位相当于12g酒精。例如，1杯（300ml）啤酒，半杯葡萄酒，45ml 白酒）</div>
            <div class="ans" id="check5" @click='change'>
                <p><i v-bind:class="{'current': !check5}" class="first_load"></i><span>是</span></p>
                <p><i v-bind:class="{'current': check5}"></i><span>否</span></p>
            </div>
        </div>
        <div class="wrap ps">
            <p>注：</p>
            <p>肿瘤指标*： 甲胎蛋白（AFP）、癌胚抗原（CEA）、前列腺特异性抗原（PSA）、癌抗原125（CA125）、癌抗原199（CA199）</p>
            <p>乙肝指标*：表面抗原(HBsAg)、e抗原(HBeAg)和 e抗体(HBeAb)、核心抗原(HBcAg)和核心抗体(HBcAb)、HBV-DNA</p>
            <br/>
            <p>该告知为本人真实意思表示。本人如有故意或因重大过失未履行条款规定的如实告知义务， 足以影响贵公司决定是否同意承保或者提高保险费率的．贵公司有权解除本保险合同或取消该本人的保险资格。 本人如果故意不履行如实告知义务，对于解除本保险合同或取消本人的保险资格前发生的保险事故，贵公司可不承担给付保险金的责任， 并不退还保险费。本人如果因重大过失未履行如实告知义务，对保险事故的发生有严重影响的， 对于解除本合同或取消该本人的保险资格前发生的保险事故，贵公司不承担给付保险金的责任，但应当退还保险费。 如存在为他人投保的情况，替他人健康告知，投保人承诺完全知晓被保险人健康状况，且被保险人同意投保人为其投保该保险。 投保人应在对被保险人健康状况充分了解的基础上，进行投保方案的选择，并依法履行告知义务。若填写的被保险人健康事项与上述描述不符合，保险人不同意承保，若发生保险事故，保险人不承担保险责任。</p>
            <br/>
            <p>另，本人声明上述内容均属真实，如有隐瞒或不实告知，本人愿意承担由此带来的法律后果。</p>
        </div>
        <div class="footer">
            <div class="btn" @click="next">下一步</div>
        </div>
        <alert :show.sync="alertFlag" :title="alertMes">{{alertSubMes}}</alert>
        <toast :show.sync="toastFlag" type="text" width="auto">{{toastMes}}</toast>
        <loading :show="loadingFlag" :text="loadingMes"></loading>
    </div>
</template>
<script>
import { Icon, Toast, Loading, Alert } from '../components';
import { policyHealthRecord } from '../apis/productBuy.api';
import {productData} from '../vuex/actions';
import {msgProductDataGetter} from '../vuex/getters';
export default{
    components: {
        Toast,
        Loading,
        Alert
    },
    vuex: {
        getters: {
            getProductData: msgProductDataGetter
        }
    },
    data () {
        return {
            check1: false,
            check2: false,
            check3: false,
            check4: false,
            check5: false,
            toastFlag: false,
            toastMes: '',
            loadingFlag: false,
            loadingMes: '正在加载',
            alertMes: '',
            alertSubMes: '',
            alertFlag: false,
        }
    },
    methods: {
        next: function () {
            if (this.check1&&this.check2&&this.check3&&this.check4&&this.check5) {
                var saleRecordId = this.getProductData.curProductData.saleRecordId;
                var healthRecord = {
                            "question1":"N",
                            "question2":"N",
                            "question3":"N",
                            "question4":"N",
                            "question5":"N",
                        }
                healthRecord = JSON.stringify(healthRecord);
                var submitData = {
                    saleRecordId: saleRecordId,
                    healthRecord: healthRecord,
                    healthResult: 'Y',
                    question1:"N",
                    question2:"N",
                    question3:"N",
                    question4:"N",
                    question5:"N"
                };
                this.loadingFlag = true;
                policyHealthRecord(submitData).then((data) => {
                    this.loadingFlag = false;
                    if (data.data.resultCode === '00000') {
                        //成功跳转
                        this.$router.go({
                            name: 'enterInfo'
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
            }else{
                this.toastFlag = true;
                this.toastMes = '您的健康告知未通过'
            };
        },
        change: function (value) {
            event.target.classList.remove('first_load');
            if (event.target.className != 'current') {
                this[event.currentTarget.id] = !this[event.currentTarget.id];
            }
        }
    }
}
</script>
<style lang="less">
    .health_notice{
        padding-bottom:1.6rem;
        h2{font-size:0.4rem;line-height:0.6rem;font-weight:bold;padding:0.3rem;border-bottom: 1px solid #ececec;}
        .wrap{
            overflow: hidden;
            border-bottom: 1px solid #ececec;
            position: relative;
        }
        .question{
            font-size: 0.34rem;
            line-height: 0.6rem;
            padding: 0.4rem 0.3rem;
            float: left;
            width: 70%;
        }
        .ans{
            float: left;
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            -webkit-tap-highlight-color:rgba(0,0,0,0);
        }
        .ans p{
            float: left;
            font-size: 0.34rem;
            padding: 0.4rem 0;
            line-height: 0.6rem;
            margin-right: 0.15rem;
        }
        .ans p i{
            width: 0.3rem;
            height: 0.3rem;
            border-radius: 50%;
            display: inline-block;
            border: 1px solid #ccc;
            margin-right: 0.15rem;
            vertical-align: middle;
        }
        .ans p i.current{
            background-color: #4285F7;
            box-shadow: 0 0 1px 1px #FFF inset;
        }
        .ps{
            font-size: 0.34rem;
            line-height: 0.6rem;
            padding: 0.4rem 0.3rem;
        }
        .first_load{
            background-color: transparent !important;
            box-shadow: none !important;
        }
        .weui_cell {
            padding: 5px 10px;
            color: #999;
        }
        .footer{
            height: 1.5rem;
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            border-top: 1px solid #ececec;
        }
        .btn{
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
        .weui_cell{
            padding-left: 30px;
            font-size: 0.34rem;
        }
    }
</style>