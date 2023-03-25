export const jld = JSON.stringify(
  JSON.parse(`{
    "@context": {
      "@vocab": "http://schema.org/",
      "name": "http://schema.org/name",
      "description": "http://schema.org/description",
      "image": {
        "@id": "http://schema.org/image",
        "@type": "@id"
      },
      "dateCreated": {
        "@id": "http://schema.org/dateCreated",
        "@type": "http://www.w3.org/2001/XMLSchema#date"
      },
      "creator": {
        "@id": "http://schema.org/creator",
        "@type": "@id"
      },
      "example": {
        "@id": "http://example.com/example",
        "@type": "@id"
      },
      "count": {
        "@id": "http://example.com/count",
        "@type": "http://www.w3.org/2001/XMLSchema#integer"
      },
      "isAvailable": {
        "@id": "http://example.com/isAvailable",
        "@type": "http://www.w3.org/2001/XMLSchema#boolean"
      }
    },
    "@id": "http://example.com/book/123",
    "@type": "Book",
    "name": "The Catcher in the Rye",
    "description": "A novel by J. D. Salinger",
    "image": "http://example.com/book/123.jpg",
    "dateCreated": "1951-07-16",
    "creator": "http://example.com/person/456",
    "example": "http://example.com/example/789",
    "@reverse": {
      "publisher": "http://example.com/publisher/987"
    },
    "count": 123,
    "score": 4.5,
    "isAvailable": true,
    "keywords": ["book", "fiction", "classic"],
    "nullValue": null
}`),
  null,
  "  "
);

export const sql = `SELECT
  b.id AS book_id,
  b.name AS book_name,
  b.description AS book_description,
  b.image AS book_image,
  b.dateCreated AS date_created,
  b.creator AS creator_id,
  b.example AS example_id,
  b.count AS book_count,
  b.score AS book_score,
  b.isAvailable AS is_available,
  b.keywords AS keywords,
  b.nullValue AS null_value,
  p.id AS publisher_id
FROM books b
LEFT JOIN books_publishers bp 
ON b.id = bp.book_id
LEFT JOIN publishers p 
ON bp.publisher_id = p.id
WHERE b.isAvailable = true
AND b.score >= 4.0
ORDER BY b.dateCreated DESC;`;
