<template>
    <div class="LoginForm-container">
      <div class="LoginForm-headerContainer">
          <h3 class="LoginForm-headerContainer-header">
              {{ formHeader }}
          </h3>
       </div>
       <div class="LoginForm-inputContainer">
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
          v-bind:errorMessage="passwordErrorMessage"
        />
        <button v-if="signingUp" class="LoginForm-submitButton"
                name="signUpButton"
                v-on:click="handleSignUp"
        >
          Done
        </button>
        <button v-else class="LoginForm-submitButton"
                name="loginButton"
                v-on:click="handleLogin"
        >
          Login
        </button>
    </div>
    <div class="LoginForm-breadcrumbs">
      <a class="LoginForm-breadcrumbs-forgot" href="#">Forgot username/password?</a>
      <div class="LoginForm-breadcrumbs-signupInstead">
        {{ accountStanding }}
        <button class="LoginForm-breadcrumbs-button" v-on:click="onSignUpClick">{{ loginSignUpText }}</button>
      </div>
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>

import GenericInput from '@/components/Input.vue'
import PasswordInput from '@/components/PasswordInput.vue'
import AuthService from '@/services/phood-api-services/authentication.js'

const API_ENDPOINT = 'https://api.test.phoodsolutions.com'
const SUCCESS = 200

export default {
    name: "LoginForm",
    components: {
        GenericInput,
        PasswordInput,
    },
    props: {
        isSigningUp: Boolean,
        loginHeader: String
    },
    data () {
        return {
            email: '',
            username: '',
            password: '',
            signingUp: this.isSigningUp,
            loginSignUpText: 'Login',
            accountStanding: "Don't have an account?",
            formHeader: this.loginHeader,
            errorMessage: '',
            passwordErrorMessage: ''
        }
    },
    mounted: function () {
        this.formHeader = this.signingUp ? "Get Started" : this.loginHeader;
    },
    methods: {
        onGetInputValue: function (value) {
            this.username = value;
        },
        onGetPasswordValue: function (value) {
            if (value.length >= 8) {
                this.password = value;
                this.passwordErrorMessage = ''
            } else {
                this.passwordErrorMessage = 'Password must be longer 7 characters.'
            }
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
            this.formHeader = !this.signingUp ? this.loginHeader : "Get Started";
        },
        async handleLogin() {
            const authService = new AuthService(API_ENDPOINT)
            const response = await authService.login('/auth/login', this.username, this.password)
            if (response.status == SUCCESS) {
                const user = response.data.user
                user.roles = response.data.roles

                const userPayload = { activeUser: user }
                const payload = { sessionId: response.headers.authorization }

                this.$store.dispatch('login', payload)
                this.$store.dispatch('saveUser', userPayload)

                // go to account page
                this.$router.push({path: 'about'})

            } else {
                this.errorMessage = response.unAuthorizedError
            }
            return;
        },
        handleSignUp: function () {
            return;
        }
    }

}
</script>

<style scoped lang="scss">
.LoginForm {
    &-container {
        margin: 10% auto;
        width: auto;
        max-width: 70%;
        height: auto;
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        border-radius: 5px;
    }
    &-headerContainer {
        width: 100%;
        height: 5em;
        padding: 4em 0 3em 0;
        display: flex;
        align-items: center;
        justify-content: center;
        &-header {
            color: $PHOOD_BLUE;
            font-family: $ROBOTO_FONT;
            font-size: 2.4em;
            letter-spacing: .8px;
        }
    }
    &-inputContainer {
        width: 100%;
        height: auto;
        margin: 0 auto;
        text-align: center;
    }
    &-submitButton {
        width: 75%;
        font-size: 16px;
        color: #fff;
        cursor: pointer;
        margin-top: 10px;
        height: 46px;
        text-align:center;
        border: none;
        background-size: 300% 100%;
        border-radius: 50px;
        background-image: linear-gradient(to right, #25aae1, #40e495, #30dd8a, #2bb673);
        box-shadow: 0 4px 15px 0 rgba(49, 196, 190, 0.75);
        &:focus {
            outline: none;
        }
    }
    &-breadcrumbs {
        margin-top: 40px;
        text-align: center;
        &-forgot {
            font-size: 14px;
            text-decoration: none;
            text-align: center;
        }
        &-signupInstead {
            color: $LIGHT_TEAL_BLUE;
            padding: 5%;
        }
        &-button {
            cursor: pointer;
            border: none;
            color: $MIDNIGHT_BLUE;
            font-weight: bold;
            &:focus {
                outline: none;
            }
        }
    }
}

</style>
