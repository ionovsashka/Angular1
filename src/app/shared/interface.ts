export interface User{
  email: string,
  password: string,
  returnSecureToken?: boolean
} // Интерфейс для админа

export interface FbAuthResponse{
  idToken: string,
  expiresIn: string
}

export interface Post{
  title: string
  text: string
  author: string
  date: Date
  id?: string
}

export interface FbCreateResponse{
  name: string
}

export interface Alert{
  type: string,
  text: string
}
