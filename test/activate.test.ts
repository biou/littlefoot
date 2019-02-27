import { wait, fireEvent } from 'dom-testing-library'
import littlefoot from '../src'
import { setDocumentBody, waitForTransition, query } from './helper'

const TEST_SETTINGS = { activateDelay: 1 }

beforeEach(() => {
  setDocumentBody('single.html')
})

test('activate footnote when clicking the button', async () => {
  littlefoot(TEST_SETTINGS)

  const button = query('button')
  fireEvent.click(button)

  expect(button).toHaveClass('is-changing')
  await waitForTransition(button)
  expect(button).toHaveClass('is-active')
})

test('activate footnote when calling .activate()', async () => {
  const instance = littlefoot(TEST_SETTINGS)

  const button = query('button')
  instance.activate('button[data-footnote-id="1"]')

  expect(button).toHaveClass('is-changing')
  await wait(() => expect(button).not.toHaveClass('is-changing'))

  const popover = query<HTMLElement>('.littlefoot-footnote')
  const content = query<HTMLElement>('.littlefoot-footnote__content')

  expect(button).toHaveClass('is-active')
  expect(button).toHaveAttribute('aria-expanded', 'true')
  expect(button).toHaveAttribute('aria-controls', popover.id)

  expect(content).toContainHTML(button.getAttribute('data-footnote-content')!)
  expect(content.offsetWidth).toBe(document.body.clientWidth)

  expect(popover).toHaveAttribute('data-footnote-max-height', '0')
  expect(popover).toHaveStyle(`max-width: ${document.body.clientWidth}px`)
})

test('activation with invalid selector does not activate any popovers', () => {
  const instance = littlefoot({ activateDelay: 0 })

  instance.activate('invalid')

  expect(query('.littlefoot-footnote')).toBeNull()
})