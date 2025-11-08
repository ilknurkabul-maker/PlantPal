export interface PlantInfo {
  plantName: string;
  wateringFrequencyDays: number;
  error?: string;
}

export interface Schedule {
  plantName: string;
  startDate: string;
  frequency: number;
  nextWateringDate: string;
}
