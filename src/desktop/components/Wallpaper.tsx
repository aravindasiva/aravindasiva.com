/* Layers only. Everything that makes them a wallpaper is in styles/wallpaper.css. */
export function Wallpaper() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div data-wall="rules" />
      <div data-wall="majors" />
    </div>
  )
}
