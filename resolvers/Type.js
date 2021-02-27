const { GraphQLScalarType } = require('graphql');

// sample data
const users = [
  { "githubLogin": "ichi", "name": "ichi san" },
  { "githubLogin": "ni", "name": "ni san" },
  { "githubLogin": "san", "name": "san san" }
];



module.exports = {
  Photo: {
    url: parent => `http://honyahonya/img/${parent.id}.jpg`,
    postedBy: parent => {
      return users.find(u => u.githubLogin === parent.githubUser)
    },
    taggedUsers: parent => {
      return tags
        .filter(tag => tag.photoID === parent.id)
        .map(tag => tag.userID)
        .map(userID => users.find(u => u.githubLogin === userID))
    }
  },
  User: {
    postedPhotos: parent => {
      return photos.filter(p => p.githubUser === parent.githubLogin)
    },
    inPhotos: parent => {
      return tags
        .filter(tag => tag.photoID === parent.id)
        .map(tag => tag.userID)
        .map(photoID => photos.find(p => p.id === photoID))
    }
  },
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value',
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => ast.value
  })
}