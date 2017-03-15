import {PRODUCT_DATA} from '../mutation_types';

const state = {
    productData: '',
    curProductData: ''
};

const mutations = {
    [PRODUCT_DATA] (state, data, curData) {
        state.productData = data;
        state.curProductData = curData;
    }
};
export default {
    state, mutations
};