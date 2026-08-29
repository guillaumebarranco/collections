/**
 * Catégories des Oscars (récompenses, pas nominations).
 * Les clés stables servent de valeur persistée dans le catalogue.
 */
export enum OscarEnum {
  OSCAR_BEST_MOVIE = 'OSCAR_BEST_MOVIE',
  OSCAR_BEST_DIRECTOR = 'OSCAR_BEST_DIRECTOR',
  OSCAR_BEST_ACTOR = 'OSCAR_BEST_ACTOR',
  OSCAR_BEST_ACTRESS = 'OSCAR_BEST_ACTRESS',
  OSCAR_BEST_SUPPORTING_ACTOR = 'OSCAR_BEST_SUPPORTING_ACTOR',
  OSCAR_BEST_SUPPORTING_ACTRESS = 'OSCAR_BEST_SUPPORTING_ACTRESS',
  OSCAR_BEST_ORIGINAL_SCREENPLAY = 'OSCAR_BEST_ORIGINAL_SCREENPLAY',
  OSCAR_BEST_ADAPTED_SCREENPLAY = 'OSCAR_BEST_ADAPTED_SCREENPLAY',
  OSCAR_BEST_CINEMATOGRAPHY = 'OSCAR_BEST_CINEMATOGRAPHY',
  OSCAR_BEST_FILM_EDITING = 'OSCAR_BEST_FILM_EDITING',
  OSCAR_BEST_ORIGINAL_SCORE = 'OSCAR_BEST_ORIGINAL_SCORE',
  OSCAR_BEST_ORIGINAL_SONG = 'OSCAR_BEST_ORIGINAL_SONG',
  OSCAR_BEST_PRODUCTION_DESIGN = 'OSCAR_BEST_PRODUCTION_DESIGN',
  OSCAR_BEST_COSTUME_DESIGN = 'OSCAR_BEST_COSTUME_DESIGN',
  OSCAR_BEST_MAKEUP = 'OSCAR_BEST_MAKEUP',
  OSCAR_BEST_SOUND = 'OSCAR_BEST_SOUND',
  OSCAR_BEST_VISUAL_EFFECTS = 'OSCAR_BEST_VISUAL_EFFECTS',
  OSCAR_BEST_INTERNATIONAL_FEATURE = 'OSCAR_BEST_INTERNATIONAL_FEATURE',
  OSCAR_BEST_ANIMATED_FEATURE = 'OSCAR_BEST_ANIMATED_FEATURE',
  OSCAR_BEST_DOCUMENTARY = 'OSCAR_BEST_DOCUMENTARY',
  OSCAR_BEST_ANIMATED_SHORT = 'OSCAR_BEST_ANIMATED_SHORT',
  OSCAR_BEST_LIVE_ACTION_SHORT = 'OSCAR_BEST_LIVE_ACTION_SHORT',
  OSCAR_BEST_DOCUMENTARY_SHORT = 'OSCAR_BEST_DOCUMENTARY_SHORT',
}

/** Oscar remporté par un film (cérémonie = année). */
export interface MovieOscar {
  type: OscarEnum;
  year: number;
}

/** Liste ordonnée des catégories pour les formulaires / filtres. */
export const OSCAR_ENUM_OPTIONS: readonly OscarEnum[] = [
  OscarEnum.OSCAR_BEST_MOVIE,
  OscarEnum.OSCAR_BEST_DIRECTOR,
  OscarEnum.OSCAR_BEST_ACTOR,
  OscarEnum.OSCAR_BEST_ACTRESS,
  OscarEnum.OSCAR_BEST_SUPPORTING_ACTOR,
  OscarEnum.OSCAR_BEST_SUPPORTING_ACTRESS,
  OscarEnum.OSCAR_BEST_ORIGINAL_SCREENPLAY,
  OscarEnum.OSCAR_BEST_ADAPTED_SCREENPLAY,
  OscarEnum.OSCAR_BEST_CINEMATOGRAPHY,
  OscarEnum.OSCAR_BEST_FILM_EDITING,
  OscarEnum.OSCAR_BEST_ORIGINAL_SCORE,
  OscarEnum.OSCAR_BEST_ORIGINAL_SONG,
  OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN,
  OscarEnum.OSCAR_BEST_COSTUME_DESIGN,
  OscarEnum.OSCAR_BEST_MAKEUP,
  OscarEnum.OSCAR_BEST_SOUND,
  OscarEnum.OSCAR_BEST_VISUAL_EFFECTS,
  OscarEnum.OSCAR_BEST_INTERNATIONAL_FEATURE,
  OscarEnum.OSCAR_BEST_ANIMATED_FEATURE,
  OscarEnum.OSCAR_BEST_DOCUMENTARY,
  OscarEnum.OSCAR_BEST_ANIMATED_SHORT,
  OscarEnum.OSCAR_BEST_LIVE_ACTION_SHORT,
  OscarEnum.OSCAR_BEST_DOCUMENTARY_SHORT,
];

const OSCAR_ENUM_SET = new Set<string>(OSCAR_ENUM_OPTIONS);

export const OSCAR_LABELS: Record<OscarEnum, string> = {
  [OscarEnum.OSCAR_BEST_MOVIE]: 'Meilleur film',
  [OscarEnum.OSCAR_BEST_DIRECTOR]: 'Meilleur réalisateur',
  [OscarEnum.OSCAR_BEST_ACTOR]: 'Meilleur acteur',
  [OscarEnum.OSCAR_BEST_ACTRESS]: 'Meilleure actrice',
  [OscarEnum.OSCAR_BEST_SUPPORTING_ACTOR]: 'Meilleur acteur dans un second rôle',
  [OscarEnum.OSCAR_BEST_SUPPORTING_ACTRESS]:
    'Meilleure actrice dans un second rôle',
  [OscarEnum.OSCAR_BEST_ORIGINAL_SCREENPLAY]: 'Meilleur scénario original',
  [OscarEnum.OSCAR_BEST_ADAPTED_SCREENPLAY]: 'Meilleur scénario adapté',
  [OscarEnum.OSCAR_BEST_CINEMATOGRAPHY]: 'Meilleure photographie',
  [OscarEnum.OSCAR_BEST_FILM_EDITING]: 'Meilleur montage',
  [OscarEnum.OSCAR_BEST_ORIGINAL_SCORE]: 'Meilleure musique originale',
  [OscarEnum.OSCAR_BEST_ORIGINAL_SONG]: 'Meilleure chanson originale',
  [OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN]: 'Meilleurs décors',
  [OscarEnum.OSCAR_BEST_COSTUME_DESIGN]: 'Meilleurs costumes',
  [OscarEnum.OSCAR_BEST_MAKEUP]: 'Meilleur maquillage et coiffure',
  [OscarEnum.OSCAR_BEST_SOUND]: 'Meilleur son',
  [OscarEnum.OSCAR_BEST_VISUAL_EFFECTS]: 'Meilleurs effets visuels',
  [OscarEnum.OSCAR_BEST_INTERNATIONAL_FEATURE]: 'Meilleur film international',
  [OscarEnum.OSCAR_BEST_ANIMATED_FEATURE]: 'Meilleur film d’animation',
  [OscarEnum.OSCAR_BEST_DOCUMENTARY]: 'Meilleur documentaire',
  [OscarEnum.OSCAR_BEST_ANIMATED_SHORT]: 'Meilleur court métrage d’animation',
  [OscarEnum.OSCAR_BEST_LIVE_ACTION_SHORT]: 'Meilleur court métrage de fiction',
  [OscarEnum.OSCAR_BEST_DOCUMENTARY_SHORT]: 'Meilleur court métrage documentaire',
};

export function isOscarEnum(value: string): value is OscarEnum {
  return OSCAR_ENUM_SET.has(value);
}

export function filterToMovieOscars(
  oscars: readonly { type: string; year: number }[]
): MovieOscar[] {
  return oscars.filter(
    (o): o is MovieOscar =>
      isOscarEnum(o.type) && Number.isFinite(o.year) && o.year > 0
  );
}
