import { notFoundData } from "@/src/data/main/not-found-data";
import PageContentLoader from "@/src/components/PageContentLoader";

export default function NotFound() {
  return (
    <div id="not-found">
      <PageContentLoader contentData={notFoundData} />
    </div>
  );
}
