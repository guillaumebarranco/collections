import type { Book } from '../models/book-model';
import type { ChildrenBook } from '../models/children-book-model';
import type { EntityBadgeProgressRow } from './entity-badge-progress.types';
import { buildBookReadFollowUpProgress } from './book-read-follow-up.utils';

/** Progression badges après passage readlist → lu (réutilise les seuils livres en attendant des badges dédiés). */
export function buildChildrenBookReadFollowUpProgress(
  childrenBook: ChildrenBook,
  allUserChildrenBooks: ChildrenBook[]
): EntityBadgeProgressRow[] {
  return buildBookReadFollowUpProgress(
    childrenBook as Book,
    allUserChildrenBooks as Book[]
  );
}
