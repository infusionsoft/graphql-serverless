exports.schema = `
type Contact {
  id: ID!
  firstName: String!
  lastName: String
  email: String
}
`
// Notice that we have omitted to wrap the above with 'type Query { }'
exports.query = `
  # ### GET contacts
  #
  # _Arguments_
  # - **id**: Product's id (optional)
  contact(firstName: String, lastName: String): [Contact],
  # contacts(firstName: String): [Contact],
  # contacts(lastName: String): [Contact],
  contactMocks(firstName: String): [Contact]
`