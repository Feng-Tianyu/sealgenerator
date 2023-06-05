import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
const store = new Vuex.Store({
  state() {
    return {
      editedImages: [],
      currentid: 0,
    }
  },
  mutations: {
    addImage(state, image) {
      state.editedImages.push({id: state.currentid, img: image})
      state.currentid = state.currentid + 1
    }
  },
  getters: {}
})

export default store
