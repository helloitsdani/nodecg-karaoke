import "./karaoke-player.module.css"

import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import Player from "./components/Player"

const queryClient = new QueryClient()
const rootEl = document.getElementById("root")
const root = ReactDOM.createRoot(rootEl!)

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Player />
    </QueryClientProvider>
  </React.StrictMode>
)
