<template>
    <div class="Home-loginForm-container">
          <h3 class="Home-loginForm-header">
              {{ formHeader }}
          </h3>
          <GenericInput
           v-show="signingUp"
           placeholder="Email"
           name="email"
           type="email"
           v-on:get-value="onGetEmailValue"
         />
         <GenericInput
          placeholder="username"
          name="username"
          type="text"
          v-on:get-value="onGetInputValue"
        />
        <PasswordInput
          placeholder="password"
          name="password"
          v-on:get-value="onGetPasswordValue"
        />
        <button v-if="signingUp" class="Home-signUpButton"
                name="signUpButton"
                v-on:click="handleSignUp"
        >
          Login
        </button>
        <button v-else class="Home-loginButton"
                name="loginButton"
                v-on:click="handleLogin"
        >
          Login
        </button>
        <p class="Home-loginForm-forgot">
            Forgot username/password ?
        </p>
      <div class="Home-signupInstead">
          {{ accountStanding }}
          <button v-on:click="onSignUpClick">{{ loginSignUpText }}</button>
      </div>
      {{ errorMessage }}
  </div>
</template>

<script>
import GenericInput from '@/components/Input.vue'
import PasswordInput from '@/components/PasswordInput.vue'

import axios from 'axios'

export default {
    name: "LoginForm",
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
            formHeader: 'Login Here',
            errorMessage: ''
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
            // Make a request to the Okta API to sign the user in.
            const apiEndpoint = 'https://dev-127892.oktapreview.com/api/v1/authn/'
            axios.post(apiEndpoint, {
                username: this.username,
                password: this.password,
                options: {
                    multiOptionalFactorEnroll: false,
                    warnBeforePasswordExpired: false
                },
            },{
                responseType: 'json',
            }).then( response => {
                if (response.status === 200) {
                    this.$auth.loginRedirect('/account', {
                        sessionToken: response.data.sessionToken
                    });
                } else {
                    this.errorMessage = "Something went wrong, "
                                        + "check your username or password."
                }
             }).catch(function (error) {
                 /* eslint-disable no-console */
                 console.log(error)
                 this.errorMessage = "Something went wrong, "
                                     + "check your username or password."
            });
            return;
        },
        handleSignUp: function () {
            return;
        }
    }

}
</script>
