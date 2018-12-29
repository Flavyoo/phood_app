import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      userIsLoggedIn: false,
      activeUser: null,
      sessionId: null
  },
  mutations: {
      login (state, payload) {
          state.sessionId = payload.sessionId
      },
      saveUser (state, payload) {
          state.activeUser = payload.activeUser
      },
      logout (state) {
          state.sessionId = null
          state.userIsLoggedIn = false
      }
  },
  actions: {
      login ({commit}, payload) {
          commit('login', payload)
      },
      saveUser ({commit}, payload) {
          commit('saveUser', payload)
      },
      logout ({commit}) {
          commit('logout')
      }
  },
  getters: {
      isAuthenticated: state => {
          if (state.sessionId != null) {
              return true
          } else {
              return false
          }
      },
      getContactName: state => {
          if (state.activeUser != null) {
              return state.activeUser.contactName
          } else {
              return ''
          }
      }
  }
})
