import { useEffect } from 'react'

export default function Seo({ title, description, url, image }) {
  useEffect(() => {
    const previousTitle = document.title
    const metaDescription = document.querySelector('meta[name="description"]')
    const previousDescription = metaDescription && metaDescription.getAttribute('content')

    if (title) document.title = title
    if (description) {
      if (metaDescription) {
        metaDescription.setAttribute('content', description)
      } else {
        const tag = document.createElement('meta')
        tag.name = 'description'
        tag.content = description
        document.head.appendChild(tag)
      }
    }

    // Open Graph minimal tags
    function setOg(name, value) {
      if (!value) return
      let el = document.querySelector(`meta[property="og:${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', `og:${name}`)
        document.head.appendChild(el)
      }
      el.setAttribute('content', value)
    }

    setOg('title', title || previousTitle)
    setOg('description', description || previousDescription)
    if (url) setOg('url', url)
    if (image) setOg('image', image)

    return () => {
      document.title = previousTitle
      if (metaDescription && previousDescription) metaDescription.setAttribute('content', previousDescription)
    }
  }, [title, description, url, image])

  return null
}
