const LIGHTS = [
  { name: 'close', className: 'bg-light-close' },
  { name: 'minimise', className: 'bg-light-minimise' },
  { name: 'fullscreen', className: 'bg-light-fullscreen' },
]

/* Decorative until the window states land, and permanently so on touch. */
export function TrafficLights() {
  return (
    <div aria-hidden className="flex flex-none gap-2">
      {LIGHTS.map((light) => (
        <span
          key={light.name}
          className={`size-light rounded-full ${light.className}`}
        />
      ))}
    </div>
  )
}
