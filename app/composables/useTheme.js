import { getThemes, getActiveTheme, createTheme, updateTheme, deleteTheme, setActiveTheme, seedTheme } from '~/services/firebase/themeFirebase'

export const useTheme = () => {
  const themes = useState('themes_list', () => [])
  const currentTheme = useState('current_theme', () => null)
  const loading = useState('theme_loading', () => false)
  const error = useState('theme_error', () => null)

  const fetchThemes = async () => {
    loading.value = true
    try {
      themes.value = await getThemes()
    } catch (e) {
      error.value = e
      console.error('Error fetching themes:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchActiveTheme = async () => {
    loading.value = true
    try {
      const active = await getActiveTheme()
      if (active) {
        currentTheme.value = active
        applyTheme(active)
      } else {
        await seedTheme()
        const newActive = await getActiveTheme()
        if (newActive) {
          currentTheme.value = newActive
          applyTheme(newActive)
        }
      }
    } catch (e) {
      error.value = e
      console.error('Error fetching active theme:', e)
    } finally {
      loading.value = false
    }
  }

  const addTheme = async (theme) => {
    try {
      await createTheme(theme)
      await fetchThemes()
    } catch (e) {
      console.error('Error adding theme:', e)
    }
  }

  const updateThemeConfig = async (id, theme) => {
    try {
      await updateTheme(id, theme)
      await fetchThemes()
      if (currentTheme.value && currentTheme.value.id === id) {
        currentTheme.value = { ...currentTheme.value, ...theme }
        applyTheme(currentTheme.value)
      }
    } catch (e) {
      console.error('Error updating theme:', e)
    }
  }

  const deleteThemeConfig = async (id) => {
    try {
      await deleteTheme(id)
      await fetchThemes()
    } catch (e) {
      console.error('Error deleting theme:', e)
    }
  }

  const setAsActive = async (id) => {
    try {
      await setActiveTheme(id)
      await fetchThemes()
      await fetchActiveTheme()
    } catch (e) {
      console.error('Error setting active theme:', e)
    }
  }

  const applyTheme = (theme) => {
    if (!theme || !theme.colors) return

    const colorMode = useColorMode()
    const root = document.documentElement

    const updateColors = () => {
      const mode = colorMode.value === 'dark' ? 'dark' : 'light'
      const colors = theme.colors[mode] || theme.colors.light || theme.colors

      if (!colors) return

      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value)
      })
    }
    updateColors()
    watch(() => colorMode.value, () => {
      updateColors()
    })
  }

  return {
    themes,
    currentTheme,
    loading,
    error,
    fetchThemes,
    fetchActiveTheme,
    addTheme,
    updateThemeConfig,
    deleteThemeConfig,
    setAsActive,
    applyTheme
  }
}
