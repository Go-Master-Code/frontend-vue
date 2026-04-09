<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  karyawan: { type: Object, default: () => null },
  mode: { type: String, default: "edit" },
});

const emit = defineEmits(["update:modelValue", "save", "delete"]);

// Reactive form
const formNama = ref("");
const formStatus = ref(false);

// Sync props.karyawan ke form ketika modal dibuka
watch(
  () => props.karyawan,
  (newVal) => {
    formNama.value = newVal?.nama || "";
    formStatus.value = newVal?.aktif || false;
  },
  { immediate: true }
);

// Close modal
const closeModal = () => emit("update:modelValue", false);

// Save handler
const save = () => {
  emit("save", {
    ...props.karyawan,
    nama: formNama.value,
    aktif: formStatus.value,
  });
  closeModal();
};

// Delete handler
const remove = () => {
  emit("delete", props.karyawan);
  closeModal();
};
</script>

<template>
  <v-dialog v-model="props.modelValue" max-width="400">
    <v-card>
      <v-card-title>{{ props.mode === "edit" ? "Edit Karyawan" : "Delete Karyawan" }}</v-card-title>
      <v-card-text>
        <div v-if="props.mode === 'edit'">
          <v-text-field label="Nama" v-model="formNama" />
          <v-switch
            v-model="formStatus"
            label="Aktif"
            :color="karyawan.aktif ? 'green' : 'green'"
            inset
            />
        </div>
        <div v-else>
          Apakah yakin ingin menghapus karyawan <strong>{{ props.karyawan?.nama }}</strong>?
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="red" variant="tonal" size="small" @click="closeModal">
            Batal
        </v-btn>
        <v-btn color="primary" variant="tonal" size="small" v-if="props.mode === 'edit'" @click="save">Simpan</v-btn>
        <v-btn color="primary" variant="tonal" size="small" v-else @click="remove">Hapus</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>