import { TimeoutExceptionInterceptor } from './timeout-exception.interceptor';

describe('TimeoutExceptionInterceptor', () => {
  it('should be defined', () => {
    expect(new TimeoutExceptionInterceptor()).toBeDefined();
  });
});
