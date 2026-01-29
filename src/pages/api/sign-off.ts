import { promises as fs } from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

async function readDb() {
  const fileContent = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(fileContent);
}

async function writeDb(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await readDb();
    res.status(200).json(db);
  } else if (req.method === "POST") {
    const db = await readDb();
    db.isSignedOff = true;
    await writeDb(db);
    res.status(200).json({ message: "Signed off successfully" });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
