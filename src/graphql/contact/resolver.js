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

const postmanMock = axios.create({
    baseURL: 'https://8647aeb2-b05a-4b97-96fc-59b38789335b.mock.pstmn.io',
    timeout: 10000,
});

const getMockContacts = (accountId) => {
    return {
        method: 'get',
        url: `/api/pre-alpha/${accountId}/contacts`
    }
};

// const contactMocks = [
//     { id: 1, firstName: 'John', lastName: 'Jacob', email: 'e@mail.com.', accountId: "123456789" }, 
//     { id: 2, firstName: 'Jinleheimmer', lastName: 'Schmidt', email: 'me@mail.com.', accountId: "123456789" }, 
//     { id: 3, firstName: 'Sally', lastName: 'Forthwardsteinmanscheuzeirkienn', email: 'he@mail.com.', accountId: "123456789" }, 
// ]

exports.resolver = {
    Query: {

        // contacts(root, { firstName, lastName }, context) {
        // return instance.request(requestConfig(context.authHeader)).then((response) => {
        //     results = []
        //     const contacts = response.data.contacts
        //     if (contacts && contacts.length > 0) {
        //         results = contacts.map(c => {
        //                 var firstName = c.names.filter(name => name.type === "GIVEN").map(name => name.name)
        //                 if (firstName && firstName.length > 0) {
        //                     firstName = firstName[0]
        //                 }
        //                 return {
        //                     id: c.id,
        //                     firstName: firstName,
        //                     lastName: c.names.filter(name => name.type === "FAMILY").map(name => name.name),
        //                 }
        //             })
        //             if (firstName) {
        //                 results = results.filter(contact => contact.firstName === firstName)
        //             }
        //             if (lastName) {
        //                 console.log(results)
        //                 results = results.filter(contact => contact.lastName === lastName)
        //             }
        //         }
        //         return results;
        //     })
        // },

        contacts(root, { accountId }, context) {
            console.log("root - ", JSON.stringify(root, null, 2))
            console.log("context - ", JSON.stringify(context, null, 2));
            console.log("postmanMock Request", getMockContacts(accountId))
            return postmanMock.request(getMockContacts(accountId))
                .then((response) => {
                    console.log("response -", JSON.stringify(response, null, 2));
                    var results = []
                    if (accountId) {
                        results = results.concat(response.filter(c => c.accountId == accountId))
                    } else {
                        throw httpError(401);
                    }
                    
                    if (firstName) {
                        results = results.filter(c => c.firstName == firstName)
                    }
                    
                    if (lastName) {
                        results = results.filter(c => c.lastName == lastName)
                    }
                    
                    if (id) {
                        results = results.filter(c => c.id == id)
                    }
                    

                    if (results.length > 0) {
                        return results
                    } else {
                        throw httpError(404, `Contact with id ${id} does not exist.`)
                    }
                })
                .catch((error) => {
                    console.log("error - ", error)
                    throw httpError(500, `Idk. ${JSON.stringify(error)}`)
                })
            },
    }
}
