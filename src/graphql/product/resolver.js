const httpError = require('http-errors')
const axios = require('axios');
const https = require('https');
const stdout = require ('stdout');

const instance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 10000,
});

const requestConfig = {
  method: 'get',
  url: '/posts/13',
  httpsAgent: new https.Agent({ keepAlive: true }),
};

const productMocks = [
	{ id: 1, name: 'Product A', shortDescription: 'First product.' }, 
	{ id: 2, name: 'Product B', shortDescription: 'Second product.' },
	{ id: 3, name: 'Scooter', shortDescription: 'Scooter.' },
]

exports.resolver = {
	Query: {
		products(root, { name }, context) {
			const results = name ? productMocks.filter(p => p.name == name) : productMocks
			if (results.length > 0)
				return results
			else
				throw httpError(404, `Product with id ${name} does not exist.`)
		},
		product(root, { id }, context) {
			instance.request(requestConfig).then((response) => {
				console.log(`Data: ${response.data.title}`);
				res.status(200).send(`Data: ${response.data}`);
			});


			const results = id ? productMocks.filter(p => p.id == id) : productMocks
			if (results.length > 0)
				return results
			else
				throw httpError(404, `Product with id ${id} does not exist.`)
		}
	}
}
