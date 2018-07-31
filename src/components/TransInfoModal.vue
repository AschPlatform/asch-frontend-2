<template>
<q-modal minimized content-class="modal-content-limit" no-backdrop-dismiss  v-model="show" content-css="padding: 20px">
      <big>{{$t('DAPP_DETAIL')}}</big>
      <table v-if="row" class="q-table horizontal-separator highlight loose ">
        <tbody class='info-tbody'>
          <!-- <tr v-clipboard="row.id || 'no data'" @success="info('copy ID success...')">
            <td >{{'ID'}}</td>
            <td >{{row.id}}</td>
          </tr>
          <tr>
            <td >{{$t('TYPE')}}</td>
            <td >{{getTransType(row.type)}}</td>
          </tr> -->
          <tr  v-clipboard="row.senderId || 'no data'" @success="info($t('COPY_SUCCESS'))">
            <td >{{$t('SENDER')}}</td>
            <td >{{row.senderId}}</td>
          </tr>
          <tr v-clipboard="row.recipientId || 'no data'" @success="info($t('COPY_SUCCESS'))">
            <td >{{$t('RECIPIENT')}}</td>
            <td >{{row.recipientId}}</td>
          </tr>
          <tr v-clipboard="this.formatTimestamp(row.timestamp) || 'no data'" @success="info($t('COPY_SUCCESS'))">
            <td >{{$t('DATE')}}</td>
            <td >{{this.formatTimestamp(row.timestamp)}}</td>
          </tr>
          <tr v-clipboard="getAmountNFee(row) || 'no data'" @success="info($t('COPY_SUCCESS'))">
            <td >{{this.$t('AMOUNTS')}}</td>
            <td >{{getAmountNFee(row)}}</td>
          </tr>
          <tr v-clipboard="row.message || 'no data'" @success="info($t('COPY_SUCCESS'))">
            <td >{{$t('REMARK')}}</td>
            <td >{{row.message}}</td>
          </tr>
        </tbody>
      </table>
      <br/>
      <q-btn
        color="primary"
        @click="$emit('close')"
        label="Close"
      />
    </q-modal>
</template>
<script>
import { QModal, QBtn } from 'quasar'
import { transTypes } from '../utils/constants'
import { fullTimestamp, convertFee } from '../utils/asch'

export default {
  name: 'TransInfoModal',
  components: { QModal, QBtn },
  props: ['show', 'row'],
  data() {
    return {}
  },
  methods: {
    getAmountNFee(data) {
      const { amount } = data
      return convertFee(amount)
    },
    getTransType(val) {
      return this.$t(transTypes[val])
    },
    formatTimestamp(timestamp) {
      return fullTimestamp(timestamp)
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>