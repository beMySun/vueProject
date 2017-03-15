import Vue from 'vue';
import Vuex from 'vuex';
import middlewares from './middlewares';
import productData from './modules/productData';
import customData from './modules/customData';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        productData, customData
    }
});

export default store;