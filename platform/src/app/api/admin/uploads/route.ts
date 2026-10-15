import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { isAdmin } from "@/lib/admin-auth";
import { validateImageUpload } from "@/lib/uploads";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided." }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const checked = validateImageUpload(buf, file.type);
  if (!checked.ok) return NextResponse.json({ error: checked.error }, { status: 422 });

  const name = `${Date.now().toString(36)}_${crypto.randomBytes(6).toString("hex")}.${checked.ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), buf);
  return NextResponse.json({ ok: true, url: `/uploads/${name}` }, { status: 201 });
}
