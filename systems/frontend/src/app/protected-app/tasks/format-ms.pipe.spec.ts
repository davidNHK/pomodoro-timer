import { FormatMsPipe } from './format-ms.pipe';

describe('FormatMsPipe', () => {
  it('format 60000 to 1:00', () => {
    const pipe = new FormatMsPipe();
    expect(pipe.transform(60000)).toEqual('01:00');
  });

  it('format 64500 to 1:04', () => {
    const pipe = new FormatMsPipe();
    expect(pipe.transform(64500)).toEqual('01:04');
  });

  it('format 4500 to 0:04', () => {
    const pipe = new FormatMsPipe();
    expect(pipe.transform(4500)).toEqual('00:04');
  });
});
