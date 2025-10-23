import { useEffect, useState } from "react";
import { APIHelloSchema } from "@shared/schema";
import "./App.css";

function App() {
  const [helloData, setHelloData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHello = async (signal?: AbortSignal) => {
    try {
      const response = await fetch("/api/hello", { signal });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const parsed = APIHelloSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error("Invalid API response shape");
      }
      setHelloData(parsed.data.message);
    } catch (err) {
      // Ignore abort errors
      const maybeName = (err as Error & { name?: string }).name;
      if (maybeName === "AbortError") return;
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchHello(ac.signal);
    return () => ac.abort();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Hello, Scaffold!
          </h1>
          <p className="text-gray-600">
            Tailwind CSS is integrated and ready for Phase 0.
          </p>
          {helloData === null
            ? <p className="text-blue-600 mt-4">Loading...</p>
            : error
            ? <p className="text-red-600 mt-4">Error: {error}</p>
            : <p className="text-green-600 mt-4">{helloData}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
