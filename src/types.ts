export type Settings = {
  activateCallback?: (popover: HTMLElement, button: HTMLElement) => void
  activateDelay: number
  activateOnHover: boolean
  allowDuplicates: boolean
  allowMultiple: boolean
  anchorParentSelector: string
  anchorPattern: RegExp
  buttonTemplate: string
  contentTemplate: string
  dismissDelay: number
  dismissOnUnhover: boolean
  footnoteParentClass: string
  footnoteSelector: string
  hoverDelay: number
  numberResetSelector?: string
  scope?: string
}

export type TemplateData = {
  content: string
  id: string
  number: number
  reference: string
}

export type Footnote = {
  getId: () => string
  activate: (
    contentTemplate: string,
    onActivate?: (popover: HTMLElement, button: HTMLElement) => void
  ) => void
  dismiss: () => void
  hover: () => void
  isActive: () => boolean
  isChanging: () => boolean
  ready: () => void
  remove: () => void
  reposition: () => void
  resize: () => void
  startChanging: () => void
  stopChanging: () => void
}

type FootnoteCallback = (current: Footnote) => void

export type Adapter = {
  findFootnote: (id: string) => Footnote | undefined
  forEachFootnote: (callback: FootnoteCallback, selector?: string) => void
  forEachFootnoteExcept: (callback: FootnoteCallback, except: Footnote) => void
  hasHoveredFootnotes: () => boolean
}
