import { Transform } from 'class-transformer';

export const TransformString = () =>
  Transform(({ key, obj }) => {
    const value = obj?.[key];

    return value?.toString();
  });
