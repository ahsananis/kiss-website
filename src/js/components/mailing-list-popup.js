import Cookies from 'js-cookie'

export default {
    props: ['offset'],

    data() {
        return {
            scrolled: false,
            dismissed: false,
            working: false,
            success: false,
            error: false,
            form: {
                email: '',
                relationship: '',
            }
        }
    },

    computed: {
        show() {
            return this.scrolled && !this.dismissed
        },

        formData() {
            let formData = new FormData()

            formData.set('action', 'mailchimp-subscribe/audience/subscribe')
            formData.set('email', this.form.email)
            formData.set('relationship', this.form.relationship)

            return formData
        },
    },

    methods: {
        dismiss() {
            this.dismissed = true
            Cookies.set('mailinglist_status', 'dismiss', { expires: 31 })
        },

        handleScroll() {
            if (window.scrollY > this.offset) {
                this.scrolled = true
                window.removeEventListener('scroll', this.handleScroll)
            }
        },

        subscribe() {
            this.working = true

            axios.post('/', this.formData)
                .then(response => {
                    if (response.data.success) {
                        this.dismiss()
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
        }
    },

    created() {
        if (typeof Cookies.get('mailinglist_status') !== "undefined" || Cookies.get('mailinglist_status') === 'dismiss') {
            return this.dismissed = true
        }

        window.addEventListener('scroll', this.handleScroll, { passive: true })
    },

    destroyed() {
        window.removeEventListener('scroll', this.handleScroll)
    },
}
