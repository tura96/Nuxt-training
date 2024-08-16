import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore()
    
    await authStore.loadFromCookie()
    
    // console.log('authStor333', authStore.isLoggedIn)
    // console.log('authStor333', to.path)
    
    if (authStore.isLoggedIn && to.path === '/login') {
        return navigateTo('/dashboard')
    }
   
    else if (!authStore.isLoggedIn && to.path !== '/login' &&  to.path !== '/register') {
        return navigateTo('/login')
    }
})

