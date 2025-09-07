import { defineStore } from 'pinia';
import type InstrumentDto from '@/interfaces/instrument/instrumentDto';
import type InstrumentState from '@/interfaces/instrument/instrumentState';

export const useInstrumentStore = defineStore('instrument', {
  state: (): InstrumentState => ({
    instruments: [],
    instrument: null,
  }),

  actions: {
    setInstruments(instruments: InstrumentDto[]) {
      this.instruments = instruments;
    },

    setInstrument(instrument: InstrumentDto) {
      this.instrument = instrument;
    },

    addInstrument(instrument: InstrumentDto) {
      this.instruments.push(instrument);
    },

    updateInstrument(updatedInstrument: InstrumentDto) {
      const index = this.instruments.findIndex(i => i.id === updatedInstrument.id);
      if (index !== -1) {
        this.instruments[index] = updatedInstrument;
      }
    },

    deleteInstrument(instrumentToDelete: InstrumentDto) {
      this.instruments = this.instruments.filter(i => i.id !== instrumentToDelete.id);
    },

    resetInstrument() {
      this.instrument = null;
    },
  },
});