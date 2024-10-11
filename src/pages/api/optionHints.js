import { getDB } from "@/serverSide/db";
import handlers from "@/serverSide/handlers/handlersIndex";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const data = getDB();

    res.status(200).json({
      ...data.optionHints,
      handlers: Object.keys(handlers),
    });
  } else {
    res.status(400).json({ message: 'method not supported' });
  }
}
