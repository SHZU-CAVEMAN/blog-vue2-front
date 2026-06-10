import CommonModal from "./modal.vue";
import CommonPagination from "./pagination.vue";

// 统一维护可全局注册的通用组件清单。
const components = [CommonModal, CommonPagination];

export { CommonModal, CommonPagination };

export default {
	install(Vue) {
		// 批量注册，页面中可直接使用 <common-modal /> 和 <common-pagination />。
		components.forEach((component) => {
			Vue.component(component.name, component);
		});
	},
};
