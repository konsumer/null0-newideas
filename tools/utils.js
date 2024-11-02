import YAML from 'yaml'
import { readFile, stat } from 'fs/promises'
import { basename } from 'path'
import { glob } from 'glob'

export const fileExists = path => stat(path).then(() => true, () => false)

export async function walkCats (walker) {
  for (const apiFilename of await glob('api/**/*.yml')) {
    const catName = basename(apiFilename, '.yml')
    const api = YAML.parse(await readFile(apiFilename, 'utf8'))
    await walker({ catName, apiFilename, api })
  }
}
