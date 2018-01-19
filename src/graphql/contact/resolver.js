const httpError = require('http-errors')
const axios = require('axios');
const https = require('https');
const stdout = require ('stdout');

const instance = axios.create({
    baseURL: 'https://randomuser.me',
    timeout: 10000,
});

const requestConfig = {
  method: 'get',
  url: '/api',
  httpsAgent: new https.Agent({ keepAlive: true }),
};

const contactMocks = [
	{ id: 1, firstName: 'John', lastName: 'Jacob', email: 'e@mail.com.' }, 
	{ id: 2, firstName: 'Jinleheimmer', lastName: 'Schmidt', email: 'me@mail.com.' }, 
	{ id: 3, firstName: 'Sally', lastName: 'Forthwardsteinmanscheuzeirkienn', email: 'he@mail.com.' }, 
]

exports.resolver = {
	Query: {
		contactMocks(root, { id, firstName, lastName }, context) {
			var results = []
			if (id) {
				console.log("id")
				results = contactMocks.filter(c => c.id == id)
			} else if (firstName) {
				console.log("first", firstName)
				results = contactMocks.filter(c => c.firstName == firstName)
			} else if (lastName) {
				console.log("last")
				results = contactMocks.filter(c => c.lastName == lastName)
			}
			if (results.length > 0)
				return results
			else
				throw httpError(404, `Contact with id ${id} does not exist.`)
		},
		contact(root, contact, context) {
			return instance.request(requestConfig).then((response) => {
				results = []
				const data = response.data.results[0]
				const c = {
					id: 1,
					firstName: data.name.first,
					lastName: data.name.last,
					email: data.email
				}
				results = [c]
				return results;
			})
		}
	}
}
