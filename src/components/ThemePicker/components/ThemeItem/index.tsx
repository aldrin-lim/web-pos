import React from 'react'

type ThemeItemProps = {
  themeName: string
}

const ThemeItem: React.FC<ThemeItemProps> = ({ themeName }) => {
  return (
    <div
      className="overflow-hidden rounded-lg border border-base-content/20 outline outline-2 outline-offset-2 outline-transparent hover:border-base-content/40"
      data-set-theme={themeName}
      data-act-class="ACTIVECLASS"
    >
      <div
        data-theme={themeName}
        className="w-full cursor-pointer bg-base-100 font-sans text-base-content"
      >
        <div className="grid grid-cols-5 grid-rows-3">
          <div className="col-start-1 row-span-2 row-start-1 bg-base-200"></div>{' '}
          <div className="col-start-1 row-start-3 bg-base-300"></div>{' '}
          <div className="col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 bg-base-100 p-2">
            <div className="text-xs font-bold">{themeName}</div>{' '}
            <div className="flex flex-wrap gap-1">
              <div className="flex aspect-square w-5 items-center justify-center rounded bg-primary lg:w-6">
                <div className="text-sm font-bold text-primary-content">A</div>
              </div>{' '}
              <div className="flex aspect-square w-5 items-center justify-center rounded bg-secondary lg:w-6">
                <div className="text-sm font-bold text-secondary-content">
                  A
                </div>
              </div>{' '}
              <div className="flex aspect-square w-5 items-center justify-center rounded bg-accent lg:w-6">
                <div className="text-sm font-bold text-accent-content">A</div>
              </div>{' '}
              <div className="flex aspect-square w-5 items-center justify-center rounded bg-neutral lg:w-6">
                <div className="text-sm font-bold text-neutral-content">A</div>
              </div>
            </div>
          </div>
        </div>
      </div>{' '}
    </div>
  )
}

export default ThemeItem
