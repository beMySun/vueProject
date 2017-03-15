import VueResource from 'vue-resource';
import Vue from 'vue';
import Cache from '../utils/cache';
import NativeHttp from '../utils/NativeHttp';
import {logout} from '../../vuex/actions';
import store from '../../vuex/store';

Vue.use(VueResource);

const env = process.env.NODE_ENV;

Vue.http.options.crossOrigin = true;
Vue.http.options.xhr = {withCredentials: true};


let urlMap;
if (env === 'production') {
    urlMap = {
        A: '/icp_yl'
    };
} else {
    urlMap = {
        A: '/icp_yl'
    };
}

// function getUrl (url, key = 'A') {
//     return urlMap[key] + url;
// };


//pro
//icp
// function getUrl (url) {
//     return '/icp_yl_dmz' + url;
// };
//isp
// function getUrl (url) {
//     return '/isp' + url;
// };
//dev
// function getUrl (url) {
//     return 'http://iqsh-l8829:9112/icp_yl' + url;
// };

// function getUrl (url) {
//     return 'http://iqsh-l0418:9112/icp_yl' + url;
// };
function getUrl (url) {
    return 'http://iqsh-d0602:9112/icp_yl' + url;
};
function install (Vue) {
    Vue.prototype.$getUrl = getUrl;
    Vue.getUrl = getUrl;
}

Vue.use(install);

export default getUrl;
