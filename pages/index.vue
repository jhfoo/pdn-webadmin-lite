<template>
  <q-page class="q-pl-lg">
    <div class="text-h6">What is this</div>
    <p class="q-pt-md">
      This is the web management interface for PowerDNS. It's unofficial, barely 
      secure, and intended for home use.
    </p>
    <p class="">
      Management is purely via PowerDNS API, authenticated by the API key. If 
      this works for you, proceed!
    </p>

    <q-table
      title="Entries"
      :rows="DomainRecords"
      :columns="columns"
      row-key="name" dense
      selection="single"
    />
    <p class="text-h6 q-pt-md">
      Quasar Default Prop Values
    </p>
  </q-page>
</template>

<script setup lang="ts">
</script>

<script setup lang="ts">
import axios from 'axios'

const DomainRecords = ref([])
const columns = [{
    name: 'rec',
    label: 'Record',
    sortable: true,
    field: row => row.name,
    align: 'left',
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
  }
]

try {
  const resp = await axios.get('http://192.168.130.25:8081/api/v1/servers/localhost/zones/kungfoo.local', {
    headers: {
      'X-API-KEY': 'changeme'
    }
  })
  DomainRecords.value = resp.data.rrsets.map((item) => {
    return {
      name: item.name,
      value: item.records[0].content,
      type: item.type,
      ttl: item.ttl,
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
</script>