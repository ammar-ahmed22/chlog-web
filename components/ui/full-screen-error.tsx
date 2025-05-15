import { useRouter } from "next/navigation";
import { Button } from "./button";

export interface FullScreenErrorProps {
  message?: string;
}

export default function FullScreenError({
  message = "There was an error",
}: FullScreenErrorProps) {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold">Oops!</p>
          <p className="text-gray-500">{message}</p>
          <div className="flex items-center justify-center gap-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/")}>
              Go back
            </Button>
            <Button
              size="sm"
              onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
