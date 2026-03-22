export default {
    state:{
        commentdata:[],
        isVisible:false,
        // newCommment:{
        //     toWhich: "", //从reply to中收集
        //     toWhom: "", // 从reply to中收集
        // }
    },
    actions:{
        setComment({commit},data){
            commit("setComment",data);
        },
        setVisible({commit},data){
            commit("setVisible",data);
        },
        // setToWhich({commit},data){
        //     commit("setToWhich",data);
        // },
        // setToWhom({commit},data){
        //     commit("setToWhom",data);
        // }
    },
    mutations:{
        setComment(state,data){
            state.commentdata = data;
        },
        setVisible(state,data){
            state.isVisible = data;
        },
        // setToWhich(state,data){
        //     state.newCommment.toWhich = data;
        // },
        // setToWhom(state,data){
        //     state.newCommment.toWhom = data;
        // }
    }

}