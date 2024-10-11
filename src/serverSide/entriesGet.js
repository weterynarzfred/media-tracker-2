import { getDB } from "@/serverSide/db";

export default function entriesGet(req, res) {
  const data = getDB();

  // TODO: sorting and filtering

  // if no id is provided, return a list of entries
  if (req.query.id?.[0] === undefined)
    res.status(200).json({ entries: data.entries });

  // otherwise return the requested entry if it exists
  else if (data.entries[req.query.id?.[0]] !== undefined)
    res.status(200).json({ entry: data.entries[req.query.id?.[0]] });

  else
    res.status(404).json({ message: 'entry not found' });
}
