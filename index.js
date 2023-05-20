const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


//middlewares
// const corsConfig = {
//     origin: '',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
// }
// app.use(cors(corsConfig))
// app.options("", cors(corsConfig))
app.use(cors());
app.use(express.json());



//Mongodb setup
const uri = `mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PASS}@cluster0.nkuq19p.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const toyCollection = client.db('toyShop').collection('toys');

    app.post('/postToy', async (req, res) => {
      const body = req.body;
      const result = await toyCollection.insertOne(body);
      res.send(result);
    })

    app.get('/toys', async (req, res) => {
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/toy/:text", async (req, res) => {
      const text = req.params?.text
      const result = await toyCollection.find({
        category: req.params?.text
      }).toArray();
      return res.send(result);
    });


   

    //get single data from database
    app.get("/toys/:id", async (req, res) => {
      console.log(req.params.id);
      const toy = await toyCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(toy);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





//Basic setups
app.get('/', (req, res) => {
  res.send('toy shop server is running')
})

app.listen(port, () => {
  console.log(`Toy shop server is running on port:${port}`)
})
