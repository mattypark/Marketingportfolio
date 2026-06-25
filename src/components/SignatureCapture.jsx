import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Sign-here capture page.
 * Records every pointer stroke with timing, draws it live, and exports:
 *  - signature.json  → strokes with normalized {x,y,t} points (exact replay)
 *  - signature.svg   → smoothed paths in stroke order (fallback / preview)
 *
 * Reach it at:  <site>/?sign
 * Sign with a touchscreen or iPad for the smoothest line.
 */
export default function SignatureCapture() {
  const canvasRef = useRef(null)
  const strokesRef = useRef([]) // [{ points: [{x,y,t}] }]
  const drawingRef = useRef(false)
  const startTimeRef = useRef(0)
  const [count, setCount] = useState(0)

  // --- canvas sizing (devicePixelRatio aware) ---
  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#16110d'
    ctx.lineWidth = 3.2
    redraw()
  }, [])

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)
    for (const stroke of strokesRef.current) {
      const pts = stroke.points
      if (pts.length < 2) continue
      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)
      for (let i = 1; i < pts.length; i++) {
        const mid = { x: (pts[i - 1].x + pts[i].x) / 2, y: (pts[i - 1].y + pts[i].y) / 2 }
        ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, mid.x, mid.y)
      }
      ctx.stroke()
    }
  }, [])

  useEffect(() => {
    fitCanvas()
    window.addEventListener('resize', fitCanvas)
    return () => window.removeEventListener('resize', fitCanvas)
  }, [fitCanvas])

  // --- pointer handlers ---
  const localPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top, t: performance.now() - startTimeRef.current }
  }

  const onDown = (e) => {
    e.preventDefault()
    if (strokesRef.current.length === 0) startTimeRef.current = performance.now()
    drawingRef.current = true
    strokesRef.current.push({ points: [localPoint(e)] })
    setCount((c) => c + 1)
  }

  const onMove = (e) => {
    if (!drawingRef.current) return
    const stroke = strokesRef.current[strokesRef.current.length - 1]
    stroke.points.push(localPoint(e))
    redraw()
  }

  const onUp = () => {
    drawingRef.current = false
  }

  // --- actions ---
  const clear = () => {
    strokesRef.current = []
    setCount(0)
    redraw()
  }

  const undo = () => {
    strokesRef.current.pop()
    setCount(strokesRef.current.length)
    redraw()
  }

  // Normalize all points to a 0..1000 x viewBox, preserving aspect.
  const buildExport = () => {
    const all = strokesRef.current.flatMap((s) => s.points)
    if (all.length < 2) return null
    const xs = all.map((p) => p.x)
    const ys = all.map((p) => p.y)
    const minX = Math.min(...xs)
    const minY = Math.min(...ys)
    const w = Math.max(...xs) - minX || 1
    const h = Math.max(...ys) - minY || 1
    const VW = 1000
    const VH = Math.round((h / w) * VW)
    const norm = (p) => ({
      x: +(((p.x - minX) / w) * VW).toFixed(2),
      y: +(((p.y - minY) / h) * VH).toFixed(2),
      t: Math.round(p.t),
    })

    const strokes = strokesRef.current
      .map((s) => ({ points: s.points.map(norm) }))
      .filter((s) => s.points.length >= 2)

    // SVG paths (smoothed) per stroke
    const paths = strokes.map((s) => {
      const pts = s.points
      let d = `M ${pts[0].x} ${pts[0].y}`
      for (let i = 1; i < pts.length; i++) {
        const mid = { x: ((pts[i - 1].x + pts[i].x) / 2).toFixed(2), y: ((pts[i - 1].y + pts[i].y) / 2).toFixed(2) }
        d += ` Q ${pts[i - 1].x} ${pts[i - 1].y} ${mid.x} ${mid.y}`
      }
      return d
    })

    return { viewBox: `0 0 ${VW} ${VH}`, width: VW, height: VH, strokes, paths }
  }

  const download = (filename, text, type) => {
    const blob = new Blob([text], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportFiles = () => {
    const data = buildExport()
    if (!data) {
      alert('Sign first — need at least one stroke.')
      return
    }
    download('signature.json', JSON.stringify(data, null, 2), 'application/json')

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${data.viewBox}" fill="none" stroke="#16110d" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
${data.paths.map((d) => `  <path d="${d}" />`).join('\n')}
</svg>`
    download('signature.svg', svg, 'image/svg+xml')
  }

  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center gap-6 bg-cream px-6 py-12">
      <div className="text-center">
        <p className="eyebrow">Signature capture</p>
        <h1 className="display mt-3 text-[clamp(1.8rem,1.2rem+2vw,2.8rem)]">Sign below</h1>
        <p className="mt-2 text-muted">
          Write it exactly how you sign. Touchscreen / iPad is smoothest. Then hit Export and send me the files.
        </p>
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        className="h-[42vh] w-full max-w-[820px] touch-none rounded-2xl border border-line bg-paper shadow-[var(--shadow-soft)]"
        style={{ cursor: 'crosshair' }}
      />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button onClick={undo} className="rounded-full border border-line px-5 py-2.5 font-mono text-[0.72rem] uppercase tracking-label text-muted transition-colors hover:border-ink hover:text-ink">
          Undo
        </button>
        <button onClick={clear} className="rounded-full border border-line px-5 py-2.5 font-mono text-[0.72rem] uppercase tracking-label text-muted transition-colors hover:border-ink hover:text-ink">
          Clear
        </button>
        <button onClick={exportFiles} className="rounded-full bg-ink px-6 py-2.5 font-mono text-[0.72rem] uppercase tracking-label text-cream transition-transform duration-300 ease-out-expo hover:-translate-y-0.5">
          Export signature
        </button>
      </div>

      <p className="font-mono text-[0.7rem] text-faint">{count} stroke{count === 1 ? '' : 's'} captured</p>
    </div>
  )
}
