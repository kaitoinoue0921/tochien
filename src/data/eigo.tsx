import { MajorQuestionData } from './types';
import { eigoK } from './eigo_k';
import { eigoR } from './eigo_r';

// 英語版：対話文とグラフ・図を読む形式（栃木県入試の英語 大問5など）
export const eigoData: Record<string, MajorQuestionData> = { ...eigoK, ...eigoR };
