<template>
  <div v-loading="loading>0" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
    <h1 class="feel" style="align-items: center">
      <span class="f16">{{$t('m.params.admin')}}: {{administrator}}</span>
      <span style="flex:1"></span>
      <div v-if="permissions">
        <el-button type="primary" @click="submit" v-show="isInput">{{$t('m.params.submit')}}</el-button>
      </div>
    </h1>
    <div class="line" style="margin: 15px 0px;height: 2px"></div>
    <div class="wrap"  v-if="loading<=0">
      <el-tabs v-model="activeTabName">
        <el-tab-pane :label="$t('m.params.operator')" name="first">
          <div class="feel margin-t40" style="align-items: center" v-if="permissions">
            <span class="margin-l10" style="width: 120px">{{$t('m.orderList.bitType')}}:</span>
            <el-select
              v-model="cashSymbol"
              value-key="id"
              :placeholder="$t('m.transfer.XZBZ')"
              class="margin-l10"
            >
              <el-option
                v-for="item in cList"
                :key="item.id"
                :label="item.symbol"
                :disabled="item.disabled"
                :value="item">
              </el-option>
            </el-select>
            <el-button type="primary" style="margin-left: 10px" :disabled="addDisabled" @click="addRatioInput">{{$t('m.params.addFeeder')}}</el-button>
            <span style="flex: 1"></span>

          </div>

          <el-table
            :data="carriersData"
            style="width: 90%">
            <el-table-column
              prop="param"
              :label="$t('m.orderList.bitType')"
              width="120">
            </el-table-column>
            <el-table-column
              prop="cashCarrier"
              :label="$t('m.params.loanCarrier')"
              width="200">
              <template slot-scope="scope">
                <el-select v-model="scope.row.cashCarrier.lendCarrier" :placeholder="$t('m.pChose')" v-if="permissions">
                  <el-option
                    v-for="item in scope.row.cashCarrier.carrierList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <span v-if="!permissions">{{scope.row.cashCarrier.lendCarrier}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="lendCarrier"
              :label="$t('m.params.investCarrier')"
              width="200">
              <template slot-scope="scope">
                <el-select v-model="scope.row.lendCarrier.investCarrier" :placeholder="$t('m.pChose')" v-if="permissions">
                  <el-option
                    v-for="item in scope.row.lendCarrier.carrierList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <span v-if="!permissions">{{scope.row.lendCarrier.investCarrier}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="ratio"
              :label="$t('m.borrow.radio')"
            >
              <template slot-scope="scope">
          <span v-for="(item, key) in scope.row.ratio" :key="key">
            {{key}}: {{item}}
          </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('m.orderList.operation')" v-if="permissions" width="180">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">{{$t('m.params.del')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="$t('m.params.gateway')" name="second">
          <!--<span style="width: 120px">{{$t('m.params.chooseGateway')}}:</span>-->
          <!--<el-select v-model="gateway" multiple :placeholder="$t('m.transfer.QXZ')" class="margin-l10"-->
                     <!--:disabled="!permissions">-->
            <!--<el-option-->
              <!--v-for="item in gatewayList"-->
              <!--:key="item[1]"-->
              <!--:label="item[0]"-->
              <!--:value="item[0]">-->
            <!--</el-option>-->
          <!--</el-select>-->



          <div class="feel margin-t40" style="align-items: center">
            <span class="margin-l10" style="width: 120px">{{$t('m.orderList.bitType')}}:</span>
            <el-select
              v-model="cashSymbolGateway"
              value-key="id"
              :placeholder="$t('m.transfer.XZBZ')"
              class="margin-l10"
              v-if="permissions"
            >
              <el-option
                v-for="item in cListGateway"
                :key="item.id"
                :label="item.symbol"
                :disabled="item.disabled"
                :value="item">
              </el-option>
            </el-select>
            <el-button type="primary" style="margin-left: 10px" v-if="permissions" :disabled="addDisabledGateway" @click="addRatioInputGateway">{{$t('m.params.addFeeder')}}</el-button>
            <span style="flex: 1"></span>

          </div>

          <el-table
            :data="gatewaysData"
            style="width: 90%">
            <el-table-column
              prop="param"
              :label="$t('m.orderList.bitType')"
              width="120">
            </el-table-column>
            <el-table-column
              prop="cashCarrier"
              :label="$t('m.params.gateway')"
              width="280">
              <template slot-scope="scope">
                <el-select v-model="scope.row.gateway" :placeholder="$t('m.pChose')" v-if="permissions">
                  <el-option
                    v-for="item in scope.row.gatewayList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <span v-if="!permissions">{{scope.row.gateway}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('m.orderList.operation')" v-if="permissions">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDeleteGateway(scope.$index, scope.row)">{{$t('m.params.del')}}</el-button>
              </template>
            </el-table-column>
          </el-table>


        </el-tab-pane>
        <!--<el-tab-pane :label="$t('m.params.author')" name="three">-->
          <!--<div class="feel margin-t40 margin-l10" style="align-items: center">-->
            <!--<span style="width: 120px">{{$t('m.params.chooseAuthor')}}:</span>-->
            <!--<el-select-->
              <!--v-model="author"-->
              <!--multiple-->
              <!--:placeholder="$t('m.transfer.QXZ')"-->
              <!--class="margin-l10"-->
              <!--:disabled="!permissions"-->
            <!--&gt;-->
              <!--<el-option-->
                <!--v-for="item in authorList"-->
                <!--:key="item[1]"-->
                <!--:label="item[0]"-->
                <!--:value="item[0]">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</div>-->
        <!--</el-tab-pane>-->
        <el-tab-pane :label="$t('m.params.theme')" name="four">
          <div class="feel margin-t40 margin-l10" style="align-items: center">
            <span style="width: 120px">{{$t('m.params.chooseTheme')}}:</span>
            <el-select v-model="chooseTheme" :placeholder="$t('m.transfer.QXZ')" class="margin-l10"
                       :disabled="!permissions">
              <el-option
                v-for="(item,index) in ($store.state.lang === '1' ? themeList : themeListEn)"
                :key="index"
                :label="item.name"
                :value="item.styles">
              </el-option>
            </el-select>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('m.params.carrierCount')" name="five">
          <div class="feel margin-t40" style="align-items: center">
            <span class="margin-l10" style="width: 120px">{{$t('m.params.chooseCarrier')}}:</span>
            <el-select
              v-model="carriersDym"
              value-key="id"
              :placeholder="$t('m.pChose')"
              class="margin-l10"
              @change="_carriersDym"
            >
              <el-option
                v-for="item in carriersDymList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="feel" style="align-items: center">
            <el-table
              :data="dynamicData"
              style="width: 100%">
              <el-table-column
                prop="name"
                :label="$t('m.params.operator')"
              >
              </el-table-column>
              <el-table-column
                prop="loan"
                :label="$t('m.mustLoan')"
              >
                <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.loan" :key="index">
              {{item.symbol}}: {{item.amount}}<br>
            </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="invest"
                :label="$t('m.toInvest')"
              >
                <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.invest" :key="index">
              {{item.symbol}}: {{item.amount}}<br>
            </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="risk"
                :label="$t('m.borrow.risk')"
              >
                <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.risk" :key="index">
              {{item.symbol}}: {{item.amount}}<br>
            </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="fee"
                :label="$t('m.borrow.fee')"
              >
                <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.fee" :key="index">
              {{item.symbol}}: {{item.amount}}<br>
            </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="recycle"
                :label="$t('m.params.recovery')"
              >
                <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.recycle" :key="index">
              {{item.symbol}}: {{item.amount}}<br>
            </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="recycleloan"
                :label="$t('m.params.taste')"
              >
                <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.recycleloan" :key="index">
              {{item.symbol}}: {{item.amount}}<br>
            </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!--<h1 class="fw">{{$t('m.params.operator')}}</h1>-->
      <!--<div class="line" style="margin: 15px 0px;"></div>-->
      <!--<div class="feel margin-t40" style="align-items: center">-->
        <!--<span class="margin-l10" style="width: 120px">{{$t('m.orderList.bitType')}}:</span>-->
        <!--<el-select-->
          <!--v-model="cashSymbol"-->
          <!--value-key="id"-->
          <!--:placeholder="$t('m.transfer.XZBZ')"-->
          <!--class="margin-l10"-->
          <!--v-if="permissions"-->
        <!--&gt;-->
          <!--<el-option-->
            <!--v-for="item in cList"-->
            <!--:key="item.id"-->
            <!--:label="item.symbol"-->
            <!--:disabled="item.disabled"-->
            <!--:value="item">-->
          <!--</el-option>-->
        <!--</el-select>-->
        <!--<el-button type="primary" style="margin-left: 10px" v-if="permissions" :disabled="addDisabled" @click="addRatioInput">{{$t('m.params.addFeeder')}}</el-button>-->
        <!--<span style="flex: 1"></span>-->

      <!--</div>-->

      <!--<el-table-->
        <!--:data="carriersData"-->
        <!--style="width: 90%">-->
        <!--<el-table-column-->
          <!--prop="param"-->
          <!--:label="$t('m.orderList.bitType')"-->
          <!--width="120">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="cashCarrier"-->
          <!--:label="$t('m.params.loanCarrier')"-->
          <!--width="200">-->
          <!--<template slot-scope="scope">-->
            <!--<el-select v-model="scope.row.cashCarrier.lendCarrier" :placeholder="$t('m.pChose')" v-if="permissions">-->
              <!--<el-option-->
                <!--v-for="item in scope.row.cashCarrier.carrierList"-->
                <!--:key="item"-->
                <!--:label="item"-->
                <!--:value="item">-->
              <!--</el-option>-->
            <!--</el-select>-->
            <!--<span v-if="!permissions">{{scope.row.cashCarrier.lendCarrier}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="lendCarrier"-->
          <!--:label="$t('m.params.investCarrier')"-->
          <!--width="200">-->
          <!--<template slot-scope="scope">-->
            <!--<el-select v-model="scope.row.lendCarrier.investCarrier" :placeholder="$t('m.pChose')" v-if="permissions">-->
              <!--<el-option-->
                <!--v-for="item in scope.row.cashCarrier.carrierList"-->
                <!--:key="item"-->
                <!--:label="item"-->
                <!--:value="item">-->
              <!--</el-option>-->
            <!--</el-select>-->
            <!--<span v-if="!permissions">{{scope.row.lendCarrier.investCarrier}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="ratio"-->
          <!--:label="$t('m.borrow.radio')"-->
        <!--&gt;-->
          <!--<template slot-scope="scope">-->
          <!--<span v-for="(item, key) in scope.row.ratio" :key="key">-->
            <!--{{key}}: {{item}}-->
          <!--</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column :label="$t('m.orderList.operation')" v-if="permissions" width="180">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button-->
              <!--size="mini"-->
              <!--type="danger"-->
              <!--@click="handleDelete(scope.$index, scope.row)">{{$t('m.params.del')}}</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
      <!--</el-table>-->

      <!--<h1 class="fw margin-t40">{{$t('m.set.permission')}}</h1>-->
      <!--<div class="line" style="margin: 15px 0px;"></div>-->
      <!--<div class="feel margin-t40 margin-l10" style="align-items: center">-->
        <!--<span style="width: 120px">{{$t('m.params.chooseGateway')}}:</span>-->
        <!--<el-select v-model="gateway" multiple :placeholder="$t('m.transfer.QXZ')" class="margin-l10"-->
                   <!--v-if="permissions">-->
          <!--<el-option-->
            <!--v-for="item in gatewayList"-->
            <!--:key="item[1]"-->
            <!--:label="item[0]"-->
            <!--:value="item[0]">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</div>-->
      <!--<div class="feel margin-t40 margin-l10" style="align-items: center">-->
        <!--<span style="width: 120px">{{$t('m.params.chooseAuthor')}}:</span>-->
        <!--<el-select-->
          <!--v-model="author"-->
          <!--multiple-->
          <!--:placeholder="$t('m.transfer.QXZ')"-->
          <!--class="margin-l10"-->
          <!--v-if="permissions"-->
        <!--&gt;-->
          <!--<el-option-->
            <!--v-for="item in authorList"-->
            <!--:key="item[1]"-->
            <!--:label="item[0]"-->
            <!--:value="item[0]">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</div>-->
      <!--<h1 class="fw margin-t40">{{$t('m.params.theme')}}</h1>-->
      <!--<div class="line" style="margin: 15px 0px;"></div>-->
      <!--<div class="feel margin-t40 margin-l10" style="align-items: center">-->
        <!--<span style="width: 120px">{{$t('m.params.chooseTheme')}}:</span>-->
        <!--<el-select v-model="chooseTheme" :placeholder="$t('m.transfer.QXZ')" class="margin-l10"-->
                   <!--v-if="permissions">-->
          <!--<el-option-->
            <!--v-for="(item,index) in themeList"-->
            <!--:key="index"-->
            <!--:label="item.name"-->
            <!--:value="item.styles">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</div>-->
      <!--<h1 class="fw margin-t40">{{$t('m.params.carrierCount')}}</h1>-->
      <!--<div class="line" style="margin: 15px 0px;"></div>-->
      <!--<div class="feel margin-t40" style="align-items: center">-->
        <!--<span class="margin-l10" style="width: 120px">{{$t('m.params.chooseCarrier')}}:</span>-->
        <!--<el-select-->
          <!--v-model="carriersDym"-->
          <!--value-key="id"-->
          <!--:placeholder="$t('m.pChose')"-->
          <!--class="margin-l10"-->
          <!--@change="_carriersDym"-->
        <!--&gt;-->
          <!--<el-option-->
            <!--v-for="item in carriersDymList"-->
            <!--:key="item"-->
            <!--:label="item"-->
            <!--:value="item">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</div>-->
      <!--<div class="feel" style="align-items: center">-->
        <!--<el-table-->
          <!--:data="dynamicData"-->
          <!--style="width: 100%">-->
          <!--<el-table-column-->
            <!--prop="name"-->
            <!--:label="$t('m.params.operator')"-->
          <!--&gt;-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="loan"-->
            <!--:label="$t('m.mustLoan')"-->
          <!--&gt;-->
            <!--<template slot-scope="scope">-->
            <!--<span v-for="item in scope.row.loan">-->
              <!--{{item.symbol}}: {{item.amount}}<br>-->
            <!--</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="invest"-->
            <!--:label="$t('m.toInvest')"-->
          <!--&gt;-->
            <!--<template slot-scope="scope">-->
            <!--<span v-for="item in scope.row.invest">-->
              <!--{{item.symbol}}: {{item.amount}}<br>-->
            <!--</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="risk"-->
            <!--:label="$t('m.borrow.risk')"-->
          <!--&gt;-->
            <!--<template slot-scope="scope">-->
            <!--<span v-for="item in scope.row.risk">-->
              <!--{{item.symbol}}: {{item.amount}}<br>-->
            <!--</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="fee"-->
            <!--:label="$t('m.borrow.fee')"-->
          <!--&gt;-->
            <!--<template slot-scope="scope">-->
            <!--<span v-for="item in scope.row.fee">-->
              <!--{{item.symbol}}: {{item.amount}}<br>-->
            <!--</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="recycle"-->
            <!--:label="$t('m.params.recovery')"-->
          <!--&gt;-->
            <!--<template slot-scope="scope">-->
            <!--<span v-for="item in scope.row.recycle">-->
              <!--{{item.symbol}}: {{item.amount}}<br>-->
            <!--</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="recycleloan"-->
            <!--:label="$t('m.params.taste')"-->
          <!--&gt;-->
            <!--<template slot-scope="scope">-->
            <!--<span v-for="item in scope.row.recycleloan">-->
              <!--{{item.symbol}}: {{item.amount}}<br>-->
            <!--</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
        <!--</el-table>-->
      <!--</div>-->
    </div>

    <confirm-dialog :carrierVisible="carrierVisible" @submitCarrier="submitCarrier" :carrierUpdate="updateContents"></confirm-dialog>
    <!--输入资金密码-->
    <password-dialog :visible="confirmVisible" @bitlenderLendOrder="confirmUpdateCarrier"></password-dialog>


    <!--确认离开此页面？-->
    <el-dialog
      :title="$t('m.borrow.note')"
      :visible.sync="confirmLeaveVisible"
      width="30%"
    >
      <span>{{$t('m.borrow.giveupSure')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isConfirm = false;confirmLeave()">{{$t('m.cancel')}}</el-button>
        <el-button type="primary" @click="isConfirm = true;confirmLeave()">{{$t('m.sure')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {ZOSInstance} from 'zos-wallet-js'
  import passwordDialog from '/path-components/Login/passwordDialog'
  import {Apis} from 'zosjs-ws'
  import confirmDialog from '/path-components/Admin/confirmDialog'
  import deepClone from '/js-utils/deepClone'
  import {toggleClass} from '/js-utils/until'
  import { getLocalStore, isTheme } from '/js-utils/storage'
  export default {
    components: {passwordDialog, confirmDialog},
    data () {
      return {
        loading: true,
        administrator: '',
        cList: [],
        cashSymbol: {},
        cListGateway: [],
        cashSymbolGateway: {},
        gatewaysData: [],
        carriersData: [],
        ratioSelect: false,
        cashCarrier: '',
        lendCarrier: '',
        isInput: true,
        confirmVisible: false,
        config: {},
        del: [],
        updates: [],
        updateContent: [],
        updateContents: {},
        resetVisible: false,
        isConfirm: true,
        carrierVisible: false,
        isSubmit: true,
        id: '',
        copycList: [],
        copycListGateway: [],
        carrierAdmin: false,
        isModified: false,
        confirmLeaveVisible: false,
        // 运营商列表
        carriersDymList: [],
        carriersDym: '',
        dynamicData: [],
        // 网关
        gatewayList: [],
        authorList: [],
        copyGateway: [],
        copyAuthor: [],
        gateway: [],
        author: [],
        isGateway: true,
        isAuthor: true,
        chooseTheme: '',
        userTheme: '1a1d5c',
        newConfig: '',
        themeList: [
          {name: '蓝色', styles: '1a1d5c'},
          // {name: '绿色', styles: '1a2d5c'},
          {name: '红色', styles: '95262b'},
          {name: '用户自定义', styles: ''}
        ],
        themeListEn: [
          {name: 'Blue', styles: '1a1d5c'},
          // {name: 'Green', styles: '1a2d5c'},
          {name: 'Red', styles: '95262b'},
          {name: 'User Setting', styles: ''}
        ],
        // Tab标签切换
        activeTabName: 'first'
      }
    },
    watch: {
      chooseTheme: {
        handler: function (val, newVal) {
          if (isTheme(this.chooseTheme)) {
            toggleClass(document.body, 'theme-' + this.chooseTheme)
          } else {
            toggleClass(document.body, 'theme-' + this.userTheme)
          }
        },
        deep: true
      }
    },
    computed: {
      // 权限，是否可以修改
      permissions () {
        if ((this.$store.state.userDataSid === this.$store.state.admin_id) && this.$store.state.login) {
          return true
        } else {
          return false
        }
      },
      addDisabled () {
        if (this.cashSymbol.id === undefined) {
          return true
        } else {
          return false
        }
      },
      addDisabledGateway () {
        if (this.cashSymbolGateway.id === undefined) {
          return true
        } else {
          return false
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      if (this.permissions) {
        this.asyncUpdate(next)
      } else {
        next()
      }
    },
    methods: {
      // 确认是否离开
      confirmLeave () {
        this.confirmLeaveVisible = false
        if (this.nexts === 1) {
          if (this.isConfirm) {
            this.init()
          }
          this.nexts = ''
        } else {
          if (this.isConfirm) {
            this.nexts()
          } else {
            this.nexts(false)
          }
        }
      },
      async asyncUpdate (next) {
        await this.isUpdate()
        await this.isUpdateGateway()
        if (this.isModified) {
          // '您确定离开此页面?' '提示'
          this.nexts = next
          this.confirmLeaveVisible = true
        } else {
          next()
        }
      },
      _listUpdate (index, data) {
        return new Promise((resolve, reject) => {
          let listUpdate = false
          Apis.instance().db_api().exec('get_account_config', [this.$store.state.admin_id, [index]]).then(res => {
            if (res && res[0]) {
              let config = JSON.parse(res[0])
              if (data.length < 1) {
                listUpdate = true
              } else {
                if (config.sort().toString() === data.sort().toString()) {
                  listUpdate = false
                } else {
                  listUpdate = true
                }
              }
            } else {
              if (data.length < 1) {
                listUpdate = false
              } else {
                listUpdate = true
              }
            }
            return resolve(listUpdate)
          })
        })
      },
      // 检查用户是否有修改
      isUpdate () {
        return new Promise((resolve, reject) => {
          Apis.instance().db_api().exec('get_account_config', [this.$store.state.userDataSid, ['carrierList']]).then(res => {
            if (res && res[0]) {
              if (this.carriersData.length < 1) {
                this.isModified = true
              } else {
                let ob = {}
                this.carriersData.forEach(val => {
                  ob[val.param] = {}
                  ob[val.param]['lendCarrier'] = {}
                  ob[val.param]['lendCarrier'] = val.cashCarrier.lendCarrier
                  ob[val.param]['investCarrier'] = val.lendCarrier.investCarrier
                })
                if (res[0] !== JSON.stringify(ob)) {
                  this.isModified = true
                } else {
                  this.isModified = false
                }
              }
            } else {
              if (this.carriersData.length < 1) {
                this.isModified = false
              } else {
                this.isModified = true
              }
            }
            return resolve(this.isModified)
          })
        })
      },
      // 检查用户是否有修改
      isUpdateGateway () {
        return new Promise((resolve, reject) => {
          Apis.instance().db_api().exec('get_account_config', [this.$store.state.userDataSid, ['gatewayList']]).then(res => {
            if (res && res[0]) {
              if (this.gatewaysData.length < 1) {
                this.isModified = true
              } else {
                let ob = {}
                this.gatewaysData.forEach(val => {
                  ob[val.param] = {}
                  ob[val.param] = val.gateway
                })
                if (res[0] !== JSON.stringify(ob)) {
                  this.isModified = true
                } else {
                  this.isModified = false
                }
              }
            } else {
              if (this.gatewaysData.length < 1) {
                this.isModified = false
              } else {
                this.isModified = true
              }
            }
            return resolve(this.isModified)
          })
        })
      },
      // 是否是运营商,异步
      asyncFn (rowSymbol) {
        return new Promise((resolve, reject) => {
          let lendid = {}
          let investid = {}
          Apis.instance().db_api().exec('get_account_by_name', [rowSymbol.cashCarrier.lendCarrier]).then((account) => {
            if (!account) {
              this.$message({
                message: rowSymbol.cashCarrier.lendCarrier + this.$t('m.historyinfo.noAccount'),
                type: 'warning'
              })
            } else {
              lendid = account.id
            }
            return Apis.instance().db_api().exec('get_account_by_name', [rowSymbol.lendCarrier.investCarrier])
          }).then(acc => {
            if (!acc) {
              this.$message({
                message: rowSymbol.lendCarrier.investCarrier + this.$t('m.historyinfo.noAccount'),
                type: 'warning'
              })
            } else {
              investid = acc.id
            }
            return Apis.instance().db_api().exec('lookup_asset_symbols', [[rowSymbol.param]])
          }).then(ress => {
            return Apis.instance().db_api().exec('get_bitlender_option_key', [ress[0].id, null])
          }).then(assets => {
            if (assets && assets.options) {
              let isLendCarrier = assets.options.carriers.find(uid => {
                return uid === lendid
              })
              if (!isLendCarrier) {
                this.$message({
                  type: 'warning',
                  // '不是运营商'
                  message: rowSymbol.cashCarrier.lendCarrier + this.$t('m.params.unIs') + rowSymbol.param + this.$t('m.params.isCarrier')
                })
                this.isSubmit = false
              }
              let isInvestCarrier = assets.options.carriers.find(uid => {
                return uid === investid
              })
              if (!isInvestCarrier) {
                this.$message({
                  type: 'warning',
                  // '不是运营商'
                  message: rowSymbol.lendCarrier.investCarrier + this.$t('m.params.unIs') + rowSymbol.param + this.$t('m.params.isCarrier')
                })
                this.isSubmit = false
              }
              this.isSubmit = true
            } else {
              this.$message({
                type: 'warning',
                // '不是运营商'
                message: rowSymbol.cashCarrier.lendCarrier + '/' + rowSymbol.lendCarrier.investCarrier + this.$t('m.params.unIs') + this.$t('m.params.isCarrier')
              })
              this.isSubmit = false
            }
            return resolve(this.isSubmit)
          }).catch(e => {
            this.$message({
              message: e,
              type: 'warning'
            })
            console.log(e)
          })
        })
      },
      // 是否是网关,异步
      asyncGateway () {
        Apis.instance().db_api().exec('lookup_gateway_accounts', ['G', 100]).then(res => {
          if (res) {
            let wayIndex = ''
            this.gatewaysData.forEach(item => {
              wayIndex = res.findIndex(val => {
                return item.gateway === val[0]
              })
              if (wayIndex === -1) {
                this.$message({
                  message: wayIndex + this.$t('m.params.noGateway'),
                  type: 'warning'
                })
                this.isGateway = false
              }
            })
          }
        })
      },
      // 是否是认证人,异步
      asyncAuthor () {
        Apis.instance().db_api().exec('lookup_author_accounts', ['A', 100]).then(res => {
          if (res) {
            let wayIndex = ''
            for (let i = 0; i < this.author.length; i++) {
              wayIndex = res.findIndex(val => {
                return this.author[i] === val[0]
              })
              if (wayIndex === -1) {
                this.$message({
                  message: wayIndex + this.$t('m.params.noAuthor'),
                  type: 'warning'
                })
                this.isAuthor = false
                break
              }
            }
          }
        })
      },
      // 是否是运营商
      async isCarrier () {
        for (let i = 0; i < this.carriersData.length; i++) {
          await this.asyncFn(this.carriersData[i])
        }
        return new Promise((resolve, reject) => {
          return resolve(this.isSubmit)
        })
      },
      // 是否是网关
      async _isGateway () {
        await this.asyncGateway()
        return new Promise((resolve, reject) => {
          return resolve(this.isGateway)
        })
      },
      // 是否是认证人
      async _isAuthor () {
        await this.asyncAuthor()
        return new Promise((resolve, reject) => {
          return resolve(this.isAuthor)
        })
      },
      isUpdated () {
        let ob = ''
        this.carriersData.forEach(val => {
          ob[val.param] = {}
          ob[val.param]['lendCarrier'] = {}
          ob[val.param]['lendCarrier'] = val.cashCarrier.lendCarrier
          ob[val.param]['investCarrier'] = val.lendCarrier.investCarrier
        })
        this.gatewaysData.forEach(val => {
          ob[val.param] = {}
          ob[val.param] = val.gateway
        })
        ob = [this.chooseTheme]
      },
      _isUpate () {
        let arr = []
        return Promise.all([this.isUpdate(), this.isUpdateGateway(), this._listUpdate('theme', [this.chooseTheme])]).then(res => {
          if (!res[0] && !res[1] && !res[2]) {
            this.$message({
              message: this.$t('m.params.noupdate'),
              type: 'warning'
            })
            return Promise.resolve(false)
          } else {
            res.forEach((item, index) => {
              if (item) {
                let configIndex = ''
                let ob = ''
                if (index === 0) {
                  configIndex = 'carrierList'
                  ob = {}
                  this.carriersData.forEach(val => {
                    ob[val.param] = {}
                    ob[val.param]['lendCarrier'] = {}
                    ob[val.param]['lendCarrier'] = val.cashCarrier.lendCarrier
                    ob[val.param]['investCarrier'] = val.lendCarrier.investCarrier
                  })
                } else if (index === 1) {
                  configIndex = 'gatewayList'
                  ob = {}
                  this.gatewaysData.forEach(val => {
                    ob[val.param] = {}
                    ob[val.param] = val.gateway
                  })
                // } else if (index === 2) {
                //   configIndex = 'authorList'
                //   ob = this.author
                } else {
                  configIndex = 'theme'
                  ob = [this.chooseTheme]
                }
                let obString = JSON.stringify(ob)
                arr.push([configIndex, obString])
              }
            })
            this.newConfig = arr
            return Promise.resolve(true)
          }
        })
      },
      _isTrue () {
        return Promise.all([this.isCarrier(), this._isGateway(), this._isAuthor()]).then(res => {
          if (res[0] && res[1] && res[2]) {
            return Promise.resolve(true)
          } else {
            return Promise.resolve(false)
          }
        })
      },
      isSubmitUpdate () {
        Promise.all([this._isUpate(), this._isTrue()]).then(res => {
          if (res[0] && res[1]) {
            this.confirmVisible = true
          }
        })
      },
      init () {
        this.loading = 1
        this.administrator = this.$store.state.admin
        this.isModified = false
        this.isSubmit = false
        this._getAssetList()
        this.carrierAccounts()
        this._author()
        this._theme()
        this._listAuthors()
        this.loading = this.loading - 1
      },
      _listAuthors () {
        this.loading = this.loading + 1
        Apis.instance().db_api().exec('lookup_author_accounts', ['A', 100]).then(res => {
          if (res && res.length > 0) {
            this.authorList = res
            if (this.author.length < 1) {
              this.author = [res[0][0]]
            }
            this.copyAuthor = deepClone(this.author)
          }
          this.loading = this.loading - 1
        }).catch(err => {
          this.loading = this.loading - 1
          console.log(err)
          this.$message({
            message: err,
            type: 'warning'
          })
        })
      },
      // 网关
      _gateway () {
        this.loading = this.loading + 1
        Apis.instance().db_api().exec('get_account_config', [this.$store.state.admin_id, ['gatewayList']]).then(res => {
          if (res && res[0]) {
            let config = JSON.parse(res[0])
            this.cashSymbolGateway = config
          }
          this.loading = this.loading - 1
        }).catch(err => {
          this.loading = this.loading - 1
          console.log(err)
          this.$message({
            message: err,
            type: 'warning'
          })
        })
      },
      // 认证人
      _author () {
        this.loading = this.loading + 1
        Apis.instance().db_api().exec('get_account_config', [this.$store.state.admin_id, ['authorList']]).then(res => {
          if (res && res[0]) {
            let config = JSON.parse(res[0])
            this.author = config
          }
          this.loading = this.loading - 1
        }).catch(err => {
          this.loading = this.loading - 1
          console.log(err)
          this.$message({
            message: err,
            type: 'warning'
          })
        })
      },
      // 主题
      _theme () {
        this.loading = this.loading + 1
        this.chooseTheme = ''
        Apis.instance().db_api().exec('get_account_config', [this.$store.state.admin_id, ['theme']]).then(theme => {
          if (theme && theme.length > 0 && theme[0]) {
            let config = JSON.parse(theme[0])
            this.chooseTheme = config[0]
          }
          this.loading = this.loading - 1
        }).catch(err => {
          this.loading = this.loading - 1
          console.log(err)
          this.$message({
            message: err,
            type: 'warning'
          })
        })
        this.userTheme = getLocalStore('choosedStyles')
        if (!isTheme(this.userTheme)) {
          this.userTheme = '1a1d5c'
        }
      },
      // 得到借贷的币种
      _getAssetList () {
        this.loading = this.loading + 1
        ZOSInstance.getAssetList()
          .then(res => {
            if (res && (res.cash_list)) {
              this.copycList = deepClone(res.cash_list)
              this.cList = deepClone(res.cash_list)
              this.copycListGateway = deepClone(res.cash_list)
              this.cListGateway = deepClone(res.cash_list)
              this._getConfig()
              this._getConfigGateway()
              this._gateway()
              this.loading = this.loading - 1
              console.log(this.loading)
            } else {
              this.loading = this.loading - 1
              return false
            }
          })
          .catch(err => {
            this.loading = this.loading - 1
            console.log(err)
            this.$message({
              message: err,
              type: 'warning'
            })
          })
      },
      // 获取运营商列表
      carrierAccounts () {
        this.loading = this.loading + 1
        this.carriersDymList = []
        ZOSInstance.lookup_carrier_accounts()
          .then(data => {
            data.forEach(item => {
              this.carriersDymList.push(item[0])
            })
            this.loading = this.loading - 1
          })
          .catch(e => {
            this.loading = this.loading - 1
            console.log(e)
          })
      },
      // 得到运营商参数结构体
      _getConfig () {
        this.loading = this.loading + 1
        Apis.instance().db_api().exec('get_account_config', [this.$store.state.admin_id, ['carrierList']])
          .then(res => {
            if (res && res[0]) {
              // config是以url为键名的对象
              let config = JSON.parse(res[0])
              this.carriersData = []
              // this.carriersDymList = []
              for (let i in config) {
                this.loading = this.loading + 1
                let params = {}
                let loanCarriers = {}
                params.param = i
                params.cashCarrier = {}
                params.lendCarrier = {}
                params.cashCarrier.lendCarrier = config[i].lendCarrier
                params.lendCarrier.investCarrier = config[i].investCarrier
                // 获取各自币种的运营商
                Apis.instance().db_api().exec('lookup_asset_symbols', [[i]]).then(ress => {
                  return Apis.instance().db_api().exec('get_bitlender_option_key', [ress[0].id, null])
                }).then(symCarrier => {
                  loanCarriers = symCarrier.options.loan_carriers
                  return Apis.instance().db_api().exec('get_objects', [symCarrier.options.invest_carriers])
                }).then(symName => {
                  let listName = []
                  symName.forEach(name => {
                    listName.push(name.name)
                  })
                  params.lendCarrier.carrierList = listName
                  return Apis.instance().db_api().exec('get_objects', [loanCarriers])
                }).then(symName => {
                  let listName = []
                  symName.forEach(name => {
                    listName.push(name.name)
                  })
                  params.cashCarrier.carrierList = listName
                  return Apis.instance().db_api().exec('get_account_by_name', [config[i].investCarrier])
                }).then(getId => {
                  // 根据这个对应币种，去查询他的运营商，
                  return Apis.instance().db_api().exec('get_account_config', [getId.id, ['collateral_ratio_' + i]])
                }).then(getCon => {
                  if (getCon && getCon[0]) {
                    let config = JSON.parse(getCon[0])
                    for (let ii in config) {
                      if (i === ii) {
                        params.ratio = config[ii]
                      }
                    }
                  }
                  this.carriersData.push(params)
                  this.loading = this.loading - 1
                  this._disabled()
                })
              }
              // let newArr = [...new Set(this.carriersDymList)]
              // this.carriersDymList = newArr.sort()
            }
            this.loading = this.loading - 1
          })
          .catch(err => {
            this.loading = this.loading - 1
            console.log(err)
            this.$message({
              message: err,
              type: 'warning'
            })
          })
      },
      // 得到运营商参数结构体
      _getConfigGateway () {
        this.loading = this.loading + 1
        Apis.instance().db_api().exec('get_account_config', [this.$store.state.admin_id, ['gatewayList']])
          .then(res => {
            if (res && res[0]) {
              // config是以url为键名的对象
              let config = JSON.parse(res[0])
              this.gatewaysData = []
              for (let i in config) {
                let params = {}
                params.param = i
                params['gateway'] = {}
                params['gateway'] = config[i]
                Apis.instance().db_api().exec('lookup_asset_symbols', [[i]]).then(ress => {
                  return Apis.instance().db_api().exec('get_objects', [ress[0].whitelist_gateways])
                }).then(result => {
                  params['gatewayList'] = {}
                  let arr = []
                  if (result && result.length > 0) {
                    result.forEach(item => {
                      arr.push(item.name)
                    })
                    params['gatewayList'] = arr
                    this.gatewaysData.push(params)
                    this._disabledGateway()
                  }
                })
              }
            }
            this.loading = this.loading - 1
          })
          .catch(err => {
            this.loading = this.loading - 1
            console.log(err)
            this.$message({
              message: err,
              type: 'warning'
            })
          })
      },
      addRatioSelect () {
        this.ratioSelect = true
      },
      // 是否禁用
      _disabled () {
        this.cList = deepClone(this.copycList)
        this.cList.forEach((item, index) => {
          this.carriersData.forEach((_item, _index) => {
            if (_item.param === item.symbol) {
              item['disabled'] = true
            }
          })
        })
      },
      // 是否禁用
      _disabledGateway () {
        this.cListGateway = deepClone(this.copycListGateway)
        this.cListGateway.forEach((item, index) => {
          this.gatewaysData.forEach((_item, _index) => {
            if (_item.param === item.symbol) {
              item['disabled'] = true
            }
          })
        })
      },
      // 添加一行
      addRatioInput () {
        if (!this.cashSymbol) {
          return
        }
        let params = {}
        let loanCarriers = {}
        params.param = this.cashSymbol.symbol
        params.cashCarrier = {}
        params.lendCarrier = {}
        // 获取各自币种的运营商
        Apis.instance().db_api().exec('get_bitlender_option_key', [this.cashSymbol.id, null]).then(symCarrier => {
          loanCarriers = symCarrier.options.carriers
          return Apis.instance().db_api().exec('get_objects', [symCarrier.options.invest_carriers])
        }).then(symName => {
          let listName = []
          symName.forEach(name => {
            listName.push(name.name)
          })
          params.lendCarrier.carrierList = listName
          params.lendCarrier.investCarrier = listName.length > 0 ? listName[0] : ''
          return Apis.instance().db_api().exec('get_objects', [loanCarriers])
        }).then(symName => {
          let listName = []
          symName.forEach(name => {
            listName.push(name.name)
          })
          params.cashCarrier.carrierList = listName
          params.cashCarrier.lendCarrier = listName.length > 0 ? listName[0] : ''
          this.carriersData.push(params)
          this._disabled()
        }).catch(err => {
          console.log(err)
          this.$message({
            message: err,
            type: 'warning'
          })
        })
        this.ratioSelect = false
        this.cashSymbol = {}
      },
      // 添加一行
      addRatioInputGateway () {
        if (!this.cashSymbolGateway) {
          return
        }
        let params = {}
        params.param = this.cashSymbolGateway.symbol
        // 获取各自币种的运营商
        Apis.instance().db_api().exec('get_objects', [[this.cashSymbolGateway.id]]).then(sym => {
          return Apis.instance().db_api().exec('get_objects', [sym[0].whitelist_gateways])
        }).then(symName => {
          let listName = []
          symName.forEach(name => {
            listName.push(name.name)
          })
          params.gateway = listName[0]
          params.gatewayList = listName
          this.gatewaysData.push(params)
          this._disabledGateway()
        }).catch(err => {
          console.log(err)
          this.$message({
            message: err,
            type: 'warning'
          })
        })
        this.cashSymbolGateway = {}
      },
      // 删除一行
      handleDelete (index, row) {
        this.carriersData.splice(index, 1)
        this._disabled()
      },
      // 删除一行
      handleDeleteGateway (index, row) {
        this.gatewaysData.splice(index, 1)
        this._disabledGateway()
      },
      submit () {
        this.isSubmitUpdate()
      },
      confirmUpdateCarrier (bool) {
        this.confirmVisible = false
        if (bool) {
          ZOSInstance.account_config_operation(this.$store.state.admin_id, this.newConfig, 5).then(update => {
            if (update) {
              this.updateContents['tr'] = update.tr
              this.updateContents['fee'] = update.fee.fee_amount / Math.pow(10, update.fee.fee_precision)
              this.updateContents['updateContent'] = this.newConfig
              this.carrierVisible = true
              if (this.chooseTheme && this.chooseTheme !== '') {
                this.$store.state.configTheme = this.chooseTheme
              } else {
                this.$store.state.configTheme = this.userTheme
              }
            }
          }).catch(error => {
            this.$message({
              message: error,
              type: 'warning'
            })
            console.log(error)
          })
        }
      },
      // 广播
      submitCarrier (bool) {
        this.carrierVisible = false
        if (bool) {
          // this.init()
          window.location.reload()
        }
      },
      // 公信度
      _carriersDym () {
        this.dynamicData = []
        Apis.instance().db_api().exec('get_account_by_name', [this.carriersDym]).then(res => {
          return Apis.instance().db_api().exec('get_carrier_by_account', [res.id])
        }).then(account => {
          return Apis.instance().db_api().exec('get_objects', [[account.dynamic_id]])
        }).then(ress => {
          if (ress) {
            let param = {}
            param.name = this.carriersDym
            Apis.instance().db_api().exec('get_objects', [this.getJSON(ress[0].loan)]).then(asset => {
              param.loan = this.setData(ress[0].loan, asset)
            })
            Apis.instance().db_api().exec('get_objects', [this.getJSON(ress[0].invest)]).then(asset => {
              param.invest = this.setData(ress[0].invest, asset)
            })
            Apis.instance().db_api().exec('get_objects', [this.getJSON(ress[0].collateralize_risk)]).then(asset => {
              param.risk = this.setData(ress[0].risk, asset)
            })
            Apis.instance().db_api().exec('get_objects', [this.getJSON(ress[0].fee)]).then(asset => {
              param.fee = this.setData(ress[0].fee, asset)
            })
            Apis.instance().db_api().exec('get_objects', [this.getJSON(ress[0].recycle_collateralize)]).then(asset => {
              param.recycle = this.setData(ress[0].recycle, asset)
            })
            Apis.instance().db_api().exec('get_objects', [this.getJSON(ress[0].recycle_loan)]).then(asset => {
              param.recycleloan = this.setData(ress[0].recycleloan, asset)
              this.dynamicData.push(param)
            })
          }
        })
      },
      getJSON (val) {
        let symbol = []
        val.forEach(item => {
          symbol.push(item[0])
        })
        return symbol
      },
      setData (val, asset) {
        let arr = []
        if (val && asset) {
          for (let i = 0; i < val.length; i++) {
            let param = {}
            param.amount = Number(val[i][1]) / Math.pow(10, asset[i].precision)
            param.symbol = asset[i].symbol
            arr.push(param)
          }
        }
        return arr
      }
    },
    mounted () {
      this.loading = 1
      if (this.$store.state.initFinished) {
        this.init()
      } else {
        this.$root.$on('initFinished', _ => {
          this.init()
        })
      }
    }
  }
</script>
<style scoped lang="scss">
.icon-style{
  font-size: 30px; vertical-align: middle
}
  .wrap{
    padding: 5px 15px
  }
</style>
