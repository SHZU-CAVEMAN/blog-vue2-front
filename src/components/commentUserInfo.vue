<template>
    <!-- 评论编辑 验证信息 弹窗 -->
    <div class="backdrop">
        <div class="confirm">
            <div style="display: flex;justify-content: space-between;">
                <h6>请填写必要信息</h6>
                <a-icon type="close" class="icon" @click="handleCancel" />
            </div>

            <hr style="margin:0vh 0 3vh 0" />

            <div style="display: flex;align-items: center;flex-direction: column;">
                <div style="width:100%;">
                    <input type="text" v-model="nickname" placeholder="昵称（必填）" class="input" />
                    <div v-if="info1" ref="info1" :class="{ prompt: true, add: flag1 }">{{ info1 }}</div>
                </div>
                <div style="width:100%;">
                    <input type="text" v-model="email" placeholder="邮箱（必填）" class="input" />
                    <div v-if="info2" ref="info2" :class="{ prompt: true, add: flag2 }">{{ info2 }}</div>

                </div>
                <div style="width:100%;">
                    <label for="avatar" class="selectImage">头像（可选）</label>
                 
                    <input id='avatar' type="file" @change="imageUpload" title="必填" style="display:none" />
                    <div ref="preview" class="preview"></div>
                </div>
                <div style="width:100%;">
                    <button class="button1" @click="verifyPost">发送验证码</button>
                    <input type="text" placeholder="验证码（必填）" v-model="verify" class="input"
                        style="width:25%;margin-left: 3%;" />

                    <div v-if="info3" ref="info3" :class="{ prompt: true, add: flag3 }">{{ info3 }}</div>
                </div>

            </div>
            <hr style="margin:2vh 0 3vh 0" />

            <div>* 验证码将发送到您的邮箱</div>
            <div>* 以上信息将存储于您的浏览器，以便于下次访问</div>

            <div style="display: flex;justify-content: space-evenly;margin-top:2vh;">
                <button class="button" @click="handleCancel">取消</button>
                <button class="button" @click="handleOk">提交</button>
            </div>

        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex"; //这里不写会有神奇的后果

export default {
    name: "commentUserInfo",
    props: ["toWhich", "toWhom", "articleName", "comment"],
    watch: {
        nickname: {
            handler() {
                if (this.nickname != '') {
                    this.info1 = "√"
                    // this.$refs.info1.style.color = 'green';
                    // this.$refs.info1.innerHTML = "√ ";
                    this.flag1 = true;
                } else {
                    this.info1 = "* 请输入昵称"
                    // this.$refs.info1.style.color = 'red';
                    // this.$refs.info1.innerHTML = this.info1;
                    this.flag1 = false;

                }
            }
        },
        email: {
            handler() {
                // this.debounce(this.handlerEmail,1000)
                // this.handlerEmail()
                //邮箱合法
                if (this.email != '' && this.checkEmail(this.email)) {
                    //检查邮箱是否合法
                    // if (this.checkEmail(this.email)) {
                    this.info2 = "√";
                    // this.$refs.info2.style.color = 'green';
                    // this.$refs.info2.innerHTML = "√ ";
                    console.log("ok", this.info2);
                    this.flag2 = true;

                    // } 
                }
                //邮箱不合法
                if (this.email != '' && !this.checkEmail(this.email)) {
                    this.info2 = "* 邮箱不合法";
                    // this.$refs.info2.style.color = 'red';
                    // this.$refs.info2.innerHTML = this.info2;
                    console.log("邮箱不合法", this.info2)
                    this.flag2 = false;
                }
                // 邮箱未输入
                if (this.email == '') {
                    this.info2 = "* 请输入邮箱"
                    // this.$refs.info2.style.color = 'red';
                    // this.$refs.info2.innerHTML =  this.info2;
                    console.log('请输入邮箱', this.info2)
                    this.flag2 = false;

                }
            }
        },
        verify: {
            handler() {
                if (this.verify == '') {
                    console.log("未填写验证码");
                    this.info3 = "* 请填写验证码";
                    // this.$refs.info3.style.color = 'red';
                    // this.$refs.info3.innerHTML = this.info3;
                    this.flag3 = false;
                }
                if (this.verify != '' && this.verify != this.verifyFromServe) {
                    console.log("验证码错误");
                    this.info3 = "* 验证码错误";
                    // this.$refs.info3.style.color = 'red';
                    // this.$refs.info3.innerHTML =  this.info3;
                    this.flag3 = false;
                }
                if (this.verify != '' && this.verify == this.verifyFromServe) {
                    console.log("验证成功");
                    this.info3 = "√ 验证成功";
                    //以下操作不能立即变化
                    // this.$refs.info3.style.color = 'green';
                    // this.$refs.info3.innerHTML = "√ " + this.info3;
                    this.flag3 = true;

                }
            }
        }
    },
    computed: {

    },
    data() {
        return {
            nickname: "", //评论框收集
            _nickname: "",
            email: "", //评论框收集
            _email: "",
            other: "", //评论框收集
            time: "", //系统收集
            avatar: "", // 系统随机分配

            verify: '',
            verifyFromServe: '',

            info1: "* 请输入昵称",
            info2: "* 请输入邮箱",
            info3: '',
            flag1: false,
            flag2: false,
            flag3: false,
            flagCommit: false,

        }
    },

    methods: {
        ...mapActions(["setVisible"]),

        handlerEmail() {
        },
        debounce(fn, delay) {
            let timer = null;
            return function () {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    fn.apply(this, arguments);
                }, delay)
            }
        },
        checkEmail(email) {
            var regex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
            return regex.test(email);
        },
        imageUpload(e) {
            // console.log(e.target.files); //这个就是选中文件信息 ：一个fileList对象
            let formdata = new FormData();
            Array.from(e.target.files).map((item) => {
                // console.log(item); //file对象
                this.avatar = item.name; //将图片名保存，发送给父组件
                //去掉图片
                formdata.append("file1", item); //将每一个文件图片都加进formdata
            });
            //图片发送给服务器(进行判断，点击提交之后再发送)
            // if (this.flagCommit) {
            axios
                .post("/upload-single-file", formdata)
                .then((res) => {
                    // console.log(res);
                }); //打印响应体
            // }


            var file = e.target.files[0];
            console.log(file);
            if (file) {
                var reader = new FileReader();
                reader.onload = (event) => {//这里不要写普通函数，否则this就不是vc实例了。
                    this.$refs.preview.style.backgroundImage = 'url(' + event.target.result + ')';
                };
                reader.readAsDataURL(file);
            }
        },
        verifyPost() {
            // 发送验证码
            if (!this.flag2) {
                console.log("请填写邮箱信息", this.flag1, this.flag2, this.flag3);

                this.info3 = "* 请填写邮箱";
                this.$refs.info3.style.color = 'red';
                this.$refs.info3.innerHTML = this.info3;
                this.flag3 = false;
            } else {
                this.info3 = "";
                //验证邮箱时保存，防止更改，传递时就传递保存的数据
                this._email = this.email;
                this._nickname = this.nickname;
                this._avatar = this.avatar;
                axios({
                    method: "post",
                    url: "/verify/email",
                    data: {
                        email: this.email,
                    },
                }).then((res) => {
                    // 打印错误信息
                    // this.info = res.data
                    this.verifyFromServe = res.data.data;
                    console.log("已经收到验证码", this.verifyFromServe)
                });
            }
        },
        handleCancel() {
            // this.visible = false;//会调用computed的set方法，将false传给setVisible函数
            this.$bus.$emit("commentUserInfoShow", false);
        },
        handleOk() {
            console.log("各状态", this.flag1, this.flag2, this.flag3);
            console.log("各值", this.nickname, this.email, this.avatar);

            // 需要处理的一个问题是：关闭对话框后，再次改动昵称或邮箱，监测不到
            // 发送验证码时，确定昵称和邮箱。
            // 提交时，将数据传给父组件。

            // if (!this.flag3) {
            //     this.info3 = '* 请填写验证码'
            // }

            //值都正确，则关闭对话框
            if (this.flag1 && this.flag2 && this.flag3) {
                this.$bus.$emit("commentUserInfo", { email: this._email, nickname: this._nickname, avatar: this._avatar })

                this.$bus.$emit("commentUserInfoShow", false);
                // this.flagCommit = true;
                //关闭的时候，调用父组件的提交评论数据的方法。
            } else {
                alert("请填写相关信息")
            }

        },

    },
    created() {
        console.log('commitUserInfo', this.toWhich, this.toWhom, this.articleName, this.comment)

    }
}
</script>

<style scoped>
.backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .5);
    z-index: 999;

    /* 弹出框垂直水平居中 */
    display: flex;
    flex-flow: column;
    justify-content: space-evenly;
    align-items: center;
}

.confirm {
    position: absolute;
    width: 40vw;
    /* height: 58vh; */
    border-radius: 1vh;
    background-color: #fff;
    padding: 3vh;


    /* 垂直水平居中？ */
    /* 
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto; */



}

.input {
    border: 1px solid rgb(71, 71, 71);
    margin-bottom: 2vh;
    width: 50%;
    margin-left: 25%;
    height: 5vh;
    border-radius: 0.5vh;
    background-color: rgb(239, 242, 245);
}

.selectImage {
    margin-left: 25%;
    margin-bottom: 2vh;
    width: 22%;
    height: 4.5vh;
    border-radius: 0.5vh;
    padding: 0.5vh 0vh;
    text-align: center;
    background-color: rgb(240, 240, 240);
    border: 1px solid rgb(141, 141, 141);

}

.fileName {
    width: 20vh;
    margin-left: 3%;
    background-color: aqua;
    /* display: inline; */
    /* line-height: 1.6rem; */
    /* white-space: nowrap;     设置文字不换行 */
    overflow: hidden;
    /* 设置超过限制的长度，文字隐藏*/
    text-overflow: ellipsis;
    /* 设置超过限制的长度显示省略号（clip：不显示省略号）*/

}

.selectImage:hover {
    color: white;
    background-color: rgb(94, 94, 94);
}

.input:hover {
    border: 0px solid rgb(141, 141, 141);
    outline: none;
    /* ? */
    box-shadow: 1px 1px 1px 1px rgb(189, 189, 189);
}

.input:focus {
    border: 1px solid rgb(141, 141, 141);
    outline: none;
    box-shadow: 1px 1px 1px 1px rgb(189, 189, 189);
}

.icon:hover {
    color: black;
    font-weight: 650;
    font-size: 2.5vh;
}

.preview {
    display: inline-block;
    vertical-align: top;
    width: 25%;
    margin-left: 3%;
    height: 20vh;
    /* object-fit: cover; */
    /* border-radius: 1vh; */
    /* background-color: rgb(239, 239, 239); */
    background-color: rgb(239, 242, 245);
    background-size: cover;
}

button {
    border: 1px solid black;
}

.prompt {
    display: inline;
    margin-left: 1vh;
    color: red;

}

.add {
    color: green
}

.button1 {
    margin-left: 25%;
    width: 22%;
    height: 4.5vh;
    padding:0.5vh ;
    margin-top: 2vh;
    border-radius: 0.5vh;
}

.button1:hover {
    color: white;
    background-color: rgb(94, 94, 94);
}

.button {
    height: 4.5vh;
    border-radius: 0.5vh;
    padding: 0.5vh 2vh;
}

.button:hover {
    color: white;
    background-color: rgb(94, 94, 94);
}
</style>
