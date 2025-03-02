// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-03-01',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    'nuxt-quasar-ui', 
    '@nuxt/fonts', 
    '@pinia/nuxt',
  ],
  quasar: {
    // Optional string | boolean
    // sassVariables: "assets/quasar.variables.scss",
    // Optional string[]
    // If you use animations, add Quasar Extra CSS animation URL here.
    // NOTE: This CSS files are inserted on module plugin template, NOT on `nuxt.config`.
    // css: ["@quasar/extras/material-icons/material-icons.css"],
    // List of extra Quasar Plugins
    // auto-instaled: [Platform, Body, Dark, Screen, History, Lang, IconSet]
    // optional: [AddressbarColor, AppFullscreen, AppVisibility, BottomSheet, Dialog,
    //            LoadingBar, Loading, Notify, LocalStorage, SessionStorage]
    // plugins: ["Dialog"],
    /* Quasar UI config -- you'll notice in Quasar docs when you need it */
    config: {
      dark: true,
    },
    plugins: ['Notify'],
  },
  css: ['@/assets/css/app.css'],
})