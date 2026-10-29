import { Transform } from 'class-transformer';

const optionalBooleanMapper = new Map([
  ['undefined', undefined],
  ['true', true],
  ['false', false],
]);

export const TransformBoolean = () =>
  Transform(({ key, obj }) => {
    return optionalBooleanMapper.get(obj?.[key]);
  });
