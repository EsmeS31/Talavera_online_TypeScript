/*
 * Casa Talavera cart practice project.
 * Products and prices are sample data used to keep this demo self-contained.
 * Nothing is saved or purchased; confirm real details before using a real catalog.
 */

// Only these two categories are allowed in this demo.
type ProductCategory = "plates" | "mugs";

// The interface keeps product objects consistent.
interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
}

// A cart line stores one product and the number of units selected.
interface CartLine {
  product: Product;
  quantity: number;
}

// Sample data keeps this demo simple; a later version could load it from a database.
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

// Use the built-in formatter; en-US and USD match this demo's example prices.
function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// This simulates waiting for a server; the delay does not make a real request.
async function loadCatalog(): Promise<Product[]> {
  console.log("Loading the sample catalog...");

  // The Promise resolves after 500 ms. Unlike a real request, this cannot fail.
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 500);
  });

  // Copy the list; product objects are still shared, but this demo never edits them.
  return [...sampleCatalog];
}

class ShoppingCart {
  // Keep cart lines private; they are only in memory and reset when the program ends.
  private lines: CartLine[] = [];

  addProduct(productId: string, catalog: Product[]): void {
    // find returns undefined if the ID is not in the catalog.
    const product = catalog.find((item) => item.id === productId);

    // Fail clearly instead of silently ignoring a misspelled or unknown ID.
    if (!product) {
      throw new Error(`Product ID "${productId}" was not found.`);
    }

    // Reuse one line per product, increasing its quantity instead of duplicating it.
    const existingLine = this.lines.find(
      (line) => line.product.id === productId,
    );

    if (existingLine) {
      existingLine.quantity += 1;
    } else {
      this.lines.push({ product, quantity: 1 });
    }
  }

  // This removes the whole line, not just one unit.
  removeProduct(productId: string): void {
    const originalCount = this.lines.length;
    // filter creates a new list without the product; it removes all its units.
    this.lines = this.lines.filter((line) => line.product.id !== productId);

    // An unchanged count means the product was not in the cart.
    if (this.lines.length === originalCount) {
      throw new Error(`Product ID "${productId}" is not in the cart.`);
    }
  }

  // Return new line objects so display code cannot change the cart's quantities.
  getLines(): CartLine[] {
    return this.lines.map((line) => ({ ...line }));
  }

  // reduce adds price times quantity; zero is the subtotal for an empty cart.
  // Real payment code should handle rounding, often by storing prices in cents.
  getSubtotal(): number {
    return this.lines.reduce(
      (total, line) => total + line.product.price * line.quantity,
      0,
    );
  }
}

function calculateDiscount(subtotal: number, promoCode: string): number {
  const normalizedCode = promoCode.trim().toUpperCase();

  // One hard-coded code keeps the example simple; real discounts need server checks.
  if (normalizedCode !== "TALAVERA10") {
    throw new Error("That promo code is not valid.");
  }

  // Return the discount amount separately; tax, shipping, and code expiry are not handled.
  return subtotal * 0.10;
}

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

// This runs a fixed demo; it does not ask for keyboard input.
async function main(): Promise<void> {
  const catalog = await loadCatalog();
  console.log(`Catalog loaded with ${catalog.length} sample products.`);

  const cart = new ShoppingCart();
  cart.addProduct("salt-lake-plate", catalog);
  cart.addProduct("blue-floral-mug", catalog);
  cart.addProduct("blue-floral-mug", catalog);
  displayCart(cart);

  // The invalid code demonstrates error handling; catch lets the demo continue.
  console.log("\nError-handling example: trying an invalid code...");
  try {
    calculateDiscount(cart.getSubtotal(), "NOT-A-REAL-CODE");
  } catch (error) {
    if (error instanceof Error) {
      console.log(`The expected error was caught: ${error.message}`);
    }
  }

  console.log("\nSuccessful discount example: applying TALAVERA10...");
  const discount = calculateDiscount(cart.getSubtotal(), "TALAVERA10");
  const finalTotal = cart.getSubtotal() - discount;
  console.log(`Discount: -${formatMoney(discount)}`);
  console.log(`Total after discount: ${formatMoney(finalTotal)}`);

  cart.removeProduct("blue-floral-mug");
  console.log("\nAfter removing the mugs:");
  displayCart(cart);
}

// Show unexpected errors from main instead of letting them disappear.
main().catch((error: unknown) => {
  console.error("The cart demo could not finish:", error);
});
