import React from 'react'
import "../css/Navbar.css"
import ProfileButton from './ProfileButton'
function Navbar(props) {
  return (
   <>
    <div class="navbar-container">
{props.name}
  {/* <ProfileButton class="profile-button" /> */}
  <ProfileButton />
</div>
   </>
  )
}
export default Navbar