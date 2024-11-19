export interface News{
  [key: string]:{
    articles: Article[];
  }
}

export interface Article {
  aut?: string
  id?: string
  id_user?: string
  is_public?: string
  abstract?: string
  subtitle?: string
  update_date?: string
  category?: string
  title?: string
  is_deleted?: string
  thumbnail_image?: string
  thumbnail_media_type?: string
  username?: string
}

export interface ArticleDetails {
  id?: string
  id_user: string
  is_public: string
  abstract: string
  body: string
  subtitle: string
  update_date: string
  category: string
  title: string
  is_deleted: string
  username: string
  image_data: string
  image_description: any
  image_media_type: string
}
