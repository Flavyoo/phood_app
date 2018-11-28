<template>
  <div class="Home container">
    <div class="row">
      <div class="Home-banner col-12 col-sm-12 col-md-12 col-lg-6 col-xl-7">
        <div class="Home-headLine">
          <h1>Food Waste Ends Here</h1>
          <p>We are tackling food waste at its core,</p>
          <p>by creating a unique food waste management system that drives results.</p>
        </div>
      </div>
    </div>

    <div class="row">
        <div class="Home-impact">
        </div>
    </div>

    <div class="row">
        <div class="Home-process">
        </div>
    </div>

    <div class="row">
        <div class="Home-press">
        </div>
    </div>

    <div class="row">
        <div class="Home-getStarted col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5">
            <LoginForm isSigningUp="true" loginHeader="Welcome"/>
        </div>
    </div>


  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue'

export default {
    name: "HomePage",
    components: {
        LoginForm,
    },
}
</script>

<style scoped lang="scss">
.Home {
    &-getStarted {
        margin: 0 auto;
    }
}

</style>
