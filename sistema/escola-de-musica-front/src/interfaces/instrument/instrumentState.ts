import type InstrumentDto from './instrumentDto';

export default interface InstrumentState {
  instruments: InstrumentDto[];
  instrument: InstrumentDto | null;
}