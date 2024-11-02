// this will output the stub for types info used for other code-gen

import { writeFile } from 'fs/promises'
import { walkCats, fileExists } from './utils.js'

if (await fileExists('tools/types.json')) {
  console.error('This will only stub. If you really mean to overwrite, delete tools/types.json')
  process.exit(1)
}

// collect all the types
const argTypes = new Set()
const retTypes = new Set()

await walkCats(({ catName, apiFilename, api }) => {
  for (const func of Object.values(api)) {
    retTypes.add(func.returns || 'void')
    for (const a of Object.values(func.args || {})) {
      argTypes.add(a)
    }
  }
})

const out = {
}

for (const a of [...argTypes, ...retTypes]) {
  out[a] = {
    name: a.replace('*', '_pointer').replace('[]', '_array'),
    host: a,
    cart: {
      c: a,
      assemblyscript: a
    },
    size: 0
  }
}

out.args = [...argTypes]
out.returns = [...retTypes]

await writeFile('tools/types.json', JSON.stringify(out, null, 2))
