const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;


//Middleware----

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zkvef.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run (){
    try {
        await client.connect();
        const database = client.db('travelDetail')
        const detailsCollection = database.collection('details');
        const orderCollection = client
        .db('travelDetail')
        .collection('order');
        
        
        console.log('con to db');


        //Get Api Data
        app.get('/details', async(req, res) => {
            const cursor = detailsCollection.find({});
            const details = await cursor.toArray();
            res.send(details);
        })

        //place order
        app.post("/order", async (req, res) => {
            console.log(req.body);
            const result = await orderCollection.insertOne(req.body);
            res.send(result);
          });

        //Get register order
        app.get('/order', async(req, res) => {
            const result = await orderCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        })

        //Delete tour section
        app.delete('/details/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await detailsCollection.deleteOne(query);
            res.json(result);
        })


        //Delete Reg
        app.delete('/order/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

        //My order
        app.get('/order/:email', async(req, res) => {
            
            const result = await orderCollection.find({email : req.params.email}).toArray();
            res.send(result);
            // console.log(req.params.email);

        })

           //Delete My order
           app.delete('/order/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })
         

        //Get single tour cart
        app.get('/details/:id', async(req, res) => {
            const id = req.params.id;
            console.log('hit the id', id);
            const query = {_id: ObjectId(id)};
            const detail = await detailsCollection.findOne(query);
            res.json(detail);
        })


        //Post Api Data
        app.post('/details', async(req, res) => {
            const detail = req.body;
            console.log('hit post api', detail);
            const result = await detailsCollection.insertOne(detail);
            console.log(result);
            res.json(result)
        })
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running server')
})

app.listen(port, () => {
    console.log("running server port", port);
})