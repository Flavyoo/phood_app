import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import LoginView from '@/views/LoginView.vue'
import Auth from '@okta/okta-vue'
import UserAccount from '@/views/Account'
import {CLIENT_ID, REDIRECT_URI, SCOPE} from './consts'

Vue.use(Auth, {
  issuer: 'https://dev-127892.oktapreview.com/oauth2/default',
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  scope: SCOPE
})

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login-view',
      component: LoginView
    },
    {
      path: '/implicit/callback',
      component: Auth.handleCallback()
    },
    {
      path: '/account',
      name: 'account',
      component: UserAccount,
      meta: {
          requiresAuth: true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})

/*
 * This nagivation gaurd checks if a user is authenticated before
 * they can visit a certain route. If they are not, it sends them to the login
 * view.
 */
router.beforeEach(async (to, from, next) => {
    if (to.matched.some( record => record.meta.requiresAuth)
        && !(await Vue.prototype.$auth.isAuthenticated()))
    {
         next({ path: '/login' })
    } else {
        next()
    }
})

export default router;
