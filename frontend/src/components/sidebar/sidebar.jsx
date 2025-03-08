import SearchInput from './searchInput'
import Conversations from './Conversations'

const SideBar = () => {
  return (
    <div>
        <SearchInput />
        <div className='divider px-3'></div>
        <Conversations />
        {/* <LogoutButton /> */}
    </div>
  )
}

export default SideBar