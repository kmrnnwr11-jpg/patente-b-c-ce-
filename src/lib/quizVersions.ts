import type { QuizDatasetMeta, QuizDatasetVersionId, QuizQuestion } from '@/types/quiz';
import baseQuizData from '@/data/quiz.json';

type RawQuizDataset = QuizQuestion[] | string;

interface QuizVersionDefinition {
  id: QuizDatasetVersionId;
  label: string;
  description: string;
  yearRange: string;
  badge?: string;
  isBeta?: boolean;
  isDefault?: boolean;
  rawData: RawQuizDataset;
}

const VERSION_DEFINITIONS: Record<QuizDatasetVersionId, QuizVersionDefinition> = {
  'ministeriale-2023': {
    id: 'ministeriale-2023',
    label: 'Quiz Ministeriali 2023',
    description: 'Dataset ufficiale ministeriale.',
    yearRange: '2023',
    isDefault: true,
    rawData: baseQuizData
  }
};

const DATA_CACHE = new Map<QuizDatasetVersionId, QuizQuestion[]>();

function parseRawDataset(raw: RawQuizDataset): QuizQuestion[] {
  if (Array.isArray(raw)) {
    return raw as QuizQuestion[];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as QuizQuestion[];
    }
    console.warn('quizVersions: parsed dataset is not an array. Returning empty array.');
    return [];
  } catch (error) {
    console.error('quizVersions: error parsing dataset', error);
    return [];
  }
}

export function getQuizQuestionsForVersion(versionId: QuizDatasetVersionId): QuizQuestion[] {
  if (DATA_CACHE.has(versionId)) {
    return DATA_CACHE.get(versionId)!;
  }

  const definition = VERSION_DEFINITIONS[versionId];
  if (!definition) {
    console.warn(`quizVersions: dataset ${versionId} non definito`);
    return [];
  }

  const questions = parseRawDataset(definition.rawData);
  DATA_CACHE.set(versionId, questions);
  return questions;
}

export function getQuizDatasetMeta(versionId: QuizDatasetVersionId): QuizDatasetMeta {
  const definition = VERSION_DEFINITIONS[versionId];
  if (!definition) {
    throw new Error(`quizVersions: dataset ${versionId} non definito`);
  }

  const questions = getQuizQuestionsForVersion(versionId);

  return {
    id: definition.id,
    label: definition.label,
    description: definition.description,
    yearRange: definition.yearRange,
    badge: definition.badge,
    isBeta: definition.isBeta,
    isDefault: definition.isDefault,
    totalQuestions: questions.length
  };
}

export function getAllQuizDatasetMeta(): QuizDatasetMeta[] {
  return Object.keys(VERSION_DEFINITIONS).map(versionId =>
    getQuizDatasetMeta(versionId as QuizDatasetVersionId)
  );
}

export function getDefaultQuizDatasetVersion(): QuizDatasetVersionId {
  const defaultEntry = Object.values(VERSION_DEFINITIONS).find(def => def.isDefault);
  return defaultEntry ? defaultEntry.id : 'ministeriale-2023';
}

export function isQuizDatasetDefined(versionId: string): versionId is QuizDatasetVersionId {
  return Boolean(VERSION_DEFINITIONS[versionId as QuizDatasetVersionId]);
}

export function parseQuizDatasetVersionId(
  value: string | null | undefined
): QuizDatasetVersionId | null {
  if (!value) {
    return null;
  }

  return isQuizDatasetDefined(value) ? (value as QuizDatasetVersionId) : null;
}


