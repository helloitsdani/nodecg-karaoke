import { ConfigProvider, theme } from "antd"
import React from "react"
import ReactDOM from "react-dom/client"

import TrackSelector from "./components/TrackSelector"

const rootEl = document.getElementById("root")
const root = ReactDOM.createRoot(rootEl!)

root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm
      }}
    >
      <div>
        <TrackSelector onUpdateTrack={(track) => console.log(track)} />
      </div>
    </ConfigProvider>
  </React.StrictMode>
)
