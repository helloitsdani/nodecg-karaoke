import { ConfigProvider, theme } from "antd"
import React from "react"
import ReactDOM from "react-dom/client"

import KaraokeMachine from "./components/KaraokeMachine"

const rootEl = document.getElementById("root")
const root = ReactDOM.createRoot(rootEl!)

root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm
      }}
    >
      <KaraokeMachine />
    </ConfigProvider>
  </React.StrictMode>
)
