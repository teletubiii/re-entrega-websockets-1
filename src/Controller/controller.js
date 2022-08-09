const products = require("../Products/products");
class Actions {
  static getAll(){
    return products.listOfProducts();
  }
  static getOne(id){
    return products.getProduct(id);
  }
  static add(product){
    return products.addProduct(product);
  }
  static update(id, newContent){
    return products.updateProduct(id, newContent);
  }
  static delete(id){
    return products.deleteProduct(id);
  }
}

module.exports = Actions;

