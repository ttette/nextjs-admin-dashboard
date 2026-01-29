
import { firestore } from './firebase'; // Assuming you have a firebase config file
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';

// ----------------------------------------------------------------------
// Article Schema Definition
// ----------------------------------------------------------------------

export interface Article {
  id: string;
  status: 'Born' | 'Enriched' | 'Ready for Tender';
  createdAt: Date;
  updatedAt: Date;
  baseData: {
    articleName?: string;
    description?: string;
    sku?: string;
    supplier?: string;
    // ... other base data fields
  };
  qualityQA: {
    inspectionRequired?: boolean;
    certification?: string;
    material?: string;
    color?: string;
    // ... other quality fields
  };
  logistics: {
    countryOfOrigin?: string;
    packaging?: 'Box' | 'Pallet' | 'Container';
    shippingMethod?: 'Air' | 'Sea' | 'Land';
    weightKg?: number;
    // ... other logistics fields
  };
}

// ----------------------------------------------------------------------
// Clone Functionality
// ----------------------------------------------------------------------

type ArticleSection = 'baseData' | 'qualityQA' | 'logistics';

/**
 * Clones an existing article into a new one.
 * @param sourceArticleId The ID of the article to clone.
 * @param sectionsToClone An array of section names to copy from the source article.
 * @returns The ID of the newly created article.
 */
export async function cloneArticle(
  sourceArticleId: string,
  sectionsToClone: ArticleSection[]
): Promise<string> {
  if (!sourceArticleId) {
    throw new Error('Source article ID is required.');
  }

  const articleRef = doc(firestore, 'articles', sourceArticleId);
  const articleSnap = await getDoc(articleRef);

  if (!articleSnap.exists()) {
    throw new Error(`Article with ID ${sourceArticleId} not found.`);
  }

  const sourceArticle = articleSnap.data() as Article;

  const newArticleData = {
    status: 'Born',
    createdAt: new Date(),
    updatedAt: new Date(),
    baseData: {},
    qualityQA: {},
    logistics: {},
  };

  // Copy selected sections from the source article
  for (const section of sectionsToClone) {
    if (sourceArticle[section]) {
      newArticleData[section] = sourceArticle[section];
    }
  }

  const newArticleRef = await addDoc(collection(firestore, 'articles'), newArticleData);
  return newArticleRef.id;
}
