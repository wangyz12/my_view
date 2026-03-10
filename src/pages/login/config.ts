export const loginRules = {
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      min: 3,
      max: 20,
      message: '长度在 3 到 20 个字符',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: '长度在 6 到 20 个字符',
      trigger: 'blur',
    },
  ],
  captchaCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
  ],
};