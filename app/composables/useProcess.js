export const useProcess = () => {
  const title = "Tu marca en manos expertas, en 3 simples pasos."

  const steps = [
    {
      id: 1,
      title: "Encuentra tu estilo",
      description: "Navega nuestra selección curada de productos tendencia. Desde tecnología hasta eco-sostenibles, tenemos el artículo perfecto que habla el idioma de tu marca.",
      icon: "i-heroicons-magnifying-glass"
    },
    {
      id: 2,
      title: "Previsualización Gratuita",
      description: "¿Dudas de cómo se verá? Envíanos tu logo y nuestros diseñadores crearán un montaje digital (mockup) sin costo para que apruebes cada detalle antes de producción.",
      icon: "i-heroicons-eye"
    },
    {
      id: 3,
      title: "Recibe e Impacta",
      description: "Una vez aprobado, nos encargamos de la magia. Producción de alta calidad y logística puntual para que tus promocionales lleguen justo para tu evento.",
      icon: "i-heroicons-rocket-launch"
    }
  ]

  const guarantee = "No imprimimos nada hasta que estés 100% feliz con el diseño digital."

  return {
    title,
    steps,
    guarantee
  }
}
