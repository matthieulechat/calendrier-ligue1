import { useCallback, useState } from "react";
import type { LocalScores, ScoreField } from "@/lib/scores";

const readStorage = (storageKey: string): LocalScores => {
  try {
    return JSON.parse(localStorage.getItem(storageKey) ?? "{}");
  } catch {
    return {};
  }
};

interface UseLocalScores {
  scores: LocalScores;
  setScore: (key: string, field: ScoreField, value: number | null) => void;
}

export const useLocalScores = (storageKey: string): UseLocalScores => {
  const [scores, setScores] = useState<LocalScores>(() =>
    readStorage(storageKey),
  );

  const setScore = useCallback(
    (key: string, field: ScoreField, value: number | null) => {
      setScores((prev) => {
        const entry = prev[key] ?? { domicile: null, exterieur: null };
        const next = { ...prev, [key]: { ...entry, [field]: value } };
        localStorage.setItem(storageKey, JSON.stringify(next));
        return next;
      });
    },
    [storageKey],
  );

  return { scores, setScore };
};
