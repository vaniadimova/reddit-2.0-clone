import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
 uri: 'https://piritiba.stepzen.net/api/fallacious-rabbit/__graphql',
 cache: new InMemoryCache(),
    headers: {
        Authorization: `Apikey ${process.env.NEXT_PUBLIC_STEPZEN_KEY}`
    },

})

export default client;