import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank">
          <img
            src={viteLogo}
            className="h-24 p-4 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            className="h-24 p-4 transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa] animate-spin-slow"
            alt="React logo"
          />
        </a>
      </div>

      <h1 className="text-5xl font-bold mb-8">TerraNova</h1>

      <div className="p-8">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="rounded-lg border border-transparent bg-gray-800 px-5 py-2.5 text-base font-medium cursor-pointer transition-colors hover:border-indigo-500"
        >
          count is {count}
        </button>
      </div>

      <p className="text-gray-400">Vite + React + TailwindCSS</p>
    </div>
  )
}

export default App
