import { extend } from 'vee-validate'
import { required, email, confirmed, min } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: 'This field is required'
})

extend('email', {
  ...email,
  message: 'This field must be an email'
})

extend('confirmed', {
  ...confirmed,
  message: 'This field must match the entered password'
})

extend('min', {
  ...min,
  message: 'Password must be at least 6 chars'
})
