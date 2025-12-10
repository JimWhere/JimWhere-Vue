import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const profile = ref(null) // {id, name, avatar...}

  function setProfile(data){ profile.value = data }
  function clearProfile(){ profile.value = null }

  return { profile, setProfile, clearProfile }
})