import { prisma } from './db.js';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { gql } from 'graphql-tag';
//index.ts -> index.js
//db.ts -> db.js
(async function () {
    // .gql
    const typeDefs = gql `
        type Post {
            id: String
            title: String
            username: String
        }

        type Query {
            getAllPost: [Post]
        }

        type Mutation {
            createPost( title:String, username: String): Post
        }
    `;
    const resolvers = {
        Mutation: {
            createPost: async (_parent, args) => {
                const post = await prisma.post.create({
                    data: {
                        title: args.title,
                        username: args.username
                    }
                });
                return post;
            }
        },
        Query: {
            getAllPost: async () => {
                return await prisma.post.findMany();
            }
        }
    };
    // Graphql Types vs Prisma Models
    // Post -> id, title, username
    // Prisma -> all the data being saved to your database
    const server = new ApolloServer({
        typeDefs,
        resolvers
    });
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 }
    });
    console.log("Server is ready at " + url);
})();
