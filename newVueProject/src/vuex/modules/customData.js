import {CUSTOM_DATA} from '../mutation_types';

const state = {
    customData: ''
};

const mutations = {
    [CUSTOM_DATA] (state, data) {
        state.customData = data;
    }
};
export default {
    state, mutations
};