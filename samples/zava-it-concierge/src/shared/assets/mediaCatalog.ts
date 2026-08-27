import adelePortrait from './people/Adele-Vance.png';
import alexPortrait from './people/Alex-Wilber.png';
import diegoPortrait from './people/Diego-Siciliani.png';
import johannaPortrait from './people/Johanna-Lorenz.png';
import leePortrait from './people/Lee-Gu.png';
import meganPortrait from './people/Megan-Bowen.png';
import nestorPortrait from './people/Nestor-Wilke.png';
import pattiPortrait from './people/Patti-Fernandez.png';
import pradeepPortrait from './people/Pradeep-Gupta.png';
import surfaceLaptop from './products/surface-laptop.png';
import surfacePro from './products/surface-pro.png';

export type PersonaMediaKey = 'megan' | 'diego' | 'lee' | 'adele' | 'alex' | 'johanna' | 'nestor' | 'patti' | 'pradeep';

export interface IPersonaMedia {
  readonly src: string;
  readonly alt: string;
  readonly initials: string;
}

export const PERSONA_MEDIA: Readonly<Record<PersonaMediaKey, IPersonaMedia>> = {
  megan: { src: meganPortrait, alt: 'Megan Bowen', initials: 'MB' },
  diego: { src: diegoPortrait, alt: 'Diego Siciliani', initials: 'DS' },
  lee: { src: leePortrait, alt: 'Lee Gu', initials: 'LG' },
  adele: { src: adelePortrait, alt: 'Adele Vance', initials: 'AV' },
  alex: { src: alexPortrait, alt: 'Alex Wilber', initials: 'AW' },
  johanna: { src: johannaPortrait, alt: 'Johanna Lorenz', initials: 'JL' },
  nestor: { src: nestorPortrait, alt: 'Nestor Wilke', initials: 'NW' },
  patti: { src: pattiPortrait, alt: 'Patti Fernandez', initials: 'PF' },
  pradeep: { src: pradeepPortrait, alt: 'Pradeep Gupta', initials: 'PG' }
};

export const PERSONA_MEDIA_BY_NAME: Readonly<Record<string, IPersonaMedia>> = {
  'Megan Bowen': PERSONA_MEDIA.megan,
  'Diego Siciliani': PERSONA_MEDIA.diego,
  'Lee Gu': PERSONA_MEDIA.lee,
  'Adele Vance': PERSONA_MEDIA.adele,
  'Alex Wilber': PERSONA_MEDIA.alex,
  'Johanna Lorenz': PERSONA_MEDIA.johanna,
  'Nestor Wilke': PERSONA_MEDIA.nestor,
  'Patti Fernandez': PERSONA_MEDIA.patti,
  'Pradeep Gupta': PERSONA_MEDIA.pradeep
};

export interface ISurfaceProductMedia {
  readonly src: string;
  readonly alt: string;
  readonly family: 'Laptop' | 'Pro';
}

export const SURFACE_PRODUCT_MEDIA: Readonly<Partial<Record<string, ISurfaceProductMedia>>> = {
  'surface-laptop-13': { src: surfaceLaptop, alt: 'Black Microsoft Surface Laptop viewed from the rear with the keyboard open', family: 'Laptop' },
  'surface-laptop-138': { src: surfaceLaptop, alt: 'Black Microsoft Surface Laptop viewed from the rear with the keyboard open', family: 'Laptop' },
  'surface-laptop-15': { src: surfaceLaptop, alt: 'Black Microsoft Surface Laptop viewed from the rear with the keyboard open', family: 'Laptop' },
  'surface-pro-12': { src: surfacePro, alt: 'Platinum Microsoft Surface Pro with kickstand and keyboard open', family: 'Pro' },
  'surface-pro-13': { src: surfacePro, alt: 'Platinum Microsoft Surface Pro with kickstand and keyboard open', family: 'Pro' }
};