<template>
  <main-panel title="编辑优惠券">
    <el-row>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" size="small">
        <el-form-item label="客户" prop="user_id">
          <el-select v-model="form.user_id" placeholder="请选择" clearable filterable remote :remote-method="getUserRemote" :loading="loading1">
            <el-option
              v-for="item in customers"
              :key="item.id"
              :label="item.nickname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券" prop="coupon">
          <el-input v-model="form.coupon" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="优惠金额" prop="discount">
          <el-input v-model.number="form.discount"></el-input>
        </el-form-item>
        <el-form-item label="最低消费" prop="enough_amount">
          <el-input v-model.number="form.enough_amount"></el-input>
        </el-form-item>
        <el-form-item label="激活日期" prop="activation_date">
          <el-date-picker
            v-model="form.activation_date"
            type="datetime"
            placeholder="选择日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效日期">
          <el-date-picker
            v-model="form.expiration_date"
            type="datetime"
            placeholder="选择日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            inactive-text="禁用"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save" :loading="loading">保存</el-button>
          <router-link :to="{ path: '/coupons' }">
            <el-button>取消</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </el-row>
  </main-panel>
</template>

<script>
import * as api from 'api'

export default {
  data () {
    return {
      customers: [],
      form: {
        id: null,
        user_id: null,
        coupon: '',
        discount: null,
        enough_amount: null,
        activation_date: new Date(),
        expiration_date: null,
        status: 1
      },
      showCost: true,
      loading: false,
      loading1: false,
      rules: {
        coupon: {required: true, message: '请输入优惠券'},
        activation_date: {required: true, message: '请选择激活日期'},
        discount: [
          {required: true, message: '请填写优惠金额'},
          {type: 'number', message: '优惠金额必须为数字值'}
        ],
        enough_amount: [
          {type: 'number', message: '使用金额必须为数字值'}
        ]
      }
    }
  },
  mounted () {
    this.form.id = this.$route.params.id
    this.getCouponInfo()
  },
  methods: {
    getCouponInfo () {
      this.$http.get(api.COUPON + '/info?id=' + this.form.id).then(data => {
        this.form.id = data.data.id
        this.form.user_id = data.data.user_id
        this.form.coupon = data.data.coupon
        this.form.discount = Number(data.data.discount)
        this.form.enough_amount = Number(data.data.enough_amount)
        this.form.activation_date = data.data.activation_date
        this.form.expiration_date = data.data.expiration_date
        this.form.status = data.data.status

        if (data.data.user.nickname) {
          this.getUserRemote(data.data.user.nickname)
        }
      }).catch(err => {
        this.$message.error(err + '')
        this.pageLoading = false
      })
    },
    getUserRemote (query) {
      return new Promise((resolve, reject) => {
        this.loading1 = true
        this.$http.get(api.CUSTOMER + '?page=1&size=10&name=' + query).then((data) => {
          if (data.errno === 0) {
            this.customers = data.data.data
            resolve(this.customers)
          } else {
            reject(data)
          }
          this.loading1 = false
        }).catch(err => {
          this.loading1 = false
          this.$message.error(err + '')
          reject(err)
        })
      })
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.$http.post(api.COUPON + '/save', this.form).then((data) => {
            if (data.errno === 0) {
              this.loading = false
              this.$notify({title: '成功', message: '添加成功', type: 'success'})
              this.$router.push({ path: '/coupons' })
            }
          }).catch(err => {
            this.loading = false
            console.log(err)
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
