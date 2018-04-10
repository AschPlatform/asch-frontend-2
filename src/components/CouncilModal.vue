<template>
  <q-modal v-model="show" maximized no-esc-dismiss>
    <h5 class="q-px-md">理事会成员</h5>
    <div class="row q-px-md gutter-md">
      <div class="leftContain col-8">
        <q-table
          title="共7人"
          :data="tableData"
          :columns="columns"
        >

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
import { QModal, QTable, QCard, QCardTitle, QCardMain } from 'quasar'

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
      tableData: []
    }
  },
  props: ['show', 'item'],
  components: {
    QModal,
    QTable,
    QCard,
    QCardTitle,
    QCardMain
  }
}
</script>

<style lang="stylus" scoped>

</style>
