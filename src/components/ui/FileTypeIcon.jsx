/**
 * FileTypeIcon
 *
 * Colored icon circle keyed to file type.
 * Used in: UploadZone (uploading row, confirmed state).
 *
 * Props:
 *   type  — 'pdf' | 'docx' | 'image' | 'xlsx' | 'pptx'
 *   size  — 32 | 40 (px). Default 40.
 */

import { FileText, FileImage, Table2, Monitor, Camera } from 'lucide-react'

const CONFIG = {
  pdf:         { Icon: FileText,  bg: 'bg-accent-soft',  color: 'text-accent' },
  docx:        { Icon: FileText,  bg: 'bg-info-soft',    color: 'text-info' },
  image:       { Icon: Camera,    bg: 'bg-purple-soft',  color: 'text-purple' },
  handwritten: { Icon: Camera,    bg: 'bg-purple-soft',  color: 'text-purple' },
  xlsx:        { Icon: Table2,    bg: 'bg-teal-soft',    color: 'text-teal' },
  pptx:        { Icon: Monitor,   bg: 'bg-pink-soft',    color: 'text-pink' },
}

export default function FileTypeIcon({ type = 'pdf', size = 40 }) {
  const { Icon, bg, color } = CONFIG[type] ?? CONFIG.pdf

  const circleClass = size === 32 ? 'w-8 h-8' : 'w-10 h-10'
  const iconClass   = size === 32 ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <div
      className={`${circleClass} rounded-full flex items-center justify-center shrink-0 ${bg}`}
    >
      <Icon
        className={`${iconClass} ${color}`}
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </div>
  )
}
