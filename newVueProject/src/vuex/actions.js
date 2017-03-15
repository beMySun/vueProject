import * as TYPES from './mutation_types';

export function productData ({dispatch}, data, curData) {
    dispatch(TYPES.PRODUCT_DATA, data, curData);
};
export function customData ({dispatch}, data) {
    dispatch(TYPES.CUSTOM_DATA, data);
};
