import productDetailView from '../view/productDetailView.vue';
import enterInfoView from '../view/enterInfoView.vue';
import valiInfoView from '../view/valiInfoView.vue';
import buyCardView from '../view/buyCardView.vue';
import insuranceNotice from '../view/insuranceNotice.vue';
import healthNotice from '../view/healthNotice.vue';
import completeView from '../view/completeView.vue';

export default {
    '/productDetail': {
        name: 'productDetail',
        component: productDetailView
    },
    '/enterInfo': {
        name: 'enterInfo',
        component: enterInfoView
    },
    '/valiInfo': {
    	name: 'valiInfo',
    	component: valiInfoView
    },
    '/buyCard': {
    	name: 'buyCard',
    	component: buyCardView
    },
    '/insuranceNotice': {
        name: 'insuranceNotice',
        component: insuranceNotice
    },
    '/healthNotice': {
        name: 'healthNotice',
        component: healthNotice
    },
    '/complete': {
        name: 'complete',
        component: completeView
    }
};