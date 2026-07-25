<template>
	<common-modal
		class="comment-user-info2-modal"
		v-model="innerVisible"
		title="评论需填写必要信息"
		width="500px"
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
					</div>
				</div>
			</div>

			<div class="row">
				<div class="label">邮箱</div>
				<div class="field">
					<div class="inline-field">
						<input type="text" v-model="email" placeholder="邮箱" class="input" />
					</div>
				</div>
			</div>

			<div class="row avatar-row">
				<div class="label">头像</div>
				<div class="field avatar-field">
					<label for="avatar2" class="select-image">选择头像（非必选）</label>
					<input id="avatar2" type="file" @change="imageUpload" style="display: none" />
					<div ref="preview" class="preview"></div>
				</div>
			</div>

			<div class="row code-row">
				<div class="label">邮箱验证码</div>
				<div class="field code-field">
					<div class="code-input-wrap">
						<common-button class="send-btn" variant="primary" @click="verifyPost">发送验证码</common-button>
						<input type="text" v-model="verifyCode" placeholder="验证码" class="input" />
					</div>
				</div>
			</div>
		</div>
	</common-modal>
</template>

<script>
export default {
	name: "commentUserInfo",
	props: ["comment"],
	data() {
		return {
			innerVisible: true,
			nickname: "", // 评论用户昵称
			email: "", // 评论用户邮箱
			avatar: "", // 评论用户头像
			verifyCode: "", // 邮箱验证码
			submitting: false, // 防止重复提交
		};
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
			this.$api.comment.uploadAvatar(formdata).then(() => {});

			const reader = new FileReader();
			reader.onload = (event) => {
				this.$refs.preview.style.backgroundImage = "url(" + event.target.result + ")";
			};
			reader.readAsDataURL(file);
		},
		// 用户信息框 点击发送验证码 用于验证邮箱是否有效。
		verifyPost() {
			if (!this.checkEmail(this.email)) {
				this.$message.warning("请先填写有效邮箱");
				return;
			}

			// 发送验证码请求
			this.$api.comment.sendEmailCode(this.email).then(() => {
				this.$message.success("验证码已发送");
			});
		},
		// 用户信息框 点击取消
		handleCancel() {
			this.innerVisible = false;
			this.$bus.$emit("commentUserInfoShow", false);
		},
		// 用户信息框 点击提交 （返回token）
		handleOk() {
			// 防止重复提交
			if (this.submitting) {
				return;
			}

			const valid = !!this.nickname && this.checkEmail(this.email) && !!this.verifyCode;
			if (!valid) {
				this.$message.warning("请填写必要信息 并 输入正确验证码");
				return;
			}

			this.submitting = true;
			this.$api.comment.identifyCommentCookie({
				email: this.email,
				verifyCode: this.verifyCode,
				nickname: this.nickname,
				avatar: this.avatar, // todo
			}).then(() => {
				this.$bus.$emit("commentUserInfo", {
					verified: true,
				});
				this.$message.success("信息验证成功");
				this.handleCancel(); // 取消弹窗
			}).catch((error) => {
				const status = error && error.status;
				if (status === 400) {
					this.$message.warning("验证码不正确或已过期，请重新发送验证码");
					return;
				}
				this.$message.error("验证失败，请稍后重试");
			}).finally(() => {
				this.submitting = false;
			});
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
	flex-direction: column;
	align-items: stretch;
	gap: 6px;
	margin-bottom: 12px;
}

.label {
	color: #222;
	font-size: 14px;
	font-weight: 600;
}

.field {
	width: 100%;
}

.inline-field {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	gap: 0;
}

.input {
	border: 1px solid #d0d0d0;
	border-radius: 6px;
	height: 40px;
	padding: 0 10px;
	width: 100%;
	box-sizing: border-box;
	font-size: 14px;
}

.input:focus {
	outline: none;
	border-color: #666;
}

.avatar-field {
	display: flex;
	/* align-items: center; */
	gap: 10px;
}

.select-image {
	border: 1px solid #d0d0d0;
	border-radius: 6px;
	height: 36px;
	line-height: 36px;
	padding: 0 12px;
	cursor: pointer;
	color: #333;
	font-size: 13px;
}

.select-image:hover {
	background: #f5f5f5;
}

.preview {
	width: 104px;
	height: 104px;
	border-radius: 8px;
	background-color: #f2f2f2;
	background-size: cover;
	background-position: center;
	border: 1px solid #ddd;
}

/* 邮箱验证码输入框和发送按钮在同一行显示 */
.code-field {
	display: flex;
	align-items: stretch;
	gap: 8px;
}

/* 同上 */
.code-input-wrap {
	width: 100%;
	display: flex;
	align-items: center;
	gap: 8px;
}

/* 发送验证码按钮样式 */
.send-btn {
	height: 40px;
	width: auto;
	flex: 0 0 auto;
	white-space: nowrap;
	padding-left: 12px;
	padding-right: 12px;
}


.comment-user-info2-modal /deep/ .modal-wrap {
	max-height: none;
	overflow: hidden;
}

.comment-user-info2-modal /deep/ .modal-body {
	overflow: visible;
}

@media (max-width: 768px) {
	.avatar-field {
		flex-direction: column;
		align-items: flex-start;
	}

	.preview {
		width: 110px;
		height: 110px;
	}

	.code-input-wrap {
		flex-direction: column;
		align-items: stretch;
	}

	.send-btn {
		width: 100%;
	}
}
</style>
