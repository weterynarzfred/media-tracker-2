const FIELDS = [
  {
    name: 'name',
    type: 'text',
  },
  {
    name: 'type',
    type: 'hinted',
  },
  {
    name: 'creator',
    type: 'hinted',
  },
  {
    name: 'language',
    type: 'hinted',
  },
  {
    name: 'status',
    type: 'hinted',
  },
  {
    name: 'countSeen',
    type: 'text',
  },
  {
    name: 'countOut',
    type: 'text',
  },
  {
    name: 'notes',
    type: 'textarea',
  },
  {
    name: 'score',
    type: 'score',
    parse: parseFloat,
  },
];

export default FIELDS;
