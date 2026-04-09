import {ref} from "vue";
import * as karyawanService from "@/services/karyawanService";

export function useKaryawan() {
    const karyawanList = ref([])
    const loading = ref(false);

    const fetchKaryawan = async () => {
        loading.value=true;
        try {
            const res = await karyawanService.getAllKaryawan();
            karyawanList.value = res.data.data
        } finally {
            loading.value = false;
        }
    }

    return { karyawanList, loading, fetchKaryawan}
}