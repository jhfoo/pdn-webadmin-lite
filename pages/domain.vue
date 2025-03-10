<template>
  <q-page class="q-px-lg">
    <div class="text-h6">Zone: {{ zone }}</div>
    <p class="q-pt-md">
      This is the web management interface for PowerDNS. It's unofficial, barely 
      secure, and intended for home use.
    </p>
    <p class="">
      Management is purely via PowerDNS API, authenticated by the API key. If 
      this works for you, proceed!
    </p>

    <!-- selection="single"
      v-model:selected="SelectedRecord"> -->
    <q-table
      :rows="DomainRecords"
      :columns="columns"
      row-key="name" dense>
      <template v-slot:top="props">
        <div class="q-table__title">{{ route.query.zone }}</div>

        <q-space />

        <div >
          <q-btn @click="onReload()" flat>Reload</q-btn>
          <q-btn @click="onNew()" flat>New</q-btn>
        </div>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="mode_edit" @click="onEdit(props.row)" flat></q-btn>
          <!-- <q-btn v-if="$q.screen.gt.xs" icon="delete" @click="onDelete(props.row)" flat></q-btn> -->
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useQuasar } from 'quasar'
import { useDrawerStore } from '@/stores/drawer'
import EditRRSet from '@/components/EditRRSet'
import { useRoute } from 'vue-router'
import { usePdns } from '@/composables/pdns'
const pdns = usePdns()

const drawer = useDrawerStore()
const DomainRecords = ref([])
const SelectedRecord = ref([])
const columns = ref([])
const route = useRoute()

const $q = useQuasar()

columns.value = $q.screen.width > 412 ? [{
    name: 'rec',
    label: 'Record',
    sortable: true,
    field: row => row.name,
    align: 'left',
  }, {
    name: 'type',
    label: 'Type',
    sortable: true,
    field: row => row.type,
    align: 'center'
  }, {
    name: 'ttl',
    label: 'TTL',
    sortable: true,
    field: row => row.ttl,
  }, {
    name: 'value',
    label: 'Value',
    sortable: true,
    field: row => row.value,
  },{
    name: 'count',
    label: 'Count',
    field: row => row.ValueCount,
    align: 'center',
  }, { 
    name: 'actions', 
    label: 'Action',
    align: 'center' 
  }
] : [{
    name: 'rec',
    label: 'Record',
    sortable: true,
    field: row => row.name,
    align: 'left',
  },{
    name: 'value',
    label: 'Value',
    sortable: true,
    field: row => row.value,
  }, { 
    name: 'actions', 
    label: 'Action',
    align: 'center' 
  }
]

const DEFAUlT_TTL = 300
const DEFAULT_TYPE = 'A'
let zone = localStorage.getItem('LastDomain')
await getRecordsInZone('kungfoo.local')

if (route.query.zone) {
  localStorage.setItem('LastDomain', route.query.zone)
  zone = route.query.zone
}

async function getRecordsInZone() {
  try {
    const resp = await pdns.get('/api/v1/servers/localhost/zones/' + zone)

    const MAX_VALUE_LEN = 20

    DomainRecords.value = resp.data.rrsets.map((item) => {
      const values = item.records.map((record) => {
        return record.content.length <= MAX_VALUE_LEN ? record.content : record.content.substring(0,MAX_VALUE_LEN - 3) + '...'
      })

      return {
        name: item.name.startsWith(zone) ? '' : item.name.replace('.' + zone + '.', ''),
        value: values[0],
        ValueCount: values.length,
        type: item.type,
        ttl: item.ttl,
        data: item,
      }
    }).sort((a,b) => {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    })
    console.log(resp.data.rrsets)
  } catch (err) {
    console.error(err)
  }
}

async function onReload() {
  console.log('Reloading...')
  await getRecordsInZone(zone)
}

function onNew() {
  onEdit({
    data: {
      type: DEFAULT_TYPE,
      ttl: DEFAUlT_TTL,
      records: [{
        content: null,
      }]
    }
  })  
}

function onEdit(row) {
  drawer.setDrawerComponent(shallowRef(EditRRSet), 
    {
      zone: zone,
      rrset: row,
      // cmdRefresh: onReload,
    }
  )
  drawer.openRightDrawer(onReload)
}
</script>