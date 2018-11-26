<template>
  <div class="Home container">
    <div class="row">
      <div class="Home-about col-12 col-sm-12 col-md-12 col-lg-6 col-xl-7">
          <p>Commercial Food Waste Management</p>
      </div>
      <div class="Home-loginForm col-12 col-sm-12 col-md-12 col-lg-6 col-xl-5">
           <LoginForm/>
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
<!--<script>
import GenericInput from '@/components/Input.vue'
import PasswordInput from '@/components/PasswordInput.vue'

export default {
    name: "HomePage",
    components: {
        GenericInput,
        PasswordInput,
    },
    data () {
        return {
            email: '',
            username: '',
            password: '',
            signingUp: false,
            loginSignUpText: 'Sign Up',
            accountStanding: "Don't have an account?",
            formHeader: "Login Here"
        }
    },
    methods: {
        onGetInputValue: function (value) {
            this.username = value;
        },
        onGetPasswordValue: function (value) {
            this.password = value;
        },
        onGetEmailValue: function (value) {
            this.email = value;
        },
        onSignUpClick: function () {
            this.signingUp = !this.signingUp;
            this.loginSignUpText = this.signingUp ? "Login" : "Sign Up";
            this.accountStanding = this.signingUp
                                   ? "Already have an account?"
                                   : "Dont have an account?";
            this.formHeader = !this.signingUp ? "Login Here" : "Get Started";
        },
        handleLogin: function () {
            return;
        },
        handleSignUp: function () {
            return;
        }
    }

}
</script>-->
