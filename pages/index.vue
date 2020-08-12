<template>
  <div class="container">
    <div>
      <Logo />
      <h1 class="title text-center">
        raisely
      </h1>
      <div class="flex flex-col justify-center">
        <h3 class="subtitle text-center">
          {{ user.firstName +' '+ user.lastName }}
        </h3>
        <p>{{ user.email }}</p>
        <div class="links flex justify-center">
          <a
            href="#"
            rel="noopener noreferrer"
            class="button--grey"
            @click.prevent="logout"
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'authenticated',
  computed: {
    user () {
      return this.$store.state.user.currentUser
    }
  },
  methods: {
    logout () {
      // * delete user and token, but recommended to delete/revoke token on server too
      const vm = this
      this.$store.dispatch('user/logOut').then((_e) => {
        vm.$router.push('/register')
      })
    }
  }
}
</script>

<style>
.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
