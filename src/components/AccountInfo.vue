<template>
  <q-modal minimized no-backdrop-dismiss v-model="show" content-css="padding: 20px">
    <big>{{$t('DAPP_DETAIL')}}</big>
    <table class="q-table horizontal-separator highlight loose accountinfo-table margin-t-20">
      <tbody class='info-tbody'>
        <tr disable v-clipboard="account.address || 'no data'" @success="info('copy address success...')">
          <td>{{$t('ADDRESS')}}</td>
          <td>{{account.address}}</td>
        </tr>
        <tr v-if="account.name">
          <td>{{$t('NICKNAME')}}</td>
          <td>{{account.name}}</td>
        </tr>
        <tr v-clipboard="account.xas || 'no data'" @success="info('copy balance success...')">
          <td>{{$t('BALANCE')}}</td>
          <td>{{account.xas | fee}}&nbsp;&nbsp;XAS</td>
        </tr>
        <tr v-if="account.isLocked">
          <td>{{$t('LOCK_POSITION')}}{{$t('HEIGHT')}}</td>
          <td>{{account.lockHeight}}</td>
        </tr>
      </tbody>
    </table>
    <br/>
    <q-btn color="secondary" @click="close" :label="$t('label.close')" />
  </q-modal>
</template>

<script>
import { toast } from '../utils/util'
import { QModal, QBtn } from 'quasar'
export default {
  props: ['show', 'account'],
  components: { QModal, QBtn },
  data() {
    return {}
  },
  methods: {
    close() {
      this.$emit('close')
    },
    info(msg) {
      toast(msg)
    }
  },
  computed: {},
  mounted() {}
}
</script>
<style lang="stylus" scoped>
.accountinfo-table tbody tr td {
  border: 1px solid #dddddd;
}

.accountinfo-table tbody tr td:nth-child(1) {
  text-align: right;
}
</style>
