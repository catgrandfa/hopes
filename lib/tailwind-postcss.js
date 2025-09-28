const fs = require('fs')
const path = require('path')
const postcss = require('postcss')

function resolvePnpmPackage(pkgName) {
  const pnpmDir = path.resolve(process.cwd(), 'node_modules', '.pnpm')
  const scoped = pkgName.replace('/', '+')
  const entries = fs.readdirSync(pnpmDir)
  const match = entries.find((entry) => entry.startsWith(`${scoped}@`))

  if (!match) {
    throw new Error(`Unable to locate ${pkgName} inside pnpm virtual store`)
  }

  return path.join(pnpmDir, match, 'node_modules', ...pkgName.split('/'))
}

const tailwindNode = require(path.join(resolvePnpmPackage('@tailwindcss/node'), 'dist', 'index.js'))
const { Scanner } = require(path.join(resolvePnpmPackage('@tailwindcss/oxide'), 'index.js'))

function tailwindPostcssPlugin() {
  const projectRoot = process.cwd()

  return {
    postcssPlugin: 'tailwindcss',
    async Once(root, { result }) {
      const fromPath = result.opts.from ? path.resolve(result.opts.from) : undefined
      const inputCss = root.toString()

      const compiler = await tailwindNode.compile(inputCss, {
        base: projectRoot,
        from: fromPath,
        shouldRewriteUrls: true,
        async onDependency(dependency) {
          if (!dependency) return
          result.messages.push({ type: 'dependency', plugin: 'tailwindcss', file: dependency })
        },
      })

      const candidates = new Set()
      const dependencyFiles = new Set()

      if (compiler.features & tailwindNode.Features.Utilities) {
        const sources = []

        if (compiler.root === null) {
          sources.push({ base: projectRoot, pattern: '**/*', negated: false })
        } else if (compiler.root !== 'none') {
          sources.push({ ...compiler.root, negated: false })
        }

        if (Array.isArray(compiler.sources)) {
          for (const source of compiler.sources) {
            sources.push(source)
          }
        }

        const scanner = new Scanner({ sources })

        for (const candidate of scanner.scan()) {
          candidates.add(candidate)
        }

        for (const file of scanner.files ?? []) {
          dependencyFiles.add(path.resolve(file))
        }
      }

      for (const file of dependencyFiles) {
        result.messages.push({ type: 'dependency', plugin: 'tailwindcss', file })
      }

      const cssOutput = compiler.build([...candidates])
      const parsed = postcss.parse(cssOutput, { from: fromPath })

      root.removeAll()
      root.append(parsed)
    },
  }
}

module.exports = tailwindPostcssPlugin
module.exports.postcss = true
