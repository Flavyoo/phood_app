/*
 * A service to handle authentication using the PHOOD API.
 */

import axios from 'axios'
import BaseService from './base-api-service'

class AuthService extends BaseService {
	login(endpoint, username, password) {
		return axios.post(`${this.baseAPIUrl}${endpoint}`, {
			username: username,
			password: password,
			options: {
				multiOptionalFactorEnroll: false,
				warnBeforePasswordExpired: false
			},
		},{
			contentType: 'application/json',
			responseType: 'json'
		}).then( response => {
			return response
		}).catch( error => {
			return {
				unAuthorizedError: 'Invalid username or password',
				caughtError: error
			}
		})
	}
}

export default AuthService
