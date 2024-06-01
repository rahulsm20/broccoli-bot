import { useSelector } from "react-redux";
import { loginTwitch } from "../api";
import { RootState } from "../types";
import { Link } from "react-router-dom";

const Navbar = () => {
  const handleTwitchLogin = async () => {
    await loginTwitch();
  };

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.twitch.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.twitch.user);
  return (
    <div className="nav flex flex-col lg:flex-row gap-5 shadow-sm shadow-gray-900 sticky w-full items-center justify-center p-4 backdrop-blur-xl top-0 z-10 bg-black">
      <img src="/broccoli-icon.svg" className="w-10" />
      <ul className="flex font-semibold gap-5  rounded-3xl p-3 items-center justify-center ml-2 text-sm flex-center">
        <li>
          <Link
            to="https://github.com/rahulsm20/broccoli-bot/blob/main/README.md"
            className="p-2 self-center flex gap-1"
            target="_blank"
          >
            Docs
            <img src="/arrow-up-right.svg" className="w-3.5" />
          </Link>
        </li>
        <li>
          <Link
            to="https://github.com/rahulsm20/broccoli-bot"
            className="p-2 self-center flex gap-1"
            target="_blank"
          >
            Github
            <img src="/arrow-up-right.svg" className="w-3.5" />
          </Link>
        </li>
        <li>
          <Link to="/queue" className="p-2 self-center flex gap-1">
            Queue
          </Link>
        </li>
      </ul>
      {isAuthenticated && user ? (
        <button className="flex justify-center items-center gap-3  bg-violet-800 hover:bg-violet-800 text-white btn rounded-full">
          {user.username}
          <img src={user.avatarurl} className="w-8 rounded-full"></img>
        </button>
      ) : (
        <button
          className="flex justify-center items-center gap-3 bg-slate-200 text-black hover:bg-violet-800 hover:text-white btn"
          onClick={handleTwitchLogin}
        >
          Login with Twitch
          <img
            src="https://static-00.iconduck.com/assets.00/twitch-icon-511x512-qrwypaov.png"
            className="w-8"
          />
        </button>
      )}
    </div>
  );
};

export default Navbar;
