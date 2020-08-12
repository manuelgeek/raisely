import { TOKEN } from '~/services/consts'

export default function ({ $axios, redirect, store, app }) {
  $axios.onRequest((config) => {
    console.log('Making request to ', config)
  })

  // handle redirection
  $axios.onError((error) => {
    if (error.response) {
      const code = parseInt(error.response && error.response.status)
      if (code === 401) {
        store.dispatch('user/logOut')
        // redirect('/')
      }
      if (code === 500) {
        // redirect('/error')
      }
      if (code === 404) {
        // redirect('/not-found')
      }
    } else {
      // redirect('/error?no_internet=true')
    }
  })

  const token = app.$cookies.get(TOKEN) || store.state.user.token
  if (token) {
    $axios.setToken(token, 'Bearer')
  }

  // setting up .env and adding API_BASE_URL (process.env.API_BASE_URL) is recommended for sensitive data.
  $axios.setBaseURL('https://api.raisely.com/v3')
}
