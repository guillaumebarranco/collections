const express = require('express');
const {
  getListsForUser,
  createList,
  deleteList,
} = require('../../utils/movies-lists/movies-lists-utils');

function normalizeString(value: unknown, field: string): string {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return '';
  return value.trim();
}

const router = express.Router();

router.get('/:userId/movies-lists', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId').toLowerCase();
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    const lists = getListsForUser(userId);
    res.json(lists);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

router.post('/:userId/movies-lists', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId').toLowerCase();
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    const listName = normalizeString(req.body?.listName, 'listName');
    if (!listName) {
      res.status(400).json({ error: 'Missing listName' });
      return;
    }
    const icon = normalizeString(req.body?.icon, 'icon') || undefined;
    const color = normalizeString(req.body?.color, 'color') || undefined;
    const lists = createList(userId, listName, icon, color);
    res.json(lists);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

router.delete('/:userId/movies-lists', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId').toLowerCase();
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    const listName = normalizeString(req.body?.listName, 'listName');
    if (!listName) {
      res.status(400).json({ error: 'Missing listName in body' });
      return;
    }
    deleteList(userId, listName);
    res.json({ ok: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
