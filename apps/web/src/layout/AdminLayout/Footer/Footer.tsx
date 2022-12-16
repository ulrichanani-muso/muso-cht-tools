import React from 'react'
import useChtColor from 'src/hooks/useChtColor'

export default function Footer() {
  const [_, bgClasses] = useChtColor()

  return (
    <footer className={'footer flex-column flex-md-row border-top d-flex align-items-center justify-content-between px-4 py-2 ' + bgClasses}>
      <div>
        © 2022
        Muso CHT Utils.
      </div>
    </footer>
  )
}
