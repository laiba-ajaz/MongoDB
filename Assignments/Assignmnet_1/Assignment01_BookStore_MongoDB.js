/* ================================================================
   ASSIGNMENT 01 — MongoDB CRUD & Operators (Bookstore Database)
   Based on: Lecture 01 (CRUD Basics) + Lecture 02 (Query & Update Operators)
   Database used: BookStore
   Collections: books, customers, orders
   ================================================================ */


/* ================================================================
   SETUP
   ================================================================ */

use BookStore
// Output: switched to db BookStore

db.createCollection("books")
// Output: { ok: 1 }

db.createCollection("customers")
// Output: { ok: 1 }

db.createCollection("orders")
// Output: { ok: 1 }


/* ---------------- Seed: books collection (6 books) ---------------- */
db.books.insertMany([
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    price: 2500,
    stock: 10,
    tags: ["habits", "motivation", "bestseller", "paperback"], // >3 tags
    rating: 4.8
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    genre: "Finance",
    price: 3200,
    stock: 7,
    tags: ["finance", "money"],
    rating: 4.6
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Programming",
    price: 4500,
    stock: 5,
    tags: ["programming", "software", "coding"],
    rating: 4.5
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    price: "1800",     // stored as string on purpose (used later for $type task)
    stock: 0,           // stock: 0 requirement satisfied
    tags: ["fiction", "classic"],
    rating: 4.2
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    genre: "Finance",  // shares genre with "The Psychology of Money"
    price: 2800,
    stock: 12,
    tags: ["finance", "money", "investment", "bestseller"], // >3 tags
    rating: 4.1
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    genre: "History",
    price: "3800",     // stored as string on purpose
    stock: 4,
    tags: ["science", "history"],
    rating: 2.8
  }
])
/* Output:
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6aad0d5f869fc743f3181f98'),
    '1': ObjectId('6aad0d5f869fc743f3181f99'),
    '2': ObjectId('6aad0d5f869fc743f3181f9a'),
    '3': ObjectId('6aad0d5f869fc743f3181f9b'),
    '4': ObjectId('6aad0d5f869fc743f3181f9c'),
    '5': ObjectId('6aad0d5f869fc743f3181f9d')
  }
}
*/


/* ---------------- Seed: customers collection (4 customers) ---------------- */
db.customers.insertMany([
  { name: "Ali Khan",     email: "ali@example.com",    city: "Karachi",   membership: "Regular" },
  { name: "Sara Ahmed",   email: "sara@example.com",   city: "Lahore",    membership: "Regular" },
  { name: "Hassan Raza",  email: "hassan@example.com", city: "Karachi",   membership: "Premium" },
  { name: "Ayesha Malik", email: "ayesha@example.com", city: "Islamabad", membership: "Regular" }
])
/* Output:
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6aad0d96869fc743f3181f9e'),
    '1': ObjectId('6aad0d96869fc743f3181f9f'),
    '2': ObjectId('6aad0d96869fc743f3181fa0'),
    '3': ObjectId('6aad0d96869fc743f3181fa1')
  }
}
*/


/* ---------------- Seed: orders collection (5 orders) ---------------- */
db.orders.insertMany([
  {
    customerName: "Ali Khan",
    items: [
      { bookTitle: "Atomic Habits", quantity: 2, unitPrice: 2500 },
      { bookTitle: "The Psychology of Money", quantity: 3, unitPrice: 3200 }
    ],
    status: "Pending",
    orderDate: "2026-09-10"
  },
  {
    customerName: "Sara Ahmed",
    items: [
      { bookTitle: "The Alchemist", quantity: 1, unitPrice: 1800 },
      { bookTitle: "Rich Dad Poor Dad", quantity: 2, unitPrice: 2800 }
    ],
    status: "Shipped",
    orderDate: "2026-09-11"
  },
  {
    customerName: "Hassan Raza",
    items: [
      { bookTitle: "Clean Code", quantity: 4, unitPrice: 4500 }
    ],
    status: "Delivered",
    orderDate: "2026-09-12"
  },
  {
    customerName: "Ayesha Malik",
    items: [
      { bookTitle: "A Brief History of Time", quantity: 3, unitPrice: 3800 },
      { bookTitle: "The Alchemist", quantity: 1, unitPrice: 1800 }
    ],
    status: "Pending",
    orderDate: "2026-09-13"
  },
  {
    customerName: "Ali Khan",
    items: [
      { bookTitle: "Rich Dad Poor Dad", quantity: 5, unitPrice: 2800 }
    ],
    status: "Delivered",
    orderDate: "2026-09-14"
  }
])
/* Output:
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6aad0dc5869fc743f3181fa2'),
    '1': ObjectId('6aad0dc5869fc743f3181fa3'),
    '2': ObjectId('6aad0dc5869fc743f3181fa4'),
    '3': ObjectId('6aad0dc5869fc743f3181fa5'),
    '4': ObjectId('6aad0dc5869fc743f3181fa6')
  }
}
*/


/* ================================================================
   TASK A — Basic CRUD (Lecture 01)
   ================================================================ */

// 1. Insert one more book using insertOne()
db.books.insertOne({
  title: "The 7 Habits of Highly Effective People",
  author: "Stephen R. Covey",
  genre: "Self-Help",
  price: 2200,
  stock: 8,
  tags: ["productivity", "leadership", "personal-growth"],
  rating: 4.4
})
/* Output:
{ acknowledged: true, insertedId: ObjectId('6aad0e10869fc743f3181fa7') }
*/


// 2. Fetch all documents from books
db.books.find()
/* Output: returns all 7 book documents currently in the collection
   (Atomic Habits, The Psychology of Money, Clean Code, The Alchemist,
   Rich Dad Poor Dad, A Brief History of Time, The 7 Habits of Highly
   Effective People) */


// 3. Fetch only the books belonging to one specific genre
db.books.find({ genre: "Self-Help" })
/* Output:
[
  { title: 'Atomic Habits', price: 2500, stock: 10, rating: 4.8, ... },
  { title: 'The 7 Habits of Highly Effective People', price: 2200, stock: 8, rating: 4.4, ... }
]
*/


// 4. Update one customer's city using updateOne()
db.customers.updateOne({ name: "Sara Ahmed" }, { $set: { city: "Quetta" } })
/* Output:
{ acknowledged: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0 }
Sara Ahmed's city is now "Quetta" */


// 5. Delete any one order using deleteOne()
db.orders.deleteOne({ customerName: "Sara Ahmed" })
/* Output: { acknowledged: true, deletedCount: 1 } */


/* ================================================================
   TASK B — Comparison & Logical Operators (Lecture 02, Part 1 & 2)
   ================================================================ */

// 6. Books priced greater than a chosen value ($gt 2000)
db.books.find({ price: { $gt: 2000 } })
/* Output: Atomic Habits, The Psychology of Money, Clean Code,
   Rich Dad Poor Dad, The 7 Habits of Highly Effective People
   (Note: "The Alchemist" and "A Brief History of Time" store price
   as a STRING, so numeric $gt does not match them.) */


// 7. Books priced between two values ($gt + $lt combined)
db.books.find({ $and: [ { price: { $gt: 2000 } }, { price: { $lt: 3000 } } ] })
/* Output: Atomic Habits (2500), Rich Dad Poor Dad (2800),
   The 7 Habits of Highly Effective People (2200) */


// 8. Books that are either out of stock OR rated below 3 ($or)
db.books.find({ $or: [ { stock: 0 }, { rating: { $lte: 3 } } ] })
/* Output: The Alchemist (stock: 0), A Brief History of Time (rating: 2.8) */


// 9. Books that are neither in a specific genre nor above a specific price ($nor)
db.books.find({ $nor: [ { genre: "Finance" }, { price: { $gt: 2000 } } ] })
/* Output: The Alchemist, A Brief History of Time
   (their price is stored as string, so it never satisfies $gt:2000 numerically) */

db.books.find({ $nor: [ { genre: "Fiction" }, { price: { $gt: 2000 } } ] })
/* Output: A Brief History of Time only */


// 10. Customers whose membership is "Premium" AND city is a specific city ($and)
db.customers.find({ $and: [ { membership: "Premium" }, { city: "Karachi" } ] })
/* Output: Hassan Raza */


// 11. Books whose genre is $in a list of at least 2 genres
db.books.find({ genre: { $in: ["Finance", "Programming"] } })
/* Output: The Psychology of Money, Clean Code, Rich Dad Poor Dad */


// 12. Customers whose city is $nin a list of 2 cities
db.customers.find({ city: { $nin: ["Karachi", "Quetta"] } })
/* Output: Ayesha Malik (Islamabad)
   NOTE: $nin must be applied on a FIELD, not at the top level of the query.
   db.customers.find({ $nin: [...] }) --> MongoServerError: unknown top level operator: $nin */


/* ================================================================
   TASK C — Element, Type & Array Operators (Lecture 02, Part 2)
   ================================================================ */

// 13. Books where the tags field $exists
db.books.find({ tags: { $exists: true } })
/* Output: all 7 books (every document has a tags array) */


// 14. Books with exactly 2 tags ($size)
db.books.find({ tags: { $size: 2 } })
/* Output: The Psychology of Money, The Alchemist, A Brief History of Time */


// 15. Confirm price is stored as a numeric type ($type)
db.books.find({ price: { $type: 16 } })   // 16 = BSON "int" numeric type
/* Output: books with a NUMERIC price only — Atomic Habits, The Psychology
   of Money, Clean Code, Rich Dad Poor Dad, The 7 Habits of Highly Effective
   People. "The Alchemist" and "A Brief History of Time" are excluded
   because their price field was inserted as a STRING, not a number. */


// 16. Books whose tags array contains BOTH specific tags together ($all)
db.books.find({ tags: { $all: ["finance", "money"] } })
/* Output: The Psychology of Money, Rich Dad Poor Dad */


// 17. Order item where quantity > 2 AND unitPrice > 3000 on the SAME item ($elemMatch)
db.orders.find({ items: { $elemMatch: { quantity: { $gt: 2 }, unitPrice: { $gt: 3000 } } } })
/* Output: Ali Khan's order (Psychology of Money, qty 3 @ 3200),
   Hassan Raza's order (Clean Code, qty 4 @ 4500),
   Ayesha Malik's order (A Brief History of Time, qty 3 @ 3800) */


// 18. Books whose title starts with a specific letter ($regex)
db.books.find({ title: { $regex: "^T" } })
/* Output: The Psychology of Money, The Alchemist,
   The 7 Habits of Highly Effective People */


/* ================================================================
   TASK D — Update Operators (Lecture 02, Part 3)
   ================================================================ */

// 19. Increase price of one book by 10% using $mul
db.books.updateOne({ title: "The Alchemist" }, { $mul: { price: 1.10 } })
/* Output (fails — price is a string, not a number):
MongoServerError: Plan executor error during update ::
Cannot apply $mul to a value of non-numeric type.
{_id: ObjectId('6aad0d5f869fc743f3181f9b')} has field 'price' of non-numeric type string
*/

db.books.updateOne({ title: "The Psychology of Money" }, { $mul: { price: 1.10 } })
/* Output:
{ acknowledged: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0 }
New price: 3520.0000000000005 */


// 20. Use $inc to reduce a book's stock by 1 (simulate a sale)
db.books.updateOne({ title: "Atomic Habits" }, { $inc: { stock: -1 } })
/* Output: matchedCount: 1, modifiedCount: 1
   New stock: 9 (was 10) */


// 21. Use $max to only raise rating if new value is actually higher
db.books.updateOne({ title: "A Brief History of Time" }, { $max: { rating: 2.3 } })
/* Output: matchedCount: 1, modifiedCount: 0  (2.3 < current 2.8, so no change) */

db.books.updateOne({ title: "A Brief History of Time" }, { $max: { rating: 3.6 } })
/* Output: matchedCount: 1, modifiedCount: 1  (3.6 > 2.8, rating updated to 3.6) */


// 22. Rename a field in one customers document ($rename)
db.customers.updateOne({ name: "Sara Ahmed" }, { $rename: { "membership": "tier" } })
/* Output: matchedCount: 1, modifiedCount: 1
   Sara Ahmed's document now has 'tier: "Regular"' instead of 'membership' */


// 23. Update a nested field using positional dot notation
db.orders.updateOne({ customerName: "Ali Khan" }, { $set: { "items.0.quantity": 5 } })
/* Output: matchedCount: 1, modifiedCount: 1
   First item's quantity in Ali Khan's first order updated from 2 to 5 */


// 24. upsert: true — insert a brand-new customer if no match is found
db.customers.updateOne(
  { name: "Saad" },
  { $set: { name: "Saad", email: "saad@gmail.com", city: "Lahore", membership: "Regular" } }
)
/* Output (no match, no upsert flag): matchedCount: 0, modifiedCount: 0, upsertedCount: 0 */

db.customers.updateOne(
  { name: "Saad" },
  { $set: { name: "Saad", email: "saad@gmail.com", city: "Lahore", membership: "Regular" } },
  { upsert: true }
)
/* Output:
{ acknowledged: true, insertedId: ObjectId('6aad2582cd72a71bd9608ea5'),
  matchedCount: 0, modifiedCount: 0, upsertedCount: 1 }
New customer "Saad" was created */


// 25. Add a new tag with $push, then try $addToSet with the same tag
db.books.updateOne({ title: "A Brief History of Time" }, { $push: { tags: "Physics" } })
/* Output: modifiedCount: 1
   tags: ["science", "history", "Physics"] */

db.books.updateOne({ title: "A Brief History of Time" }, { $addToSet: { tags: "Physics" } })
/* Output: modifiedCount: 0
   ("Physics" already exists in the array — $addToSet does not add a duplicate) */


// 26. Remove one tag from a book ($pull)
db.books.updateOne({ title: "A Brief History of Time" }, { $pull: { tags: "Physics" } })
/* Output: modifiedCount: 1
   tags: ["science", "history"] */


// 27. Remove two tags from a book at once ($pullAll)
db.books.updateOne({ title: "A Brief History of Time" }, { $pullAll: { tags: ["science", "history"] } })
/* Output: modifiedCount: 1
   tags: [] (now empty) */


// 28. Remove the last tag from a book's array ($pop)
db.books.updateOne({ title: "Rich Dad Poor Dad" }, { $pop: { tags: 1 } })
/* Output: modifiedCount: 1
   tags: ["finance", "money", "investment"]  ("bestseller" removed from the end) */


/* ================================================================
   TASK E — Bonus
   ================================================================ */

// 29. updateMany() — apply a $mul price increase to every book in one genre
db.books.updateMany({ genre: "Self-Help" }, { $mul: { price: 1.05 } })
/* Output: matchedCount: 2, modifiedCount: 2
   Atomic Habits price: 2625 (was 2500)
   The 7 Habits of Highly Effective People price: 2310 (was 2200) */


// 30. Combined query across 3+ operators / two collections
// Realistic question: "Find all Premium customers in Karachi, then check
// which of them have a Delivered order containing an item with quantity > 2."

// Step 1 — find Premium customers in Karachi ($and)
db.customers.find({ $and: [ { city: "Karachi" }, { membership: "Premium" } ] })
/* Output: Hassan Raza */

// Step 2 — using that customer's name, check their Delivered orders
// where at least one item has quantity > 2 ($and + $elemMatch + $gt)
db.orders.find({
  $and: [
    { customerName: "Hassan Raza" },
    { status: "Delivered" },
    { items: { $elemMatch: { quantity: { $gt: 2 } } } }
  ]
})
/* Output:
[
  {
    customerName: 'Hassan Raza',
    items: [ { bookTitle: 'Clean Code', quantity: 4, unitPrice: 4500 } ],
    status: 'Delivered',
    orderDate: '2026-09-12'
  }
]
Logic: Hassan Raza is the only Premium customer in Karachi (Step 1).
Cross-checking his orders shows a Delivered order with an item quantity
of 4 (> 2), confirming he qualifies for both conditions across the two
collections. */


// ---------------- END OF SESSION ----------------
exit
