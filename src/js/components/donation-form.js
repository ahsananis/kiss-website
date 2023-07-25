import currencyInput from './currency-input'

export default {
  props: ['templates'],

  components: { currencyInput },
  
  data() {
    return {
      type: 'monthly',
      amount: null,
    }
  },

  methods: {
    donate() {
        window.location = `/donate/${this.type == 'monthly' ? 'monthly' : 'single'}${this.amount ? '?amount=' + this.amount : ''}`
    }
  },
}
