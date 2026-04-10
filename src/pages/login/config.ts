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

export const usernameList = [
  {
    label:'超级管理员',
    obj:{
      account:'superadmin',
      password:'SuperAdmin_123'
    }
  },
  {
    label:'管理员',
    obj:{
      account:'admin',
      password:'Admin_123'
    }
  },
  {
    label:'技术部经理',
    obj:{
      account:'manager',
      password:'Manager_123'
    }
  },
  {
    label:'开发工程师',
    obj:{
      account:'developer',
      password:'Developer_123'
    }
  },
  {
    label:'普通用户',
    obj:{
      account:'user',
      password:'User_123'
    }
  },
]
