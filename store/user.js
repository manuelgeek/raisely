import { TOKEN, USER } from '~/services/consts'

export const state = () => ({
  token: '',
  currentUser: []
})

export const getters = ({
  isAuthenticated: state => !!state.token
})
export const mutations = {
  updateUser (state) {
    state.token = this.$cookies.get(TOKEN) || ''
    state.currentUser = this.$cookies.get(USER) || []
  }
}
export const actions = {
  loginUser (context, payload) {
    this.$cookies.set(TOKEN, payload.token, { maxAge: 60 * 60 * 24 * 100, path: '/' })
    this.$cookies.set(USER, payload.data, { maxAge: 60 * 60 * 24 * 100, path: '/' })
    context.commit('updateUser')
  },
  logOut (context) {
    this.$cookies.remove(TOKEN)
    this.$cookies.remove(USER)
    context.commit('updateUser')
  }
}
