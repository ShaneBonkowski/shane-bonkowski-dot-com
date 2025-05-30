import PageContentLoader from "@/src/components/PageContentLoader";
import { ContentDataProps } from "@/src/types/data-props";

const notFoundData: ContentDataProps[] = [
  {
    type: "h1",
    text: "404 - Page Not Found",
  },
  {
    type: "paragraph",
    text: "Sorry, the page you are looking for does not exist.",
  },
];

export default function NotFound() {
  return <PageContentLoader contentData={notFoundData} id="not-found" />;
}
