<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title>
          PowerDNS Web Admin Lite
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="onHelp" />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" label="Summary" />
        <q-route-tab to="/domain" label="Domains" />
        <q-route-tab to="/help" label="Page Three" />
      </q-tabs>
    </q-header>

    <q-drawer v-model="drawer.showRightDrawer" side="right" overlay bordered>
      <component :is="drawer.DrawerComponent" v-bind="drawer.DrawerComponentProps"/>
    </q-drawer>

    <q-page-container>
      <router-view />
      <!-- <slot /> -->
    </q-page-container>

    <q-footer class="bg-grey-8 text-white">
      <q-bar>
        <q-btn dense flat icon="event" />
        <q-space />
        <div>Quasar v{{ $q.version }}</div>
      </q-bar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDrawerStore } from '@/stores/drawer'
import Empty from '@/components/Empty'
import Help from '@/components/Help'

const drawer = useDrawerStore()
drawer.setDrawerComponent(shallowRef(Help))

function onHelp() {
  drawer.setDrawerComponent(shallowRef(Help))
  drawer.toggleRightDrawer()
}
</script>