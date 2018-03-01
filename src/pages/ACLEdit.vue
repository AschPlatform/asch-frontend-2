<template>
  <div v-if="this.$route.params.assets">
    <q-field class="col-8" :label="$t('CURRENT_MODE')" :label-width="3" :error="$v.issuer.name.$error">
      <q-input :value="ACLStr(this.assets.acl)" clearable disable />
    </q-field>
  
    <q-field v-if="editType==1" class="col-8" :label="$t('DESCRIBE')" :label-width="3" :error="$v.issuer.desc.$error" :row="10">
      <q-input type="textarea" v-model="list" clearable />
    </q-field>
  
    <q-field v-if="editType==0" icon="list" label="$t('CURRENT_LIST')">
      <q-option-group type="checkbox" color="secondary" v-model="selectList" :options="[]" />
    </q-field>
    <q-pagination v-if="editType==0" v-model="pagination.page" color="secondary" :min="1" :max="this.pagination.rowsNumber" :max-pages="5" />
    <q-field v-show="secondSignature" class="col-8" :label="$t('TRS_TYPE_SECOND_PASSWORD')" :error="secondPwdError" :label-width="2">
      <q-input type="password" v-model="secondPwd" />
    </q-field>
  
    <q-dialog v-model="dialogShow" prevent-close @ok="onOk" @cancel="onCancel">
      <!-- This or use "message" prop on <q-dialog> -->
      <span slot="message">{{$t('OPERATION_REQUIRES_FEE')+'0.2 XAS'}}</span>
  
      <template slot="buttons" slot-scope="props">
            <q-btn  flat color="primary" :label="$t('label.cancel')" @click="props.cancel" />
            <q-btn  flat color="primary" :label="$t('label.ok')" @click="props.ok" />
      </template>
    </q-dialog>
  </div>
</template>

<script>
import { createAcl } from '../utils/asch'
import { api, translateErrMsg } from '../utils/api'
import { toast } from '../utils/util'

export default {
  props: ['userObj'],
  data() {
    return {
      assets: null,
      secondPwd: '',
      list: [],
      dialogShow: false,
      selectList: [],
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      loading: false
    }
  },
  methods: {
    async getAcl() {
      this.loading = true
      if (pagination.page) this.pagination = pagination
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
      this.pagination.rowsNumber = res.count
      this.loading = false
      return res
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
        let list = this.list.split('\n') || []
        const trans = createAcl(name, opt, acl, list, this.user.secret, this.secondPwd)
        let res = await api.broadcastTransaction(trans)
        if (res.success) {
          toast(this.$t('INF_OPERATION_SUCCEEDED'))
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
    if (!assets) this.$router.go(-1)
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
      if (type == 2) {
        this.getAcl()
      }
      return type // 1 add ACL; 0 reduce ACL
    },
    pwdValid() {
      return !secondPwdReg.test(this.secondPwd)
    },
    listOpts() {
      if (this.aclData) {
        return this.aclData.map(item => {
          return { label: item.address, value: item.address }
        })
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
