type WindowLightProps = {
  tone: string
  label: string
  glyph: string
  onPress: () => void
}

/*
  The dot stays 12px like macOS while the button around it is 24px, so lights
  tile edge to edge and meet WCAG 2.5.8 outright. Dots at a macOS-tight 8px gap
  sit 19px apart and fail even the spacing exception, which wants 24.

  The glyph appears on hover of whichever group owns the row, so a resting window
  shows three plain dots, as macOS does.
*/
export function WindowLight({ tone, label, glyph, onPress }: WindowLightProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      className="flex size-6 flex-none cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
    >
      <span
        className={`flex size-light items-center justify-center rounded-full text-micro leading-none font-bold text-black/60 ${tone}`}
      >
        <span
          aria-hidden
          className="opacity-0 transition-opacity group-hover/lights:opacity-100"
        >
          {glyph}
        </span>
      </span>
    </button>
  )
}
