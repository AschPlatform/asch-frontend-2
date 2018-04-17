<template>
  <q-modal v-model="show" maximized no-esc-dismiss>
    <div class="no-wrap q-pa-md row justify-between">
      <h5 class="q-px-md inline-block">{{$t('COUNCIL_MEMBER')}}</h5>
      <q-btn color="warning" class="self-center" @click="$emit('close')">
        {{$t('CANCEL')}}
      </q-btn>
    </div>
    <div class="row q-px-md gutter-md">
      <div class="col-8">
        <q-table
          :title="$t('COUNCIL_PAGE.MODAL_TITLE', {number: datas.length})"
          :data="datas"
          :columns="columns"
          :pagination.sync="pagination"
          @request="request"
          :loading="loading"
        >

        <q-td slot="body-cell-operation"  slot-scope="props" :props="props">
          <div class="text-primary" @click="viewAccountInfo(props.row)">
            {{$t('CHECK')}}
          </div>
        </q-td>

        <!-- <q-td slot="body-cell-"  slot-scope="props" :props="props">
          <div class="text-primary" @click="viewAccountInfo(props.row)">
            {{$t('CHECK')}}
          </div>
        </q-td> -->

        </q-table>
      </div>
      <div class="col-4">
        <q-card align="center">
          <q-card-title>
            {{item.name}}
          </q-card-title>
          <q-card-main>
            {{item.desc}}
          </q-card-main>
        </q-card>
        <q-card align="center">
          <q-card-title>
            {{$t('UPDATE_LIMIT')}}
          </q-card-title>
          <q-card-main>
            {{convertFrequency(item.updateInterval)}}
          </q-card-main>
        </q-card>
      </div>
    </div>
  </q-modal>
</template>

<script>
import { QModal, QTable, QCard, QCardTitle, QCardMain, QBtn } from 'quasar'
import { mapActions } from 'vuex'

export default {
  name: 'GatewayModal',
  props: ['show', 'item'],
  components: {
    QModal,
    QTable,
    QCard,
    QCardTitle,
    QCardMain,
    QBtn
  },
  data() {
    return {
      columns: [
        {
          name: 'gateway',
          required: true,
          label: this.$t('COUNCIL_PAGE.MEMBER'),
          align: 'center',
          field: 'gateway'
        },
        {
          name: 'desc',
          required: true,
          label: this.$t('DESCRIBE'),
          align: 'center',
          field: 'desc'
        },
        {
          name: 'address',
          required: true,
          label: this.$t('COUNCIL_PAGE.ADDRESS'),
          align: 'center',
          field: 'address'
        },
        {
          name: 'elected',
          required: true,
          label: this.$t('ELECTED'),
          align: 'center',
          field: 'elected'
        },
        {
          name: 'operation',
          required: true,
          label: this.$t('COUNCIL_PAGE.OPERATION'),
          align: 'center',
          field: 'operation'
        }
      ],
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 1
      },
      loading: false,
      datas: []
    }
  },

  methods: {
    ...mapActions(['getGatewayDelegates']),
    viewAccountInfo(row) {
      this.$root.$emit('openAccountModal', row.address)
    },
    compileData() {
      return this._.map(this.item.members, val => {
        return {
          address: val,
          member: ''
        }
      })
    },
    async loadData() {
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res = await this.getGatewayDelegates({
        limit: limit,
        offset: (pageNo - 1) * limit,
        name: this.item.name
      })
      if (res.success) {
        this.datas = res.validators
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
    }
  },
  mounted() {
    this.loadData()
  },
  computed: {},
  watch: {
    item(val) {
      if (val) this.loadData()
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
