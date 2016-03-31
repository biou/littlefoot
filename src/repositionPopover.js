import siblings from 'dom-siblings'
import classList from 'dom-classlist'
import calculateAvailableRoom from './calculateAvailableRoom'

/**
 * Positions the tooltip at the same relative horizontal position as the button.
 *
 * @param  {DOMElement} popover      Popover element.
 * @param  {Number}     leftRelative Relative positioning to the left.
 */
function positionTooltip(popover, leftRelative) {
  const tooltip = popover.querySelector('.littlefoot-footnote__tooltip')

  if (tooltip) {
    leftRelative = leftRelative != null ? leftRelative : 0.5
    tooltip.style.left = (leftRelative * 100) + '%'
  }
}

/**
 * Positions each footnote relative to its button.
 *
 * @param {DOMElement} footnote The footnote element.
 * @param {Event}      event    The type of event that prompted the reposition function.
 */
export default function repositionPopover(footnote, event) {
  const type            = event ? event.type : 'resize'
  const identifier      = footnote.getAttribute('data-footnote-id')
  const button          = siblings(footnote, '.littlefoot-footnote__button')[0]
  const buttonStyle     = button.currentStyle || window.getComputedStyle(button)
  const footnoteStyle   = footnote.currentStyle || window.getComputedStyle(footnote)
  const roomLeft        = calculateAvailableRoom(button)
  const marginSize      = parseFloat(footnoteStyle.marginTop)
  const maxHeightInCSS  = parseFloat(footnote.getAttribute('data-littlefoot-max-height'))
  const totalHeight     = 2 * marginSize + footnote.offsetHeight
  const positionOnTop   = roomLeft.bottomRoom < totalHeight && roomLeft.topRoom > roomLeft.bottomRoom
  const state           = footnote.getAttribute('data-littlefoot-state')

  let maxHeightOnScreen = 10000

  if (positionOnTop) {
    if (state !== 'top') {
      footnote.setAttribute('data-littlefoot-state', 'top')
      classList(footnote).add('is-positioned-top')
      classList(footnote).remove('is-positioned-bottom')
      footnote.style.transformOrigin = (roomLeft.leftRelative * 100) + '% 100%'
    }

    maxHeightOnScreen = roomLeft.topRoom - marginSize - 15

  } else {
    if (state !== 'bottom' || state === 'init') {
      footnote.setAttribute('data-littlefoot-state', 'bottom')
      classList(footnote).add('is-positioned-bottom')
      classList(footnote).remove('is-positioned-top')
      footnote.style.transformOrigin = (roomLeft.leftRelative * 100) + '% 0'
    }

    maxHeightOnScreen = roomLeft.bottomRoom - marginSize - 15
  }

  footnote.querySelector('.littlefoot-footnote__content').style.maxHeight = Math.min(maxHeightOnScreen, maxHeightInCSS) + 'px'

  if (type === 'resize') {
    const maxWidthInCSS   = parseFloat(footnote.getAttribute('data-littlefoot-max-width'))
    const footnoteWrapper = footnote.querySelector('.littlefoot-footnote__wrapper')
    const footnoteContent = footnote.querySelector('.littlefoot-footnote__content')
    let maxWidth          = maxWidthInCSS

    if (maxWidthInCSS <= 1) {
      maxWidth = Math.min(window.innerWidth, 10000) * maxWidthInCSS
    }

    maxWidth = Math.min(maxWidth, footnoteContent.offsetWidth + 1)

    const left = -roomLeft.leftRelative * maxWidth + parseFloat(buttonStyle.marginLeft) + button.offsetWidth / 2

    footnoteWrapper.style.maxWidth = maxWidth + 'px'
    footnote.style.left            = left + 'px'

    positionTooltip(footnote, roomLeft.leftRelative)
  }

  if (parseInt(footnote.offsetHeight) < footnote.querySelector('.littlefoot-footnote__content').scrollHeight) {
    classList(footnote).add('is-scrollable')
  }
}