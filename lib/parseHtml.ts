import * as h2m from 'h2m'
import { htmlDecode } from 'js-htmlencode'

export const trim = (html: string = ''): string => {
  const trimmed = html
    .replace(/&#160;/g, ' ')
    .split('>')
    .map((token) => token.trim())
    .join('>')
    .split('</')
    .map((token) => token.trim())
    .join('</')

  let result = trimmed
  const rxSpaces = /href="(.*)"/g
  let matches = trimmed.match(rxSpaces)
  if (matches) {
    // eslint-disable-next-line no-restricted-syntax
    for (const match of matches) {
      result = result.replace(match, match.replace(/ /g, '%20'))
    }
  }

  const rxSpacesSing = /href='(.*)'/g
  matches = trimmed.match(rxSpacesSing)
  if (matches) {
    // eslint-disable-next-line no-restricted-syntax
    for (const match of matches) {
      result = result.replace(match, match.replace(/ /g, '%20'))
    }
  }
  return result
}

interface Node {
  name: string
  attrs: { [key: string]: string }
  isInPreNode: boolean
  md: string
}
const converter = 'MarkdownExtra'
const overides = {
  a: (node: Node) => `[${node.md}](${node.attrs.href})`,
}

export const toMarkdown = (html: string): string => {
  const trimmed = trim(html)
  const markdown = h2m(trimmed, { overides, converter })
  const decoded = htmlDecode(markdown)
  return decoded
}
