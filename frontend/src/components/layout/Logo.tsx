import { useTheme } from '../../contexts/ThemeContext'

interface LogoProps {
  className?: string
}

export default function Logo({ className = 'h-8 w-8' }: LogoProps) {
  const { resolvedTheme } = useTheme()

  const fillStart = resolvedTheme === 'dark' ? '#34D399' : '#10B981'
  const fillEnd = resolvedTheme === 'dark' ? '#10B981' : '#059669'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={fillStart} />
          <stop offset="100%" stopColor={fillEnd} />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="url(#logo-grad)" />
      <ellipse cx="16" cy="16" rx="11.5" ry="4.5" stroke="white" strokeWidth="0.8" fill="none" opacity="0.5" />
      <ellipse cx="16" cy="16" rx="11.5" ry="9" stroke="white" strokeWidth="0.8" fill="none" opacity="0.35" />
      <ellipse cx="16" cy="16" rx="4.5" ry="11.5" stroke="white" strokeWidth="0.8" fill="none" opacity="0.5" />
      <ellipse cx="16" cy="16" rx="9" ry="11.5" stroke="white" strokeWidth="0.8" fill="none" opacity="0.35" />
      <line x1="4" y1="16" x2="28" y2="16" stroke="white" strokeWidth="0.7" opacity="0.25" />
      <line x1="16" y1="4" x2="16" y2="28" stroke="white" strokeWidth="0.7" opacity="0.25" />
      <circle cx="11" cy="10" r="4" fill="white" opacity="0.08" />
    </svg>
  )
}
