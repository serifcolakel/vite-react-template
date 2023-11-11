/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import lazy, { type DefaultComponent } from '@loadable/component';

interface LoadFn<T> {
  (props: T): Promise<DefaultComponent<T>>;
}

export const loadable = <T extends unknown>(fn: LoadFn<T>) =>
  lazy(fn, { fallback: <div>Loading...</div> });
