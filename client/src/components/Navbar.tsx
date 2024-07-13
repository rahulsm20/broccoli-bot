import { ArrowUpRight } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loginTwitch } from "../api";
import { RootState } from "../types";
import { ModeToggle } from "./mode-toggle";
import { SettingsMenu } from "./SettingsMenu";

const Navbar = () => {
  const handleTwitchLogin = async () => {
    await loginTwitch();
  };

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.twitch.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.twitch.user);
  return (
    <div className="nav flex flex-col lg:flex-row gap-5 sticky w-full items-center justify-center p-4 backdrop-blur-md  top-0 z-10 ">
      <img src="/broccoli-icon.svg" className="w-10" />
      <ul className="flex font-semibold gap-5  rounded-3xl p-3 items-center justify-center ml-2 text-sm flex-center">
        <li>
          <Link
            to="https://github.com/rahulsm20/broccoli-bot/blob/main/README.md"
            className="p-2 self-center flex gap-1"
            target="_blank"
          >
            Docs
          </Link>
        </li>
        <li>
          <Link
            to="https://github.com/rahulsm20/broccoli-bot"
            className="self-center flex gap-1 items-center justify-center align-bottom"
            target="_blank"
          >
            Github
            <ArrowUpRight size={15} />
          </Link>
        </li>
        <li>
          <Link to="/queue" className="p-2 self-center flex gap-1">
            Queue
          </Link>
        </li>
        <li>
          <Link to="/commands" className="p-2 self-center flex gap-1">
            Commands
          </Link>
        </li>
      </ul>
      <div className="flex gap-4">
        {isAuthenticated && user ? (
          <button className="flex justify-center items-center gap-3  bg-violet-800 hover:bg-violet-800 text-white btn rounded-full">
            {user.username}
            <img src={user.avatarurl} className="w-8 rounded-full"></img>
          </button>
        ) : (
          <button
            className="btn  flex justify-center items-center gap-3 border-0 text-black bg-slate-100 dark:bg-slate-200  hover:bg-violet-800 "
            onClick={handleTwitchLogin}
          >
            Login with Twitch
            <img
              src="https://static-00.iconduck.com/assets.00/twitch-icon-511x512-qrwypaov.png"
              className="w-8"
            />
          </button>
        )}
        {/* <button className="btn bg-transparent hover:bg-transparent border-0">
          <img alt="settings-icon" src="/settings.svg" className="w-6" />
        </button> */}
        <ModeToggle />
        <SettingsMenu />
      </div>
    </div>
  );
};

export default Navbar;
