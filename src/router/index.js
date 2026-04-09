import { createRouter, createWebHistory } from "vue-router";
import PresensiView from "@/views/PresensiView.vue";
import KaryawanView from "@/views/KaryawanView.vue";

const routes = [
  { path: "/", name: "presensi", component: PresensiView },
  { path: "/karyawan", name: "karyawan", component: KaryawanView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;