import { defineStore } from 'pinia';
import type MusicClassDto from '@/interfaces/music-class/musicClassDto';
import type MusicClassState from '@/interfaces/music-class/musicClassState';

export const useMusicClassStore = defineStore('musicClass', {
  state: (): MusicClassState => ({
    musicClasses: [],
    musicClass: null,
  }),

  actions: {
    setMusicClasses(musicClasses: MusicClassDto[]) {
      this.musicClasses = musicClasses;
    },

    setMusicClass(musicClass: MusicClassDto) {
      this.musicClass = musicClass;
    },

    addMusicClass(musicClass: MusicClassDto) {
      this.musicClasses.push(musicClass);
    },

    updateMusicClass(updatedMusicClass: MusicClassDto) {
      const index = this.musicClasses.findIndex(mc => mc.id === updatedMusicClass.id);
      if (index !== -1) {
        this.musicClasses[index] = updatedMusicClass;
      }
    },

    deleteMusicClass(musicClassToDelete: MusicClassDto) {
      this.musicClasses = this.musicClasses.filter(mc => mc.id !== musicClassToDelete.id);
    },

    resetMusicClass() {
      this.musicClass = null;
    },
  },
});