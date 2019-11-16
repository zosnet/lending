import axios from 'axios'
import store from '/path-store'
axios.defaults.timeout = 20000
axios.defaults.headers.post['Content-Type'] = 'application/x-www=form-urlencoded'
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

export default {
  fetchGet (url, params = {}) {
    if (url.indexOf('http') !== 0 && url.indexOf('..') !== 0) {
      url = 'http://' + url
    }
    return new Promise((resolve, reject) => {
      axios.get(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchQuickSearch (url) {
    if (url.indexOf('http') !== 0 && url.indexOf('..') !== 0) {
      url = 'http://' + url
    }
    return new Promise((resolve, reject) => {
      axios.get(url).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchPost (url, params = {}) {
    if (url.indexOf('http') !== 0 && url.indexOf('..') !== 0) {
      url = 'http://' + url
    }
    return new Promise((resolve, reject) => {
      axios.post(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getBrowserType () {
    var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf('Opera') > -1
    if (isOpera) {
      return 'Opera'
    }; // 判断是否Opera浏览器
    if (userAgent.indexOf('Firefox') > -1) {
      return 'FF'
    } // 判断是否Firefox浏览器
    if (userAgent.indexOf('Chrome') > -1) {
      return 'Chrome'
    }
    if (userAgent.indexOf('Safari') > -1) {
      return 'Safari'
    } // 判断是否Safari浏览器
    if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
      return 'IE'
    } // 判断是否IE浏览器
    return ''
  },
  // 用户资产
  formatAssets (symbol) {
    if (store.state.userassets !== null) {
      let allAssests = store.state.userassets
      return allAssests.filter((val) => {
        return symbol === val.symbol
      })
    } else {
      return []
    }
  },
  formatAssetsID (id) {
    if (store.state.userassets !== null) {
      let allAssests = store.state.userassets
      return allAssests.filter((val) => {
        return id === val.asset_id
      })
    } else {
      return []
    }
  },
  updateAssets (symbol, balance) {
    if (store.state.userassets !== null) {
      let allAssests = store.state.userassets
      return allAssests.filter((val) => {
        if (symbol === val.symbol) {
          val.amount = balance
        }
      })
    } else {
      return []
    }
  }
}
