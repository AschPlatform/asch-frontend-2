<template>
  <q-modal v-model="show" maximized no-esc-dismiss>
    <div class="no-wrap q-pa-md row justify-between">
      <h5 class="q-px-md inline-block">{{$t('COUNCIL_MEMBER')}}</h5>
      <q-btn color="warning" class="self-center" @click="closeModal">
        {{$t('CANCEL')}}
      </q-btn>
    </div>
    <div class="row q-px-md gutter-md">
      <div class="leftContain col-8">
        <q-table
          :title="$t('COUNCIL_PAGE.MODAL_TITLE', {number: tableData.length})"
          :data="tableData"
          :columns="columns"
          :pagination.sync="pagination"
          @request="request"
          :loading="loading"
        >
        <q-td slot="body-cell-operation"  slot-scope="props" :props="props">
          <div class="text-primary" @click="viewAccountInfo(props.row)">
            {{$t('COUNCIL_PAGE.OPERATION')}}
          </div>
        </q-td>
        </q-table>
      </div>
      <div class="rightContain col-4">
        <q-card align="center">
          <q-card-title>
            {{item.name}}
          </q-card-title>
          <q-card-main>
            {{item.desc}}
          </q-card-main>
        </q-card>
      </div>
    </div>
  </q-modal>
</template>

<script>
import { QModal, QTable, QCard, QCardTitle, QCardMain, QBtn } from 'quasar'

export default {
  name: 'CouncilModal',
  data() {
    return {
      columns: [
        {
          name: 'member',
          required: true,
          label: this.$t('COUNCIL_PAGE.MEMBER'),
          align: 'center',
          field: 'member'
        },
        {
          name: 'address',
          required: true,
          label: this.$t('COUNCIL_PAGE.ADDRESS'),
          align: 'center',
          field: 'address'
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
        rowsNumber: this.item.members.length,
        rowsPerPage: 20
      },
      loading: false,
      tableData: []
    }
  },
  props: ['show', 'item'],
  components: {
    QModal,
    QTable,
    QCard,
    QCardTitle,
    QCardMain,
    QBtn
  },
  methods: {
    viewAccountInfo(row) {
      this.$root.$emit('openAccountModal', row.address)
    },
    compileData() {
      return this._.map(this.item.members, (val) => {
        return {
          address: val,
          member: ''
        }
      })
    },
    sliceArray() {
      let arr = this.compileData()
      let limit = Number(this.pagination.rowsPerPage)
      let pageNo = Number(this.pagination.page)
      let offset = Number((pageNo - 1) * limit)
      this.tableData = arr.slice(offset, offset + limit)
    },
    closeModal() {
      this.$emit('callModal', {
        status: false,
        item: {}
      })
    },
    async request(props) {
      this.loading = true
      this.pagination = props.pagination
      this.filter = props.filter
      await this.sliceArray()
      this.loading = false
    }
  },
  mounted() {
    this.sliceArray()
  },
  computed: {
  }
}
</script>

<style lang="stylus" scoped>

</style>
