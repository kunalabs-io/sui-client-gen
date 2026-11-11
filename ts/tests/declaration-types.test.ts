import { readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { expect, expectTypeOf, it } from 'vitest'
import { Option } from './gen/std/option/structs'
import { ID } from './gen/sui/object/structs'
import { Action } from './gen/examples/enums/structs'

const TS_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const GEN_DIR = path.join(TS_ROOT, 'tests', 'gen')

const structFiles = (readdirSync(GEN_DIR, { recursive: true }) as string[])
  .filter(file => path.basename(file) === 'structs.ts')
  .map(file => path.join(GEN_DIR, file))

const emitDeclarations = (files: string[]): Map<string, string> => {
  const configPath = path.join(TS_ROOT, 'tsconfig.json')
  const { config } = ts.readConfigFile(configPath, ts.sys.readFile)
  const { options } = ts.parseJsonConfigFileContent(config, ts.sys, TS_ROOT)
  const program = ts.createProgram(files, {
    ...options,
    composite: false,
    incremental: false,
    declaration: true,
    emitDeclarationOnly: true,
    noEmit: false,
  })
  const declarations = new Map<string, string>()
  program.emit(undefined, (name, text) => declarations.set(name, text), undefined, true)
  return declarations
}

it('declares every bcs getter with a type that does not go through a private member', () => {
  expect(structFiles.length).toBeGreaterThan(0)

  const offenders = [...emitDeclarations(structFiles)]
    .filter(([, text]) => /static get bcs\(\):[^{;]*\.instantiateBcs>/.test(text))
    .map(([name]) => path.relative(TS_ROOT, name))

  expect(offenders).toEqual([])
}, 120_000)

it('types the parsed value of a non-generic, a generic and an enum bcs', () => {
  expectTypeOf(ID.bcs.parse).returns.toEqualTypeOf<{ bytes: string }>()
  expectTypeOf(Option.bcs(ID.bcs).parse).returns.toEqualTypeOf<{ vec: { bytes: string }[] }>()
  expectTypeOf(Action.bcs(ID.bcs).parse).returns.not.toBeAny()
})
