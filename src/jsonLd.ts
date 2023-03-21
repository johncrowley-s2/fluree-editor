export const JSON_LD_KEYWORDS = [
  "@context",
  "@id",
  "@type",
  "@value",
  "@language",
  "@index",
  "@reverse",
  "@nest",
  "@prefix",
  "@vocab",
];

export type JldKeyword = typeof JSON_LD_KEYWORDS[number];

export const JSON_LD_KEYWORD_DESCRIPTIONS: Record<JldKeyword, string> = {
  "@context":
    "Specifies the context in which a JSON-LD document is interpreted. It can be used to map terms used in the document to URIs and to provide information about the meaning of terms.",
  "@id":
    "Provides a unique identifier for a node in the graph. This can be a URL, a blank node identifier, or a JSON-LD string.",
  "@type":
    "Indicates the type of a node in the graph. This can be a URI or a JSON-LD string.",
  "@value":
    "Specifies the value of a node in the graph. This can be a literal value or a reference to another node.",
  "@language":
    "Indicates the language of a literal value. This can be any valid language tag.",
  "@index":
    "Specifies the index value of an element in a collection node. This can be any valid JSON-LD string.",
  "@reverse":
    "Indicates that a property is used to express a reverse relationship between nodes. The value of this keyword is another JSON-LD object.",
  "@nest":
    "Indicates that a property is used to nest a node within another node. The value of this keyword is another JSON-LD object.",
  "@prefix":
    "Provides a prefix that can be used in property names and value strings in a JSON-LD document. The value of this keyword is a string.",
  "@vocab":
    "Specifies a default vocabulary that can be used to expand property names in a JSON-LD document.",
};
