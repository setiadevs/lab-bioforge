
export enum SpecimenCategory {
  ANIMAL = 'Animal',
  PLANT = 'Plant',
  FANTASY = 'Fantasy',
  MICROBE = 'Microbe',
  HYBRID = 'Hybrid'
}

export interface GeneticTraits {
  habitat: string;
  behavior: string;
  primaryColor: string;
  size: 'Microscopic' | 'Small' | 'Medium' | 'Large' | 'Colossal';
  stability: number;
}

export interface SpecimenProfile {
  id: string;
  name: string;
  scientificName: string;
  category: SpecimenCategory;
  description: string;
  taxonomy: string;
  uniqueAbilities: string[];
  habitatDetail: string;
  diet: string;
  lifespan: string;
  imageUrl: string;
  timestamp: number;
}

export interface CreationRequest {
  category: SpecimenCategory;
  baseIdea: string;
  traits: GeneticTraits;
}
