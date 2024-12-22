export interface Location {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    description: string;
    category: 'historical' | 'nature' | 'cultural' | 'beach' | 'city';
  }