import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const game1 = require('./views/game1.vue');
const game2 = resolve => require(['./views/game2.vue'], resolve);
const game3 = resolve => require(['./views/game3.vue'], resolve);


const routes = [
    {
        path: '/',
        redirect: '/game1'
    },
    {
        path: '/game1',
        component: game1,
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/game2',
        component: game2,
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/game3',
        component: game3,
        meta: {
            keepAlive: true
        }
    }
];

export default new Router({
    routes
});