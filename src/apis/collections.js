class Collections {
  listCollections(page = 1, perPage = 10){
    const url = "/collections";

    const query = {
      page,
      per_page: perPage
    };

    return this.request({
      url: url,
      method: "GET",
      query
    });
  }

  listFeaturedCollections(page = 1, perPage = 10){
    const url = "/collections/featured";
    const query = {
      page,
      per_page: perPage
    };

    return this.request({
      url: url,
      method: "GET",
      query
    });
  }

  collection(id, isCurated = false) {
    const url = isCurated ?
      `/collections/curated/${id}` :
      `/collections/${id}`;

    return this.request({
      url: url,
      method: "GET"
    });
  }

  collectionPhotos({
    id,
    page = 1,
    perPage = 10,
    orderBy = "latest",
    isCurated = false
  }) {
    const url = isCurated ?
      `/collections/curated/${id}/photos` :
      `/collections/${id}/photos`;

    const query = {
      page,
      per_page: perPage,
      order_by: orderBy
    };

    return this.request({
      url: url,
      method: "GET",
      query
    });
  }
}

export default Collections;
