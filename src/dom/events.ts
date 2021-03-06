import { throttle } from '@pacote/throttle'
import { off, on } from 'delegated-events'
import { CoreDriver, FootnoteAction, FootnoteLookup } from '../core'

const FRAME = 16
type EventHandler<E extends Event> = (e: E) => void

const SELECTOR_BUTTON = '[data-footnote-button]'
const SELECTOR_FOOTNOTE = '[data-footnote-id]'
const SELECTOR_POPOVER = '[data-footnote-popover]'
const CLASS_FULLY_SCROLLED = 'is-fully-scrolled'

function target(event: Event) {
  return event.target as HTMLElement
}

function getFootnoteId(element: HTMLElement | null): string | undefined {
  return element?.dataset.footnoteId
}

function handleTouch(
  lookup: FootnoteLookup,
  action: FootnoteAction,
  dismissAll: () => void
): EventListener {
  return (event) => {
    const element = target(event).closest<HTMLElement>(SELECTOR_BUTTON)
    const id = getFootnoteId(element)
    const footnote = id && lookup(id)

    if (footnote) {
      action(footnote)
    } else if (!target(event).closest<HTMLElement>(SELECTOR_POPOVER)) {
      dismissAll()
    }
  }
}

function handleHover(
  lookup: FootnoteLookup,
  action: FootnoteAction
): EventListener {
  return (event) => {
    event.preventDefault()
    const element = target(event).closest<HTMLElement>(SELECTOR_FOOTNOTE)
    const id = getFootnoteId(element)
    const footnote = id && lookup(id)

    if (footnote) {
      action(footnote)
    }
  }
}

function handleEscape(fn: () => void): EventHandler<KeyboardEvent> {
  return (event) => {
    if (event.keyCode === 27) {
      fn()
    }
  }
}

function handleScroll(popover: HTMLElement): EventHandler<WheelEvent> {
  return (event) => {
    const content = event.currentTarget as HTMLElement | null
    const delta = -event.deltaY

    if (delta > 0) {
      popover.classList.remove(CLASS_FULLY_SCROLLED)
    }

    if (
      content &&
      delta <= 0 &&
      delta < content.clientHeight + content.scrollTop - content.scrollHeight
    ) {
      popover.classList.add(CLASS_FULLY_SCROLLED)
    }
  }
}

export function bindScrollHandler(
  content: HTMLElement,
  popover: HTMLElement
): void {
  content.addEventListener('wheel', throttle(handleScroll(popover), FRAME))
}

export function addListeners({
  dismissAll,
  lookup,
  hover,
  repositionAll,
  resizeAll,
  toggle,
  unhover,
}: CoreDriver): () => void {
  const toggleOnTouch = handleTouch(lookup, toggle, dismissAll)
  const dismissOnEscape = handleEscape(dismissAll)
  const throttledReposition = throttle(repositionAll, FRAME)
  const throttledResize = throttle(resizeAll, FRAME)
  const showOnHover = handleHover(lookup, hover)
  const hideOnHover = handleHover(lookup, unhover)

  document.addEventListener('touchend', toggleOnTouch)
  document.addEventListener('click', toggleOnTouch)
  document.addEventListener('keyup', dismissOnEscape)
  document.addEventListener('gestureend', throttledReposition)
  window.addEventListener('scroll', throttledReposition)
  window.addEventListener('resize', throttledResize)
  on('mouseover', SELECTOR_FOOTNOTE, showOnHover)
  on('mouseout', SELECTOR_FOOTNOTE, hideOnHover)

  return () => {
    document.removeEventListener('touchend', toggleOnTouch)
    document.removeEventListener('click', toggleOnTouch)
    document.removeEventListener('keyup', dismissOnEscape)
    document.removeEventListener('gestureend', throttledReposition)
    window.removeEventListener('scroll', throttledReposition)
    window.removeEventListener('resize', throttledResize)
    off('mouseover', SELECTOR_FOOTNOTE, showOnHover)
    off('mouseout', SELECTOR_FOOTNOTE, hideOnHover)
  }
}
