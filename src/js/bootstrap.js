// Load jQuery
import jQuery from 'jquery/dist/jquery.slim'
window.$ = window.jQuery = jQuery

// Load the axios HTTP library
import axios from 'axios'
window.axios = axios

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// Register the CSRF Token as a common header with Axios so that all outgoing HTTP requests automatically have it attached
let token = document.head.querySelector('meta[name="csrf-token"]')

if (token) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token')
}
