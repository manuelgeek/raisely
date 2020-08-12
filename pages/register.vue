<template>
  <div class="bg-gray-100">
    <div class="container">
      <div class="w-full max-w-sm">
        <div class="text-center font-semibold text-black py-10 text-3xl">
          Register
        </div>
        <ValidationObserver ref="registrationForm">
          <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" @submit.prevent="register">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="firstname">
                First Name
              </label>
              <ValidationProvider v-slot="{ errors }" rules="required">
                <input
                  id="firstname"
                  v-model="form.firstName"
                  :class="[
                    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline',
                    validateErrors.firstName ? 'border-red-500' : ''
                  ]"
                  type="text"
                  placeholder="First Name"
                >
                <p class="text-red-500 text-xs italic">
                  {{ errors[0] }}
                </p>
              </ValidationProvider>
              <p v-if="validateErrors.firstName" class="text-red-500 text-xs italic">
                {{ validateErrors.firstName[0] }}
              </p>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="lastname">
                Last Name
              </label>
              <ValidationProvider v-slot="{ errors }" rules="required">
                <input
                  id="lastname"
                  v-model="form.lastName"
                  :class="[
                    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline',
                    validateErrors.lastName ? 'border-red-500' : ''
                  ]"
                  type="text"
                  placeholder="Last Name"
                >
                <p class="text-red-500 text-xs italic">
                  {{ errors[0] }}
                </p>
              </ValidationProvider>
              <p v-if="validateErrors.lastName" class="text-red-500 text-xs italic">
                {{ validateErrors.lastName[0] }}
              </p>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                Email
              </label>
              <ValidationProvider v-slot="{ errors }" rules="required|email">
                <input
                  id="email"
                  v-model="form.email"
                  :class="[
                    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline',
                    validateErrors.email ? 'border-red-500' : ''
                  ]"
                  type="email"
                  placeholder="mail@mail.com"
                  @change="validateEmail"
                >
                <p class="text-red-500 text-xs italic">
                  {{ errors[0] }}
                </p>
              </ValidationProvider>
              <p v-if="validateErrors.email" class="text-red-500 text-xs italic">
                {{ validateErrors.email[0] }}
              </p>
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                Password
              </label>
              <ValidationProvider v-slot="{ errors }" rules="required|min:6" vid="password">
                <input
                  id="password"
                  v-model="form.password"
                  :class="[
                    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline',
                    validateErrors.password ? 'border-red-500' : ''
                  ]"
                  type="password"
                  placeholder="************"
                >
                <p class="text-red-500 text-xs italic">
                  {{ errors[0] }}
                </p>
              </ValidationProvider>
              <p v-if="validateErrors.password" class="text-red-500 text-xs italic">
                {{ validateErrors.password[0] }}
              </p>
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="password_c">
                Confirm Password
              </label>
              <ValidationProvider v-slot="{ errors }" rules="required|confirmed:password">
                <input
                  id="password_c"
                  v-model="form.password_confirmation"
                  :class="[
                    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline',
                    validateErrors.password_confirmation ? 'border-red-500' : ''
                  ]"
                  type="password"
                  placeholder="************"
                >
                <p class="text-red-500 text-xs italic">
                  {{ errors[0] }}
                </p>
              </ValidationProvider>
            </div>
            <div class="flex items-center justify-between">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                {{ button }}
              </button>
            </div>
          </form>
        </ValidationObserver>
        <p class="text-center text-gray-500 text-xs">
          &copy;2020 Raisely. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'

export default {
  name: 'Register',
  components: {
    ValidationProvider, ValidationObserver
  },
  middleware: 'unauthenticated',
  data () {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      button: 'Sign Up',
      // server side validation errors
      validateErrors: [],
      validEmail: true
    }
  },
  methods: {
    async register () {
      const isValid = await this.$refs.registrationForm.validate()
      if (isValid && this.validEmail) {
        this.button = 'Signing up ...'
        this.validateErrors = []
        const vm = this
        this.$axios.post('/signup', {
          campaignUuid: '46aa3270-d2ee-11ea-a9f0-e9a68ccff42a',
          data: this.$data.form
        })
          .then((response) => {
            this.$store
              .dispatch('user/loginUser', response.data).then((_e) => {
                vm.$toaster.success(response.data.message)
                vm.clearForm()
                vm.$router.push('/')
              })
          }).catch((error) => {
            console.log(error.response.data)
            if (error.response && error.response.status === 400) {
              this.$toaster.error(error.response.data.validateErrors[0].message)
            } else {
              this.$toaster.error('An Error Occurred, try again')
            }
            this.button = 'Sign Up'
          })
      }
    },
    clearForm () {
      const self = this
      Object.keys(this.form).forEach(function (key, index) {
        self.form[key] = ''
      })
    },
    async validateEmail () {
      const data = {
        campaignUuid: '46aa3270-d2ee-11ea-a9f0-e9a68ccff42a',
        data: { email: this.form.email }
      }
      if (this.form.email !== '') {
        await this.$axios.post('/check-user', data).then((response) => {
          if (response.data.data.status === 'OK') {
            this.validEmail = true
            this.validateErrors = []
          } else {
            this.validateErrors = { email: ['Invalid email address, enter another email'] }
            this.validEmail = true
          }
        })
      } else {
        this.validateErrors = []
      }
    }
  }
}
</script>

<style scoped>

</style>
