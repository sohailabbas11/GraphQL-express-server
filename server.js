const express = require('express')
const app = express()
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require ('graphql')

const authors = [
    {id: 1, name: 'rowling'},
    {id: 2, name: 'tolkein'},
    {id: 3, name: 'brent'}
]

const books = [
    {id: 1, name: 'harry potter secrets', authorId: 1},
    {id: 2, name: 'harry potter azkaban', authorId: 1},
    {id: 3, name: 'harry potter goblet', authorId: 1},
    {id: 4, name: 'the fellowship', authorId: 2},
    {id: 5, name: 'the two towers', authorId: 2},
    {id: 6, name: 'return of the king', authorId: 3},
    {id: 7, name: 'beyond the shadows', authorId: 3},

]
/* const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'helloworld',
        fields: () => ({
            message: { 
                type: GraphQLString,
                resolve: () => 'hello world'
             }
        })
    })
}) */

const BookType = new GraphQLObjectType({
    name: 'book',
    description: 'this reprents a book writton by an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name:{ type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLString)},
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'this reprents an auhtor of a book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name:{ type: GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType),
            resolve: () => {
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'a single book',
            args: {
                id: { type: GraphQLInt},
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {
            type: GraphQLList(BookType),
            description: 'list of all books',
            resolve: () => books
        },
        authors: {
            type: GraphQLList(AuthorType),
            description: 'list of all authors',
            resolve: () => authors
        },
        auhtor: {
            type: AuthorType,
            description: 'a single author',
            args: {
                id: { type: GraphQLInt}
            },
            resolve: (parent, args) => authors.find(auhtor => author.id === args.id)
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'mutation',
    description: 'root mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'add a book',
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const book = {id: books.length + 1, name: args.name, authorId:
                     args.authorId}
                     books.push(book)
                     return book
            }
        },
        addAuthor: {
            type: AuthorType,
            description: 'add a author',
            args: {
                name: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                const author = {id: authors.length + 1, name: args.name}
                     authors.push(author)
                     return author
            }
        }
    })
})

const schema = new GraphQLSchema ({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))


app.listen(5001, () => console.log('server running'))