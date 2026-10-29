import { Transform } from 'class-transformer';

export const TransformNumber = () =>
  Transform(({ key, obj }) => {
    const value = obj?.[key];

    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const numberValue = Number(value);

    return Number.isNaN(numberValue) ? value : numberValue;
  });