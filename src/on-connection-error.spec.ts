import onConnectionError from './on-connection-error';

describe('GIVEN onConnectionError', () => {
  it('WHEN gets error THEN logs error to console', () => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    onConnectionError(new Error('error'));
    expect(console.log).toHaveBeenCalled();
  });
});
