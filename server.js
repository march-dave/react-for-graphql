const express = require("express");
const path = require("path");
const port = process.env.PORT || 8080;
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

// graphql-yoga version for comparing with apollo server
const { GraphQLServer } = require("graphql-yoga");

// Apollo Server Version 2
const { ApolloServer, gql } = require("apollo-server-express");

// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));

app.use(cors(), bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data
// const users = [{ email: "dave@abc.com", password: "123", hashed: "111", username: "Dave Lee" }, { email: "jane@abc.com", password: "123", hashed: "111", username: "jane Lee" }];
const users = [{
  id: '1',
  name: 'Andrew',
  email: 'andrew@example.com',
  age: 27
}, {
  id: '2',
  name: 'Sarah',
  email: 'sarah@example.com'
}, {
  id: '3',
  name: 'Mike',
  email: 'mike@example.com'
}]

const posts = [{
  id: '10',
  title: 'GraphQL 101',
  body: 'This is how to use GraphQL...',
  published: true,
  author: '1'
}, {
  id: '11',
  title: 'GraphQL 201',
  body: 'This is an advanced GraphQL post...',
  published: false,
  author: '1'
}, {
  id: '12',
  title: 'Programming Music',
  body: '',
  published: false,
  author: '2'
}]

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }

            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch
            })
        },
        me() {
            return {
                id: '123098',
                name: 'Mike',
                email: 'mike@example.com'
            }
        },
        post() {
            return {
                id: '092',
                title: 'GraphQL 101',
                body: '',
                published: false
            }
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        }
    }
}

// const server = new GraphQLServer({
//     typeDefs,
//     resolvers
// })

// server.start(port, ({port}) => {
//   console.log(`Express listening on port: ${port}`);
// } )

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true
});

server.applyMiddleware({ app });

app.listen(port, () => {
  console.log(`Express listening on port: ${server.graphqlPath} ${port}`);
});
