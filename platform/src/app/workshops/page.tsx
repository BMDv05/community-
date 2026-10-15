import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";

export const metadata: Metadata = { title: "Workshops" };

export default function Page() {
  return <CategoryPage type="workshop" titleEn="Workshops" titleAr="ورش العمل" descEn="Hands-on sessions with skilled instructors." descAr="جلسات تطبيقية مع مدربين مهرة." />;
}
