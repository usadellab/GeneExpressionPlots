import { makeAutoObservable } from 'mobx';
import { dataTable } from '@/store/data-store';

const PRELOAD_DATA = process.env.PRELOAD_DATA;
const PRELOAD_INFO = process.env.PRELOAD_INFO;
const PRELOAD_IMAGE = process.env.PRELOAD_IMAGE;

export class Settings {

  _PRELOADED = {};

  _isPreloading = false;

  constructor (preloaded) {
    this._PRELOADED = preloaded;
    makeAutoObservable(this);
  }

  get preloaded () {
    return this._PRELOADED;
  }

  get isPreloading () {
    return this.preloaded.data && !dataTable.hasData;
  }

}

export const settings = new Settings({
  data: PRELOAD_DATA,
  info: PRELOAD_INFO,
  image: PRELOAD_IMAGE,
});
