import React from "react"
import ReactDOM from "react-dom/client"
import Player from "./components/Player"

const rootEl = document.getElementById("root")
const root = ReactDOM.createRoot(rootEl!)

root.render(
  <React.StrictMode>
    <Player />
  </React.StrictMode>
)
