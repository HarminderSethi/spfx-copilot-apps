import type { IZavaEmployeeExperience } from '../models/zavaEmployee';

export interface IZavaEmployeeDataService {
  getEmployeeExperience(now?: Date): IZavaEmployeeExperience;
}