import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";

export const metadata: Metadata = { title: "Events" };

export default function Page() {
  return <CategoryPage type="event" titleEn="Events" titleAr="الفعاليات" descEn="Community gatherings, markets and celebrations." descAr="لقاءات وأسواق واحتفالات مجتمعية." />;
}
