import { msToMinutesAndSeconds } from "../utils";

type TableProps = {
  page: number;
  queue: any[];
};
const Table = ({ page, queue }: TableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl  p-5">
      <table className="table table-zebra table-xs">
        <thead className="text-white">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Artist</th>
            <th>Album</th>
            <th className="flex items-center justify-center gap-1">
              Duration <img src="/clock.svg" className="w-4" />
            </th>
            <th>Actions</th>
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
                  <td>{index + 1}</td>
                  <td>
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
                  <td>
                    <button className="btn bg-[#212358] hover:bg-[#292780] rounded-full text-white btn-sm text-xs">
                      {" "}
                      <img src="/chevron-up.svg" className="w-5" />{" "}
                    </button>
                  </td>
                  <td>
                    <button className="btn bg-[#212358] hover:bg-[#292780] rounded-full text-white btn-sm text-xs">
                      {" "}
                      <img src="/chevron-down.svg" className="w-5" />{" "}
                    </button>
                  </td>
                  <td>
                    <button className="btn bg-[#212358] hover:bg-[#292780] rounded-full text-white btn-sm text-xs">
                      {" "}
                      <img src="/chevron-double-up.svg" className="w-5" />{" "}
                    </button>
                  </td>
                  <td>
                    <button className="btn bg-[#212358] hover:bg-[#292780] rounded-full text-white btn-sm text-xs">
                      {" "}
                      <img
                        src="/chevron-double-down.svg"
                        className="w-5"
                      />{" "}
                    </button>
                  </td>
                  <td>
                    <button className="btn bg-[#750006] hover:bg-[#96050c] rounded-full text-white btn-sm text-xs">
                      {" "}
                      <img src="/trash.svg" className="w-5" />{" "}
                    </button>
                  </td>
                </tr>
              </tbody>
            );
          })}
      </table>
    </div>
  );
};

export default Table;
