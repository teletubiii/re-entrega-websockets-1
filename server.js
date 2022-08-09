const express = require('express')
const router = require('./src/Routes/routes.js')
const app = express()
const handlebars = require('express-handlebars')
const PORT = 8082
const products = require('./src/Products/products.js')
const fs = require('fs')
const moment = require('moment')
const messages = require('./public/messages.json')


const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const hola = "hola"
let datos = products.listOfProducts();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: "index",
    layoutsDir: __dirname + "/views",
    partialsDir: __dirname + "/views/partials"
  })
);

app.use(express.static('./public'))
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/productos', router)

app.get('/', (req, res) => {
  res.render('main')
})

// Server conectado exitosamente
const server = httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))
// Server con error
server.on("error", (err) => {
  console.log(`El servidor a tenido un error: ${err}`)
})

// const messages = [
//   { author: "Juan@gmail.com", text: "¡Hola! ¿Que tal?", date: "02/08/2022, 9:07:34 pm" },
//   { author: "Pedro@gmail.com", text: "¡Muy bien! ¿Y vos?", date: "02/08/2022, 10:07:34 pm" },
//   { author: "Ana@gmail.com", text: "¡Genial!", date: "02/08/2022, 11:07:34 pm" }
// ];


io.on('connection', socket => {
  //productos
  console.log('Un cliente se ha conectado');
  socket.emit('products', products.listOfProducts());
  socket.on('new-product', data => {
    console.log("se ha agregado un producto")
    products.addProduct(data)
    io.sockets.emit('products', products.listOfProducts());
  });

  //chat
  socket.emit('messages', messages);

  socket.on('new-message', data => {
    messages.push(data);
    addMessage(data);
    io.sockets.emit('messages', messages);
  });

});

const addMessage = (message) => {
  const msg = {
      author: message.author,
      text: message.text,
      date: message.date
  }
  save(msg)
}

function save(message) {
  try {
      if (fs.existsSync('./public/messages.json')) {
          const data = fs.readFileSync('./public/messages.json');
          const array = JSON.parse(data);
          message.date = moment().format('DD/MM/YYYY, h:mm:ss a');
          array.push(message);
          fs.writeFileSync('./public/messages.json', JSON.stringify(array, null, 2));
          console.log('Se ha guardado el mensaje con la fecha: ' + message.date);
      } else {
          message.date = moment().format('DD/MM/YYYY, h:mm:ss a');
          fs.writeFileSync('./public/messages.json', JSON.stringify([object]));
          console.log('Se ha guardado el objeto con la fecha: ' + message.date);
      }
  } catch (err) {
      throw new Error(err);
  }
}

