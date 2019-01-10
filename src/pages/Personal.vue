<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <q-page>
    <q-card class="no-shadow" v-if="user">
      <q-card-main class="row col-12 justify-center">
        <div :class="personalTopClass">
          <div class="desktop-only">
            <jdenticon class="personal-head-canvas" :address="address" :size="60" />
          </div>
          <div class="col-md-6 col-xs-12 text-left row justify-left margin-left-10">
            <div>
              <span v-if="!userNickname" class="text-black font-22 vertical-align-middle">
                  {{$t('HELLO')}}
                </span>
              <span v-else class="text-black font-22 vertical-align-middle">
                  {{$t('HELLO')+'，'}}
                </span>
              <a class="font-14 set-nickname bg-secondary text-white vertical-align-middle" v-if="!userNickname" :label="$t('SET_NICKNAME')" @click="nicknameFormShow=true">{{$t('SET_NICKNAME')}}</a> <span v-else class="text-black font-22 vertical-align-middle">{{userNickname}}</span>
            </div>
            <div class="row col-12 justify-left text-five">
              <span class="col-md-12 col-xs-12 height-36">{{address}}<q-btn class="height-36 font-12 text-secondary" :class="isDesk?'padding-10':' copy-btn'" v-clipboard="address || 'no data'" @success="info($t('COPY_SUCCESS'))" flat icon="content copy" /></span>
            </div>
          </div>
          <div :class="personalTopQrClass">
            <span class="right-line desktop-only"></span>
            <div class="row justify-center" @click="showAddrQr">
              <vue-qr class="personal-qr-container" :size="103" :text="address"></vue-qr>
            </div>
          </div>
        </div>

        <!-- new resource card -->
        <div class="personal-bottom shadow-2 bg-white row col-12 justify-left margin-top-20">
          <div :class="personalIconClass">
            <i class="material-icons">email</i>
            <span class="font-18">
              {{$t('PERSONAL_MY_RESOURCE')}}
            </span>
          </div>
          <div class="row col-12 justify-between">
            <!-- bindwidth -->
            <div class="resource-box col-4">
              <div class="resource-inner column">
                <span class="resource-title">Bandwidth points</span>
                <span class="resource-record">{{pledgeDetail.netUsed || 0}} / {{pledgeDetail.netLimit || 0}}</span>
                <span class="resource-detail">{{$t('PERSONAL_PLEDGED')}} {{convertFee(pledgeDetail.pledgeAmountForNet) || 0}}XAS</span>
                <span class="resource-detail">{{$t('PERSONAL_REDEEM_TIME')}} {{countRedeemTimeNet}}</span>
                <div class="resouce-btn">
                  <q-btn @click="callPledgeModal('b')">{{$t('PERSONAL_ACTION_PLEDGE')}}</q-btn>
                  <q-btn @click="callRedeemModal('b')" :disable="!ableToRedeemNet">{{$t('PERSONAL_ACTION_REDEEM')}}</q-btn>
                </div>
              </div>
            </div>
            <!-- energy -->
            <div class="resource-box col-4">
              <div class="resource-inner column">
                <span class="resource-title">energy points</span>
                <span class="resource-record">{{pledgeDetail.energyUsed || 0}} / {{pledgeDetail.energyLimit || 0}}</span>
                <span class="resource-detail">{{$t('PERSONAL_PLEDGED')}} {{convertFee(pledgeDetail.pledgeAmountForEnergy) || 0}}XAS</span>
                <span class="resource-detail">{{$t('PERSONAL_REDEEM_TIME')}} {{countRedeemTimeEnergy}}</span>
                <div class="resouce-btn">
                  <q-btn @click="callPledgeModal('e')">{{$t('PERSONAL_ACTION_PLEDGE')}}</q-btn>
                  <q-btn @click="callRedeemModal('e')" :disable="!ableToRedeemEnergy">{{$t('PERSONAL_ACTION_REDEEM')}}</q-btn>
                </div>
              </div>
            </div>
            <!-- vote right -->
            <div class="resource-box col-4">
              <div class="resource-inner column">
                <span class="resource-title">{{$t('PERSONAL_VOTE_RIGHT')}}</span>
                <span class="resource-record">{{convertFee(lockInfo ? this.lockInfo.amount : 0)}}</span>
                <span class="resource-detail">{{$t('LOCK_DETAIL', {amount: lockInfo ? convertFee(this.lockInfo.amount) : 0})}}</span>
                <span class="resource-detail">{{lockInfo ? $t('LOCK_DETAIL_TIME', {date: this.lockInfo.time}) : 0}}</span>
                <div class="resouce-btn">
                  <q-btn @click="callLockPanel">{{$t('TRS_TYPE_LOCK')}}</q-btn>
                  <q-btn @click="unlock" :disable="this.lockInfo && !this.lockInfo.expire">{{$t('UNLOCK')}}</q-btn>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="personal-bottom shadow-2 bg-white row col-12 justify-left margin-top-20">
          <div :class="personalIconClass">
            <i class="material-icons">email</i>
            <span class="font-18">
              {{$t('MESSAGE_DETAILS')}}
            </span>
          </div>
          <table class="personal-table q-mt-md q-table bordered highlight responsive row">
            <tbody class='row info-tbody col-md-5 col-sm-12'>
                <tr class="row col-12">
                <td class="row col-12" :class="personalRightClass">
                  <span class="text-five font-16 min-width-120 text-left">{{$t('SECOND_PASSWORD')}}</span>
                  <span v-if="secondSignature" class="text-black font-16 ">
                    {{$t('ALREADY_SET')}}
                  </span>
                  <a v-else class="text-secondary font-16 " @click="secondPwdShow=true">
                    {{$t('SET_NOW')}}
                  </a>
                </td>
              </tr>
              <tr class="row col-12">
                <td class="row col-12" :class="personalRightTwoClass">
                  <span class="text-five font-16 min-width-120 text-left">{{$t('LOCK_POSITION_CONF')}}:</span>
                  <div class="col-6" :class="personalFontClass" v-if="lockInfo">
                    <span class="white-space-initial">
                      {{$t('LOCK_DETAIL',{amount:convertFee(this.lockInfo.amount)})}}
                      <br />
                      {{$t('LOCK_DETAIL_TIME',{date:this.lockInfo.time})}}
                    </span>
                    <a :class="personalClickClass" @click="callLockPanel">{{$t('EDIT')}}</a>
                    <a v-if="this.lockInfo.expire" :class="personalUnLockClass" @click="unlock">{{$t('UNLOCK')}}</a>
                  </div>
                  <a v-else class="text-secondary font-16 " @click="callLockPanel">
                    {{$t('SET_NOW')}}
                  </a>
                </td>
              </tr>
              <tr class="row col-12">
                <td class="row col-12" :class="personalRightClass">
                  <span class="text-five font-16 min-width-120 text-left">{{$t('AGENT_INFO')}}</span>
                  <span class="" :class="personalFontClass" v-if="isAgent || isDelegate === 1">
                    {{$t('IS_AGENT')}}
                  </span>
                  <a v-else class="text-secondary font-16 " @click="callDelegatePanel">
                    {{$t('REGISTER_AGENT')}}
                  </a>
                </td>
              </tr>
            </tbody>
            <span class="border-split col-md-1"></span>
            <tbody class="row info-tbody col-md-5 col-sm-12">
               <tr class="row col-12">
                <td class="row col-12" :class="personalRightClass">
                  <span class="text-five font-16 min-width-120 text-left">{{$t('PERSONAL_PUBLIC_KEY')}} :</span>
                  <span class="row shadow text-secondary font-16 min-height-0 padding-0  cursor-pointer" v-clipboard="user.publicKey"  @success="info($t('COPY_SUCCESS'))">{{$t('COPY_PUBLIC_KEY')}}</span>
                </td>
              </tr>
               <tr class="row col-12">
                <td class="row col-12" :class="personalRightClass">
                  <span class="text-five font-16 min-width-120 text-left">{{$t('QR_SECRET')}} :</span>
                  <a class="text-secondary font-16 " @click="showSecretQr()">
                    {{$t('CHECK_NOW')}}
                  </a>
                </td>
              </tr>
              <tr class="row col-12">
                <td class="row col-12" :class="personalRightThreeClass">
                  <span class="text-five font-16 min-width-120 text-left">{{$t('GATEWAY_CANDIDATE')}}</span>
                  <div class="" @click="jump2Doc">
                    <a class="text-secondary font-16">
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

    <!-- modal for P/R -->
    <q-dialog v-model="pledgeModal">
      <span slot="title">{{pledgeContent.title}}</span>
      <div slot="body" class="column">
        <div class="modal-tip">
          {{pledgeContent.tip}}
        </div>
        <div class="modal-main">
          <div class="text-center modal-main-sub">{{pledgeContent.main_tip}}</div>
          <div class="modal-input">
            <q-input type="number" v-model="pledgeNumber" suffix="XAS" hide-underline/>
          </div>
          <div class="text-center modal-main-sub">{{pledgeContent.suppose}}</div>
        </div>
        <q-field v-if="secondSignature" class="col-10" :label="$t('TRS_TYPE_SECOND_PASSWORD')" :error="secondPwdError" :label-width="3"  :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')">
          <q-input @blur="validateSecondPwd" type="password" v-model="secondPwd"  />
        </q-field>
      </div>
      <template slot="buttons" class="row justify-between" slot-scope="props">
        <q-btn :label="$t('label.cancel')" @click="resetPledge"></q-btn>
        <q-btn :label="$t('PERSONAL_ACTION_PLEDGE')" color="secondary" @click="actPledge"></q-btn>
      </template>
    </q-dialog>
    <q-dialog v-model="redeemModal">
      <span slot="title">{{redeemContent.title}}</span>
      <div slot="body" class="column">
        <div class="modal-tip">
          {{redeemContent.tip}}
        </div>
        <div class="modal-main">
          <div class="text-center modal-main-sub">{{redeemContent.main_tip}}</div>
          <div class="modal-input">
            <q-input type="number" :value="convertFee(pledgeNumber)" readonly suffix="XAS" hide-underline/>
          </div>
          <!-- <div class="text-center modal-main-sub">{{$t('REDEEM_SUPPOSE', {amount: 1000})}}</div> -->
        </div>
        <q-field v-if="secondSignature" class="col-10" :label="$t('TRS_TYPE_SECOND_PASSWORD')" :error="secondPwdError" :label-width="3"  :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')">
          <q-input @blur="validateSecondPwd" type="password" v-model="secondPwd"  />
        </q-field>
      </div>
      <template slot="buttons" class="row justify-between" slot-scope="props">
        <q-btn :label="$t('label.cancel')" @click="resetPledge"></q-btn>
        <q-btn :label="redeemContent.action" color="secondary" @click="actRedeem"></q-btn>
      </template>
    </q-dialog>

    <q-dialog v-model="dialogShow">
      <span slot="title">{{type=='secret'?$t('QRCODE'):$t('QRCODE_ADDRESS')}}</span>
      <div slot="body" class="row justify-center" @click="dialogShow=false">
        <vue-qr :text="qrValue"></vue-qr>
      </div>
    </q-dialog>
  
    <q-dialog :class="personalLockClass" v-model="secondPwdShow">
      <span slot="title">{{$t('SET_SECOND_PASSWORD')}}</span>
      <div slot="body" class="column justify-left">
        <q-field class="row col-12 secondPwd-field" :label="$t('PASSWORD')" :label-width="2" :error="$v.password.$error" :error-label="$t('ERR_SECOND_PASSWORD_FORMAT')">
          <q-input @blur="$v.password.$touch" :placeholder="$t('SECOND_PASSWORD_TIP')" type="password" v-model="password" orientation="vertical" />
        </q-field>
        <q-field class="col-12 secondPwd-field" :label="$t('CONFIRM')" :label-width="2" :error="$v.confirmPassword.$error" :error-label="$t('ERR_TWO_INPUTS_NOT_EQUAL')">
          <q-input @blur="$v.confirmPassword.$touch" :placeholder="$t('SECOND_PASSWORD_CONFIRM')" type="password" v-model="confirmPassword" orientation="vertical" />
        </q-field>
      </div>
      <template slot="buttons" class="row justify-between" slot-scope="props">
          <q-btn :label="$t('label.cancel')" class="col-3 self-lef" color="secondary" outline @click="reset(props)"/>
          <q-btn class="col-3 self-lef margin-left-10" color="secondary" @click="setPwd(props.ok)">
            {{$t('CONFIRM')}}
          </q-btn>
</template>
    </q-dialog>

    <q-dialog :class="personalLockClass" v-model="publicKeyShow">
      <div slot="body" class="width-500">
        <div class="col-12 text-center modal-title no-scroll">
          {{$t('PERSONAL_PUBLIC_KEY')}}
          <span class="transfer-title-line"></span>
        </div>
        <div class="q-mt-md">
          {{$t('PUBLIC_KEY_MODAL_TIP')}}
          <br>
          <div class="q-my-md word-wrap">
            {{user.publicKey}}
          </div>
          <div class="row width-100 q-ma-none q-pa-none">
            <div class="width-100 justify-center row">
              <q-btn color="secondary" v-clipboard="user.publicKey" rounded icon="content copy" class="q-px-sm row">
              </q-btn>
            </div>
          </div>
        </div>
      </div>
      <template slot="buttons" slot-scope="props">
        <div class="width-100 justify-center row">
          <q-btn color="secondary" :label="$t('label.close')" @click="publicKeyClose" />
        </div>
      </template>
      </div>
    </q-dialog>

    <q-dialog :class="personalLockClass" v-model="nicknameFormShow" >
      <span  slot="title">{{$t('SET_NICKNAME')}}</span>
      <div slot="body" class="row justify-center margin-t-54" >
        <q-field class="col-12" :error="$v.nickname.$error" :error-label="$t('ERR_NICKNAME')">
          <q-input @blur="$v.nickname.$touch" :placeholder="$t('NICKNAME_TIP')" v-model="nickname" @change="lowerName" />
        </q-field>
         <q-field class="col-12" v-show="secondSignature"  :error="secondPwdError" :label-width="4"  :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')">
          <q-input @blur="validateSecondPwd" :placeholder="$t('TRS_TYPE_SECOND_PASSWORD')" type="password" v-model="secondPwd"  />
        </q-field>
        <div :class="tableClass">
          <table class="col-12 q-table bordered personal-table-container responsive margin-top-20">
            <tbody>
              <tr>
              <td>{{$t('CHAR_NUM')}}</td>
               <td>2</td>
               <td>3</td>
               <td>4</td>
               <td>5</td>
               <td>6-10</td>
               <td>11-20</td>
              </tr>
              <tr>
              <td>{{$t('PRICE')}}</td>
                <td>200 XAS</td>
                <td>100 XAS</td>
                <td>80 XAS</td>
                <td>40 XAS</td>
                <td>10 XAS</td>
                <td>1 XAS</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <template slot="buttons" slot-scope="props">
        <q-btn :label="$t('label.cancel')" class="col-3 self-lef" color="secondary" outline @click="props.cancel()" />
        <q-btn class="col-3 self-lef" color="secondary" @click="setNickname(props.ok)">
          {{$t('CONFIRM')}}
        </q-btn>
      </template>
    </q-dialog>

    <q-dialog :class="personalLockClass" style="min-height: 120px" v-model="lockPanelShow">
      <span slot="title">{{$t('LOCK_POSITION_CONF')}}</span>
      <div slot="body" class="row justify-center" >
        <q-field class="col-10" :label="$t('NUM')" :label-width="3" :error="numError || $v.num.$error" :error-label="$t('ERR_LOCKAMOUNT', {num:lockableNum})" :helper="numLimit">
          <q-input @blur="validateNum" :placeholder="$t('LOCK_DETAIL_TIP')" type="number" :decimals="0" v-model="num" />
        </q-field>
         <q-field class="col-10" :label="$t('HEIGHT')" color="black" :label-width="3" :error="$v.time.$error" 
         :error-label="$t('ERR_NICKNAME')" :helper="$t('UNLOCK_TIPS')">
          <!-- <p class="text-secondary font-12">{{$t('UNLOCK_TIPS')}}</p> -->
          <q-datetime
          v-model="time"
          popover
          :min="miniumTime"
          :float-label="$t('SET_UNLOCK_TIME')"
          type="datetime" 
          format24h
        />
        </q-field>
        <q-field v-if="secondSignature" class="col-10" :label="$t('TRS_TYPE_SECOND_PASSWORD')" :error="secondPwdError" :label-width="3"  :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')">
          <q-input @blur="validateSecondPwd" type="password" v-model="secondPwd"  />
        </q-field>
      </div>
      <template slot="buttons" slot-scope="props">
        <q-btn :label="$t('label.cancel')" class="col-3 self-lef" color="secondary" outline @click="props.cancel()" />
        <q-btn class="col-3 self-lef" color="secondary" @click="editLock(props.ok)">
          {{$t('TRS_TYPE_LOCK')}}
        </q-btn>
      </template>
    </q-dialog>
  <user-agreement-modal :show="userAgreementShow" @confirm="registerAgent" @cancel="userAgreementShow=false" :title="$t('REGISTER_AGENT')" :content="$t('AGREEMENT_REGISTER_AGENT_CONTENT')" :tips="$t('REGISTER_AGENT')+$t('COST_FEE',{num:100})" />
  </q-page>
</template>

<script>
import VueQr from 'vue-qr'
import { required, sameAs } from 'vuelidate/lib/validators'
import { setSecondPwd, secondPwdReg, nicknameReg } from '../utils/validators'
import { toastWarn, toast, toastError, prompt, translateErrMsg, getTimeFromEndHeight } from '../utils/util'
import asch, { convertFee, fullTimestamp } from '../utils/asch'
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
      publicKeyShow: false,
      pledgeModal: false,
      redeemModal: false,
      pledgeNumber: 0,
      modalType: 'm',
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
      numError: false,
      btnDisable: false,
      isDisable: false,
      resource: {
        bandwidth: {
          pt: 3000,
          pledges: 100000000000,
          expire_time: 1646412346
        },
        energy: {
          pt: 3000,
          pledges: 100000000000,
          expire_time: 1646412346
        }
      }
    }
  },
  validations: {
    password: {
      required,
      secondPwd: setSecondPwd()
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
    num: {
      required,
      isValid(val) {
        return this.lockableNum < val
      }
    },
    time: {}
  },
  methods: {
    ...mapActions(['broadcastTransaction', 'setName', 'redeem', 'pledge', 'getPledgeDetail']),
    reset(props) {
      this.password = ''
      this.confirmPassword = ''
      this.$v.password.$reset()
      this.$v.confirmPassword.$reset()
      props.cancel()
    },
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
    // showQrcode(type) {
    //   this.type = type
    //   if (type === 'secret') {
    //     this.qrValue = this.user.secret
    //   } else {
    //     this.qrValue = this.user.account.address
    //   }
    //   this.dialogShow = true
    // },
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
      if (this.isDisable === true) {
        return
      }
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)
      toast(msg)
    },
    showAddrQr() {
      this.$root.$emit('showQRCodeModal', this.address, this.$t('QR_RECEIVE'))
    },
    showSecretQr() {
      this.$root.$emit('showQRCodeModal', this.user.secret, this.$t('QR_SECRET'))
    },
    async setNickname(done) {
      this.$v.nickname.$touch()
      if (this.$v.nickname.$error) {
        toastError(this.$t('ERR_NICKNAME'))
        return null
      } else {
        let fee
        let len = this.nickname.length
        if (len === 2) {
          fee = 20000000000
        } else if (len === 3) {
          fee = 10000000000
        } else if (len === 4) {
          fee = 8000000000
        } else if (len === 5) {
          fee = 4000000000
        } else if (len <= 10) {
          fee = 1000000000
        } else {
          fee = 100000000
        }
        let trans = asch.setName(this.nickname, fee, this.user.secret, this.secondPwd)
        let res = await this.broadcastTransaction(trans)
        if (res.success) {
          toast(this.$t('INF_OPERATION_SUCCEEDED'))
          this.nicknameFormShow = false
        } else {
          translateErrMsg(this.$t, res.error)
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
        translateErrMsg(t, res.error)
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
      } else {
        translateErrMsg(this.$t, res.error)
      }
    },
    validateNum() {
      let amount = convertFee(this.user.account.xas)
      this.numError = this.num >= amount
      return !this.num >= amount
    },
    async unlock() {
      const t = this.$t
      let lockHeight = this.user.account.lockHeight
      let height = this.latestBlock.height
      if (height <= lockHeight) {
        toastError(this.$t('HEIGHT_NOT_ARRIVE'))
      } else {
        if (this.secondSignature) {
          prompt(
            {
              title: t('TRS_TYPE_UNLOCK'),
              message: t('TRS_TYPE_SECOND_PASSWORD'),
              prompt: {
                model: '',
                type: 'password' // optional
              }
            },
            data => {
              this.secondPwd = data
              this.doUnlock()
            }
          )
        } else {
          this.doUnlock()
        }
      }
    },
    async doUnlock() {
      let trans = asch.unlock(this.userInfo.secret, this.secondPwd)
      let res = await this.broadcastTransaction(trans)
      if (res.success === true) {
        toast(this.$t('INF_OPERATION_SUCCEEDED'))
      } else {
        translateErrMsg(this.$t, res.error)
      }
    },
    jump2Doc() {
      openURL('https://github.com/AschPlatform/asch-docs')
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
    publicKeyClose() {
      this.publicKeyShow = false
    },
    lowerName(val) {},
    // pledge
    callPledgeModal(m) {
      this.modalType = m
      this.pledgeModal = true
    },
    callRedeemModal(m) {
      this.modalType = m
      switch (m) {
        case 'e':
          this.pledgeNumber = this.pledgeDetail.pledgeAmountForEnergy
          break
        case 'b':
          this.pledgeNumber = this.pledgeDetail.pledgeAmountForNet
          break
      }
      this.redeemModal = true
    },
    actPledge() {
      let result = this.pledge({
        bandwidth: this.modalType === 'b' ? this.pledgeNumber * Math.pow(10, 8) : 0,
        energy: this.modalType === 'e' ? this.pledgeNumber * Math.pow(10, 8) : 0,
        secondSecret: this.secondPwd
      })
      if (result) {
        this.resetPledge()
        toast(this.$t('PLEDGE_ACTION_SUCCESS'))
      }
    },
    actRedeem() {
      let result = this.redeem({
        bandwidth: this.modalType === 'b' ? this.pledgeNumber : 0,
        energy: this.modalType === 'e' ? this.pledgeNumber : 0,
        secondSecret: this.secondPwd
      })
      if (result) {
        this.resetPledge()
        toast(this.$t('REDEEM_ACTION_SUCCESS'))
      }
    },
    // async updatePledge() {
    //   let result = await this.getPledgeDetail({
    //     address: this.address
    //   })
    //   if (result) {
    //     console.log(result)
    //   }
    // },
    resetPledge() {
      this.pledgeNumber = 0
      this.secondPwd = ''
      this.pledgeModal = false
      this.redeemModal = false
    }
  },
  async mounted() {
    if (this.lockInfo) {
      this.time = this.lockInfo.time
      this.num = convertFee(this.lockInfo.amount, 8)
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'latestBlock', 'pledgeDetail']),
    personalTopClass() {
      return this.isDesk
        ? 'col-12 row justify-left shadow-2 bg-white personal-top-desktop'
        : 'col-12 row justify-left shadow-2 bg-white border-r-6 personal-top-mobile'
    },
    personalTopQrClass() {
      return this.isDesk
        ? 'col-md-3 col-xs-12 personal-qr row justify-left text-left'
        : 'col-md-3 col-xs-12 personal-qr row justify-center text-left'
    },
    personalIconClass() {
      return this.isDesk
        ? 'personal-bottom-title margin-left-24'
        : 'personal-bottom-title margin-left-10'
    },
    personalRightClass() {
      return this.isDesk
        ? 'col-md-12 col-xs-6 justify-start padding-left-55'
        : 'justify-between col-md-8 col-xs-12 text-right'
    },
    personalRightTwoClass() {
      return this.isDesk ? 'col-md-12 col-xs-8 justify-start padding-left-55' : ' justify-between col-md-8 col-xs-12 text-right'
    },
    personalRightThreeClass() {
      return this.isDesk
        ? 'col-md-12 col-xs-7 justify-start padding-left-55'
        : 'justify-between col-md-8 col-xs-7 text-right'
    },
    personalFontClass() {
      return this.isDesk ? 'font-16' : 'font-12'
    },
    personalClickClass() {
      return this.isDesk ? 'text-secondary font-16' : 'text-secondary font-12'
    },
    personalUnLockClass() {
      return this.isDesk ? 'text-secondary font-16' : 'text-secondary font-12'
    },
    personalLockClass() {
      return this.isDesk ? 'minimized modal-content-limit' : 'maximized'
    },
    tableClass() {
      return this.isDesk ? 'col-12' : 'col-12 table-container'
    },
    user() {
      return this.userInfo
    },
    secondSignature() {
      if (this.user && this.user.account && this.user.account.secondPublicKey) {
        return this.user ? this.user.account.secondPublicKey : null
      }
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
      if (this.userInfo && this.userInfo.account && this.userInfo.account.address) {
        return this.userInfo && this.userInfo.account ? this.userInfo.account.address : 'nothing'
      }
    },
    userNickname() {
      if (this.user && this.user.account && this.user.account.name) {
        return this.user.account.name
      }
    },
    isDelegate() {
      if (this.user && this.user.account) {
        return this.user.account.isDelegate
      }
    },
    isAgent() {
      if (this.user && this.user.account) {
        return this.user.account.isAgent
      }
    },
    lockInfo() {
      if (this.user && this.user.account && this.user.account.isLocked) {
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
      if (this.user && this.user.account) {
        let amount = convertFee(this.user.account.balance)
        const t = this.$t
        return amount > 1 ? `${t('BALANCE')}: ${amount}, ${t('HIGHEST_LOCK')}: ${amount - 1}` : ''
      } else {
        return ''
      }
    },
    miniumTime() {
      let minTime
      if (this.lockInfo) {
        if (this.lockInfo.time) {
          minTime = date.addToDate(this.lockInfo.time, {
            days: 31
          })
        } else {
          let today = new Date()
          minTime = date.addToDate(today, {
            days: 31
          })
        }
      } else {
        let today = new Date()
        minTime = date.addToDate(today, {
          days: 31
        })
      }
      return minTime
    },
    lockableNum() {
      if (this.user && this.user.account && this.user.account.xas) {
        let left = convertFee(this.user.account.xas)
        if (left <= 1.1) {
          return left + 'XAS' + this.$t('ACCOUNT_LEFT_UNSUFF')
        }
        return (left - 2.1).toFixed() + 'XAS'
      }
      return 0
    },
    pledgeContent() {
      if (this.modalType) {
        switch (this.modalType) {
          case 'b':
            return {
              title: this.$t('PLEDGE_BANDWIDTH'),
              tip: this.$t('PLEDGE_TIP'),
              main_tip: this.$t('PLEDGE_MAIN_TIP'),
              action: this.$t('PERSONAL_ACTION_PLEDGE'),
              // add amount computed
              suppose: this.$t('PLEDGE_SUPPOSE_B', {amount: this.pledgeDetail.netPerPledgedXAS * this.pledgeNumber})
            }
          case 'e':
            return {
              title: this.$t('PLEDGE_ENERGY'),
              tip: this.$t('PLEDGE_TIP'),
              main_tip: this.$t('PLEDGE_MAIN_TIP'),
              action: this.$t('PERSONAL_ACTION_PLEDGE'),
              // add amount computed
              suppose: this.$t('PLEDGE_SUPPOSE_E', {amount: this.pledgeDetail.energyPerPledgedXAS * this.pledgeNumber})
            }
        }
      }
      return {}
    },
    redeemContent() {
      if (this.modalType) {
        switch (this.modalType) {
          case 'b':
            return {
              title: this.$t('REDEEM_BANDWIDTH'),
              tip: this.$t('REDEEM_TIP'),
              main_tip: this.$t('REDEEM_MAIN_TIP'),
              action: this.$t('PERSONAL_ACTION_REDEEM')
            }
          case 'e':
            return {
              title: this.$t('REDEEM_ENERGY'),
              tip: this.$t('REDEEM_TIP'),
              main_tip: this.$t('REDEEM_MAIN_TIP'),
              action: this.$t('PERSONAL_ACTION_REDEEM')
            }
        }
      }
      return {}
    },
    countRedeemTimeNet() {
      if (this.pledgeDetail && this.pledgeDetail.netLockHeight) {
        return getTimeFromEndHeight({
          endHeight: 8640 * 3 + Number(this.pledgeDetail.netLockHeight),
          currentHeight: Number(this.latestBlock.height)
        })
      }
    },
    countRedeemTimeEnergy() {
      if (this.pledgeDetail && this.pledgeDetail.energyLockHeight) {
        return getTimeFromEndHeight({
          endHeight: 8640 * 3 + Number(this.pledgeDetail.energyLockHeight),
          currentHeight: Number(this.latestBlock.height)
        })
      }
    },
    ableToRedeemNet() {
      let { height } = this.latestBlock
      if (height > this.pledgeDetail.netLockHeight + 3 * 8640) {
        return true
      }
      return false
    },
    ableToRedeemEnergy() {
      let { height } = this.latestBlock
      if (height > this.pledgeDetail.energyLockHeight + 3 * 8640) {
        return true
      }
      return false
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

.personal-top-desktop {
  padding: 28px 30px;
  width: 100%;
  border-radius: 6px;
  // margin-bottom: 28px;
}

.personal-top-mobile {
  padding: 20px 0px;
}

.personal-head-canvas {
  width: 60px;
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
  // width: 103px;
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
  font-size: 16px;
}

.personal-bottom-title i {
  color: #43aea8;
  vertical-align: text-bottom;
  font-size: 22px;
  margin-right: 5px;
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
  // width: 20%;
}

.table-container {
  overflow: scroll;
}

.personal-table-container tbody td {
  border: 1px solid #ccc;
  width: 78px;
  padding: 0;
  font-size: 16px;
  color: #000000;
}

.secondPwd-field {
  width: 400px;
}

.white-space-initial {
  white-space: initial;
}

.text-right {
  text-align: right;
}

.modal-content-limit > div {
  max-width: 600px;
}

.border-split {
  border-left: solid #ddd 2px;
}

.word-wrap {
  word-break: break-all;
}

.width-500 {
  max-width: 500px;
}

.transfer-title-line {
  display: block;
  width: calc(100% - 40px);
  height: 1px;
  background: #dddddd;
  margin-left: 10px;
}

.min-width-120 {
  min-width: 120px;
}

.padding-left-55{
  padding-left:55px;
}

.copy-btn{
  padding: 0px 0px 0px 5px;
}

.resource-box
  text-align center
  padding 24px
  .resource-inner
    background-color grey
    padding 8px
    border-radius 6px

.modal-tip
  background-color grey
  padding 10px
.modal-main
  padding 10px
  .modal-main-sub
    margin 10px 0
  .modal-input
    border 1px solid
    padding 10px
</style>
