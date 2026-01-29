import { KnowledgeGraph } from "../components/KnowledgeGraph";

const KnowledgeGraphPage = () => {
  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-dark">
      <h1 className="text-3xl font-bold text-center p-4">Knowledge Graph</h1>
      <KnowledgeGraph />
    </div>
  );
};

export default KnowledgeGraphPage;
