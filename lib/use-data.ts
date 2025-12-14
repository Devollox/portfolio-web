import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type ItemWithKey = { key: string; [key: string]: any }

const useData = <T extends ItemWithKey>(data: T[]) => {
  const { query } = useRouter()
  const { filter } = query

  const [items, setItems] = useState<T[]>(data)

  useEffect(() => {
    if (!filter) {
      if (items !== data) setItems(data)
      return
    }

    const filterValue = Array.isArray(filter) ? filter[0] : filter
    const filtered = data.filter(i => i.key === filterValue)
    setItems(filtered)
  }, [filter, data, items])

  return { filter, items }
}

export default useData
