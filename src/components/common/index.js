import CommonModal from "./modal.vue";

const components = [CommonModal];

export { CommonModal };

export default {
	install(Vue) {
		components.forEach((component) => {
			Vue.component(component.name, component);
		});
	},
};
