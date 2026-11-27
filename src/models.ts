// The models the site compares (docs/research.md in icebit-no/skald, Models). Word errors per 100 words on FLEURS
// are the National Library's paper's, measured the same way for every model; a model measured any other way has no
// number here and is drawn without a bar.

export const paperUrl = 'https://arxiv.org/abs/2402.01917';
export const nationalLibraryUrl = 'https://huggingface.co/NbAiLab';

export interface Model {
  name: string;
  url: string;
  maker: 'Nasjonalbiblioteket' | 'OpenAI';
  /** Word errors per 100 words on FLEURS, from the paper; absent until the model is measured the same way. */
  fleurs?: number;
  inSkald?: 'default' | 'beta';
}

export const models: Model[] = [
  { name: 'NB-Whisper Large', url: 'https://huggingface.co/NbAiLab/nb-whisper-large', maker: 'Nasjonalbiblioteket', fleurs: 6.6, inSkald: 'default' },
  { name: 'NB-Whisper Medium', url: 'https://huggingface.co/NbAiLab/nb-whisper-medium', maker: 'Nasjonalbiblioteket', fleurs: 7.2 },
  { name: 'NB-Whisper Small', url: 'https://huggingface.co/NbAiLab/nb-whisper-small', maker: 'Nasjonalbiblioteket', fleurs: 8.3 },
  { name: 'Whisper large-v3', url: 'https://huggingface.co/openai/whisper-large-v3', maker: 'OpenAI', fleurs: 10.4 },
  { name: 'NB-Whisper Base', url: 'https://huggingface.co/NbAiLab/nb-whisper-base', maker: 'Nasjonalbiblioteket', fleurs: 11.5 },
  { name: 'Whisper small', url: 'https://huggingface.co/openai/whisper-small', maker: 'OpenAI', fleurs: 29.6 },
  { name: 'NB-ASR Bokfink', url: 'https://huggingface.co/NbAiLab/nb-asr-qwen06b-bokfink02-beta', maker: 'Nasjonalbiblioteket', inSkald: 'beta' },
];

/** The value a full bar stands for: the largest number, rounded up to a whole ten. */
export const scaleMax = Math.ceil(Math.max(...models.map((m) => m.fleurs ?? 0)) / 10) * 10;
