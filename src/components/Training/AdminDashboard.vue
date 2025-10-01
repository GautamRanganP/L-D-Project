<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-semibold">All Trainings (Admin)</h2>

      <div class="flex items-center gap-3">
        <input
          v-model="ownerIdFilter"
          placeholder="Filter by ownerId"
          class="px-3 py-2 border rounded"
        />
        <button @click="fetchTrainings" class="px-3 py-2 bg-indigo-600 text-white rounded">
          Filter
        </button>
        <button @click="downloadReport" class="px-3 py-2 bg-green-600 text-white rounded">
          Export XLSX
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-gray-600">Loading...</div>
    <div v-else>
      <div v-if="error" class="text-red-600 mb-3">{{ error }}</div>

      <table class="w-full border-collapse">
        <thead>
          <tr class="text-left">
            <th class="border-b py-2">Owner</th>
            <th class="border-b py-2">Training Code</th>
            <th class="border-b py-2">Effectiveness (%)</th>
            <th class="border-b py-2">Created At</th>
            <th class="border-b py-2">Updated At</th>
            <th class="border-b py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in trainings" :key="t._id" class="align-top">
            <td class="py-2 pr-4">{{ t.owner }}</td>
            <td class="py-2 pr-4">{{ t.trainingCode }}</td>
            <td class="py-2 pr-4">{{ formatPercent(t.trainingEffectivenessPercent) }}</td>
            <td class="py-2 pr-4">{{ formatDate(t.createdAt) }}</td>
            <td class="py-2 pr-4">{{ formatDate(t.updatedAt) }}</td>
            <td class="py-2 pr-4">
              <!-- <button @click="openEdit(t)" class="mr-2 px-2 py-1 border rounded">Edit</button> -->
              <button @click="confirmDelete(t)" class="px-2 py-1 border rounded text-red-600">Delete</button>
            </td>
          </tr>

          <tr v-if="trainings.length === 0">
            <td colspan="6" class="py-4 text-gray-600">No trainings found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete confirmation modal -->
    <div v-if="deleteTarget" class="fixed inset-0 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h4 class="text-lg font-semibold mb-3">Confirm Delete</h4>
        <p class="mb-4">Delete training <strong>{{ deleteTarget.trainingCode }}</strong>?</p>
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
import { ref, onMounted } from 'vue'
import api from '../../services/axios'// ensure this axios attaches Authorization header
import { useRouter } from 'vue-router'

const router = useRouter()

const trainings = ref([])
const loading = ref(false)
const error = ref('')

const ownerIdFilter = ref('')

const deleteTarget = ref(null)
const deleting = ref(false)

function formatPercent(v) {
  return v == null ? '-' : Number(v).toFixed(2) + '%'
}
function formatDate(d) {
  if (!d) return '-'
  try { return new Date(d).toLocaleString() } catch { return d }
}

async function fetchTrainings() {
  loading.value = true
  error.value = ''
  try {
    const params = {}
    if (ownerIdFilter.value && ownerIdFilter.value.trim() !== '') {
      params.ownerId = ownerIdFilter.value.trim()
    }
    const res = await api.get('https://training-backend-topaz.vercel.app/api/trainings', { params })
    trainings.value = res.data || []
    console.log(trainings)
  } catch (err) {
    console.error(err)
    if (err.response && err.response.status === 401) {
      // not authenticated as admin — redirect to login
      router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
      return
    }
    error.value = err?.response?.data?.message || 'Failed to load trainings'
  } finally {
    loading.value = false
  }
}

// function openEdit(t) {
//   // navigate to an admin edit page or reuse component logic; example route:
//   router.push({ name: 'admin-training-edit', params: { id: t._id } })
// }

function confirmDelete(t) {
  deleteTarget.value = t
}

async function deleteTraining() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await api.delete(`https://training-backend-topaz.vercel.app/api/trainings/${deleteTarget.value._id}`)
    trainings.value = trainings.value.filter(x => x._id !== deleteTarget.value._id)
    deleteTarget.value = null
  } catch (err) {
    console.error(err)
    alert(err?.response?.data?.message || 'Delete failed')
  } finally {
    deleting.value = false
  }
}

function downloadReport() {
  // simple: let browser handle download and cookies/Authorization header via axios instance is not needed for direct link
  // If your server requires Authorization header, use fetch and download blob (example below).
  const url = 'https://training-backend-topaz.vercel.app/api/report-excel' // admin export endpoint
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
          a.download = 'training-report-all.xlsx'
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
table th, table td { padding: 0.5rem 0.75rem; }
table th { font-weight: 600; color: #374151; }
</style>
