export interface Competition {
  id: string;
  name: string;
  season: string;
}

export interface ClubColors {
  primary: string;
  primaryVariant: string;
  secondary: string;
  secondaryVariant: string;
  accent: string;
}

export interface Club {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  colors?: ClubColors;
}

export interface Match {
  journee: number;
  date: string;
  domicile: string;
  exterieur: string;
  score: {
    domicile: number | null;
    exterieur: number | null;
  };
}
