export default class Tester {
  constructor() {
    this.init()
  }

  init() {
    let $body = $('body'),
      $openNavButton = $('[data-toggle-nav="open"]'),
      $closeNavButton = $('[data-toggle-nav="close"]'),
      $mobileNav = $('[data-mobile-nav]'),
      $mobileNavLinks = $('[data-toggle-element]'),
      preventScrollClass = 'overflow-hidden',
      mobileNavOpenClass = 'open',
      mobileSubnavOpenClass = 'open'

    $openNavButton.click(function() {
      $body.addClass(preventScrollClass)
      $mobileNav.addClass(mobileNavOpenClass)
    })

    $closeNavButton.click(function() {
      $body.removeClass(preventScrollClass)
      $mobileNav.removeClass(mobileNavOpenClass)
    })

    $mobileNavLinks.click(function(event) {
      event.preventDefault()

      let $this = $(this),
        target = $this.data('toggle-element')

      $mobileNavLinks.not($this).parent().find(target).removeClass(mobileSubnavOpenClass)
      $this.parent().find(target).toggleClass(mobileSubnavOpenClass)
    })
  }
}
