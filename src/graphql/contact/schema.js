exports.schema = `
type Contact {
    id: ID
    communicationChannelIds: [String]
    fullName: String
    givenName: String
    company: String
    jobTitle: String
    groups: [String]
    phoneNumbers: [Entity]
    emailAddresses: [Entity]
    addresses: [PhysicalAddress]
    classifications: [String]
    types: [String]
}

type Entity {
    value: String
    type: String
    displayOrder: Int
}

type PhysicalAddress {
    streetAddress1: String
    streetAddress2: String
    postalCode: String
    postOfficeBoxNumber: String
    locality: String
    region: String
    country: String
    displayOrder: Int
}

type ReturnedQuery {
    total: Int
    contacts: [Contact]
}
`
// Notice that we have omitted to wrap the above with 'type Query { }'
exports.query = `
    # ### GET getContact
    #
    # _Arguments_
    # - **accountId**: account's id (required)
    # - **id**: contact's id (optional)
    getContact(accountId: String): ReturnedQuery
`
