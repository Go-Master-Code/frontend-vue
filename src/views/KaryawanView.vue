<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import dayjs from "dayjs";
import KaryawanModal from "@/components/KaryawanModal.vue"; // ⬅ pastikan path benar
import * as karyawanService from "@/services/karyawanService";
import { useKaryawan } from "@/composables/useKaryawan";

// State modal & selected karyawan
const selectedKaryawan = ref(null); // Karyawan yang sedang dipilih
const editModal = ref(false);       // Modal edit
const deleteModal = ref(false);     // Modal delete

// handlers
const handleEdit = async (data) => {
  try {
    await karyawanService.updateKaryawan(data.id, data);
    await fetchKaryawan(); // refresh table
  } catch (err) {
    console.error(err);
  }
};

const handleDelete = async (data) => {
  try {
    await karyawanService.deleteKaryawan(data.id);
    await fetchKaryawan(); // refresh table
  } catch (err) {
    console.error(err);
  }
};

// Fungsi untuk membuka modal edit
const openEditModal = (item) => {
  selectedKaryawan.value = { ...item }; // Clone supaya table tidak langsung berubah
  editModal.value = true;
}

// Fungsi untuk membuka modal delete
const openDeleteModal = (item) => {
  selectedKaryawan.value = { ...item };
  deleteModal.value = true;
}

// 🔍 state input search
const search = ref("");
const { karyawanList, loading, fetchKaryawan} = useKaryawan();
const now = ref(dayjs().format("HH:mm:ss"));
let interval;

onMounted(() => {
    fetchKaryawan();
    interval = setInterval(() => now.value = dayjs().format("HH:mm:ss"), 1000);
})

onUnmounted(() => clearInterval(interval));

const headers = [
  { title: 'No', key: 'no', sortable: false },
  { title: 'ID', key: 'id' },
  { title: 'Nama', key: 'nama' },
  { title: 'Status', key: 'aktif' },
  { title: 'Actions', key: 'actions', sortable: false }, // 👈 TAMBAH DI SINI
]

// penomoran row per halaman data table
const options = ref({
  page: 1,
  itemsPerPage: 5,
})

// search simple (client-side)
const filteredKaryawan = computed(() => {
  if (!search.value) return karyawanList.value

  const keyword = search.value.toLowerCase()
  
  return karyawanList.value.filter(k => {
    const nama = (k.nama || '').toLowerCase()
    const id = String(k.id || '') // 👈 penting: convert ke string

    return (
      nama.includes(keyword) ||
      id.includes(keyword)
    )
  })
})
</script>

<!-- ===TEMPLATE MIDDLE (TIDAK TERLALU BASIC) -->
<!-- <template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="9">

        
        <v-card elevation="3">
          <v-card-title class="text-h5 text-center">
            Data Karyawan
          </v-card-title>

          <v-card-subtitle class="text-center">
            Jam sekarang: {{ now }}
          </v-card-subtitle>

          <v-card-text>
            <v-progress-linear
              v-if="loading"
              indeterminate
              color="primary"
            />
            
            
            <v-data-table
              v-else
              :headers="[
                { title: 'No', value: 'no' },
                { title: 'ID', value: 'id' },
                { title: 'Nama', value: 'nama' },
                { title: 'Aktif', value: 'aktif' }
              ]"
              :items="karyawanList"
              :items-per-page="5"
            >
              
              <template #item.no="{ index }">
                {{ index + 1 }}
              </template>

            </v-data-table>
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template> -->

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="9">

        <v-card elevation="6" rounded="xl">

          <!-- HEADER -->
          <v-card-title class="d-flex justify-space-between align-center">
            <div>
              <div class="text-h5 font-weight-bold">Data Karyawan</div>
              
            </div>

            <!-- SEARCH -->
            <v-text-field
              v-model="search"
              density="compact"
              variant="outlined"
              placeholder="Cari karyawan..."
              prepend-inner-icon="mdi-magnify"
              hide-details
              style="max-width: 250px"
              clearable
            />
          </v-card-title>

          <v-divider />

          <!-- TABLE -->
          <v-data-table
            v-model:options="options"
            :headers="headers"
            :items="filteredKaryawan"
            :loading="loading"
            :items-per-page-options="[5, 10, 25, 50, { title: 'All', value: -1 }]"
            class="modern-table"
            hover
            density="comfortable"
            rounded="lg"
          >
            <!-- Loading -->
            <template #loading>
              <v-skeleton-loader type="table-row@5" />
            </template>

            <!-- No -->
            <template #item.no="{ index }">
              <v-chip size="small" color="primary" variant="tonal">
                {{
                  options.itemsPerPage === -1
                    ? index + 1
                    : index + 1 + (options.page - 1) * options.itemsPerPage
                }}
              </v-chip>
            </template>

            <!-- 🔥 INI BAGIAN ACTIONS -->
            <template #item.actions="{ item }">
                <div class="d-flex ga-2">
                  <v-btn size="small" color="primary" @click="openEditModal(item)">
                    Edit
                  </v-btn>
                  <v-btn size="small" color="red" variant="tonal" @click="openDeleteModal(item)"> <!--tonal buat warna jadi lebih soft-->
                    Delete
                  </v-btn>
                </div>
            </template>

            <!-- Aktif -->
            <template #item.aktif="{ item }">
              <v-chip
                :color="item.aktif ? 'green' : 'red'"
                size="small"
                variant="flat"
              >
                {{ item.aktif ? 'Aktif' : 'Nonaktif' }}
              </v-chip>
            </template>

          </v-data-table>

        </v-card>

        <!-- === Modal Components === -->
        <KaryawanModal
          v-model="editModal"
          :mode="'edit'"
          :karyawan="selectedKaryawan"
          @save="handleEdit"
        />

        <KaryawanModal
          v-model="deleteModal"
          :mode="'delete'"
          :karyawan="selectedKaryawan"
          @delete="handleDelete"
        />

      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
    .modern-table {
      border-radius: 12px;
      overflow: hidden;
    }

    .v-data-table {
      font-size: 14px;
    }

    .v-data-table tbody tr:nth-child(even) {
      background-color: #fafafa;
    }

    /* ganti background color header */
    .modern-table :deep(thead th) {
      background-color: #f8fafc; /* soft gray */
      color: #334155; /* font color dark gray */
      border-bottom: 1px solid #e5e7eb;
      font-weight: 600; /*font style bold */
    }

    /* hover row dalam table */
    .modern-table :deep(tbody tr:hover) {
      /* background-color: #e0f2fe; -> soft blue*/
      background-color: #f3f4f6; /* soft grey untuk zebra row */
      transition: background-color 0.2s ease;
    }

    /* :deep() → supaya scoped CSS tembus ke internal Vuetify
    #e0f2fe → light blue, lembut tapi jelas
    transition → smooth effect */
</style>