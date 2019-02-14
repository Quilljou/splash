
export default class User {
  userProfile(username){
    const url = `/users/${username}`;

    return this.request({
      url,
      method: "GET"
    });
  }

  userPhotos(
    {username,
    page = 1,
    perPage = 10,
    orderBy = "latest",
    stats = false}
  ) {
    const url = `/users/${username}/photos`;
    const query = {
      page,
      per_page: perPage,
      order_by: orderBy,
      stats
    };

    return this.request({
      url,
      method: "GET",
      query
    });
  }


userLikes ({username, page = 1, perPage = 10, orderBy = "latest"}) {
    const url = `/users/${username}/likes`;
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

  userCollections({username, page = 1, perPage = 10, orderBy = "published"}) {
    const url = `/users/${username}/collections`;
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
}
