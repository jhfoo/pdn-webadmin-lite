k<template>
  <q-toolbar>
    <q-toolbar-title>{{ getTitle() }}</q-toolbar-title>

    <q-btn dense flat round icon="close" @click="drawer.closeRightDrawer"  />
  </q-toolbar>
  <div class="q-px-md">
    <q-input v-model="RrsetZone" label="Zone" borderless disable/>
    <q-input v-model="RrsetType" label="Type" borderless disable/>
    <q-input v-model="rrset.value" label="Value"/>
    <q-input v-model="rrset.ttl" label="TTL"/>
    <q-btn-group class="q-pt-md" spread flat>
      <q-btn @click="drawer.closeRightDrawer" color="yellow" label="Cancel" icon="close" flat />
      <q-btn @click="onUpdate" color="red" label="Delete" icon="delete" flat/>
      <q-btn @click="onUpdate" color="green" label="Update" icon="visibility" flat/>
    </q-btn-group>
  </div>
</template>

<script setup lang="ts">
import { useDrawerStore } from '@/stores/drawer'
import axios from 'axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const drawer = useDrawerStore()
const props = defineProps(['zone', 'rrset'])
const RrsetZone = props.zone
const RrsetType = props.rrset.type

function getTitle() {
  if (props.rrset.name) {
    return props.rrset.name
  } 
  // else
  return 'New RRSet'
}

async function onUpdate() {
  try {
    const resp = await axios.patch('http://192.168.130.25:8081/api/v1/servers/localhost/zones/' + props.zone, {
      rrsets: [{
        name: props.rrset.name,
        type: props.rrset.type,
        ttl: props.rrset.ttl,
        changetype: 'REPLACE',
        records: [{
          content: props.rrset.value,
          disabled: false,
        }]
      }]
    }, {
      headers: {
        'X-API-KEY': 'changeme'
      }
    })
    console.log(resp)
    drawer.closeRightDrawer()
  } catch (err) {
    $q.notify({
      message: err,
      color: 'purple'
    })
    console.error(err)
  }
}
</script>