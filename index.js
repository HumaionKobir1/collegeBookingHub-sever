const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4hywmoi.mongodb.net/?retryWrites=true&w=majority`;
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
    await client.connect();


    const collageCollection = client.db('collageData').collection('collage');
    const usersCollection = client.db('collageData').collection('users');

    // save user email and role in DB
      app.put('/users/:email', async(req, res) => {
        const email = req.params.email
        const user = req.body
        const query = { email: email}
        const options = {upsert: true}
        const updateDoc = {
          $set: user
        }

        const result = await usersCollection.updateOne(query, updateDoc, options)
        console.log(result)
        res.send(result)
      })

      // get user
      app.get('/users/:email', async (req, res) => {
        const email = req.params.email
        const query = {email: email}
        const result = await usersCollection.findOne(query)
        console.log(result)
        res.send(result)
      })


    // get all collage
    app.get('/allCollage', async(req, res) => {
        const result = await collageCollection.find().toArray();
        res.send(result)
    })

    // get single collage
    app.get('/collage/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await collageCollection.findOne(query);
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





app.get('/', (req, res) => {
    res.send('Server is running.........')
})

app.listen(port, ()=> {
    console.log(`CollageBookingHub Server is running ..... : ${port}`)
})