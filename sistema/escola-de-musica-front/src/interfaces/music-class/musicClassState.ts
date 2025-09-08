import type MusicClassDto from './musicClassDto';

export default interface MusicClassState {
  musicClasses: MusicClassDto[];
  musicClass: MusicClassDto | null;
}