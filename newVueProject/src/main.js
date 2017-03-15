import './common/configs/http-config';
import './styles/reset.css';
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import routes from './routes/';
import {sync} from 'vuex-router-sync';
import store from './vuex/store';

Vue.config.debug = false;

Vue.use(VueRouter);


const router = new VueRouter({
    history: false
});


router.map(routes);

sync(store, router);

App.store = store;

router.beforeEach(function () {
    window.scrollTo(0, 0);
});

router.afterEach(function (transition) {
});
router.start(Vue.extend(App), 'app');