/*
 * Casa Talavera cart practice project.
 * All products and prices below are sample data for the class project.
 * Confirm real product details and prices with the maker before publishing.
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

// This array is a temporary stand-in for a future catalog or database.
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

// This function formats numbers as US dollar amounts for terminal output.
function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// This async function imitates waiting for a catalog to arrive from a server.
async function loadCatalog(): Promise<Product[]> {
  console.log("Loading the sample catalog...");

  // The timeout makes the function asynchronous without requiring a real API.
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 500);
  });

  // Return a copy so callers cannot directly change the original sample array.
  return [...sampleCatalog];
}

// This class groups cart data and the actions that can change or read that data.
class ShoppingCart {
  // Private means only methods inside this class can directly change the lines.
  private lines: CartLine[] = [];

  // Add one unit of a catalog product, or increase its existing quantity.
  addProduct(productId: string, catalog: Product[]): void {
    const product = catalog.find((item) => item.id === productId);

    // Throwing an error prevents a misspelled ID from silently adding nothing.
    if (!product) {
      throw new Error(`Product ID "${productId}" was not found.`);
    }

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
    const originalCount = this.lines.length;
    this.lines = this.lines.filter((line) => line.product.id !== productId);

    // If the count did not change, the requested product was not in the cart.
    if (this.lines.length === originalCount) {
      throw new Error(`Product ID "${productId}" is not in the cart.`);
    }
  }

  // Return a copy so display code can read cart lines without editing them.
  getLines(): CartLine[] {
    return this.lines.map((line) => ({ ...line }));
  }

  // Add each line's price times quantity to produce the pre-discount subtotal.
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

  // One fixed code keeps the challenge easy to understand and demonstrate.
  if (normalizedCode !== "TALAVERA10") {
    throw new Error("That promo code is not valid.");
  }

  // Ten percent is represented as 0.10; only the discount amount is returned.
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

// This main function connects the demo steps in the order a shopper might use.
async function main(): Promise<void> {
  const catalog = await loadCatalog();
  console.log(`Catalog loaded with ${catalog.length} sample products.`);

  const cart = new ShoppingCart();
  cart.addProduct("salt-lake-plate", catalog);
  cart.addProduct("blue-floral-mug", catalog);
  cart.addProduct("blue-floral-mug", catalog);
  displayCart(cart);

  // Try an invalid code first so the exception and catch are visible in the demo.
  try {
    calculateDiscount(cart.getSubtotal(), "NOT-A-REAL-CODE");
  } catch (error) {
    if (error instanceof Error) {
      console.log(`\nDiscount message: ${error.message}`);
    }
  }

  // Then apply the one valid example code and show the adjusted total.
  const discount = calculateDiscount(cart.getSubtotal(), "TALAVERA10");
  const finalTotal = cart.getSubtotal() - discount;
  console.log(`Valid discount: -${formatMoney(discount)}`);
  console.log(`Total after discount: ${formatMoney(finalTotal)}`);

  // Remove one whole line to demonstrate another cart operation.
  cart.removeProduct("blue-floral-mug");
  console.log("\nAfter removing the mugs:");
  displayCart(cart);
}

// Catch unexpected failures from the async main function so they are visible.
main().catch((error: unknown) => {
  console.error("The cart demo could not finish:", error);
});
