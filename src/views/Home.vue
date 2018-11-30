<template>
  <div class="Home container-fluid">
    <div class="row">
      <div class="Home-banner col-lg-12">
        <div class="Home-headline">
          <h1 class="Home-headline-header">Food Waste Ends Here</h1>
          <p class="Home-headline-subheader">We are tackling food waste at its core,</p>
          <p class="Home-headline-subheader">by creating a unique food waste management system that drives results.</p>
        </div>
      </div>
    </div>

    <div class="Home-impact-row row">
      <div class="Home-impact-left col-md-7">
        <p class="Home-impact-left-text">
            Phood is the best software for tracking food waste.
            Using this data we are able to offer predictions on recommendations,
            spending and supply, that result in thousands of dollars in savings!
        </p>
      </div>
      <div class="Home-impact-right col-md-5">
        <ImpactChart/>
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
            <LoginForm v-bind:isSigningUp="true" loginHeader="Welcome"/>
        </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue'
import ImpactChart from '@/components/ImpactChart'

export default {
    name: "HomePage",
    components: {
        LoginForm,
        ImpactChart
    }
}
</script>

<style scoped lang="scss">
.Home {
    &-banner {
        width: 100%;
        background-image: linear-gradient(90deg, $PERSIAN_BLUE, $PHOOD_BLUE);
    }
    &-headline {
        max-width: 1280px;
        width: 90%;
        padding: 5% 0 0 2%;
        border-bottom: 4px solid $MIDNIGHT_BLUE;
        margin: 5% 0 10% 5%;
    }
    &-headline-header {
        color: #fff;
        font-family: $MERRIWEATHER_FONT;
        font-size: 48px;
    }
    &-headline-subheader {
        color: #fff;
        font-weight: 500;
        font-size: 16px;
        letter-spacing: .8px;
    }
    &-impact-row {
        width: 100%;
    }
    &-impact-left {
        margin: 10% auto;
        &-text {
            font-size: 16px;
            letter-spacing: .8px;
            width: 60%;
            margin-left: 10%;
            color: $PERSIAN_BLUE;
            font-weight: 500;
        }
    }

    &-getStarted {
        margin: 0 auto;
    }
}

</style>
