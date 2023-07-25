export default class Forms {
  constructor() {
    this.init()
  }

  init() {
    $('[data-form-embed]').submit(function() {
      var $submit = $(this).find('button[type=submit]')

      $submit.addClass('is-working')
    })
  }
}
