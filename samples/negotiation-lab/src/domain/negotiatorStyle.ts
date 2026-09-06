export const NEGOTIATOR_STYLES = [
  { id: 'cool', label: 'Cool', approach: 'Flexible and collaborative; readily offers a useful concession and explores workable trades.' },
  { id: 'medium', label: 'Medium', approach: 'Balanced and reciprocal; offers a moderate concession in return for something valuable.' },
  { id: 'hard', label: 'Hard', approach: 'Firm but constructive; makes smaller concessions and expects a clear return, without refusing every workable trade.' }
] as const;
export type NegotiatorStyle = typeof NEGOTIATOR_STYLES[number]['id'];
export function getNegotiatorStyle(style?: NegotiatorStyle): typeof NEGOTIATOR_STYLES[number] {
  return NEGOTIATOR_STYLES.find(({ id }) => id === style) ?? NEGOTIATOR_STYLES[1];
}
