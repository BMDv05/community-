import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";

export const metadata: Metadata = { title: "Field Trips" };

export default function Page() {
  return <CategoryPage type="field_trip" titleEn="Field Trips" titleAr="الرحلات الميدانية" descEn="Guided trips outside the venue." descAr="رحلات موجهة خارج المقر." />;
}
