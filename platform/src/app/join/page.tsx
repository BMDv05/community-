import type { Metadata } from "next";
import { JoinForm } from "@/components/JoinForm";

export const metadata: Metadata = { title: "Join Us" };

export default function JoinPage() {
  return <JoinForm eventPicker showKindToggle />;
}
