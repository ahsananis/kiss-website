import { scrollTo } from 'scroll-js'

export default {
  data() {
    return {
      working: false,
      success: false,
      errors: {},
      name: '',
      email: '',
      phone: '',
      message: '',
      subscribe: false,
      relationship: '',
    }
  },

  methods: {
    onSubmit() {
      this.setHeight()
      this.working = true

      axios.post('/', this.formData)
        .then((response) => {
          if (response.data.success) {
            this.success = true
          } else {
            this.errors = response.data.errors

            this.resetHeight()
          }
        })
        .catch((error) => {
          console.log(error)
        })
        .then(() => {
          this.scrollUp(() => {
            this.working = false
          })
        })
    },

    setHeight() {
      let heightString = this.$refs.form.clientHeight + 'px'
      this.$refs.container.style.height = heightString
    },

    resetHeight() {
      this.$refs.container.style.height = 'auto'
    },

    scrollUp(callback) {
      scrollTo(window, { top: 0 }, { behavior: 'smooth' }).then(() => {
        callback()
      })
    }
  },

  computed: {
    formData() {
      let formData = new FormData()

      formData.set('action', 'contact-form/send')
      formData.set('fromName', this.name)
      formData.set('fromEmail', this.email)
      formData.set('message[phone]', this.phone)
      formData.set('message[body]', this.message)
      formData.set('message[subscribe]', this.subscribe)
      formData.set('message[relationship]', this.relationship)

      return formData
    },
  },
}
