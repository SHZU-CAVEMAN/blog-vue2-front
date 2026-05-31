<template>
	<transition name="modal-fade">
		<div
			v-if="isVisible"
			class="modal-mask"
			@click="onMaskClick"
			role="dialog"
			aria-modal="true"
			:aria-label="title"
		>
			<div class="modal-wrap" :style="{ width }" @click.stop>
				<div class="modal-header">
					<slot name="title">
						<div class="modal-title">{{ title }}</div>
					</slot>
					<button v-if="closable" class="modal-close" type="button" aria-label="close" @click="handleCancel">
						x
					</button>
				</div>

				<div v-if="!destroyOnClose || isVisible" class="modal-body">
					<slot></slot>
				</div>

				<div v-if="showFooter" class="modal-footer">
					<slot name="footer">
						<button class="modal-btn" type="button" :disabled="confirmLoading" @click="handleCancel">
							{{ cancelText }}
						</button>
						<button class="modal-btn modal-btn-primary" type="button" :disabled="confirmLoading" @click="handleOk">
							<span v-if="confirmLoading">...</span>
							<span v-else>{{ okText }}</span>
						</button>
					</slot>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: "CommonModal",
	model: {
		prop: "value",
		event: "input",
	},
	props: {
		value: {
			type: Boolean,
			default: false,
		},
		visible: {
			type: Boolean,
			default: null,
		},
		title: {
			type: String,
			default: "提示",
		},
		width: {
			type: String,
			default: "520px",
		},
		okText: {
			type: String,
			default: "确认",
		},
		cancelText: {
			type: String,
			default: "取消",
		},
		closable: {
			type: Boolean,
			default: true,
		},
		maskClosable: {
			type: Boolean,
			default: true,
		},
		keyboard: {
			type: Boolean,
			default: true,
		},
		confirmLoading: {
			type: Boolean,
			default: false,
		},
		destroyOnClose: {
			type: Boolean,
			default: false,
		},
		showFooter: {
			type: Boolean,
			default: true,
		},
	},
	computed: {
		isVisible() {
			return this.visible === null ? this.value : this.visible;
		},
	},
	mounted() {
		document.addEventListener("keydown", this.handleKeydown);
	},
	beforeDestroy() {
		document.removeEventListener("keydown", this.handleKeydown);
	},
	methods: {
		emitVisible(next) {
			this.$emit("input", next);
			this.$emit("update:visible", next);
			this.$emit("visible-change", next);
		},
		handleKeydown(e) {
			if (!this.keyboard || !this.isVisible) return;
			if (e.key === "Escape") {
				this.handleCancel(e);
			}
		},
		onMaskClick(e) {
			if (!this.maskClosable) return;
			this.handleCancel(e);
		},
		handleCancel(e) {
			this.$emit("cancel", e);
			this.emitVisible(false);
		},
		handleOk(e) {
			this.$emit("ok", e);
		},
	},
};
</script>

<style scoped>
.modal-mask {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 1000;
	background: rgba(0, 0, 0, 0.45);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 16px;
}

.modal-wrap {
	max-width: 96vw;
	max-height: 92vh;
	overflow-y: auto;
	background: #fff;
	border-radius: 8px;
	box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
}

.modal-header {
	height: 56px;
	padding: 0 20px;
	border-bottom: 1px solid #f0f0f0;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.modal-title {
	font-size: 16px;
	color: #1f1f1f;
	font-weight: 500;
}

.modal-close {
	border: none;
	background: transparent;
	color: #8c8c8c;
	font-size: 16px;
	width: 28px;
	height: 28px;
	border-radius: 4px;
	cursor: pointer;
}

.modal-close:hover {
	color: #262626;
	background: #f5f5f5;
}

.modal-body {
	padding: 20px;
	color: #262626;
}

.modal-footer {
	border-top: 1px solid #f0f0f0;
	padding: 10px 16px;
	display: flex;
	justify-content: flex-end;
	gap: 8px;
}

.modal-btn {
	border: 1px solid #d9d9d9;
	background: #fff;
	color: #262626;
	border-radius: 6px;
	height: 32px;
	line-height: 30px;
	padding: 0 14px;
	cursor: pointer;
}

.modal-btn:hover {
	border-color: #4096ff;
	color: #4096ff;
}

.modal-btn:disabled {
	cursor: not-allowed;
	opacity: 0.6;
}

.modal-btn-primary {
	border-color: #1677ff;
	background: #1677ff;
	color: #fff;
}

.modal-btn-primary:hover {
	border-color: #4096ff;
	background: #4096ff;
	color: #fff;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
	transition: opacity 0.2s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
	opacity: 0;
}

@media (max-width: 768px) {
	.modal-wrap {
		width: 100% !important;
	}

	.modal-header {
		padding: 0 14px;
	}

	.modal-body {
		padding: 14px;
	}

	.modal-footer {
		padding: 10px 14px;
	}
}
</style>
