import Vue from 'vue';
//详情展示
export function getAhProductDetail (data) {
    return Vue.http.post(Vue.getUrl('/product/getAhProductDetail.do'), data);
};
//校验费用
export function policyInquiry (data) {
	return Vue.http.post(Vue.getUrl('/policy/policyInquiry.do'), data);
}
//立即投保
export function ahPolicyInsure (data) {
	return Vue.http.post(Vue.getUrl('/policy/ahPolicyInsure.do'), data);
}
//记录投保人被保人信息
export function recordInsured (data) {
	return Vue.http.post(Vue.getUrl('/insurant/recordInsured.do'), data);
}
//核保
export function policyUndwrt (data) {
	return Vue.http.post(Vue.getUrl('/policy/policyUndwrt.do'), data);
}
//支付接口
export function pay (data) {
	return Vue.http.post(Vue.getUrl('/payment/pay.do'), data);
}
//健康告知提交信息
export function policyHealthRecord (data) {
	return Vue.http.post(Vue.getUrl('/policy/policyHealthRecord.do'), data);
}
//链接解密接口
export function aesDecrypt (data) {
	return Vue.http.post(Vue.getUrl('/product/aesDecrypt.do'), data);
}