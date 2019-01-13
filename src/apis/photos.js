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
}

export default Photos;
