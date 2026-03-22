export default {
    state: {
        article: [],
        category:[],
    },
    actions: {

        setArticle({ commit }, data) {
            commit("setArticle", data);
        },
        setCategory({ commit }, data) {
            commit("setCategory", data);
        }

    },
    mutations: {
        setArticle(state, data) {
            state.article = data;
        },
        setCategory(state, data) {
            state.category = data;
        }

    }

}