import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      userIsLoggedIn: false,
      activeUser: null
  },
  mutations: {
      saveUser (state, payload) {
          state.activeUser = payload.activeUser
      },
      logout (state) {
          state.userIsLoggedIn = false
      },
      authenticate (state, payload) {
          state.userIsLoggedIn = payload.isLoggedIn
      }
  },
  actions: {
      saveUser ({commit}, payload) {
          commit('saveUser', payload)
      },
      logout ({commit}) {
          commit('logout')
      },
      authenticate ({commit}, payload) {
          commit('authenticate', payload)
      }
  },
  getters: {
      isAuthenticated: state => {
          return state.userIsLoggedIn
      },
      getGivenName: state => {
          if (state.activeUser != null) {
              return state.activeUser.given_name
          } else {
              return ''
          }
      }
  }
})
