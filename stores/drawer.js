import { defineStore } from 'pinia'

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useDrawerStore = defineStore('drawer', {
  state: () => ({ 
    showRightDrawer: false,
    DrawerComponent: null,
    DrawerComponentProps: {},
  }),
  getters: {
    isShowRightDrawer: (state) => state.showRightDrawer,
  },
  actions: {
    toggleRightDrawer() {
      this.showRightDrawer = !this.showRightDrawer
    },
    openRightDrawer() {
      this.showRightDrawer = true
    },
    closeRightDrawer() {
      this.showRightDrawer = false
    },
    setDrawerComponent(NewComponent, NewComponentProps) {
      this.DrawerComponent = NewComponent

      this.DrawerComponentProps = NewComponentProps ? NewComponentProps : {}
    }
  },
})