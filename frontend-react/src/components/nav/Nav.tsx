import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import photoHostMini from '../../assets/photoHostMini.svg';

function Nav() {
  const userContext = useContext(UserContext);

  return (
    <div className="h-[50px] bg-slate-300 flex items-center space-x-5">
      <img src={photoHostMini} width="40" alt="PhotoHost Logo" />
      <div>
        {userContext.username}
      </div>
    </div>
  )
}

export default Nav;