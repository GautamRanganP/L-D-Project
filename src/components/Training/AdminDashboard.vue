<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-semibold">All Trainings (Admin)</h2>

      <div class="flex items-center gap-3">
        <select
          v-model="ownerIdFilter"
          @change="onOwnerChange"
          class="px-3 py-2 border rounded bg-white"
        >
          <option value="">All owners</option>
          <option v-for="o in owners" :key="o.id" :value="o.id">
            {{ o.name }}<span v-if="o.count"> ({{ o.count }})</span>
          </option>
        </select>

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
            <td class="py-2 pr-4">{{ t.ownerName || '-' }}</td>
            <td class="py-2 pr-4">{{ t.trainingCode }}</td>
            <td class="py-2 pr-4">{{ formatPercent(t.trainingEffectivenessPercent) }}</td>
            <td class="py-2 pr-4">{{ formatDate(t.createdAt) }}</td>
            <td class="py-2 pr-4">{{ formatDate(t.updatedAt) }}</td>
            <td class="py-2 pr-4">
              <button @click="confirmDelete(t)" class="px-2 py-1 border rounded text-red-600">Delete</button>
            </td>
          </tr>

          <tr v-if="trainings.length === 0">
            <td colspan="6" class="py-4 text-gray-600">No trainings found.</td>
          </tr>
        </tbody>
      </table>
    </div>

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
import api from '../../services/axios' // axios instance with baseURL and auth header
import { useRouter } from 'vue-router'

const router = useRouter()

const trainings = ref([])
const loading = ref(false)
const error = ref('')

const owners = ref([]) // array of { id: string, name: string, count: number }
const ownerIdFilter = ref('') // selected owner id (string)

const deleteTarget = ref(null)
const deleting = ref(false)

function formatPercent(v) {
  return v == null ? '-' : Number(v).toFixed(2) + '%'
}
function formatDate(d) {
  if (!d) return '-'
  try { return new Date(d).toLocaleString() } catch { return d }
}

/*
  Derive owners list from an array of trainings (owner id, ownerName).
  This avoids needing a separate /filters backend endpoint.
*/
function deriveOwnersFromTrainings(allTrainings) {
  const map = new Map()
  for (const t of allTrainings) {
    const id = t.owner ? String(t.owner) : null
    const name = t.ownerName || 'Unknown'
    if (!id) continue
    if (!map.has(id)) map.set(id, { id, name, count: 1 })
    else map.get(id).count++
  }
  const arr = Array.from(map.values())
  arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  return arr
}

/*
  Load owners for the dropdown by fetching all trainings once (no filter).
  If your DB is very large, consider adding a backend endpoint to return owners only.
*/
async function loadOwners() {
  try {
    const res = await api.get(`${import.meta.env.BACKEND_BASE_URL}/api/trainings/owners`) // no params => all trainings
    const data = Array.isArray(res.data) ? res.data : (res.data?.trainings || [])
    owners.value = deriveOwnersFromTrainings(data)
  } catch (err) {
    // ignore owners loading failure (dropdown will be empty), but log for debugging
    console.error('Failed to load owners for filter:', err)
  }
}

async function fetchTrainings() {
  loading.value = true
  error.value = ''
  try {
    const params = {}
    if (ownerIdFilter.value && ownerIdFilter.value.trim() !== '') {
      params.ownerId = ownerIdFilter.value.trim()
    }
    const res = await api.get(`${import.meta.env.BACKEND_BASE_URL}/api/trainings`, { params })
    trainings.value = Array.isArray(res.data) ? res.data : (res.data?.trainings || [])
    // If owners not loaded yet (first load), derive from the unfiltered dataset already loaded by loadOwners.
    // If loadOwners failed earlier, fallback to deriving from current trainings (may be filtered).
    if (owners.value.length === 0) {
      owners.value = deriveOwnersFromTrainings(trainings.value)
    }
  } catch (err) {
    console.error(err)
    if (err.response && err.response.status === 401) {
      router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
      return
    }
    error.value = err?.response?.data?.message || 'Failed to load trainings'
  } finally {
    loading.value = false
  }
}

function onOwnerChange() {
  // selecting owner name sets ownerIdFilter (bound to select value),
  // fetch trainings will pass ownerId to backend
  fetchTrainings()
}

function confirmDelete(t) {
  deleteTarget.value = t
}

async function deleteTraining() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await api.delete(`/trainings/${deleteTarget.value._id}`)
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
  const url = `${import.meta.env.BACKEND_BASE_URL}/api/report-excel`
  if (window.confirm('Download full report as XLSX?')) {
    const token = localStorage.getItem('auth_token')
    const fullUrl = (api.defaults.baseURL || '') + url
    if (token) {
      fetch(fullUrl, { headers: { Authorization: `Bearer ${token}` } })
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
      window.location.href = fullUrl
    }
  }
}

onMounted(async () => {
  // load owners first (unfiltered), then load trainings (which will respect selected owner if any)
  await loadOwners()
  await fetchTrainings()
})
</script>

<style scoped>
table th, table td { padding: 0.5rem 0.75rem; }
table th { font-weight: 600; color: #374151; }
</style>
