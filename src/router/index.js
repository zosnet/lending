import Vue from 'vue'
import Router from 'vue-router'
const Index = () => import('/path-page/Frame/index.vue')
const Login = () => import('/path-page/Login/login.vue')
const Register = () => import('/path-page/Login/register.vue')
const Home = () => import('/path-page/Home/home.vue')
const logo = () => import('/path-page/Home/help.vue')
const invest = () => import('/path-page/Invest/invest.vue')
const investList = () => import('/path-page/Invest/investList.vue')
const investDetails = () => import('/path-page/Invest/investDetails.vue')
// const user = () => import('/path-page/User/user.vue')
// 设置
const setting = () => import('/path-page/Setting/setting.vue')
const information = () => import('/path-page/Setting/information.vue')
const generalSetup = () => import('/path-page/Setting/generalSetup.vue')
const accessSettings = () => import('/path-page/Setting/accessSettings.vue')
const carrier = () => import('/path-page/Setting/carrierAdmin.vue')
const faucetAddress = () => import('/path-page/Setting/faucetAddress.vue')
const permission = () => import('/path-page/Setting/permission.vue')
// const support = () => import('/path-page/Setting/support.vue')
const invite = () => import('/path-page/Invite/index.vue')
// 参数
const admin = () => import('/path-page/Admin/index.vue')
const params = () => import('/path-page/Admin/Params/index.vue')
// const blockBrowser = () => import('/path-page/Browser/blockBrowser.vue')
// const showTransaction = () => import('/path-page/Browser/Transaction.vue')
// const showAccount = () => import('/path-page/Browser/Account.vue')
// const showBlock = () => import('/path-page/Browser/Block.vue')
const Balance = () => import('/path-page/Balances/index.vue')
const Balances = () => import('/path-page/Balances/balances.vue')
const BalancesList = () => import('/path-page/Balances/BalancesList.vue')
// 我要借款
const borrow = () => import('/path-page/Borrow/index.vue')
const borrows = () => import('/path-page/Borrow/borrows.vue')
// 借款页面
const borrowingList = () => import('/path-page/Borrow/borrow/borrowingList.vue')
// 借款管理
const borrowingdetail = () => import('/path-page/Borrow/borrow/borrowingdetail.vue')
const borrowsuccess = () => import('/path-page/Borrow/borrow/borrowsuccess.vue')
// 正在还款中的借款详情
const borrowsuccessdetail = () => import('/path-page/Borrow/borrow/borrowsuccessdetail.vue')
const badloandetails = () => import('/path-page/Borrow/borrow/badloandetail.vue')
const badloanList = () => import('/path-page/Borrow/borrow/badloanList.vue')
// 还款历史
const historyloanList = () => import('/path-page/Borrow/borrow/historyloanList.vue')
const historyloandetail = () => import('/path-page/Borrow/borrow/historyloandetail.vue')
const investingList = () => import('/path-page/Invest/invest/investingList.vue')
const investingdetail = () => import('/path-page/Invest/invest/investingdetail.vue')
const investsuccessList = () => import('/path-page/Invest/invest/investsuccessList.vue')
const investsuccessdetail = () => import('/path-page/Invest/invest/investsuccessdetail.vue')
const historyInvestList = () => import('/path-page/Invest/invest/historyInvestList.vue')
const historyInvestdetail = () => import('/path-page/Invest/invest/historyinvestdetail.vue')
const badinvestList = () => import('/path-page/Invest/invest/badinvestList.vue')
const badinvestdetail = () => import('/path-page/Invest/invest/badinvestdetail.vue')
// 提案
const myProposalList = () => import('/path-page/Admin/Proposal/myProposalList.vue')
const processBadLoanList = () => import('/path-page/Admin/Badloan/processBadLoanList.vue')
const adminBadLoanDetail = () => import('/path-page/Admin/Badloan/adminBadLoanDetail.vue')
const history = () => import('/path-page/History')
const borrowHis = () => import('/path-page/History/borrowHis')
const investHis = () => import('/path-page/History/investHis')
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      component: Index,
      name: 'index',
      redirect: localStorage.getItem('index') === null ? '/home' : localStorage.getItem('index'),
      children: [
        {path: 'home', component: Home, needlogin: false},
        {path: 'logo', name: 'logo', component: logo, needlogin: false},
        {
          path: 'invest',
          component: invest,
          redirect: '/invest/investList',
          needlogin: false,
          children: [
            {path: 'investList', name: 'investList', component: investList, needlogin: false},
            {path: 'investingList', name: 'investingList', component: investingList, needlogin: true},
            {path: 'investingdetail', name: 'investingdetail', component: investingdetail, needlogin: true},
            {path: 'investsuccessList', name: 'investsuccessList', component: investsuccessList, needlogin: true},
            {path: 'investsuccessdetail', name: 'investsuccessdetail', component: investsuccessdetail, needlogin: true},
            {path: 'historyInvestList', name: 'historyInvestList', component: historyInvestList, needlogin: true},
            {path: 'historyInvestdetail', name: 'historyInvestdetail', component: historyInvestdetail, needlogin: true},
            {path: 'badinvestList', name: 'badinvestList', component: badinvestList, needlogin: true},
            {path: 'badinvestdetail', name: 'badinvestdetail', component: badinvestdetail, needlogin: true}
          ]
        },
        {
          path: '/setting',
          name: 'setting',
          component: setting,
          needlogin: false,
          redirect: '/setting/accessSettings',
          children: [
            {path: 'accessSettings', name: 'accessSettings', component: accessSettings, needlogin: false},
            {path: 'generalSetup', name: 'generalSetup', component: generalSetup, needlogin: false},
            {path: 'faucetAddress', name: 'faucetAddress', component: faucetAddress, needlogin: false},
            {path: 'carrier', name: 'carrier', component: carrier, needlogin: false},
            {path: 'information', name: 'information', component: information, needlogin: true},
            {path: 'permission', name: 'permission', component: permission, needlogin: true}
            // {path: 'support', name: 'support', component: support, needlogin: false}
          ]
        },
        // {path: 'blockBrowser', name: 'blockBrowser', component: blockBrowser, needlogin: false},
        // {path: '/block/:block_height', name: 'Block', component: showBlock, needlogin: false},
        // {path: '/transaction/:tx_id', name: 'Transaction', component: showTransaction, needlogin: false},
        // {path: '/account/:id_or_name', name: 'Account', component: showAccount, needlogin: false},
        {path: '/investDetails', name: 'investDetails', component: investDetails, needlogin: true},
        {
          path: '/borrow',
          name: 'borrow',
          component: borrow,
          needlogin: true,
          redirect: '/borrow/borrows',
          children: [
            {path: 'borrows', name: 'borrows', component: borrows, needlogin: true},
            {path: 'borrowingList', name: 'borrowingList', component: borrowingList, needlogin: true},
            {path: 'borrowsuccess', name: 'borrowsuccess', component: borrowsuccess, needlogin: true},
            {path: 'borrowingdetail', name: 'borrowingdetail', component: borrowingdetail, needlogin: true},
            {path: 'borrowsuccessdetail', name: 'borrowsuccessdetail', component: borrowsuccessdetail, needlogin: true},
            {path: 'historyloanList', name: 'historyloanList', component: historyloanList, needlogin: true},
            {path: 'historyloandetail', name: 'historyloandetail', component: historyloandetail, needlogin: true},
            {path: 'badloandetails', name: 'badloandetails', component: badloandetails, needlogin: true},
            {path: 'badloanList', name: 'badloanList', component: badloanList, needlogin: true}
          ]
        },
        {
          path: 'balance',
          name: 'balance',
          component: Balance,
          needlogin: true,
          redirect: '/balance/balances',
          children: [
            {path: 'balances', name: 'balances', component: Balances, needlogin: true},
            {path: 'balanceslist', name: 'balanceslist', component: BalancesList, needlogin: true}
          ]
        },
        {path: '/invite', name: 'invite', component: invite, needlogin: true},
        {path: '/params', name: 'params', component: params, needlogin: false},
        {
          path: '/admin',
          name: 'admin',
          component: admin,
          needlogin: false,
          redirect: '/admin/params',
          children: [
            {path: 'params', name: 'params', component: params, needlogin: true},
            {path: 'myProposalList', name: 'myProposalList', component: myProposalList, needlogin: true},
            {path: 'processBadLoanList', name: 'processBadLoanList', component: processBadLoanList, needlogin: true},
            {path: 'adminBadLoanDetail', name: 'adminBadLoanDetail', component: adminBadLoanDetail, needlogin: true}
          ]
        },
        {
          path: '/history',
          name: 'history',
          component: history,
          needlogin: false,
          redirect: '/history/borrowHis',
          children: [
            {
              path: 'borrowHis',
              name: 'borrowHis',
              component: borrowHis,
              needlogin: false,
              redirect: '/history/borrowHis/borrowingList',
              children: [
                {path: 'borrowingList', name: 'borrowingList', component: borrowingList, needlogin: false},
                {path: 'borrowsuccess', name: 'borrowsuccess', component: borrowsuccess, needlogin: false},
                {path: 'borrowingdetail', name: 'borrowingdetail', component: borrowingdetail, needlogin: false},
                {path: 'borrowsuccessdetail', name: 'borrowsuccessdetail', component: borrowsuccessdetail, needlogin: false},
                {path: 'historyloanList', name: 'historyloanList', component: historyloanList, needlogin: false},
                {path: 'historyloandetail', name: 'historyloandetail', component: historyloandetail, needlogin: false},
                {path: 'badloandetails', name: 'badloandetails', component: badloandetails, needlogin: false},
                {path: 'badloanList', name: 'badloanList', component: badloanList, needlogin: false}
              ]
            },
            {
              path: 'investHis',
              name: 'investHis',
              component: investHis,
              needlogin: false,
              redirect: '/history/investHis/investingList',
              children: [
                {path: 'investingList', name: 'investingList', component: investingList, needlogin: false},
                {path: 'investingdetail', name: 'investingdetail', component: investingdetail, needlogin: false},
                {path: 'investsuccessList', name: 'investsuccessList', component: investsuccessList, needlogin: false},
                {path: 'investsuccessdetail', name: 'investsuccessdetail', component: investsuccessdetail, needlogin: false},
                {path: 'historyInvestList', name: 'historyInvestList', component: historyInvestList, needlogin: false},
                {path: 'historyInvestdetail', name: 'historyInvestdetail', component: historyInvestdetail, needlogin: false},
                {path: 'badinvestList', name: 'badinvestList', component: badinvestList, needlogin: false},
                {path: 'badinvestdetail', name: 'badinvestdetail', component: badinvestdetail, needlogin: false}
              ]
            }
          ]
        },
        {path: '/register', name: 'register', component: Register, needlogin: false},
        {path: '/login', name: 'login', component: Login, needlogin: false}
      ]
    },
    {path: '/register/:userid', name: 'register', component: Register, needlogin: false},
    {path: '*', redirect: '/home', needlogin: false}
  ],
  nextpath: undefined
})
