<template>
  <div class="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
    <AdminSidebar />

    <main class="pl-64 min-h-screen transition-all duration-300 ease-in-out">
      <div class="max-w-7xl mx-auto p-8 animate-fade-in">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import AdminSidebar from '~/components/admin/AdminSidebar.vue'

useHead({
  titleTemplate: '%s | Admin Dashboard',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ],
  bodyAttrs: {
    class: 'bg-slate-950 overflow-x-hidden'
  }
})
</script>

<style>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #0f172a;
}

::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #475569;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
