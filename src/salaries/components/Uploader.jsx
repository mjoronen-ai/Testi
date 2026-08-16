// Tiedostojen lataus: raahaa ja pudota tai valitse selaimen valitsimella.
// Tiedostot luetaan selaimessa — mitään ei lähetetä verkkoon.

import { useRef, useState } from 'react'
import { readTextFile } from '../lib/readFile.js'
import { Button } from './ui.jsx'

const SAMPLES = [
  'esimerkkiliiga-fin-2026.csv',
  'exempelligan-swe-2026.csv',
  'example-league-eng-2026.csv',
]

export default function Uploader({ onFiles, compact = false }) {
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef(null)

  async function handleFiles(fileList) {
    const files = [...fileList].filter((f) => f.size > 0)
    if (files.length === 0) return
    setBusy(true)
    try {
      const read = []
      for (const file of files) {
        const { text, encoding } = await readTextFile(file)
        read.push({ name: file.name, size: file.size, text, encoding })
      }
      onFiles(read)
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function loadSamples() {
    setBusy(true)
    try {
      const read = []
      for (const name of SAMPLES) {
        const res = await fetch(`${import.meta.env.BASE_URL}esimerkkidata/${name}`)
        if (!res.ok) continue
        const text = await res.text()
        read.push({ name, size: text.length, text, encoding: 'UTF-8' })
      }
      if (read.length > 0) onFiles(read)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={`border-2 border-dashed rounded-lg text-center transition-colors ${
        compact ? 'p-4' : 'p-10'
      } ${dragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white'}`}
    >
      <p className={`font-medium text-slate-900 ${compact ? 'text-sm' : 'text-base'}`}>
        {busy ? 'Luetaan tiedostoja…' : 'Raahaa CSV-tiedostot tähän'}
      </p>
      {!compact && (
        <p className="text-sm text-slate-500 mt-1">
          Yksi tai useampi tiedosto kerrallaan. Erotin (pilkku, puolipiste, sarkain),
          desimaalipilkku, valuuttasymbolit ja tuhaterottimet tunnistetaan automaattisesti.
        </p>
      )}

      <div className="flex items-center justify-center gap-2 mt-3">
        <Button variant="primary" onClick={() => inputRef.current?.click()} disabled={busy}>
          Valitse tiedostot
        </Button>
        <Button onClick={loadSamples} disabled={busy} title="Kolme kuvitteellista esimerkkitiedostoa eri muodoissa">
          Lataa esimerkkidata
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv,.tsv,.txt,text/csv,text/plain"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
