<template>
  <q-modal minimized no-backdrop-dismiss v-model="show" content-css="padding: 20px">
    <big>{{$t('DAPP_DETAIL')}}</big>
    <table class="q-table horizontal-separator highlight loose ">
      <tbody class='info-tbody'>
        <tr disable v-clipboard="account.address || 'no data'" @success="info('copy address success...')">
          <td>{{$t('ADDRESS')}}</td>
          <td>{{account.address}}</td>
        </tr>
        <tr v-if="account.name">
          <td>{{$t('NICKNAME')}}</td>
          <td>{{account.name}}</td>
        </tr>
        <tr v-clipboard="account.balance || 'no data'" @success="info('copy balance success...')">
          <td>{{$t('BALANCE')}}</td>
          <td>{{account.xas | fee}}</td>
        </tr>
        <tr v-if="account.isLocked">
          <td>{{$t('LOCK_POSITION')}}{{$t('HEIGHT')}}</td>
          <td>{{account.lockHeight}}</td>
        </tr>
      </tbody>
    </table>
    <br/>
    <q-btn color="primary" @click="close" :label="$t('label.close')" />
  </q-modal>
</template>

<script>
import { toast } from '../utils/util'
export default {
  props: ['show', 'account'],
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
