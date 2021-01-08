import { makeAutoObservable } from 'mobx';
import { dataTable } from '@/store/data-store';

const PRELOAD_DATA = process.env.PRELOAD_DATA;
const PRELOAD_INFO = process.env.PRELOAD_INFO;
const PRELOAD_IMAGE = process.env.PRELOAD_IMAGE;
const PRELOAD_SETTINGS = process.env.PRELOAD_SETTINGS;

class Settings {

  _PRELOADED = {
    data: '',
    info: '',
    image: '',
    settings: '',
  };

  _tableSettings = {
    'unit': '',
    'expression_field_sep': '\t',
    'expression_header_sep': '*',
    'info_field_sep': '\t'
  };

  _isPreloading = false;

  constructor (preloaded) {
    Object.assign(this._PRELOADED, preloaded);
    makeAutoObservable(this);
  }

  get preloaded () {
    return this._PRELOADED;
  }

  get isPreloading () {
    return this.preloaded.data && !dataTable.hasData;
  }
  
  get tableSettings () {
    return this._tableSettings;
  }

  loadTableSettings (tableSettings) {
    Object.assign(this._tableSettings, tableSettings);
  }

}

export const settings = new Settings({
  data: PRELOAD_DATA,
  info: PRELOAD_INFO,
  image: PRELOAD_IMAGE,
  settings: PRELOAD_SETTINGS,
});
