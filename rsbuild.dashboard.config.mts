import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"

export default defineConfig({
  plugins: [pluginReact()],

  source: {
    entry: {
      "karaoke-machine": "./src/dashboard/karaoke-machine.tsx"
    }
  },

  dev: {
    assetPrefix: ".",
    writeToDisk: true
  },

  output: {
    minify: false,
    sourceMap: {
      js: "inline-cheap-module-source-map",
      css: true
    },
    assetPrefix: ".",
    cleanDistPath: true,
    distPath: {
      root: "dashboard"
    }
  }
})
