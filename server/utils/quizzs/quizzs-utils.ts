const fs = require('fs');
const path = require('path');

const QUIZZS_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'quizzs'
);

const ENTITY_TYPE_MAP: Record<string, string> = {
  MOVIE: 'movie',
  SERIE: 'serie',
  BOOK: 'book',
  GAME: 'game',
  BD: 'bd',
  COMIC: 'comic',
  MANGA: 'manga',
  MANWHA: 'manwha',
};

const ENTITY_TYPE_REVERSE_MAP: Record<string, string> = Object.entries(
  ENTITY_TYPE_MAP
).reduce((acc: Record<string, string>, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

const QUIZZS_INDEX_FILE = path.join(QUIZZS_DIR, 'index.ts');

function unescapeString(value: string, quote: string) {
  return value
    .replace(new RegExp(`\\\\${quote}`, 'g'), quote)
    .replace(/\\\\/g, '\\');
}

function parseStringField(objectText: string, key: string) {
  const regex = new RegExp(`${key}\\s*:\\s*(['"])((?:\\\\.|(?!\\1).)*)\\1`);
  const match = objectText.match(regex);
  if (!match) return null;
  const quote = match[1];
  return unescapeString(match[2], quote);
}

function parseNumberField(objectText: string, key: string) {
  const regex = new RegExp(`${key}\\s*:\\s*([^,\\n]+)`);
  const match = objectText.match(regex);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseBooleanField(objectText: string, key: string) {
  const regex = new RegExp(`${key}\\s*:\\s*(true|false)`);
  const match = objectText.match(regex);
  if (!match) return null;
  return match[1] === 'true';
}

function extractArrayBlock(text: string, startIndex: number) {
  const arrayStart = text.indexOf('[', startIndex);
  if (arrayStart === -1) return null;
  let depth = 0;
  for (let i = arrayStart; i < text.length; i += 1) {
    if (text[i] === '[') depth += 1;
    if (text[i] === ']') {
      depth -= 1;
      if (depth === 0) {
        return text.slice(arrayStart, i + 1);
      }
    }
  }
  return null;
}

function parseStringArrayField(objectText: string, key: string): string[] {
  const keyIndex = objectText.indexOf(`${key}`);
  if (keyIndex === -1) return [];
  const arrayBlock = extractArrayBlock(objectText, keyIndex);
  if (!arrayBlock) return [];
  const regex = /(['"])((?:\\.|(?!\1).)*)\1/g;
  const values: string[] = [];
  let match = regex.exec(arrayBlock);
  while (match) {
    const quote = match[1];
    values.push(unescapeString(match[2], quote));
    match = regex.exec(arrayBlock);
  }
  return values;
}

function parseEntityType(objectText: string) {
  // Accepter EntityType et QuizzEntityType (utilisés dans le modèle frontend)
  const regex =
    /entityType\s*:\s*(?:QuizzEntityType|EntityType)\.([A-Z_]+)/;
  const match = objectText.match(regex);
  if (!match) return null;
  return ENTITY_TYPE_MAP[match[1]] || null;
}

function parseQuestions(objectText: string) {
  const questionsIndex = objectText.indexOf('questions');
  if (questionsIndex === -1) return [];
  const arrayBlock = extractArrayBlock(objectText, questionsIndex);
  if (!arrayBlock) return [];

  const questions: any[] = [];
  let depth = 0;
  let objectStart = -1;
  for (let i = 0; i < arrayBlock.length; i += 1) {
    const char = arrayBlock[i];
    if (char === '{') {
      if (depth === 0) {
        objectStart = i;
      }
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0 && objectStart !== -1) {
        const objectText = arrayBlock.slice(objectStart, i + 1);
        const title = parseStringField(objectText, 'title');
        if (!title) continue;
        questions.push({
          id: parseNumberField(objectText, 'id') ?? 0,
          title,
          multipleChoice: parseBooleanField(objectText, 'multipleChoice') ?? false,
          proposedAnswers: parseStringArrayField(objectText, 'proposedAnswers'),
          acceptedAnswers: parseStringArrayField(objectText, 'acceptedAnswers'),
        });
      }
    }
  }
  return questions;
}

function parseQuizzsFromFile(content: string): any[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const equalsIndex = content.indexOf('=', exportIndex);
  if (equalsIndex === -1) {
    return [];
  }
  const arrayBlock = extractArrayBlock(content, equalsIndex);
  if (!arrayBlock) return [];

  const quizzs: any[] = [];
  let depth = 0;
  let objectStart = -1;
  for (let i = 0; i < arrayBlock.length; i += 1) {
    const char = arrayBlock[i];
    if (char === '{') {
      if (depth === 0) {
        objectStart = i;
      }
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0 && objectStart !== -1) {
        const objectText = arrayBlock.slice(objectStart, i + 1);
        const creator = parseStringField(objectText, 'creator');
        const entityTitle = parseStringField(objectText, 'entityTitle');
        const entityType = parseEntityType(objectText);
        if (creator && entityTitle && entityType) {
          quizzs.push({
            creator,
            entityType,
            entityTitle,
            level: parseNumberField(objectText, 'level') ?? 1,
            questions: parseQuestions(objectText),
          });
        }
      }
    }
  }

  return quizzs;
}

function getQuizzFiles(): string[] {
  if (!fs.existsSync(QUIZZS_DIR)) return [];
  return fs
    .readdirSync(QUIZZS_DIR)
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file: string) => path.join(QUIZZS_DIR, file));
}

function formatQuizzFile(quizzs: any[], exportName: string) {
  const items = quizzs
    .map((quizz) => {
      const entityEnum = ENTITY_TYPE_REVERSE_MAP[quizz.entityType] || 'MANGA';
      const questions = (quizz.questions || [])
        .map((question: any) => {
          const proposed = (question.proposedAnswers || [])
            .map((answer: string) => `'${answer.replace(/'/g, "\\'")}'`)
            .join(', ');
          const accepted = (question.acceptedAnswers || [])
            .map((answer: string) => `'${answer.replace(/'/g, "\\'")}'`)
            .join(', ');
          return `    {\n      id: ${question.id},\n      title: '${String(
            question.title || ''
          ).replace(/'/g, "\\'")}',\n      multipleChoice: ${Boolean(
            question.multipleChoice
          )},\n      proposedAnswers: [${proposed}],\n      acceptedAnswers: [${accepted}],\n    }`;
        })
        .join(',\n');
      return `  {\n    creator: '${String(quizz.creator || '').replace(
        /'/g,
        "\\'"
      )}',\n    entityType: EntityType.${entityEnum},\n    entityTitle: '${String(
        quizz.entityTitle || ''
      ).replace(/'/g, "\\'")}',\n    level: ${quizz.level || 1},\n    questions: [\n${questions}\n    ],\n  }`;
    })
    .join(',\n');

  return `import { Quizz, EntityType } from '../../models/quizz-model';\n\nexport const ${exportName}: Quizz[] = [\n${items}\n];\n`;
}

function getExportNameFromCreator(creator: string) {
  const normalized = creator.trim().toLowerCase();
  const clean = normalized.replace(/[^a-z0-9]/g, '');
  return `quizzs${clean.charAt(0).toUpperCase()}${clean.slice(1)}`;
}

function getFileNameFromCreator(creator: string) {
  const normalized = creator.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return `quizzs_${normalized}.ts`;
}

function ensureQuizzsDir() {
  if (!fs.existsSync(QUIZZS_DIR)) {
    fs.mkdirSync(QUIZZS_DIR, { recursive: true });
  }
}

function updateQuizzsIndex(exportName: string, fileName: string) {
  if (!fs.existsSync(QUIZZS_INDEX_FILE)) {
    const content = `import { Quizz } from '../../models/quizz-model';\nimport { ${exportName} } from './${fileName.replace(
      '.ts',
      ''
    )}';\n\nexport const allQuizzs: Quizz[] = [...${exportName}];\n`;
    fs.writeFileSync(QUIZZS_INDEX_FILE, content, 'utf8');
    return;
  }

  const raw = fs.readFileSync(QUIZZS_INDEX_FILE, 'utf8');
  const importLine = `import { ${exportName} } from './${fileName.replace(
    '.ts',
    ''
  )}';`;
  let next = raw;
  if (!raw.includes(importLine)) {
    next = raw.replace(/(import\s+\{[^}]+\}\s+from\s+'[^']+';\n)/, `$1${importLine}\n`);
  }

  next = next.replace(
    /export const allQuizzs: Quizz\[] = \[(.*)\];/s,
    (match: string, items: string) => {
      if (items.includes(exportName)) return match;
      const trimmed = items.trim();
      const separator = trimmed ? ', ' : '';
      return `export const allQuizzs: Quizz[] = [${trimmed}${separator}...${exportName}];`;
    }
  );

  fs.writeFileSync(QUIZZS_INDEX_FILE, next, 'utf8');
}

function saveQuizz(quizz: any) {
  ensureQuizzsDir();
  const fileName = getFileNameFromCreator(quizz.creator || 'unknown');
  const exportName = getExportNameFromCreator(quizz.creator || 'unknown');
  const filePath = path.join(QUIZZS_DIR, fileName);

  let existing: any[] = [];
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    existing = parseQuizzsFromFile(content);
    // Sécurité : si le fichier existe et contient des données mais le parsing a échoué (existing vide),
    // ne pas écraser pour éviter de perdre des quizzs existants
    if (existing.length === 0 && content.includes('export const') && content.length > 150) {
      throw new Error(
        'Impossible de parser les quizzs existants. Le fichier n\'a pas été modifié pour éviter la perte de données.'
      );
    }
  }

  const updated = [...existing, quizz];
  const content = formatQuizzFile(updated, exportName);
  fs.writeFileSync(filePath, content, 'utf8');
  updateQuizzsIndex(exportName, fileName);
}

module.exports = {
  getQuizzFiles,
  parseQuizzsFromFile,
  saveQuizz,
};

export {};
