<template>
  <div class="min-h-screen flex">
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <i class="h-12 w-12 text-blue-600 rounded-full p-4 bg-blue-100 la la-laptop"></i>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to control your privacy
          </h2>
        </div>

        <div class="mt-8">
          <div>
            <div class="mt-6 relative">
              <div class="absolute inset-0 flex items-center" aria-hidden="true">
                <div class="w-full border-t border-gray-300" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="bg-white text-gray-500">
                  Login and configure your smart home in the way you want to.
                </span>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <form class="space-y-6" @submit.prevent @submit="login">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div class="mt-1">
                  <input v-model="cred.email" id="email" name="email" type="email" autocomplete="email" required="" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
              </div>

              <div class="space-y-1">
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div class="mt-1">
                  <input v-model="cred.password"  id="password" name="password" type="password" autocomplete="current-password" required="" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300" :disabled="!valid">
                  Let's make it private!
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="hidden lg:block relative w-0 flex-1">
      <img class="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1628422537562-0980980f52a0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" alt="" />
    </div>
  </div>
</template>
<script>

export default {

  name: "Register",
    layout: 'blank',
  components: {
  },
    auth: 'guest',
  data(){
    return {
      cred: {
        email: null,
        password: null,
        policy: false
      }
    }
  },
  computed:{
    valid(){
      return this.cred.email && this.cred.password
    }
  },
  mounted() {
  },
  methods: {
      async login(){
          try {
              await this.$auth.loginWith('local', { data: this.cred })
              this.$router.push('/');
          } catch (err) {
              console.log(err)
              this.$toast.add({severity: 'error', summary: 'Failed', detail: "Credentials are incorrect", life:3000})
          }
      },
  }
}
</script>
