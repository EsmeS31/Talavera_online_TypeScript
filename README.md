# Overview

Casa Talavera Cart is a small TypeScript terminal program that models a ceramic shop catalog and shopping cart. It displays sample plate and mug products, adds products to a cart, calculates a subtotal, applies a sample discount code, and removes a product from the cart.

I wrote this software to practice using TypeScript to organize data and describe how that data can be used. The project helps me grow in my carrer by applying typed objects, functions, classes, arrays, asynchronous code, and exception handling to a familiar storefront idea.

The program demonstrates TypeScript syntax through a `Product` interface, a `ProductCategory` union type, a `ShoppingCart` class, and functions for loading a sample catalog, formatting prices, displaying cart contents, and calculating discounts. The catalog loader uses a short delay to demonstrate `async` and `await`. An invalid promo code throws an error that the program catches and displays.

All product details and prices in this demo are sample data and should be confirmed with the maker before being used in a real catalog. This is a terminal demonstration: it does not take orders, process payments, or connect the cart to the website yet.

Add the public link to your recorded 4–5 minute demonstration below:

[Software Demo Video](https://youtu.be/72uWAhyYm9M)

# Development Environment

I used Visual Studio Code, Node.js, npm, and the TypeScript compiler (`tsc`). The TypeScript source is `cart.ts`. The compiler reads `tsconfig.json` and writes JavaScript into the generated `dist` folder. Node.js runs the compiled JavaScript.

To install the development dependency, compile the program, and run it:

```sh
npm install
npm run build
npm start
```

The program uses TypeScript and built-in JavaScript features. It does not use external runtime libraries or a web framework. `Intl.NumberFormat` formats prices as US dollars, and a Promise with `setTimeout` provides a short example of asynchronous work without requiring a server.

# Useful Websites

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript: TSConfig Reference](https://www.typescriptlang.org/tsconfig/)
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- [BYU-Idaho CSE 310 TypeScript module](https://byui-cse.github.io/cse310-course/modules/module_descriptions.html)

# Future Work

- Replace sample products and prices with details confirmed by the maker.
- Connect the TypeScript cart to the Casa Talavera webpage.
- Add quantity controls so a shopper can increase or decrease an item in the cart.
- Save cart contents between visits.
- Connect the catalog to a database in a later project sprint.
