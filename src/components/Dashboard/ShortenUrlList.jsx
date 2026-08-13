import React from 'react'
import ShortenItem from './ShortenItem'

const ShortenUrlList = ({ data, onDelete, selectable, selectedIds, onToggleSelect }) => {
  return (
    <div className='my-6 space-y-4'>
        {(data || []).map((item) => (
            <ShortenItem
                key={item.id}
                {...item}
                onDelete={onDelete}
                selectable={selectable}
                selected={selectedIds?.has(item.id)}
                onToggleSelect={onToggleSelect}
            />
        ))}
    </div>
  )
}

export default ShortenUrlList