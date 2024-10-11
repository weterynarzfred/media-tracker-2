import formidable from 'formidable';
import { isEmpty } from "lodash";

import { getDB, saveDB } from "@/serverSide/db";
import saveImage from "@/serverSide/saveImage";
import handlers from "@/serverSide/handlers/handlersIndex";

const HINTED_FIELDS = [
  'type',
  'creator',
  'language',
  'status',
];

/**
 *  get fields and files from the form
 */
async function parseForm(req) {
  const form = formidable({ filter: part => part.originalFilename !== '' });
  return { fields, files } = await form.parse(req);
}

/**
 * create new entry object with updated fields
 */
async function makeEntry({ req, data, didExist }) {
  const form = parseForm(req);

  const entry = {
    id: didExist ? parseInt(req.query.id?.[0]) : data.nextEntryId++,
    cover: isEmpty(form.fields.cover?.[0]) ? null : form.fields.cover[0],
    handlerKeys: isEmpty(handlers[form.fields.handlerKeys?.[0]]) ? null : form.fields.handlerKeys,
    name: isEmpty(form.fields.name?.[0]) ? null : form.fields.name[0],
    score: isEmpty(form.fields.score?.[0]) ? null : parseFloat(form.fields.score[0]),
    counts: {
      seen: isEmpty(form.fields.countSeen?.[0]) ? null : form.fields.countSeen[0],
      out: isEmpty(form.fields.countOut?.[0]) ? null : form.fields.countOut[0],
    },
  };

  for (const fieldName of HINTED_FIELDS) {
    if (isEmpty(form.fields[fieldName]?.[0])) continue;
    entry[fieldName] = form.fields[fieldName][0];
  }

  // replace or add cover if a new file was sent
  if (!isEmpty(form.files.cover?.[0])) {
    await saveImage(form.files.cover[0].filepath, `./media/${entry.id}.jpg`);
    entry.cover = `${entry.id}.jpg`;
  }

  return entry;
}

async function updateData(data, entry) {
  for (const fieldName of HINTED_FIELDS) {
    if (isEmpty(entry[fieldName])) continue;

    // add new hints to the db
    if (data.optionHints[fieldName] === undefined)
      data.optionHints[fieldName] = [];
    if (!data.optionHints[fieldName].includes(entry[fieldName]))
      data.optionHints[fieldName].push(entry[fieldName]);
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
