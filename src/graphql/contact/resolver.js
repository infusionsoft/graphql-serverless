const httpError = require('http-errors')
const axios = require('axios');
const https = require('https');
const stdout = require ('stdout');

const instance = axios.create({
    baseURL: 'https://alexandria-sand.sbsp.io',
    timeout: 10000,
});

const requestConfig = {
  method: 'get',
  url: '/tenants/d41a5232-d71e-420a-8ca3-db037f33f247/contacts?api_key=d03d635e-5e0f-4742-8ce9-64d77e73adbc',
  //Need to pass this through, not hard code of course
//   headers: {'Authorization':'Bearer eyJraWQiOiJmYTI4Nzg4Zi1hZDRiLTQwYzgtYjkyYS1kZmE1YmUyM2UzMGMiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMTM1NTkiLCJsYXN0TmFtZSI6IldhbGtlciIsImlzRnJvbU5ld0xvZ2luIjoidHJ1ZSIsImF1dGhlbnRpY2F0aW9uRGF0ZSI6IjIwMTgtMDEtMjNUMTM6MDI6NDUuMTExLTA1OjAwW0FtZXJpY2FcL05ld19Zb3JrXSIsImRpc3BsYXlOYW1lIjoiUnlhbiBXYWxrZXIiLCJzdWNjZXNzZnVsQXV0aGVudGljYXRpb25IYW5kbGVycyI6IkluZnVzaW9uc29mdCBBdXRoZW50aWNhdGlvbiBIYW5kbGVyIiwiaXNzIjoiaHR0cHM6XC9cL3NpZ25pbi1zYW5kLmluZnVzaW9udGVzdC5jb20iLCJhdXRob3JpdGllcyI6IlJPTEVfQ0FTX1VTRVIiLCJjcmVkZW50aWFsVHlwZSI6IlVzZXJuYW1lUGFzc3dvcmRDcmVkZW50aWFsIiwiYXVkIjoiaHR0cDpcL1wvbG9jYWxob3N0XC9ob29rIiwiZmlyc3ROYW1lIjoiUnlhbiIsImF1dGhlbnRpY2F0aW9uTWV0aG9kIjoiSW5mdXNpb25zb2Z0IEF1dGhlbnRpY2F0aW9uIEhhbmRsZXIiLCJsb25nVGVybUF1dGhlbnRpY2F0aW9uUmVxdWVzdFRva2VuVXNlZCI6ImZhbHNlIiwiaWQiOiIxMTM1NTkiLCJleHAiOjE1MTY5ODk3NjUsImlhdCI6MTUxNjczMDU2NSwianRpIjoiU1QtMTQ3LTR2bTJhMjVsMHU3UUFOTElELXpld25GbjZwRS00LmIxLmNhcy53ZWIiLCJlbWFpbCI6InJ5YW4ud2Fsa2VyQGluZnVzaW9uc29mdC5jb20ifQ.AxztTGksUKQF4SgaCxocsIi7xNCoaAuYguHUPBiIVSXLBgzWIcrg9o8uXZsYy8BoAvdjpmTJ2UJdmWEPA5BeLbtxw6I2m-Iv3Kl2dmND4IQ9M2v6XctrIg55lfIpvtjBO77c880xqxg43VDCTL2s95-0_mq46EdILm3qz3iLO_a05_zAhGJ22QYOXFNYqaaXWOhAaVcQ3wR7BfAWeCuFp7m6i1EbznLZeaL6OvmmfqoEDoy9EWFRxrTzhR_NLmI8VJHwLcKwe5vr6VIrT9BY3hgkbyZvl0LPf-oV8PKdVbPGbgqAUUqGcc3lWfmcVbt62Yg-IJ9D2pM-NHLBUg4hLg'},
  httpsAgent: new https.Agent({ keepAlive: true })
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
		contact(root, { firstName }, context) {
			return instance.request(requestConfig).then((response) => {
				results = []
				const contacts = response.data.contacts
				if (contacts && contacts.length > 0) {
					results = contacts.map(c => {
						return {
							id: c.id,
							firstName: c.names.filter(name => name.type === "GIVEN").map(name => name.name),
							lastName: c.names.filter(name => name.type === "FAMILY").map(name => name.name),
						}
					})
				}
				return results;
			})
		}
	}
}
