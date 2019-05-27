const express = require('express');
const cors = require('cors');
const gql = require('graphql-tag');
const graphqlHTTP = require('express-graphql');
const { buildASTSchema } = require('graphql');

const POSTS = [
    { author: "Paul", body: "hi Paul" },
    { author: "Mary", body: "hi Mary" },
    { author: "Bob", body: "hi Bob" },
];
const schema = buildASTSchema(gql`
    type Query {
        posts: [Post]
        post(id: ID!): Post
    }
    type Post {
        id: ID
        author: String
        body: String
    }
    type Mutation {
        submitPost(input: PostInput!): Post
    }
      
    input PostInput {
        id: ID
        author: String!
        body: String!
    }
`);

const mapPost = (post, id) => post && { ...post, id };
const roots = {
    posts: () => POSTS.map(mapPost),
    post: ({ id }) => mapPost(POSTS[id], id),
    submitPost: ({ input: { id, author, body } }) => {
        const post = { author, body };
        let index = POSTS.length;

        if (id != null && id >= 0 && id < POSTS.length) {
            if (POSTS[id].authorId !== authorId) return null;

            POSTS.splice(id, 1, post);
            index = id;
        } else {
            POSTS.push(post);
        }

        return mapPost(post, index);
    },
};
const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: roots,
    graphiql: true,
}));

app.use('/', (req, res) => {
    res.send({ message: 'working' })
});


const port = 4550;

app.listen(port, () => {
    console.log('server running on port', port);
});