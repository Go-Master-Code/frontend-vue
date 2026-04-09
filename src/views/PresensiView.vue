<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import dayjs from "dayjs";
import { usePresensi } from "@/composables/usePresensi";

// =========================
// STATE DARI COMPOSABLE
// =========================
const { presensiList, loading, fetchPresensi } = usePresensi();
// =========================
// STATE LOCAL
// =========================
const now = ref(dayjs().format("HH:mm:ss"));
let interval;

// 🔍 input search
const search = ref("");

// =========================
// COMPUTED: FILTER DATA
// =========================
const filteredPresensi = computed(() => {
  return presensiList.value.filter((item) => {

    // kalau search kosong → tampilkan semua data
    if (!search.value) return true;

    const keyword = search.value.toLowerCase();

    return (
      // cari berdasarkan nama
      item.karyawan_nama?.toLowerCase().includes(keyword) ||

      // cari berdasarkan ID
      String(item.karyawan_id).includes(keyword)
    );
  });
});

// =========================
// LIFECYCLE
// =========================
onMounted(() => {
  fetchPresensi();
  interval = setInterval(() => now.value = dayjs().format("HH:mm:ss"), 1000);
});

onUnmounted(() => clearInterval(interval));

// =========================
// HEADER TABLE (VUETIFY V3)
// =========================
const headers = [
  { title: "No", value: "no" },
  { title: "ID Karyawan", value: "karyawan_id" },
  { title: "Nama", value: "karyawan_nama" },
  { title: "Tanggal", value: "tanggal" },
  { title: "Waktu Masuk", value: "waktu_masuk" },
  { title: "Waktu Pulang", value: "waktu_pulang" },
];

</script>

<!-- ===OLD TEMPLATE=== -->
<!-- <template>
  <div style="max-width:600px; margin:auto; text-align:center;">
    <h1>Presensi</h1>
    <h2>{{ now }}</h2>

    <div v-if="loading">Loading...</div>
    
    <div v-else>

      <h3 style="margin-top:30px;">Riwayat Presensi</h3>
      <table border="1" cellspacing="0" cellpadding="5" style="width:100%; margin-top:10px;">
        <thead>
          <tr>
            <th>No</th>
            <th>ID Karyawan</th>
            <th>Nama</th>
            <th>Tanggal</th>
            <th>Waktu Masuk</th>
            <th>Waktu Pulang</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, index) in presensiList" :key="p.id">
            <td>{{ index + 1 }}</td>
            <td>{{ p.karyawan_id }}</td>
            <td>{{ p.karyawan_nama }}</td>
            <td>{{ p.tanggal }}</td>
            <td>{{ p.waktu_masuk || "-" }}</td>
            <td>{{ p.waktu_pulang || "-" }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template> -->

<template>
  <v-container fluid> <!--Tabel jadi lebih lebar-->
    <v-row justify="center">
      <v-col cols="12" md="10" lg="9">

        <!-- Card utama -->
        <v-card elevation="3" class="pa-4">
          <v-card-title class="text-h5 text-center">
            Presensi Karyawan
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
            
            <div v-else>
              <!-- ========================= -->
              <!-- 🔍 SEARCH -->
              <!-- ========================= -->
              <v-row class="mb-4">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="search"
                    label="Cari nama / ID karyawan"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    clearable
                    density="comfortable"
                  />
                </v-col>
                <!--density: mengatur tinggi search box (bisa comfortable atau compact untuk lebih kecil)-->
              </v-row>

              <!-- ========================= -->
              <!-- 📊 DATA TABLE -->
              <!-- ========================= -->
              <v-data-table
                :headers="headers"
                :items="filteredPresensi"
                :items-per-page="5"
              >

                <!-- NOMOR OTOMATIS -->
                <template #item.no="{ index }">
                  {{ index + 1 }}
                </template>

                <!-- HANDLE NULL -->
                <template #item.waktu_masuk="{ item }">
                  {{ item.waktu_masuk || '-' }}
                </template>

                <template #item.waktu_pulang="{ item }">
                  {{ item.waktu_pulang || '-' }}
                </template>

              </v-data-table>

            </div>
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>