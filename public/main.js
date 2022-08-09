//const socket = io.connect("http://localhost:8082");
const socket = io.connect();

socket.on("products", (data) => {
    render(data)
})

function sendProduct() {
    const product = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value
    }

    socket.emit("new-product", product);
    console.log("ejecutando new product main.js")
}

function render(data) {
    let html = data
        .map((elem, index) => {
            return `<tr>
                  <td>${elem.name}</td>
                  <td>${elem.price}</td>
                  <td><img src="${elem.thumbnail}" alt='Imagen de '></td>
              </tr>`;
        })
        .join(" ");
        
    if (!data || !data.length) {
        html = `<tr>
            <td colspan="3">No hay productos</td>
        </tr>`
    }

    document.getElementById("product-list").innerHTML = html;
}

socket.on("messages", function (data) {
    renderMessage(data);
})

function renderMessage(data) {
    const html = data
        .map((elem, index) => {
            return `<div>
            <strong>${elem.author}</strong> <span style="color:red;">[${elem.date}]</span>:
            <em>${elem.text}</em> </div>`;
        })
        .join(" ");
    document.getElementById("messages").innerHTML = html;
}



function addMessage(e) {
    const mensaje = {
      author: document.getElementById("username").value,
      text: document.getElementById("texto").value,
      date: new Date().toLocaleString(),
    };
    
    socket.emit("new-message", mensaje);
    return false;
  }