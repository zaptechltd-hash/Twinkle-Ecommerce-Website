import {STATUS_STYLES } from '../data/data'

export function Badge({ status }) {
  return (
    <span className={`text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 
      ${STATUS_STYLES[status] || "bg-stone-100 text-stone-500"}`}>
      {status}
    </span>
  )
}