import { Loader } from "lucide-react";

export default function FullScreenLoading() {
  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="flex min-h-screen items-center justify-center py-12">
        <Loader className="animate-spin size-8" />
      </div>
    </div>
  );
}
