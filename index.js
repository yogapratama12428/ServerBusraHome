// install express with `npm install express`
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

// middleware
app.use(cors());
app.use(express.json());

//Route
app.get('/', async (req, res) => {
  res.send('Hello this Server of IoT Busra !');
});

app.get('/mongo', (req, res) => {
  res.json({ status: mongoose.connection.readyState });
});

//route for created
app.post('/device', async (req, res) => {
  const { device, state } = req.body;

  try {
    const result = await Device.create({
      device: device,
      state: state,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
});

//route for get data
app.get('/device', async (req, res) => {
  try {
    const result = await Device.find({});
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
});

//route Update Data ById
app.post('/device/:id/update', async (req, res) => {
  const id = req.params.id;
  const { state } = req.body;

  try {
    const result = await Device.findByIdAndUpdate(
      { _id: id },
      { $set: { state: state } },
      { new: true }
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
});

//Route Delete Data ById
app.delete('/device/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Device.findByIdAndDelete({ _id: id });
    const data = 'data _id:' + result + 'berhasil dihapus...';
    res.status(201).json({ msg: 'data berhasil dihapus' });
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
});

// Description url for mongoose
const MONGO_URL =
  'mongodb+srv://rootdb:9EjUTxstmEPda4he@cluster0.ztzzoe6.mongodb.net/IoTku?retryWrites=true&w=majority';

async function main() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log({ msg: 'Connected' });
  } catch (error) {
    console.log({ msg: error });
  }
}

main();

// Connection URL mongoose
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const deviceSchema = new Schema({
  key: ObjectId,
  device: String,
  state: Boolean,
});

const Device = mongoose.model('Device', deviceSchema);
// export 'app'
module.exports = app;
