import { ConfigProvider, theme } from "antd"
import React from "react"
import ReactDOM from "react-dom/client"

import Player from "./components/Player"

const rootEl = document.getElementById("root")
const root = ReactDOM.createRoot(rootEl!)

root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm
      }}
    >
      <Player />
    </ConfigProvider>
  </React.StrictMode>
)
