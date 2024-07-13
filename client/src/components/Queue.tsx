import { SongType } from "../types";
import { msToMinutesAndSeconds } from "../utils";

type TableProps = {
  queue: SongType[];
  fetchingQueue: boolean;
  page: number;
};
const Queue = ({ queue, fetchingQueue, page }: TableProps) => {
  if (fetchingQueue) {
    return <div>Loading...</div>;
  }

  const columns = ["#", "Title", "Artist", "Album"];
  return (
    <div>
      <div className=" rounded-xl  p-5">
        <table className="table table-zebra table-xs overflow-auto">
          <thead className="text-current">
            <tr>
              {columns.map((c) => (
                <th>{c}</th>
              ))}
              <th className="flex items-center justify-center gap-1">
                Duration <img src="/clock.svg" className="w-4" />
              </th>
            </tr>
          </thead>
          {queue && !queue.length && (
            <tbody>
              <tr>
                <td colSpan={6} className="text-center">
                  No songs in queue
                </td>
              </tr>
            </tbody>
          )}
          {queue &&
            queue.length &&
            queue.map((song, index) => {
              const duration = msToMinutesAndSeconds(song.duration_ms);
              return (
                <tbody>
                  <tr>
                    <td>{page * 10 + index + 1}</td>
                    <td className="p-2">
                      <a href={song.external_urls.spotify} target="_blank">
                        {song.name}
                      </a>
                    </td>
                    <td>
                      <a
                        href={song.artists[0].external_urls.spotify}
                        target="_blank"
                      >
                        {song.artists[0].name}
                      </a>
                    </td>
                    <td>
                      <a href={song.album.external_urls.spotify}>
                        {song.album.name}
                      </a>
                    </td>
                    <td>
                      {duration.minutes}m {duration.seconds}s
                    </td>
                  </tr>
                </tbody>
              );
            })}
        </table>
      </div>
    </div>
  );
};

{
  /* <td>
                      <button className="btn bg-[#212358] hover:bg-[#292780] rounded-full text-white btn-sm text-xs">
                        <ChevronUp />
                      </button>
                    </td>
                    <td>
                      <button className="btn bg-[#212358] hover:bg-[#292780] rounded-full text-white btn-sm text-xs">
                        <ChevronDown />
                      </button>
                    </td>
                    <td>
                      <button className="btn bg-[#212358] hover:bg-[#292780] rounded-full text-white btn-sm text-xs">
                        <ChevronsUp />
                      </button>
                    </td>
                    <td>
                      <button className="btn bg-[#212358] hover:bg-[#292780] rounded-full text-white btn-sm text-xs">
                        <ChevronsDown />
                      </button>
                    </td>
                    <td>
                      <button className="btn bg-[#750006] hover:bg-[#96050c] rounded-full text-white btn-sm text-xs">
                        <Trash2 />
                      </button>
                    </td> */
}

export default Queue;
