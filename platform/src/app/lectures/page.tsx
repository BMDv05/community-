import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";

export const metadata: Metadata = { title: "Lectures" };

export default function Page() {
  return <CategoryPage type="lecture" titleEn="Lectures" titleAr="المحاضرات" descEn="Talks, ideas and heritage stories." descAr="محاضرات وأفكار وحكايات تراثية." />;
}
