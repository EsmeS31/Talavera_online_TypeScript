/*
 * Casa Talavera cart practice project.
 * Products and prices are sample data used to keep this demo self-contained.
 * Nothing is saved or purchased; confirm real details before using a real catalog.
 */

// This union type limits categories to the two kinds used in this small demo.
type ProductCategory = "plates" | "mugs";

// An interface describes the fields every product object must have.
interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
}

// CartLine keeps a product together with how many of it the shopper selected.
interface CartLine {
  product: Product;
  quantity: number;
}

// Keeping sample products in one array makes them easy to search by ID.
// A later version could load this data from a database instead.
const sampleCatalog: Product[] = [
  {
    id: "salt-lake-plate",
    name: "Salt Lake Utah Temple Plate",
    category: "plates",
    price: 98,
  },
  {
    id: "timpanogos-plate",
    name: "Mount Timpanogos Utah Temple Plate",
    category: "plates",
    price: 98,
  },
  {
    id: "blue-floral-mug",
    name: "Blue Floral Mug",
    category: "mugs",
    price: 30,
  },
  {
    id: "red-floral-mug",
    name: "Red Floral Mug",
    category: "mugs",
    price: 30,
  },
];

// Use the built-in formatter instead of manually adding a dollar sign/decimals.
// en-US and USD fit this demo; another market would need different settings.
function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// This async function imitates waiting for catalog data from a server.
// The delay is only a teaching example; it does not make a network request.
async function loadCatalog(): Promise<Product[]> {
  console.log("Loading the sample catalog...");

  // A Promise gives us something to await; setTimeout resolves it after 500 ms.
  // A real request could fail, but this simulated delay always succeeds.
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 500);
  });

  // Copy the array so callers cannot add/remove entries in the original list.
  // This is shallow: the product objects are shared, but this demo never edits them.
  return [...sampleCatalog];
}

// This class groups cart data and the actions that can change or read that data.
class ShoppingCart {
  // Keep lines private so cart methods control how product quantities change.
  // The cart is only in memory and will be empty when the program restarts.
  private lines: CartLine[] = [];

  // Add one unit of a catalog product, or increase its existing quantity.
  addProduct(productId: string, catalog: Product[]): void {
    // find returns the first matching product, or undefined if there is no match.
    const product = catalog.find((item) => item.id === productId);

    // Throwing an error prevents a misspelled ID from silently adding nothing.
    if (!product) {
      throw new Error(`Product ID "${productId}" was not found.`);
    }

    // Reuse one line per product instead of adding duplicate rows to the cart.
    const existingLine = this.lines.find(
      (line) => line.product.id === productId,
    );

    if (existingLine) {
      existingLine.quantity += 1;
    } else {
      this.lines.push({ product, quantity: 1 });
    }
  }

  // Remove the entire product line; this demo does not decrement by one.
  removeProduct(productId: string): void {
    // Save the old count so we can tell whether filter removed anything.
    const originalCount = this.lines.length;
    // filter creates a new array without the requested product; it removes all units.
    this.lines = this.lines.filter((line) => line.product.id !== productId);

    // If the count did not change, the requested product was not in the cart.
    if (this.lines.length === originalCount) {
      throw new Error(`Product ID "${productId}" is not in the cart.`);
    }
  }

  // Give display code new line objects so it cannot change this.lines by accident.
  // The copy is shallow; the nested product object is still shared and read-only here.
  getLines(): CartLine[] {
    return this.lines.map((line) => ({ ...line }));
  }

  // reduce carries a running total; zero makes an empty cart total zero.
  // Real payment code should handle currency rounding, often by storing cents.
  getSubtotal(): number {
    return this.lines.reduce(
      (total, line) => total + line.product.price * line.quantity,
      0,
    );
  }
}

// This function returns a discount amount; it does not change product prices.
function calculateDiscount(subtotal: number, promoCode: string): number {
  const normalizedCode = promoCode.trim().toUpperCase();

  // One hard-coded code keeps the example simple; it is not secure store logic.
  if (normalizedCode !== "TALAVERA10") {
    throw new Error("That promo code is not valid.");
  }

  // 0.10 means ten percent. Return only the discount so the caller can show both
  // the discount and final total separately. Tax, shipping, expiry, and code stacking
  // are outside this demo's scope.
  return subtotal * 0.10;
}

// Print a readable list by looping over the cart's array of lines.
function displayCart(cart: ShoppingCart): void {
  const lines = cart.getLines();

  console.log("\nYour cart:");

  if (lines.length === 0) {
    console.log("  (The cart is empty.)");
    return;
  }

  for (const line of lines) {
    const lineTotal = line.product.price * line.quantity;
    console.log(
      `  ${line.product.name} x ${line.quantity}: ${formatMoney(lineTotal)}`,
    );
  }

  console.log(`Subtotal: ${formatMoney(cart.getSubtotal())}`);
}

// This main function runs a fixed example; it does not ask the user for keyboard input.
async function main(): Promise<void> {
  const catalog = await loadCatalog();
  console.log(`Catalog loaded with ${catalog.length} sample products.`);

  const cart = new ShoppingCart();
  cart.addProduct("salt-lake-plate", catalog);
  cart.addProduct("blue-floral-mug", catalog);
  cart.addProduct("blue-floral-mug", catalog);
  displayCart(cart);

  // This invalid code is intentional: it demonstrates the exception-handling challenge.
  // catch handles the expected error so the program continues to the valid-code example.
  console.log("\nError-handling example: trying an invalid code...");
  try {
    calculateDiscount(cart.getSubtotal(), "NOT-A-REAL-CODE");
  } catch (error) {
    if (error instanceof Error) {
      console.log(`The expected error was caught: ${error.message}`);
    }
  }

  // This is a separate successful example after the handled invalid-code case.
  console.log("\nSuccessful discount example: applying TALAVERA10...");
  const discount = calculateDiscount(cart.getSubtotal(), "TALAVERA10");
  const finalTotal = cart.getSubtotal() - discount;
  console.log(`Discount: -${formatMoney(discount)}`);
  console.log(`Total after discount: ${formatMoney(finalTotal)}`);

  // Remove the full mug line (both mugs), showing this method does not decrement by one.
  cart.removeProduct("blue-floral-mug");
  console.log("\nAfter removing the mugs:");
  displayCart(cart);
}

// Catch unexpected failures from the async main function so they are visible.
main().catch((error: unknown) => {
  console.error("The cart demo could not finish:", error);
});
