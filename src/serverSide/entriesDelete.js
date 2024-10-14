import fs from 'fs';

import { getDB, saveDB } from "@/serverSide/db";
import FIELDS from "@/lib/fields";

function clearHintIfNotExists({ data, hintKey, hintValue, excludeEntryId }) {
  let doesStillExist = false;
  for (const testEntryId in data.entries) {
    if (parseInt(testEntryId) === excludeEntryId) continue;

    const testEntry = data.entries[testEntryId];
    if (testEntry[hintKey] === hintValue) {
      doesStillExist = true;
      break;
    }
  }

  if (!doesStillExist) {
    data.optionHints[hintKey].splice(data.optionHints[hintKey].indexOf(hintValue), 1);
  }
}

export default async function entriesDelete(req, res) {
  const data = getDB();

  if (req.query.id?.[0] === undefined)
    res.status(400).json({ message: 'method not supported' });
  else if (data.entries[req.query.id?.[0]] === undefined)
    res.status(404).json({ message: 'entry not found' });
  else {
    const deletedEntry = data.entries[req.query.id[0]];
    if (deletedEntry.cover !== undefined) {
      try {
        fs.unlinkSync(`./media/${deletedEntry.cover}`);
      } catch { }
    }

    for (const field of FIELDS.filter(e => e.type === 'hinted')) {
      const value = deletedEntry?.[field.name] ?? undefined;
      if (value === undefined) continue;
      clearHintIfNotExists({
        data,
        hintKey: field.name,
        hintValue: value,
        excludeEntryId: deletedEntry.id,
      });
    }

    delete data.entries[req.query.id];
    await saveDB();
    res.status(200).json({ message: 'entry deleted' });
  }
}

export { clearHintIfNotExists };
