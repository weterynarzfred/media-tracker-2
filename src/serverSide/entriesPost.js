import formidable from 'formidable';
import { isEmpty } from "lodash";

import { getDB, saveDB } from "@/serverSide/db";
import saveImage from "@/serverSide/saveImage";
import handlers from "@/serverSide/handlers/handlersIndex";
import FIELDS from "@/lib/fields";

/**
 *  get fields and files from the form
 */
async function parseForm(req) {
  const form = formidable({ filter: part => part.originalFilename !== '' });
  const [fields, files] = await form.parse(req);
  return { fields, files };
}

/**
 * create new entry object with updated fields
 */
async function makeEntry({ req, data, didExist }) {
  const form = await parseForm(req);

  const entry = {
    id: didExist ? parseInt(req.query.id?.[0]) : data.nextEntryId++,
    cover: isEmpty(form.fields.cover?.[0]) ? null : form.fields.cover[0],
    handlerKeys: isEmpty(handlers[form.fields.handlerKeys?.[0]]) ? null : form.fields.handlerKeys,
  };

  for (const field of FIELDS) {
    if (isEmpty(form.fields[field.name]?.[0])) {
      entry[field.name] = null;
      continue;
    }

    entry[field.name] = form.fields[field.name][0];
    if (typeof field.parse === 'function')
      entry[field.name] = field.parse(entry[field.name]);
  }

  // replace or add cover if a new file was sent
  if (!isEmpty(form.files.cover?.[0])) {
    await saveImage(form.files.cover[0].filepath, `./media/${entry.id}.jpg`);
    entry.cover = `${entry.id}.jpg`;
  }

  return entry;
}

async function updateData(data, entry) {
  for (const field of FIELDS.filter(e => e.type === 'hinted')) {
    const prevValue = data.entries[entry.id]?.[field.name] ?? undefined;
    const currentValue = entry[field.name] ?? undefined;
    if (prevValue === currentValue) continue;

    // if the value was defined and now is different check if the old value
    // still exists elsewhere, delte it from hints if not
    if (prevValue !== undefined) {
      let doesStillExist = false;
      for (const testEntryId in data.entries) {
        if (parseInt(testEntryId) === entry.id) continue;

        const testEntry = data.entries[testEntryId];
        if (testEntry[field.name] === prevValue) {
          doesStillExist = true;
          break;
        }
      }

      if (!doesStillExist) {
        data.optionHints[field.name].splice(data.optionHints[field.name].indexOf(prevValue), 1);
      }
    }

    if (currentValue !== undefined) {
      if (data.optionHints[field.name] === undefined)
        data.optionHints[field.name] = [];
      if (!data.optionHints[field.name].includes(currentValue))
        data.optionHints[field.name].push(currentValue);
    }
  }

  data.entries[entry.id] = entry;
  await saveDB();
}

export default async function entriesPost(req, res) {
  const data = getDB();

  try {
    // check if the entry already existed in the db
    const didExist = data.entries[req.query.id?.[0]] !== undefined;

    const entry = await makeEntry({ req, data, didExist });
    await updateData(data, entry);

    res.status(didExist ? 200 : 201).json({
      entry: {
        ...entry,
        // add a random value to the path to force the ui to reload the image
        cover: entry.cover === null ? null : entry.cover + `?rand=${Math.random()}`
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'error parsing form data' });
  }
}
