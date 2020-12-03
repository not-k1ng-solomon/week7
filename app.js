export default (express, bodyParser, fs, crypto, http, MongoClient) => {
    const app = express();

    app.use(bodyParser.json());
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
        next()
    });



    app
        .post('/insert/', async (req, res) => {
            const {login, password, URL} = req.body;

            console.log(URL);

            const client = new MongoClient(URL);

            try {
                await client.connect();

                const database = client.db('mongodemo');
                const collection = database.collection('users');
                const doc = { login: login, password: password };
                const result = await collection.insertOne(doc);

            } catch(error) {
                console.log(error);
            } finally {
                await client.close();
            }

            res.status(200).end();

        })
        .get('/login/', (req, res) => res.send('davlet'))
        .get('/code/', (req, res) => fs.createReadStream(import.meta.url.substring(7)).pipe(res))
        .get('/sha1/:input/', (req, res) => {
            const { input } = req.params;
            res.setHeader('content-type', 'text/plain');
            res.send(crypto.createHash('sha1').update(input).digest('hex'));
        })
        .get('/req', (req, res) => {
            res.setHeader('content-type', 'text/plain');

            let { addr } = req.query;

            http.get(addr, (response) => {
                response.setEncoding('utf8');
                let rawData = '';
                response.on('data', (chunk) => { rawData += chunk; });
                response.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        console.log(parsedData);
                        res.send(JSON.stringify(parsedData));
                    } catch (e) {
                        console.error(e.message);
                    }
                });
            }).on('error', (e) => {
                console.error(`Got error: ${e.message}`);
            });

        })
        .post('/req', (req, res) => {
            res.setHeader('content-type', 'text/plain');

            let addr = req.body.addr;

            http.get(addr, (response) => {
                response.setEncoding('utf8');
                let rawData = '';
                response.on('data', (chunk) => { rawData += chunk; });
                response.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        console.log(parsedData);
                        res.send(JSON.stringify(parsedData));
                    } catch (e) {
                        console.error(e.message);
                    }
                });
            }).on('error', (e) => {
                console.error(`Got error: ${e.message}`);
            });
        })
        .all('*', (req, res) => {
            res.send('davlet');
        });


    return app;
}