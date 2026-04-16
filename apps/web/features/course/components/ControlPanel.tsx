'use client'

interface ControlPanelProps {
  distanceKm: number
  onDistanceChange: (km: number) => void
  onGenerate: () => void
  onRegenerate: () => void
  isLoading: boolean
  resultDistanceKm: number | null
  hasRoute: boolean
}

export default function ControlPanel({
  distanceKm,
  onDistanceChange,
  onGenerate,
  onRegenerate,
  isLoading,
  resultDistanceKm,
  hasRoute,
}: ControlPanelProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        地図をクリックしてスタート地点を変更できます
      </p>

      {/* 距離スライダー */}
      <div className="flex flex-col gap-2">
        <label htmlFor="distance" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          距離
        </label>
        <div className="flex items-center gap-3">
          <input
            id="distance"
            type="range"
            min={1}
            max={30}
            step={1}
            value={distanceKm}
            onChange={(e) => onDistanceChange(Number(e.target.value))}
            className="flex-1 h-2 accent-blue-600 cursor-pointer"
            style={{ minHeight: '44px' }}
          />
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 w-16 text-right tabular-nums">
            {distanceKm} km
          </span>
        </div>
      </div>

      {/* コース生成ボタン */}
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full h-12 rounded-lg bg-blue-600 text-white font-medium text-base
                   hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
      >
        {isLoading ? '生成中...' : 'コースを生成'}
      </button>

      {/* 結果表示 */}
      {hasRoute && resultDistanceKm !== null && (
        <div className="flex flex-col gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-700">
          <div className="flex flex-col gap-1">
            <p className="text-base text-zinc-700 dark:text-zinc-300">
              総距離:
              <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 ml-1">
                {resultDistanceKm} km
              </span>
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <span className="inline-block w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold leading-4 text-center">S</span>
              マーカーがスタート＆ゴール地点です
            </p>
          </div>
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="w-full h-11 rounded-lg border border-zinc-300 dark:border-zinc-600
                       text-zinc-700 dark:text-zinc-300 font-medium text-sm
                       hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50
                       transition-colors"
          >
            別のコースを生成
          </button>
        </div>
      )}
    </div>
  )
}
