const APP_ID = '741a9a38c962b0358f470cdd1284392204e36a74a24fe68575a2894d699bed23'
const API_URL = 'https://api.unsplash.com'
const RES_STATUS = {
  SUCCESS: 200
}

const LOADING_STATUS = {
  LOADING: 'LOADING',
  OK: 'OK',
  FAILED: 'FAILED',
  NOMORE: 'NOMORE'
};


const EXIFS = [{
    text: 'CAMERA MAKE',
    field: 'make'
  },
  {
    text: 'CAMERA MODEL',
    field: 'model'
  },
  {
    text: 'FOCAL LENGTH',
    field: 'focal_length',
    render(val) {
      return val ? val + 'mm' : val
    }
  },
  {
    text: 'ISO',
    field: 'iso',
  },
  {
    text: 'APERTURE',
    field: 'aperture'
  },
  {
    text: 'SHUTTER',
    field: 'exposure_time',
    render(val) {
      return val ? val + 'S' : val
    }
  }
]

const STORAGE_KEYS = {
  CENTER_BG: 'center_bg'
}


export {
  APP_ID,
  API_URL,
  RES_STATUS,
  LOADING_STATUS,
  EXIFS,
  STORAGE_KEYS
}
