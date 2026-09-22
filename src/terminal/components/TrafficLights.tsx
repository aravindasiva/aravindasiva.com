import { WindowLight } from '@/components/WindowLight'

type TrafficLightsProps = {
  interactive: boolean
  fullscreen: boolean
  onClose: () => void
  onMinimise: () => void
  onToggleFullscreen: () => void
}

const TONES = ['bg-light-close', 'bg-light-minimise', 'bg-light-fullscreen']

/* Decorative on touch, where there is no window to minimise and nothing behind it. */
export function TrafficLights({
  interactive,
  fullscreen,
  onClose,
  onMinimise,
  onToggleFullscreen,
}: TrafficLightsProps) {
  if (!interactive) {
    return (
      <div aria-hidden className="flex flex-none">
        {TONES.map((tone) => (
          <span
            key={tone}
            className="flex size-6 flex-none items-center justify-center"
          >
            <span className={`size-light rounded-full ${tone}`} />
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="group/lights flex flex-none">
      <WindowLight
        tone="bg-light-close"
        label="Close"
        glyph="✕"
        onPress={onClose}
      />
      <WindowLight
        tone="bg-light-minimise"
        label="Minimise"
        glyph="−"
        onPress={onMinimise}
      />
      <WindowLight
        tone="bg-light-fullscreen"
        label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        glyph={fullscreen ? '⤡' : '⤢'}
        onPress={onToggleFullscreen}
      />
    </div>
  )
}
