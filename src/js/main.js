require('./bootstrap')

import Vue from 'vue'
import Turbolinks from 'turbolinks'
import TurbolinksAdapter from 'vue-turbolinks'

import ContactForm from './components/contact-form.js'
import DonationForm from './components/donation-form.js'
import MailingListForm from './components/mailing-list-form.js'
import MailingListPopup from './components/mailing-list-popup.js'

import Donate from './modules/donate.js'
import Forms from './modules/forms.js'
import Navigation from './modules/navigation.js'
import Player from './modules/player.js'

Turbolinks.start()
Vue.use(TurbolinksAdapter)

Vue.component('contact-form', ContactForm)
Vue.component('donation-form', DonationForm)
Vue.component('mailing-list-form', MailingListForm)
Vue.component('mailing-list-popup', MailingListPopup)

document.addEventListener('turbolinks:load', () => {
  let elements = document.querySelectorAll('[data-vue]');

  [].forEach.call(elements, (element) => {
    new Vue({
      el: element,
    })
  });

  new Donate
  new Forms
  new Navigation

  Array.from(document.querySelectorAll('[data-player]')).map(element => new Player(element))
})
