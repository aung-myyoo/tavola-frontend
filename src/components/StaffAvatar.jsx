import { photoUrl } from '../api/client'

const PALETTE = ['#ff8a3d', '#5aa9ff', '#4ade80', '#fbbf24', '#f87171', '#a78bfa']

function colorFor(name) {
  const sum = [...(name ?? '?')].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return PALETTE[sum % PALETTE.length]
}

function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0].slice(0, 2)
}

export default function StaffAvatar({ name, photoUrl: path, size = 40 }) {
  const url = photoUrl(path)
  const style = {
    width: size,
    height: size,
    fontSize: Math.max(11, size * 0.34),
  }

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className="avatar"
        style={{ ...style, objectFit: 'cover' }}
      />
    )
  }

  return (
    <div className="avatar" style={{ ...style, background: colorFor(name) }}>
      {initials(name).toUpperCase()}
    </div>
  )
}
