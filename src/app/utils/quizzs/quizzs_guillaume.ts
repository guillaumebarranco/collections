import { Quizz, EntityType } from '../../models/quizz-model';

export const quizzsGuillaume: Quizz[] = [
  {
    creator: 'Guillaume',
    entityType: EntityType.MANGA,
    entityTitle: 'One Piece',
    level: 1,
    questions: [
    {
      id: 1,
      title: 'Comment s\'appelle le frère de Luffy ?',
      multipleChoice: false,
      proposedAnswers: [],
      acceptedAnswers: ['Ace', 'Portgas D. Ace'],
    },
    {
      id: 1,
      title: 'Qui est le second à avoir mangé le Mera Mera no Mi ?',
      multipleChoice: true,
      proposedAnswers: ['Sabo', 'Koala', 'Hack', 'Monkey D. Dragon'],
      acceptedAnswers: ['Sabo'],
    }
    ],
  },
  {
    creator: 'guillaume',
    entityType: EntityType.MANGA,
    entityTitle: 'Kenshin le Vagabond',
    level: 2,
    questions: [
    {
      id: 1,
      title: 'Quel est le vrai prénom de Kenshin ?',
      multipleChoice: false,
      proposedAnswers: [],
      acceptedAnswers: ['Battosai'],
    }
    ],
  },
  {
    creator: 'guillaume',
    entityType: EntityType.MANGA,
    entityTitle: 'Death Note',
    level: 1,
    questions: [
    {
      id: 1,
      title: 'Quel est le prénom japonais de Light Yagami ?',
      multipleChoice: false,
      proposedAnswers: [],
      acceptedAnswers: ['Raito'],
    }
    ],
  },
  {
    creator: 'guillaume',
    entityType: EntityType.MANGA,
    entityTitle: 'Naruto',
    level: 1,
    questions: [
    {
      id: 1,
      title: 'sgsdgdg',
      multipleChoice: false,
      proposedAnswers: [],
      acceptedAnswers: ['dgdfgdf'],
    }
    ],
  }
];
