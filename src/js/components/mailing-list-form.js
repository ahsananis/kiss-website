export default {
  data() {
    return {
      working: false,
      success: false,
      error: null,
      form: {
        email: '',
        relationship: '',
      },
    }
  },

  computed: {
    formData() {
      let formData = new FormData()

      formData.set('action', 'mailchimp-subscribe/audience/subscribe')
      formData.set('email', this.form.email)
      formData.set('relationship', this.form.relationship)

      return formData
    },
  },

  methods: {
    subscribe() {
      this.working = true

      axios.post('/', this.formData)
        .then(response => {
          if (response.data.success) {
            this.success = true
          } else {
            this.error = response.data.message
          }
        })
        .catch(error => {
          console.log(error)
        })
        .then(() => {
          this.working = false
        })
    },
  },
}
