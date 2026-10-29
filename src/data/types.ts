import React from 'react';
import { Step } from '@/components/StepLayout';


export type SubQuestionData = {
  id: string; // e.g. "1", "2-(1)"
  title: string;
  knowledge: string[];
  originalText: React.ReactNode;
  steps: Step[];
};

export type MajorQuestionData = {
  id: string; // e.g. "q1"
  title: string;
  subs: SubQuestionData[];
};

