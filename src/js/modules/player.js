import Plyr from 'plyr'

export default class Player {
  constructor(element) {
    this.element = element
    this.options = {
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
      settings: ['quality', 'speed'],
      quality: {
        default: 720,
      },
    }
    this.init()
  }

  init() {
    const config = this.element.dataset.playerConfig !== undefined ? this.element.dataset.playerConfig : '{}'
    const options = JSON.parse(config)

    this.player = new Plyr(this.element, {...this.options, ...options})
  }
}
