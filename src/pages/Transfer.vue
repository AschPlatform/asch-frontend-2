<template>
  <q-card class="transfer-container  no-shadow q-p-lg">
    <div class="transfer-content shadow-2">
      <q-card-title>
        <span class="text-tertiary font-22">
            <i class="material-icons">border_color</i>
            </span>
        <span class="text-tertiary font-22">
            {{$t('TRS_TYPE_TRANSFER')}}
            </span>
        <span class="text-secondary font-12">
         {{$t('PAY_TIP')}}
           </span>
      </q-card-title>
      <span class="transfer-title-line"></span>
      <q-card-main class="row justify-left">
        <div class="col-10">
          <trans-panel class="col-12" :asset="asset" :user="user">
            <div class="col-12" slot="btns" slot-scope="props">
              <q-btn big class="transfer-accounts-btn" color="secondary" @click="props.send" :label="$t('TRS_TYPE_TRANSFER')" />
            </div>
          </trans-panel>
        </div>
      </q-card-main>
    </div>
  
  </q-card>
</template>

<script>
import TransPanel from '../components/TransPanel'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: ['userObj'],
  components: {
    TransPanel
  },
  data() {
    return {}
  },
  methods: {
    ...mapActions(['getBalance'])
  },
  async mounted() {},
  computed: {
    ...mapGetters(['userInfo', 'balances']),
    user() {
      return this.userInfo
    },
    asset() {
      if (this.user) {
        return {
          currency: 'XAS',
          precision: 8,
          balance: this.user.account.xas
        }
      } else {
        return null
      }
    }
  },
  watch: {}
}
</script>

<style lang="stylus" scoped>
.transfer-container {
  padding: 20px;
}

.transfer-content {
  padding: 40px;
  border-radius: 6px;
  background: #ffffff;
}

.transfer-description {
  display: inline-block;
}

.transfer-accounts-btn {
  width: 50%;
  max-width: 400px;
}

.transfer-title-line {
  display: block;
  width: calc(100% - 40px);
  height: 1px;
  background: #dddddd;
  margin-left: 10px;
}
</style>
