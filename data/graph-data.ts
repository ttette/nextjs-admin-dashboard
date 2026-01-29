export const graphData = {
  nodes: [
    // Articles
    { id: "Article-1", type: "Article", name: "The Future of AI" },
    { id: "Article-2", type: "Article", name: "Sustainable Energy" },

    // Suppliers
    { id: "Supplier-A", type: "Supplier", name: "TechCorp" },
    { id: "Supplier-B", type: "Supplier", name: "GreenEnergy Inc." },

    // Compliance Rules
    { id: "QA012", type: "Compliance", name: "QA Check" },
    { id: "LGL004", type: "Compliance", name: "Legal Review" },
  ],
  links: [
    // Article-1 relationships
    { source: "Article-1", target: "Supplier-A" },
    { source: "Article-1", target: "QA012" },
    { source: "Article-1", target: "LGL004" },

    // Article-2 relationships
    { source: "Article-2", target: "Supplier-B" },
    { source: "Article-2", target: "QA012" },
  ],
};
