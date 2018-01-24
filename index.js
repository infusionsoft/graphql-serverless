const axios = require('axios');
const { graphqlHandler } = require('graphql-serverless')
const { transpileSchema } = require('graphql-s2s').graphqls2s
const { app } = require('webfunc')
const { makeExecutableSchema } = require('graphql-tools')
const { glue } = require('schemaglue')
const https = require('https')

const { schema, resolver } = glue('./src/graphql')

const executableSchema = makeExecutableSchema({
	typeDefs: transpileSchema(schema),
	resolvers: resolver
})

const graphqlOptions = (req, res) => {
	return {
		schema: executableSchema,
		graphiql: true,
		endpointURL: '/graphiql',
		context: {authHeader: req.headers['authorization']}		
	}
}

const instance = axios.create({
    baseURL: 'https://signin-sand.infusiontest.com',
    timeout: 10000
});

const requestConfig = (authHeader) => {
	return {
		method: 'get',
		url: '/jwt',
		headers: {'Authorization': authHeader},
		httpsAgent: new https.Agent({ keepAlive: true })
	}
}
  

const authenticate = (req, res, next) => {
	// Will use jsrsasign for validating eventually
	if (req.hostname != 'localhost') {
		const authHeader = req.headers['authorization']
		if (authHeader) {
			instance.request(requestConfig(authHeader))
			.then((response) => {
				const exp = response.data.exp
				const expDate = new Date(0)
				expDate.setUTCSeconds(exp)
				if (expDate < new Date()) {
					res.status(401).send(`Invalid Authorization Header.`)
				}
			})
			.catch((err) => {
				res.status(401).send(`Error authenticating.`)
			})
		} else {
			res.status(401).send(`Missing 'Authorization' header.`)
		}
	}
	next()
}

app.use(authenticate)

const path = ['/', '/graphiql']
const handler = graphqlHandler(graphqlOptions)
const next = () => null 

app.all(path, handler, next)

eval(app.listen('app', 4000))
