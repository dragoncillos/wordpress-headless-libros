import type { Post } from '../types/post'
// para que la siguiente línea no dé el error "La propiedad 'env'
// no existe en el tipo 'ImportMeta'" necesitas agregar una declaración
// de tipo para import.meta.env.
// Crea un archivo llamado env.d.ts en la raíz de tu proyecto
// (o en una carpeta types si prefieres organizarlo así).
const domain = import.meta.env.WP_DOMAIN
const apiUrl = `${domain}/wp-json/wp/v2`

export const getPageInfo = async (slug: string) => {
  const response = await fetch(`${apiUrl}/pages?slug=${slug}`)
  if (!response.ok)
    throw new Error(
      'Falló la página al hacer fetch al obtener la información de la página'
    )

  // const data = await response.json()
  // console.log(data)
  const [data] = await response.json() // destructuramos el array que accede a la primera posición
  //const { title, content } = data // destructuramos el objeto, solo queremos title y content
  const {
    title: { rendered: title },
    content: { rendered: content }
  } = data // a su vez destructuramos title y content y les cambiamos el nombre

  //return data
  return { title, content }
}

export const getPosts = async ({ perPage = 10 }: { perPage?: number } = {}) => {
  const response = await fetch(`${apiUrl}/posts/?per_page=${perPage}&_embed`)
  if (!response.ok)
    throw new Error('Falló la página al hacer fetch para obtener los posts')

  //const [data] = await response.json() // No podemos recuperar el primer elemento del array pq tenemos más de un post

  // https://www.dragoncillos.com/WordPressHeadless/wp-json/wp/v2/posts?slug=la-pedriza-sierra-de-guadarrama. De aquí nos interesa el date, title, excerpt, slug, y el feature_media
  const results = await response.json()
  if (!results.length) throw new Error('No se encontraron posts')
  //console.log(results)

  // Transformamos el array de posts en un array de objetos con las propiedades que nos interesan
  const posts = results.map((post: Post) => {
    // const {
    //   title: { rendered: title },
    //   excerpt: { rendered: excerpt },
    //   content: { rendered: content },
    //   date,
    //   slug
    // _embedded: {
    //   'wp:featuredmedia': [{ source_url: featuredImage }]
    // } = post

    // Lo de arriba es una forma corta (desestructurar y poniendo el nombre que queremos) de hacer lo siguiente:
    const title = post.title.rendered
    const excerpt = post.excerpt.rendered
    const content = post.content.rendered
    // const date = post.date
    // const slug = post.slug

    // Incluso estas dos ultimas línea se pueden hacer en una sola línea:
    const { date, slug } = post

    const featuredImage = post._embedded['wp:featuredmedia'][0].source_url

    return { title, excerpt, content, date, slug, featuredImage }
  })

  return posts
}

export const getPostInfo = async (slug: string) => {
  const response = await fetch(`${apiUrl}/posts?slug=${slug}`)
  if (!response.ok)
    throw new Error(
      'Falló la página al hacer fetch al obtener la información de la página'
    )

  // const data = await response.json()
  // console.log(data)
  const [data] = await response.json() // destructuramos el array que accede a la primera posición
  //const { title, content } = data // destructuramos el objeto, solo queremos title y content
  const {
    title: { rendered: title },
    yoast_head_json: seo,
    content: { rendered: content }
  } = data // a su vez destructuramos title y content y les cambiamos el nombre

  //return data
  return { title, content, seo }
}

// Nos devuelve un array con los slugs (urls) de todos los posts
export const getAllPostsSlugs = async () => {
  const response = await fetch(`${apiUrl}/posts?per_page=100`)
  if (!response.ok)
    throw new Error('Falló la página al hacer fetch al obtener los slugs')

  const results = await response.json()
  if (!results.length) throw new Error('No se encontraron posts')

  const slugs = results.map((post) => post.slug)
  console.log(slugs)
  return slugs
}
