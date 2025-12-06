export enum RefineMode {
  PROOFREAD_EN = 'PROOFREAD_EN',
  TRANSLATE_EN = 'TRANSLATE_EN',
  TABLE_FORMAT = 'TABLE_FORMAT',
  PROOFREAD_PT = 'PROOFREAD_PT',
  SUMMARIZE = 'SUMMARIZE'
}

export interface RefineOption {
  id: RefineMode;
  label: string;
  icon: string;
  description: string;
  color: string;
}

export interface ProcessingState {
  isLoading: boolean;
  error: string | null;
}