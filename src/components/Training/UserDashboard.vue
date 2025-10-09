// javascript
<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4">My Trainings</h2>
      <div class="flex items-center gap-3" style="justify-content: end;">
      <button @click="downloadReport" class="px-3 py-2 bg-green-600 text-white rounded">
              Export XLSX
            </button>
            </div>
    <div v-if="loading" class="text-gray-600">Loading trainings...</div>
    <div v-else>
      <div v-if="error" class="mb-4 text-red-600">{{ error }}</div>

      <!-- <button @click="openCreate" class="mb-4 px-3 py-2 bg-indigo-600 text-white rounded">Add Training</button> -->

      <table class="w-full border-collapse">
        <thead>
          <tr class="text-left">
            <th class="border-b py-2">Training Code</th>
            <th class="border-b py-2">Effectiveness (%)</th>
            <th class="border-b py-2">Updated At</th>
            <th class="border-b py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in trainings" :key="t._id" class="align-top">
            <td class="py-2 pr-4">{{ t.trainingCode }}</td>
            <td class="py-2 pr-4">{{ formatPercent(t.trainingEffectivenessPercent) }}</td>
            <td class="py-2 pr-4">{{ formatDate(t.updatedAt) }}</td>
            <td class="py-2 pr-4">
              <!-- <button @click="openEdit(t)" class="mr-2 px-2 py-1 border rounded">Edit</button>
              -->
              <button @click="confirmDelete(t)" class="px-2 py-1 border rounded text-red-600">Delete</button>
            </td>
          </tr>
          <tr v-if="trainings.length === 0">
            <td colspan="4" class="py-4 text-gray-600">No trainings yet. Create one.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit / Create Modal -->
    <div v-if="modalOpen" class="fixed inset-0 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-lg w-full max-w-lg p-6">
        <h3 class="text-lg font-semibold mb-4">{{ editing ? 'Edit Training' : 'Create Training' }}</h3>

        <form @submit.prevent="save">
          <div class="mb-3">
            <label class="block text-sm text-gray-700 mb-1">Training Code</label>
            <input v-model="form.trainingCode" required class="w-full px-3 py-2 border rounded" />
          </div>

          <div class="mb-3">
            <label class="block text-sm text-gray-700 mb-1">Effectiveness (%)</label>
            <input v-model.number="form.trainingEffectivenessPercent" type="number" min="0" max="100" step="0.01" required class="w-full px-3 py-2 border rounded" />
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="closeModal" class="px-3 py-1 border rounded">Cancel</button>
            <button :disabled="saving" type="submit" class="px-3 py-1 bg-indigo-600 text-white rounded">
              {{ saving ? 'Saving...' : (editing ? 'Save' : 'Create') }}
            </button>
          </div>

          <div v-if="formError" class="mt-3 text-sm text-red-600">{{ formError }}</div>
        </form>
      </div>
    </div>

    <!-- Delete confirmation -->
    <div v-if="deleteTarget" class="fixed inset-0 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h4 class="text-lg font-semibold mb-3">Confirm Delete</h4>
        <p class="mb-4">Delete training <strong>{{ deleteTarget.trainingCode }}</strong>? This cannot be undone.</p>
        <div class="flex justify-end gap-2">
          <button @click="deleteTarget = null" class="px-3 py-1 border rounded">Cancel</button>
          <button @click="deleteTraining" :disabled="deleting" class="px-3 py-1 bg-red-600 text-white rounded">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// javascript
import { ref, onMounted } from 'vue'
import api from '../../services/axios' // adjust if your axios instance path differs
import { useRouter } from 'vue-router'

const router = useRouter()

const trainings = ref([])
const loading = ref(true)
const error = ref('')

const modalOpen = ref(false)
const editing = ref(false)
const form = ref({
  _id: null,
  trainingCode: '',
  trainingEffectivenessPercent: null
})
const formError = ref('')
const saving = ref(false)

const deleteTarget = ref(null)
const deleting = ref(false)

function formatPercent(val) {
  if (val == null) return '-'
  return Number(val).toFixed(2) + '%'
}
function formatDate(d) {
  if (!d) return '-'
  try {
    return new Date(d).toLocaleString()
  } catch (e) {
    return d
  }
}

async function fetchTrainings() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get(`${import.meta.env.BACKEND_BASE_URL}/api/trainings/mine`)
    trainings.value = res.data || []
  } catch (err) {
    console.error(err)
    if (err.response && err.response.status === 401) {
      // unauthorized - redirect to login
      router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
      return
    }
    error.value = 'Failed to load trainings'
  } finally {
    loading.value = false
  }
}

// function openEdit(t) {
//   editing.value = true
//   form.value._id = t._id
//   form.value.trainingCode = t.trainingCode
//   form.value.trainingEffectivenessPercent = t.trainingEffectivenessPercent
//   formError.value = ''
//   modalOpen.value = true
// }

// function openCreate() {
//   editing.value = false
//   form.value._id = null
//   form.value.trainingCode = ''
//   form.value.trainingEffectivenessPercent = null
//   formError.value = ''
//   modalOpen.value = true
// }

function closeModal() {
  modalOpen.value = false
}

async function save() {
  formError.value = ''
  saving.value = true
  try {
    const payload = {
      trainingCode: form.value.trainingCode,
      trainingEffectivenessPercent: form.value.trainingEffectivenessPercent
    }

    if (editing.value && form.value._id) {
      const res = await api.put(`https://training-backend-topaz.vercel.app/api/trainings/${form.value._id}`, payload)
      // update local list
      const idx = trainings.value.findIndex(x => x._id === form.value._id)
      if (idx !== -1) trainings.value[idx] = res.data
    } else {
      const res = await api.post('https://training-backend-topaz.vercel.app/api/trainings', payload)
      // prepend new training
      trainings.value.unshift(res.data)
    }

    modalOpen.value = false
  } catch (err) {
    console.error(err)
    formError.value = err?.response?.data?.message || 'Save failed'
  } finally {
    saving.value = false
  }
}

function confirmDelete(t) {
  deleteTarget.value = t
}

async function deleteTraining() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await api.delete(`https://training-backend-topaz.vercel.app/api/trainings/${deleteTarget.value._id}`)
    // remove from local list
    trainings.value = trainings.value.filter(x => x._id !== deleteTarget.value._id)
    deleteTarget.value = null
  } catch (err) {
    console.error(err)
    alert('Delete failed')
  } finally {
    deleting.value = false
  }
}

function downloadReport() {
  // simple: let browser handle download and cookies/Authorization header via axios instance is not needed for direct link
  // If your server requires Authorization header, use fetch and download blob (example below).
  const url = `${import.meta.env.BACKEND_BASE_URL}/api/report-excel/mine` // admin export endpoint
  // Try direct navigation first (browser will send cookies if using cookie auth). If using Bearer token in localStorage, fetch blob instead:
  if (window.confirm('Download full report as XLSX?')) {
    // Using fetch to include bearer token from localStorage (if axios sets token in header, you can reuse it)
    const token = localStorage.getItem('auth_token')
    if (token) {
      fetch(url, { headers: { Authorization: `Bearer ${token}` } })
        .then(async (resp) => {
          if (!resp.ok) throw new Error('Download failed')
          const blob = await resp.blob()
          const blobUrl = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = blobUrl
          a.download = 'training-report.xlsx'
          document.body.appendChild(a)
          a.click()
          a.remove()
          URL.revokeObjectURL(blobUrl)
        })
        .catch((e) => alert(e.message || 'Export failed'))
    } else {
      // fallback: navigate directly (works if server accepts cookies or no auth)
      window.location.href = url
    }
  }
}


onMounted(() => {
  fetchTrainings()
})
</script>

<style scoped>
/* minimal styling; customize to your app or use your CSS framework (Tailwind classes already added) */
table th, table td { padding: 0.5rem 0.75rem; }
table th { font-weight: 600; color: #374151; }
</style>
