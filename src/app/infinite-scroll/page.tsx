import { InfiniteScrollList } from "@/components/atoms/InfiniteScrollList";

export default function InfiniteScrollPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4 p-4">Infinite Scroll Demo</h1>
      <InfiniteScrollList />
    </div>
  );
}
