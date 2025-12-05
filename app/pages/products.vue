<template>
  <UContainer class="py-12">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <span class="text-primary font-bold tracking-wider uppercase text-sm">Catálogo</span>
        <h2 class="text-3xl md:text-4xl font-bold mt-2 mb-4">Nuestras Categorías</h2>
        <div class="w-24 h-1 bg-primary mx-auto rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="card in categoriasCards" 
          :key="card.titulo" 
          class="group relative bg-secondary/5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-secondary/20 hover:-translate-y-2"
        >
          <div class="absolute -top-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500 rotate-12">
            <UIcon :name="card.icono" class="w-48 h-48 text-primary" />
          </div>

          <div class="p-8 relative z-10 h-full flex flex-col">
            <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 shadow-sm">
              <UIcon :name="card.icono" class="w-7 h-7 text-primary group-hover:text-white transition-colors" />
            </div>
            
            <h3 class="text-xl font-bold mb-4 text-secondary group-hover:text-primary transition-colors">
              {{ card.titulo }}
            </h3>
            
            <ul class="space-y-3 flex-grow">
              <li v-for="item in card.items" :key="item" class="flex items-start text-sm text-secondary group-hover:translate-x-1 transition-transform duration-300">
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 mr-3 text-primary/60 flex-shrink-0 mt-0.5" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
const { getProducts, products, loading } = useProducts()
const syncLoading = ref(false)
const toast = useToast()

const categoriasCards = [
  {
    titulo: "Bolígrafos y Escritura",
    icono: "i-heroicons-pencil",
    items: [
      "Bolígrafos plásticos",
      "Bolígrafos metálicos",
      "Bolígrafos ecológicos",
      "Boligrafos en aluminio",
      "Bolígrafos con resaltador",
      "Metalicos con Stylus",
      "plasticos con stylus",
      "Memorias - boligrafos",
      "Resaltadores",
      "Lápices, colores y crayolas",
      "Portaminas",
      "Estuches bolilgrafos"
    ]
  },
  {
    titulo: "Mugs, Vasos y Bebidas",
    icono: "i-heroicons-beaker",
    items: [
      "Mugs y vasos metálicos",
      "Mugs de cerámica",
      "Mug - produccion nacional",
      "Mug Sublimación",
      "Mug ceramica",
      "Mug plasticos",
      "Vasos plásticos y ecológicos",
      "Vasos y copas",
      "Botellas en acero",
      "Botellas en aluminio",
      "Botellas deportivas plásticas",
      "Termos",
      "Aislamiento Térmico (Vacuum)"
    ]
  },
  {
    titulo: "Paraguas e Impermeables",
    icono: "i-heroicons-cloud",
    items: [
      "Paraguas",
      "Paraguas - mini 21 pulgadas",
      "Paraguas Mini",
      "Paraguas Fashion",
      "Paraguas Golf",
      "Paraguas - normales 23 a 30 pulgadas",
      "Impermeables"
    ]
  },
  {
    titulo: "Tecnología y Audio",
    icono: "i-heroicons-speaker-wave",
    items: [
      "Audífonos",
      "Altavoz",
      "Speaker y parlantes",
      "Pilas power bank",
      "Cables y adaptadores de carga",
      "Memorias - metalicas",
      "Memorias - plasticas",
      "Usb",
      "Tecnologia - USB memorias",
      "Mouse-pad",
      "Accesorios para móviles",
      "Saldos - Tecnologia"
    ]
  },
  {
    titulo: "Bolsos y Maletines",
    icono: "i-heroicons-briefcase",
    items: [
      "Morrales",
      "Maletines",
      "Maletines - ejecutivos",
      "Maletines deportivos",
      "Maletines - trolley",
      "Maletines - neveras",
      "Neveras loncheras",
      "Canguros",
      "Manos libres",
      "Tula, morral",
      "Bolsos de mano",
      "Maletas y estuches de viaje"
    ]
  },
  {
    titulo: "Oficina y Negocios",
    icono: "i-heroicons-building-office",
    items: [
      "Libretas",
      "Libretas ecológicas",
      "Libretas plásticas",
      "Memos y adhesivos",
      "Stickies y sets",
      "Calculadoras",
      "Cintas métricas",
      "Identificadores - oficina",
      "Oficina - tarjeteros",
      "Oficina - portadocumentos y portafolios",
      "Accesorios de escritorio"
    ]
  },
  {
    titulo: "Hogar y Herramientas",
    icono: "i-heroicons-wrench-screwdriver",
    items: [
      "Herramientas",
      "Herramientas - multiusos",
      "Linternas",
      "Llaveros",
      "Llaveros metálicos",
      "Accesorios de cocina",
      "Set de BBBQ",
      "Bar",
      "Relojes",
      "Reloj - pared",
      "Accesorios de hogar"
    ]
  },
  {
    titulo: "Salud, Belleza y Deportes",
    icono: "i-heroicons-heart",
    items: [
      "Cuidado personal",
      "Salud y Belleza",
      "Limas y manicure",
      "Gafas",
      "Deportes",
      "Fútbol",
      "Golf",
      "Bicicleta",
      "Tiempo Libre",
      "Gorras"
    ]
  },
  {
    titulo: "Ecológicos y Materiales",
    icono: "i-heroicons-globe-alt",
    items: [
      "Bambú",
      "Corcho",
      "Paja de trigo",
      "Elaborado de café",
      "Aluminio reciclado",
      "Cartón reciclado",
      "EcoNature",
      "Marca Ecopromo"
    ]
  }
];

const handleFetchProducts = async () => {
  await getProducts()
  
  if (products.value && products.value.length > 0) {
    console.log('Products:', products.value)
    const apis = [...new Set(products.value.map(p => p.api).filter(Boolean))]
    console.log('Unique APIs:', apis)

    const categories = [...new Set(products.value.flatMap(p => p.category || []))]
    console.log('Unique Categories:', categories)
  } else {
    console.log('No products found or empty list.')
  }
}

const syncProducts = async () => {
  syncLoading.value = true
  try {
    const res = await $fetch('/api/sync-products', { method: 'POST' })
    toast.add({ title: 'Éxito', description: res.message })
  } catch (error) {
    toast.add({ title: 'Error', description: error.statusMessage || 'Error al sincronizar', color: 'red' })
  } finally {
    syncLoading.value = false
  }
}
</script>
