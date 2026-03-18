# MongoDB Search Indexes

## Table of Contents

1. [What Is a Search Index?](#1-what-is-a-search-index)
2. [Search Index vs Regular Index](#2-search-index-vs-regular-index)
3. [How Search Indexes Work Internally](#3-how-search-indexes-work-internally)
4. [When to Use a Search Index](#4-when-to-use-a-search-index)
5. [Requirements & Where They Live](#5-requirements--where-they-live)
6. [Creating a Search Index](#6-creating-a-search-index)
7. [Search Index Definition Options](#7-search-index-definition-options)
8. [Querying with $search](#8-querying-with-search)
9. [Common Search Operators](#9-common-search-operators)
10. [Scoring & Relevance](#10-scoring--relevance)
11. [Facets – Filters & Counts](#11-facets--filters--counts)
12. [Autocomplete](#12-autocomplete)
13. [Combining $search with Aggregation](#13-combining-search-with-aggregation)
14. [Managing Search Indexes in Mongoose](#14-managing-search-indexes-in-mongoose)
15. [Real-World Use Cases](#15-real-world-use-cases)
16. [Limitations & Gotchas](#16-limitations--gotchas)
17. [Quick Reference Cheatsheet](#17-quick-reference-cheatsheet)

---

## 1. What Is a Search Index?

A **Search Index** in MongoDB is a special index powered by **Apache Lucene** — the same engine behind Elasticsearch — built directly into **MongoDB Atlas**. It enables full-text search features that are completely impossible with regular indexes.

Think of it this way:

| Regular Query                                | Search Index Query                                                             |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| Find users whose `name` is exactly `"Alice"` | Find users whose `name` _contains_ `"alice"` in any order, with typo tolerance |
| Find products where `price > 100`            | Find products that _best match_ a natural-language description                 |
| Case-sensitive by default                    | Case-insensitive, language-aware by default                                    |

Search indexes are **not** stored in the MongoDB B-Tree (like regular indexes). They are stored in a **separate Lucene index** running alongside your Atlas cluster and kept in sync automatically.

---

## 2. Search Index vs Regular Index

This is the most important distinction to understand before using search indexes.

### Regular Index (B-Tree)

```js
// regular index on the name field
userSchema.index({ name: 1 });
```

- Stored as a **B-Tree** data structure inside MongoDB
- Optimised for **exact matches**, **range queries**, **sorting**
- Works with `find()`, `$eq`, `$gt`, `$lt`, `$in`, etc.
- Does NOT understand language, synonyms, relevance, or typos
- Available in all MongoDB deployments (local, self-hosted, Atlas)

```js
// what a regular index CAN do
User.find({ name: "Alice" }); // exact match
User.find({ age: { $gte: 18, $lte: 30 } }); // range
User.find({ status: { $in: ["active", "pending"] } });
```

### Search Index (Lucene)

```js
// search index is defined in Atlas UI or Atlas CLI — not in Mongoose schema
```

- Stored as a **Lucene inverted index** in a separate search layer
- Optimised for **full-text search**, **relevance ranking**, **fuzzy matching**, **autocomplete**, **faceted navigation**
- Works exclusively through the `$search` aggregation stage
- Understands language (stemming: "running" matches "run"), synonyms, stop words
- **Only available on MongoDB Atlas** (not local MongoDB)

```js
// what a search index CAN do
Model.aggregate([
  {
    $search: {
      index: "default",
      text: {
        query: "alic", // typo — still finds "Alice"
        path: "name",
        fuzzy: { maxEdits: 1 },
      },
    },
  },
]);
```

### Side-by-side comparison

| Feature                | Regular Index    | Search Index              |
| ---------------------- | ---------------- | ------------------------- |
| Exact match            | Yes              | Yes (via `equals`)        |
| Range query            | Yes              | Limited                   |
| Full-text search       | No               | Yes                       |
| Typo tolerance (fuzzy) | No               | Yes                       |
| Relevance scoring      | No               | Yes                       |
| Language-aware         | No               | Yes (40+ languages)       |
| Autocomplete           | No               | Yes                       |
| Synonyms               | No               | Yes                       |
| Facets / counts        | No               | Yes                       |
| Works offline/local    | Yes              | No (Atlas only)           |
| Used in `find()`       | Yes              | No                        |
| Used in `$search`      | No               | Yes                       |
| Sync with collection   | Sync (real-time) | Near real-time (~seconds) |

---

## 3. How Search Indexes Work Internally

### Inverted Index

Unlike a B-Tree which maps `value → document`, Lucene builds an **inverted index** that maps `word → [list of documents containing that word]`.

For example, given these documents:

```
doc1: { title: "MongoDB is great" }
doc2: { title: "MongoDB Search is powerful" }
doc3: { title: "Full text search with Atlas" }
```

The inverted index looks like:

```
"mongodb"  → [doc1, doc2]
"great"    → [doc1]
"search"   → [doc2, doc3]
"powerful" → [doc2]
"text"     → [doc3]
"atlas"    → [doc3]
```

When you search for `"mongodb search"`, Lucene finds the union/intersection of those lists and **ranks** results by relevance score.

### Analyzers

Before indexing and before querying, text goes through an **analyzer pipeline**:

1. **Tokenizer** — splits text into tokens: `"Hello World"` → `["Hello", "World"]`
2. **Filters** — apply transformations:
   - Lowercase: `["Hello", "World"]` → `["hello", "world"]`
   - Stop words: remove `["the", "is", "a"]`
   - Stemming: `["running", "runs"]` → `["run", "run"]`
   - Synonyms: `["car"]` → `["car", "automobile", "vehicle"]`

This is why search is **language-aware** — you configure which analyzer (language) to use.

---

## 4. When to Use a Search Index

Use a search index when you need any of the following:

| Situation                                                 | Why search index                                 |
| --------------------------------------------------------- | ------------------------------------------------ |
| Search bar where users type freeform text                 | Full-text, fuzzy, relevance ranking              |
| E-commerce product search                                 | Match partial words, rank by relevance           |
| Blog / article search                                     | Search across title + body + tags simultaneously |
| Autocomplete / typeahead                                  | `autocomplete` operator built in                 |
| "Did you mean?" suggestions                               | Fuzzy matching catches typos                     |
| Faceted search (filter by category + price range + brand) | `$searchMeta` with facets                        |
| Multi-language content                                    | Configure per-language analyzers                 |
| Synonym-aware search                                      | Define synonym mappings in the index             |

**Stick with regular indexes** when you need:

- Exact lookups: `{ userId: req.params.id }`
- Range filters: `{ price: { $gte: 10 } }`
- Compound sort/filter on structured fields
- Local / self-hosted MongoDB (no Atlas)

---

## 5. Requirements & Where They Live

### Requirements

- **MongoDB Atlas** cluster (M0 free tier supports 3 search indexes)
- Atlas Search is a feature of Atlas — it does not work with local `mongod`

### Where the index definition lives

Search indexes are **not** defined in your Mongoose schema file. They are defined in one of three places:

1. **Atlas UI** (easiest — good for learning)
2. **Atlas CLI** (recommended for production/CI)
3. **MongoDB Driver** (programmatic, shown in section 14)

---

## 6. Creating a Search Index

### Option A — Atlas UI

1. Go to your Atlas cluster → **Search** tab
2. Click **Create Search Index**
3. Choose **Visual Editor** or **JSON Editor**
4. Select your database and collection
5. Give it a name (default is `"default"`)
6. Configure fields and click **Create**

### Option B — Atlas CLI

```bash
# install Atlas CLI first
# https://www.mongodb.com/docs/atlas/cli/stable/install-atlas-cli/

atlas clusters search indexes create \
  --clusterName MyCluster \
  --file search-index.json
```

```json
// search-index.json
{
  "name": "default",
  "collectionName": "products",
  "database": "shop",
  "mappings": {
    "dynamic": true
  }
}
```

### Option C — MongoDB Node.js Driver (programmatic)

```js
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

async function createSearchIndex() {
  await client.connect();
  const collection = client.db("shop").collection("products");

  const result = await collection.createSearchIndex({
    name: "default",
    definition: {
      mappings: {
        dynamic: true,
      },
    },
  });

  console.log("Search index created:", result);
  await client.close();
}

createSearchIndex();
```

---

## 7. Search Index Definition Options

The **index definition** (called a "mapping") tells Atlas which fields to index and how.

### Dynamic Mapping (simplest — index everything automatically)

```json
{
  "mappings": {
    "dynamic": true
  }
}
```

- Automatically indexes all string fields as searchable text
- Great for prototyping
- Indexes more data than you may need (larger index size)

### Static Mapping (production — index only what you need)

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "title": {
        "type": "string",
        "analyzer": "lucene.english"
      },
      "description": {
        "type": "string",
        "analyzer": "lucene.english"
      },
      "price": {
        "type": "number"
      },
      "category": {
        "type": "stringFacet"
      },
      "tags": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "name": [
        {
          "type": "string",
          "analyzer": "lucene.standard"
        },
        {
          "type": "autocomplete",
          "tokenization": "edgeGram",
          "minGrams": 2,
          "maxGrams": 10
        }
      ]
    }
  }
}
// english is good for descriptive text, standared for proper nouns and names
```

### Field types

| Type                | Use for                                 |
| ------------------- | --------------------------------------- |
| `string`            | Full-text search on text fields         |
| `number`            | Numeric range filters inside `$search`  |
| `date`              | Date range filters inside `$search`     |
| `boolean`           | Boolean filters inside `$search`        |
| `objectId`          | Filtering by ObjectId                   |
| `stringFacet`       | Faceted counts/buckets on string fields |
| `numberFacet`       | Faceted counts/buckets on number fields |
| `autocomplete`      | Typeahead / autocomplete queries        |
| `embeddedDocuments` | Search inside arrays of objects         |

### Analyzers

| Analyzer            | What it does                                                 |
| ------------------- | ------------------------------------------------------------ |
| `lucene.standard`   | Splits on whitespace/punctuation, lowercases                 |
| `lucene.english`    | Standard + English stemming (run/running/runs → run)         |
| `lucene.french`     | Standard + French stemming                                   |
| `lucene.keyword`    | Treats the entire field as one token (exact, case-sensitive) |
| `lucene.whitespace` | Splits only on whitespace, no lowercasing                    |
| Custom              | You can chain tokenizers + filters yourself                  |

---

## 8. Querying with $search

`$search` is an **aggregation pipeline stage** — it must be the **first stage** in the pipeline.

### Basic structure

```js
Model.aggregate([
  {
    $search: {
      index: "default", // name of your search index
      // one operator goes here
      text: {
        query: "mongodb",
        path: "title",
      },
    },
  },
  // normal aggregation stages after $search
  { $limit: 10 },
  { $project: { title: 1, score: { $meta: "searchScore" } } },
]);
```

---

## 9. Common Search Operators

- The search index defines what's **available** to search, `path` defines what you **actually search** per query — they don't have to match, just the fields in `path` must exist in the index.

### `text` — full-text search

```js
// search one field
{
  $search: {
    index: 'default',
    text: {
      query: 'wireless headphones',
      path: 'title',
    },
  },
}

// search multiple fields at once
{
  $search: {
    index: 'default',
    text: {
      query: 'wireless headphones',
      path: ['title', 'description', 'tags'],
    },
  },
}

// fuzzy — tolerate typos
{
  $search: {
    index: 'default',
    text: {
      query: 'headphnes',   // typo
      path: 'title',
      fuzzy: { // optional property to use in search operators
        maxEdits: 2,        // allow up to 2 character edits
        prefixLength: 3,    // first 3 chars must match exactly
      },
    },
  },
}
```

### `phrase` — words must appear together in order

```js
{
  $search: {
    index: 'default',
    phrase: {
      query: 'noise cancelling',  // must appear as a phrase
      path: 'description',
      slop: 1,                    // allow 1 word between them
    },
  },
}
```

### `autocomplete` — typeahead as user types

```js
// field must have type: "autocomplete" in the index definition
{
  $search: {
    index: 'default',
    autocomplete: {
      query: 'wire',          // partial input from the user
      path: 'name',
      tokenOrder: 'sequential',
      fuzzy: { maxEdits: 1 },
    },
  },
}
```

### `range` — numeric / date range inside $search

```js
{
  $search: {
    index: 'default',
    range: {
      path: 'price',
      gte: 10,
      lte: 100,
    },
  },
}

// date range
{
  $search: {
    index: 'default',
    range: {
      path: 'createdAt',
      gte: new Date('2024-01-01'),
      lte: new Date('2024-12-31'),
    },
  },
}
```

### `equals` — exact match inside $search

```js
{
  $search: {
    index: 'default',
    equals: {
      path: 'isActive',
      value: true,
    },
  },
}
```

### `exists` — field must exist

```js
{
  $search: {
    index: 'default',
    exists: {
      path: 'thumbnailUrl',
    },
  },
}
```

### `compound` — combine multiple operators

This is the most powerful operator — combine `must`, `should`, `mustNot`, and `filter`.

```js
{
  $search: {
    index: 'default',
    compound: {
      must: [
        // ALL of these must match
        {
          text: {
            query: 'wireless headphones',
            path: ['title', 'description'],
          },
        },
      ],
      should: [
        // these boost the score if they match but are not required
        {
          text: {
            query: 'noise cancelling',
            path: 'description',
            score: { boost: { value: 2 } }, // double the score contribution
          },
        },
      ],
      mustNot: [
        // documents matching this are excluded
        {
          equals: { path: 'isDiscontinued', value: true },
        },
      ],
      filter: [
        // like must but does NOT affect score — good for structured filters
        {
          range: { path: 'price', gte: 20, lte: 300 },
        },
      ],
    },
  },
}
```

| Clause    | Required              | Affects score |
| --------- | --------------------- | ------------- |
| `must`    | Yes — must match      | Yes           |
| `should`  | No — but boosts score | Yes           |
| `mustNot` | Must NOT match        | No            |
| `filter`  | Yes — must match      | No            |

---

## 10. Scoring & Relevance

Every document returned by `$search` gets a **relevance score** — a number representing how well it matches the query. Higher score = better match.

### Accessing the score

```js
Model.aggregate([
  {
    $search: {
      index: "default",
      text: { query: "headphones", path: "title" },
    },
  },
  {
    $project: {
      title: 1,
      price: 1,
      score: { $meta: "searchScore" }, // attach score to output
    },
  },
  { $sort: { score: -1 } }, // sort by most relevant first
]);
```

### Modifying scores

```js
// boost — multiply score by a factor
{
  text: {
    query: 'headphones',
    path: 'title',
    score: { boost: { value: 3 } }, // title matches worth 3x more
  },
}

// constant — replace score with a fixed value (ignore relevance)
{
  text: {
    query: 'headphones',
    path: 'description',
    score: { constant: { value: 1 } },
  },
}

// boost by a numeric field value (e.g. popularity)
{
  text: {
    query: 'headphones',
    path: 'title',
    score: {
      boost: {
        path: 'popularityScore',  // field in your document
        undefined: 1,              // fallback if field is missing
      },
    },
  },
}
```

---

## 11. Facets – Filters & Counts

Facets let you return **counts per category** alongside your search results — like the sidebar filters on Amazon ("Electronics (120)", "Audio (45)").

Use `$searchMeta` instead of `$search` when you only want the facet counts, not documents.

### Index definition — fields must use facet types

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "title": { "type": "string", "analyzer": "lucene.english" },
      "category": { "type": "stringFacet" },
      "brand": { "type": "stringFacet" },
      "price": { "type": "numberFacet" }
    }
  }
}
```

### Query with facets

```js
// get documents AND facet metadata together
Model.aggregate([
  {
    $searchMeta: {
      index: "default",
      facet: {
        operator: {
          text: { query: "headphones", path: "title" },
        },
        facets: {
          categoryCounts: {
            type: "string",
            path: "category",
            numBuckets: 5, // top 5 categories
          },
          brandCounts: {
            type: "string",
            path: "brand",
          },
          priceRanges: {
            type: "number",
            path: "price",
            boundaries: [0, 50, 100, 200, 500], // buckets
            default: "Other",
          },
        },
      },
    },
  },
]);
```

### Example response

```json
[
  {
    "count": { "lowerBound": 150 },
    "facet": {
      "categoryCounts": {
        "buckets": [
          { "_id": "Electronics", "count": 80 },
          { "_id": "Audio", "count": 45 },
          { "_id": "Gaming", "count": 25 }
        ]
      },
      "priceRanges": {
        "buckets": [
          { "_id": 0, "count": 20 },
          { "_id": 50, "count": 55 },
          { "_id": 100, "count": 60 },
          { "_id": 200, "count": 15 }
        ]
      }
    }
  }
]
```

---

## 12. Autocomplete

Autocomplete returns suggestions as the user types — before they finish the word.

### Index definition — field needs `autocomplete` type

```json
{
  "mappings": {
    "fields": {
      "name": [
        { "type": "string" },
        {
          "type": "autocomplete",
          "tokenization": "edgeGram",
          "minGrams": 2,
          "maxGrams": 10,
          "foldDiacritics": true
        }
      ]
    }
  }
}
```

**tokenization options:**

- `edgeGram` — indexes prefixes: "hea", "head", "headp", ... (best for autocomplete)
- `rightEdgeGram` — indexes suffixes
- `nGram` — indexes all substrings (very large index)

### Query

```js
// user has typed "wire" so far
const suggestions = await Product.aggregate([
  {
    $search: {
      index: "default",
      autocomplete: {
        query: req.query.q, // "wire"
        path: "name",
        fuzzy: { maxEdits: 1 },
      },
    },
  },
  { $limit: 5 },
  { $project: { name: 1, _id: 0 } },
]);

// returns: ["wireless headphones", "wire connectors", "wireless mouse"]
```

---

## 13. Combining $search with Aggregation

`$search` is just the first stage — after it you can use any standard aggregation stage.

### Full example — search + filter + paginate + project

```js
const searchProducts = async ({ query, category, minPrice, maxPrice, page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  return Product.aggregate([
    // 1. full-text search
    {
      $search: {
        index: "default",
        compound: {
          must: [
            {
              text: {
                query,
                path: ["name", "description"],
                fuzzy: { maxEdits: 1 },
              },
            },
          ],
          filter: [
            // structured filters — don't affect score
            ...(category ? [{ equals: { path: "category", value: category } }] : []),
            ...(minPrice || maxPrice
              ? [{ range: { path: "price", gte: minPrice ?? 0, lte: maxPrice ?? Infinity } }]
              : []),
          ],
        },
      },
    },

    // 2. attach relevance score
    {
      $addFields: {
        score: { $meta: "searchScore" },
      },
    },

    // 3. pagination
    { $skip: skip },
    { $limit: limit },

    // 4. shape the output
    {
      $project: {
        name: 1,
        price: 1,
        category: 1,
        thumbnailUrl: 1,
        score: 1,
      },
    },
  ]);
};
```

### Get total count alongside results — use $facet

```js
Product.aggregate([
  {
    $search: {
      index: "default",
      text: { query: "headphones", path: "name" },
    },
  },
  {
    $facet: {
      results: [
        { $skip: 0 },
        { $limit: 20 },
        { $project: { name: 1, price: 1, score: { $meta: "searchScore" } } },
      ],
      totalCount: [{ $count: "count" }],
    },
  },
]);

// response shape:
// { results: [...], totalCount: [{ count: 142 }] }
```

---

## 14. Managing Search Indexes in Mongoose

Mongoose doesn't have native support for creating Atlas Search Indexes, but you can use the MongoDB driver directly via `mongoose.connection`.

### Create on app startup

```js
const mongoose = require("mongoose");

async function ensureSearchIndexes() {
  // wait until mongoose is connected
  const db = mongoose.connection.db;
  const collection = db.collection("products");

  const existing = await collection.listSearchIndexes().toArray();
  const exists = existing.some((i) => i.name === "default");

  if (!exists) {
    await collection.createSearchIndex({
      name: "default",
      definition: {
        mappings: {
          dynamic: false,
          fields: {
            name: [
              { type: "string", analyzer: "lucene.english" },
              { type: "autocomplete", tokenization: "edgeGram", minGrams: 2, maxGrams: 10 },
            ],
            description: { type: "string", analyzer: "lucene.english" },
            category: { type: "stringFacet" },
            price: { type: "number" },
          },
        },
      },
    });
    console.log("Search index created");
  }
}

mongoose.connection.once("open", ensureSearchIndexes);
```

### List existing search indexes

```js
const indexes = await mongoose.connection.db.collection("products").listSearchIndexes().toArray();

console.log(indexes);
```

### Drop a search index

```js
await mongoose.connection.db.collection("products").dropSearchIndex("default");
```

---

## 15. Real-World Use Cases

### E-commerce Product Search

```js
// user types "wireles hedphon" (two typos) into search bar
Product.aggregate([
  {
    $search: {
      index: "default",
      compound: {
        must: [
          {
            text: {
              query: "wireles hedphon",
              path: ["name", "description", "tags"],
              fuzzy: { maxEdits: 2 },
            },
          },
        ],
        should: [
          {
            // boost in-stock items
            equals: { path: "inStock", value: true, score: { boost: { value: 1.5 } } },
          },
        ],
        filter: [
          {
            range: { path: "price", gte: 0, lte: 200 },
          },
        ],
      },
    },
  },
  { $limit: 20 },
]);
```

### Blog / Article Search

```js
// search across title, body, and author name simultaneously
Article.aggregate([
  {
    $search: {
      index: "default",
      text: {
        query: req.query.q,
        path: ["title", "body", "author.name"],
        score: {
          boost: { path: "title", undefined: 1 }, // title matches score higher
        },
      },
    },
  },
  { $project: { title: 1, excerpt: 1, author: 1, score: { $meta: "searchScore" } } },
  { $sort: { score: -1 } },
]);
```

### User / People Search

```js
// search by name, skills, or job title
User.aggregate([
  {
    $search: {
      index: "default",
      compound: {
        should: [
          { text: { query: req.query.q, path: "name", score: { boost: { value: 3 } } } },
          { text: { query: req.query.q, path: "jobTitle" } },
          { text: { query: req.query.q, path: "skills" } },
        ],
        minimumShouldMatch: 1,
      },
    },
  },
]);
```

### Autocomplete Search Bar

```js
// GET /api/search/suggest?q=wire
router.get("/suggest", async (req, res) => {
  const suggestions = await Product.aggregate([
    {
      $search: {
        index: "default",
        autocomplete: {
          query: req.query.q,
          path: "name",
          fuzzy: { maxEdits: 1 },
        },
      },
    },
    { $limit: 8 },
    { $project: { name: 1, _id: 0 } },
  ]);

  res.json(suggestions.map((p) => p.name));
});
```

---

## 16. Limitations & Gotchas

| Limitation                             | Detail                                                                                                                               |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Atlas only**                         | Does not work with local MongoDB, Docker, or self-hosted                                                                             |
| **Near real-time**                     | New documents appear in search results after a short delay (~seconds), not instantly                                                 |
| **`$search` must be first**            | You cannot place `$search` after `$match`, `$lookup`, etc.                                                                           |
| **Separate from `find()`**             | You cannot use search features in `.find()` — only in `.aggregate()`                                                                 |
| **Free tier limit**                    | M0 (free) supports max 3 search indexes                                                                                              |
| **Index rebuild on definition change** | Changing the mapping triggers a full re-index — takes time on large collections                                                      |
| **`$text` operator is different**      | The built-in MongoDB `$text` operator (regular index) is much more limited — not the same as Atlas Search                            |
| **Cost**                               | Search indexes consume disk and compute resources on your Atlas cluster                                                              |
| **Sorting**                            | By default results are sorted by score. To sort by a field (like price) use `$sort` after `$search`, but you lose relevance ordering |

---

## 17. Quick Reference Cheatsheet

```js
// ── basic text search ───────────────────────────────────────────
{ $search: { index: 'default', text: { query: 'q', path: 'field' } } }

// ── multi-field ─────────────────────────────────────────────────
{ $search: { index: 'default', text: { query: 'q', path: ['f1', 'f2'] } } }

// ── fuzzy (typo tolerance) ──────────────────────────────────────
{ $search: { index: 'default', text: { query: 'q', path: 'f', fuzzy: { maxEdits: 1 } } } }

// ── phrase ──────────────────────────────────────────────────────
{ $search: { index: 'default', phrase: { query: 'exact phrase', path: 'f' } } }

// ── autocomplete ────────────────────────────────────────────────
{ $search: { index: 'default', autocomplete: { query: 'parti', path: 'name' } } }

// ── range ───────────────────────────────────────────────────────
{ $search: { index: 'default', range: { path: 'price', gte: 10, lte: 100 } } }

// ── compound ────────────────────────────────────────────────────
{ $search: { index: 'default', compound: { must: [...], should: [...], mustNot: [...], filter: [...] } } }

// ── get score ───────────────────────────────────────────────────
{ $project: { score: { $meta: 'searchScore' } } }

// ── facets ──────────────────────────────────────────────────────
{ $searchMeta: { index: 'default', facet: { operator: { text: {...} }, facets: { cat: { type: 'string', path: 'category' } } } } }
```

---

> **Key takeaway:** A regular index answers the question _"does this document have this exact value?"_. A search index answers the question _"which documents best match what the user is looking for?"_ — with awareness of language, typos, relevance, and context.
