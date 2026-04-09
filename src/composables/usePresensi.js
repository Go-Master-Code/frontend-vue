import { ref } from "vue";
import * as presensiService from "@/services/presensiService";

export function usePresensi() {
  const presensiList = ref([]);
  const todayPresensi = ref(null); // catatan hari ini
  const loading = ref(false);

  const fetchPresensi = async () => {
    loading.value = true;
    try {
      const res = await presensiService.getAllPresensi();
      presensiList.value = res.data.data;

      // ambil data presensi hari ini
      const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
      todayPresensi.value = presensiList.value.find(p => p.tanggal === today) || null;
    } finally {
      loading.value = false;
    }
  };

  const checkIn = async () => {
    await presensiService.createPresensi({ type: "checkin" });
    await fetchPresensi();
  };

  const checkOut = async () => {
    await presensiService.createPresensi({ type: "checkout" });
    await fetchPresensi();
  };

  return { presensiList, todayPresensi, loading, fetchPresensi, checkIn, checkOut };
}