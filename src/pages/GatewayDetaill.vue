<template>
  <q-page class="gatewayDetail-container">
    <div class="gatewayDetail-content">
      <div class="no-wrap q-pa-md row justify-between">
        <span>
            <i class="material-icons vertical-align-sub font-18 text-black">border_color</i>
            <h5 class="q-px-md inline-block q-my-none font-18">{{$t('GATEWAY_PARTICULARS')}}</h5>
            </span>
        <q-btn color="secondary" class="self-center" @click="$router.push('gateway')">
          <q-icon name="reply" />
        </q-btn>
      </div>
      <div class="row q-px-md gutter-md">
        <div class="col-md-8 col-xs-12">
          <q-card class="mobile-only no-shadow margin-bottom-20" align="left">
            <div class="bg-white shadow-2">
              <q-card-title class="bg-nine">
                {{$t('BASIC_INFO')}}
              </q-card-title>
              <q-card-main class="word-wrap-break">
                <span class="font-22 text-black font-weight">{{gateway?gateway.name:''}}</span>
                {{gateway?gateway.desc:''}}
              </q-card-main>
            </div>
          </q-card>
  
          <q-table :title="$t('COUNCIL_PAGE.MODAL_TITLE', {number: datas.length})" class="fixed-height" :data="datas" :columns="columns" :pagination.sync="pagination" 
          @request="request" :loading="loading" row-key="address" :rows-per-page-options="[10]" hide-bottom >
            <template slot="top-left" slot-scope="props">
              <q-btn-toggle :class="transRecordBtnClass" color="white" text-color="secondary"  icon="fiber_manual_record" v-model="memberType" 
                  toggle-color="secondary"  toggle-text-color="white"
                  :options="options" @input="changeType" />
            </template>
            <!-- <q-td slot="body-cell-operation" slot-scope="props" :props="props">
              <div class="text-secondary cursor-pointer" @click="viewAccountInfo(props.row)">
                {{$t('CHECK')}}
              </div>
            </q-td> -->
            <q-td slot="body-cell-address" slot-scope="props" :props="props">
              <div class="text-secondary cursor-pointer" @click="viewAccountInfo(props.row)">
                {{props.value}}
              </div>
            </q-td>
            <q-td slot="body-cell-timestamp" slot-scope="props" :props="props">
                {{fullTimestamp(props.value)}}
            </q-td>
            <q-td slot="body-cell-bail" slot-scope="props" :props="props">
                {{convertFee(props.value)}}
            </q-td>
          </q-table>
        </div>

        <div v-if="gateway" :class="gatewayDetailClass">
          <q-card class="desktop-only no-shadow" align="left">
            <div class="bg-white shadow-2 fixed-height" >
              <q-card-title class="bg-nine">
                {{$t('BASIC_INFO')}}
              </q-card-title>
              <q-card-main class="word-wrap-break">
                <div class="font-22 text-black font-weight">{{gateway.name}}</div>
              <div>
                {{$t('GATEWAY_STATUS')}}：{{getGatewayState === 2 ? 'online':'offline'}}
                </div>
              <div>
                {{$t('DESC')}}：{{gateway?gateway.desc:''}}
                </div>
              </q-card-main>
            </div>
          </q-card>
        </div>
      </div>
      <div class="row q-px-md gutter-md">
      <q-card class="no-shadow margin-top-20 col-4" align="left">
        <div class="bg-white shadow-2 fixed-info-height">
          <q-card-title class="bg-nine">
            <span class="font-22 text-black font-weight">{{$t('RESERVE_TOTAL_AMOUNT')}}</span>
            <span>
              {{$t('AVALABLE_BAIL_AMOUNT')}}{{gateway&&gateway.bail?gateway.bail.bail:'' | fee}} XAS
            </span>
          </q-card-title>
          <q-card-main class="word-wrap-break">
          <div class="row">
            {{gateway && gateway.bail ? gateway.bail.totalBail:'' | fee}} XAS
          </div>
          <div class="flex row">
            <q-btn v-show="getAddBtnShow" big class="col-6" color="secondary" @click="showPromptModal(1)" :label="$t('RESERVE_ADD_LABEL')" />
            <q-btn v-show="getReturnBtnShow" big class="col-6" color="secondary" @click="showPromptModal(2)" :label="$t('RESERVE_RETURN_LABEL')" />
            <q-btn v-show="getCompensatioBtnShow" big class="col-6" color="secondary" @click="showPromptModal(3)" :label="$t('RESERVE_COMPENSATION_LABEL')" />
          </div>
          </q-card-main>
        </div> 
      </q-card>
      <q-card class="no-shadow margin-top-20 col-4" align="left">
       <div class="bg-white shadow-2 fixed-info-height">
          <q-card-title class="bg-nine">
            <span class="font-22 text-black font-weight">{{$t('PLEDGE_AMOUNT')}}</span>
          </q-card-title>
          <q-card-main class="word-wrap-break">
          {{gateway && gateway.bail ?gateway.bail.hosting:'' | fee}}
          </q-card-main>
        </div>  
      </q-card>
      <q-card class="no-shadow margin-top-20 col-4" align="left">
        <div class="bg-white shadow-2 row fixed-info-height">
          <q-card-title class="bg-nine self-start bottom-container-top">
            <span class="font-16 text-black">{{$t('LASTEST_UPDATE_TIME')}}</span>
          </q-card-title>
          <q-card-main class="flex item-center bottom-container-bottom height-62 ">
            <span class="font-24 text-secondary">{{gateway.createTime?compileTimeStamp(gateway.createTime):getTimeFromHight(gateway.lastUpdateHeight)}}</span>
          </q-card-main>
        </div>
      </q-card>
    </div>
    </div>
    <prompt-modal :show="modal.show" :title="modal.title" :type="modal.type" :gateway="gateway" @submit="submit" @close="modal.show=false" />
  
  </q-page>
</template>

<script>
import { QPage, QTable, QCard, QCardTitle, QCardMain, QBtn, QTd, QIcon, QBtnToggle } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import { fullTimestamp, convertFee } from '../utils/asch'
import { compileTimeStamp, getTimeFromHight } from '../utils/util'
import PromptModal from '../components/PromptModal'

export default {
  name: 'GatewayDetail',
  props: [],
  components: {
    QPage,
    QTable,
    QCard,
    QCardTitle,
    QCardMain,
    QBtn,
    QTd,
    QIcon,
    QBtnToggle,
    PromptModal
  },
  data() {
    return {
      columns: [
        {
          name: 'name',
          required: true,
          label: this.$t('COUNCIL_PAGE.MEMBER'),
          align: 'center',
          field: 'name'
        },
        // {
        //   name: 'desc',
        //   required: true,
        //   label: this.$t('DESCRIBE'),
        //   align: 'center',
        //   field: 'desc'
        // },
        {
          name: 'address',
          required: true,
          label: this.$t('COUNCIL_PAGE.ADDRESS'),
          align: 'center',
          field: 'address'
        },
        {
          name: 'bail',
          required: true,
          label: this.$t('GATEWAY_PLEDGE_AMOUNT'),
          align: 'center',
          field: 'bail'
        },
        // {
        //   name: 'elected',
        //   required: true,
        //   label: this.$t('ELECTED'),
        //   align: 'center',
        //   field: 'elected'
        // },
        {
          name: 'timestamp',
          required: true,
          label: this.$t('LATEST_OP_TIME'),
          align: 'center',
          field: 'timestamp'
        }
      ],
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 1
      },
      loading: false,
      datas: [],
      gateway: null,
      electedNum: 0,
      candidateNum: 0,
      memberType: 1, // elected 1 , candidate 0
      isGatewayMember: false,
      modal: {
        // prompt modal for gateway
        title: '',
        type: '',
        show: false
      }
    }
  },
  async mounted() {
    let { gateway } = this.$route.params
    if (!gateway) {
      this.$router.push('gateway')
    }
    this.gateway = gateway
    if (gateway && gateway.agent) {
      await this.loadData()
    }
    let res = await this.getGatewayInfo({ name: gateway.name })
    if (res.success) {
      this.gateway.bail = res
    }
  },
  methods: {
    ...mapActions([
      'getGatewayMembers',
      'getGatewayInfo',
      'getGatewayBailStatus',
      'getGatewayRealClaim'
    ]),
    fullTimestamp,
    convertFee,
    viewAccountInfo(row) {
      this.$root.$emit('openAccountModal', row.address)
    },
    async loadData() {
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res = await this.getGatewayMembers({
        limit: limit,
        offset: (pageNo - 1) * limit,
        name: this.gateway.name
      })
      let electedNume = 0
      let candidateNum = 0
      if (res.success) {
        this.datas = res.data.filter(p => {
          if (this.address === p.address) this.isGatewayMember = true
          if (p.elected === 1) {
            electedNume++
          } else {
            candidateNum++
          }
          return p.elected === this.memberType
        })
      }
      this.candidateNum = candidateNum
      this.electedNum = electedNume
      let params = {
        name: this.gateway.name,
        address: this.address
      }
      if (this.isGatewayMember) {
        let res = await this.getGatewayBailStatus(params)
        if (res.success) {
          this.gateway.status = res
        }
      } else {
        let res = await this.getGatewayRealClaim(params)
        if (res.success) {
          this.gateway.claim = res
        }
      }
    },
    async request(props) {
      this.loading = true
      this.pagination = props.pagination
      this.filter = props.filter
      await this.loadData()
      this.loading = false
    },
    convertFrequency(val) {
      return Math.floor(val / 8640)
    },
    compileTimeStamp(timestamp) {
      return compileTimeStamp(timestamp)
    },
    getTimeFromHight(height) {
      return getTimeFromHight(this.latestBlock, height)
    },
    changeType(val) {
      this.memberType = val
      this.loadData()
    },
    showPromptModal(type) {
      const titleKeys = [
        'placeholder',
        'RESERVE_ADD_LABEL',
        'RESERVE_RETURN_LABEL',
        'RESERVE_COMPENSATION_LABEL'
      ]
      this.modal = {
        // prompt modal for gateway
        title: this.$t(titleKeys[type]),
        type: type,
        show: true
      }
    },
    submit(form) {
      // console.log(form)
    }
  },

  computed: {
    ...mapGetters(['latestBlock', 'userInfo']),
    gatewayDetailClass() {
      return this.isDesk ? 'col-md-4 col-xs-12' : 'col-md-4 col-xs-12 margin-top-minus-28'
    },
    transRecordBtnClass() {
      let deskStyle = {
        'bg-white': true,
        'text-secondary': true
      }
      let mobileStyle = {
        'trans-record-btns': true,
        'bg-white': true,
        'text-secondary': true
      }
      return this.isDesktop ? deskStyle : mobileStyle
    },
    options() {
      return [
        {
          label: this.$t('COUNCIL_MEMBER_ELECTED', {
            number: this.electedNum
          }),
          value: 1
        },
        {
          label: this.$t('COUNCIL_MEMBER_CANDIDATE', {
            number: this.candidateNum
          }),
          value: 0
        }
      ]
    },
    getGatewayState() {
      /**
       * -1 no gateway data
       * 0 not activited
       * 1 activited
       * 2 online
       * 3 offline
       * 4 freeze
       */
      if (this.gateway) {
        let { activited, revoked } = this.gateway
        if (activited === 0) {
          return 0
        }
        if (activited === 1) {
          if (revoked > 0) {
            return revoked + 2
          } else {
            return 2
          }
        }
      }
      return -1
    },
    getAddBtnShow() {
      // let showStates = [1, 2]
      // let gatewayState = this.getGatewayState
      // let flag = showStates.indexOf(gatewayState) > -1
      // return flag && this.isGatewayMember
      return true
    },
    getReturnBtnShow() {
      // let showStates = [1, 2]
      // let gatewayState = this.getGatewayState
      // let flag = showStates.indexOf(gatewayState) > -1
      // return flag && this.isGatewayMember
      return true
    },
    getCompensatioBtnShow() {
      // let showStates = [4]
      // let gatewayState = this.getGatewayState
      // let flag = showStates.indexOf(gatewayState) > -1
      // return flag && !this.isGatewayMember
      return true
    },
    user() {
      return this.userInfo
    },
    address() {
      return this.user.account.address
    }
  },
  watch: {
    gateway(val) {
      if (val) this.loadData()
    }
  }
}
</script>

<style lang="stylus" scoped>
.gatewayDetail-container {
  padding: 20px;

  .gatewayDetail-content {
    background: #ffffff !important;
    padding-bottom: 40px;
    border-radius: 6px;
  }
}

.q-table-top {
  background: #e7ebee !important;
}

.gateway-modal-right-card {
  height: 50%;
}

.modal-right-container {
  background: #ffffff;
  height: calc(100% - 10px);
}

.modal-right-container-bottom {
  margin-top: 10px;
}

.bottom-container-top {
  width: 100%;
}

.bottom-container-bottom {
  width: 100%;
  text-align: center;
}

.q-table-container {
  background: #ffffff;
}

.word-wrap-break {
  word-wrap: break-word;
  padding: 40px;
  font-size: 18px;
}

.margin-top-minus-28 {
  margin-top: -28px;
}

.fixed-height {
  height: 355px;
  overflow-y: scroll;
}

.fixed-info-height {
  height: 260px;
}
</style>
