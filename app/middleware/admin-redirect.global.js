export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith('/admin') && !from.path.startsWith('/admin') && from.path !== '/login') {
    const adminReturnUrl = useCookie('admin_return_url')
    adminReturnUrl.value = from.fullPath
  }
})
