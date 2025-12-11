<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
            <th v-for="col in columns" :key="col.key" class="p-4 font-semibold">
              {{ col.label }}
            </th>
            <th class="p-4 font-semibold text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
          <tr
            v-for="item in items"
            :key="item.id"
            class="group hover:bg-slate-800/50 transition-colors duration-200"
          >
            <td v-for="col in columns" :key="col.key" class="p-4 text-slate-300">
              <div v-if="col.type === 'image'" class="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden border border-slate-700">
                <img
                  :src="item[col.key]"
                  :alt="col.label"
                  class="w-full h-full object-cover"
                  loading="lazy"
                >
              </div>

              <div v-else-if="col.type === 'boolean'">
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="item[col.key] ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'"
                >
                  {{ item[col.key] ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
              <div v-else-if="col.type === 'color'" class="flex items-center gap-2">
                <div
                  class="w-6 h-6 rounded-full border border-slate-700 shadow-sm"
                  :style="{ backgroundColor: item[col.key] }"
                />
                <span class="text-xs font-mono text-slate-500">{{ item[col.key] }}</span>
              </div>

              <a
                v-else-if="col.type === 'link'"
                :href="item[col.key]"
                target="_blank"
                class="text-blue-400 hover:text-blue-300 hover:underline truncate max-w-[200px] block"
              >
                {{ item[col.key] }}
              </a>

              <div v-else class="truncate max-w-[200px]" :title="item[col.key]">
                {{ item[col.key] }}
              </div>
            </td>

            <td class="p-4 text-right">
              <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button class="p-2 rounded-lg text-blue-400 hover:bg-blue-500/10 hover:shadow shadow-blue-500/20 transition-all cursor-pointer" title="Editar">
                  <UIcon name="i-heroicons-pencil-square" class="w-5 h-5" />
                </button>
                <button class="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:shadow shadow-red-500/20 transition-all cursor-pointer" title="Eliminar">
                  <UIcon name="i-heroicons-trash" class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td :colspan="columns.length + 1" class="p-8 text-center text-slate-500">
              <div class="flex flex-col items-center gap-2">
                <UIcon name="i-heroicons-inbox" class="w-8 h-8 opacity-50" />
                <p>No se encontraron elementos</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
