import { mount } from '@vue/test-utils'
import Vue from 'vue'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Register from '~/pages/register'

describe('Register Component', () => {
  let http

  beforeAll(() => {
    http = new MockAdapter(axios)
  })

  afterEach(() => {
    http.reset()
  })

  afterAll(() => {
    http.restore()
  })

  test('is a Vue instance', () => {
    const wrapper = mount(Register)
    expect(wrapper.vm).toBeTruthy()
  })

  it('renders the correct markup', () => {
    const wrapper = mount(Register)
    expect(wrapper.html()).toContain('Register')
  })

  it('shows validation errors on click with empty form', () => {
    const wrapper = mount(Register)

    Vue.nextTick(() => {
      wrapper.find('#register').trigger('click')
      expect(wrapper.html()).toContain('This field is required')
    })
  })

  it('displays error on invalid email', () => {
    const wrapper = mount(Register)
    const fakeData = {
      data: {
        status: 'EXISTS'
      }
    }
    http.onPost('/check-user').reply(200, { data: fakeData })
    wrapper.find('input#email').element.value = 'test@test.com'
    wrapper.find('input#email').trigger('input')
    Vue.nextTick(() => {
      expect(wrapper.html()).toContain('Invalid email address, enter another email')
    })
  })

  it('displays error on short password', () => {
    const wrapper = mount(Register)
    wrapper.find('input#password').element.value = 'test'
    wrapper.find('input#password').trigger('input')
    Vue.nextTick(() => {
      expect(wrapper.html()).toContain('Password must be at least 6 chars')
    })
  })

  it('displays error on passwords not matching', () => {
    const wrapper = mount(Register)
    wrapper.find('input#password').element.value = '123456'
    wrapper.find('input#password').trigger('input')

    wrapper.find('input#password_c').element.value = '123465'
    wrapper.find('input#password').trigger('input')
    Vue.nextTick(() => {
      expect(wrapper.html()).toContain('This field must match the entered password')
    })
  })

  it('registers user with correct details', () => {
    const wrapper = mount(Register)
    const fakeData = {
      data: {
        uuid: '5b69b520-dcbf-11ea-a085-b7ab9c9d4f13',
        preferredName: 'Manu',
        createdAt: '2020-08-12T17:15:01.874Z',
        updatedAt: '2020-08-12T17:15:01.874Z',
        public: null,
        status: 'ACTIVE',
        organisationUuid: '43255170-d2ee-11ea-a9f0-e9a68ccff42a',
        firstName: 'Manu',
        lastName: 'El',
        photoUrl: null
      },
      message: 'Thank you for joining!',
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlblV1aWQiOiI1Yjg3MjgzMC1kY2JmLTExZWEtYTA4NS1iN2FiOWM5ZDRmMTMiLCJpYXQiOjE1OTcyNTI1MDJ9.NhykljQNKj2aUemFjuQggZeNg59Y90WDTw6ItMSkWdg'
    }
    http.onPost('/signup').reply(200, { data: fakeData })

    wrapper.find('input#firstname').element.value = 'Manu'
    wrapper.find('input#firstname').trigger('input')

    wrapper.find('input#lastname').element.value = 'El'
    wrapper.find('input#lastname').trigger('input')

    wrapper.find('input#email').element.value = 'mail@mail.com'
    wrapper.find('input#email').trigger('input')

    wrapper.find('input#password').element.value = '123456'
    wrapper.find('input#password').trigger('input')

    wrapper.find('input#password_c').element.value = '123456'
    wrapper.find('input#password').trigger('input')

    Vue.nextTick(() => {
      wrapper.find('#register').trigger('click')
      expect(window.location.assign).toHaveBeenCalledWith('/')
    })
  })
})
