import { Product } from "./entity/Product"
import { AppDataSource } from "./data-source"

AppDataSource.initialize().then(async () => {

    const product = new Product()
    product.name = "abc";
    product.price = 100;

    await AppDataSource.manager.save(product)

    console.log("Saved a new user with id: " + product.id)

}).catch(error => console.log(error))

