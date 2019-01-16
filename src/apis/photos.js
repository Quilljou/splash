import get from "lodash.get";
import Taro from '@tarojs/taro'
import parse from "url-parse";

function getUrlComponents(uri: String): Object {
  return parse(uri, {}, true);
}
class Photos {
  listPhotos({page = 1, perPage = 10, orderBy = "latest"}) {
    const url = "/photos";
    const query = {
      page,
      per_page: perPage,
      order_by: orderBy
    };

    return this.request({
      url,
      query
    });
  }

  listCuratedPhotos({page = 1, perPage = 10, orderBy = "latest"}) {
    const url = "/photos/curated";
    const query = {
      page,
      per_page: perPage,
      order_by: orderBy
    };

    return this.request({
      url,
      method: "GET",
      query
    });
  }

  getPhoto({id, width, height, rectangle}) {
    const url = `/photos/${id}`;
    const query = {
      w: width,
      h: height,
      rect: rectangle
    };

    return this.request({
      url,
      method: "GET",
      query
    });
  }

  searchPhotos(q, category = [""], page = 1, perPage = 10) {
    const url = "/photos/search";
    const query = {
      query: q,
      category: category.length > 1 ?
        category.join(",") : category.toString(),
      page,
      per_page: perPage
    };

    return this.request({
      url,
      method: "GET",
      query
    });
  }

  getDownLoadUrl (photo){
    const downloadLocation = get(photo, "links.download_location", undefined);
    if (downloadLocation === undefined) {
      throw new Error(`Object received is not a photo. ${photo}`);
    }

    const urlComponents = getUrlComponents(downloadLocation);

    return this.request({
      url: urlComponents.pathname,
      method: "GET",
      query: urlComponents.query
    });
  }

  downloadPhoto(url) {
    let header = Object.assign({}, {
      "Accept-Version": this._apiVersion,
      "Authorization": this._bearerToken ?
        `Bearer ${this._bearerToken}` : `Client-ID ${this._applicationId}`
    });


    return Taro.downloadFile({
      url,
      header
    })
  }
}

export default Photos;
