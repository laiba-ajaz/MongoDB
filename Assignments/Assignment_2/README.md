# MongoDB Assignment 02 — Logic Building with Aggregation

Four classic programming problems (Even/Odd, Leap Year, Marksheet, Inventory) solved **only with MongoDB**, using aggregation pipelines and CRUD commands in a VS Code Playground file (`assignment02.mongodb.js`). No application code is used. All calculations, filters, grouping and reports run inside the database.



## Table of Contents

1. [Overview](#overview)
2. [Database and Collections](#database-and-collections)
3. [Task 1 — Even / Odd](#task-1--even--odd)
4. [Task 2 — Leap Year](#task-2--leap-year)
5. [Task 3 — Marksheet](#task-3--marksheet)
6. [Task 4 — Inventory](#task-4--inventory)
7. [Operators and Commands Used](#operators-and-commands-used)

---

## Overview

| Task | Topic | Collection | Main skills |
|---|---|---|---|
| 1 | Even / Odd numbers | `numbers` | `$mod`, `$match`, `$group`, `$cond` |
| 2 | Leap year detection | `years` | `$or`, `$and`, `$ne`, `$min`, `$max`, `$cond` |
| 3 | Student marksheet | `marksheet` | `$add`, `$divide`, `$round`, `$switch`, `$skip`, `$limit` |
| 4 | Inventory system | `inventory` | `insertOne`, `updateOne`, `updateMany`, `upsert`, `deleteOne`, `$expr`, reports |

## Database and Collections

Database: `assignment02`

| Collection | Documents | Fields |
|---|---|---|
| `numbers` | 12 | `number` |
| `years` | 12 | `year` |
| `marksheet` | 10 | `rollNo`, `name`, `course`, `accounting`, `statistics`, `banking`, `management`, `auditing`, `businessLaw`, `economics` |
| `inventory` | 12 (13 after the operations) | `itemCode`, `itemName`, `category`, `quantity`, `unitPrice`, `reorderLevel`, `supplier` |

## Task 1 — Even / Odd

**Sample data:** `21956, 165, 2006, 859, 101, 0, -20, -7, 20, 39, 11, 50` (includes zero, a negative even, a negative odd and a 5-digit number).

| Part | What it does | Approach |
|---|---|---|
| A | Shows each number with its remainder after dividing by 2 | `$set` + `$mod`, `$project` |
| B | Even numbers, smallest to largest | `$match` remainder `0`, `$sort` ascending |
| C | Odd numbers, largest to smallest | `$match` with `$or` (remainder `1` or `-1`), `$sort` descending |
| D | Count of even and odd numbers | `$cond` creates a `type` field, then `$group` with `$sum` |
| E | Three largest even numbers | `$match`, `$sort` descending, `$limit: 3` |
| Challenge | Label each number `"Even"` or `"Odd"` | `$cond` inside `$set` |

**Think about this:** `$mod` gives the remainder the same sign as the number, so `-7 % 2` is `-1`. Part C therefore matches `1` or `-1`, and Part D treats every remainder that is not `0` as odd.

---

## Task 2 — Leap Year

**Sample data:** `2024, 2023, 1900, 2000, 2100, 2400, 2016, 2019, 2028, 2021, 1800, 1600`

Rule used:

```
(year % 400 == 0)  OR  (year % 4 == 0 AND year % 100 != 0)
```

| Part | What it does | Approach |
|---|---|---|
| A | Shows each year with its remainders by 4, 100 and 400 | three `$set` fields with `$mod` |
| B | Leap years only | `$match` with `$or` + `$and` + `$ne` |
| C | Non-leap years only | `$match` with `$or` + `$and` + `$ne` (opposite rule) |
| D | Count of leap and non-leap years | `$cond` creates `type`, then `$group` with `$sum` |
| E | Oldest and latest leap year | `$match` leap years, `$group` with `$min` and `$max` |
| Challenge | Days in each year (366 or 365) | `$cond` inside `$set` |

**Think about this:** `$or` means "this or that" (divisible by 400, or the second case). `$and` means "this and that" (divisible by 4 and not by 100). Using `$and` inside `$or` in one `$match` follows the rule exactly.

---

## Task 3 — Marksheet

**Data:** 10 students in 3 courses (ADSE, BBA, BS Accounting), 7 subjects each out of 100 (total 700). The data includes a very high scorer (Ayesha), students who failed a subject (Zain, Hira, Usman), a tie (Ali and Maham, both 550) and a student with low marks in every subject (Usman).

| Part | What it does | Approach |
|---|---|---|
| A | Total marks and percentage (2 decimals) | `$add`, `$divide`, `$multiply`, `$round` |
| B | Position list, highest total first | `$sort` descending |
| C | Top 3 students | `$sort` + `$limit: 3` |
| D | Failed in at least one subject (below 40) | `$match` with `$or` and `$lt` |
| E | Passed all subjects and 50% or more | `$match` with `$and` and `$gte` |
| F | Class summary: students, average, highest, lowest total | `$group` with `_id: null`, `$sum`, `$avg`, `$max`, `$min` |
| G | Course-wise summary, sorted by average percentage | `$group` by `$course`, `$sort` |
| H | Page 2 of the position list, 4 per page | `$sort` + `$skip: 4` + `$limit: 4` |
| Challenge | Grade for every student | `$switch` with branches and a `default` |

**Think about this:** In Part D one failed subject is enough, so conditions are joined with `$or` and `$lt`. In Part E every subject must be passed, so conditions are joined with `$and` and `$gte`.

**Grading scale (challenge)**

| Percentage | Grade |
|---|---|
| 80 and above | A-1 |
| 70 – 79.99 | A |
| 60 – 69.99 | B |
| 50 – 59.99 | C |
| 40 – 49.99 | D |
| Below 40 | F |

---

## Task 4 — Inventory

**Data:** 12 items in 5 categories (Accessories, Furniture, Electronics, Stationery, Presentation). It includes two out-of-stock items (USB Cable, Office Desk), items at or below their reorder level, a single-item category (Presentation) and prices from 30 to 180000.

### Part 1 — Operations

| # | Operation | Command | Description |
|---|---|---|---|
| 1 | Add a new item | `insertOne()` | Adds `ITM-013` Webcam |
| 2 | Record a sale | `updateOne()` + `$inc: -3` | Customer buys 3 units of `ITM-001` |
| 3 | Restock | `updateOne()` + `$inc: 50` | Adds 50 units to low-stock `ITM-008` (Laser Printer) |
| 4 | Price increase | `updateMany()` + `$mul: 1.05` | Raises all Stationery prices by 5% |
| 5a | Upsert, existing code | `updateOne()` + `upsert: true` | Updates `ITM-012`, no duplicate is created |
| 5b | Upsert, new code | `updateOne()` + `upsert: true` | Inserts `ITM-014` (USB Hub) because it does not exist |
| 6 | Remove an item | `deleteOne()` | Deletes the discontinued item `ITM-014` |

### Part 2 — Reports

| Report | Description | Key stages |
|---|---|---|
| A | Stock value per item (quantity × unit price) | `$set`, `$multiply`, `$project` |
| B | Total value of the whole inventory | `$group`, `$sum` with `$multiply` |
| C | Category-wise summary: items, quantity, average / highest / lowest price, stock value | `$group`, `$sum`, `$avg`, `$max`, `$min`, `$sort` |
| D | Reorder list with a `shortage` field | `$set`, `$subtract`, `$match` with `$expr` + `$lte` |
| E | Out-of-stock items | `$match`, `$project` |
| F | Five most valuable items | `$sort`, `$project`, `$limit: 5` |
| G | Discount preview, 10% off rounded to 0 decimals | `$set`, `$subtract`, `$divide`, `$round` |
| H | Page 2, 5 items per page, sorted by name | `$sort`, `$skip: 5`, `$limit: 5` |
| Challenge | Category with the highest total stock value | `$group`, `$sort`, `$limit: 1` |

**Report G — does the discount change the stored prices?** No. `aggregate()` only transforms the output, so the stored documents are untouched. Running `db.inventory.find()` afterwards still shows the original `unitPrice` values and no `discountedPrice` field.

**Think about this — Part 1 (4) vs Report G**

| Point | Price increase (Part 1, step 4) | Discount preview (Report G) |
|---|---|---|
| Command | `updateMany()` with `$mul` | `aggregate()` with `$set` |
| Effect on stored data | Permanent change | No change, temporary output only |
| Use it when | The price really has to change | A report or preview is needed |

---

## Operators and Commands Used

| Category | Operators / commands |
|---|---|
| Pipeline stages | `$set`, `$project`, `$match`, `$sort`, `$group`, `$limit`, `$skip` |
| Arithmetic | `$mod`, `$add`, `$subtract`, `$multiply`, `$divide`, `$round` |
| Comparison | `$eq`, `$ne`, `$gte`, `$lt`, `$lte` |
| Logical | `$or`, `$and` |
| Conditional | `$cond`, `$switch` |
| Accumulators | `$sum`, `$avg`, `$max`, `$min` |
| Other | `$expr` |
| CRUD | `createCollection`, `insertMany`, `insertOne`, `updateOne`, `updateMany`, `deleteOne`, `find`, `aggregate` |
| Update operators | `$inc`, `$mul`, `$set`, `upsert` |