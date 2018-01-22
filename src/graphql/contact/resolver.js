const httpError = require('http-errors')
const axios = require('axios');
const https = require('https');
const stdout = require ('stdout');

const instance = axios.create({
    baseURL: 'https://is-optimus-app-sand.appspot.com/api/v2',
    timeout: 10000,
});

const requestConfig = {
  method: 'get',
  url: '/accounts/4885503815974912/contacts',
//   headers: {'Authorization':'Bearer eyJraWQiOiJmYTI4Nzg4Zi1hZDRiLTQwYzgtYjkyYS1kZmE1YmUyM2UzMGMiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMTM1NTkiLCJsYXN0TmFtZSI6IldhbGtlciIsImlzRnJvbU5ld0xvZ2luIjoidHJ1ZSIsImF1dGhlbnRpY2F0aW9uRGF0ZSI6IjIwMTgtMDEtMTlUMTU6NTM6MjcuNDk5LTA1OjAwW0FtZXJpY2FcL05ld19Zb3JrXSIsImRpc3BsYXlOYW1lIjoiUnlhbiBXYWxrZXIiLCJzdWNjZXNzZnVsQXV0aGVudGljYXRpb25IYW5kbGVycyI6IkluZnVzaW9uc29mdCBBdXRoZW50aWNhdGlvbiBIYW5kbGVyIiwiaXNzIjoiaHR0cHM6XC9cL3NpZ25pbi1zYW5kLmluZnVzaW9udGVzdC5jb20iLCJhdXRob3JpdGllcyI6IlJPTEVfQ0FTX1VTRVIiLCJjcmVkZW50aWFsVHlwZSI6IlVzZXJuYW1lUGFzc3dvcmRDcmVkZW50aWFsIiwiYXVkIjoiaHR0cDpcL1wvbG9jYWxob3N0XC9ob29rIiwiZmlyc3ROYW1lIjoiUnlhbiIsImF1dGhlbnRpY2F0aW9uTWV0aG9kIjoiSW5mdXNpb25zb2Z0IEF1dGhlbnRpY2F0aW9uIEhhbmRsZXIiLCJsb25nVGVybUF1dGhlbnRpY2F0aW9uUmVxdWVzdFRva2VuVXNlZCI6ImZhbHNlIiwiaWQiOiIxMTM1NTkiLCJleHAiOjE1MTY2NTQ0MDcsImlhdCI6MTUxNjM5NTIwNywianRpIjoiU1QtMTIwNC13RXk3R25fX2dRemZlcE55WUljdVVLUUNpTzQtNC5iMS5jYXMud2ViIiwiZW1haWwiOiJyeWFuLndhbGtlckBpbmZ1c2lvbnNvZnQuY29tIn0.KPA5OTIo8aN5gmwNKPaT8N6MhnhifXWJeRSnSuWtqUm3g51RGxh5gn1kVqthc53IZ9jrf2I5e8Of5gzWCQ5KDwz8u4DjPdEQ7sgvuLwavUxNGzs0Q3zB_EGs3Yu9s-nzCXcF25JfT_SRok1NPgK1DTDZMdtpGuHqKKRALwCoNZYlsiz1pQ8zkH7PlPOwt4iI3WIKP_QiLjQrw2uHmliQIkc0A6pfuAFvMdylJNMEsHUmYqlFuApJ5WZ9CboWLlZMkCGxVRbEfvsD0vee4rOCY4Mo6sj61oB8Kf5oZTEDPDmTMV-D0NjVk8tjlhVdiRa_T5nrn8dveV5qsRW1kAINmw'},
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
				const data = response.data.content
				if (data && data.length > 0) {
					results = data.map(c => {
						return {
							id: c.id,
							firstName: c.givenName,
							lastName: c.familyName
						}	
					  })
					if (firstName) {
						results = results.filter(c => c.firstName == firstName)
					}
				}
				return results;
			})
		}
	}
}
