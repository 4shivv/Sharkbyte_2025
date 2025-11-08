import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export const MobileNav = ({ navItems, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // wait for animation
  }

  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center lg:hidden w-screen">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 
          ${isVisible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`relative z-50 bg-gray-800 rounded-t-4xl backdrop-blur-sm shadow-2xl border border-gray-700
          pt-5 px-6 pb-10 transition-all duration-300 flex flex-col gap-5 w-full max-w-lg
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"}`}
      >
        {/* Close Button */}
        <div className="self-end">
          <FontAwesomeIcon
            icon={faXmark}
            onClick={handleClose}
            className="cursor-pointer text-white rounded-full px-3 py-2 mb-6 hover:bg-forest active:bg-zinc-300/75"
          />
        </div>

        {/* Nav Items */}
        {navItems.map(({ icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            onClick={handleClose}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-full px-6 py-3 transition-all duration-300 ${
                isActive
                  ? "text-white bg-forest"
                  : "text-white/60 hover:text-white hover:bg-forest/80"
              } ${isVisible ? "opacity-100" : "opacity-0"}`
            }
          >
            {icon && <FontAwesomeIcon icon={icon} />}
            <span className="font-normal">{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}
