import { makeAutoObservable } from 'mobx';
import { dataTable } from '@/store/data-store';

interface GxpSettings {
  unit: string;
  expression_field_sep: string;
  expression_header_sep: string;
  info_field_sep: string;
  groupOrder: string[];
  sampleOrder: string[];
}

interface Preloaded {
  data: string;
  info: string;
  image: string;
  settings: string;
}

const PRELOAD_DATA = import.meta.env.VITE_PRELOAD_DATA;
const PRELOAD_IMAGE = import.meta.env.VITE_PRELOAD_IMAGE;
const PRELOAD_INFO = import.meta.env.VITE_PRELOAD_INFO;
const PRELOAD_SETTINGS = import.meta.env.VITE_PRELOAD_SETTINGS;

class Settings {
  _PRELOADED: Preloaded = {
    data: '',
    info: '',
    image: '',
    settings: '',
  };

  _gxpSettings: GxpSettings = {
    unit: '',
    expression_field_sep: '\t',
    expression_header_sep: '*',
    info_field_sep: '\t',
    groupOrder: [],
    sampleOrder: [],
  };

  _isPreloading = false;

  constructor(preloaded: Preloaded) {
    Object.assign(this._PRELOADED, preloaded);
    makeAutoObservable(this);
  }

  get preloaded(): Preloaded {
    return this._PRELOADED;
  }

  get isPreloading(): string | boolean {
    return this.preloaded.data && !dataTable.hasData;
  }

  get gxpSettings(): GxpSettings {
    return this._gxpSettings;
  }

  get groupOrder(): string[] {
    return this._gxpSettings.groupOrder;
  }

  get sampleOrder(): string[] {
    return this._gxpSettings.sampleOrder;
  }

  get unit(): string {
    return this._gxpSettings.unit;
  }

  loadgxpSettings(gxpSettings: Partial<GxpSettings>): void {
    Object.assign(this._gxpSettings, gxpSettings);
  }

  setGroupOrder(groupOrder: string[]): void {
    this._gxpSettings.groupOrder = groupOrder;
  }

  setSampleOrder(sampleOrder: string[]): void {
    this._gxpSettings.sampleOrder = sampleOrder;
  }
}

export const settings = new Settings({
  data: PRELOAD_DATA,
  info: PRELOAD_INFO,
  image: PRELOAD_IMAGE,
  settings: PRELOAD_SETTINGS,
});
