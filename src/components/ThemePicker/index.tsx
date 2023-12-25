import DaisyThemes from 'daisyui/src/theming/themes'
import ThemeItem from './components/ThemeItem'

const themes = Object.keys(DaisyThemes).map((theme) => {
  const match = theme.match(/\[data-theme=(.*?)\]/)
  return match ? match[1] : ''
})

const ThemePicker = () => {
  return (
    <div>
      <h1>Theme Picker</h1>
      <div className="ThemeList rounded-box grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-4 ">
        {themes.map((theme) => (
          <ThemeItem themeName={theme} key={theme} />
        ))}
      </div>
    </div>
  )
}

export default ThemePicker
