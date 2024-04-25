import createLogFormat from './create-log-format';

describe('GIVEN createLogFormat', () => {
  it('WHEN info THEN return correct string', () => {
    const info = { timestamp: '23929292', level: 'info', message: 'test' };
    expect(createLogFormat(info)).toBe(
      `${info.timestamp} ${info.level}: ${info.message}`,
    );
  });
});
