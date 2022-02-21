<template></template>
<script>
export default {
  mounted() {
    this.$fire
						.auth
						.signOut()
						.then(() => {
							console.log('sign out succesful');
              this.$nuxt.$router.push('/login')
						})
						.catch((err) => console.log(err.message))
  }
}
</script>