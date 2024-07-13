import { useEffect, useState } from "react";
import { getCommands } from "../api";
import Navbar from "../components/Navbar";

type CommandType = {
  id: string;
  description: string;
  code: string;
  created_at: string;
};
const Commands = () => {
  const [commands, setCommands] = useState<CommandType[]>([]);
  useEffect(() => {
    const fetchCommands = async () => {
      const data = await getCommands();
      setCommands(data.commands);
    };
    fetchCommands();
  }, []);
  return (
    <div>
      <Navbar />
      <section className="flex items-center justify-center gap-5 flex-col">
        <p className="text-2xl">Commands</p>
        <ul>
          {commands.length > 0 &&
            commands.map((c, idx) => {
              return (
                <li key={idx} className="flex gap-2">
                  <span>!{c.code}</span>
                  <span>{c.description}</span>
                </li>
              );
            })}
        </ul>
      </section>
    </div>
  );
};

export default Commands;
