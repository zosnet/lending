  <template>
    <div v-loading="loading > 0" :element-loading-text="$t('m.loading')" style="min-height: 10vw;" class="jyNVPQ2">
    <div v-loading="subloading" :element-loading-text="$t('m.params.submit')">
      <div v-if="loading <= 0 || refershflag">
      <div class="jvhNys1 UMJSF VsGOO account">
      <div class="layout">
        <el-card class="box-card box-card-left">
          <div class="dy_head">
            <div class="dy_head_item">
              <!-- 原选择器组件开始 -->
              <!-- <el-form
              label-width="60px"
              class="demo-ruleForm"
              label-position="left"
              >
               <el-form-item
                :label="`${$t('m.orderList.NODE')}`">
                <el-select v-model="selectSymbol" value-key="id" :placeholder="$t('m.transfer.XZBZ')" @change="selectAsset()">
                  <el-option
                    v-for="item in optionlist"
                    :key="item.asset_id"
                    :label="item.asset_name"
                    :value="item">
                    <img width="20" height="20" v-bind:src="`/static/images/${item.asset_name.toUpperCase()}.png`" :onerror="errorImg01">
                    <span class="margin-l20">{{item.asset_name}}</span>
                  </el-option>
                </el-select>
                </el-form-item>
              </el-form> -->
              <!-- 原选择器组件结束 -->

              <!-- 更换下拉菜单组件开始 -->
              <el-form
              label-width="60px"
              class="demo-ruleForm"
              label-position="right"
              >
                <el-form-item
                :label="`${$t('m.orderList.NODE')}`">
                  <el-dropdown @command="selectAsset" trigger="click">
                    <el-button size="small" class="dropdown_style">
                      <img width="20" height="20" v-bind:src="`/static/images/${selectSymbol.symbol}.png`" :onerror="errorImg01">
                      <span class="margin-l20">{{selectSymbol.symbol}}</span>
                      <span style="flex: 1"></span>
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown" >
                      <el-dropdown-item
                        v-for="item in optionlist"
                        :key="item.asset_id"
                        :label="item.asset_name"
                        :command="item"
                        class="margin-t10"
                      >
                        <img width="20" height="20" v-bind:src="`/static/images/${item.asset_name.toUpperCase()}.png`" :onerror="errorImg01">
                        <span class="margin-l20">{{item.asset_name}}</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
              </el-form>
              <!-- 更换下拉菜单组件结束 -->
            </div>
          </div>
         <div class="dy_main">
          <el-row>
            <el-col :span="4" class="title_info">{{$t('m.drawDialog.available')}}:</el-col>
            <el-col :span="18" class="num_info">
              <span class="symbol_unit">{{selectSymbol.symbol}}</span>
              {{available | formatLegalCurrency('', selectSymbol.precision)}}
            </el-col>
         </el-row>
         <el-row>
           <el-col :span="4" class="title_info">
             {{$t('m.information.coupons')}}:
           </el-col>
           <el-col :span="18" class="num_info">
            <span class="symbol_unit">ZOS</span>
            {{this.$store.state.coupon.amount}}
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="4" class="title_info">{{$t('m.borrow.fee')}}:</el-col>
           <el-col :span="18" class="num_info">
             <span class="symbol_unit">ZOS</span>
             {{this.feeZos | formatLegalCurrency('', 5)}}
           </el-col>
         </el-row>
         <el-row v-if='feed!==1.0'>
           <el-col :span="4" class="title_info">{{$t('m.lockasseted.feed')}}:</el-col>
           <el-col :span="18" class="num_info">
             {{this.feed}}
             <span class="symbol_unit">{{selectSymbol.symbol}}</span>/<span class="symbol_unit">{{selectSymbol.interestsymbol}}</span>
           </el-col>
         </el-row>
         <!-- <el-row> <el-col :span="4" class="title_info">{{$t('m.lockasseted.rate')}}:</el-col>
            <el-col :span="18" class="num_info" style="color: #E75441;">{{this.rateString | formatLegalCurrency(selectSymbol.interestsymbol, selectSymbol.interestprecision)}} </el-col></el-row> -->
         </div>
        <!-- <div class="dy_btn"  @click="createitem(1)">{{$t('m.params.create')}}</div> -->
        </el-card >
        <div class="dy_right">
           <el-card class="box-card" v-if="!loadsum">
             <div class="dy_main">
              <el-row>
                <el-col :span="6" class="title_info">{{$t('m.lockasseted.total')}}:</el-col>
                <el-col :span="16" class="num_info">
                  <span class="symbol_unit">{{locksum.locktoken[2].total.symbol}}</span>
                  {{locksum.locktoken[2].total.amount | formatLegalCurrency3('', locksum.locktoken[2].total.precision)}}
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="6" class="title_info">{{$t('m.lockasseted.allinterest')}}:</el-col>
                <el-col :span="16" class="num_info" v-if="locksum.locktoken[2].interest.length < 1">0</el-col>
                <el-col :span="16" class="num_info" v-else>
                  <span v-for="(item,index) in locksum.locktoken[2].interest"  :key="index">
                    <span class="symbol_unit">{{item[1].symbol}}</span>
                    {{item[1].amount | formatLegalCurrency3('', item[1].precision)}}
                  </span>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="6" class="title_info">{{$t('m.lockasseted.allcount')}}:</el-col>
                <el-col :span="16" class="num_info">{{locksum.locktoken[2].count}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="6" class="title_info"></el-col>
                <el-col :span="16" class="num_info"></el-col>
              </el-row>
              <el-row>
                <el-col :span="6" class="title_info">
                  {{$t('m.lockasseted.interestmode')}}
                  <el-tooltip :content="$t('m.lockasseted.interestmode_info')" placement="bottom" effect="light">
                    <i class="el-icon-info"></i>
                  </el-tooltip> :
                </el-col>
                <el-col :span="16" class="num_info">
                  <span class="symbol_unit">{{lockobj.interest_name}}</span>
                </el-col>
              </el-row>
             </div>
           </el-card>
        </div>
      </div>
      </div>
        <el-tabs v-model="activeTabName" @tab-click="handleClick" class="margin-t10 margin-lr10">
          <el-tab-pane :label="$t('m.orderList.JDJL')" name="first">
            <el-table
            :data="refunding1"
            class="curp"
            style="width: 100%;"
            @row-click="handleClick"
            stripe>
            <el-table-column width="100" align="center" :label="$t('m.balance.bitType')">
              <template slot-scope="scope">
                <img :src="'/static/images/' + scope.row.symbol + '.png'" width="24" :onerror="errorImg01" />
                {{scope.row.symbol}}
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" :label="$t('m.balance.index')">
              <template slot-scope="scope">
                {{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('m.lockasseted.lockamount')">
              <template slot-scope="scope">
                {{scope.row.locked.amount | formatLegalCurrency3('', scope.row.precision)}}
                <span class="symbol_unit">{{scope.row.symbol}}</span>
              </template>
            </el-table-column>
            <!-- 期限 -->
            <el-table-column width="80"  align="center" :label="$t('m.lockasseted.lockperiod')">
              <template slot-scope="scope">
                <span> {{scope.row.period.toString()}}{{$t('m.months')}}</span>
              </template>
            </el-table-column>
            <!-- 节点类型 -->
            <el-table-column width="120"  align="center" :label="$t('m.lockasseted.nodetype')">
              <template slot-scope="scope">
                <span> {{$t('m.lockasseted.nodetype' + scope.row.autolock)}}</span>
              </template>
            </el-table-column>
            <!-- 收益比例 -->
            <el-table-column width="120" align="center"  :label="$t('m.lockasseted.interestrate')">
              <template slot-scope="scope">
                <span  v-if="Number(scope.row.rate) >= 0">{{Number(scope.row.rate) / 10}}‰</span>
              </template>
            </el-table-column>
            <!-- 创建时间 -->
            <el-table-column width="165" align="center"  :label="$t('m.lockasseted.creattime')">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>
            <!-- 锁仓总收益 -->
            <el-table-column align="center"  :label="$t('m.lockasseted.allinterest')">
              <template slot-scope="scope">
                {{scope.row.interest.amount | formatLegalCurrency3('', scope.row.interestprecision)}}
                <span class="symbol_unit">{{scope.row.interestsymbol}}</span>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column width="80" align="center"  :label="$t('m.orderList.operation')">
              <template slot-scope="scope" class="flex-h">
                <el-button type="text" @click="operator(0, scope.row)">{{$t('m.lockasseted.detail')}}</el-button>
              </template>
            </el-table-column>
            <div slot="empty">
              <p>{{$t('m.noData')}}</p>
            </div>
          </el-table>
          <div style="text-align: right">
            <el-pagination background @current-change="handleCurrentChange1" :current-page="listQuery1.page" :page-size="listQuery1.limit" layout="total, prev, pager, next, jumper" :total="total1">
            </el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="$t('m.orderList.LSJL')" name="second">
            <el-table
            :data="refunding2"
            class="curp"
            style="width: 100%;"
            @row-click="handleClick"
            stripe>
            <el-table-column width="100" align="center" :label="$t('m.balance.bitType')">
              <template slot-scope="scope">
                <img :src="'/static/images/' + scope.row.symbol + '.png'" width="24" :onerror="errorImg01" />
                {{scope.row.symbol}}
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" :label="$t('m.balance.index')">
              <template slot-scope="scope">
                {{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('m.lockasseted.lockamount')">
              <template slot-scope="scope">
                {{scope.row.locked.amount | formatLegalCurrency3('', scope.row.precision)}}
                <span class="symbol_unit">{{scope.row.symbol}}</span>
              </template>
            </el-table-column>
            <!-- 期限 -->
            <el-table-column width="80"  align="center" :label="$t('m.lockasseted.lockperiod')">
              <template slot-scope="scope">
                <span> {{scope.row.period.toString()}}{{$t('m.months')}}</span>
              </template>
            </el-table-column>
            <!-- 节点类型 -->
            <el-table-column width="120"  align="center" :label="$t('m.lockasseted.nodetype')">
              <template slot-scope="scope">
                <span> {{$t('m.lockasseted.nodetype' + scope.row.autolock)}}</span>
              </template>
            </el-table-column>
            <!-- 收益比例 -->
            <el-table-column width="120" align="center"  :label="$t('m.lockasseted.interestrate')">
              <template slot-scope="scope">
                <span  v-if="Number(scope.row.rate) > 0">{{Number(scope.row.rate) / 10}}‰</span>
              </template>
            </el-table-column>
            <!-- 创建时间 -->
            <el-table-column width="165" align="center"  :label="$t('m.lockasseted.creattime')">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>
            <!-- 撤仓时间 -->
            <el-table-column width="165" align="center"  :label="$t('m.lockasseted.removetime')">
              <template slot-scope="scope">
               {{ scope.row.remove_time}}
              </template>
            </el-table-column>
            <!-- 锁仓总收益 -->
            <el-table-column align="center"  :label="$t('m.lockasseted.allinterest')">
              <template slot-scope="scope">
                {{scope.row.interest.amount | formatLegalCurrency3('', scope.row.interestprecision)}}
                <span class="symbol_unit">{{scope.row.interestsymbol}}</span>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column width="80" align="center"  :label="$t('m.orderList.operation')">
              <template slot-scope="scope" class="flex-h">
                <el-button type="text" @click="operator(0, scope.row)">{{$t('m.lockasseted.detail')}}</el-button>
              </template>
            </el-table-column>
            <div slot="empty">
              <p>{{$t('m.noData')}}</p>
            </div>
          </el-table>
          <div style="text-align: right">
            <el-pagination background @current-change="handleCurrentChange2" :current-page="listQuery2.page" :page-size="listQuery2.limit" layout="total, prev, pager, next, jumper" :total="total2">
            </el-pagination>
          </div>
        </el-tab-pane>

        </el-tabs>
      </div>

      <!--信息确认-->
      <el-dialog
        :title="$t('m.orderList.HQ')"
        :visible.sync="confirmDialog"
        width="30%"
      >
       <div style="min-height: 10vw;">
        <p>
          <el-row> <el-col :span="4">{{$t('m.lockasseted.lockamount')}}:</el-col>
            <el-col :span="18">{{ruleForm.lockamount | formatLegalCurrency(selectSymbol.symbol, selectSymbol.precision)}} </el-col></el-row>
          <br>
          <el-row> <el-col :span="4">{{$t('m.drawDialog.available')}}:</el-col>
            <el-col :span="18">{{available | formatLegalCurrency(selectSymbol.symbol, selectSymbol.precision)}} </el-col></el-row>
         <el-row> <el-col :span="4">
           {{$t('m.information.coupons')}}:
          </el-col>
            <el-col :span="18">ZOS {{this.$store.state.coupon.amount}}</el-col></el-row>
         <el-row> <el-col :span="4">{{$t('m.borrow.fee')}}:</el-col>
            <el-col :span="18">{{this.feeZos | formatLegalCurrency('ZOS', 5)}} </el-col></el-row>
         <el-row v-if='feed!==1.0'> <el-col :span="4">{{$t('m.lockasseted.feed')}}:</el-col>
           <el-col :span="18" >{{this.feed}} {{selectSymbol.symbol}}/{{selectSymbol.interestsymbol}}</el-col></el-row>
         <el-row> <el-col :span="4">{{$t('m.lockasseted.ratestr')}}:</el-col>
            <el-col :span="18" style="color: red;">{{this.rateString | formatLegalCurrency(selectSymbol.interestsymbol, selectSymbol.interestprecision)}} </el-col></el-row>
          <br>
        </p>
        <p class="text-right">
          <y-button :text="$t('m.cancel')"  @btnClick="confirmDialog = false" ></y-button>
          <y-button :text="$t('m.sure')"  classStyle="main-btn"   @btnClick="borrowSubmit"></y-button>
        </p>
      </div>
     </el-dialog>

      <!--创建-->
      <detaillock  ref="detailLockRef"  :symbol="parameters.asset_name" :precision="parameters.asset_precision" :visible="detailshow" @detailclose='detailclose'></detaillock>
      <changelock  ref="changeLockRef"  :symbol="parameters.asset_name" :precision="parameters.asset_precision" :visible="changeshow" @changeclose='changeclose'></changelock>
      <modifylock  ref="modifyLockRef"  :symbol="parameters.asset_name" :precision="parameters.asset_precision" :visible="modifyshow" @modifyclose='modifyclose'></modifylock>

      <!--前往kyc-->
      <goto-kyc :kycInfo="kycInfo" :kycurl="kycurl" :authorid="curCarrierAccount.lendauthor_account" :kycStatusCode="kycStatusCode" :hintKycDialog="hintKycDialog" :checkinfoDialog="checkinfoDialog" @close="kycclose"></goto-kyc>
      <!--输入资金密码-->
      <password-dialog :visible="comfirmPassword" @bitlenderLendOrder="bitlenderLendOrder" :isAppend="true"></password-dialog>
      </div>
      </div>
</template>
<script>
  import {ZOSInstance} from 'zos-wallet-js'
  import {Apis} from 'zosjs-ws'
  import formatAssets from '/js-api/public'
  import { MessageBox } from 'element-ui'
  import {getStore, setStore} from '/js-utils/storage'
  import {kycStatus} from '/js-api/index'
  import YButton from '/path-components/element/YButton'
  import gotoKyc from '/path-components/KYC'
  import passwordDialog from '/path-components/Login/passwordDialog'
  export default {
    components: {
      'detaillock': () => import('/path-page/locktoken/detaillock'),
      'changelock': () => import('/path-page/locktoken/changelock'),
      'modifylock': () => import('/path-page/locktoken/modifylock'),
      gotoKyc,
      YButton,
      passwordDialog
    },
    data () {
      var vlockamount = (rule, value, callback) => {
        let vari = Number(value)
        let variZos = this.selectSymbol.asset_id === '1.3.0' ? vari : 0
        if (value === '') {
          callback(new Error(this.$t('m.page.inputAmount')))
        } else if (vari < this.lockoptions.locktoken_min) {
          callback(new Error(this.$t('m.lockasseted.minlock') + this.lockoptions.locktoken_min))
        } else if (vari >= this.lockoptions.locktoken_max) {
          callback(new Error(this.$t('m.lockasseted.maxlock') + this.lockoptions.locktoken_max))
        } else if (vari > this.available) {
          callback(new Error(this.$t('m.borrow.useLess') + (vari - this.available)))
        } else if (Number(this.$store.state.coupon.amount) < this.feeZos && variZos + Number(this.feeZos) > this.zos_balance) {
          callback(new Error(this.$t('m.borrow.useLess') + ' ZOS ' + (variZos + Number(this.feeZos) - this.zos_balance)))
        } else {
          callback()
        }
      }
      return {
        ruleForm: {
          lockamount: '',
          period: 1,
          rate: 0,
          mode: 1
        },
        rules: {
          lockamount: [
            {
              required: true, message: this.$t('m.page.inputAmount')
            },
            {
              validator: vlockamount, trigger: 'blur'
            }
          ],
          period: [
            {
              required: true, message: this.$t('m.lockasseted.lockperiod')
            }
          ],
          mode: [
            {
              required: true, message: this.$t('m.lockasseted.lockmode')
            }
          ]
        },
        total1: 0,
        listQuery1: {
          page: 0,
          refresh: 1,
          limit: 10
        },
        refundid1: [],
        refunding1: [
        ],
        total2: 0,
        listQuery2: {
          page: 0,
          refresh: 1,
          limit: 10
        },
        refunding2: [
        ],
        userName: '',
        userId: '',
        start1: 0,
        start2: 0,
        optionlist: [],
        lockmode: 2,
        detailshow: false,
        changeshow: false,
        modifyshow: false,
        parameters: {asset_name: 'ZOS', asset_precision: 5},
        rateInfo: '',
        rateString: '',
        lockoptions: {},
        lockobj: {},
        locksum: {},
        activeTabName: 'first',
        comfirmPassword: false,
        confirmDialog: false,
        refershflag: false,
        operatorrow: {},
        operatortype: 0,
        tr: {},
        kycInfo: null, // kyc
        kycStatusCode: -1,
        hintKycDialog: false,
        checkinfoDialog: false,
        curCarrierAccount: {},
        canAdd: '',
        kycurl: '',
        loading: 0,
        loadsum: true,
        feeZos: 0,
        feed: 1.0,
        subloading: false,
        selectSymbol: {asset_name: 'ZOS', symbol: 'ZOS', precision: 5, interestsymbol: 'ZOS', interestprecision: 5},
        LaystSymbol: '',
        feeObj: {},
        zos_balance: ''
      }
    },
    computed: {
      // 取得当前币种可用余额
      available () {
        let assetsArr = formatAssets.formatAssets(this.selectSymbol.asset_name)
        if (!assetsArr || assetsArr.length === 0) {
          return 0
        } else if (this.selectSymbol.asset_name && assetsArr.length > 0) {
          this.assetId = assetsArr[0].asset_id
          return (assetsArr[0].amount).toFixed(assetsArr[0].precision)
        }
      }
    },
    methods: {
      // 校正输入金额，计算预计利息
      depoValid () {
        if (Number(this.ruleForm.lockamount) >= 0) {
          this.ruleForm.lockamount = this.ruleForm.lockamount.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
          this.ruleForm.lockamount = this.ruleForm.lockamount.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          this.ruleForm.lockamount = this.ruleForm.lockamount.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          let newstr
          if (this.ruleForm.lockamount.indexOf('.') !== -1) { // 如果存在小数点
            var pos = this.ruleForm.lockamount.indexOf('.') // 小数点的位置
            newstr = this.ruleForm.lockamount.substring(pos + 1) // 小数点后面的值
            var yong = this.ruleForm.lockamount.substring(0, pos + 1)
            newstr = newstr.replace(/[^0-9]/ig, '')
            if (newstr.length >= this.selectSymbol.precision + 1) {
              newstr = newstr.substring(0, this.selectSymbol.precision)
            }
            this.ruleForm.lockamount = yong + newstr
          }
        } else {
          this.ruleForm.lockamount = ''
        }
        this.rateString = (Number(this.ruleForm.lockamount) * Number(this.feed) * (Number(this.ruleForm.period)) * Number(this.ruleForm.rate) / (12 * 10000)).toFixed(this.selectSymbol.interestprecision)
      },
      // 获得预计手续费
      feeGet () {
        // if (!this.$store.state.userName) {
        //   return
        // }
        // ZOSInstance.getAboutFee(this.$store.state.userName, '1.3.0', 'locktoken_create')
        //   .then((res) => {
        //     this.feeObj = res
        //     this.feeZos = res.feeAmount.amount / Math.pow(10, res.feeAmount.precision)
        //     this.zos_balance = res.fee_balance / Math.pow(10, res.feeAmount.precision)
        //     this.zos_balance = Number(this.zos_balance).toFixed(res.feeAmount.precision)
        //   })
        //   .catch((error) => {
        //     console.log(error)
        //   })
      },
      // 如果付费币种，不是当前币种，取得价格
      priceGet () {
        this.feed = 1.0
        // if (this.selectSymbol.interestsymbol === this.selectSymbol.symbol || this.selectSymbol.symbol === 'ZOS') return
        // ZOSInstance.getAssetCoreFeed(this.selectSymbol.asset_id, this.selectSymbol.asset_precision, '1.3.0', 5)
        //   .then((res) => {
        //     this.feed = res
        //     console.log('fee', res)
        //   })
        //   .catch((error) => {
        //     console.log(error)
        //   })
      },
      // kyc 信息关闭
      kycclose () {
        this.hintKycDialog = false
        this.checkinfoDialog = false
      },
      // 初始化
      init () {
        if (this.$route.query.accName || this.$route.query.accID) {
          this.userName = this.$route.query.accName
          this.userId = this.$route.query.accID
        } else {
          this.userName = this.$store.state.userName
          this.userId = this.$store.state.userDataSid
        }
        this.loading = 1
        this.feeGet()
        this.getAssetList()
        // this.getData()
        this.loading--
      },
      // 操作后刷新界面
      refersh () {
        this.loading = 1
        this.rateString = ''
        this.ruleForm.lockamount = ''
        this.getData()
        this.loading--
      },
      // 类型
      typeStr (v) {
        if (v === 1) return this.$t('m.orderList.DQ')
        else if (v === 0) return this.$t('m.orderList.HQ')
        else if (v === 2) return this.$t('m.orderList.NODE')
        else return v
      },
      // 模式
      modeStr (v, autolock) {
        if (v === 1) return this.$t('m.lockasseted.lockmode' + autolock)
        else if (v === 2) return this.$t('m.lockasseted.nodetype' + autolock)
        else return ''
      },
      // 取得当前模式下，已经设置好参数的，参数列表
      getAssetList () {
        this.loading++
        Apis.instance().db_api().exec('get_locktoken_options', [this.lockmode, true]).then(res => {
          if (res.length <= 0) {
            this.$message({
              type: 'error',
              message: this.$t('m.lockasseted.nooption')
            })
          } else {
            this.optionlist = res
            this.selectSymbol = res[0]
            let selectSymbol = getStore('lockdySymbol')
            res.forEach(item => {
              if (selectSymbol === item.asset_name) this.selectSymbol = item
            })
            this.selectAsset(this.selectSymbol)
          }
          this.loading--
        }).catch(err => {
          this.loading--
          console.log(err)
          this.$message({
            type: 'warning',
            message: err
          })
        })
      },
      // 列表操作
      operator (v, row) {
        this.operatorrow = row
        this.operatortype = v
        // console.log(row)
        // 删除
        if (v === 2) {
          MessageBox.confirm('', {
            message: row.id + '  ' + this.$t('m.lockasseted.removelock') + ',' + this.$t('m.bankcardInfo.confirm') + '?',
            title: this.$t('m.borrow.note'),
            confirmButtonText: this.$t('m.sure'),
            cancelButtonText: this.$t('m.cancel')
          }).then(action => {
            if (action === 'confirm') {
              this.comfirmPassword = true
            }
          })
        // 详情
        } else if (v === 0 || v === 6) {
          this.$refs.detailLockRef.changeOption(v, row)
          this.detailshow = true
        // 转仓
        } else if (v === 1) {
          Apis.instance().db_api().exec('get_locktoken_option', [row.locked.asset_id, row.type === 1 ? 0 : 1, true]).then(res => {
            if (res) {
              this.parameters = res
              this.$refs.changeLockRef.changeOption(v, this.parameters, row)
              this.changeshow = true
            } else {
              this.$message({
                type: 'warning',
                message: this.$t('m.lockasseted.nooption')
              })
            }
          })
        // 定期修改
        } else if (v === 5) {
          Apis.instance().db_api().exec('get_objects', [[row.option_id]]).then(res => {
            if (res && res.length > 0) {
              this.parameters = res[0]
              this.$refs.modifyLockRef.changeOption(v, this.parameters, row)
              this.modifyshow = true
            }
          })
        // 加减仓
        } else if (v === 3 || v === 4) {
          Apis.instance().db_api().exec('get_objects', [[row.option_id]]).then(res => {
            if (res && res.length > 0) {
              this.parameters = res[0]
              this.$refs.modifyLockRef.changeOption(v, this.parameters, row)
              this.modifyshow = true
            }
          })
        }
      },
      // 取得列表数据
      getData () {
        this.loading++
        ZOSInstance.get_locktoken_ids(this.userId, this.selectSymbol.asset_id, this.lockmode).then(result => {
          this.refundid1 = result
          this.total1 = result.length
          this.listQuery1.page = 0
          this.getList1(this.listQuery1.refresh)
          this.loading--
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
        this.loading++
        ZOSInstance.get_locktoken_history_count(this.userId, this.selectSymbol.asset_id, this.lockmode).then(result => {
          this.total2 = result
          this.listQuery2.page = 0
          this.getList2(this.listQuery2.refresh)
          this.loading--
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
      },
      // 取得统计数据
      getSummers () {
        this.loading++
        this.loadsum = true
        Apis.instance().db_api().exec('get_locktoken_sum', [this.userId, this.selectSymbol.asset_id, 12 + 16]).then(res => {
          this.locksum = res
          this.loading--
          this.loadsum = false
        }).catch(err => {
          this.loading--
          this.loadsum = false
          console.log(err)
          this.$message({
            type: 'warning',
            message: err
          })
        })
      },
      // 原选择器组件 数据
      // selectAsset () {
      //   if (this.LaystSymbol !== this.selectSymbol.asset_name) {
      //     this.LaystSymbol = this.selectSymbol.asset_name
      //     this.selectSymbol.precision = this.selectSymbol.asset_precision
      //     this.selectSymbol.symbol = this.selectSymbol.asset_name
      //     this.selectSymbol.interestprecision = this.selectSymbol.interest_precision
      //     this.selectSymbol.interestsymbol = this.selectSymbol.interest_name
      //     setStore('lockdySymbol', this.selectSymbol.asset_name)
      //     this.rateInfo = ''
      //     Apis.instance().db_api().exec('get_locktoken_option', [this.selectSymbol.asset_id, this.lockmode, true]).then(res => {
      //       this.lockoptions = res.lockoptions
      //       this.lockobj = res
      //       if (this.lockoptions) {
      //         this.lockoptions.locktoken_rates.forEach(item => {
      //           this.rateInfo += (item[1][0][1] / 10) + '‰' + '/' + this.$t('m.year')
      //           this.ruleForm.rate = item[1][0][1]
      //         })
      //       }
      //       this.lockoptions.locktoken_max /= Math.pow(10, this.selectSymbol.precision)
      //       this.lockoptions.locktoken_min /= Math.pow(10, this.selectSymbol.precision)
      //       this.lockoptions.locktoken_max = this.lockoptions.locktoken_max.toFixed(this.selectSymbol.precision)
      //       this.lockoptions.locktoken_min = this.lockoptions.locktoken_min.toFixed(this.selectSymbol.precision)
      //       this.ruleForm.lockamount = ''
      //       this.rateString = '0.0'
      //       this.priceGet()
      //       this.getSummers()
      //       this.initCarrier()
      //       this.refershflag = true
      //       this.getData()
      //     }).catch(err => {
      //       console.log(err)
      //       this.$message.error({
      //         message: err
      //       })
      //     })
      //   }
      // },
      // 更换下拉菜单组件 数据
      selectAsset (command) {
        if (this.LaystSymbol !== command.asset_name) {
          this.LaystSymbol = command.asset_name
          this.selectSymbol.precision = command.asset_precision
          this.selectSymbol.symbol = command.asset_name
          this.selectSymbol.interestprecision = command.interest_precision
          this.selectSymbol.interestsymbol = command.interest_name
          setStore('lockdySymbol', command.asset_name)
          this.rateInfo = ''
          Apis.instance().db_api().exec('get_locktoken_option', [this.selectSymbol.asset_id, this.lockmode, true]).then(res => {
            this.lockoptions = res.lockoptions
            this.lockobj = res
            if (this.lockoptions) {
              this.lockoptions.locktoken_rates.forEach(item => {
                this.rateInfo += (item[1][0][1] / 10) + '‰' + '/' + this.$t('m.year')
                this.ruleForm.rate = item[1][0][1]
              })
            }
            this.lockoptions.locktoken_max /= Math.pow(10, this.selectSymbol.precision)
            this.lockoptions.locktoken_min /= Math.pow(10, this.selectSymbol.precision)
            this.lockoptions.locktoken_max = this.lockoptions.locktoken_max.toFixed(this.selectSymbol.precision)
            this.lockoptions.locktoken_min = this.lockoptions.locktoken_min.toFixed(this.selectSymbol.precision)
            this.ruleForm.lockamount = ''
            this.rateString = '0.0'
            this.priceGet()
            this.getSummers()
            this.initCarrier()
            this.refershflag = true
            this.getData()
          }).catch(err => {
            console.log(err)
            this.$message.error({
              message: err
            })
          })
        }
      },
      // 判断 kyc
      isAuthenticator () {
        console.log(this.curCarrierAccount)
        Apis.instance().db_api().exec('is_authenticator', [this.$store.state.userDataSid, 7, this.assetId, this.curCarrierAccount.lendaccount]).then(status => {
          if (status === 2000) {
            this.kycInfo = {}
            this.kycInfo.name = undefined
            this.comfirmPassword = true
          } else if (status === -5) {
            this.$message({
              message: this.$t('m.kyc.statues5') + ' name: ' + this.curCarrierAccount.lendauthor_name + ' asset: ' + this.symbol,
              type: 'error'
            })
            this.comfirmPassword = false
          } else {
            if (this.curCarrierAccount.lendauthor_url === '' || this.curCarrierAccount.lendauthor_url === undefined) {
              this.$message({
                message: this.$t('m.params.noAuthor') + ' url ' + this.curCarrierAccount.lendauthor_url,
                type: 'error'
              })
              this.comfirmPassword = false
            } else {
              this.kycurl = this.curCarrierAccount.lendauthor_url
              kycStatus(this.kycurl + '/zos-kyc/', {chainid: this.$store.state.userDataSid, authorid: this.curCarrierAccount.lendauthor_account}).then(res => {
                this.kycStatusCode = res.ret_code
                if (status > 0) {
                  this.kycInfo = {}
                  this.kycInfo.name = res.name
                  this.comfirmPassword = true
                } else {
                  this.comfirmPassword = false
                  if (res.ret_code === '0' || res.ret_code === '1') {
                    this.kycInfo = {}
                    this.kycInfo.name = res.name
                    this.kycInfo.ictype = res.ictype
                    this.kycInfo.icno = res.icno
                    this.checkinfoDialog = true
                    this.kycInfo.chainstatus = this.$t('m.kyc.statues' + Math.abs(status))
                  } else {
                    this.hintKycDialog = true
                  }
                }
              }).catch(err => {
                console.log(err)
                this.$message({
                  message: this.$t('m.httpUtils.warning') + ' url: ' + this.curCarrierAccount.lendauthor_url + ' error: ' + err,
                  type: 'error'
                })
              })
            }
          }
        }).catch(err => {
          console.log(err)
          this.$message({
            message: this.$t('m.httpUtils.warning') + err,
            type: 'error'
          })
        })
      },
      // 初始化运营商参数
      initCarrier () {
        this.canAdd = 'initCarrier'
        // console.log(this.selectSymbol)
        if (this.selectSymbol.lockoptions.carrier === '1.2.0' || this.selectSymbol.lockoptions.carrier === undefined) {
          this.canAdd = 'no carrier '
        } else if (this.selectSymbol.lockoptions.payer === '1.2.0' || this.selectSymbol.lockoptions.payer === undefined) {
          this.canAdd = 'no payer '
        } else {
          Apis.instance().db_api().exec('get_carrier_by_account', [this.selectSymbol.lockoptions.carrier]).then(res => {
            if (!res) {
              this.canAdd = 'no carrier account'
            } else {
              Apis.instance().db_api().exec('get_carrier_cfg', [res.id, this.assetId]).then(res1 => {
                this.canAdd = ''
                this.curCarrierAccount = res1
              }).catch(err => {
                console.log(err)
                this.canAdd = err.msg
              })
            }
          }).catch(err => {
            console.log(err)
            this.canAdd = err.msg
          })
        }
      },
      // 确认成功
      borrowSubmit () {
        this.operatortype = 9
        this.confirmDialog = false
        this.isAuthenticator()
      },
      // 创建订单
      createitem (v) {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (this.canAdd !== '') {
              this.$message({
                message: this.canAdd,
                type: 'error'
              })
              return
            }
            this.operatortype = 9
            this.confirmDialog = true
          }
        })
      },
      // 操作窗口关闭
      detailclose () {
        this.detailshow = false
      },
      changeclose (v) {
        let _self = this
        this.changeshow = false
        setTimeout(function () {
          _self.operatorclose(true)
        }, 4000)
      },
      modifyclose (v) {
        let _self = this
        this.modifyshow = false
        this.refershflag = true
        setTimeout(function () {
          _self.operatorclose(true)
        }, 4000)
      },
      addclose (v) {
        let _self = this
        this.addshow = false
        setTimeout(function () {
          _self.operatorclose(true)
        }, 4000)
      },
      operatorclose (v) {
        this.refershflag = true
        this.listQuery1.refresh = this.listQuery1.page
        this.listQuery1.page = 0
        this.listQuery2.refresh = this.listQuery2.page
        this.listQuery2.page = 0
        if (v) this.refersh()
      },
      // 切换列表页
      getList1 (v) {
        if (this.listQuery1.page === v) return
        this.listQuery1.page = v
        if (v === 1) {
          this.start1 = 0
        } else {
          this.start1 = (this.listQuery1.page - 1) * this.listQuery1.limit
        }
        if (this.total1 <= 0) {
          this.refunding1 = []
          return
        }
        this.loading++
        let ids = this.refundid1.slice(this.start1, this.start1 + this.listQuery1.limit)
        ZOSInstance.get_locktoken_objects(ids).then(result => {
          this.refunding1 = result
          this.loading--
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
      },
      // 切换列表页
      getList2 (v) {
        if (this.listQuery2.page === v) return
        this.listQuery2.page = v
        if (v === 1) {
          this.start2 = 0
        } else {
          this.start2 = (this.listQuery2.page - 1) * this.listQuery2.limit
        }
        if (this.total2 <= 0) {
          this.refunding2 = []
          return
        }
        this.loading++
        ZOSInstance.get_locktoken_history(this.userId, this.selectSymbol.asset_id, this.lockmode, this.start2, this.listQuery2.limit).then(result => {
          this.refunding2 = result
          this.loading--
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
      },
      handleCurrentChange1 (val) {
        if (this.listQuery1.page === val) return
        this.getList1(val)
      },
      handleCurrentChange2 (val) {
        if (this.listQuery2.page === val) return
        this.getList2(val)
      },
      // 创建操作 trx
      bitlenderLendOrder (data) {
        this.comfirmPassword = false
        if (data) {
          // 撤仓
          if (this.operatortype === 2) {
            this.subloading = true
            ZOSInstance.locktoken_remove(this.$store.state.userDataSid, this.operatorrow.id)
              .then(res => {
                this.tr = res.tr
                this.feeZos = res.fee.fee_amount / Math.pow(10, res.fee.fee_precision)
                this.dataSubmit()
              })
              .catch((err) => {
                this.subloading = false
                console.log(err)
              })
          // 创建
          } else if (this.operatortype === 9) {
            this.subloading = true
            ZOSInstance.locktoken_create(this.$store.state.userDataSid, this.$store.state.admin_id, this.selectSymbol.asset_id, this.ruleForm.lockamount * Math.pow(10, this.selectSymbol.asset_precision), this.ruleForm.period, this.lockmode, this.ruleForm.mode)
              .then(res => {
                this.tr = res.tr
                this.feeZos = res.fee.fee_amount / Math.pow(10, res.fee.fee_precision)
                this.dataSubmit()
              }).catch((err) => {
                this.subloading = false
                console.log(err)
              })
          }
          // 转仓
        } else {
        }
      },
      // 发送上链
      dataSubmit () {
        let _self = this
        // 处理广播
        ZOSInstance.broadcastTransaction(this.tr)
          .then((res) => {
            this.subloading = false
            // '提交成功'
            this.$message({
              type: 'success',
              // '提交成功'
              message: this.$t('m.badloans.subSucc')
            })
            // 链上反应需要时间
            setTimeout(function () {
              _self.operatorclose(true)
            }, 4000)
            this.operatortype = -1
          })
          .catch((err) => {
            this.subloading = false
            console.log(err)
            this.$message({
              message: err,
              type: 'error'
            })
          })
      }
    },
    destroyed () {
    },
    mounted () {
      if (this.$store.state.initFinished) {
        this.init()
      } else {
        this.$root.$on('initFinished', (data) => {
          this.init()
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  @import '../../theme/utils';
  @import '../../theme/theme';
  .dropdown_style{
    color: rgba(45,51,74,1);
    border-color: rgba(243,244,249,1);
    background: rgba(243,244,249,1);
                     
  }
  .btn_small{
    padding: 9px 5px;
    margin-left: 2px;
  }
  .bFuKMc{
    height: 54px;
    padding: 0px 20px;
    border-bottom: 1px solid rgb(218, 225, 233);
  }
  .ZHZZL{
    // position: relative;
    height: 160px;
  }
  .width-100 {
    min-width: 600px;
    color: rgb(199, 51, 51);
  }
  .el-header, .el-footer {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    line-height: 60px;
    flex: 0 0 54px;
    padding: 0px 20px;
    border-bottom: 1px solid rgb(218, 225, 233);
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }
  a, [role="button"] {
    cursor: pointer;
    color: rgb(6, 103, 208);
    text-decoration: none;
  }
  .jvhNys {
    flex: 0 0 calc(100vh - 200px);
  }
  .UMJSF {
    background-color: rgb(244, 247, 250);
  }
  .VsGOO {
    -webkit-box-align: center;
    align-items: center;
    flex-direction: column;
    flex: 1 1 auto;
  }

  .layout {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .dy_head{
      display:flex;
      margin-bottom: 30px;
      .dy_head_item{
        flex: 1;
        .el-form-item{
          margin: 0;
        }
      }
    }
    .dy_main{
      .el-row{
        margin: 0 0 15px 0;
      }
      .title_info{
        color:#191A5E;
        font-size:14px;
        font-weight:500;
        font-family:PingFangSC-Medium,PingFangSC;
        .el-tooltip{
          color:#B7BEC6;
        }
      }
      .num_info{
        color:#31364F;
        font-size:14px;
        font-weight:400;
        font-family:PingFangSC-Regular,PingFangSC;
      }
    }
    .dy_btn{
      height:50px;
      line-height: 50px;
      text-align: center;
      border-radius:25px;
      color: #fff;
      border:#5D5DFF;
      background:#5D5DFF;
    }
    .dy_right{
      flex:1;
      margin:24px 0 24px 24px;
    }
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

   .box-card-left{
    // flex: 1;
    margin: 24px 0;
    width: 60%;
  }
  .btn-group-account{
    position: absolute; bottom: 10px; right:20px
  }
  #dialog-account .el-dialog__body{
    overflow: auto !important;
    height: 60vh !important;
  }
  .account .el-card{
    background: #fff!important;
  }
  .update-recode-btn{
    position: absolute;
    top: 5px;
    right: 50px;
    height: 30px;
    width: 80px;
  }
  .symbol_unit{
    display:inline-block;
    // width:34px;
    padding: 0 2px;
    height:16px;
    line-height:16px;
    text-align:center;
    color:#65A3F6;
    font-size:8px;
    border-radius:2px;
    background:rgba(232,242,254,1);
    border:1px solid rgba(231,241,253,1);
    font-family:Helvetica-Bold,Helvetica;
  }
  .el-tooltip{
    color:#B7BEC6;
  }
</style>
