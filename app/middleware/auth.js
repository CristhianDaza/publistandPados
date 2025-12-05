export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()

  if (!user.value && to.path === '/admin') {
    return navigateTo('/login')
  }

  if (user.value && to.path === '/login') {
    return navigateTo('/admin')
  }
})
