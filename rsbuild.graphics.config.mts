import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"

export default defineConfig({
  plugins: [pluginReact()],

  source: {
    entry: {
      "karaoke-machine": "./src/graphics/karaoke-machine.tsx"
    }
  },

  dev: {
    assetPrefix: ".",
    writeToDisk: true
  },

  output: {
    sourceMap: {
      js: "cheap-module-source-map",
      css: true
    },
    assetPrefix: ".",
    cleanDistPath: true,
    distPath: {
      root: "graphics"
    }
  }
})
