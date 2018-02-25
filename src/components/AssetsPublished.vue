<template>
  <div class="tab-panel-container row ">
    <transition  
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
    mode="out-in">
      <div v-if="assetsData" class="col-12 shadow-1">
        <q-table :data="assetsData.assets" :columns="columns" @request="request" :pagination.sync="pagination" 
        :loading="loading" :title="$t('MY_ASSETS')">
          
         <template slot="top-right" slot-scope="props">
            <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" />
          </template>

          <q-td slot="body-cell-opt"  slot-scope="props" :props="props">
              <q-btn @click="viewInfo(props.row)" icon="remove red eye" size="sm" flat color="primary" >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('DAPP_DETAIL')}}</q-tooltip>
              </q-btn>
              <q-btn @click="getTransferParams(props)" icon="send" size="sm" flat color="primary" >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('TRANSFER')}}</q-tooltip>
              </q-btn>
              <q-btn @click="publish(props.row)" icon="publish" size="sm" flat color="primary" >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('TRS_TYPE_UIA_ISSUE')}}</q-tooltip>
              </q-btn>
              <q-fab flat color="orange" icon="settings" direction="right" size="sm" >
                <q-tooltip slot="tooltip" anchor="top middle" self="bottom middle"  :offset="[0, 10]" >
                  {{$t('TRS_TYPE_UIA_FLAGS')}}
                </q-tooltip>
                <q-fab-action color="primary" @click="changeModal(props.row)" icon="transform">
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('label.set')}}</q-tooltip>
                </q-fab-action>
                <q-fab-action color="primary" @click="addACL(props.row)" icon="add">
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('label.create')}}</q-tooltip>
                </q-fab-action>
                <q-fab-action color="primary" @click="removeACL(props.row)" icon="remove">
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('label.remove')}}</q-tooltip>
                </q-fab-action>
                <q-fab-action color="negative" @click="writeoff(props.row)" icon="delete">
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('DELETE')}}</q-tooltip>
                </q-fab-action>
              </q-fab>
          </q-td>

          <q-td slot="body-cell-allowWriteoff"  slot-scope="props" :props="props">
            {{getAssetRule(props.row)}}
          </q-td>

        </q-table>
      </div>
      </transition>

      <q-modal minimized  v-model="modalInfoShow" content-css="padding: 20px">
      <big>{{$t('DAPP_DETAIL')}}</big>
      <table v-if="modalInfoShow" class="q-table horizontal-separator highlight loose ">
        <tbody class='info-tbody'>
          <tr v-clipboard="row.name" @success="info('copy name success...')">
            <td >{{$t('ASSET_NAME')}}</td>
            <td >{{row.name}}</td>
          </tr>
          <tr  v-clipboard="row.maximumShow" @success="info('copy maximum success...')">
            <td >{{$t('MAXIMUM')}}</td>
            <td >{{row.maximumShow}}</td>
          </tr>
          <tr v-clipboard="row.precision" @success="info('copy precision success...')">
            <td >{{$t('PRECISION')}}</td>
            <td >{{row.precision}}</td>
          </tr>
          <tr v-clipboard="row.quantity" @success="info('copy quantity success...')">
            <td >{{$t('QUANTITY')}}</td>
            <td >{{row.quantityShow}}</td>
          </tr>
          <tr v-clipboard="row.writeoff?'normal':'writeoff'" @success="info('copy message success...')">
            <td >{{$t('REMARK')}}</td>
            <td >{{row.writeoff?'normal':'writeoff'}}</td>
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
      stack-buttons
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

        </div>
        <div v-if="dialog.form == 3">

        </div>
        <q-field v-if="secondSignature"
          helper="We need your name so we can send you to the movies."
          :label="$t('TRS_TYPE_SECOND_PASSWORD')"
          :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')"
          :label-width="2"
        >
          <q-input v-model="name" type="password" />
        </q-field>
      </div>

      <!-- <template slot="buttons" slot-scope="props">
        <q-btn color="primary" label="Choose Superman" @click="choose(props.ok, 'Superman')" />
        <q-btn color="black" label="Choose Batman" @click="choose(props.ok, 'Batman')" />
        <q-btn color="negative" label="Choose Spiderman" @click="choose(props.ok, 'Spiderman')" />
        <q-btn flat label="No thanks" @click="props.cancel" />
      </template> -->
    </q-dialog>
    </div>
</template>

<script>
import { api } from '../utils/api'
import { prompt, toast, toastWarn } from '../utils/util'
import { createFlags } from '../utils/asch'

export default {
  props: ['userObj'],
  components: {},
  data() {
    return {
      assetsData: null,
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 1
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
          label: this.$t('MAXIMUM'),
          field: 'maximumShow',
          sort: true,
          filter: true
        },
        {
          label: this.$t('PRECISION'),
          field: 'precision',
          classes: 'text-center',
          type: 'number',
          sort: true
        },
        {
          label: this.$t('QUANTITY'),
          field: 'quantityShow',
          filter: true,
          sort: true
        },
        {
          label: this.$t('CANCELLATION'),
          field: 'writeoff',
          align: 'center',
          format: val => {
            return val === 0 ? 'normal' : 'writeoff'
          }
        },
        {
          name: 'allowWriteoff',
          label: this.$t('ALLOW_WWB'),
          field: 'allowWriteoff',
          align: 'center'
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
      }
    }
  },
  // validations: {
  //   form:{
  //     writeoff: {

  //         secondPwd: ''
  //       },
  //       publish: {
  //         secondPwd: ''
  //       },
  //       setting: {
  //         secondPwd: ''
  //       }
  //   }
  // },
  methods: {
    async request(props) {
      await this.getAssets(props.pagination, props.filter)
    },
    async getAssets(pagination = {}, filter = '') {
      this.loading = true
      if (pagination.page) this.pagination = pagination
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res = await api.myAssets({
        name: this.user.issuer.name,
        limit: limit,
        offset: (pageNo - 1) * limit
      })
      this.assetsData = res
      // set max
      this.pagination.rowsNumber = res.count
      this.loading = false
      return res
    },
    viewInfo(row) {
      this.row = row
      this.modalInfoShow = true
    },
    getTransferParams(cell) {
      return { name: 'transfer', params: { user: this.user, data: cell } }
    },
    getAssetRule(props) {
      return `${props.allowWriteoff === 1 ? 'Y' : 'N'}/${props.allowWhitelist === 1 ? 'Y' : 'N'}/${
        props.allowBlacklist === 1 ? 'Y' : 'N'
      }`
    },
    writeoff(row) {
      const t = this.$t
      const issuer = this.user.issuer
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
    publish(row){
      const t = this.$t
      const issuer = this.user.issuer
      const assetsName = issuer.name + '.' + row.name

      this.dialog = {
        title: t('TRS_TYPE_UIA_ISSUE'),
        message: `${assetsName}, ${t('CANT_ROLLBACK')}, ${t(
          'REQUIRES_FEE'
        )} 0.1 XAS`,
        form: 2
      }
      this.row = row
      this.dialogShow = true
    },
    changeModal(row) {
      const t = this.$t
      const issuer = this.user.issuer
      const assetsName = issuer.name + '.' + row.name

      this.dialog = {
        title: t('TRS_TYPE_UIA_FLAGS'),
        message: `${assetsName} ${t('TRS_TYPE_UIA_FLAGS')}, ${t('CANT_ROLLBACK')}, ${t(
          'REQUIRES_FEE'
        )} 0.1 XAS`,
        form: 3
      }
      this.row = row
      this.dialogShow = true
    },

    addACL(row) {},
    removeACL(row) {},
    onOk() {
      let formType = this.dialog.form
    },
    onCancel() {
      this.dialogShow = false
      this.dialog = this.dialogDefault
    }
  },
  async mounted() {
    if (this.user) {
      this.getAssets()
    }
  },
  computed: {
    user() {
      return this.userObj
    },
    secondSignature() {
      return this.user.account.secondSignature
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
    }
  },
  watch: {
    userObj(val) {
      if (val) {
        this.getAssets()
      }
    },
    pageNo(val) {
      this.getAssets()
    }
  }
}
</script>

<style lang="stylus">
</style>
