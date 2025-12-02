import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About2.vue'),
  },
  {
    path: '/introduce',
    name: 'Introduce',
    component: () => import('../views/Introduce.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomeMain.vue'),
  },
  {
    path: '/position',
    name: 'Position',
    component: () => import('../views/Position.vue'),
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/User.vue'),
  },
  {
    path: '/language',
    name: 'Language',
    component: () => import('../views/Language.vue'),
  },
  {
    path: '/trade',
    name: 'Trade',
    component: () => import('../views/Trade.vue'),
  },
  {
    path: '/withdraw',
    name: 'Withdraw',
    component: () => import('../views/Withdraw.vue'),
  },
  {
    path: '/withdrawDetail',
    name: 'WithdrawDetail',
    component: () => import('../views/WithdrawDetail.vue'),
  },
  {
    path: '/withdrawAccount',
    name: 'WithdrawAccount',
    component: () => import('../views/WithdrawAccount.vue'),
  },
  {
    path: '/addwallet/bank',
    name: 'AddWalletBank',
    component: () => import('../views/AddWalletBank.vue'),
  },
  {
    path: '/addwallet/usdt-trc20',
    name: 'AddWalletUsdtTrc20',
    component: () => import('../views/AddWalletUsdtTrc20.vue'),
  },
  {
    path: '/addwallet/usdt-erc20',
    name: 'AddWalletUsdtErc20',
    component: () => import('../views/AddWalletUsdtErc20.vue'),
  },
  {
    path: '/editpawd',
    name: 'EditPassword',
    component: () => import('../views/EditPassword.vue'),
  },
  {
    path: '/attest',
    name: 'Attest',
    component: () => import('../views/Attest.vue'),
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/Chat.vue'),
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('../views/News.vue'),
  },
  {
    path: '/article',
    name: 'Article',
    component: () => import('../views/Article.vue'),
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('../views/Help.vue'),
  },
  {
    path: '/rechargeDetail',
    name: 'RechargeDetail',
    component: () => import('../views/RechargeDetail.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
