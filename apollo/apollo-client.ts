import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
 uri: 'http://localhost:5001/api/fallacious-rabbit',
 cache: new InMemoryCache(),
    headers: {
        Authorization: `Apikey ${process.env.NEXT_PULIC_STEPZEN_KEY}`
    },

})

export default client;