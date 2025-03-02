<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title>
          PowerDNS Web Admin Lite
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="drawer.toggleRightDrawer" />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/page1" label="Summary" />
        <q-route-tab to="/page2" label="Domains" />
        <q-route-tab to="/page3" label="Page Three" />
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
      <q-toolbar>
        <div>Title</div>
        <q-space />
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDrawerStore } from '@/stores/drawer'
import NewRRSet from '@/components/NewRRSet'
import EmptyComponent from '@/components/Empty'

const drawer = useDrawerStore()
drawer.setDrawerComponent(shallowRef(EmptyComponent))
</script>