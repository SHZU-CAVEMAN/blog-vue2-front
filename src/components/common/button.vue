<template>
  <button
    class="common-button"
    :class="[`common-button--${variant}`]"
    type="button"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: "commonButton",
  props: {
    variant: {
      type: String,
      default: "default",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.common-button {
  border: 1px solid var(--color-border-primary);
  border-radius: 8px;
  min-height: 34px;
  padding: 6px 14px;
  background-color: var(--color-bg-muted);
  color: var(--text-color-primary);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;
}

.common-button:hover {
  background-color: var(--color-bg-surface);
  color: var(--interactive-text-active);
}

.common-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.common-button--primary {
  background-color: var(--interactive-text-active);
  color: #ffffff;
}

.common-button--primary:hover {
  background-color: #0f172a;
  color: #ffffff;
}
</style>
