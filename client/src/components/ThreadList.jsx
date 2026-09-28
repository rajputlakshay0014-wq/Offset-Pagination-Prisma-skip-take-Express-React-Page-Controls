import { useState } from "react";
import {
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";

import { getThreads } from "../services/threads.service";
import ThreadItem from "./ThreadItem.jsx";

export default function ThreadList() {
  const [page, setPage] = useState(1);

  const {
    data,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["threads", { page }],
    queryFn: () => getThreads(page),
    placeholderData: keepPreviousData,
  });

  if (isPending) {
    return <p className="muted">Loading threads…</p>;
  }

  if (isError) {
    return (
      <p className="error">
        Could not load threads: {error.message}
      </p>
    );
  }

  const { threads, total, hasMore } = data;

  if (!threads || threads.length === 0) {
    return <p className="muted">No threads found.</p>;
  }

  const totalPages = Math.ceil(total / 10);

  return (
    <>
      <ul className="threads">
        {threads.map((thread) => (
          <ThreadItem
            key={thread.id}
            thread={thread}
          />
        ))}
      </ul>

      <div className="pager">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasMore}
        >
          Next
        </button>
      </div>
    </>
  );
}