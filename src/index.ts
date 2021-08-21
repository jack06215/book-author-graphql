import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from './constants';
// import { Post } from './entities/Post';
import { HelloResolver } from './resolvers/hello';

import mikroOrmConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';


const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up();

    const app = express();

    app.get('/', (_, res) => {
        res.send('hello');
    });

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver],
            validate: false,
        }),
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    app.listen(4001, () => {
        console.log('server started on localhost:4001');
    });

    // const post = orm.em.create(Post, {title: 'my first post'});
    // await orm.em.persistAndFlush(post);

    // const posts = await orm.em.find(Post, { });
    // console.log(posts);
};

main().catch((error) => {
    console.error(error);
});
