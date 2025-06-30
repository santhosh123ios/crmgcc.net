import React from 'react'
import classNames from 'classnames';
import './Main.css'


// Define your style classes
const styleClasses = {
  subDarkBold: 'sub-dark-bold',
  subDark: 'sub-dark',
  darkBold: 'dark-bold',
  dark: 'dark',
  subLightBold: 'sub-light-bold',
  subLight: 'sub-light',
  lightBold: 'light-bold',
  light: 'light',
};

function TextView({ strike = false, overflow = false, type = 'dark', text, className = '', ...props }) {

  const buttonClass = classNames(
    'px-4 py-2 rounded font-medium transition-colors duration-300',
    strike? 'text-strike': '',
    overflow? 'text-overflow-ellipsis': '',
    styleClasses[type], // Dynamic type-based style
    className, // Any extra classes

  );

  return (
   <p className={buttonClass} {...props}>
      {text}
    </p>
  )
}

export default TextView
