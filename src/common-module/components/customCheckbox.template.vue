<template>
  <div
    class="text-gray-600 flex justify-between items-center p-4 bg-primary-50 border-gray-300 rounded-xl shadow-sm border transition-all"
    :class="[
      modelValue
        ? 'text-primary border-primary bg-primary-100 dark:bg-primary-900 dark:text-primary-300 shadow-lg'
        : 'dark:bg-primary-200',
      mobIsHidden ? 'hidden sm:flex ' : '',
      customClass,
    ]"
  >
    <div class="space-y-2">
      <label class="block font-semibold text-sm">
        {{ title }}
      </label>
      <div class="text-xs">
        {{ description }}
      </div>
    </div>
    <Checkbox
      v-model="internalValue"
      binary
      :size="size"
      :disabled="disabled"
      :pt="{
        root: { class: '!w-6 !h-6' },
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: boolean;
  title: string;
  description?: string;
  mobIsHidden: boolean; // 移动端是否隐藏
  size?: "small" | "large";
  disabled?: boolean;
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "large",
  disabled: false,
});

const emit = defineEmits(["update:modelValue"]);

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
