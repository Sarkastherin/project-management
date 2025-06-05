import Logo from "../../../public/logo_white.svg";
import { NavLink } from "react-router";
import LightIcon from "../icons/light";
import { useUI } from "~/context/UIContext";
type MyLinkProps = {
  to: string;
  children: React.ReactNode;
};
export default function Header() {
  const { toggleTheme } = useUI();
  const MyLink = ({ to, children }: MyLinkProps) => {
    return (
      <NavLink
        className={({ isActive }) =>
          `${
            isActive ? "text-indigo-400" : "text-zinc-400 hover:text-indigo-400"
          }`
        }
        to={to}
      >
        {children}
      </NavLink>
    );
  };
  return (
    <header className="bg-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <MyLink to="/">Inicio</MyLink>

        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <MyLink to="/opportunities">Oportunidades</MyLink>
              </li>

              <li>
                <MyLink to="/materials">Materiales</MyLink>
              </li>

              <li>
                <MyLink to="/settings">Configuraciones</MyLink>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <p className="text-pink-300">Hola, Katherin</p>
            <button className="rounded-full p-2 text-zinc-400 hover:text-indigo-400 cursor-pointer"
            onClick={toggleTheme}>
              {<LightIcon/>}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
