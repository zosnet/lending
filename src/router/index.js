import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: resolve => require(['/path-page/Frame/index.vue'], resolve),
      name: 'index',
      redirect: localStorage.getItem('index') === null ? '/home' : localStorage.getItem('index'),
      children: [
        {path: 'home', component: resolve => require(['/path-page/Home/home.vue'], resolve), needlogin: false},
        {path: 'logo', name: 'logo', component: resolve => require(['/path-page/Home/help.vue'], resolve), needlogin: false},
        {
          path: 'invest',
          component: resolve => require(['/path-page/Invest/invest.vue'], resolve),
          redirect: '/invest/investList',
          needlogin: false,
          children: [
            {path: 'investList', name: 'investList', component: resolve => require(['/path-page/Invest/investList.vue'], resolve), needlogin: false},
            {path: 'investingList', name: 'investingList', component: resolve => require(['/path-page/Invest/invest/investingList.vue'], resolve), needlogin: true},
            {path: 'investingdetail', name: 'investingdetail', component: resolve => require(['/path-page/Invest/invest/investingdetail.vue'], resolve), needlogin: true},
            {path: 'investsuccessList', name: 'investsuccessList', component: resolve => require(['/path-page/Invest/invest/investsuccessList.vue'], resolve), needlogin: true},
            {path: 'investsuccessdetail', name: 'investsuccessdetail', component: resolve => require(['/path-page/Invest/invest/investsuccessdetail.vue'], resolve), needlogin: true},
            {path: 'historyInvestList', name: 'historyInvestList', component: resolve => require(['/path-page/Invest/invest/historyInvestList.vue'], resolve), needlogin: true},
            {path: 'historyInvestdetail', name: 'historyInvestdetail', component: resolve => require(['/path-page/Invest/invest/historyinvestdetail.vue'], resolve), needlogin: true},
            {path: 'badinvestList', name: 'badinvestList', component: resolve => require(['/path-page/Invest/invest/badinvestList.vue'], resolve), needlogin: true},
            {path: 'badinvestdetail', name: 'badinvestdetail', component: resolve => require(['/path-page/Invest/invest/badinvestdetail.vue'], resolve), needlogin: true}
          ]
        },
        {
          path: '/setting',
          name: 'setting',
          component: resolve => require(['/path-page/Setting/setting.vue'], resolve),
          needlogin: false,
          redirect: '/setting/accessSettings',
          children: [
            {path: 'accessSettings', name: 'accessSettings', component: resolve => require(['/path-page/Setting/accessSettings.vue'], resolve), needlogin: false},
            {path: 'generalSetup', name: 'generalSetup', component: resolve => require(['/path-page/Setting/generalSetup.vue'], resolve), needlogin: false},
            {path: 'faucetAddress', name: 'faucetAddress', component: resolve => require(['/path-page/Setting/faucetAddress.vue'], resolve), needlogin: false},
            {path: 'carrier', name: 'carrier', component: resolve => require(['/path-page/Setting/carrierAdmin.vue'], resolve), needlogin: false},
            {path: 'information', name: 'information', component: resolve => require(['/path-page/Setting/information.vue'], resolve), needlogin: true},
            {path: 'permission', name: 'permission', component: resolve => require(['/path-page/Setting/permission.vue'], resolve), needlogin: true}
          ]
        },
        // {path: 'blockBrowser', name: 'blockBrowser', component: blockBrowser, needlogin: false},
        // {path: '/block/:block_height', name: 'Block', component: showBlock, needlogin: false},
        // {path: '/transaction/:tx_id', name: 'Transaction', component: showTransaction, needlogin: false},
        // {path: '/account/:id_or_name', name: 'Account', component: showAccount, needlogin: false},
        {path: '/investDetails', name: 'investDetails', component: resolve => require(['/path-page/Invest/investDetails.vue'], resolve), needlogin: true},
        {
          path: '/borrow',
          name: 'borrow',
          component: resolve => require(['/path-page/Borrow/index.vue'], resolve),
          needlogin: true,
          redirect: '/borrow/borrows',
          children: [
            {path: 'borrows', name: 'borrows', component: resolve => require(['/path-page/Borrow/borrows.vue'], resolve), needlogin: true},
            {path: 'borrowingList', name: 'borrowingList', component: resolve => require(['/path-page/Borrow/borrow/borrowingList.vue'], resolve), needlogin: true},
            {path: 'borrowsuccess', name: 'borrowsuccess', component: resolve => require(['/path-page/Borrow/borrow/borrowsuccess.vue'], resolve), needlogin: true},
            {path: 'borrowingdetail', name: 'borrowingdetail', component: resolve => require(['/path-page/Borrow/borrow/borrowingdetail.vue'], resolve), needlogin: true},
            {path: 'borrowsuccessdetail', name: 'borrowsuccessdetail', component: resolve => require(['/path-page/Borrow/borrow/borrowsuccessdetail.vue'], resolve), needlogin: true},
            {path: 'historyloanList', name: 'historyloanList', component: resolve => require(['/path-page/Borrow/borrow/historyloanList.vue'], resolve), needlogin: true},
            {path: 'historyloandetail', name: 'historyloandetail', component: resolve => require(['/path-page/Borrow/borrow/historyloandetail.vue'], resolve), needlogin: true},
            {path: 'badloandetails', name: 'badloandetails', component: resolve => require(['/path-page/Borrow/borrow/badloandetail.vue'], resolve), needlogin: true},
            {path: 'badloanList', name: 'badloanList', component: resolve => require(['/path-page/Borrow/borrow/badloanList.vue'], resolve), needlogin: true}
          ]
        },
        {
          path: 'balance',
          name: 'balance',
          component: resolve => require(['/path-page/Balances/index.vue'], resolve),
          needlogin: true,
          redirect: '/balance/balances',
          children: [
            {path: 'balances', name: 'balances', component: resolve => require(['/path-page/Balances/balances.vue'], resolve), needlogin: true},
            {path: 'balanceslist', name: 'balanceslist', component: resolve => require(['/path-page/Balances/BalancesList.vue'], resolve), needlogin: true},
            {path: 'operationslist', name: 'operationslist', component: resolve => require(['/path-page/Balances/operationslist.vue'], resolve), needlogin: true},
            {path: 'authors', name: 'authors', component: resolve => require(['/path-page/Balances/authors.vue'], resolve), needlogin: true},
            {path: 'withdrawlock', name: 'withdrawlock', component: resolve => require(['/path-page/Balances/withdrawlock.vue'], resolve), needlogin: true}
          ]
        },
        {
          path: 'locktoken',
          name: 'locktoken',
          component: resolve => require(['/path-page/locktoken/index.vue'], resolve),
          needlogin: true,
          redirect: '/locktoken/locktokendy',
          children: [
            {path: 'locktokendy', name: 'locktokendy', component: resolve => require(['/path-page/locktoken/lock-dy.vue'], resolve), needlogin: true},
            {path: 'locktokenfixed', name: 'locktokenfixed', component: resolve => require(['/path-page/locktoken/lock-fixed.vue'], resolve), needlogin: true},
            {path: 'locktokennode', name: 'locktokennode', component: resolve => require(['/path-page/locktoken/lock-node.vue'], resolve), needlogin: true}
          ]
        },
        {
          path: 'sell',
          name: 'sell',
          component: resolve => require(['/path-page/Sell/index.vue'], resolve),
          needlogin: true
          // redirect: '/sell'
          // children: [
          //   {path: 'summary', name: 'summary', component: resolve => require(['/path-page/Sell/summary.vue'], resolve), needlogin: false},
          //   {path: 'sell', name: 'sell', component: resolve => require(['/path-page/Sell/sell.vue'], resolve), needlogin: true}
          // ]
        },
        {path: '/invite', name: 'invite', component: resolve => require(['/path-page/Invite/index.vue'], resolve), needlogin: true},
        // {path: '/params', name: 'params', component: params, needlogin: false},
        {
          path: '/admin',
          name: 'admin',
          component: resolve => require(['/path-page/Admin/index.vue'], resolve),
          needlogin: false,
          redirect: '/admin/params',
          children: [
            {path: 'params', name: 'params', component: resolve => require(['/path-page/Admin/Params/index.vue'], resolve), needlogin: false},
            {path: 'carriers', name: 'carriers', component: resolve => require(['/path-page/Admin/carriers/index.vue'], resolve), needlogin: false},
            {path: 'myProposalList', name: 'myProposalList', component: resolve => require(['/path-page/Admin/Proposal/myProposalList.vue'], resolve), needlogin: true},
            {path: 'processBadLoanList', name: 'processBadLoanList', component: resolve => require(['/path-page/Admin/Badloan/processBadLoanList.vue'], resolve), needlogin: true},
            {path: 'adminBadLoanDetail', name: 'adminBadLoanDetail', component: resolve => require(['/path-page/Admin/Badloan/adminBadLoanDetail.vue'], resolve), needlogin: true},
            {path: 'locktoken', name: 'locktoken', component: resolve => require(['/path-page/Admin/locktoken/index.vue'], resolve), needlogin: false}
          ]
        },
        {
          path: '/history',
          name: 'history',
          component: resolve => require(['/path-page/History'], resolve),
          needlogin: false,
          redirect: '/history/borrowHis',
          children: [
            {
              path: 'borrowHis',
              name: 'borrowHis',
              component: resolve => require(['/path-page/History/borrowHis'], resolve),
              needlogin: false,
              redirect: '/history/borrowHis/borrowingList',
              children: [
                {path: 'borrowingList', name: 'borrowingList', component: resolve => require(['/path-page/Borrow/borrow/borrowingList.vue'], resolve), needlogin: false},
                {path: 'borrowsuccess', name: 'borrowsuccess', component: resolve => require(['/path-page/Borrow/borrow/borrowsuccess.vue'], resolve), needlogin: false},
                {path: 'borrowingdetail', name: 'borrowingdetail', component: resolve => require(['/path-page/Borrow/borrow/borrowingdetail.vue'], resolve), needlogin: false},
                {path: 'borrowsuccessdetail', name: 'borrowsuccessdetail', component: resolve => require(['/path-page/Borrow/borrow/borrowsuccessdetail.vue'], resolve), needlogin: false},
                {path: 'historyloanList', name: 'historyloanList', component: resolve => require(['/path-page/Borrow/borrow/historyloanList.vue'], resolve), needlogin: false},
                {path: 'historyloandetail', name: 'historyloandetail', component: resolve => require(['/path-page/Borrow/borrow/historyloandetail.vue'], resolve), needlogin: false},
                {path: 'badloandetails', name: 'badloandetails', component: resolve => require(['/path-page/Borrow/borrow/badloandetail.vue'], resolve), needlogin: false},
                {path: 'badloanList', name: 'badloanList', component: resolve => require(['/path-page/Borrow/borrow/badloanList.vue'], resolve), needlogin: false}
              ]
            },
            {
              path: 'investHis',
              name: 'investHis',
              component: resolve => require(['/path-page/History/investHis'], resolve),
              needlogin: false,
              redirect: '/history/investHis/investingList',
              children: [
                {path: 'investingList', name: 'investingList', component: resolve => require(['/path-page/Invest/invest/investingList.vue'], resolve), needlogin: false},
                {path: 'investingdetail', name: 'investingdetail', component: resolve => require(['/path-page/Invest/invest/investingdetail.vue'], resolve), needlogin: false},
                {path: 'investsuccessList', name: 'investsuccessList', component: resolve => require(['/path-page/Invest/invest/investsuccessList.vue'], resolve), needlogin: false},
                {path: 'investsuccessdetail', name: 'investsuccessdetail', component: resolve => require(['/path-page/Invest/invest/investsuccessdetail.vue'], resolve), needlogin: false},
                {path: 'historyInvestList', name: 'historyInvestList', component: resolve => require(['/path-page/Invest/invest/historyInvestList.vue'], resolve), needlogin: false},
                {path: 'historyInvestdetail', name: 'historyInvestdetail', component: resolve => require(['/path-page/Invest/invest/historyinvestdetail.vue'], resolve), needlogin: false},
                {path: 'badinvestList', name: 'badinvestList', component: resolve => require(['/path-page/Invest/invest/badinvestList.vue'], resolve), needlogin: false},
                {path: 'badinvestdetail', name: 'badinvestdetail', component: resolve => require(['/path-page/Invest/invest/badinvestdetail.vue'], resolve), needlogin: false}
              ]
            },
            {path: 'lockHis', name: 'lockHis', component: resolve => require(['/path-page/History/lockHis'], resolve), needlogin: false}
          ]
        },
        {path: '/register', name: 'register', component: resolve => require(['/path-page/Login/register.vue'], resolve), needlogin: false},
        {path: '/login', name: 'login', component: resolve => require(['/path-page/Login/login.vue'], resolve), needlogin: false}
      ]
    },
    {path: '/register/:userid', name: 'register', component: resolve => require(['/path-page/Login/register.vue'], resolve), needlogin: false},
    {path: '*', redirect: '/home', needlogin: false}
  ],
  nextpath: undefined
})
