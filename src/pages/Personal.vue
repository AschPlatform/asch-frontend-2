<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <q-page class="personal-container">
    <q-card class="no-shadow" v-if="user">
      <!-- <q-card-title>
            {{$t('PERSONAL')}}
          </q-card-title> -->
      <q-card-main class="row col-12 justify-center">
        <div class="personal-top col-12 row justify-left bg-white shadow-2">
          <div class="personal-head-portrait col-1">
            <jdenticon class="personal-head-canvas" :address="address" :size="60" />
          </div>
          <div class="col-7 col-md-7 col-lg-6 col-xl-5 text-left row justify-left">
            <div>
              <span v-if="!userNickname" class="text-black font-22 vertical-align-middle">
                {{$t('HELLO')}}
              </span>
              <span v-else class="text-black font-22 vertical-align-middle">
                {{$t('HELLO')+'，'}}
              </span>
              <a class="font-14 set-nickname bg-secondary text-white vertical-align-middle" v-if="!userNickname" :label="$t('SET_NICKNAME')" @click="nicknameFormShow=true">{{$t('SET_NICKNAME')}}</a> <span v-else class="text-black font-22 vertical-align-middle">{{userNickname}}</span>
            </div>
            <div class="col-12 text-three">
              {{address}}
              <q-btn class="text-secondary" v-clipboard="address || 'no data'" @success="info('copy success')" flat icon="content copy" />
            </div>
          </div>
          <div class="personal-qr col-3 row justify-left text-left">
            <span class="right-line"></span>
            <div class="row justify-center" @click="showAddrQr">
              <vue-qr class="personal-qr-container" :size="103" :text="address"></vue-qr>
            </div>
          </div>
  
        </div>
        <div class="personal-bottom shadow-2 bg-white row col-12 justify-left">
          <div class="personal-bottom-title">
            <i class="material-icons">email</i>
            <span>
              {{$t('MESSAGE_DETAILS')}}
            </span>
          </div>
          <table class="personal-table q-table bordered highlight responsive ">
            <tbody class='info-tbody'>
              <tr>
                <td class="bottom-left-link text-three font-18">
                <i class="material-icons font-22 personal-icon">lock outline</i>
                {{$t('SECOND_PASSWORD')}}
                </td>
                <td>
                  <span v-if="secondSignature" class="text-black font-18">
                    {{$t('ALREADY_SET')}}
                  </span>
                  <a v-else class="text-secondary" @click="secondPwdShow=true">
                    {{$t('SET_NOW')}}
                  </a>
                </td>
              </tr>
              <!-- <tr>
                              <td>{{$t('PUBLIC_KEY')}}</td>
                              <td>{{user.account.publicKey}} 
                                <q-btn v-clipboard="user.account.publicKey || 'no data'" @success="info('copy success')" flat icon="content copy" />
                   callLockPanel           </td>
                            </tr> -->
              <tr>
                <td class="bottom-left-link text-three font-18">
                <i class="material-icons font-22 personal-icon">settings</i>
                  {{$t('LOCK_POSITION_CONF')}}
                </td>
                <td>
                  <div class="font-18" v-if="lockInfo">
                    <span class="font-18">
                      {{$t('LOCK_DETAIL',{amount:convertFee(this.lockInfo.amount),date:this.lockInfo.time})}}
                    </span>
                    <a class="text-secondary" @click="callLockPanel">{{$t('EDIT')}}</a>
                    <a v-if="this.lockInfo.expire" class="text-blue" @click="unlock">{{$t('UNLOCK')}}</a>
                  </div>
                  <a v-else class="text-secondary" @click="callLockPanel">
                    {{$t('SET_NOW')}}
                  </a>
                </td>
              </tr>
              <tr>
                <td class="bottom-left-link text-three font-18">
              <i class="material-icons font-22 personal-icon">account_circle</i>
                  {{$t('AGENT_INFO')}}
                </td>
                <td>
                  <span class="font-18" v-if="isAgent">
                                  {{$t('IS_AGENT')}}
                                </span>
                  <a v-else class="text-secondary" @click="callDelegatePanel">
                                  {{$t('REGISTER_AGENT')}}
                                </a>
                </td>
              </tr>
              <tr>
                <td class="bottom-left-link text-three font-18">
                   <i class="material-icons font-22 personal-icon">person</i>
                  {{$t('GATEWAY_CANDIDATE')}}
                </td>
                <td>
                  <div @click="jump2Doc">
                    <a class="text-secondary">
                                    {{$t('HOW_TO_BE')}}{{$t('GATEWAY_CANDIDATE_TO')}}
                                  </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </q-card-main>
    </q-card>
    <q-dialog v-model="dialogShow">
      <span slot="title">{{type=='secret'?$t('QRCODE'):$t('QRCODE_ADDRESS')}}</span>
      <div slot="body" class="row justify-center" @click="dialogShow=false">
        <vue-qr :text="qrValue"></vue-qr>
      </div>
    </q-dialog>
  
    <q-dialog v-model="secondPwdShow">
      <span slot="title">{{$t('SET_SECOND_PASSWORD')}}</span>
      <div slot="body" class="row justify-left">
        <q-field class="col-12" :label="$t('PASSWORD')" :label-width="2" :error="$v.password.$error" :error-label="$t('ERR_SECOND_PASSWORD_FORMAT')">
          <q-input @blur="$v.password.$touch" :placeholder="$t('SECOND_PASSWORD_TIP')" type="password" v-model="password" />
        </q-field>
        <q-field class="col-12" :label="$t('CONFIRM')" :label-width="2" :error="$v.confirmPassword.$error" :error-label="$t('ERR_TWO_INPUTS_NOT_EQUAL')">
          <q-input @blur="$v.confirmPassword.$touch" :placeholder="$t('SECOND_PASSWORD_CONFIRM')" type="password" v-model="confirmPassword" />
        </q-field>
      </div>
      <template slot="buttons" class="row justify-between" slot-scope="props">
        <q-btn :label="$t('label.cancel')" class="col-3 self-lef" color="secondary" outline @click="props.cancel()"/>
        <q-btn class="col-3 self-lef margin-left-10" color="secondary" @click="setPwd(props.ok)">
                        {{$t('CONFIRM')}}
                      </q-btn>
      </template>
    </q-dialog>

    <q-dialog v-model="nicknameFormShow" >
      <span  slot="title">{{$t('SET_NICKNAME')}}</span>
      <div slot="body" class="row justify-center margin-t-54" >
        <q-field class="col-12" :error="$v.nickname.$error" :error-label="$t('ERR_NICKNAME')">
          <q-input @blur="$v.nickname.$touch" :placeholder="$t('NICKNAME_TIP')" v-model="nickname" @change="lowerName" />
        </q-field>
         <q-field v-show="secondSignature" class="col-10" :label="$t('TRS_TYPE_SECOND_PASSWORD')" :error="secondPwdError" :label-width="4"  :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')">
          <q-input @blur="validateSecondPwd" type="password" v-model="secondPwd"  />
        </q-field>
        <table class="personal-table-container q-table bordered  responsive margin-t-20">
          <tbody>
            <tr>
              <td>{{$t('CHAR_NUM')}}</td>
               <td>3</td>
               <td>4</td>
               <td>5</td>
               <td>6-10</td>
               <td>11-20</td>
            </tr>
            <tr>
              <td>{{$t('PRICE')}}</td>
                <td>100 XAS</td>
                <td>80 XAS</td>
                <td>40 XAS</td>
                <td>10 XAS</td>
                <td>1 XAS</td>
            </tr>
          </tbody>
        </table>
      </div>

<template slot="buttons" slot-scope="props">
  <q-btn :label="$t('label.cancel')" class="col-3 self-lef" color="secondary" outline @click="props.cancel()" />
  <q-btn class="col-3 self-lef" color="secondary"  @click="setNickname(props.ok)">
    {{$t('CONFIRM')}}
  </q-btn>
</template>
    </q-dialog>

    <q-dialog v-model="lockPanelShow" >
      <span slot="title">{{$t('LOCK_POSITION_CONF')}}</span>
      <div slot="body" class="row justify-center" >
        <q-field class="col-10" :label="$t('NUM')" :label-width="3" :error="numError" :helper="numLimit">
          <q-input @blur="validateNum" :placeholder="$t('LOCK_DETAIL_TIP')" type="number" :decimals="2" v-model="num" />
        </q-field>
         <q-field class="col-10" :label="$t('HEIGHT')" color="black" :label-width="3" :error="$v.time.$error" 
         :error-label="$t('ERR_NICKNAME')" :helper="$t('UNLOCK_TIPS')">
          <!-- <p class="text-secondary font-12">{{$t('UNLOCK_TIPS')}}</p> -->
          <q-datetime
          v-model="time"
          :min="today"
          popover
          :float-label="$t('SET_UNLOCK_TIME')"
          type="datetime" 
          format24h
        />
        </q-field>
        <q-field v-show="secondSignature" class="col-10" :label="$t('TRS_TYPE_SECOND_PASSWORD')" :error="secondPwdError" :label-width="3"  :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')">
          <q-input @blur="validateSecondPwd" type="password" v-model="secondPwd"  />
        </q-field>
      </div>
<template slot="buttons" slot-scope="props">
  <q-btn :label="$t('label.cancel')" class="col-2 self-lef" color="secondary" outline @click="props.cancel()" />
  <q-btn class="col-2 self-lef" color="secondary" @click="editLock(props.ok)">
    {{$t('TRS_TYPE_LOCK')}}
  </q-btn>
</template>
    </q-dialog>
  <user-agreement-modal :show="userAgreementShow" @confirm="registerAgent" @cancel="userAgreementShow=false" :tips="$t('REGISTER_AGENT')+$t('COST_FEE',{num:100})" />
  </q-page>
</template>

<script>
import VueQr from 'vue-qr'
import { required, sameAs } from 'vuelidate/lib/validators'
import { secondPwd, secondPwdReg, nicknameReg } from '../utils/validators'
import { toastWarn, toast, toastError, prompt, translateErrMsg } from '../utils/util'
import { convertFee, fullTimestamp } from '../utils/asch'
import asch from '../utils/asch-v2'
import { mapActions, mapGetters } from 'vuex'
import {
  QPage,
  QCard,
  QCardTitle,
  QCardMain,
  QDialog,
  QDatetime,
  date,
  openURL,
  QBtn,
  QField,
  QInput
} from 'quasar'
import Jdenticon from '../components/Jdenticon'
import UserAgreementModal from '../components/UserAgreementModal'

let today = new Date()
today = date.addToDate(today, {
  days: 31
})

export default {
  props: ['userObj'],
  components: {
    VueQr,
    QPage,
    QCard,
    QCardTitle,
    QCardMain,
    Jdenticon,
    QDialog,
    QDatetime,
    UserAgreementModal,
    QBtn,
    date,
    openURL,
    QField,
    QInput
  },
  data() {
    return {
      dialogShow: false,
      qrValue: '',
      type: 0,
      password: '',
      confirmPassword: '',
      seted: false,
      lockHeight: null,
      lockError: false,
      lockErrorMsg: 'error',
      secondPwd: '',
      secondPwdError: false,
      tip: this.$t('ACCOUNT_LOCK_TIP'),
      locked: false,
      // new field
      nickname: '',
      secondPwdShow: false,
      nicknameFormShow: false,
      lockPanelShow: false,
      userAgreementShow: false,
      num: '',
      time: '',
      today,
      numError: false,
      btnDisable: false
    }
  },
  validations: {
    password: {
      required,
      secondPwd: secondPwd()
    },
    confirmPassword: {
      required,
      sameAsPassword: sameAs('password')
    },
    nickname: {
      required,
      nameReg(value) {
        return nicknameReg.test(value)
      }
    },
    num: {},
    time: {}
  },
  methods: {
    ...mapActions(['broadcastTransaction', 'setName']),
    // async setLock() {
    //   if (this.lockError) {
    //     return
    //   }
    //   if (this.secondSignature) {
    //     toastError(this.$t('ERR_SECOND_PASSWORD_FORMAT'))
    //     return
    //   }
    //   let trans = asch.setLock(this.lockHeight, this.amount, this.user.secret, this.secondPwd)
    //   let res = await this.broadcastTransaction(trans)
    //   if (res.success === true) {
    //     console.log(res)
    //     toast(this.$t('INF_POSITIONLOCK_SET_SUCCESS'))
    //     this.locked = true
    //   } else {
    //     console.log(res)
    //     translateErrMsg(this.$t, res.error)
    //   }
    // },
    async setPwd(done) {
      this.$v.password.$touch()
      this.$v.confirmPassword.$touch()
      const isValid = this.$v.password.$error || this.$v.confirmPassword.$error
      if (isValid) {
        toastWarn(this.$t('ERR_SECOND_PASSWORD_FORMAT'))
      } else {
        let trans = asch.setsecondPassword(this.password, this.user.secret)
        let res = await this.broadcastTransaction(trans)
        if (res.success === true) {
          toast(this.$t('INF_SECND_PASSWORD_SET_SUCCESS'))
          this.seted = true
          done()
        } else {
          translateErrMsg(this.$t, res.error)
        }
      }
    },
    showQrcode(type) {
      this.type = type
      if (type === 'secret') {
        this.qrValue = this.user.secret
      } else {
        this.qrValue = this.user.account.address
      }
      this.dialogShow = true
    },
    validateSecondPwd(val) {
      let isValid = this.pwdValid
      this.secondPwdError = isValid
      return isValid
    },
    validateLockHeight(val) {
      const t = this.$t
      if (!val) {
        return
      }
      const lockHeight = Number(val)
      const diffHeight = lockHeight - this.user.latestBlock.height
      let sec = diffHeight * 10
      let min = 0
      let hou = 0
      let day = 0
      const ab = t('FRAGIL_ABOUT')
      const d = t('FRAGIL_DAY')
      const h = t('FRAGIL_HOUR')
      const m = t('FRAGIL_MIN')
      const s = t('FRAGIL_SEC')
      const r = t('FRAGIL_RANGE')
      const u = t('FRAGIL_UNLOCK')
      if (diffHeight > 0 && diffHeight < 10000000) {
        if (sec > 60) {
          min = sec / 60
          sec = sec % 60
          if (min > 60) {
            hou = min / 60
            min = min % 60
            if (hou > 24) {
              day = hou / 24
              hou = hou % 24
            }
          }
        }
        this.lockError = false
        this.tip =
          ab + parseInt(day) + d + parseInt(hou) + h + parseInt(min) + m + parseInt(sec) + s + u
      } else {
        this.lockError = true
        this.tip = r
      }
    },
    info(msg) {
      toast(msg)
    },
    showAddrQr() {
      this.$root.$emit('showQRCodeModal', this.address)
    },
    async setNickname(done) {
      this.$v.nickname.$touch()
      if (this.$v.nickname.$error) {
        toastError(this.$t('ERR_NICKNAME'))
        return null
      } else {
        let trans = asch.setName(this.nickname, this.user.secret, this.secondPwd)
        let res = await this.broadcastTransaction(trans)
        if (res.success) {
          toast(this.$t('INF_OPERATION_SUCCEEDED'))
          this.nicknameFormShow = false
        } else {
          toastError(res.error, this.$t)
        }
      }
    },
    async registerAgent(flag = true) {
      const t = this.$t
      let secondFlag = this.secondSignature && flag
      if (secondFlag) {
        prompt(
          {
            title: t('REGISTER_AGENT'),
            message: t('ACCOUNT_TYPE2_HINT'),
            prompt: {
              model: '',
              type: 'password' // optional
            }
          },
          data => {
            this.secondPwd = data
            this.registerAgent(false)
          }
        )
        return
      }
      if (this.secondSignature && this.pwdValid) {
        toastError(this.$t('ERR_SECOND_PASSWORD_FORMAT'))
        return
      }
      let trans = asch.registerAgent(this.user.secret, this.secondPwd)
      let res = await this.broadcastTransaction(trans)
      if (res.success) {
        toast(t('INF_OPERATION_SUCCEEDED'))
      } else {
        translateErrMsg(res.error, t)
      }
      this.userAgreementShow = false
    },
    async editLock(done) {
      if (this.secondSignature && this.pwdValid) {
        toastError(this.$t('ERR_SECOND_PASSWORD_FORMAT'))
        return
      }
      let unlockTimestamp = date.formatDate(this.time, 'X')
      let { height, timestamp } = this.latestBlock
      let beginTime = new Date(fullTimestamp(timestamp))
      beginTime = date.formatDate(beginTime, 'X')
      let higher = Math.floor((unlockTimestamp - beginTime) / 10)
      let amount = this.num * Math.pow(10, 8)
      let trans = asch.setLock(height + higher, amount, this.user.secret, this.secondPwd)
      let res = await this.broadcastTransaction(trans)
      if (res.success === true) {
        toast(this.$t('INF_POSITIONLOCK_SET_SUCCESS'))
        this.locked = true
        this.lockPanelShow = false
        this.num = 0
        this.time = 0
      } else {
        translateErrMsg(this.$t, res.error)
      }
    },
    validateNum() {
      let amount = convertFee(this.user.account.balance)
      this.numError = this.num >= amount
      return !this.num >= amount
    },
    async unlock() {
      let lockHeight = this.user.account.lockHeight
      let height = this.latestBlock.height
      if (height <= lockHeight) {
        toastError(this.$t('HEIGHT_NOT_ARRIVE'))
      } else {
        let trans = asch.unlock()
        let res = await this.broadcastTransaction(trans)
        if (res.success === true) {
          toast(this.$t('INF_OPERATION_SUCCEEDED'))
        } else {
          translateErrMsg(res.error, this.$t)
        }
      }
    },
    jump2Doc() {
      openURL('https://github.com/AschPlatform/asch/tree/master/docs')
    },
    convertFee(value) {
      return convertFee(value)
    },
    callLockPanel() {
      if (this.user.account.isAgent === 0) {
        // is not delegate
        this.lockPanelShow = true
      } else {
        toastWarn(this.$t('AGENT_ALREADY'))
      }
    },
    callDelegatePanel() {
      if (this.user.account.isLocked === 1) {
        // is not delegate
        toastWarn(this.$t('ALREADY_LOCKED'))
      } else if (!this.userInfo.account.name) {
        toastWarn(this.$t('PLEASE_SET_NAME'))
      } else {
        this.userAgreementShow = true
      }
    },
    lowerName(val) {
    }
  },
  async mounted() {},
  computed: {
    ...mapGetters(['userInfo', 'latestBlock']),
    user() {
      return this.userInfo
    },
    secondSignature() {
      return this.user ? this.user.account.secondPublicKey : null
    },
    lockState() {
      if (this.user && this.user.account) {
        return this.user.account.lockHeight > this.user.latestBlock.height
      }
    },
    pwdValid() {
      return !secondPwdReg.test(this.secondPwd)
    },
    address() {
      return this.userInfo && this.userInfo.account ? this.userInfo.account.address : 'nothing'
    },
    userNickname() {
      return this.user.account.name
    },
    isAgent() {
      return this.user.account.isAgent
    },
    lockInfo() {
      if (this.user.account.isLocked) {
        let { timestamp, height } = this.latestBlock
        let lockHeight = this.user.account.lockHeight
        let diff = lockHeight - height
        timestamp = timestamp + diff * 10
        let lockInfo = {}
        lockInfo.amount = this.user.account.weight
        lockInfo.time = fullTimestamp(timestamp) // TODO
        lockInfo.expire = height > lockHeight
        return lockInfo
      } else {
        return null
      }
    },
    numLimit() {
      if (this.user) {
        let amount = convertFee(this.user.account.balance)
        const t = this.$t
        return amount > 1 ? `${t('BALANCE')}: ${amount}, ${t('HIGHEST_LOCK')}: ${amount - 1}` : ''
      } else {
        return ''
      }
    }
  },
  watch: {
    userObj(val) {},
    pageNo(val) {}
  }
}
</script>

<style lang="stylus" scoped>
.personal-container {
  padding: 20px;
}

.personal-top {
  padding: 28px 30px;
  width: 100%;
  border-radius: 6px;
  margin-bottom: 28px;
}

.personal-head-portrait {
  width: 116px;
  // margin-right: 40px;
}

.personal-head-canvas {
  width: 80px;
  border-radius: 50%;
}

.self-center {
  border-radius: 50%;
}

.set-nickname {
  width: 110px;
  padding: 2px 8px;
  border-radius: 15px;
  font-size: 16px;
  color: #ffffff;
  cursor: pointer;
  vertical-align: text-top;
}

.right-line {
  display: inline-block;
  width: 2px;
  height: 68px;
  background: #ddd;
  margin-top: 18px;
  margin-right: 30px;
}

.personal-qr {
  width: 103px;
  height: 100px;
}

.personal-qr-container {
  width: 100%;
  height: 100%;
}

.personal-qr-container img {
  width: 100%;
}

.personal-bottom {
  padding: 30px 0;
  border-radius: 6px;
}

.personal-bottom a {
  cursor: pointer;
  font-size: 18px;
}

.personal-bottom-title {
  margin-left: 22px;
}

.personal-bottom-title i {
  color: #43aea8;
  vertical-align: text-bottom;
  font-size: 22px;
  margin-right: 10px;
}

.personal-bottom-title span {
  color: #000000;
  font-size: 22px;
}

.left-ball {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #858c96;
  display: inline-block;
  vertical-align: sub;
  margin-right: 10px;
}

.bottom-left-link {
  width: 20%;
}

.personal-table-container tbody td {
  border: 1px solid #ccc;
  width: 78px;
  padding: 0;
  font-size: 16px;
  color: #000000;
}
</style>
