const httpError = require('http-errors')
const axios = require('axios');
const https = require('https');
const stdout = require ('stdout');

const instance = axios.create({
    baseURL: 'https://alexandria-sand.sbsp.io',
    timeout: 10000,
});

const requestConfig = (authHeader) => {
	return {
		method: 'get',
		url: '/tenants/d41a5232-d71e-420a-8ca3-db037f33f247/contacts?api_key=d03d635e-5e0f-4742-8ce9-64d77e73adbc',
		headers: {'Authorization': authHeader},
		httpsAgent: new https.Agent({ keepAlive: true })
	}
};

const contactMocks = [
	{ id: 1, firstName: 'John', lastName: 'Jacob', email: 'e@mail.com.' }, 
	{ id: 2, firstName: 'Jinleheimmer', lastName: 'Schmidt', email: 'me@mail.com.' }, 
	{ id: 3, firstName: 'Sally', lastName: 'Forthwardsteinmanscheuzeirkienn', email: 'he@mail.com.' }, 
]

exports.resolver = {
	Query: {

		contacts(root, { firstName, lastName }, context) {
			return instance.request(requestConfig(context.authHeader)).then((response) => {
				results = []
				const contacts = response.data.contacts
				if (contacts && contacts.length > 0) {
					results = contacts.map(c => {
						var firstName = c.names.filter(name => name.type === "GIVEN").map(name => name.name)
						if (firstName && firstName.length > 0) {
							firstName = firstName[0]
						}
						return {
							id: c.id,
							firstName: firstName,
							lastName: c.names.filter(name => name.type === "FAMILY").map(name => name.name),
						}
					})
					if (firstName) {
						results = results.filter(contact => contact.firstName === firstName)
					}
					if (lastName) {
						console.log(results)
						results = results.filter(contact => contact.lastName === lastName)
					}
				}
				return results;
			})
		},




		contactMocks(root, { id, firstName, lastName }, context) {
			var results = []
			if (id) {
				results = contactMocks.filter(c => c.id == id)
			} else if (firstName) {
				results = contactMocks.filter(c => c.firstName == firstName)
			} else if (lastName) {
				results = contactMocks.filter(c => c.lastName == lastName)
			} else {
				results = contactMocks
			}
			if (results.length > 0)
				return results
			else
				throw httpError(404, `Contact with id ${id} does not exist.`)
		}
	}
}
