/**
 * PageBreadcrumb — reusable HeroUI Breadcrumbs wrapper.
 *
 * Props:
 *   items    — Array<{ label: string, href?: string }>
 *              Last item = current page (no href → non-clickable)
 *   className — extra Tailwind classes
 */

import { useNavigate } from 'react-router-dom'
import { Breadcrumbs, BreadcrumbsItem } from '@heroui/react'

export default function PageBreadcrumb({ items = [], className = '' }) {
  const navigate = useNavigate()

  return (
    <Breadcrumbs size="sm" className={className}>
      {items.map((item, i) => (
        <BreadcrumbsItem
          key={i}
          onPress={item.href ? () => navigate(item.href) : undefined}
        >
          {item.label}
        </BreadcrumbsItem>
      ))}
    </Breadcrumbs>
  )
}
