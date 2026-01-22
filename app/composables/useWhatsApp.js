import {
  getWhatsAppContacts,
  addWhatsAppContact,
  updateWhatsAppContact,
  deleteWhatsAppContact,
  getWhatsAppContactById
} from '~/services/firebase/whatsappFirebase'

export const useWhatsApp = () => {
  const contacts = useState('whatsapp_contacts_list', () => [])
  const loading = useState('whatsapp_loading', () => false)
  const isModalOpen = useState('whatsapp_modal_open', () => false)
  const currentMessage = useState('whatsapp_current_message', () => '')

  const fetchContacts = async () => {
    loading.value = true
    try {
      const data = await getWhatsAppContacts()
      contacts.value = data.map(contact => ({
        ...contact,
        image: contact.image || DEFAULT_WHATSAPP_IMAGE
      }))
    } catch (e) {
      console.error('Error fetching contacts:', e)
    } finally {
      loading.value = false
    }
  }

  const addContact = async (contact) => {
    loading.value = true
    try {
      await addWhatsAppContact(contact)
      await fetchContacts()
    } catch (e) {
      console.error('Error adding contact:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateContact = async (id, updates) => {
    loading.value = true
    try {
      await updateWhatsAppContact(id, updates)
      await fetchContacts()
    } catch (e) {
      console.error('Error updating contact:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteContact = async (id) => {
    loading.value = true
    try {
      await deleteWhatsAppContact(id)
      await fetchContacts()
    } catch (e) {
      console.error('Error deleting contact:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const getContact = async (id) => {
    try {
      let item = null
      if (contacts.value.length > 0) {
        item = contacts.value.find(i => i.id === id)
      }
      
      if (!item) {
        item = await getWhatsAppContactById(id)
      }

      if (item) {
        return {
          ...item,
          image: item.image || DEFAULT_WHATSAPP_IMAGE
        }
      }
      return null
    } catch (e) {
      console.error('Error getting whatsapp contact:', e)
      throw e
    }
  }

  const openModal = (message = '') => {
    currentMessage.value = message
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
    currentMessage.value = ''
  }

  return {
    contacts,
    loading,
    isModalOpen,
    currentMessage,
    fetchContacts,
    addContact,
    updateContact,
    deleteContact,
    getContact,
    openModal,
    closeModal,
    DEFAULT_WHATSAPP_IMAGE
  }
}

export const DEFAULT_WHATSAPP_IMAGE = 'https://res.cloudinary.com/djcbrawhb/image/upload/v1765337698/mam_whtasapp_zq35lb.png'
