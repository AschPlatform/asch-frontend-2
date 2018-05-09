<template>
  <q-page class="issuer-container">
    <div class="bg-white padding-20 row issuer-content">
      <div class="col-md-9 col-xs-12">
        <q-table :data="assets" :columns="columns" @request="request" :pagination.sync="pagination" :loading="loading" :title="$t('MY_ASSETS')">
  
          <template slot="top-right" slot-scope="props">
                    <q-btn  :label="$t('REGISTERED_ASSETS')" color="secondary"  @click="assetRegister" />
</template>

          <q-td slot="body-cell-opt"  slot-scope="props" :props="props">
            <div>
              <!-- <q-btn @click="viewInfo(props.row)" icon="remove red eye" size="sm" flat color="primary" >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('DAPP_DETAIL')}}</q-tooltip>
              </q-btn> -->
              <!-- <q-btn @click="transferAsset(props)" icon="send" size="sm" flat color="primary" >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('TRANSFER')}}</q-tooltip>
              </q-btn> -->
              <q-btn @click="publish(props.row)" icon="publish" size="sm" flat color="secondary" >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('TRS_TYPE_UIA_ISSUE')}}</q-tooltip>
              </q-btn>
              <!-- <q-fab flat color="orange" icon="settings" direction="right" size="sm" >
                <q-tooltip slot="tooltip" anchor="top middle" self="bottom middle"  :offset="[0, 10]" >
                  {{$t('TRS_TYPE_UIA_FLAGS')}}
                </q-tooltip>
                <q-fab-action color="primary" @click="changeModal(props.row)" icon="transform">
                  <q-tooltip anchor="top middle" se00000lf="bottom middle" :offset="[0, 10]">{{$t('CHANGE_ACL_MODAL')}}</q-tooltip>
                </q-fab-action>
                <q-fab-action color="primary" @click="addACL(props.row)" icon="add">
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('label.create') + ACLStr(props.row.acl)}}</q-tooltip>
                </q-fab-action>
                <q-fab-action color="primary" @click="removeACL(props.row)" icon="remove">
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('label.remove') + ACLStr(props.row.acl)}}</q-tooltip>
                </q-fab-action>
                <q-fab-action color="negative" @click="writeoff(props.row)" icon="delete">
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('DELETE')}}</q-tooltip>
                </q-fab-action>
              </q-fab> -->
            </div>
          </q-td>

          <q-td slot="body-cell-maximum"  slot-scope="props" :props="props">
            {{props.value | fee(props.row.precision)}}
          </q-td>

          <!-- <q-td slot="body-cell-quantity"  slot-scope="props" :props="props">
            {{props.value | fee(props.row.precision)}}
          </q-td> -->
          <q-td slot="body-cell-quantity"  slot-scope="props" :props="props">
            {{props.value | fee(props.row.precision)}}
          </q-td>

        </q-table>
      </div>
      <div class="col-md-3 col-xs-12" v-if="$q.platform.is.desktop">
        <div class="padding-l-20">
         <q-card>
           <div class="text-black height-62 padding-l-20 q-table-top">
             <span class="font-22">{{$t('ISSUER')}}</span>
          </div>
          <q-card-main>
            <div v-if="issuer">
              <p class="font-16 text-black">
                {{issuer.name}}
              </p>
              <p class="font-16 text-five">
                {{issuer.desc}}
              </p>
            </div>
            <div class="text-center padding-b-20" v-else>
              <p>{{$t('NO_ISSUER_INFO')}}</p>
              <q-btn class="cursor-pointer" color="secondary" @click="issuerRegister" >{{$t('REGISTERED_PUBLISHER')}}</q-btn>
            </div>
          </q-card-main>
         </q-card>
        </div>
    
        <!-- <assets-records :userObj="userInfo" /> -->
      </div>
      <div class="col-md-3 col-xs-12 margin-top-20" v-if="$q.platform.is.mobile">
        <div>
         <q-card>
           <div class="text-black height-62 padding-l-20 q-table-top">
             <span class="font-22">{{$t('ISSUER')}}</span>
          </div>
          <q-card-main>
            <div v-if="issuer">
              <p class="font-16 text-black">
                {{issuer.name}}
              </p>
              <p class="font-16 text-five">
                {{issuer.desc}}
              </p>
            </div>
            <div class="text-center padding-b-20" v-else>
              <p>{{$t('NO_ISSUER_INFO')}}</p>
              <q-btn class="cursor-pointer" color="secondary" @click="issuerRegister" >{{$t('REGISTERED_PUBLISHER')}}</q-btn>
            </div>
          </q-card-main>
         </q-card>
        </div>
    
        <!-- <assets-records :userObj="userInfo" /> -->
      </div>
    </div>

      <q-modal minimized no-backdrop-dismiss   v-model="modalInfoShow" content-css="padding: 20px">
        <big>{{$t('DAPP_DETAIL')}}</big>
        <table class="q-table horizontal-separator highlight loose ">
          <tbody class='info-tbody'>
            <tr v-clipboard="row.name || 'no data'" @success="info('copy name success...')">
              <td >{{$t('ASSET_NAME')}}</td>
              <td >{{row.name}}</td>
            </tr>
            <tr  v-clipboard="row.maximumShow || 'no data'" @success="info('copy maximum success...')">
              <td >{{$t('MAXIMUM')}}</td>
              <td >{{row.maximumShow}}</td>
            </tr>
            <tr v-clipboard="row.precision || 'no data'" @success="info('copy precision success...')">
              <td >{{$t('PRECISION')}}</td>
              <td >{{row.precision}}</td>
            </tr>
            <tr v-clipboard="row.quantity || 'no data'" @success="info('copy quantity success...')">
              <td >{{$t('QUANTITY')}}</td>
              <td >{{row.quantityShow}}</td>
            </tr>
            <tr v-clipboard="row.writeoff?'normal':'writeoff'" @success="info('copy message success...')">
              <td >{{$t('CANCELLATION')}}</td>
              <td >{{row.writeoff?'writeoff':'normal'}}</td>
            </tr>
            <tr>
              <td >{{$t('ALLOW_WWB')}}</td>
              <td >{{getAssetRule(row)}}</td>
            </tr>
          </tbody>
        </table>
      <br/>
      <q-btn
        color="primary"
        @click="()=>{
          this.modalInfoShow = false
          this.row = {}
          }"
        label="Close"
      />
    </q-modal>

    <q-dialog
      v-model="dialogShow"
      prevent-close
      @ok="onOk"
      @cancel="onCancel"
    >
      <!-- This or use "title" prop on <q-dialog> -->
      <span slot="title">{{dialog.title}}</span>

      <!-- This or use "message" prop on <q-dialog> -->
      <span slot="message">{{dialog.message}}</span>

      <div slot="body">
        <div v-if="dialog.form == 2 ">
          <q-field 
            :label="$t('ISSUE_NUMBER')"
            error-label="error"
            :label-width="4"
          >
            <q-input  @blur="$v.issuerNum.$touch" v-model="form.issuerNum" :error-label="$t('ERR_ASSET_TOPLIMIT_NOT_CORRECT2')"
            :error="$v.issuerNum.$error"/>
        </q-field>
        </div>
        <div v-if="dialog.form == 3">
          <q-field 
            :label="$t('TYPE')"
            :label-width="4"
          >
            <q-input disable v-model="form.type" />
        </q-field>
        <q-field 
          :label="$t('CHANGE_TO')"
            :label-width="4"
          >
            <q-input disable :value="ACLStr(row.acl ? 0 : 1)" />
        </q-field>
        </div>
        <q-field v-if="secondSignature"
          :label="$t('TRS_TYPE_SECOND_PASSWORD')"
          :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')"
          :label-width="4"
        >
          <q-input v-model="secondPwd" type="password" />
        </q-field>
      </div>

<template slot="buttons" slot-scope="props">
  <q-btn outline class="" color="secondary" :label="$t('label.cancel')" @click="props.cancel" />
  <q-btn  color="secondary" :label="$t('label.ok')" @click="props.ok" />
</template>
    </q-dialog>

      <user-agreement-modal :show="userAgreementShow" @confirm="confirm" @cancel="userAgreementShow=false" :title="agreement.title" :tips="agreement.tips" :content="agreement.content" />
      <asset-issuer-modal :show="registerIssuerModalShow" @close="registerIssuerModalShow=false" :issuerInfo="issuer" />
      <asset-register-modal :show="registerAssetModalShow" @close="registerAssetModalShow=false" />
    </q-page>
</template>

<script>
import { toast, toastWarn, translateErrMsg } from '../utils/util'
import { secondPwdReg } from '../utils/validators'
import { createFlags, dealGiantNumber, fullTimestamp } from '../utils/asch'
import asch from '../utils/asch-v2'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
import {
  QTd,
  QField,
  QInput,
  QPage,
  QModal,
  QTable,
  QFabAction,
  QBtn,
  QTooltip,
  QDialog,
  QCard,
  QCardTitle,
  QCardMain
} from 'quasar'
import UserAgreementModal from '../components/UserAgreementModal'
import AssetRegisterModal from '../components/AssetRegisterModal'
import AssetIssuerModal from '../components/AssetIssuerModal'
import AssetsRecords from '../components/AssetsRecords'

export default {
  props: ['userObj'],
  components: {
    QTd,
    QField,
    QInput,
    QPage,
    QModal,
    QTable,
    QFabAction,
    QBtn,
    QTooltip,
    QDialog,
    UserAgreementModal,
    AssetRegisterModal,
    AssetIssuerModal,
    AssetsRecords,
    QCard,
    QCardTitle,
    QCardMain
  },
  data() {
    return {
      assets: [],

      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      filter: '',
      loading: false,
      columns: [
        {
          name: 'opt',
          label: this.$t('OPERATION'),
          field: 'opt',
          align: 'center'
        },
        {
          label: this.$t('ASSET_NAME'),
          field: 'name',
          type: 'string',
          filter: true
        },
        {
          name: 'maximum',
          label: this.$t('MAXIMUM'),
          field: 'maximum',
          sort: true
        },
        {
          label: this.$t('PRECISION'),
          field: 'precision',
          classes: 'text-center',
          type: 'number',
          sort: true
        },
        {
          name: 'quantity',
          label: this.$t('QUANTITY'),
          field: 'quantity',
          // filter: true,
          sort: true
        },
        // {
        //   label: this.$t('CANCELLATION'),
        //   field: 'writeoff',
        //   align: 'center',
        //   format: val => {
        //     return val === 0 ? 'normal' : 'writeoff'
        //   }
        // },
        // {
        //   name: 'allowWriteoff',
        //   label: this.$t('ALLOW_WWB'),
        //   field: 'allowWriteoff',
        //   align: 'center'
        // }
        {
          name: 'timestamp',
          label: this.$t('DATE'),
          field: 't_timestamp',
          align: 'center',
          format: value => {
            return fullTimestamp(value)
          }
        }
      ],
      modalInfoShow: false,
      row: {},
      secondPwd: '',
      dialogShow: false,
      dialog: {
        title: '',
        message: '',
        form: 0 // 1 writeoff ; 2 publish ; 3 setting
      },
      form: {
        issuerNum: '',
        type: 'ACL'
      },
      agreement: {
        title: '',
        tips: '',
        content: '',
        type: 0 // 1 issuer  2 asset
      },
      registerAssetModalShow: false,
      registerIssuerModalShow: false,
      userAgreementShow: false
    }
  },
  validations: {
    issuerNum: {
      required,
      minLength: minLength(1),
      maxLength: maxLength(30),
      isNumber(value) {
        value = Number(value)
        if (this._.isNaN(value)) return false
        return value > 0
      },
      getPrecision(value) {
        let arr = value.split('.')
        if (arr.length === 1) {
          return true
        }
        return false
      }
    }
  },
  methods: {
    ...mapActions(['getIssuer', 'getAddressAssets', 'broadcastTransaction']),
    async request(props) {
      await this.getAssets(props.pagination, props.filter)
    },
    async getAssets(pagination = {}, filter = '') {
      this.loading = true
      if (pagination.page) this.pagination = pagination
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res = await this.getAddressAssets({
        address: this.userInfo.account.address,
        limit: limit,
        offset: (pageNo - 1) * limit
      })
      if (res.success && res.assets) {
        this.assets = res.assets
        // set max
        this.pagination.rowsNumber = res.count
        this.loading = false
        return res
      } else {
        this.loading = false
      }
    },
    viewInfo(row) {
      this.row = row
      this.modalInfoShow = true
    },
    transferAsset(cell) {
      this.$root.$emit('openTransactionDialog', cell)
    },
    getAssetRule(props) {
      return `${props.allowWriteoff === 1 ? 'Y' : 'N'}/${props.allowWhitelist === 1 ? 'Y' : 'N'}/${
        props.allowBlacklist === 1 ? 'Y' : 'N'
      }`
    },
    writeoff(row) {
      const t = this.$t
      const issuer = this.issuer
      const assetsName = issuer.name + '.' + row.name

      this.dialog = {
        title: t('WRITEOFF'),
        message: `${t('WRITEOFF')} ${assetsName}, ${t('CANT_ROLLBACK')}, ${t(
          'REQUIRES_FEE'
        )} 0.1 XAS`,
        form: 1
      }
      this.row = row
      this.dialogShow = true
    },
    publish(row) {
      const t = this.$t

      this.dialog = {
        title: t('TRS_TYPE_UIA_ISSUE'),
        message: `${row.name}, ${t('CANT_ROLLBACK')}, ${t('REQUIRES_FEE')} 0.1 XAS`,
        form: 2
      }
      this.row = row
      this.dialogShow = true
    },
    changeModal(row) {
      const t = this.$t
      this.dialog = {
        title: t('TRS_TYPE_UIA_FLAGS'),
        message: `${row.name} ${t('TRS_TYPE_UIA_FLAGS')}, ${t('CANT_ROLLBACK')}, ${t(
          'REQUIRES_FEE'
        )} 0.1 XAS`,
        form: 3
      }
      this.row = row
      this.dialogShow = true
    },

    addACL(row) {
      this.$router.push({
        name: 'addACL',
        params: {
          user: this.user,
          assets: row
        }
      })
    },
    removeACL(row) {
      this.$router.push({
        name: 'reduceACL',
        params: {
          user: this.user,
          assets: row
        }
      })
    },
    async onOk() {
      const t = this.$t
      let formType = this.dialog.form
      if (formType === 1) {
        // write off
        if (this.secondSignature && this.pwdValid) {
          toastWarn(t('ERR_TOAST_SECONDKEY_WRONG'))
        } else {
          const flagType = 2 // write off assets
          let trans = createFlags(this.row.name, flagType, 1, this.userInfo.secret, this.secondPwd)
          let res = await this.broadcastTransaction(trans)
          if (res.success) {
            this.pagination = this.paginationDeafult
            await this.getAssets()
            toast(t('INF_OPERATION_SUCCEEDED'))
            this.close()
          } else {
            translateErrMsg(t, res.error)
            this.close()
          }
        }
      } else if (formType === 2) {
        if (this.secondSignature && this.pwdValid) {
          toastWarn(t('ERR_TOAST_SECONDKEY_WRONG'))
        } else {
          this.$v.issuerNum.$touch()
          if (this.$v.issuerNum.$error) {
          }
          let realAmount = dealGiantNumber(this.form.issuerNum, this.row.precision)

          let trans = asch.issueAsset(
            this.row.name,
            realAmount,
            this.userInfo.secret,
            this.secondPwd
          )
          let res = await this.broadcastTransaction(trans)
          if (res.success) {
            this.pagination = this.paginationDeafult
            await this.getAssets()
            toast(t('INF_OPERATION_SUCCEEDED'))
            this.close()
          } else {
            translateErrMsg(t, res.error)
            this.close()
          }
        }
      } else if (formType === 3) {
        if (this.secondSignature && this.pwdValid) {
          toastWarn(t('ERR_TOAST_SECONDKEY_WRONG'))
        } else {
          const flagType = 1 // change black/white modal
          let trans = createFlags(
            this.row.name,
            flagType,
            this.row.acl === 0 ? 1 : 0,
            this.userInfo.secret,
            this.secondPwd
          )
          let res = await this.broadcastTransaction(trans)
          if (res.success) {
            this.pagination = this.paginationDeafult
            await this.getAssets()
            toast(t('INF_OPERATION_SUCCEEDED'))
            this.close()
          } else {
            translateErrMsg(t, res.error)
            this.close()
          }
        }
      }
    },
    onCancel() {
      this.dialogShow = false
      this.dialog = this.dialogDefault
    },
    close() {
      this.dialogShow = false
      this.row = {}
    },
    info(msg) {
      toast(msg)
    },
    ACLStr(acl) {
      const t = this.$t
      return acl === 1 ? t('WHITELIST') : t('BLACKLIST')
    },
    assetRegister() {
      const t = this.$t
      if (!this.issuer) {
        toastWarn(t('ERR_NO_PUBLISHER_REGISTERED_YET'))
      } else {
        this.agreement = {
          title: t('REGISTERED_ASSETS'),
          tips:
            t('REGISTERED_ASSETS') +
            t('COST_FEE', {
              num: 500
            }),
          content: t('AGREEMENT_ASSET_CONTENT'),
          type: 2
        }
        this.userAgreementShow = true
      }
    },
    issuerRegister() {
      const t = this.$t
      this.agreement = {
        title: t('REGISTERED_PUBLISHER'),
        tips:
          t('REGISTERED_PUBLISHER') +
          t('COST_FEE', {
            num: 100
          }),
        content: t('AGREEMENT_ISSUER_CONTENT'),
        type: 1
      }
      this.userAgreementShow = true
    },
    confirm() {
      this.userAgreementShow = false
      if (this.agreement.type === 2) {
        this.registerAssetModalShow = true
      } else if (this.agreement.type === 1) {
        this.registerIssuerModalShow = true
      }
    },
    async initData() {
      await this.getIssuer({
        address: this.userInfo.account.address
      })
      await this.getAssets()
    }
    // formValid(type) {
    //   let formWithPwd = this.secondSignature ? this.pwdValid : false
    //   switch (type) {
    //     case 1:
    //       return formWithPwd
    //     case 2:
    //       return this.secondSignature
    //         ? this.$v.issuerNum.$error || this.pwdValid
    //         : this.$v.issuerNum.$error
    //     case 3:
    //       return formWithPwd
    //   }
    // }
  },
  async mounted() {
    if (this.userInfo) {
      this.initData()
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'issuer']),
    secondSignature() {
      return this.userInfo ? this.userInfo.account.secondPublicKey : null
    },
    pwdValid() {
      return !secondPwdReg.test(this.secondPwd)
    },
    dialogDefault() {
      return {
        title: '',
        message: '',
        form: 0 // 1 writeoff ; 2 publish ; 3 setting
      }
    },
    paginationDeafult() {
      return {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      }
    }
  },
  watch: {
    userInfo(val) {
      if (val) {
        this.initData()
      }
    },
    pageNo(val) {
      this.getAssets()
    }
  }
}
</script>

<style lang="stylus" scoped>
.issuer-container {
  padding: 20px;
  border-radius: 6px;
}

.issuer-content {
  border-radius: 6px;
}
</style>
