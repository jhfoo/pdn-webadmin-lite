k<template>
  <q-toolbar>
    <q-toolbar-title>{{ rrset.name ? 'Edit' : 'New' }}</q-toolbar-title>

    <q-btn dense flat round icon="close" @click="drawer.closeRightDrawer"  />
  </q-toolbar>
  <div class="q-px-md">
    <q-input v-model="RrsetZone" label="Zone" borderless disable/>

    <q-input v-if="rrset.name" v-model="rrset.data.name" label="Name" borderless disable/>
    <q-input v-else v-model="rrset.data.name" label="Name"/>

    <q-input v-if="rrset.name" v-model="rrset.data.type" label="Type" borderless disable/>
    <q-input v-else v-model="rrset.data.type" label="Type"/>

    <q-input v-for="record in rrset.data.records" v-model="record.content" label="Value"/>
    <q-input v-model="rrset.data.ttl" label="TTL"/>
    <q-btn-group class="q-pt-md" spread flat>
      <q-btn @click="drawer.closeRightDrawer" color="yellow" label="Cancel" icon="close" flat />
      <q-btn @click="onDelete" color="red" label="Delete" icon="delete" flat/>
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
const RrsetType = computed({
  get() {
    return props.rrset.data.type
  },
  set(NewValue) {
    props.rrset.data.type = NewValue
  }
})
console.log(props.rrset.data)

function getTitle() {
  if (props.rrset.name) {
    return props.rrset.name
  } 
  // else
  return 'New RRSet'
}

async function onDelete() {
  try {
    await patchPdns({
      name: props.rrset.data.name,
      type: props.rrset.data.type,
      changetype: 'DELETE'
    })
    $q.notify({
      message: 'Record deleted',
      color: 'green'
    })

    // props.rrset.cmdRefresh()
    drawer.closeRightDrawer(true)
  } catch (err) {
    console.error(err)
  }
}

async function patchPdns(payload) {
  return await axios.patch('http://192.168.130.25:8081/api/v1/servers/localhost/zones/' + props.zone, {
    rrsets: [payload],
  }, {
    headers: {
      'X-API-KEY': 'changeme'
    }
  })
}

async function onUpdate() {
  try {
    const rec = {
      name: props.rrset.data.name,
      type: props.rrset.data.type,
      ttl: props.rrset.data.ttl,
      changetype: 'REPLACE',
      records: [{
        content: props.rrset.data.records[0].content,
        disabled: false,
      }]
    }

    const resp = await patchPdns(rec)
    drawer.closeRightDrawer(true)
  } catch (err) {
    $q.notify({
      message: err,
      color: 'purple'
    })
    console.error(err)
  }
}
</script>