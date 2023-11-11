import { usePrompt } from '../../hooks/usePrompt';

export default function HomePage() {
  usePrompt({
    isDirty: true,
  });

  return <div>HomePage</div>;
}
