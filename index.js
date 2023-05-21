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

//middlewares
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



    //Indexing
    // const indexKeys = { Product_name: 1 };
    // const indexOption = { name: "product" };

    // const result = await toyCollection.createIndex(indexKeys, indexOption);


    //get data by search
    // app.get("/searchByName/:text", async (req, res) => {
    //   const searchText = req.params?.text;
    //   const result = await toyCollection.find({
    //     name: { $regex:text }
    //   }).toArray();
    //   res.send(result);

    // })



    //post or create api
    app.post('/postToy', async (req, res) => {
      const body = req.body;
      const result = await toyCollection.insertOne(body);
      res.send(result);
    })


    //get 20(limit) data  
    app.get('/toys', async (req, res) => {
      const cursor = toyCollection.find().limit(20); // Add limit(20) to the cursor
      const result = await cursor.toArray();
      res.send(result);
    });


    // Udate data 
    app.get('/updateToy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(query);
      res.send(result);
    })
    

    app.put('/updateToy/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedToy = req.body;

      const toy = {
          $set: {
            Product_price: updatedToy.Product_price, 
            Product_quantity: updatedToy.Product_quantity, 
            Descriptions: updatedToy.Descriptions, 
             
          }
      }

      const result = await toyCollection.updateOne(filter, toy, options);
      res.send(result);
  })


    //get data by category
    app.get("/toy/:text", async (req, res) => {
      const text = req.params?.text
      const result = await toyCollection.find({
        category: req.params?.text
      }).toArray();
      return res.send(result);
    });


    //get data with Email
    app.get("/myToys/:email", async (req, res) => {

      const result = await toyCollection.find({ SellerEmail: req.params.email }).toArray();
      res.send(result);
    })



    //get single data using id
    app.get("/toys/:id", async (req, res) => {
      console.log(req.params.id);
      const toy = await toyCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(toy);
    });


    // delete data from database with api 
    app.delete('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const result = await toyCollection.deleteOne(query);
      res.send(result);
    })


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
