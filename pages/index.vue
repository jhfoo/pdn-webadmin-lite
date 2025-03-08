<template>
  <q-page class="q-px-lg">
    <div class="text-h6">What is this</div>
    <p class="q-pt-md">
      This is the web management interface for PowerDNS. It's unofficial, barely 
      secure, and intended for home use.
    </p>
    <p class="">
      Management is purely via PowerDNS API, authenticated by the API key. If 
      this works for you, proceed!
    </p>

    <div v-if="isSetupComplete">
      <q-table
        @row-click="onClickRow"
        :rows="zones"
        :columns="columns"
        row-key="name" dense>
        <template v-slot:top="props">
          <div class="q-table__title">Domains</div>

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

      {{  SelectedRecord }}
      <p class="text-h6 q-pt-md">
        Quasar Default Prop Values
      </p>
    </div>
    <div v-else>
      <div style="max-width: 400px; margin: 0 auto" align="center">
        Complete settings in the <a href="/setup">Setup tab</a> first, then<br/>
        <q-btn @click="checkSetup" class="q-my-md" outline>click here</q-btn><br/>
        to reload.
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

// route to settings if not set up
const isSetupComplete = ref(localStorage.getItem('ServerAddress'))
if (!isSetupComplete) {
  router.push('/setup')
}

import axios from 'axios'
import { useQuasar } from 'quasar'
import { useDrawerStore } from '@/stores/drawer'

import EditRRSet from '@/components/EditRRSet'

const drawer = useDrawerStore()
const DomainRecords = ref([])
const SelectedRecord = ref([])
const columns = ref([]) 

const $q = useQuasar()

columns.value = $q.screen.width > 412 ? [{
    name: 'rec',
    label: 'Zone',
    sortable: true,
    field: row => row.name,
    align: 'left',
  }, { 
    name: 'RecCount', 
    label: 'Records',
    field: row => row.rrsets.length,
    align: 'center' 
  }, { 
    name: 'actions', 
    label: 'Action',
    align: 'center' 
  }
] : [{
    name: 'rec',
    label: 'Zone',
    sortable: true,
    field: row => row.name,
    align: 'left',
  }, { 
    name: 'actions', 
    label: 'Action',
    align: 'center' 
  }
]

const zones = await getZones()

function checkSetup() {
  isSetupComplete.value = localStorage.getItem('ServerAddress')
}

function onClickRow(evt, row, idx) {
  // console.log(row)
  // console.log(idx)
  // console.log('zone = ' + row.name)
  router.push('/domain?zone=' + row.name.replace(/\.$/,''))
}

async function getZones() {
  try {
    const resp = await axios.get('http://192.168.130.25:8081/api/v1/servers/localhost/zones', {
      headers: {
        'X-API-KEY': 'changeme'
      }
    })

    console.log(resp.data)
    const ret = await Promise.all(resp.data.map(async (item) => {
      const rrsets = await getZoneRecords(item.name)
      return {
        name: item.name,
        rrsets: rrsets,
      }
    }))

    return ret 
  } catch (err) {
    console.error(err)
  }
}

async function getZoneRecords(zone) {
  const resp = await axios.get('http://192.168.130.25:8081/api/v1/servers/localhost/zones/' + zone, {
    headers: {
      'X-API-KEY': 'changeme'
    }
  }) 
  
  return resp.data.rrsets
}

async function onReload() {
  console.log('Reloading...')
  await getRecordsInZone(zone.value)
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
      zone: zone.value,
      rrset: row,
      // cmdRefresh: onReload,
    }
  )
  drawer.openRightDrawer(onReload)
}
</script>