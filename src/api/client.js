const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080'

let authToken = null

export function setAuthToken(token) {
  authToken = token
}

async function request(path, { method = 'GET', body, isMultipart = false } = {}) {
  const headers = {}
  if (authToken) headers.Authorization = `Bearer ${authToken}`
  if (!isMultipart && body !== undefined) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isMultipart ? body : body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const data = await res.json()
      if (data?.error) message = data.error
    } catch {
      // response had no JSON body
    }
    throw new Error(message)
  }

  if (res.status === 204) return null
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
  upload: (path, file) => {
    const form = new FormData()
    form.append('file', file)
    return request(path, { method: 'POST', body: form, isMultipart: true })
  },
}

export function photoUrl(path) {
  if (!path) return null
  return `${API_BASE}${path}`
}
