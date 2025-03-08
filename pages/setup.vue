<template>
  <q-page class="q-px-lg q-mt-lg">
    <q-card class="text-white" style="max-width: 450px; margin: 0 auto" flat>
      <q-card-section>
        <div class="text-h6">Settings Storage</div>
        <div class="text-subtitle2">NOTE<br/>
          Settings are stored locally on the browser, 
          <span class="text-red">including the API token</span>. This app is intended
          for usage in a safe environment.<br/>
          If your environment or users is/are not trusted please stop using immediately.</div>
      </q-card-section>

      <q-card-section>
        <q-form>
          <q-input v-model="setting.ServerAddress" label="PowerDNS Address"/>
          <q-input v-model="setting.ServerPort" label="PowerDNS Port"/>
          <q-input v-model="setting.ApiToken" label="API Token"/>
        </q-form>
      </q-card-section>

      <q-separator dark />

      <q-card-actions align="right">
        <q-btn flat>Undo</q-btn>
        <q-btn @click="onClear" flat>Clear</q-btn>
        <q-btn @click="onSave" flat>Save</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useQuasar } from 'quasar'
import { useDrawerStore } from '@/stores/drawer'
import EditRRSet from '@/components/EditRRSet'
import { useRoute } from 'vue-router'

const drawer = useDrawerStore()
const route = useRoute()
const $q = useQuasar()

const setting = ref(loadSettings())

console.log(setting.value.ServerAddress)

function loadSettings() {
  return {
    ServerAddress: localStorage.getItem('ServerAddress') ?? 'localhost',
    ServerPort: localStorage.getItem('ServerPort') ?? 9100,
    ApiToken: localStorage.getItem('ApiToken') ?? 'changeme',
  }
}

function onClear() {
  localStorage.clear()
  setting.value = loadSettings()
}

function onSave() {
  localStorage.setItem('ServerAddress', setting.value.ServerAddress)
  localStorage.setItem('ServerPort', setting.value.ServerPort)
  localStorage.setItem('ApiToken', setting.value.ApiToken)
}
</script>