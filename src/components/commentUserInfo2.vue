<template>
	<common-modal
		class="comment-user-info2-modal"
		v-model="innerVisible"
		title="评论需填写必要信息"
		width="620px"
		ok-text="提交"
		cancel-text="取消"
		:mask-closable="false"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<div class="content">
			<div class="row">
				<div class="label">昵称</div>
				<div class="field">
					<div class="inline-field">
						<input type="text" v-model="nickname" placeholder="昵称" class="input" />
						<div class="prompt side" :class="{ ok: nicknameOk }">{{ nicknameMsg }}</div>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="label">邮箱</div>
				<div class="field">
					<div class="inline-field">
						<input type="text" v-model="email" placeholder="邮箱" class="input" />
						<div class="prompt side" :class="{ ok: emailOk }">{{ emailMsg }}</div>
					</div>
				</div>
			</div>

			<div class="row avatar-row">
				<div class="label">头像</div>
				<div class="field avatar-field">
					<label for="avatar2" class="select-image">选择图片（可选）</label>
					<input id="avatar2" type="file" @change="imageUpload" style="display: none" />
					<div ref="preview" class="preview"></div>
				</div>
			</div>

			<div class="row code-row">
				<div class="label">验证码</div>
				<div class="field code-field">
					<div class="code-input-wrap">
						<button class="send-btn" @click="verifyPost">发送验证码</button>
						<input type="text" v-model="verify" placeholder="验证码" class="input code-input" />
					</div>
					<div class="prompt side" :class="{ ok: verifyOk }">{{ verifyMsg }}</div>
				</div>
			</div>
			<div class="tips">* 验证码将发送到您的邮箱</div>
			<div class="tips">* 以上信息将存储于您的浏览器，以便于下次访问</div>
		</div>
	</common-modal>
</template>

<script>
export default {
	name: "commentUserInfo2",
	props: ["toWhich", "toWhom", "articleName", "comment"],
	data() {
		return {
			innerVisible: true,
			nickname: "",
			email: "",
			avatar: "",
			verify: "",
			verifyFromServe: "",
			savedNickname: "",
			savedEmail: "",
			savedAvatar: "",
			nicknameMsg: "* 请输入昵称",
			emailMsg: "* 请输入邮箱",
			verifyMsg: "",
		};
	},
	computed: {
		nicknameOk() {
			return this.nicknameMsg === "√";
		},
		emailOk() {
			return this.emailMsg === "√";
		},
		verifyOk() {
			return this.verifyMsg === "√ 验证成功";
		},
	},
	watch: {
		nickname(val) {
			this.nicknameMsg = val ? "√" : "* 请输入昵称";
		},
		email(val) {
			if (!val) {
				this.emailMsg = "* 请输入邮箱";
				return;
			}
			this.emailMsg = this.checkEmail(val) ? "√" : "* 邮箱不合法";
		},
		verify(val) {
			if (!val) {
				this.verifyMsg = "* 请填写验证码";
				return;
			}
			if (val === this.verifyFromServe) {
				this.verifyMsg = "√ 验证成功";
			} else {
				this.verifyMsg = "* 验证码错误";
			}
		},
	},
	methods: {
		checkEmail(email) {
			var regex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
			return regex.test(email);
		},
		imageUpload(e) {
			const file = e.target.files && e.target.files[0];
			if (!file) return;

			this.avatar = file.name;
			const formdata = new FormData();
			formdata.append("file1", file);
			this.$axios.post("/upload-single-file", formdata).then(() => {});

			const reader = new FileReader();
			reader.onload = (event) => {
				this.$refs.preview.style.backgroundImage = "url(" + event.target.result + ")";
			};
			reader.readAsDataURL(file);
		},
		verifyPost() {
			if (!this.checkEmail(this.email)) {
				this.emailMsg = this.email ? "* 邮箱不合法" : "* 请输入邮箱";
				this.verifyMsg = "* 请先填写有效邮箱";
				return;
			}

			this.savedEmail = this.email;
			this.savedNickname = this.nickname;
			this.savedAvatar = this.avatar;
			this.verifyMsg = "";

			this.$axios({
				method: "post",
				url: "/verify/email",
				data: {
					email: this.email,
				},
			}).then((res) => {
				this.verifyFromServe = res.data.data;
			});
		},
		handleCancel() {
			this.innerVisible = false;
			this.$bus.$emit("commentUserInfoShow", false);
		},
		handleOk() {
			const valid = this.nicknameMsg === "√" && this.emailMsg === "√" && this.verifyMsg === "√ 验证成功";
			if (!valid) {
				alert("请填写相关信息");
				return;
			}

			this.$bus.$emit("commentUserInfo", {
				email: this.savedEmail,
				nickname: this.savedNickname,
				avatar: this.savedAvatar,
			});
			this.handleCancel();
		},
	},
};
</script>

<style scoped>
.content {
	display: flex;
	flex-direction: column;
	max-width: 560px;
	margin: 0 auto;
}

.row {
	display: flex;
	align-items: flex-start;
	gap: 14px;
	margin-bottom: 12px;
}

.label {
	width: 72px;
	padding-top: 8px;
	text-align: right;
	color: #595959;
	font-size: 14px;
}

.field {
	width: 460px;
}

.inline-field {
	display: flex;
	align-items: center;
	gap: 10px;
}

.input {
	border: 1px solid rgb(71, 71, 71);
	border-radius: 6px;
	background-color: rgb(239, 242, 245);
	height: 40px;
	padding: 0 10px;
	width: 100%;
	box-sizing: border-box;
}

.inline-field .input {
	width: 250px;
}

.prompt {
	margin-top: 6px;
	color: #ff4d4f;
	min-height: 20px;
	font-size: 13px;
}

.prompt.side {
	margin-top: 0;
	line-height: 20px;
	white-space: nowrap;
}

.prompt.ok {
	color: #389e0d;
}

.avatar-row {
	align-items: center;
}

.avatar-field {
	display: flex;
	align-items: center;
	gap: 12px;
}

.select-image {
	border: 1px solid rgb(141, 141, 141);
	border-radius: 6px;
	background-color: rgb(240, 240, 240);
	height: 36px;
	line-height: 36px;
	padding: 0 12px;
	cursor: pointer;
}

.select-image:hover {
	color: #fff;
	background-color: rgb(94, 94, 94);
}

.preview {
	width: 84px;
	height: 84px;
	border-radius: 8px;
	background-color: rgb(239, 242, 245);
	background-size: cover;
	background-position: center;
}

.code-row {
	align-items: center;
}

.code-field {
	display: flex;
	align-items: center;
	gap: 10px;
}

.code-input-wrap {
	width: 250px;
	display: flex;
	align-items: center;
	gap: 10px;
}

.send-btn {
	border: 1px solid #d9d9d9;
	background: #fff;
	border-radius: 6px;
	height: 36px;
	width: 110px;
	padding: 0;
	cursor: pointer;
}

.send-btn:hover {
	border-color: #4096ff;
	color: #4096ff;
}

.code-input {
	flex: 1;
}

.split {
	border: none;
	border-top: 1px solid #f0f0f0;
	margin: 10px 0;
}

.tips {
	color: #8c8c8c;
	line-height: 1.7;
}

.comment-user-info2-modal /deep/ .modal-wrap {
	max-height: none;
	overflow: hidden;
}

.comment-user-info2-modal /deep/ .modal-body {
	overflow: visible;
}

@media (max-width: 768px) {
	.content {
		max-width: 100%;
	}

	.row {
		flex-direction: column;
		gap: 8px;
	}

	.label {
		width: auto;
		padding-top: 0;
		text-align: left;
	}

	.field {
		width: 100%;
	}

	.inline-field {
		flex-direction: column;
		align-items: stretch;
		gap: 6px;
	}

	.inline-field .input {
		width: 100%;
	}

	.prompt.side {
		white-space: normal;
	}

	.avatar-row {
		align-items: flex-start;
	}

	.avatar-field {
		flex-direction: column;
		align-items: flex-start;
	}

	.preview {
		width: 120px;
		height: 120px;
	}

	.code-row {
		align-items: stretch;
	}

	.code-field {
		flex-direction: column;
		align-items: stretch;
	}

	.code-input-wrap {
		width: 100%;
	}

	.code-input {
		width: 100%;
	}
}
</style>
