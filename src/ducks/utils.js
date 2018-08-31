import { OrderedMap } from 'immutable';

export function fbToEntities(values, DataRecord) {
  return Object.entries(values).reduce(
    (acc, [uid, value]) => acc.set(uid, new DataRecord({ uid, ...value })),
    new OrderedMap({})
  );
}
