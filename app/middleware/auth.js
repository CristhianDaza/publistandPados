export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()

  if (to.path.startsWith('/admin')) {
    if (!user.value) {
      return navigateTo('/login')
    }

    if (user.value.role === 'cliente') {
      return navigateTo('/quotes')
    }
  }

  if (user.value && to.path === '/login') {
    if (user.value.role === 'cliente') {
      return navigateTo('/quotes')
    }
    return navigateTo('/admin')
  }
})
