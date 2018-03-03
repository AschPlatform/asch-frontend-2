<template>
  <q-card v-if="this.assets" class="row col shadow-1">
    <q-card-title>
      {{$t('UPDATE_ACL')}}
      <div slot="subtitle">{{ACLStr(assets.acl)}}</div>
    </q-card-title>
    <q-card-main class="row col-12 justify-center ">
      <!-- <q-field class="col-12" :label="$t('CURRENT_MODE')" :label-width="2">
        <q-input :value="ACLStr(this.assets.acl)" clearable disable />
      </q-field> -->
  
      <q-field v-if="editType==1" class="col-12"  :label-width="2" :row="10">
        <q-chips-input :float-label="$t('ADD_LIST')" v-model="list" :placeholder="$t('ADDRESS')" add-icon="add" />
      </q-field>
  
      <q-field icon="list" class="col-8" :label="$t('CURRENT_LIST')">
        <q-option-group :disable="!!editType"  type="checkbox" color="secondary" v-model="selectList" :options="listOpts" />
      </q-field>
      <q-field class="col-8" label=" ">
        <q-pagination class="col-8" v-model="pagination.page" input :min="1" :max="pagination.rowsNumber" />
      </q-field>
      <q-field v-show="secondSignature" class="col-12" :label="$t('TRS_TYPE_SECOND_PASSWORD')" :label-width="2">
        <q-input type="password" v-model="secondPwd" />
      </q-field>
    </q-card-main>
    <q-card-separator />
    <q-card-main class="row col-12 justify-center ">
      <div class="row col-12 justify-end">
        <q-btn big class="col-auto " color="primary" @click="validateForm">
          {{$t('SUBMIT')}}
        </q-btn>
      </div>
    </q-card-main>

    <q-dialog v-model="dialogShow" prevent-close @ok="onOk" @cancel="onCancel">
      <!-- This or use "message" prop on <q-dialog> -->
      <span slot="message">{{$t('OPERATION_REQUIRES_FEE')+'0.2 XAS'}}</span>
  
      <template slot="buttons" slot-scope="props">
              <q-btn  flat color="primary" :label="$t('label.cancel')" @click="props.cancel" />
              <q-btn  flat color="primary" :label="$t('label.ok')" @click="props.ok" />
      </template>
    </q-dialog>
  </q-card>
</template>

<script>
import { createAcl } from '../utils/asch'
import { api, translateErrMsg } from '../utils/api'
import { toast, toastError } from '../utils/util'
import { secondPwdReg } from '../utils/validators'

export default {
  props: ['userObj'],
  data() {
    return {
      assets: null,
      aclData: null,
      secondPwd: '',
      list: [],
      dialogShow: false,
      selectList: [],
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 20
      },
      loading: false
    }
  },
  methods: {
    async getAcl() {
      this.loading = true
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res = await api.assetAcl({
        name: this.assets.name,
        flag: this.assets.acl,
        limit: limit,
        offset: (pageNo - 1) * limit
      })
      this.aclData = res
      // set max
      this.pagination.rowsNumber = Math.ceil(res.count/limit)
      this.loading = false
      return res
    },
    validateForm() {
      if (this.editType === 1) {
        if (this.list.length === 0) {
          toastError('Addresses empty... ')
          return
        }
      } else {
      }
      this.dialogShow = true
    },
    ACLStr(acl) {
      const t = this.$t
      return acl === 1 ? t('WHITELIST') : t('BLACKLIST')
    },
    reduceAcl() {},
    async onOk() {
      const { name, acl } = this.assets
      if (this.editType === 1) {
        const opt = '+'
        // let list = this.list.split('\n') || []
        const trans = createAcl(name, opt, acl, this.list, this.user.secret, this.secondPwd)
        let res = await api.broadcastTransaction(trans)
        if (res.success) {
          toast(this.$t('INF_OPERATION_SUCCEEDED'))
          this.resetForm()
        } else {
          translateErrMsg(this.$t, res.error)
        }
      } else if (this.editType === 0) {
      }
    },
    onCancel() {
      this.resetForm()
    },
    resetForm() {
      this.list = []
      this.secondPwd = ''
      this.dialogShow = false
      this.selectList = []
    }
  },
  mounted() {
    const assets = this.$route.params.assets
    if (!assets) {
      this.$router.go(-1)
      return
    }
    this.assets = assets
    if (this.editType === 2) {
    }
  },
  computed: {
    user() {
      return this.userObj
    },
    secondSignature() {
      return this.user ? this.user.account.secondSignature : null
    },
    editType() {
      let type = this.$route.name === 'addACL' ? 1 : 0
      this.getAcl()
      return type // 1 add ACL; 0 reduce ACL
    },
    pwdValid() {
      return !secondPwdReg.test(this.secondPwd)
    },
    listOpts() {
      if (!!this.aclData && this.aclData.list.length) {
        return this.aclData.list.map(item => {
          return {
            label: item.address,
            value: item.address
          }
        })
      } else {
        return []
      }
    }
  },
  watch: {
    page() {
      this.getAcl()
    }
  }
}
</script>

<style>

</style>
